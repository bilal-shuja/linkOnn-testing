"use client";

import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import RightNavbar from "../../components/right-navbar";
import Profilecard from "../../components/profile-card";
import React, { useState, useEffect, use } from "react";


export default function UserAbout({ params }) {
    const resolvedParams = use(params);
    const { about } = resolvedParams;
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
                                <h4 className="fw-bold text-primary mb-4">Profile Information</h4>

                                {/* Overview Section */}
                                <div className="rounded border p-3 mb-4 bg-light">
                                    <h6 className="fw-semibold text-secondary">Overview</h6>
                                    <p className="text-muted mb-0">{user.about_you || "No overview available."}</p>
                                </div>

                                {/* Profile Details Grid */}
                                <div className="row g-4">
                                    <ProfileDetail
                                        icon="bi-calendar-date"
                                        label="Born"
                                        value={user.date_of_birth || "N/A"}
                                    />
                                    <ProfileDetail
                                        icon="bi-heart"
                                        label="Status"
                                        value={getRelationshipStatus(user.relation_id)}
                                    />
                                    <ProfileDetail
                                        icon="bi-briefcase"
                                        label="Work"
                                        value={user.working?.trim() ? user.working : "None"}
                                    />
                                    <ProfileDetail
                                        icon="bi-telephone"
                                        label="Phone No"
                                        value={user.phone || "N/A"}
                                    />
                                    <ProfileDetail
                                        icon="bi-envelope"
                                        label="Email"
                                        value={user.email || "N/A"}
                                    />
                                    <ProfileDetail
                                        icon="bi-geo-alt"
                                        label="Lives in"
                                        value={user.address || "N/A"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <RightNavbar user={user} />
                </div>
            </div>
        </>
    );
}

/* ✅ Component for Profile Detail Items */
const ProfileDetail = ({ icon, label, value }) => (
    <div className="col-6">
        <div className="d-flex align-items-center rounded border px-3 py-2 bg-white shadow-sm">
            <i className={`bi ${icon} text-primary me-2`} style={{ fontSize: "1.2rem" }}></i>
            <p className="mb-0 text-muted">
                {label}: <strong className="text-dark">{value}</strong>
            </p>
        </div>
    </div>
);

/* ✅ Function to Handle Relationship Status */
const getRelationshipStatus = (relation_id) => {
    const statuses = {
        "0": "None",
        "1": "Single",
        "2": "In a Relationship",
        "3": "Married",
        "4": "Engaged",
    };
    return statuses[relation_id] || "Unknown";
};
