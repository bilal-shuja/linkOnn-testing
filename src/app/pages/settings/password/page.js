'use client';

import Navbar from "@/app/assets/components/navbar/page";
import React, { useState } from "react";
import SettingNavbar from "../settingNav";
import createAPI from "@/app/lib/axios";
import { useRouter } from "next/navigation";
import useAuth from "@/app/lib/useAuth";

export default function ChangePassword() {
    useAuth();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'error'
    const [loading, setLoading] = useState(false); // Button loading state
    const [confirmationVisible, setConfirmationVisible] = useState(false); // Show confirmation dialog
    const router = useRouter();
    const api = createAPI();

    const handleUpdatePassword = () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setMessageType("error");
            setMessage("All fields are required.");
            return;
        }

        if (newPassword.length < 6) {
            setMessageType("error");
            setMessage("New password must be at least 6 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessageType("error");
            setMessage("New password and confirm password do not match.");
            return;
        }

        setConfirmationVisible(true); // Show the confirmation dialog
    };

    const confirmPasswordChange = async () => {
        setConfirmationVisible(false);
        setLoading(true);

        try {
            const response = await api.post("/api/change-password", {
                old_password: oldPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });

            if (response.data.code === "200") {
                setMessageType("success");
                setMessage(response.data.message);
                setTimeout(() => {
                    router.push("/pages/newsfeed");
                }, 2000);
            } else {
                setMessageType("error");
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error updating password:", error);
            setMessageType("error");
            setMessage("An error occurred while updating the password.");
        } finally {
            setLoading(false);
        }
    };

    const cancelPasswordChange = () => {
        setConfirmationVisible(false);
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
                                    <h5 className="mb-4 my-3 fw-bold">Change your Password</h5>
                                    <hr className="text-muted" />

                                    {message && (
                                        <div
                                            className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"} text-center`}
                                            role="alert"
                                        >
                                            {message}
                                        </div>
                                    )}

                                    <div className="my-3">
                                        <label htmlFor="oldPassword" className="text-muted form-label px-1">
                                            Current Password
                                        </label>
                                        <input
                                            id="oldPassword"
                                            type="password"
                                            placeholder="Enter Old Password"
                                            className="form-control"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="my-3">
                                        <label htmlFor="newPassword" className="text-muted form-label px-1">
                                            New Password
                                        </label>
                                        <input
                                            id="newPassword"
                                            type="password"
                                            placeholder="Enter New Password"
                                            className="form-control"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="my-3">
                                        <label htmlFor="confirmPassword" className="text-muted form-label px-1">
                                            Confirm Password
                                        </label>
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm New Password"
                                            className="form-control"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="mt-3 text-end my-4">
                                        <button
                                            className="btn btn-primary rounded-1"
                                            onClick={handleUpdatePassword}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            ) : (
                                                "Update Password"
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
                                <h5 className="modal-title">Confirm Password Change</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={cancelPasswordChange}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to change your password?</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={cancelPasswordChange}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={confirmPasswordChange}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
