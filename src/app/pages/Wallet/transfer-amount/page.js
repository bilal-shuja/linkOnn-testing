'use client';

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import useAuth from "@/app/lib/useAuth";

// Dynamically import components to avoid SSR issues
const Navbar = dynamic(() => import("@/app/assets/components/navbar/page"), { ssr: false });
const Rightnav = dynamic(() => import("@/app/assets/components/rightnav/page"), { ssr: false });

export default function TransferAmount() {
  useAuth();
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState("");
  const [transferError, setTransferError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for balance
  const [message, setMessage] = useState(""); // State for success/error message
  const api = createAPI();

  // Fetch wallet balance when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/user-wallet");
        if (response.data.amount !== undefined) {
          setBalance(response.data.amount);
        } else {
          setError("Balance information is unavailable.");
        }
      } catch (err) {
        setError("Error fetching balance.");
        setMessage("Error fetching balance."); // Set the error message
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Client-side transfer handling
  const handleTransfer = async (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      setTransferError("Please enter a valid amount.");
      setMessage("Please enter a valid amount.");
      return;
    }

    if (amount > balance) {
      setTransferError("Insufficient funds.");
      setMessage("Insufficient funds.");
      return;
    }

    try {
      const response = await api.post("/api/transfer-amount", { amount });

      if (response.data.code === "200") {
        setTransferError(null);
        setMessage("Transfer successful!"); // Set success message
        setBalance(balance - amount);
        setAmount("");
      } else {
        setTransferError(response.data.message);
        setMessage(response.data.message); // Set error message from response
      }
    } catch (err) {
      setTransferError("Error transferring amount.");
      setMessage("Error transferring amount."); // Set error message
    }
  };

  // Loading spinner
  const loadingSpinner = (
    <div className="spinner-grow" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );

  // Render loading spinner if balance is being fetched
  if (loading) {
    return <div className="d-flex justify-content-center mt-3">{loadingSpinner}</div>;
  }

  // Display error message if there was an error fetching balance
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
              {/* Card for displaying balance */}
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

              {/* Card for transferring amount */}
              <div className="card shadow-lg border-0 mb-4 p-1">
                <div className="card-body p-4">
                  <div className="card shadow-sm border-0 p-4">
                    <h5 className="card-title fw-bold text-dark">Transfer Amount</h5>
                    <hr className="text-muted" />

                    {/* Transfer Form */}
                    <form onSubmit={handleTransfer}>
                      {/* Amount input */}
                      <div className="mb-3">
                        <label htmlFor="amount" className="form-label">
                          Amount to Transfer
                        </label>
                        <input
                          type="number"
                          id="amount"
                          className="form-control"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          min="1"
                          required
                          step="0.01"
                        />
                      </div>

                      {/* Error message for invalid transfers */}
                      {transferError && (
                        <div className="alert alert-danger">{transferError}</div>
                      )}

                      {/* Submit button */}
                      <div className="d-flex justify-content-end">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? "Processing..." : "Transfer"}
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
    </div>
  );
}
