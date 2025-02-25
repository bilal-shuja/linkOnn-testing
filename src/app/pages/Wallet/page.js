"use client";

import createAPI from "@/app/lib/axios";
import { useState, useEffect } from "react";
import Link from "next/link";


import Rightnav from "@/app/assets/components/rightnav/page";
import { toast } from "react-toastify";

export default function Wallet() {

  const [balance, setBalance] = useState(null);
  const [earnings, setEarnings] = useState({});
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
            setEarnings(response.data.earning || {});
          } else {
            toast.error(response.data.message);
          }
        } catch (err) {
          toast.error("Error fetching data.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, []);

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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        {loadingSpinner}
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
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="text-dark fw-bold">Total Balance</h5>
                      <h4 className="text-dark fw-bold">
                        {balance === null ? loadingSpinner : `$${(Number(balance) || 0).toFixed(2)}`}
                      </h4>
                    </div>
                    <div>
                      <Link href="/pages/Wallet/deposit-amount" className="btn btn-primary">
                        <i className="bi bi-cash" aria-label="add"></i>&nbsp;&nbsp;Deposit
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
                            {earnings[category.key] === undefined
                              ? loadingSpinner
                              : `$${(Number(earnings[category.key]) || 0).toFixed(2)}`}
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
