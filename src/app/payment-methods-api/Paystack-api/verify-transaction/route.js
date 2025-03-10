import { NextResponse } from "next/server";
import axios from "axios";
import { getSiteSettings } from "@/app/lib/getSiteSettings";

export async function POST(req) {
    try {
        const { reference } = await req.json();

        if (!reference) {
            return NextResponse.json({ success: false, message: "Transaction reference is required" }, { status: 400 });
        }

        // ✅ Fetch site settings dynamically (server-side)
        const settings = await getSiteSettings();
        if (!settings || !settings.paystack_secret_key) {
            return NextResponse.json({ success: false, message: "Paystack secret key not found in settings" }, { status: 500 });
        }

        const secretKey = settings.paystack_secret_key; // ✅ Use dynamically fetched key

        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: { Authorization: `Bearer ${secretKey}` },
        });

        const transactionData = response.data.data;

        if (transactionData.status === "success") {
            return NextResponse.json({
                success: true,
                data: {
                    reference: transactionData.reference,
                    amount: transactionData.amount / 100, // Convert back from kobo/cents
                    currency: transactionData.currency,
                    transaction_date: transactionData.transaction_date,
                    customer: {
                        email: transactionData.customer.email
                    }
                }
            });
        } else {
            return NextResponse.json({
                success: false,
                message: `Payment verification failed. Status: ${transactionData.status}`
            });
        }
    } catch (error) {
        console.error("Verification error:", error.response?.data || error.message);
        return NextResponse.json({
            success: false,
            message: error.response?.data?.message || "Server error during verification"
        }, { status: error.response?.status || 500 });
    }
}
