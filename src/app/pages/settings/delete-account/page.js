'use client';

import Navbar from "@/app/assets/components/navbar/page";
import React, { useState } from "react";
import SettingNavbar from "../settingNav";
import createAPI from "@/app/lib/axios";
import { useRouter } from "next/navigation";
import useAuth from "@/app/lib/useAuth";

export default function DeleteAcc() {
    useAuth();
    const router = useRouter();
    const api = createAPI();

    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleDeleteAcc = async () => {
        if (!password) {
            setError("Please enter your password.");
            return;
        }

        const confirmation = window.confirm(
            "Are you sure you want to delete? You are about to delete your account. If you delete your account, all your data will be lost."
        );

        if (confirmation) {
            try {
                const response = await api.post("/api/delete-account", {
                    password,
                });

                if (response.data.code === '200') {
                    setSuccess(response.data.message);
                    setTimeout(() => {
                        router.push('/auth/sign-in');
                    }, 2000);
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                setError("An error occurred while deleting account.");
            }
        } else {
            setError("Account deletion canceled.");
        }
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
                                        <button className="btn btn-danger rounded-1" onClick={handleDeleteAcc}>
                                            <i className="bi bi-trash me-2"></i>
                                            Delete Account
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
