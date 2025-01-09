"use client"; // Ensures this code runs only in the client environment

import dynamic from "next/dynamic";
import createAPI from "@/app/lib/axios";
import { useState, useEffect } from "react";
  // It's already SSR-unfriendly, so no changes needed for this.
import Link from "next/link";

// Dynamically import components that depend on the browser environment
const Navbar = dynamic(() => import("@/app/assets/components/navbar/page"), { ssr: false });
const Rightnav = dynamic(() => import("@/app/assets/components/rightnav/page"), { ssr: false });

export default function Wallet() {
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);
  const [earnings, setEarnings] = useState({});
  const [loading, setLoading] = useState(true); // To track loading state

  const api = createAPI();

  // Fetch wallet data only after the component is mounted client-side
  useEffect(() => {
    // Check if we are on the client-side (not SSR)
    if (typeof window !== "undefined") {
      const fetchData = async () => {
        setLoading(true); // Start loading
        try {
          const response = await api.get("/api/user-wallet");
          if (response.data.code === "200") {
            setBalance(response.data.amount);
            setEarnings(response.data.earning || {}); // Assuming earnings data comes as an object
          } else {
            setError("Failed to fetch wallet data.");
            alertify.error(response.data.message); // Handle error from API
          }
        } catch (err) {
          setError("Error fetching data.");
          alertify.error("Error fetching data.");
        } finally {
          setLoading(false); // Stop loading
        }
      };

      fetchData(); // Call the fetchData function
    }
  }, []); // Only run once on client-side after the component mounts

  // Earnings categories for display
  const earningsCategories = [
    { label: "Like Earnings", key: "like_earnings", className: "text-success" },
    { label: "Comment Earnings", key: "comment_earnings", className: "text-success" },
    { label: "Share Earnings", key: "share_earnings", className: "text-info" },
    { label: "Withdraw Earnings", key: "withdraw_earnings", className: "text-primary" },
    { label: "Deposit Earnings", key: "deposit_earnings", className: "text-danger" },
  ];

  const loadingSpinner = (
    <div className="spinner-grow" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );

  // Show loading spinner while data is being fetched
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
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="text-dark fw-bold">Total Balance</h5>
                      <h4 className="text-dark fw-bold">
                        {balance === null ? loadingSpinner : `$${balance}`}
                      </h4>
                    </div>
                    <div>
                      <Link href="/pages/Wallet/deposit-amount" className="btn btn-primary">
                        <i className="bi bi-cash" aria-label="add"></i>&nbsp;&nbsp;Web.deposit
                      </Link>
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
                  <h5 className="card-title text-dark fw-bold">Earning Breakdown</h5>
                  <hr />
                  <div className="row text-center g-4">
                    {earningsCategories.map((category) => (
                      <div key={category.key} className="col-md-4">
                        <div className="bg-light p-3 rounded">
                          <h6 className="mb-2 text-secondary">{category.label}</h6>
                          <h5 className={`${category.className} mb-0 fw-bold`}>
                            {earnings === null
                              ? loadingSpinner
                              : `$${earnings[category.key]}`}
                          </h5>
                        </div>
                      </div>
                    ))}
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
