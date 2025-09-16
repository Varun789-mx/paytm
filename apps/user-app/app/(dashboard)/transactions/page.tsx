"use server"
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { Transfers } from "../../../components/Transactions";
async function GetTransferdata() {
    const session = await getServerSession(authOptions);
    try {
        const GetTransaction = await prisma.p2ptransaction.findMany({
            where: {
                fromUserId: Number(session.user.id)
            }
        });
        return GetTransaction.map(tx => ({
            id: tx.id,
            toUserId: tx.toUserId,
            amount: tx.amount,
            timestamp: tx.timestamp
        }))
    } catch (e) {
        console.log("Error" + e);
        return [];
    }
}
export default async function () {
    const Transactiondata = await GetTransferdata();
    return <div className="w-full">
        <Transfers transactions={Transactiondata} />
    </div>
}