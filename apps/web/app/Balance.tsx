import { useBalance } from "@repo/store/useBalance"
export default function () {
    const balance = useBalance();
    return <div>
        Hi there {balance}
    </div>
}