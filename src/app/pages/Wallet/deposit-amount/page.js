"use client";

import createAPI from "@/app/lib/axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import useAuth from "@/app/lib/useAuth";
import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import Image from "next/image";

export default function Depositamount() {
    useAuth();
    const [error, setError] = useState(null);
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
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
                            <div className="card shadow-lg border-0 mb-4 p-3">
                                <div className="card-body">
                                    <div>
                                        <div>
                                            <h5 className="text-dark fw-bold">Total Balance</h5>
                                            <h4 className="text-dark fw-bold">
                                                {balance === null ? loadingSpinner : `$${balance}`}
                                            </h4>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-around text-center">
                                        <div>
                                            <Link href="/pages/Wallet/create-withdraw">
                                                <button className="btn btn-danger rounded-2 mb-2">
                                                    <i className="bi bi-arrow-down-circle fs-4 text-light"></i>
                                                </button>
                                            </Link>
                                            <p className="fw-semibold">Withdraw</p>
                                        </div>
                                        <div>
                                            <Link href="/pages/Wallet/withdraw-requests">
                                                <button className="btn btn-warning rounded-2 mb-2">
                                                    <i className="bi bi-arrow-left-right fs-4 text-light"></i>
                                                </button>
                                            </Link>
                                            <p className="fw-semibold">Withdrawal Requests</p>
                                        </div>

                                        <div>
                                            <Link href="/pages/Wallet/transfer-amount">
                                                <button className="btn btn-info rounded-2 mb-2">
                                                    <i className="bi bi-send fs-4 text-light"></i>
                                                </button>
                                            </Link>
                                            <p className="fw-semibold">Transfer</p>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="card shadow-lg p-3 border-0">
                                <div className="card-body">
                                    <h5 className="card-title text-dark fw-bold">Payment Methods</h5>
                                    <hr />
                                    <div className="row justify-content-evenly">

                                        <div className="col-md-2 col-6 text-center mb-3">
                                            <Link href="/pages/Wallet/deposit-amount/deposit-via-stripe" className="text-decoration-none">
                                                <div className="btn btn-outline-primary rounded-3 p-3 w-100 d-flex flex-column align-items-center">

                                                    <Image
                                                        src="/assets/images/stripe.jpeg"
                                                        alt="Stripe"
                                                        width={150}
                                                        height={50}
                                                        className="mb-2"
                                                        style={{ objectFit: 'contain' }}
                                                    />
                                                    <span className="fw-semibold">Stripe</span>
                                                </div>
                                            </Link>
                                        </div>

                                        <div className="col-md-2 col-6 text-center mb-3">
                                            <Link href="/pages/Wallet/deposit-amount/deposit-via-paypal" className="text-decoration-none">
                                                <div className="btn btn-outline-primary rounded-3 p-3 w-100 d-flex flex-column align-items-center">

                                                    <Image
                                                        src="/assets/images/paypal.jpg"
                                                        alt="PayPal"
                                                        width={150}
                                                        height={50}
                                                        className="mb-2"
                                                        style={{ objectFit: 'contain' }}
                                                    />
                                                    <span className="fw-semibold">PayPal</span>
                                                </div>
                                            </Link>
                                        </div>

                                        <div className="col-md-2 col-6 text-center mb-3">
                                            <Link href="/pages/Wallet/deposit-amount/deposit-via-paystack" className="text-decoration-none">
                                                <div className="btn btn-outline-info rounded-3 p-3 w-100 d-flex flex-column align-items-center">

                                                    <Image
                                                        src="/assets/images/paystack.webp"
                                                        alt="Paystack"
                                                        width={150}
                                                        height={50}
                                                        className="mb-2"
                                                        style={{ objectFit: 'contain' }}
                                                    />
                                                    <span className="fw-semibold">Paystack</span>
                                                </div>
                                            </Link>
                                        </div>

                                        <div className="col-md-2 col-6 text-center mb-3">
                                            <Link href="/pages/Wallet/deposit-amount/deposit-via-flutterwave" className="text-decoration-none">
                                                <div className="btn btn-outline-success rounded-3 p-3 w-100 d-flex flex-column align-items-center">

                                                    <Image
                                                        src="/assets/images/flutterwave.png"
                                                        alt="Flutter"
                                                        width={150}
                                                        height={50}
                                                        className="mb-2"
                                                        style={{ objectFit: 'contain' }}
                                                    />
                                                    <span className="fw-semibold">Flutterwave</span>
                                                </div>
                                            </Link>
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
