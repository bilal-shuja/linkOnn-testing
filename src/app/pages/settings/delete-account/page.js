'use client';

 
import React, { useState } from "react";
import SettingNavbar from "../settingNav";
import createAPI from "@/app/lib/axios";
import { useRouter } from "next/navigation";
   
import { toast } from "react-toastify";
import useConfirmationToast from "@/app/pages/Modals/useConfirmationToast";

export default function DeleteAcc() {
      
    const router = useRouter();
    const api = createAPI();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const confirmDeleteAcc = async () => {
        setLoading(true);
        try {
            const response = await api.post("/api/delete-account", { password });
            if (response.data.code === '200') {
                toast.success(response.data.message);
                setTimeout(() => {
                    router.push('/auth/sign-in');
                }, 2000);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred while deleting the account.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };


    const handleDeleteAcc = () => {
        if (!password) {
            toast.error("Please enter your password.");
            return;
        }
        showConfirmationToast();
    };

    const { showConfirmationToast } = useConfirmationToast({
        message: "Are you sure you want to permanently delete your account? This action cannot be undone.",
        confirmText: "Delete Account",
        cancelText: "Cancel Deletion",
        onConfirm: confirmDeleteAcc,
        onCancel: () => toast.dismiss(),
    });

    return (
        <div>
              

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
        </div>
    );
}
