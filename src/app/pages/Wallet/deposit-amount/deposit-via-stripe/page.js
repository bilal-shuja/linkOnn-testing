"use client";

import { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import Rightnav from "@/app/assets/components/rightnav/page";

export default function StripeDeposit() {
    const [error, setError] = useState(null);
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState("");
    const api = createAPI();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const response = await api.get("/api/user-wallet");
                    if (response.data.status === "200") {
                        setBalance(response.data.amount);
                    } else {
                        setError("Failed to fetch wallet data.");
                    }
                } catch (err) {
                    setError("Error fetching data.");
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, []);

    const handleStripeDeposit = async () => {
        if (!amount || Number(amount) <= 0) {
            setError("Please enter a valid deposit amount.");
            return;
        }

        try {
            const response = await fetch("/payment-methods-api/Stripe-api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: Number(amount) }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                setError("Failed to initiate Stripe payment.");
            }
        } catch (err) {
            setError("Error processing Stripe payment.");
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div className="spinner-grow" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div>
            <div className="container-fluid bg-light">
                <div className="container mt-3 pt-5">
                    <div className="row">
                        <div className="col-md-3 p-3 rounded mt-4">
                            <Rightnav />
                        </div>
                        <div className="col-md-9 p-3 mt-4">
                            <div className="card shadow-lg border-0 mb-4 p-3">
                                <div className="card-body">
                                    <h5 className="text-dark fw-bold">Total Balance</h5>
                                    <h4 className="text-dark fw-bold">
                                        {balance === null ? "Loading..." : `$${(Number(balance) || 0).toFixed(2)}`}
                                    </h4>
                                </div>
                            </div>

                            <div className="card shadow-lg p-3 border-0">
                                <div className="card-body">
                                    <h5 className="text-dark fw-bold text-center">Deposit via Stripe</h5>
                                    <input
                                        type="number"
                                        className="form-control my-3"
                                        placeholder="Enter Deposit Amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                    <button className="btn btn-primary w-100" onClick={handleStripeDeposit}>
                                        Proceed to Stripe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
