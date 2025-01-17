'use client';

import Navbar from "@/app/assets/components/navbar/page";
import React, { useState } from "react";
import SettingNavbar from "../settingNav";
import createAPI from "@/app/lib/axios";
import { useRouter } from "next/navigation";
import useAuth from "@/app/lib/useAuth";
import { toast } from "react-toastify";

export default function DeleteAcc() {
    useAuth();
    const router = useRouter();
    const api = createAPI();

    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); 
    const [loading, setLoading] = useState(false); 
    const [confirmationVisible, setConfirmationVisible] = useState(false); 

    const handleDeleteAcc = () => {
        if (!password) {
            setMessageType('error');
            setMessage("Please enter your password.");
            return;
        }
        setConfirmationVisible(true); 
    };

    const confirmDeleteAcc = async () => {
        setLoading(true);
        setConfirmationVisible(false);

        try {
            const response = await api.post("/api/delete-account", { password });

            if (response.data.code === '200') {
                setMessageType('success');
                setMessage(response.data.message);
                setTimeout(() => {
                    router.push('/auth/sign-in');
                }, 2000);
            } else {
                toast.error(response.data.message)
                setMessageType('error');
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessageType('error');
            setMessage("An error occurred while deleting the account.");
        } finally {
            setLoading(false);
        }
    };

    const cancelDeleteAcc = () => {
        setConfirmationVisible(false);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    return (
        <div>
            <Navbar />

            <div className="container-fluid bg-light">
                <div className="container mt-3 pt-5">
                    <div className="row">
                        <div className="col-md-3 p-3 rounded">
                            <SettingNavbar />
                        </div>

                        <div className="col-md-9 p-3">
                            <div className="card shadow-lg border-1">
                                <div className="card-body">
                                    <h5 className="mb-4 my-3 fw-bold">Delete account permanently</h5>
                                    <hr className="text-muted" />

                                    {message && (
                                        <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'} text-center`} role="alert">
                                            {message}
                                        </div>
                                    )}

                                    <div className="my-4">
                                        <label className="text-muted form-label">Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter Password"
                                            className="form-control mt-1"
                                            value={password}
                                            onChange={handlePasswordChange}
                                        />
                                    </div>

                                    <div className="mt-3 my-5">
                                        <button
                                            className="btn btn-danger rounded-1"
                                            onClick={handleDeleteAcc}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            ) : (
                                                <>
                                                    <i className="bi bi-trash me-2"></i> Delete Account
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {confirmationVisible && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Account Deletion</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={cancelDeleteAcc}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to permanently delete your account? All your data will be lost.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={cancelDeleteAcc}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={confirmDeleteAcc}>Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
