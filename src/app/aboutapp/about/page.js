"use client";

import React, { useEffect, useState } from "react";
import api from "@/app/lib/auth/axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./AboutPage.module.css";

export default function About() {
    const [aboutData, setAboutData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAbout = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/api/custom-page/about`);

            if (response.data.status === "200") {
                setAboutData(response.data.data);
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
        fetchAbout();
    }, []);

    return (
        <div className={`container d-flex align-items-center justify-content-center min-vh-100 ${styles.aboutContainer}`}>
            <div className="col-md-10 col-lg-8">
                <div className="card shadow-lg">
                    {/* Blue Header */}
                    <div className="card-header bg-primary text-white text-center py-4">
                        <h2 className="mb-0">{aboutData?.page_title || "About Us"}</h2>
                    </div>

                    {/* Content */}
                    <div className="card-body p-4">
                        {isLoading ? (
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : aboutData ? (
                            <>
                                <div className="about-content" dangerouslySetInnerHTML={{ __html: aboutData.page_content }} />
                            </>
                        ) : (
                            <p className="text-danger text-center">No data available</p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="card-footer text-center text-muted">
                        Last updated: {aboutData?.updated_at ? new Date(aboutData.updated_at).toLocaleDateString() : "N/A"}
                    </div>
                </div>
            </div>
        </div>
    );
}
