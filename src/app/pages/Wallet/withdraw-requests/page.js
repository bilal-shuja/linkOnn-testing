'use client';

import { useEffect, useState } from "react";
import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import createAPI from "@/app/lib/axios";
import useAuth from "@/app/lib/useAuth";

export default function WithdrawReqs() {
  useAuth();
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to track data fetching
  const [message, setMessage] = useState(""); // State for error/success messages
  const api = createAPI();

  // Data fetching for balance and withdrawal requests
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading when fetching begins
      try {
        // Fetch the balance
        const balanceResponse = await api.get("/api/user-wallet");
        setBalance(balanceResponse.data.amount);

        // Fetch the withdrawal requests
        const withdrawResponse = await api.post("/api/withdraw-requset/list");
        setWithdrawals(withdrawResponse.data.data);
      } catch (err) {
        setError(err);
        setMessage("Error fetching data."); // Set the error message
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchData(); // Run only once when the component mounts
  }, []); // Empty dependency array ensures this runs once when the component mounts

  const loadingSpinner = (
    <div className="spinner-grow" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );

  // If loading, show loading spinner
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        {loadingSpinner}
      </div>
    );
  }

  // If there's an error, display the error message
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error: {error.message}
      </div>
    );
  }

  // Display the message if it exists
  if (message) {
    return (
      <div className={`alert ${message.includes("Error") ? "alert-danger" : "alert-success"}`} role="alert">
        {message}
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

              {/* Card for displaying withdrawal history */}
              <div className="card shadow-lg border-0 mb-4 p-1">
                <div className="card-body p-4">
                  <div className="card shadow-sm border-0 p-4">
                    <h5 className="card-title fw-bold text-dark">Withdraw History</h5>
                    <hr className="text-muted" />

                    <table className="table table-bordered table-striped table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Sr</th>
                          <th>Request Via</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {withdrawals.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="text-center text-muted">
                              No withdrawals found.
                            </td>
                          </tr>
                        ) : (
                          withdrawals.map((withdrawal, index) => (
                            <tr key={withdrawal.id}>
                              <td>{index + 1}</td>
                              <td>{withdrawal.type}</td>
                              <td>{withdrawal.amount}</td>
                              <td>
                                <span
                                  className={`badge ${withdrawal.status === "Pending"
                                      ? "bg-primary"
                                      : withdrawal.status === "Api.status_approve"
                                        ? "bg-success"
                                        : "bg-danger"
                                    }`}
                                >
                                  {withdrawal.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
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
