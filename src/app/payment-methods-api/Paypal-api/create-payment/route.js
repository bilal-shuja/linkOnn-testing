import paypal from "paypal-rest-sdk";

paypal.configure({
    mode: "sandbox",
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_SECRET,
});

export async function POST(req) {
    try {
        const body = await req.json();
        const { amount } = body;

        if (!amount || amount <= 0) {
            return new Response(JSON.stringify({ error: "Invalid deposit amount" }), { status: 400 });
        }

        const paymentJson = {
            intent: "sale",
            payer: { payment_method: "paypal" },
            redirect_urls: {
                // return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/paypal/success`,
                return_url: `http://localhost:3000/pages/Wallet/success/paypal-succcess`,
                cancel_url: `http://localhost:3000/pages/Wallet/deposit-amount`,
                // cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/paypal?status=cancelled`,
            },
            transactions: [{ amount: { total: amount, currency: "USD" }, description: "Wallet Deposit" }],
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
