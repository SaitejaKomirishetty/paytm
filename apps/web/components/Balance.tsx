'use client';
import { useBalance } from "@repo/store"   
const Balance = () => {
    const balance = useBalance();
    return <div>Balance: {balance}</div>;
};

export default Balance;
