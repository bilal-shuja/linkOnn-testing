"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import createAPI from "@/app/lib/axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../payment-success.css';

export default function PaymentSuccess() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get("session_id");
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const api = createAPI();

    useEffect(() => {
        if (sessionId) {
            const verifyPayment = async () => {
                try {
                    const stripeResponse = await fetch(`/payment-methods-api/Stripe-api/retrieve-payment?session_id=${sessionId}`);
                    const stripeData = await stripeResponse.json();

                    if (!stripeResponse.ok) {
                        throw new Error(stripeData.error || "Failed to retrieve payment information");
                    }

                    const paymentId = stripeData.paymentIntentId || stripeData.chargeId;

                    const response = await api.post('/api/deposite/add-fund', {
                        gateway_id: '2',
                        transaction_id: paymentId,
                    });

                    if (response.data.status == '200') {
                        setSuccess(true);
                        setTimeout(() => {
                            router.push("/pages/Wallet");
                        }, 3000);
                    } else {
                        setSuccess(false);
                    }
                } catch (error) {
                    console.error("Error verifying payment:", error);
                    setSuccess(false);
                } finally {
                    setLoading(false);
                }
            };

            verifyPayment();
        }
    }, [sessionId, router]);

    return (
        <div className="container payment-result-container">
            <div className="payment-status-card">
                {loading ? (
                    <div className="loader-container">
                        <div className="spinner-border text-primary spinner-custom" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h3 className="mt-4 processing-text">Processing Payment</h3>
                        <p className="text-muted">Please wait while we verify your transaction...</p>
                    </div>
                ) : success ? (
                    <div className="success-container">
                        <div className="success-checkmark">
                            <div className="check-icon">
                                <span className="icon-line line-tip"></span>
                                <span className="icon-line line-long"></span>
                                <div className="icon-circle"></div>
                                <div className="icon-fix"></div>
                            </div>
                        </div>
                        <h2 className="success-title">Payment Successful!</h2>
                        <p className="success-message">Your wallet has been updated successfully.</p>
                        <p className="redirect-message">Redirecting to Wallet...</p>
                    </div>
                ) : (
                    <div className="error-container text-center">
                        <div className="error-icon">
                            <i className="bi bi-exclamation-circle-fill text-danger"></i>
                        </div>
                        <h2 className="text-danger">Payment Verification Failed</h2>
                        <p>We couldn't verify your payment. Please contact support.</p>
                        <button onClick={() => router.push("/pages/Wallet")}
                            className="btn btn-primary mt-3">
                            Go to Wallet
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}