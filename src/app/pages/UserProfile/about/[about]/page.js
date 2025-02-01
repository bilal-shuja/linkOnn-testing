"use client";

import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import RightNavbar from "../../components/right-navbar";
import Profilecard from "../../components/profile-card";
import { use } from "react";
import { toast } from "react-toastify";

export default function UserAbout({ params }) {
    const { about } = use(params);
    const api = createAPI();
    const [userdata, setUserData] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!about) return;
            try {
                const response = await api.get(`/api/get-user-profile?user_id=${about}`);
                if (response.data.code == "200") {
                    setUser(response.data.data);
                } else {
                    toast.error("Failed to fetch user profile.");
                }
            } catch (error) {
                toast.error("Error fetching user profile");
            }
        };

        fetchUserProfile();
    }, [about]);

    useEffect(() => {
        const data = localStorage.getItem("userdata");
        if (data) {
            setUserData(JSON.parse(data));
        }
    }, []);

    if (!user || !userdata) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }
    return (
        <>
            <div className="container mt-5 pt-4">
                <div className="row d-flex justify-content-between">
                    <div className="col-12 col-md-8">

                        <Profilecard user_id={about} />

                        <div className="card shadow-lg border-0 rounded-3 mt-5">
                            <div className="card-body">
                                <h5 className="fw-bold mt-1 mx-2">Profile Info</h5>
                                <div className="rounded border px-3 py-2 mb-3 mt-4">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h6 className="fw-semibold">Overview</h6>
                                    </div>
                                    <p className="text-muted"> {user.about_you} </p>
                                </div>
                                <div className="row g-4">
                                    <div className="col-6">
                                        <div className="d-flex align-items-center rounded border px-3 py-2">
                                            <p className="mb-0 text-muted">
                                                <i className="bi bi-calendar-date fa-fw me-2"></i> Born: <strong> {user.date_of_birth} </strong>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="d-flex align-items-center rounded border px-3 py-2">
                                            <p className="mb-0 text-muted">
                                                <i className="bi bi-heart fa-fw me-2"></i>
                                                Status:
                                                <strong className="mx-1">
                                                    {user.relation_id == '0' && (
                                                        <span>None</span>
                                                    )}
                                                    {user.relation_id == '1' && (
                                                        <span>Single</span>
                                                    )}
                                                    {user.relation_id == '2' && (
                                                        <span>In a Relationship</span>
                                                    )}
                                                    {user.relation_id == '3' && (
                                                        <span>Married</span>
                                                    )}
                                                    {user.relation_id == '4' && (
                                                        <span>Engaged</span>
                                                    )}
                                                </strong>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="d-flex align-items-center rounded border px-3 py-2">
                                            <p className="mb-0 text-muted">
                                                <i className="bi bi-briefcase fa-fw me-2"></i> <strong>{user.working?.trim() ? user.working : "None"}</strong>

                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="d-flex align-items-center rounded border px-3 py-2">
                                            <p className="mb-0 text-muted">
                                                <i className="bi bi-telephone fa-fw me-2"></i> Phone No: <strong> {user.phone} </strong>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="d-flex align-items-center rounded border px-3 py-2">
                                            <p className="mb-0 text-muted">
                                                <i className="bi bi-envelope fa-fw me-2"></i> Email: <strong> {user.email} </strong>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="d-flex align-items-center rounded border px-3 py-2">
                                            <p className="mb-0 text-muted">
                                                <i className="bi bi-geo-alt fa-fw me-2"></i> Lives in: <strong> {user.address} </strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <RightNavbar user={user} />
                </div>
            </div>
        </>
    );
}
