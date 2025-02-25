import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSiteSettings } from "@/app/lib/getSiteSettings";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
            return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
        }

        const settings = await getSiteSettings();
        if (!settings || !settings.stripe_secret_key) {
            return NextResponse.json({ error: "Stripe secret key not found in settings" }, { status: 500 });
        }

        const stripe = new Stripe(settings.stripe_secret_key);

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const paymentIntentId = session.payment_intent;

        if (!paymentIntentId) {
            return NextResponse.json({ error: "Payment intent not found" }, { status: 404 });
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        const chargeId = paymentIntent.latest_charge;

        return NextResponse.json({
            success: true,
            paymentIntentId: paymentIntentId,
            chargeId: chargeId
        });
    } catch (error) {
        console.error("Stripe Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
