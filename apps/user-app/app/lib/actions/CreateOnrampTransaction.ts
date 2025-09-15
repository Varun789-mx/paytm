"use server"
import prisma from "@repo/db/client"
import { authOptions } from "../auth"
import { getServerSession } from "next-auth"



export async function createOnrampTransaction(provider: any, amount: string) {
    const Session = await getServerSession(authOptions);
    console.log(Session);
    if (!Session?.user || !Session.user?.id) {
        return {
            message: "Unauthorized user"
        }
    }
    const token = (Math.random() * 1000).toString();
    await prisma.onRampTransaction.create({
        data: {
            provider: provider,
            status: "Processing",
            startTime: new Date(),
            token: token,
            userId: Number(Session.user?.id),
            amount: Number(amount) * 100
        }
    });
    return {
        msg: "Done"
    }
} 