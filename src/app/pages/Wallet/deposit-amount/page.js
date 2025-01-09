'use client';

import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import { useState } from "react";
import createAPI from "@/app/lib/axios";
import useAuth from "@/app/lib/useAuth";

export default function DepositAmount() {
    useAuth();
    const [depositMethod, setDepositMethod] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);  // Loading state for form submission
    const [message, setMessage] = useState("");  // Message state for displaying success or error messages
    const [error, setError] = useState(null);
    const api = createAPI();

    // Handle method change (for deposit method selection)
    const handleMethodChange = (e) => {
        setDepositMethod(e.target.value);
    };

    // Handle amount change (for deposit amount input)
    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    // Handle form submission to create a deposit request
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate if the deposit amount is valid
        if (!depositMethod || !amount || parseFloat(amount) <= 0) {
            setMessage("Please fill in all fields and enter a valid amount.");
            return;
        }

        setLoading(true); // Set loading to true during the submission process
        try {
            const response = await api.post("/api/deposit-request/create", {
                method: depositMethod,
                amount: parseFloat(amount)
            });

            if (response.data.code === "200") {
                setMessage("Deposit request successfully created.");
                // Reset form fields
                setDepositMethod("");
                setAmount("");
            } else {
                setMessage(response.data.message);
            }
        } catch (err) {
            setMessage("Error creating deposit request.");
            setError("Error creating deposit request.");
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
                            <div className="card shadow-lg border-0 mb-4 p-3">
                                <div className="card-body">
                                    <h3 className="card-title mb-4">Deposit Funds</h3>

                                    {/* Displaying error message */}
                                    {error && <div className="alert alert-danger">{error}</div>}

                                    {/* Deposit Form */}
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="depositMethod" className="form-label">Deposit Method</label>
                                            <select
                                                id="depositMethod"
                                                className="form-select"
                                                value={depositMethod}
                                                onChange={handleMethodChange}
                                                required
                                            >
                                                <option value="">Select Method</option>
                                                <option value="paypal">PayPal</option>
                                                <option value="bank_transfer">Bank Transfer</option>
                                                {/* Add more methods as needed */}
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="amount" className="form-label">Amount</label>
                                            <input
                                                type="number"
                                                id="amount"
                                                className="form-control"
                                                value={amount}
                                                onChange={handleAmountChange}
                                                required
                                                min="1"
                                                step="0.01"
                                            />
                                        </div>

                                        <div className="d-flex justify-content-end">
                                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                                {loading ? "Submitting..." : "Submit Deposit Request"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
