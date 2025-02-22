
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
    try {
        const { email, amount } = await req.json();
        const secretKey = process.env.PAYSTACK_SECRET_KEY;

        if (!email || !amount) {
            return NextResponse.json({ error: "Email and amount are required" }, { status: 400 });
        }

        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email: email,
                amount: amount * 100, // Convert to kobo/cents
                currency: "ZAR", // South African Rand
                callback_url: `http://localhost:3000/pages/Wallet/success/paystack-success`, // Make sure this matches your route
                metadata: {
                    custom_fields: [
                        {
                            display_name: "Payment For",
                            variable_name: "payment_for",
                            value: "Wallet Deposit"
                        }
                    ]
                }
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
        console.error("Paystack initialization error:", error.response?.data || error.message);
        return NextResponse.json(
            { error: error.response?.data?.message || "Failed to initialize payment" },
            { status: error.response?.status || 500 }
        );
    }
}