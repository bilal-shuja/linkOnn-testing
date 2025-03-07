"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import createAPI from "@/app/lib/axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../payment-success.css';

function PayPalComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const paymentId = searchParams.get("paymentId");
    const PayerID = searchParams.get("PayerID");
    const status = searchParams.get("status");
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const api = createAPI();

    useEffect(() => {
        if (status === "success") {
            setSuccess(true);
            setLoading(false);

            if (typeof window !== "undefined") {
                setTimeout(() => {
                    router.push("/pages/Wallet");
                }, 3000);
            }
            return;
        }

        if (paymentId && PayerID) {
            const verifyPayPalPayment = async () => {
                try {
                    const paypalResponse = await fetch(`/api/paypal/execute-payment?paymentId=${paymentId}&PayerID=${PayerID}`);
                    const paypalData = await paypalResponse.json();

                    if (!paypalResponse.ok) {
                        throw new Error(paypalData.error || "Failed to execute PayPal payment");
                    }

                    const transactionId = paypalData.transactionId;

                    const response = await api.post('/api/deposite/add-fund', {
                        gateway_id: '1',
                        transaction_id: transactionId,
                    });

                    if (response.data.status === '200') {
                        setSuccess(true);

                        if (typeof window !== "undefined") {
                            setTimeout(() => {
                                router.push("/pages/Wallet");
                            }, 3000);
                        }
                    } else {
                        setSuccess(false);
                    }
                } catch (error) {
                    console.error("Error verifying PayPal payment:", error);
                    setSuccess(false);
                } finally {
                    setLoading(false);
                }
            };

            verifyPayPalPayment();
        } else {
            setLoading(false);
            setSuccess(false);
        }
    }, [paymentId, PayerID, status, router]);

    return (
        <div className="container payment-result-container">
            <div className="payment-status-card">
                {loading ? (
                    <div className="loader-container">
                        <div className="spinner-border text-primary spinner-custom" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h3 className="mt-4 processing-text">Processing PayPal Payment</h3>
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
                        <h2 className="success-title">PayPal Payment Successful!</h2>
                        <p className="success-message">Your wallet has been updated successfully.</p>
                        <p className="redirect-message">Redirecting to Wallet...</p>
                    </div>
                ) : (
                    <div className="error-container text-center">
                        <div className="error-icon">
                            <i className="bi bi-exclamation-circle-fill text-danger"></i>
                        </div>
                        <h2 className="text-danger">PayPal Payment Verification Failed</h2>
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
export default function PayPalSuccess() {
    return (
        <Suspense fallback={<div className="text-center">Loading...</div>}>
            <PayPalComponent />
        </Suspense>
    );
}
