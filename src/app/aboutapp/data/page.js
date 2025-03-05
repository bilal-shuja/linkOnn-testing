"use client";

import React, { useEffect, useState } from "react";
import api from "@/app/lib/auth/axios";
import styles from "./DataPage.module.css";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function About() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/api/custom-page/data-deletion-request`);

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
        fetchData();
    }, []);

    return (
        <div className={`${styles.pageWrapper} py-5`}>
            <div className="container">
                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : data ? (
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className={`${styles.pageCard} card shadow-lg border-0`}>
                                <div className={`${styles.cardHeader} card-header bg-primary text-white text-center py-4`}>
                                    <div className={styles.iconContainer}>
                                        <FaLock className={styles.headerIcon} />
                                    </div>
                                    <h1 className={styles.pageTitle}>{data.page_title}</h1>
                                </div>
                                <div className="card-body p-md-5">
                                    <div 
                                        className={styles.pageContent}
                                        dangerouslySetInnerHTML={{ __html: data.page_content }}
                                    />
                                    <div className={`${styles.contactBox} mt-5 p-4 bg-light rounded`}>
                                        <div className="d-flex align-items-center mb-3">
                                            <FaEnvelope className="text-primary me-2" size={24} />
                                            <h5 className="mb-0">Contact Us</h5>
                                        </div>
                                        <p className="mb-0">
                                            If you have any questions about the data deletion process, please do not hesitate to reach out to our support team.
                                        </p>
                                    </div>
                                </div>
                                <div className={`${styles.cardFooter} card-footer text-center py-3 text-muted`}>
                                    <small>Last updated: {new Date(data.updated_at).toLocaleDateString()}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="alert alert-warning" role="alert">
                        No content available.
                    </div>
                )}
            </div>
        </div>
    );
}