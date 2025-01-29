"use client";

import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import Navbar from "@/app/assets/components/navbar/page";
import { use } from "react";
import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

export default function UserVideos({ params }) {
    const { videos } = use(params);
    const api = createAPI();
    const router = useRouter();
    const [userdata, setUserData] = useState(null);
    const [user, setUser] = useState(null);
    const [postVideos, setPostVideos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!videos) return;
            try {
                const response = await api.get(`/api/get-user-profile?user_id=${videos}`);
                if (response.data.code === "200") {
                    setUser(response.data.data);
                } else {
                    toast.error("Failed to fetch user profile.");
                }
            } catch (error) {
                toast.error("Error fetching user profile");
            }
        };

        fetchUserProfile();
    }, [videos]);


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
                user_id: videos,
                post_type: "post",
                limit: '1000',
            });

            if (response.data?.code == "200" && Array.isArray(response.data.data)) {
                const videoPosts = response.data.data
                    .filter(post => post.video && post.video.media_path)
                    .map(post => ({
                        id: post.id,
                        url: post.video.media_path,
                        thumbnail: post.video_thumbnail || '',
                        title: post.post_text || 'Untitled Video',
                        date: post.created_at,
                        views: post.video_view_count || 0
                    }));

                setPostVideos(videoPosts);
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
    }, [videos]);

    if (!user || !userdata) {
        return null;
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
            <Navbar />
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
                                                    {userdata.data.id === videos && (
                                                        <li>
                                                            <button
                                                                className="dropdown-item d-flex align-items-center"
                                                                onClick={() => router.push('/pages/settings/general-settings')}
                                                            >
                                                                <i className="bi bi-pencil-fill me-3"></i> Edit Profile
                                                            </button>
                                                        </li>
                                                    )}


                                                    {userdata.data.id !== videos && user.isFriend === "1" && (
                                                        <li>
                                                            <button
                                                                className="dropdown-item d-flex align-items-center"
                                                                onClick={() => handlePoke(videos)}
                                                            >
                                                                <i className="fa fa-hand-point-right me-3"></i> Poke
                                                            </button>
                                                        </li>
                                                    )}

                                                    {userdata.data.id !== videos && (
                                                        <li>
                                                            <button
                                                                className="dropdown-item d-flex align-items-center"
                                                                onClick={() => {
                                                                    if (user.isPending === "1") {
                                                                        handleCancelRequest(videos);
                                                                    } else if (user.isFriend === "0") {
                                                                        handleAddFriend(videos);
                                                                    } else if (user.isFriend === "1") {
                                                                        handleUnFriend(videos);
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

                                                    {userdata.data.id !== videos && (
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
                                    <Link href={`/pages/UserProfile/timeline/${videos}`} className="text-decoration-none text-muted">
                                        Posts
                                    </Link>
                                    <Link href={`/pages/UserProfile/about/${videos}`} className="text-decoration-none text-muted">
                                        About
                                    </Link>
                                    <Link href={`/pages/UserProfile/friends/${videos}`} className="d-flex justify-content-evenly align-items-center text-decoration-none text-muted">
                                        Friends <span className="badge bg-success mx-1">{user.friends_count}</span>
                                    </Link>
                                    <Link href={`/pages/UserProfile/images/${videos}`} className="text-decoration-none text-muted">
                                        Photos
                                    </Link>
                                    <Link href={`/pages/UserProfile/videos/${videos}`} className="text-decoration-none text-light bg-primary rounded-pill px-2 fw-semibold">
                                        Videos
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-lg border-0 mt-4">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="card-title m-0">Videos</h4>
                                    {loading && <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>}
                                </div>

                                <div className="row g-4">
                                    {postVideos.length > 0 ? (
                                        postVideos.map((video) => (
                                            <div className="col-12 col-md-6 col-lg-4" key={video.id}>
                                                <div className="card h-100 border-0 shadow-sm">
                                                    <div className="ratio ratio-16x9">
                                                        <video
                                                            className="card-img-top"
                                                            controls
                                                            poster={video.thumbnail}
                                                            preload="none"
                                                        >
                                                            <source src={video.url} type="video/mp4" />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div></div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="col-12 col-lg-4 position-sticky top-0">
                        <div className="row g-4">

                            <div className="col-12">
                                <div className="card shadow-lg border-0">
                                    <div className="card-body p-4">
                                        <h4>About</h4>
                                        <p className="text-muted">Full Stack Developer</p>
                                        <div className="d-flex justify-content-between text-muted">

                                            <p className="fw-semibold">
                                                {user.gender == 'Male' && (
                                                    <i className="bi bi-gender-male fa-fw pe-1"></i>
                                                )}
                                                {user.gender == 'Female' && (
                                                    <i className="bi bi-gender-female fa-fw pe-1"></i>
                                                )}
                                                {user.gender}
                                            </p>

                                            <p> <i className="bi bi-person-circle fa-fw pe-1"></i>
                                                Posts
                                                <span className="badge bg-danger mx-1">29</span>
                                            </p>
                                        </div>
                                        <p className="text-muted">
                                            <i className="bi bi-calendar-date fa-fw pe-1"></i>
                                            DOB:
                                            <strong className="mx-1">
                                                {moment(user.date_of_birth).format("MMM DD, YYYY")}
                                            </strong>
                                        </p>
                                        <p className="text-muted"> <i className="bi bi-heart fa-fw pe-1"></i>
                                            Status:
                                            <strong className="mx-1">
                                                {user.relation_id == '0' && (
                                                    <span>None</span>
                                                )}
                                                {user.relation_id == '1' && (
                                                    <span>Single</span>
                                                )}
                                                {user.relation_id == '2' && (
                                                    <span>In a Relationship</span>
                                                )}
                                                {user.relation_id == '3' && (
                                                    <span>Married</span>
                                                )}
                                                {user.relation_id == '4' && (
                                                    <span>Engaged</span>
                                                )}
                                            </strong>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="card shadow-lg border-0">
                                    <div className="card-body p-4">
                                        <h4 className="mb-3">Social Links</h4>
                                        <div className="d-flex justify-content-between mx-3">

                                            {user.facebook && user.facebook !== "" && user.facebook !== "#" ? (
                                                <Link href={user.facebook}>
                                                    <i className="bi bi-facebook text-primary" style={{ fontSize: '1.5rem' }}></i>
                                                </Link>
                                            ) : null}

                                            {user.twitter && user.twitter !== "" && user.twitter !== "#" ? (
                                                <Link href={user.twitter}>
                                                    <i className="bi bi-twitter text-info" style={{ fontSize: '1.5rem' }}></i>
                                                </Link>
                                            ) : null}

                                            {user.instagram && user.instagram !== "" && user.instagram !== "#" ? (
                                                <Link href={user.instagram}>
                                                    <i className="bi bi-instagram text-danger" style={{ fontSize: '1.5rem' }}></i>
                                                </Link>
                                            ) : null}

                                            {user.linkedin && user.linkedin !== "" && user.linkedin !== "#" ? (
                                                <Link href={user.linkedin}>
                                                    <i className="bi bi-linkedin text-primary" style={{ fontSize: '1.5rem' }}></i>
                                                </Link>
                                            ) : null}

                                            {user.youtube && user.youtube !== "" && user.youtube !== "#" ? (
                                                <Link href={user.youtube}>
                                                    <i className="bi bi-youtube text-danger" style={{ fontSize: '1.5rem' }}></i>
                                                </Link>
                                            ) : null}

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="card shadow-lg border-0">
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between">
                                            <h4>Photos</h4>
                                            <button className="btn btn-light text-primary border-0 rounded-1">See all photos</button>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="card shadow-lg border-0">
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center justify-content-evenly">
                                                <h4>Friends</h4>
                                                <span className="badge bg-danger mb-1 mx-1">{user.friends_count}</span>
                                            </div>
                                            <button className="btn btn-light text-primary border-0 rounded-1">See all friends</button>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
