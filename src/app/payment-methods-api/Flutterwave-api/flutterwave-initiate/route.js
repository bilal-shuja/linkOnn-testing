import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
    try {
        const { email, amount } = await req.json();
        const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

        if (!email || !amount) {
            return NextResponse.json({ error: "Email and amount are required" }, { status: 400 });
        }

        const response = await axios.post(
            "https://api.flutterwave.com/v3/payments",
            {
                tx_ref: `tx_${Date.now()}`,
                amount: amount,
                currency: "USD",
                redirect_url: `http://localhost:3000/pages/Wallet/success/flutterwave-success`,
                // redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`,
                customer: { email },
                customizations: {
                    title: "Wallet Deposit",
                    description: "Deposit funds to wallet",
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${secretKey}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Flutterwave initialization error:", error.response?.data || error.message);
        return NextResponse.json(
            { error: error.response?.data?.message || "Failed to initialize payment" },
            { status: error.response?.status || 500 }
        );
    }
}
