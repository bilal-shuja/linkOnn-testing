"use client";

import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";

export default function CreateWithdraw() {
    const [error, setError] = useState(null);
    const [balance, setBalance] = useState(null);
    const [withdrawMethod, setWithdrawMethod] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);  // Loading state for data fetching and form submission
    const [message, setMessage] = useState(""); // For success/error messages
    const api = createAPI();

    // Fetch user wallet data (balance)
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Set loading to true when fetching data
            try {
                const response = await api.get("/api/user-wallet");
                setBalance(response.data.amount); // Set the balance from the response
            } catch (err) {
                setError("Error fetching wallet data.");
                setMessage("Error fetching data.");
            } finally {
                setLoading(false); // Stop loading when the request is complete
            }
        };

        fetchData();
    }, []); // Run this effect once when the component mounts

    // Handle method change (for withdrawal method selection)
    const handleMethodChange = (e) => {
        setWithdrawMethod(e.target.value);
    };

    // Handle amount change (for withdrawal amount input)
    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    // Handle form submission to create a withdrawal request
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate if the withdrawal amount is valid
        if (!withdrawMethod || !amount || parseFloat(amount) <= 0) {
            setMessage("Please fill in all fields and enter a valid amount.");
            return;
        }

        if (parseFloat(amount) > balance) {
            setMessage("Insufficient balance.");
            return;
        }

        setLoading(true); // Set loading to true during the submission process
        try {
            const response = await api.post("/api/withdraw-requset/create", {
                method: withdrawMethod,
                amount: parseFloat(amount)
            });

            if (response.data.code === "200") {
                setMessage("Withdrawal request successfully created.");
                // Reset form fields
                setWithdrawMethod("");
                setAmount("");
            } else {
                setMessage(response.data.message);
            }
        } catch (err) {
            setMessage("Error creating withdrawal request.");
            setError("Error creating withdrawal request.");
        } finally {
            setLoading(false); // Stop loading after the request is completed
        }
    };

    // Loading spinner
    const loadingSpinner = (
        <div className="spinner-grow" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    );

    // If loading balance, show loading spinner
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                {loadingSpinner}
            </div>
        );
    }

    // If there's an error
    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="container-fluid bg-light">
                <div className="container mt-3 pt-5">
                    <div className="row">
                        <div className="col-md-3 p-3 rounded mt-4">
                            <Rightnav />
                        </div>
                        <div className="col-md-9 p-3 mt-4">
                            <div className="card shadow-lg border-0 mb-4 p-1">
                                <div className="card-body p-4">
                                    <div className="card shadow-sm border-0 p-4">
                                        <h5 className="text-dark fw-bold">Total Balance</h5>
                                        <h4 className="text-dark fw-bold">
                                            {balance === null ? loadingSpinner : `$${balance}`}
                                        </h4>
                                    </div>
                                </div>
                            </div>

                            <div className="card shadow-lg border-0 mb-4 p-1">
                                <div className="card-body p-4">
                                    <div className="card shadow-sm border-0 p-4">
                                        <h5 className="card-title fw-bold text-dark">Withdraw Balance</h5>
                                        <hr className="text-muted" />
                                        <div>
                                            <div className="mt-4">
                                                <label className="form-label text-muted">Withdraw Request Via</label>
                                                <select
                                                    className="form-select"
                                                    aria-label="Withdraw Via"
                                                    value={withdrawMethod}
                                                    onChange={handleMethodChange}
                                                >
                                                    <option default>Request Via</option>
                                                    <option value="1">Paypal</option>
                                                    <option value="2">Bank</option>
                                                </select>
                                            </div>
                                            <div className="mt-3">
                                                <label className="form-label text-muted">Amount</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={amount}
                                                    onChange={handleAmountChange}
                                                />
                                            </div>

                                            {withdrawMethod === "1" && (
                                                <div className="mt-4">
                                                    <label className="form-label">PayPal Email</label>
                                                    <input type="email" className="form-control" placeholder="Enter Paypal Email" />
                                                </div>
                                            )}

                                            {withdrawMethod === "2" && (
                                                <div className="mt-4">
                                                    <div className="gap-3 d-flex mt-3">
                                                        <div className="w-50">
                                                            <label className="form-label text-muted">Full Name</label>
                                                            <input type="text" className="form-control" placeholder="Your Full Name" />
                                                        </div>
                                                        <div className="w-50">
                                                            <label className="form-label text-muted">Address</label>
                                                            <input type="text" className="form-control" placeholder="Enter Address" />
                                                        </div>
                                                    </div>
                                                    <div className="gap-3 d-flex mt-3">
                                                        <div className="w-50">
                                                            <label className="form-label text-muted">IBAN</label>
                                                            <input type="text" className="form-control" placeholder="Your IBAN" />
                                                        </div>
                                                        <div className="w-50">
                                                            <label className="form-label text-muted">Country</label>
                                                            <input type="text" className="form-control" placeholder="Your Country" />
                                                        </div>
                                                    </div>
                                                    <div className="gap-3 d-flex mt-3">
                                                        <div className="w-50">
                                                            <label className="form-label text-muted">SWIFT Code</label>
                                                            <input type="text" className="form-control" placeholder="Your SWIFT Code" />
                                                        </div>
                                                        <div className="w-50">
                                                            <label className="form-label text-muted">Mobile Number</label>
                                                            <input type="text" className="form-control" placeholder="Your Mobile Number" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <button className="btn btn-success mt-4" onClick={handleSubmit}>Withdraw</button>
                                        </div>
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
