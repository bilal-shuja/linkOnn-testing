'use client';

import Navbar from "@/app/assets/components/navbar/page";
import React, { useState, useEffect } from "react";
import SettingNavbar from "../settingNav";
import createAPI from "@/app/lib/axios";
import useAuth from "@/app/lib/useAuth";
import { toast } from 'react-toastify';
import useConfirmationToast from "@/app/hooks/useConfirmationToast";

export default function SocialLinks() {
    useAuth();
    const api = createAPI();
    const [facebook, setFacebook] = useState("");
    const [twitter, setTwitter] = useState("");
    const [instagram, setInstagram] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [youtube, setYoutube] = useState("");

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

    const validateURL = (url) => {
        const urlPattern = /^(https?:\/\/)?(www\.)?([\w-]+)\.[a-z]{2,6}(\/[\w\-]*)*(\?[\w&%=]*)?$/;
        return urlPattern.test(url);
    };


    const handleUpdate = () => {
        if (![facebook, twitter, instagram, linkedin, youtube].every(url => url && validateURL(url))) {
            toast.error('Please enter valid URLs for all fields.');
            return;
        }
        showConfirmationToast();
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

                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred while updating social links.");
        }
    };


    const { showConfirmationToast } = useConfirmationToast({
        message: "Are you sure you want to update your social links?",
        onConfirm: confirmSocialLinksUpdate,
        onCancel: () => toast.dismiss(),
        confirmText: "Confirm",
        cancelText: "Cancel"
    });


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

                                    <div className="mt-3 gap-4 d-flex flex-wrap">
                                        {/* Facebook Input */}
                                        <div className="col-12 col-md-6 mb-3">
                                            <label className="form-label text-muted">Facebook</label>
                                            <div className="input-group">
                                                <span className="input-group-text border-0">
                                                    <i className="bi bi-facebook"></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="https://www.facebook.com/"
                                                    value={facebook}
                                                    onChange={(e) => setFacebook(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Twitter Input */}
                                        <div className="col-12 col-md-6 mb-3">
                                            <label className="form-label text-muted">Twitter</label>
                                            <div className="input-group">
                                                <span className="input-group-text border-0">
                                                    <i className="bi bi-twitter"></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="https://www.twitter.com/"
                                                    value={twitter}
                                                    onChange={(e) => setTwitter(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Instagram and LinkedIn Inputs */}
                                    <div className="mt-3 gap-4 d-flex flex-wrap">
                                        <div className="col-12 col-md-6 mb-3">
                                            <label className="form-label text-muted">Instagram</label>
                                            <div className="input-group">
                                                <span className="input-group-text border-0">
                                                    <i className="bi bi-instagram"></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="#"
                                                    value={instagram}
                                                    onChange={(e) => setInstagram(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6 mb-3">
                                            <label className="form-label text-muted">LinkedIn</label>
                                            <div className="input-group">
                                                <span className="input-group-text border-0">
                                                    <i className="bi bi-linkedin"></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="https://www.linkedin.com/"
                                                    value={linkedin}
                                                    onChange={(e) => setLinkedin(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* YouTube Input */}
                                    <div className="mt-3 gap-4">
                                        <div className="col-12 col-md-6 mb-3">
                                            <label className="form-label text-muted">YouTube</label>
                                            <div className="input-group">
                                                <span className="input-group-text border-0">
                                                    <i className="bi bi-youtube"></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="#"
                                                    value={youtube}
                                                    onChange={(e) => setYoutube(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Save Button */}
                                    <div className="mt-4 d-flex justify-content-end">
                                        <button className="btn btn-primary" onClick={handleUpdate}>
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
