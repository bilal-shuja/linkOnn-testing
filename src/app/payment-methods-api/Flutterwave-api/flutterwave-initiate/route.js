import { NextResponse } from "next/server";
import axios from "axios";
import { getSiteSettings } from "@/app/lib/getSiteSettings";

export async function POST(req) {
    try {
        const { email, amount } = await req.json();

        if (!email || !amount) {
            return NextResponse.json({ error: "Email and amount are required" }, { status: 400 });
        }

        const settings = await getSiteSettings();
        if (!settings || !settings.flutterwave_secret_key) {
            return NextResponse.json({ error: "Flutterwave secret key not found in settings" }, { status: 500 });
        }

        const secretKey = settings.flutterwave_secret_key;

        const response = await axios.post(
            "https://api.flutterwave.com/v3/payments",
            {
                tx_ref: `tx_${Date.now()}`,
                amount: amount,
                currency: "USD",
                redirect_url: `http://localhost:3000/pages/Wallet/success/flutterwave-success`,
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
