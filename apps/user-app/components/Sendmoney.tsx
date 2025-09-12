"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { use, useState } from "react"
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";



export function Sendmoney() {
    const [phone, setPhone] = useState("");
    const [amount, setamount] = useState("");

    return <div className="[h-90vh]">
        <Center>
            <Card title="Send">
                <div className="min-w-72 pt-2">
                    <TextInput placeholder={"Number"} label="Number" onChange={(value) => { setPhone(value) }} />
                    <TextInput placeholder={"Amount"} label="Amount" onChange={(value) => { setamount(value) }} />
                    <div className="pt-4 flex justify-center">
                        <Button onClick={async () => {
                            await p2pTransfer(phone, Number(amount))
                        }
                        }>Send</Button>
                    </div>
                </div>
            </Card>
        </Center>
    </div>
}