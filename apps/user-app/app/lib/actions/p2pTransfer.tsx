"use server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/db/client";



export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;
    if (!from) {
        return {
            message: "Error while sending"
        }
    }
    const touser = await prisma.user.findFirst({
        where: {
            number: to
        }
    });
    if (!touser) {
        return {
            message: "User not found",
        }
    }
    try {
        const Transfer = await prisma.$transaction(async (tx) => {
            const frombalance = await tx.balance.findUnique({
                where: {
                    userId: Number(from)
                }
            });
            if (!frombalance || frombalance.amount < amount) {
                throw new Error("Insufficent balance");
            }
            await tx.balance.update({
                where: { userId: Number(from) },
                data: {
                    amount: {
                        decrement: amount
                    }
                }
            })
            await tx.balance.update({
                where: {
                    userId: Number(touser.id)
                },
                data: {
                    amount: {
                        increment: amount
                    }
                }
            })
            return {
                message: "Success"
            }
        })
        if (!Transfer) {
            return {
                message: "Error while transfer"
            }
        }

    } catch (error: any) {
        if (error.message === "Insufficent balance") {
            return {
                Message: "Insufficent funds please add money"
            }
        }
        return { 
            message :error.message
        }

    }
}

