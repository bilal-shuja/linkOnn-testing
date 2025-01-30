"use client";

import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import Image from "next/image";
import { use } from "react";
import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useConfirmationToast from "@/app/hooks/useConfirmationToast";
import RightNavbar from "../../components/right-navbar";


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

    const handlePoke = async (pokeId) => {
        try {
            const response = await api.post("/api/poke-user", {
                user_id: pokeId,
            });

            if (response.data.code == "200") {
                toast.success(response.data.message);
            } else {
                toast.error(`Error: ${response.data.message}`);
            }
        } catch (error) {
            toast.error("Error while Poking Back");
        }
    };

    const handleAddFriend = async (personId) => {
        try {
            const response = await api.post("/api/make-friend", { friend_two: personId })
            if (response.data.code == "200") {
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error("Error updating friend request.");
        }
    };

    const handleUnFriend = async (personId) => {
        try {
            const response = await api.post("/api/unfriend", { user_id: personId })
            if (response.data.code == "200") {
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error("Error in Unfriend");
        }
    };

    const handleCancelRequest = async (personId) => {
        try {
            const response = await api.post("/api/make-friend", { friend_two: personId })
            if (response.data.code == "200") {
                toast.success("Friend Request Cancelled")
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error("Error updating friend request.");
        }
    };

    return (
        <>
            <div className="container mt-5 pt-4">
                <div className="row d-flex justify-content-between">
                    <div className="col-12 col-md-8">
                        <div className="card shadow-lg border-0 rounded-3">
                            <div className="position-relative">
                                <Image
                                    src={user.cover}
                                    className="card-img-top rounded-top img-fluid"
                                    alt="cover"
                                    width={800}
                                    height={400}
                                    style={{ objectFit: 'cover', height: '200px' }}
                                />
                                <div
                                    className="position-absolute start-0 translate-middle-y ms-4"
                                    style={{ top: 'calc(125% - 31px)', zIndex: 2 }}
                                >
                                    <Image
                                        className="rounded-circle border border-white border-3 shadow-sm"
                                        src={user.avatar}
                                        alt="avatar"
                                        width={125}
                                        height={125}
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            </div>

                            <div className="card-body">
                                <div className=" mt-1" style={{ marginLeft: '10rem' }} >
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5 className="fw-bold text-dark">
                                                {user.first_name} {user.last_name}
                                                {user.user_level.verified_badge === '1' && (
                                                    <i className="bi bi-patch-check-fill text-success ms-2"></i>
                                                )}
                                            </h5>
                                            <div className="dropdown">
                                                <button
                                                    className="btn btn-light border-0 p-2"
                                                    type="button"
                                                    id="dropdownMenu"
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                >
                                                    <i className="fas fa-ellipsis-v"></i>
                                                </button>

                                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenu">
                                                    {userdata.data.id === friends && (
                                                        <li>
                                                            <button
                                                                className="dropdown-item d-flex align-items-center"
                                                                onClick={() => router.push('/pages/settings/general-settings')}
                                                            >
                                                                <i className="bi bi-pencil-fill me-3"></i> Edit Profile
                                                            </button>
                                                        </li>
                                                    )}


                                                    {userdata.data.id !== friends && user.isFriend === "1" && (
                                                        <li>
                                                            <button
                                                                className="dropdown-item d-flex align-items-center"
                                                                onClick={() => handlePoke(friends)}
                                                            >
                                                                <i className="fa fa-hand-point-right me-3"></i> Poke
                                                            </button>
                                                        </li>
                                                    )}

                                                    {userdata.data.id !== friends && (
                                                        <li>
                                                            <button
                                                                className="dropdown-item d-flex align-items-center"
                                                                onClick={() => {
                                                                    if (user.isPending === "1") {
                                                                        handleCancelRequest(friends);
                                                                    } else if (user.isFriend === "0") {
                                                                        handleAddFriend(friends);
                                                                    } else if (user.isFriend === "1") {
                                                                        handleUnFriend(friends);
                                                                    }
                                                                }}
                                                            >
                                                                {user.isFriend === "1" ? (
                                                                    <>
                                                                        <i className="bi bi-person-dash-fill me-3"></i> Unfriend
                                                                    </>
                                                                ) : user.isPending === "1" ? (
                                                                    <>
                                                                        <i className="bi bi-clock me-3"></i> Request Sent
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="bi bi-person-plus-fill me-3"></i> Add Friend
                                                                    </>
                                                                )}
                                                            </button>
                                                        </li>
                                                    )}

                                                    {userdata.data.id !== friends && (
                                                        <li>
                                                            <button className="dropdown-item d-flex align-items-center">
                                                                <i className="bi bi-chat-text me-3"></i> Message
                                                            </button>
                                                        </li>
                                                    )}

                                                </ul>
                                            </div>

                                        </div>
                                        <span className="badge bg-primary mt-1">
                                            {user.user_level.name == 'Premium' && (
                                                <i className="bi bi-diamond pe-1"></i>
                                            )}
                                            {user.user_level.name == 'basic' && (
                                                <i className="bi bi-star pe-1"></i>
                                            )}
                                            {user.user_level.name == 'Diamond' && (
                                                <i className="bi bi-gem pe-1"></i>
                                            )}
                                            {user.user_level.name}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-muted mt-4 mx-3">
                                    <i className="bi bi-calendar2-plus me-1"></i>
                                    Joined on {moment(user.created_at).format("MMM DD, YYYY")}

                                </p>

                                <hr className="text-muted" />

                                <div className="d-flex justify-content-start gap-4 ms-3">
                                    <Link href={`/pages/UserProfile/timeline/${friends}`} className="text-decoration-none text-muted">
                                        Posts
                                    </Link>
                                    <Link href={`/pages/UserProfile/about/${friends}`} className="text-decoration-none text-muted">
                                        About
                                    </Link>
                                    <Link href={`/pages/UserProfile/friends/${friends}`} className="d-flex justify-content-evenly align-items-center text-decoration-none text-light bg-primary rounded-pill px-2 fw-semibold ">
                                        Friends <span className="badge bg-success mx-1">{user.friends_count}</span>
                                    </Link>
                                    <Link href={`/pages/UserProfile/images/${friends}`} className="text-decoration-none text-muted">
                                        Photos
                                    </Link>
                                    <Link href={`/pages/UserProfile/videos/${friends}`} className="text-decoration-none text-muted">
                                        Videos
                                    </Link>
                                </div>
                            </div>
                        </div>


                        <div className="card shadow-lg border-0 p-3 mt-5">
                            <div className="card-body">
                                <h4 className="text-dark">Friends</h4>
                                <hr />
                                {loading && <div className="d-flex justify-content-center align-items-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>}
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
                                            You Currently Have No Friends.
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
                            </div>
                        </div>

                    </div>

                    <RightNavbar user={user} />

                </div>
            </div>
        </>
    );
}
