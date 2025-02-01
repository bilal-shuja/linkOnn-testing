"use client";

import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import RightNavbar from "../../components/right-navbar";
import { use } from "react";
import { toast } from "react-toastify";
import Profilecard from "../../components/profile-card";

export default function Common({ params }) {
    const { common } = use(params);
    const api = createAPI();
    const [userdata, setUserData] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!common) return;
            try {
                const response = await api.get(`/api/get-user-profile?user_id=${common}`);
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
    }, [common]);

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

                        <Profilecard user_id={common} />

                        <div className="card shadow-lg border-0 rounded-3 mt-5">
                            <div className="card-body">
                                <h5 className="fw-bold mt-1 mx-2">Common Interest</h5>
                            </div>
                        </div>

                    </div>
                    <RightNavbar user={user} />
                </div>
            </div>
        </>
    );
}
