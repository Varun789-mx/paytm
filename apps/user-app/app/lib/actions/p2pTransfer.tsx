"use server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/db/client";



export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;
    try {
        if (!from) {
            throw new Error("Error while Transfer")
        }
        const toUser = await prisma.user.findFirst({
            where: {
                number: to
            }
        });
        if (!toUser) {
            throw new Error("User not found")
            
        }
        if (toUser && from) {
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
                        userId: Number(toUser.id)
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
            return {
                message: "Success"
            }
        }
        else {
            return {
                message: "Error while transfer"
            }
        }

    } catch (error: any) {
        if (error.message === "Insufficent balance") {
            return {
                message: "Insufficent funds please add money"
            }
        }
        if (error.message === "User not found") {
            return {
                message: "User not found"
            }
        }
        if (error.message === "Error while Transfer") {
            return {
                message: "Error while Transfer"
            }
        }
        return {
            message: error.message
        }

    }
}

