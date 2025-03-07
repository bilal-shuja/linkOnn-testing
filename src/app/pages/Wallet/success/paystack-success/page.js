"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import createAPI from "@/app/lib/axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../payment-success.css';

function PaystackComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const reference = searchParams.get("reference");
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const api = createAPI();

    useEffect(() => {
        if (!reference) {
            setLoading(false);
            setSuccess(false);
            return;
        }

        const verifyPaystackPayment = async () => {
            try {
                // Step 1: Verify transaction with Paystack
                const paystackResponse = await fetch(`/payment-methods-api/Paystack-api/verify-transaction`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ reference }),
                });

                const paystackData = await paystackResponse.json();

                if (!paystackResponse.ok || !paystackData.success) {
                    throw new Error(paystackData.message || "Failed to verify Paystack payment");
                }

                // Step 2: Get Paystack transaction ID
                const transactionId = paystackData.data.reference;

                // Step 3: Call backend API to update wallet
                const response = await api.post('/api/deposite/add-fund', {
                    gateway_id: '3',
                    transaction_id: transactionId,
                    amount: paystackData.data.amount
                });

                if (response.data.status === '200') {
                    setSuccess(true);

                    // Ensure `window` exists before using `router.push()`
                    if (typeof window !== "undefined") {
                        setTimeout(() => {
                            router.push("/pages/Wallet");
                        }, 3000);
                    }
                } else {
                    setSuccess(false);
                }
            } catch (error) {
                console.error("Error verifying Paystack payment:", error);
                setSuccess(false);
            } finally {
                setLoading(false);
            }
        };

        verifyPaystackPayment();
    }, [reference, router]);

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
                        <p>We could not verify your payment. Please contact support.</p>
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

// Wrap in Suspense to handle `useSearchParams`
export default function PaystackSuccess() {
    return (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            <PaystackComponent />
        </Suspense>
    );
}
