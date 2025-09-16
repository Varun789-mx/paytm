import { Card } from "@repo/ui/card"

export const Transfers = ({
    transactions
}: {
    transactions: {
        id: number,
        toUserId: number;
        amount: string;
        timestamp: Date;

    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <div>
        <p className="font-bold text-3xl">Statement</p>
        <div className="pt-2 w-full max-h-screen overflow-y-auto mx-auto">
            {transactions.map(t => <div key={t.id} className="w-full p-2 flex justify-around">
                <div className="flex flex-col">
                    <div className="text-sm">
                        Received INR
                    </div>

                    <div className="text-slate-600 text-xs">
                        {t.timestamp?.toDateString()}
                    </div>
                </div>
                <div className="flex flex-col justify-center text-red-900">
                    - Rs {Number(t.amount) / 100}
                </div>

            </div>)}
        </div>
    </div>
}