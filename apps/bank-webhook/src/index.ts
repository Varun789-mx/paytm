import express from "express";
import db from "@repo/db/client";
const app = express();
import { z } from "zod";
import e from "express";



const transactionschema = z.object({
    token: z.string().min(1),
    userId: z.number(),
    amount: z.string(),
})
app.use(express.json())
const port = 5000;

app.post("/hdfcWebhook", async (req, res) => {

    //TODO: Add zod validation here?
    //TODO: HDFC bank should ideally send us a secret so we know this is sent by them
    const paymentInformation: {
        token: string;
        userId: number;
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };
    const reqdata = transactionschema.safeParse(paymentInformation);
    if (!reqdata.success) {
        return res.status(411).json({
            msg: "Invalid inputs" + reqdata.error,
        })
    }
    try {
        const result = await db.$transaction(async (tx) => {
            const existingtransaction = await tx.onRampTransaction.findFirst({
                where: {
                    token: paymentInformation.token,
                    status: "Success",
                }
            });
            if (existingtransaction) {
                throw new Error("DUPLICATE_TRANSACTION");
            }
            const userBalance = await tx.balance.findFirst({
                where: {
                    userId: Number(paymentInformation.userId),
                }
            });
            if (!userBalance) {
                throw new Error("User balance doesn't found ");

            }

            const BalanceUpdate = await tx.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId),
                },
                data: {
                    amount: {
                        increment: Number(paymentInformation.amount),
                    }
                }
            });
            if (!BalanceUpdate) {
                throw new Error("Failed in Balance Update from here ")
            }
            const statusUpdate = await tx.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token,
                    status: { not: "Success" }
                },
                data: {
                    status: "Success"
                }
            })
            if (!statusUpdate) {
                throw new Error("Failed to update status balance")
            }
            return {
                BalanceUpdated: BalanceUpdate.count,
                StatusUpdate: statusUpdate.count,
            };
        });
        console.log("Transacton proccessed successufullly", result);
        res.json({
            message: "Captured"
        })
    } catch (error: any) {
        // Handle specific error cases
        console.log(error.message)
        switch (error.message) {
            case "DUPLICATE_TRANSACTION":
                return res.status(200).json({
                    message: "Transaction already processed"
                });

            case "Failed to update user balance":
                return res.status(500).json({
                    message: "Failed to update balance"
                });
            case "User balance doesn't found":
                return res.status(500).json({
                    message: "User balance doesn't found",
                })
            case "Failed in Balance Update from here ":
                return res.status(500).json({
                    message: "Failed in Balance Update from here"
                })

            default:
                return res.status(500).json({
                    message: "Internal server error",
                    Error: error.message
                });
        }
    }
});

app.listen(port, () => {
    console.log(`Your Bank webhook is runnning on http://localhost:${port}/hdfcWebhook`)

});
