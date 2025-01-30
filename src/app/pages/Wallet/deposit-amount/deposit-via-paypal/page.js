"use client";

import createAPI from "@/app/lib/axios";
import { useState, useEffect } from "react";
   
 
import Rightnav from "@/app/assets/components/rightnav/page";

export default function Paypal() {
      
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
                                            {balance === null ? loadingSpinner : `$${(Number(balance) || 0).toFixed(2)}`}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card shadow-lg p-3 border-0">
                                <div className="card-body">
                                    <h5 className="card-title d-flex justify-content-center text-dark fw-bold mb-4 mt-3">Deposit via Paypal</h5>
                                    <div className="d-flex justify-content-center">
                                        <form className="w-50">
                                            <div className="mb-3">
                                                <label htmlFor="amount" className="form-label text-muted">
                                                    Amount
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="amount"
                                                    placeholder="Enter Deposit"
                                                />
                                            </div>
                                            <button type="submit" className="btn btn-success w-100">
                                                Deposit via Paypal
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
