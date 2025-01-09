'use client';

import Navbar from "@/app/assets/components/navbar/page";
import React, { useState, useEffect } from "react";
import SettingNavbar from "../settingNav";
import createAPI from "@/app/lib/axios";
import useAuth from "@/app/lib/useAuth";

export default function SocialLinks() {
    useAuth();
    const api = createAPI();
    const [facebook, setFacebook] = useState("");
    const [twitter, setTwitter] = useState("");
    const [instagram, setInstagram] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [youtube, setYoutube] = useState("");

    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const [feedbackMessage, setFeedbackMessage] = useState(''); // Message to display
    const [confirmationVisible, setConfirmationVisible] = useState(false); // Show confirmation dialog

    useEffect(() => {
        const data = localStorage.getItem("userdata");
        if (data) {
            const parsedData = JSON.parse(data);
            setFacebook(parsedData?.data?.facebook || '');
            setTwitter(parsedData?.data?.twitter || '');
            setInstagram(parsedData?.data?.instagram || '');
            setLinkedin(parsedData?.data?.linkedin || '');
            setYoutube(parsedData?.data?.youtube || '');
        }
    }, []);

    const handleUpdate = () => {
        setConfirmationVisible(true); // Show confirmation dialog
    };

    const confirmSocialLinksUpdate = async () => {
        try {
            const formData = new FormData();

            formData.append("facebook", facebook);
            formData.append("twitter", twitter);
            formData.append("instagram", instagram);
            formData.append("linkedin", linkedin);
            formData.append("youtube", youtube);

            const response = await api.post("/api/update-user-profile", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.code === "200") {
                const userProfile = await api.get(
                    "/api/get-user-profile?user_id=" + localStorage.getItem("userid")
                );

                if (userProfile.data.code === "200") {
                    localStorage.setItem("userdata", JSON.stringify(userProfile.data));
                }

                setMessageType('success');
                setFeedbackMessage(response.data.message);
            } else {
                setMessageType('error');
                setFeedbackMessage(response.data.message);
            }
        } catch (error) {
            setMessageType('error');
            setFeedbackMessage("An error occurred while updating social links.");
        }
        setConfirmationVisible(false); // Hide confirmation dialog
    };

    const cancelSocialLinksUpdate = () => {
        setConfirmationVisible(false); // Hide confirmation dialog without making changes
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
                                    <h4 className="fs-5 fw-bold my-3">Social Settings</h4>
                                    <hr className="text-muted" />
                                    <div>
                                        <div className="mt-3 gap-4 d-flex flex-wrap">
                                            <div className="col-12 col-md-6 mb-3">
                                                <label className="form-label text-muted">Facebook</label>
                                                <div className="input-group">
                                                    <span className="input-group-text border-0">
                                                        <i className="bi bi-facebook" aria-label="Facebook Icon"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="https://www.facebook.com/"
                                                        value={facebook}
                                                        onChange={(e) => setFacebook(e.target.value)}
                                                        aria-invalid="false"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-6 mb-3">
                                                <label className="form-label text-muted">Twitter</label>
                                                <div className="input-group">
                                                    <span className="input-group-text border-0">
                                                        <i className="bi bi-twitter" aria-label="Twitter Icon"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="https://www.twitter.com/"
                                                        value={twitter}
                                                        onChange={(e) => setTwitter(e.target.value)}
                                                        aria-invalid="false"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 gap-4 d-flex flex-wrap">
                                            <div className="col-12 col-md-6 mb-3">
                                                <label className="form-label text-muted">Instagram</label>
                                                <div className="input-group">
                                                    <span className="input-group-text border-0">
                                                        <i className="bi bi-instagram" aria-label="Instagram Icon"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="#"
                                                        value={instagram}
                                                        onChange={(e) => setInstagram(e.target.value)}
                                                        aria-invalid="false"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-6 mb-3">
                                                <label className="form-label text-muted">LinkedIn</label>
                                                <div className="input-group">
                                                    <span className="input-group-text border-0">
                                                        <i className="bi bi-linkedin" aria-label="LinkedIn Icon"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="https://www.linkedin.com/"
                                                        value={linkedin}
                                                        onChange={(e) => setLinkedin(e.target.value)}
                                                        aria-invalid="false"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 gap-4">
                                            <div className="col-12 col-md-6 mb-3">
                                                <label className="form-label text-muted">YouTube</label>
                                                <div className="input-group">
                                                    <span className="input-group-text border-0">
                                                        <i className="bi bi-youtube" aria-label="YouTube Icon"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="#"
                                                        value={youtube}
                                                        onChange={(e) => setYoutube(e.target.value)}
                                                        aria-invalid="false"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 d-flex justify-content-end">
                                        <button className="btn btn-primary" onClick={handleUpdate}>Save Changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
