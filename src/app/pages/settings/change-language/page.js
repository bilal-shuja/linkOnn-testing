'use client'

import Navbar from "@/app/assets/components/navbar/page"
import React, { useState, useEffect } from "react"
import SettingNavbar from "../settingNav"
import createAPI from "@/app/lib/axios";
import { useRouter } from "next/navigation";

export default function ChangeLang() {
    const router = useRouter();
    const api = createAPI();
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

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

    const handleLanguage = async () => {
        const confirmation = window.confirm("Are you sure you want to change the language? This will refresh the page.");

        if (confirmation) {
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

                    setSuccess(response.data.message);
                    setTimeout(() => {
                        router.push('/pages/newsfeed');
                    }, 2000);
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                setError("An error occurred while updating the language.");
            }
        } else {
            setError("Language change canceled.");
        }
    };

    const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
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
                                    <div>
                                        <label className="form-label text-muted px-1">Select Language</label>
                                        <select
                                            className="form-select form-select"
                                            value={selectedLanguage}
                                            onChange={handleLanguageChange}
                                        >
                                            <option value="ar">ar</option>
                                            <option value="de">de</option>
                                            <option value="en">en</option>
                                            <option value="es">es</option>
                                            <option value="fr">fr</option>
                                            <option value="nl">nl</option>
                                            <option value="ur">ur</option>
                                            <option value="zh">zh</option>
                                        </select>
                                    </div>
                                    <button className="btn btn-success my-3 rounded-1" onClick={handleLanguage}>Update</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
