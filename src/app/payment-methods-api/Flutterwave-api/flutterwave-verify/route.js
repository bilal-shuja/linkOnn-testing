import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
    try {
        const { transaction_id } = await req.json();
        const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

        if (!transaction_id) {
            return NextResponse.json({ success: false, message: "Transaction ID is required" }, { status: 400 });
        }

        const response = await axios.get(
            `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
            {
                headers: { Authorization: `Bearer ${secretKey}` },
            }
        );

        const transactionData = response.data.data;

        if (transactionData.status === "successful") {
            return NextResponse.json({
                success: true,
                data: {
                    transaction_id: transactionData.id,
                    amount: transactionData.amount,
                    currency: transactionData.currency,
                    customer: { email: transactionData.customer.email },
                },
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "Payment verification failed.",
            });
        }
    } catch (error) {
        console.error("Verification error:", error.response?.data || error.message);
        return NextResponse.json({
            success: false,
            message: error.response?.data?.message || "Server error during verification",
        });
    }
}
