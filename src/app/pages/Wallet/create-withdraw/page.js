"use client";

import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import useAuth from "@/app/lib/useAuth";
import { useRouter } from "next/navigation";  // Import useRouter for navigation

export default function CreateWithdraw() {
    useAuth();
    const router = useRouter(); // Initialize the router
    const [error, setError] = useState(null);
    const [balance, setBalance] = useState(null);
    const [withdrawMethod, setWithdrawMethod] = useState("");
    const [amount, setAmount] = useState("");
    const [paypalEmail, setPaypalEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [address, setAddress] = useState("");
    const [iban, setIban] = useState("");
    const [country, setCountry] = useState("");
    const [swiftCode, setSwiftCode] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const api = createAPI();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await api.get("/api/user-wallet");
                setBalance(response.data.amount);
            } catch (err) {
                setError("Error fetching wallet data.");
                setMessage("Error fetching data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleMethodChange = (e) => {
        setWithdrawMethod(e.target.value);
    };

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!withdrawMethod || !amount || parseFloat(amount) <= 0) {
            setMessage("Please fill in all fields and enter a valid amount.");
            return;
        }

        if (parseFloat(amount) > balance) {
            setMessage("Insufficient balance.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();

            formData.append("amount", amount);
            formData.append("type", withdrawMethod);
            formData.append("paypal_email", paypalEmail);
            formData.append("full_name", fullName);
            formData.append("address", address);
            formData.append("iban", iban);
            formData.append("country", country);
            formData.append("swift_code", swiftCode);
            formData.append("mbl_no", mobileNumber);

            const response = await api.post("/api/withdraw-requset/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });


            if (response.data.status === "200") {
                setMessage("Withdrawal request successfully created.");
                setWithdrawMethod("");
                setAmount("");
                router.push("/pages/Wallet/withdraw-requests");
            } else {
                setMessage(response.data.message);
            }
        } catch (err) {
            setMessage("Error creating withdrawal request.");
            setError("Error creating withdrawal request.");
        } finally {
            setLoading(false);
        }
    };

    const loadingSpinner = (
        <div className="spinner-grow" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    );

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                {loadingSpinner}
            </div>
        );
    }

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
                                        {balance === null ? loadingSpinner : `$${(Number(balance) || 0).toFixed(2)}`}
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
                                                    <option value="">Select Method</option>
                                                    <option value="Paypal">Paypal</option>
                                                    <option value="Bank">Bank</option>
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

                                            {withdrawMethod === "Paypal" && (
                                                <div className="mt-4">
                                                    <label className="form-label">PayPal Email</label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="Enter PayPal Email"
                                                        value={paypalEmail}
                                                        onChange={(e) => setPaypalEmail(e.target.value)}
                                                    />
                                                </div>
                                            )}

                                            {withdrawMethod === "Bank" && (
                                                <div className="mt-4">
                                                    <div className="gap-3 d-flex mt-3">
                                                        <div className="w-50">
                                                            <label className="form-label text-muted">Full Name</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Your Full Name"
                                                                value={fullName}
                                                                onChange={(e) => setFullName(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="w-50">
                                                            <label className="form-label text-muted">Address</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Address"
                                                                value={address}
                                                                onChange={(e) => setAddress(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="gap-3 d-flex mt-3">
                                                        <div className="w-50">
                                                            <label className="form-label text-muted">IBAN</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Your IBAN"
                                                                value={iban}
                                                                onChange={(e) => setIban(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="w-50">
                                                            <label className="form-label text-muted">Country</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Your Country"
                                                                value={country}
                                                                onChange={(e) => setCountry(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="gap-3 d-flex mt-3">
                                                        <div className="w-50">
                                                            <label className="form-label text-muted">SWIFT Code</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Your SWIFT Code"
                                                                value={swiftCode}
                                                                onChange={(e) => setSwiftCode(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="w-50">
                                                            <label className="form-label text-muted">Mobile Number</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Your Mobile Number"
                                                                value={mobileNumber}
                                                                onChange={(e) => setMobileNumber(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <button className="btn btn-success mt-4" onClick={handleSubmit}>Withdraw</button>

                                            {message && <div className="alert alert-info mt-3">{message}</div>}
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
