'use client';

import { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import useAuth from "@/app/lib/useAuth";
import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import Select from 'react-select';

export default function TransferAmount() {
  useAuth();
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState("");
  const [transferError, setTransferError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const api = createAPI();

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
        setMessage("Error fetching balance.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        
        const formData = new FormData();
        formData.append("type", "people");
        formData.append("limit" , '22')
        formData.append("search_string" , "");

        const response = await api.post("/api/search-user", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data.code === "200" && Array.isArray(response.data.data)) {
          setUsers(response.data.data);
        } else {
          setError("Error fetching users.");
          setMessage("No users available.");
        }
      } catch (err) {
        setError("Error fetching users.");
        setMessage("Error fetching users.");
      }
    };

    fetchUsers();
  }, []);

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
      const response = await api.post("/api/transfer-amount", { amount, user_id: selectedUser?.value });

      if (response.data.status === "200") {
        setTransferError(null);
        setMessage(response.data.message);
        setBalance(balance - amount);
        setAmount("");
        setSelectedUser(null);
      } else {
        setTransferError(response.data.message);
        setMessage(response.data.message);
      }
    } catch (err) {
      setTransferError("Error transferring amount.");
      setMessage("Error transferring amount.");
    }
  };

  const loadingSpinner = (
    <div className="spinner-grow" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );

  if (loading) {
    return <div className="d-flex justify-content-center mt-3">{loadingSpinner}</div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  const userOptions = users.map(user => ({
    value: user.id,
    label: user.username
  }));

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
                    <h5 className="card-title fw-bold text-dark">Transfer Amount</h5>
                    <hr className="text-muted" />

                    <form onSubmit={handleTransfer}>
                      <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                          User Name
                        </label>
                        <Select
                          options={userOptions}
                          value={selectedUser}
                          onChange={setSelectedUser}
                          isSearchable
                          placeholder="Select a User"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="amount" className="form-label">
                          Amount
                        </label>
                        <input
                          type="number"
                          id="amount"
                          placeholder="Transfer Amount"
                          className="form-control"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          min="1"
                          required
                        />
                      </div>

                      {message && (
                        <div className="alert alert-success text-center">{message}</div>
                      )}
                     
                      {transferError && (
                        <div className="alert alert-danger text-center">{transferError}</div>
                      )}

                      <div className="d-flex justify-content-end">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading || !selectedUser}
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
