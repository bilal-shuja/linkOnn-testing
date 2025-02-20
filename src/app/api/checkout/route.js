import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { amount } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }


        const baseUrl = "http://localhost:3000";

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: { name: "Wallet Deposit" },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            success_url: `${baseUrl}/pages/Wallet/success?session_id={CHECKOUT_SESSION_ID}`,

            cancel_url: `${baseUrl}/pages/Wallet/deposit-amount`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// process.env.NEXT_PUBLIC_BASE_URL || 