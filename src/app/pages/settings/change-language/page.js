'use client';

 
import React, { useState, useEffect } from "react";
import SettingNavbar from "../settingNav";
import createAPI from "@/app/lib/axios";
import { useRouter } from "next/navigation";
   
import { toast } from "react-toastify";
import useConfirmationToast from "@/app/pages/Modals/useConfirmationToast";

export default function ChangeLang() {
      
    const router = useRouter();
    const api = createAPI();
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [loading, setLoading] = useState(false);

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
                toast.success(response.data.message, { position: "top-center" });

                setTimeout(() => {
                    router.push('/pages/newsfeed');
                }, 2000);
            } else {
                toast.error(response.data.message, { position: "top-center" });
            }
        } catch (error) {
            toast.error("An error occurred while updating the language.", { position: "top-center" });
        } finally {
            setLoading(false);
        }
    };

    const { showConfirmationToast } = useConfirmationToast({
        message: "Are you sure you want to change the language? This will refresh the page.",
        onConfirm: handleLanguage,
        onCancel: () => toast.dismiss(),
        confirmText: "Confirm",
        cancelText: "Cancel"
    });

    return (
        <div>
              
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
                                        onClick={showConfirmationToast}
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
        </div>
    );
}
