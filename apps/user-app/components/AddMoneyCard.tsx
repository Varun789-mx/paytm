"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import prisma from "@repo/db/client";
import { createOnrampTransaction } from "../app/lib/actions/CreateOnrampTransaction";

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: ""
}, {
    name: "Axis Bank",
    redirectUrl: ""
}];

export const AddMoney = () => {
    const [amount, setamount] = useState("");
    const [provider, setprovider] = useState("");
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    return <Card title="Add Money">
        <div className="w-full">
            <TextInput label={"Amount"} placeholder={"Amount"} onChange={(e) => {
                setamount(e);
                console.log(e);
            }} />
            <div className="py-4 text-left">
                Bank
            </div>
            <Select onSelect={(value) => {
                setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl || "");
                setprovider(SUPPORTED_BANKS.find(x => x.name === value)?.name || "")
            }} options={SUPPORTED_BANKS.map(x => ({
                key: x.name,
                value: x.name
            }))} />
            <div className="flex justify-center pt-4">
                <Button onClick={async () => {
                    await createOnrampTransaction(provider, amount)
                    window.location.href = redirectUrl || "";
                }}>
                    Add Money
                </Button>
            </div>
        </div>
    </Card>
}