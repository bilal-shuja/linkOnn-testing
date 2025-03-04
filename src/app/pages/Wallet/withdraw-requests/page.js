'use client';

import { useEffect, useState } from "react";
 
import Rightnav from "@/app/assets/components/rightnav/page";
import createAPI from "@/app/lib/axios";
import { toast } from "react-toastify";

export default function WithdrawReqs() {
  const [balance, setBalance] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = createAPI();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const balanceResponse = await api.get("/api/user-wallet");
        setBalance(balanceResponse.data.amount);

        const withdrawResponse = await api.post("/api/withdraw-requset/list");

        if (withdrawResponse.data.code === "400" && withdrawResponse.data.message === "Api.withdraw_requests_not_found") {
          setWithdrawals([]);
          toast.info(withdrawResponse.data.message);
        } else {
          setWithdrawals(withdrawResponse.data.data || []);
        }
      } catch (err) {
        toast.error("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadingSpinner = (
    <div className="d-flex justify-content-center align-items-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
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
                                        : withdrawal.status === "Api.status_reject"
                                          ? "bg-danger"
                                          : ""
                                    }`}
                                >
                                  {
                                    withdrawal.status === "Pending"
                                      ? "Pending"
                                      : withdrawal.status === "Api.status_approve"
                                        ? "Approved"
                                        : withdrawal.status === "Api.status_reject"
                                          ? "Rejected"
                                          : null
                                  }
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
