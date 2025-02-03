'use client'

import Link from 'next/link';
import moment from 'moment';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import Image from "next/image";
import { toast } from "react-toastify";

const ImagePreviewModal = ({ show, onHide, imageUrl, imageAlt }) => {
    return (
        <>
            <div className={`modal fade ${show ? 'show' : ''}`}
                style={{ display: show ? 'block' : 'none' }}
                tabIndex="-1"
                onClick={onHide}>
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{imageAlt}</h5>
                            <button type="button" className="btn-close" onClick={onHide}></button>
                        </div>
                        <div className="modal-body p-0">
                            <Image
                                src={imageUrl || '/default-image.jpg'}
                                alt={imageAlt}
                                width={800}
                                height={600}
                                className="img-fluid w-100"
                                style={{ objectFit: 'contain' }}
                                unoptimized
                            />
                        </div>
                    </div>
                </div>
            </div>
            {show && <div className="modal-backdrop fade show" onClick={onHide}></div>}
        </>
    );
};

const Profilecard = ({ user_id }) => {
    const pathname = usePathname();
    const api = createAPI();
    const [userdata, setUserData] = useState(null);
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState({ url: '', alt: '' });

    const handleImageClick = (imageUrl, imageAlt) => {
        setModalImage({ url: imageUrl, alt: imageAlt });
        setShowModal(true);
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user_id) return;
            try {
                const response = await api.get(`/api/get-user-profile?user_id=${user_id}`);
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
    }, [user_id]);

    useEffect(() => {
        const data = localStorage.getItem("userdata");
        if (data) {
            setUserData(JSON.parse(data));
        }
    }, []);

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

    const getBasePath = () => {
        const segments = pathname.split('/');
        return segments[segments.length - 2];
    };

    const isActive = (path) => {
        const basePath = getBasePath();
        return basePath === path ? 'text-primary' : 'text-muted';
    };

    return (
        <>
            <div className="card shadow-lg border-0 rounded-3">
                <div className="position-relative">
                    <Image
                        src={user.cover || '/default-cover.jpg'}
                        className="card-img-top rounded-top img-fluid"
                        alt="cover"
                        width={800}
                        height={400}
                        style={{ objectFit: 'cover', height: '200px', cursor: 'pointer' }}
                        onClick={() => handleImageClick(user.cover || '/default-cover.jpg', 'Cover Photo')}
                    />
                    <div
                        className="position-absolute start-0 translate-middle-y ms-4"
                        style={{ top: 'calc(125% - 31px)', zIndex: 2 }}
                    >
                        <Image
                            className="rounded-circle border border-white border-3 shadow-sm"
                            src={user.avatar || '/default-avatar.jpg'}
                            alt="avatar"
                            width={125}
                            height={125}
                            unoptimized
                            style={{
                                objectFit: 'cover',
                                maxWidth: '100%',
                                maxHeight: '100%',
                                width: '125px',
                                height: '125px',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleImageClick(user.avatar || '/default-avatar.jpg', 'Profile Picture')}
                        />
                    </div>
                </div>
                <div className="card-body">
                    <div className="mt-1" style={{ marginLeft: '10rem' }} >
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
                                        {userdata.data.id === user_id && (
                                            <li>
                                                <button
                                                    className="dropdown-item d-flex align-items-center"
                                                    onClick={() => router.push('/pages/settings/general-settings')}
                                                >
                                                    <i className="bi bi-pencil-fill me-3"></i> Edit Profile
                                                </button>
                                            </li>
                                        )}

                                        {userdata.data.id !== user_id && user.isFriend === "1" && (
                                            <li>
                                                <button
                                                    className="dropdown-item d-flex align-items-center"
                                                    onClick={() => handlePoke(user_id)}
                                                >
                                                    <i className="fa fa-hand-point-right me-3"></i> Poke
                                                </button>
                                            </li>
                                        )}

                                        {userdata.data.id !== user_id && (
                                            <li>
                                                <button
                                                    className="dropdown-item d-flex align-items-center"
                                                    onClick={() => {
                                                        if (user.isPending === "1") {
                                                            handleCancelRequest(user_id);
                                                        } else if (user.isFriend === "0") {
                                                            handleAddFriend(user_id);
                                                        } else if (user.isFriend === "1") {
                                                            handleUnFriend(user_id);
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

                                        {userdata.data.id !== user_id && (
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
                        <Link href={`/pages/UserProfile/timeline/${user_id}`} className={`text-decoration-none ${isActive('timeline')}`}>
                            Posts
                        </Link>
                        <Link href={`/pages/UserProfile/about/${user_id}`} className={`text-decoration-none ${isActive('about')}`}>
                            About
                        </Link>
                        <Link href={`/pages/UserProfile/friends/${user_id}`} className={`d-flex justify-content-evenly align-items-center text-decoration-none ${isActive('friends')}`}>
                            Friends <span className="badge bg-success mx-1">{user.friends_count}</span>
                        </Link>
                        <Link href={`/pages/UserProfile/images/${user_id}`} className={`text-decoration-none ${isActive('images')}`}>
                            Photos
                        </Link>
                        <Link href={`/pages/UserProfile/videos/${user_id}`} className={`text-decoration-none ${isActive('videos')}`}>
                            Videos
                        </Link>

                        {userdata.data.id !== user_id && (
                            <Link href={`/pages/UserProfile/common/${user_id}`} className={`text-decoration-none ${isActive('common')}`}>
                                Common Interest
                            </Link>
                        )}

                    </div>
                </div>
            </div>

            <ImagePreviewModal
                show={showModal}
                onHide={() => setShowModal(false)}
                imageUrl={modalImage.url}
                imageAlt={modalImage.alt}
            />
        </>
    );
};

export default Profilecard;
