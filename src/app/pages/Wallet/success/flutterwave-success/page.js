"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import createAPI from "@/app/lib/axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../payment-success.css';

export default function FlutterwaveSuccess() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const transactionId = searchParams.get("transaction_id");
    const status = searchParams.get("status");
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const api = createAPI();

    useEffect(() => {
        if (!transactionId || status !== "successful") {
            setLoading(false);
            setSuccess(false);
            return;
        }

        const verifyFlutterwavePayment = async () => {
            try {
                // Step 1: Verify transaction with Flutterwave
                const flutterwaveResponse = await fetch(`/payment-methods-api/Flutterwave-api/flutterwave-verify`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ transaction_id: transactionId }),
                });

                const flutterwaveData = await flutterwaveResponse.json();

                if (!flutterwaveResponse.ok || !flutterwaveData.success) {
                    throw new Error(flutterwaveData.message || "Failed to verify Flutterwave payment");
                }

                // Step 2: Get verified transaction ID
                const verifiedTransactionId = flutterwaveData.data.transaction_id;

                // Step 3: Call backend API to update wallet
                const response = await api.post('/api/deposite/add-fund', {
                    gateway_id: '4',
                    transaction_id: verifiedTransactionId,
                    amount: flutterwaveData.data.amount
                });

                if (response.data.status === '200') {
                    setSuccess(true);
                    setTimeout(() => {
                        router.push("/pages/Wallet");
                    }, 3000);
                } else {
                    setSuccess(false);
                }
            } catch (error) {
                console.error("Error verifying Flutterwave payment:", error);
                setSuccess(false);
            } finally {
                setLoading(false);
            }
        };

        verifyFlutterwavePayment();
    }, [transactionId, status, router]);

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
