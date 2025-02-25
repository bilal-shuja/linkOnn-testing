import paypal from "paypal-rest-sdk";
import { getSiteSettings } from "@/app/lib/getSiteSettings";

export async function POST(req) {
    try {
        const body = await req.json();
        const { amount } = body;

        if (!amount || amount <= 0) {
            return new Response(JSON.stringify({ error: "Invalid deposit amount" }), { status: 400 });
        }

        const settings = await getSiteSettings();
        if (!settings || !settings.paypal_public_key || !settings.paypal_secret_key) {
            return new Response(JSON.stringify({ error: "PayPal API keys not found in settings" }), { status: 500 });
        }

        paypal.configure({
            mode: "sandbox", // Change to "live" in production
            client_id: settings.paypal_public_key,
            client_secret: settings.paypal_secret_key,
        });

        const paymentJson = {
            intent: "sale",
            payer: { payment_method: "paypal" },
            redirect_urls: {
                return_url: `http://localhost:3000/pages/Wallet/success/paypal-success`,
                cancel_url: `http://localhost:3000/pages/Wallet/deposit-amount`,
            },
            transactions: [{ 
                amount: { total: amount, currency: "USD" }, 
                description: "Wallet Deposit" 
            }],
        };

        return new Promise((resolve, reject) => {
            paypal.payment.create(paymentJson, (error, payment) => {
                if (error) {
                    console.error("PayPal error:", error);
                    return resolve(new Response(JSON.stringify({ error: "Error creating PayPal payment" }), { status: 500 }));
                }

                const approvalUrl = payment.links.find(link => link.rel === "approval_url");
                resolve(new Response(JSON.stringify({ approvalUrl: approvalUrl.href }), { status: 200 }));
            });
        });

    } catch (error) {
        console.error("API error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
