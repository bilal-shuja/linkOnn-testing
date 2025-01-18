'use client'

import Navbar from "@/app/assets/components/navbar/page";
import SettingNavbar from "../settingNav";
import { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import Image from "next/image";
import useAuth from "@/app/lib/useAuth";
import { toast } from "react-toastify";

export default function BlockUsers() {
    useAuth();
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [userToUnblock, setUserToUnblock] = useState(null);
    const api = createAPI();

    useEffect(() => {
        const fetchBlockedUsers = async () => {
            try {
                const response = await api.get(`/api/block-list`);
                if (response.data.code == "200") {
                    setBlockedUsers(response.data.data);
                } else {
                    toast.error("Failed to fetch blocked users");
                }
            } catch (error) {
                toast.error("Error fetching blocked users");
            }
        };

        fetchBlockedUsers();
    }, []);

    const handleUnblockClick = (user_id) => {
        setUserToUnblock(user_id);
        setConfirmationVisible(true);
    };

    const unblockUser = async () => {
        setLoading(true);
        setConfirmationVisible(false);

        try {
            const response = await api.post('/api/block-user', { user_id: userToUnblock });
            if (response.data.code == '200') {
                toast.success("User unblocked successfully!");
                setBlockedUsers(blockedUsers.filter(user => user.id !== userToUnblock));
            } else {
                toast.error("Failed to unblock user");
            }
        } catch (error) {
            toast.error("Error unblocking user");
        } finally {
            setLoading(false);
        }
    };

    const cancelUnblock = () => {
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
                                    <h5 className="mb-4 my-3 fw-bold">Blocked Users</h5>
                                    <hr className="text-muted" />

                                    {blockedUsers.length === 0 ? (
                                        <div className="my-sm-5 py-sm-5 text-center">
                                            <i className="display-1 text-muted bi bi-person-fill-slash"></i>
                                            <h4 className="mt-2 mb-3 text-muted">You currently have no blocked users.</h4>
                                        </div>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-striped table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Sr</th>
                                                        <th scope="col">User Name</th>
                                                        <th scope="col">Profile Image</th>
                                                        <th scope="col">Gender</th>
                                                        <th scope="col">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {blockedUsers.map((user, index) => (
                                                        <tr key={user.id}>
                                                            <td>{index + 1}</td>
                                                            <td className="fw-bold">{user.first_name} {user.last_name}</td>
                                                            <td>
                                                                <Image
                                                                    src={user.avatar}
                                                                    alt={user.username}
                                                                    className="rounded-circle"
                                                                    width={40}
                                                                    height={40}
                                                                    style={{ objectFit: "cover" }}
                                                                />
                                                            </td>
                                                            <td>{user.gender}</td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-primary btn-sm"
                                                                    onClick={() => handleUnblockClick(user.id)}
                                                                >
                                                                
                                                                    {loading && userToUnblock === user.id ? (
                                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                                    ) : (
                                                                        "Unblock"
                                                                    )}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
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
                                <h5 className="modal-title">Confirm Unblock</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={cancelUnblock}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to unblock this user? This action cannot be undone.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={cancelUnblock}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={unblockUser}>Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
