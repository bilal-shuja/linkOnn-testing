import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSiteSettings } from "@/app/lib/getSiteSettings";

export async function POST(req) {
    try {
        const { amount } = await req.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        const settings = await getSiteSettings();
        if (!settings || !settings.stripe_secret_key) {
            return NextResponse.json({ error: "Stripe secret key not found in settings" }, { status: 500 });
        }

        const stripe = new Stripe(settings.stripe_secret_key);

        const baseUrl = process.env.NEXT_PUBLIC_URL;

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
            success_url: `${baseUrl}/pages/Wallet/success/Stripe-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/pages/Wallet/deposit-amount`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
