"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Rightnav from "@/app/assets/components/rightnav/page";
import createAPI from "@/app/lib/axios";

export default function Paypal() {
    const [error, setError] = useState(null);
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState("");
    const router = useRouter();
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

    const handleDeposit = async (e) => {
        e.preventDefault();
        if (!amount || amount <= 0) {
            alert("Please enter a valid deposit amount.");
            return;
        }

        try {
            const response = await fetch("/payment-methods-api/Paypal-api/create-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: amount }),
            });

            if (!response.ok) {
                throw new Error("Failed to initiate PayPal payment.");
            }

            const data = await response.json();

            if (data.approvalUrl) {
                window.location.href = data.approvalUrl;
            } else {
                alert("Error processing PayPal payment.");
            }
        } catch (error) {
            console.error("Error processing PayPal payment:", error);
            alert("Something went wrong. Please try again.");
        }
    };

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
                                    <h5 className="card-title text-center text-dark fw-bold mb-4 mt-3">
                                        Deposit via PayPal
                                    </h5>
                                    <div className="d-flex justify-content-center">
                                        <form className="w-50" onSubmit={handleDeposit}>
                                            <div className="mb-3">
                                                <label htmlFor="amount" className="form-label text-muted">
                                                    Amount
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="amount"
                                                    placeholder="Enter Deposit Amount"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                />
                                            </div>
                                            <button type="submit" className="btn btn-success w-100">
                                                Deposit via PayPal
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
