"use client";

import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import React, { useState, useEffect, use } from "react";
import GroupProfilecard from "../../components/group-card";
import RightNavbar from "../../components/right-navbar";

export default function GroupAbout({ params }) {
    const resolvedParams = use(params);
    const { about } = resolvedParams;
    const api = createAPI();

    const [groupData, setGroupData] = useState(null);

    useEffect(() => {
        const fetchGroupData = async () => {
            if (!about) return;
            try {
                const response = await api.post(`/api/get-group-data?group_id=${about}`);
                if (response.data.code === "200") {
                    setGroupData(response.data.data);
                } else {
                    toast.error("Failed to fetch group data.");
                }
            } catch (error) {
                toast.error("Error fetching group data.");
            }
        };

        fetchGroupData();
    }, [about]);

    if (!groupData) {
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
                        <GroupProfilecard group_id={about} />

                        <div className="card shadow-lg border-0 rounded-3 mt-3">
                            <div className="card-body">
                                <h4 className="fw-bold text-primary mb-4">Group Profile Info</h4>

                                <div className="rounded border p-3 mb-4 bg-light">
                                    <h6 className="fw-semibold text-secondary">Overview</h6>
                                    <p className="text-muted mb-0">{groupData.about_group || "No overview available."}</p>
                                </div>

                                <div className="row g-4">
                                    <DetailSection
                                        icon="bi-people"
                                        label="Members Count"
                                        value={groupData.members_count || "N/A"}
                                    />
                                    <DetailSection
                                        icon="bi-shield-lock"
                                        label="Privacy"
                                        value={groupData.privacy || "N/A"}
                                    />
                                    <DetailSection
                                        icon="bi-card-checklist"
                                        label="Category"
                                        value={groupData.category || "N/A"}
                                    />
                                    <DetailSection
                                        icon="bi-calendar"
                                        label="Created on"
                                        value={formatDate(groupData.created_at) || "N/A"}
                                    />
                                </div>
                            </div>
                        </div>


                    </div>
                        <RightNavbar group_id={about} />

                </div>
            </div>
        </>

    );
}


const DetailSection = ({ label, icon, value }) => (
    <div className="col-6">
        <div className="d-flex align-items-center rounded border px-3 py-2 bg-white shadow-sm">
            <i className={`bi ${icon} text-primary me-2`} style={{ fontSize: "1.2rem" }}></i>
            <p className="mb-0 text-muted">
                {label}: <strong className="text-muted">{value}</strong>
            </p>
        </div>
    </div>

);


const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });
};
