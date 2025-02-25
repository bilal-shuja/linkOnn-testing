import { NextResponse } from "next/server";
import axios from "axios";
import { getSiteSettings } from "@/app/lib/getSiteSettings";

export async function POST(req) {
    try {
        const { email, amount } = await req.json();

        if (!email || !amount) {
            return NextResponse.json({ error: "Email and amount are required" }, { status: 400 });
        }

        // ✅ Fetch site settings dynamically (server-side)
        const settings = await getSiteSettings();
        if (!settings || !settings.paystack_secret_key) {
            return NextResponse.json({ error: "Paystack secret key not found in settings" }, { status: 500 });
        }

        const secretKey = settings.paystack_secret_key; // ✅ Use dynamically fetched key

        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email: email,
                amount: amount * 100, // Convert to kobo/cents
                currency: "ZAR", // South African Rand
                callback_url: `http://localhost:3000/pages/Wallet/success/paystack-success`,
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
