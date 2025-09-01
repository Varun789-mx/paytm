import express from "express";
import db from "@repo/db/client";
const app = express()
const port = 5000;
app.use(express.json());

app.post('/hdfcwebhook', async (req, res) => {
	const paymentinformation = {
		token: req.body.token,
		userId: req.body.user_identifier,
		amount: req.body.amount
	}

	if (!paymentinformation.amount || !paymentinformation.token || !paymentinformation.userId) {
		return res.status(400).json({
			message: "Incomplete fields"
		})
	}

	try {
		const result = await db.$transaction(async (tx) => {
			const existingtransaction = await tx.onRampTransaction.findFirst({
				where: {
					token: paymentinformation.token,
					status: "Success",
				}
			})

			if (existingtransaction) {
				throw new Error("Transaction already exists");

			}
			const userbalance = await tx.balance.updateMany({
				where: {
					userId: Number(paymentinformation.userId),
				},
				data: {
					amount: {
						increment: Number(paymentinformation.amount)
					}
				}
			})
			const transactionupdate = await tx.onRampTransaction.updateMany({
				where: {
					token: paymentinformation.token,
					status: { not: "Success" }
				},
				data: {
					status: "Success"
				}
			});
			if (userbalance.count === 0) {
				throw new Error("Failed to update the user's balance" + userbalance)
			}
			if (transactionupdate.count === 0) {
				throw new Error("Failed to update the transaction it may already exists ")
			}
			return {
				userbalance: userbalance.count,
				transactionupdate: transactionupdate.count
			};
		});
		console.log("Transaction success", result);

		return res.json({
			message: "Captured"
		})
	} catch (e) {
		console.error(e);
		res.status(411).json({
			Message: "Error" + e
		})
	}
});

app.listen(port, () => {
	console.log(`Your webhook is currently listening on http://localhost:${port}/hdfcwebhook`)
})
