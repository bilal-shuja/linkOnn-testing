'use client';

 
import React, { useState, useEffect } from "react";
import SettingNavbar from "../settingNav";
import createAPI from "@/app/lib/axios";
   
import { toast } from 'react-toastify';
import useConfirmationToast from "@/app/hooks/useConfirmationToast";

export default function NotificationSettings() {
      
    const api = createAPI();
    const [notify_like, setNotifyLike] = useState(false);
    const [commentedPosts, setCommentedPosts] = useState(false);
    const [sharedPosts, setSharedPosts] = useState(false);
    const [friendRequests, setFriendRequests] = useState(false);
    const [likedPages, setLikedPages] = useState(false);
    const [joinedGroups, setJoinedGroups] = useState(false);
    const [receivedMessages, setReceivedMessages] = useState(false);
    const [friendsNewPosts, setFriendsNewPosts] = useState(false);
    const [profileVisits, setProfileVisits] = useState(false);

    useEffect(() => {
        const data = localStorage.getItem("userdata");
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                setNotifyLike(parsedData.data.notify_like === "1");
                setCommentedPosts(parsedData.data.notify_comment === "1");
                setSharedPosts(parsedData.data.notify_share_post === "1");
                setFriendRequests(parsedData.data.notify_accept_request === "1");
                setLikedPages(parsedData.data.notify_liked_page === "1");
                setJoinedGroups(parsedData.data.notify_joined_group === "1");
                setReceivedMessages(parsedData.data.notify_message === "1");
                setFriendsNewPosts(parsedData.data.notify_friends_newpost === "1");
                setProfileVisits(parsedData.data.notify_profile_visit === "1");
            } catch (error) {
                toast.error("Failed to parse userdata from localStorage:", error);
            }
        }
    }, []);

    const handleToggle = (setter) => {
        setter((prev) => !prev);
    };

    const handleUpdate = async () => {
        showConfirmationToast();
    };

    const confirmUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append("notify_like", notify_like ? 1 : 0);
            formData.append("notify_comment", commentedPosts ? 1 : 0);
            formData.append("notify_share_post", sharedPosts ? 1 : 0);
            formData.append("notify_accept_request", friendRequests ? 1 : 0);
            formData.append("notify_liked_page", likedPages ? 1 : 0);
            formData.append("notify_joined_group", joinedGroups ? 1 : 0);
            formData.append("notify_message", receivedMessages ? 1 : 0);
            formData.append("notify_friends_newpost", friendsNewPosts ? 1 : 0);
            formData.append("notify_profile_visit", profileVisits ? 1 : 0);

            const response = await api.post("/api/update-user-profile", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.code === "200") {
                const userProfile = await api.get("/api/get-user-profile?user_id=" + localStorage.getItem("userid"));
                if (userProfile.data.code === "200") {
                    localStorage.setItem("userdata", JSON.stringify(userProfile.data));
                }

                toast.success(response.data.message);
            } else {

                toast.error(response.data.message);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred.";
            toast.error(errorMessage);
        }
    };

    const { showConfirmationToast } = useConfirmationToast({
        message: "Are you sure you want to save the changes to your notifications settings?",
        onConfirm: confirmUpdate,
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
                                    <h5 className="mb-4 my-3 fw-bold">Notification Settings</h5>
                                    <hr className="text-muted" />
                                    <ul className="list-unstyled">
                                        <li className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-hand-thumbs-up me-3 fs-5 text-primary"></i>
                                                <div>
                                                    <strong>Liked My Posts</strong>
                                                    <br />
                                                    <small className="text-muted">Get notifications when someone likes your post</small>
                                                </div>
                                            </div>
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    role="switch"
                                                    checked={notify_like}
                                                    onChange={() => handleToggle(setNotifyLike)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </div>
                                        </li>

                                        <li className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-chat me-3 fs-5 text-primary"></i>
                                                <div>
                                                    <strong>Commented on My Posts</strong>
                                                    <br />
                                                    <small className="text-muted">Get notifications for comments on your posts</small>
                                                </div>
                                            </div>
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    role="switch"
                                                    checked={commentedPosts}
                                                    onChange={() => handleToggle(setCommentedPosts)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </div>
                                        </li>

                                        <li className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-share me-3 fs-5 text-primary"></i>
                                                <div>
                                                    <strong>Shared My Posts</strong>
                                                    <br />
                                                    <small className="text-muted">Be notified when someone shares your posts</small>
                                                </div>
                                            </div>
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    role="switch"
                                                    checked={sharedPosts}
                                                    onChange={() => handleToggle(setSharedPosts)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </div>
                                        </li>

                                        <li className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-person-check me-3 fs-5 text-primary"></i>
                                                <div>
                                                    <strong>Accepted Friend/Follow Request</strong>
                                                    <br />
                                                    <small className="text-muted">Know when your friend/follow request is accepted</small>
                                                </div>
                                            </div>
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    role="switch"
                                                    checked={friendRequests}
                                                    onChange={() => handleToggle(setFriendRequests)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </div>
                                        </li>

                                        <li className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-hand-thumbs-up me-3 fs-5 text-primary"></i>
                                                <div>
                                                    <strong>Liked My Pages</strong>
                                                    <br />
                                                    <small className="text-muted">Get notified when someone likes your pages</small>
                                                </div>
                                            </div>
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    role="switch"
                                                    checked={likedPages}
                                                    onChange={() => handleToggle(setLikedPages)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </div>
                                        </li>

                                        <li className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-people me-3 fs-5 text-primary"></i>
                                                <div>
                                                    <strong>Joined My Groups</strong>
                                                    <br />
                                                    <small className="text-muted">Find out when someone joins your groups</small>
                                                </div>
                                            </div>
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    role="switch"
                                                    checked={joinedGroups}
                                                    onChange={() => handleToggle(setJoinedGroups)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </div>
                                        </li>

                                        <li className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-envelope me-3 fs-5 text-primary"></i>
                                                <div>
                                                    <strong>Received Message</strong>
                                                    <br />
                                                    <small className="text-muted">Receive notifications for new messages</small>
                                                </div>
                                            </div>
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    role="switch"
                                                    checked={receivedMessages}
                                                    onChange={() => handleToggle(setReceivedMessages)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </div>
                                        </li>

                                        <li className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-pencil-square me-3 fs-5 text-primary"></i>
                                                <div>
                                                    <strong>Friends New Post</strong>
                                                    <br />
                                                    <small className="text-muted">Receive notifications for new posts by friends</small>
                                                </div>
                                            </div>
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    role="switch"
                                                    checked={friendsNewPosts}
                                                    onChange={() => handleToggle(setFriendsNewPosts)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </div>
                                        </li>

                                        <li className="d-flex justify-content-between align-items-center py-2">
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-eye me-3 fs-5 text-primary"></i>
                                                <div>
                                                    <strong>Profile Visits</strong>
                                                    <br />
                                                    <small className="text-muted">Get notifications when someone visits your profile</small>
                                                </div>
                                            </div>
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    role="switch"
                                                    checked={profileVisits}
                                                    onChange={() => handleToggle(setProfileVisits)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </div>
                                        </li>
                                    </ul>

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
