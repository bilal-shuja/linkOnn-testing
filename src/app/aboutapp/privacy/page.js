"use client";

import React, { useEffect, useState } from "react";
import api from "@/app/lib/auth/axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./PrivacyPage.module.css";

export default function Privacy() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPrivacy = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/api/custom-page/privacy-policy`);

            if (response.data.status === "200") {
                setData(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to fetch data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPrivacy();
    }, []);

    return (
        <div className={`container d-flex align-items-center justify-content-center min-vh-100 my-5 ${styles.privacyContainer}`}>
            <div className="col-md-10 col-lg-8">
                <div className="card shadow-lg">
                    {/* Blue Header */}
                    <div className="card-header bg-primary text-white text-center py-4">
                        <h2 className="mb-0">Privacy Policy</h2>
                    </div>

                    {/* Content */}
                    <div className="card-body p-4">
                        {isLoading ? (
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : data ? (
                            <>
                                <div className="privacy-content" dangerouslySetInnerHTML={{ __html: data.page_content }} />
                            </>
                        ) : (
                            <p className="text-danger text-center">No data available</p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="card-footer text-center text-muted">
                        Last updated: {new Date().toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    );
}
