"use client";

import { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import Rightnav from "@/app/assets/components/rightnav/page";

export default function FlutterwaveDeposit() {
    const [amount, setAmount] = useState("");
    const [email, setEmail] = useState("");
    const [loadingBalance, setLoadingBalance] = useState(false);
    const [loadingDeposit, setLoadingDeposit] = useState(false);
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState(null);
    const api = createAPI();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const fetchData = async () => {
                setLoadingBalance(true);
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
                    setLoadingBalance(false);
                }
            };

            fetchData();
        }
    }, []);

    const handleDeposit = async (e) => {
        e.preventDefault();

        if (!amount || amount <= 0) {
            setError("Please enter a valid amount.");
            return;
        }
        
        if (!email) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoadingDeposit(true);
        setError(null);

        try {
            const response = await fetch("/payment-methods-api/Flutterwave-api/flutterwave-initiate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, amount }),
            });

            const data = await response.json();

            if (data.status && data.data.link) {
                window.location.href = data.data.link;
            } else {
                setError("Failed to initiate payment.");
            }
        } catch (err) {
            setError("Something went wrong. Try again.");
        } finally {
            setLoadingDeposit(false);
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
                                        {loadingBalance ? "Loading balance..." : `$${(Number(balance) || 0).toFixed(2)}`}
                                    </h4>
                                </div>
                            </div>

                            <div className="card shadow-lg p-3 border-0">
                                <div className="card-body">
                                    <h5 className="card-title d-flex justify-content-center text-dark fw-bold mb-4 mt-3">
                                        Deposit via Flutterwave
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
                                                    placeholder="Enter Deposit"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="email" className="form-label text-muted">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    placeholder="Enter your email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                            {error && <p className="text-danger">{error}</p>}
                                            <button type="submit" className="btn btn-success w-100" disabled={loadingDeposit}>
                                                {loadingDeposit ? "Processing deposit..." : "Deposit via Flutterwave"}
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
