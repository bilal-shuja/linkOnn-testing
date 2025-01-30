"use client";

import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import RightNavbar from "../../components/right-navbar";
import Image from "next/image";
import { use } from "react";
import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function UserImages({ params }) {
    const { images } = use(params);
    const api = createAPI();
    const router = useRouter();
    const [userdata, setUserData] = useState(null);
    const [user, setUser] = useState(null);
    const [postImages, setPostImages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!images) return;
            try {
                const response = await api.get(`/api/get-user-profile?user_id=${images}`);
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
    }, [images]);

    useEffect(() => {
        const data = localStorage.getItem("userdata");
        if (data) {
            setUserData(JSON.parse(data));
        }
    }, []);

    const fetchPosts = async () => {
        if (loading) return;

        try {
            setLoading(true);

            const response = await api.post("/api/post/newsfeed", {
                user_id: images,
                post_type: "post",
                limit: '1000',
            });

            if (response.data && Array.isArray(response.data.data)) {
                const newPosts = response.data.data;

                const imagesFromPosts = newPosts
                    .filter(post => post.images && Array.isArray(post.images) && post.images.length > 0)
                    .map(post => post.images[0].media_path);

                setPostImages(imagesFromPosts);
            } else {
                toast.error("Invalid data format received from API.");
            }
        } catch (error) {
            toast.error("An error occurred while fetching newsfeed data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [images]);

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
                                                    {userdata.data.id === images && (
                                                        <li>
                                                            <button
                                                                className="dropdown-item d-flex align-items-center"
                                                                onClick={() => router.push('/pages/settings/general-settings')}
                                                            >
                                                                <i className="bi bi-pencil-fill me-3"></i> Edit Profile
                                                            </button>
                                                        </li>
                                                    )}


                                                    {userdata.data.id !== images && user.isFriend === "1" && (
                                                        <li>
                                                            <button
                                                                className="dropdown-item d-flex align-items-center"
                                                                onClick={() => handlePoke(images)}
                                                            >
                                                                <i className="fa fa-hand-point-right me-3"></i> Poke
                                                            </button>
                                                        </li>
                                                    )}

                                                    {userdata.data.id !== images && (
                                                        <li>
                                                            <button
                                                                className="dropdown-item d-flex align-items-center"
                                                                onClick={() => {
                                                                    if (user.isPending === "1") {
                                                                        handleCancelRequest(images);
                                                                    } else if (user.isFriend === "0") {
                                                                        handleAddFriend(images);
                                                                    } else if (user.isFriend === "1") {
                                                                        handleUnFriend(images);
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

                                                    {userdata.data.id !== images && (
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
                                            {user.user_level.name === 'Premium' && (
                                                <i className="bi bi-diamond pe-1"></i>
                                            )}
                                            {user.user_level.name === 'basic' && (
                                                <i className="bi bi-star pe-1"></i>
                                            )}
                                            {user.user_level.name === 'Diamond' && (
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
                                    <Link href={`/pages/UserProfile/timeline/${images}`} className="text-decoration-none text-muted">
                                        Posts
                                    </Link>
                                    <Link href={`/pages/UserProfile/about/${images}`} className="text-decoration-none text-muted">
                                        About
                                    </Link>
                                    <Link href={`/pages/UserProfile/friends/${images}`} className="d-flex justify-content-evenly align-items-center text-decoration-none text-muted">
                                        Friends <span className="badge bg-success mx-1">{user.friends_count}</span>
                                    </Link>
                                    <Link href={`/pages/UserProfile/images/${images}`} className="text-decoration-none text-light bg-primary rounded-pill px-2 fw-semibold">
                                        Photos
                                    </Link>
                                    <Link href={`/pages/UserProfile/videos/${images}`} className="text-decoration-none text-muted">
                                        Videos
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-lg border-0 mt-4">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="card-title m-0">Photos</h4>
                                    {loading && <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>}
                                </div>
                                <div className="row g-3">
                                    {postImages.length > 0 ? (
                                        postImages.map((img, index) => (
                                            img ? (
                                                <div className="col-6 col-md-4 col-lg-3" key={index}>
                                                    <div className="ratio ratio-1x1" style={{ width: '100%', height: 200 }}>
                                                        <Link href={img} passHref>
                                                            <Image
                                                                src={img}
                                                                alt={`Post Image ${index}`}
                                                                className="img-fluid rounded-3"
                                                                width={200}
                                                                height={300}
                                                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                                            />

                                                        </Link>
                                                    </div>
                                                </div>
                                            ) : null
                                        ))
                                    ) : (
                                        <div></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <RightNavbar user={user} />
                </div>
            </div>
        </>
    );
}
