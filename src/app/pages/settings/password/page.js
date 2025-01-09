'use client';

import Navbar from "@/app/assets/components/navbar/page";
import React, { useState } from "react";
import SettingNavbar from "../settingNav";
import createAPI from "@/app/lib/axios";
import { useRouter } from "next/navigation";

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const [confirmationVisible, setConfirmationVisible] = useState(false); // Show confirmation dialog
    const router = useRouter();
    const api = createAPI();

    const handleUpdatePassword = () => {
        if (newPassword !== confirmPassword) {
            setMessageType('error');
            setMessage("New password and confirm password do not match.");
            return;
        }

        setConfirmationVisible(true); // Show the confirmation dialog
    };

    const confirmPasswordChange = async () => {
        try {
            const response = await api.post("/api/change-password", {
                old_password: oldPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });

            if (response.data.code == '200') {
                setMessageType('success');
                setMessage(response.data.message);
                setTimeout(() => {
                    router.push('/pages/newsfeed');
                }, 2000);
            } else {
                setMessageType('error');
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessageType('error');
            setMessage("An error occurred while updating the password.");
        }

        setConfirmationVisible(false); // Hide the confirmation dialog
    };

    const cancelPasswordChange = () => {
        setConfirmationVisible(false); // Hide the confirmation dialog without making changes
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

                                    <div className="my-3">
                                        <label className="text-muted form-label px-1">Current Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter Old Password"
                                            className="form-control"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="my-3">
                                        <label className="text-muted form-label px-1">New Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter New Password"
                                            className="form-control"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="my-3">
                                        <label className="text-muted form-label px-1">Confirm Password</label>
                                        <input
                                            type="password"
                                            placeholder="Confirm New Password"
                                            className="form-control"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="mt-3 text-end my-4">
                                        <button className="btn btn-primary rounded-1" onClick={handleUpdatePassword}>
                                            Update Password
                                        </button>
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
