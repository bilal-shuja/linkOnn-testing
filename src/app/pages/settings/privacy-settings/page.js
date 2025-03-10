'use client';

 
import React, { useState, useEffect } from "react";
import SettingNavbar from "../settingNav";
import createAPI from "@/app/lib/axios";
   
import { toast } from 'react-toastify';
import useConfirmationToast from "@/app/pages/Modals/useConfirmationToast";

export default function PrivacySettings() {
      
    const api = createAPI();
    const [friendRequest, setFriendRequest] = useState(false);
    const [message, setMessage] = useState(false);
    const [viewEmail, setViewEmail] = useState(false);
    const [viewPhone, setViewPhone] = useState(false);
    const [seeFriends, setSeeFriends] = useState(false);
    const [birthday, setBirthday] = useState(false);

    useEffect(() => {
        const data = localStorage.getItem("userdata");
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                setFriendRequest(parsedData.data.privacy_friends);
                setMessage(parsedData.data.privacy_message);
                setViewEmail(parsedData.data.privacy_view_email);
                setViewPhone(parsedData.data.privacy_view_phone);
                setSeeFriends(parsedData.data.privacy_see_friend);
                setBirthday(parsedData.data.privacy_birthday);
            } catch (error) {
                toast.error("Failed to parse userdata from localStorage:", error);
            }
        }
    }, []);

    const handlePrivacyChange = (setter) => (e) => {
        setter(e.target.value);
    };

    const handleUpdate = () => {
        showConfirmationToast();
    };

    const confirmPrivacyChange = async () => {
        try {
            const formData = new FormData();
            formData.append("privacy_friends", friendRequest);
            formData.append("privacy_message", message);
            formData.append("privacy_view_email", viewEmail);
            formData.append("privacy_view_phone", viewPhone);
            formData.append("privacy_see_friend", seeFriends);
            formData.append("privacy_birthday", birthday);

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
            toast.error("An error occurred while updating privacy settings.");
        }
    };

    const { showConfirmationToast } = useConfirmationToast({
        message: "Are you sure you want to save the changes to your privacy settings?",
        onConfirm: confirmPrivacyChange,
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
                                    <h5 className="mb-4 fw-bold my-3">Privacy Settings</h5>
                                    <hr className="text-muted" />
                                    <div className="d-flex justify-content-between align-items-center py-3 gap-5">
                                        <div className="d-flex align-items-center w-50">
                                            <i className="bi bi-person-plus me-3 fs-5 text-primary"></i>
                                            <div>
                                                <strong>Who can send friend request?</strong>
                                                <br />
                                                <small className="text-muted">Control who can send you friend requests</small>
                                            </div>
                                        </div>
                                        <div className="w-25">
                                            <select
                                                className="form-select"
                                                value={friendRequest}
                                                onChange={handlePrivacyChange(setFriendRequest)}
                                            >
                                                <option value="0">Everyone</option>
                                                <option value="1">Mutual Friends</option>
                                                <option value="2">No one</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center py-3 gap-5">
                                        <div className="d-flex align-items-center w-50">
                                            <i className="bi bi-envelope me-3 fs-5 text-primary"></i>
                                            <div>
                                                <strong>Who can message me?</strong>
                                                <br />
                                                <small className="text-muted">Set who can send you private messages</small>
                                            </div>
                                        </div>
                                        <div className="w-25">
                                            <select
                                                className="form-select"
                                                value={message}
                                                onChange={handlePrivacyChange(setMessage)}
                                            >
                                                <option value="0">Everyone</option>
                                                <option value="1">Friends</option>
                                                <option value="2">No one</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center py-3 gap-5">
                                        <div className="d-flex align-items-center w-50">
                                            <i className="bi bi-envelope-at me-3 fs-5 text-primary"></i>
                                            <div>
                                                <strong>Who can view my Email Address?</strong>
                                                <br />
                                                <small className="text-muted">Set who can view your email address</small>
                                            </div>
                                        </div>
                                        <div className="w-25">
                                            <select
                                                className="form-select"
                                                value={viewEmail}
                                                onChange={handlePrivacyChange(setViewEmail)}
                                            >
                                                <option value="0">Everyone</option>
                                                <option value="1">Friends</option>
                                                <option value="2">No one</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center py-3 gap-5">
                                        <div className="d-flex align-items-center w-50">
                                            <i className="bi bi-telephone me-3 fs-5 text-primary"></i>
                                            <div>
                                                <strong>Who can view my Phone?</strong>
                                                <br />
                                                <small className="text-muted">Set who can view your phone number</small>
                                            </div>
                                        </div>
                                        <div className="w-25">
                                            <select
                                                className="form-select"
                                                value={viewPhone}
                                                onChange={handlePrivacyChange(setViewPhone)}
                                            >
                                                <option value="0">Everyone</option>
                                                <option value="1">Friends</option>
                                                <option value="2">No one</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center py-3 gap-5">
                                        <div className="d-flex align-items-center w-50">
                                            <i className="bi bi-people me-3 fs-5 text-primary"></i>
                                            <div>
                                                <strong>Who can see my friends?</strong>
                                                <br />
                                                <small className="text-muted">Choose who can see your friend list</small>
                                            </div>
                                        </div>
                                        <div className="w-25">
                                            <select
                                                className="form-select"
                                                value={seeFriends}
                                                onChange={handlePrivacyChange(setSeeFriends)}
                                            >
                                                <option value="0">Everyone</option>
                                                <option value="1">Friends</option>
                                                <option value="2">No one</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center py-3 gap-5">
                                        <div className="d-flex align-items-center w-50">
                                            <i className="bi bi-calendar-event me-3 fs-5 text-primary"></i>
                                            <div>
                                                <strong>Who can see my birthday?</strong>
                                                <br />
                                                <small className="text-muted">Control who can view your birthday</small>
                                            </div>
                                        </div>
                                        <div className="w-25">
                                            <select
                                                className="form-select"
                                                value={birthday}
                                                onChange={handlePrivacyChange(setBirthday)}
                                            >
                                                <option value="0">Everyone</option>
                                                <option value="1">Friends</option>
                                                <option value="2">No one</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="text-end mt-3">
                                        <button className="btn btn-primary" onClick={handleUpdate}>Save Changes</button>
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
