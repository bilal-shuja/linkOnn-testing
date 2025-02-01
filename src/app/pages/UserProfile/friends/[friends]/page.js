"use client";

import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import Image from "next/image";
import { use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useConfirmationToast from "@/app/hooks/useConfirmationToast";
import RightNavbar from "../../components/right-navbar";
import Profilecard from "../../components/profile-card";

export default function UserFriends({ params }) {
    const { friends } = use(params);
    const api = createAPI();
    const router = useRouter();
    const [userdata, setUserData] = useState(null);
    const [user, setUser] = useState(null);
    const [friendsList, setFriendsList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!friends) return;
            try {
                const response = await api.get(`/api/get-user-profile?user_id=${friends}`);
                if (response.data.code == "200") {
                    setUser(response.data.data);
                } else {
                    toast.error("Failed to fetch user profile.");
                }
            } catch (error) {
                toast.error("Error fetching user profile");
            }
        };

        fetchUserProfile();
    }, [friends]);

    const fetchFriends = async () => {
        try {
            setLoading(true);
            const response = await api.post("/api/get-friends", {
                user_id: friends,
                limit: '500'
            });
            if (response.data.code == "200") {
                setFriendsList(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error fetching friends.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    useEffect(() => {
        const data = localStorage.getItem("userdata");
        if (data) {
            setUserData(JSON.parse(data));
        }
    }, []);

    const handleUnfriend = (friendId) => {
        showConfirmationToast([friendId]);
    };

    const Unfriend = async (friendId) => {
        try {
            const response = await api.post("/api/unfriend", { user_id: friendId });

            if (response.data.code === "200") {
                setFriendsList((prevFriends) =>
                    prevFriends.filter((friend) => friend.id !== friendId)
                );
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error");
        }
    };

    const { showConfirmationToast } = useConfirmationToast({
        message: "Are you sure you want to unfriend this person?",
        onConfirm: Unfriend,
        onCancel: () => toast.dismiss(),
        confirmText: 'Unfriend',
        cancelText: 'Cancel',
    });


    if (!user || !userdata) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="container mt-5 pt-4">
                <div className="row d-flex justify-content-between">
                    <div className="col-12 col-md-8">

                        <Profilecard user_id={friends} />

                        <div className="card shadow-lg border-0 p-3 mt-5">
                            <div className="card-body">
                                <h4 className="text-dark">Friends</h4>
                                <hr />
                                {loading ? (
                                    <div className="d-flex justify-content-center align-items-center">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {friendsList.length === 0 ? (
                                            <div className="text-center">
                                                <i
                                                    className="bi bi-people text-secondary"
                                                    style={{ fontSize: "3rem" }}
                                                ></i>
                                                <p
                                                    className="mt-3 text-secondary fw-semibold"
                                                    style={{ fontSize: "1.5rem" }}
                                                >
                                                    No Friends.
                                                </p>
                                            </div>
                                        ) : (
                                            friendsList.map((friend, index) => (
                                                <div
                                                    key={`${friend.id}-${index}`}
                                                    className="d-flex justify-content-between align-items-center mb-4 mx-3"
                                                >
                                                    <div className="d-flex align-items-center">
                                                        <Image
                                                            src={friend.avatar}
                                                            alt={`${friend.first_name} ${friend.last_name}`}
                                                            className="rounded-circle"
                                                            width={50}
                                                            height={50}
                                                            style={{
                                                                objectFit: "cover",
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() =>
                                                                router.push(`/pages/UserProfile/timeline/${friend.id}`)
                                                            }
                                                        />

                                                        <div className="ms-3">
                                                            <h6
                                                                className="mb-0"
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() =>
                                                                    router.push(`/pages/UserProfile/timeline/${friend.id}`)
                                                                }
                                                            >
                                                                {friend.first_name} {friend.last_name}
                                                            </h6>
                                                            <small>{friend.details.mutualfriendsCount} Mutual Friends</small>
                                                        </div>
                                                    </div>

                                                    {userdata.data.id === friends && (
                                                        <button
                                                            className="btn btn-danger rounded-2 border border-0 mx-3"
                                                            onClick={() => handleUnfriend(friend.id)}
                                                        >
                                                            Unfriend
                                                        </button>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <RightNavbar user={user} />

                </div>
            </div>
        </>
    );
}
