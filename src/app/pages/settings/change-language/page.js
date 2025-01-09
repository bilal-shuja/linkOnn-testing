'use client';

import Navbar from "@/app/assets/components/navbar/page";
import React, { useState, useEffect } from "react";
import SettingNavbar from "../settingNav";
import createAPI from "@/app/lib/axios";
import { useRouter } from "next/navigation";
import useAuth from "@/app/lib/useAuth";

export default function ChangeLang() {
    useAuth();
    const router = useRouter();
    const api = createAPI();
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        const data = localStorage.getItem("userdata");
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                setSelectedLanguage(parsedData.data.lang);
            } catch (error) {
                console.error("Failed to parse userdata from localStorage:", error);
            }
        }
    }, []);

    const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
    };

    const handleLanguage = async () => {
        setShowConfirmation(false);
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("lang", selectedLanguage);

            const response = await api.post("/api/update-user-profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.code === "200") {
                const userProfile = await api.get("/api/get-user-profile?user_id=" + localStorage.getItem("userid"));
                if (userProfile.data.code === "200") {
                    localStorage.setItem("userdata", JSON.stringify(userProfile.data));
                }
                setMessageType("success");
                setMessage(response.data.message);

                setTimeout(() => {
                    router.push('/pages/newsfeed');
                }, 2000);
            } else {
                setMessageType("error");
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Error updating language:", error);
            setMessageType("error");
            setMessage("An error occurred while updating the language.");
        } finally {
            setLoading(false);
        }
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
                                    <h5 className="mb-4 my-3 fw-bold">Change Language</h5>
                                    <hr className="text-muted" />
                                    {message && (
                                        <div
                                            className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"} text-center`}
                                            role="alert"
                                        >
                                            {message}
                                        </div>
                                    )}
                                    <div>
                                        <label htmlFor="languageSelect" className="form-label text-muted px-1">
                                            Select Language
                                        </label>
                                        <select
                                            id="languageSelect"
                                            className="form-select"
                                            value={selectedLanguage}
                                            onChange={handleLanguageChange}
                                        >
                                            <option value="ar">Arabic</option>
                                            <option value="de">German</option>
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                            <option value="nl">Dutch</option>
                                            <option value="ur">Urdu</option>
                                            <option value="zh">Chinese</option>
                                        </select>
                                    </div>
                                    <button
                                        className="btn btn-success my-3 rounded-1"
                                        onClick={() => setShowConfirmation(true)}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        ) : (
                                            "Update"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showConfirmation && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Language Change</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={() => setShowConfirmation(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to change the language? This will refresh the page.</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowConfirmation(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleLanguage}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
