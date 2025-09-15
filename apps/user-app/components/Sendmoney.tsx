"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { use, useState } from "react"
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";
import toast, { Toaster } from "react-hot-toast";



export function Sendmoney() {

    const [phone, setPhone] = useState("");
    const [amount, setamount] = useState("");
    const [loading, setloading] = useState(false);


    const TransferMoney = async () => {
        try {
            setloading(true);
            const transferStatus = await p2pTransfer(phone, Number(amount))
            console.log(transferStatus);
            if (!transferStatus) {
                console.log(transferStatus)
                toast.error("From transfer status")
                return;
            }
            setloading(false);
            switch (transferStatus?.message) {
                case "Success":
                    toast.success("Payment Success")

                    break;
                case "Insufficent funds please add money":
                    toast.error("Insufficent funds please add money")
                    break;
                case "User not found":
                    toast.error("User not found")
                    break;
                case "Error while Transfer":
                default:
                    toast.error("Something went wrong,Please try again.")
                    break;

            }

        }
        catch (error) {
            console.log("Error", error);
            toast.error("Network error")
        }
    }
    const formValidataion = () => {
        if (Number(amount) < 0 || amount === "") {
            toast.error("Amount should be greater than zero")
            return;
        }
        if (phone === "") {
            toast.error("Please enter a valid Phone number")
            return;
        }
        else {
            TransferMoney();
        }
    }

    return <div className="[h-90vh]">
        <Center>
            <div><Toaster /></div>
            <Card title="Send">
                <div className="min-w-72 pt-2">
                    <TextInput placeholder={"Number"} label="Number" onChange={(value) => { setPhone(value) }} />
                    <TextInput placeholder={"Amount"} label="Amount" onChange={(value) => { setamount(value) }} />
                    <div className="pt-4 flex justify-center">
                        <Button onClick={formValidataion} disabled={loading ? true : false} loading={loading} >Send</Button>
                    </div>
                </div>
            </Card>
        </Center>
    </div>
}