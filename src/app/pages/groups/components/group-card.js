'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import Image from "next/image";
import { toast } from "react-toastify";
import GroupConfirmationModal from '../../Modals/GroupConfirmationModal';


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
                            {imageUrl && (
                                <Image
                                    src={imageUrl}
                                    alt={imageAlt || "Preview Image"}
                                    width={800}
                                    height={600}
                                    className="img-fluid w-100"
                                    style={{ objectFit: 'contain' }}
                                    unoptimized
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {show && <div className="modal-backdrop fade show" onClick={onHide}></div>}
        </>
    );
};

const GroupProfilecard = ({ group_id, setGroupData }) => {
    const pathname = usePathname();
    const api = createAPI();
    const router = useRouter();
    const [userdata, setUserData] = useState(null);
    const [group, setGroup] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState({ url: '', alt: '' });
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [actionType, setActionType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(null);

    const handleImageClick = (imageUrl, imageAlt) => {
        if (imageUrl) {
            setModalImage({ url: imageUrl, alt: imageAlt || "Image Preview" });
            setShowModal(true);
        }
    };

    useEffect(() => {
        const fetchGroupProfile = async () => {
            if (!group_id) return;
            try {
                const response = await api.post(`/api/get-group-data?group_id=${group_id}`);
                if (response.data.code == "200") {
                    setGroup(response.data.data);
                } else {
                    toast.error("Failed to fetch group profile.");
                }
            } catch (error) {
                toast.error("Error fetching group profile.");
            }
        };

        fetchGroupProfile();
    }, [group_id]);

    useEffect(() => {
        const data = localStorage.getItem("userdata");
        if (data) {
            setUserData(JSON.parse(data));
        }
    }, []);

    if (!group || !userdata) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const getBasePath = () => {
        const segments = pathname.split('/');
        return segments[segments.length - 2];
    };

    const isActive = (path) => {
        const basePath = getBasePath();
        return basePath === path ? 'text-primary' : 'text-muted';
    };


    const handleAction = (type, groupId) => {
        setActionType(type);
        setSelectedGroupId(groupId);
        setShowConfirmation(true);
    };

    const confirmAction = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("group_id", selectedGroupId);

            let response;

            if (actionType === "delete") {
                response = await api.post("/api/delete-group", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (response?.data?.code == "200") {
                    toast.success(response.data.message);
                    router.push('/pages/groups');
                    return;
                } else {
                    toast.error(response?.data?.message || "Failed to delete group.");
                }
            }

           else if (actionType === "leave") {
                response = await api.post("/api/leave-group", formData);
                if (response?.data?.code == "200") {
                    toast.success(response.data.message);

                    setGroupData((prevGroup) => ({
                        ...prevGroup,
                        is_joined: "0"
                    }));

                    setGroup((prevGroup) => ({
                        ...prevGroup,
                        is_joined: "0"
                    }));


                } else {
                    toast.error(response?.data?.message || "Error leaving group.");
                }
            } else if (actionType === "join") {
                response = await api.post("/api/join-group", formData);
                if (response?.data?.code == "200") {
                    toast.success(response.data.message);

                    setGroupData((prevGroup) => ({
                        ...prevGroup,
                        is_joined: "1"
                    }));

                    setGroup((prevGroup) => ({
                        ...prevGroup,
                        is_joined: "1"
                    }));

                } else {
                    toast.error(response?.data?.message || "Error joining group.");
                }
            }
        } catch (error) {
            toast.error("An error occurred.");
        } finally {
            setLoading(false);
            setShowConfirmation(false);
        }
    };


    return (
        <>
            <div className="card shadow-lg border-0 rounded-3 mb-3">
                <div className="position-relative">

                    <Image
                        src={group.cover || "/assets/images/placeholder-image.png"}
                        className="card-img-top rounded-top img-fluid"
                        alt="Cover Photo"
                        width={800}
                        height={400}
                        // loader={({ src }) => src}
                        style={{ objectFit: 'cover', height: '200px', cursor: 'pointer' }}
                        onClick={() => handleImageClick(group.cover)}
                    />

                    <div
                        className="position-absolute start-0 translate-middle-y ms-4"
                        style={{ top: 'calc(125% - 31px)', zIndex: 2 }}
                    >
                        <Image
                            className="rounded-circle border border-white border-3 shadow-sm"
                            src={group.avatar || "/assets/images/placeholder-image.png"}
                            alt="Group Avatar"
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
                            onClick={() => handleImageClick(group.avatar)}
                        />
                    </div>
                </div>
                <div className="card-body">
                    <div className="mt-1" style={{ marginLeft: '10rem' }} >

                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="fw-bold text-dark">
                                    {group.group_name}
                                </h5>
                                <p className="text-muted">@{group.group_title}</p>
                            </div>

                            <div className="dropdown">
                                <button
                                    className="btn btn-light border-0 p-2 rounded-circle shadow-sm"
                                    type="button"
                                    id="dropdownMenu"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="fas fa-ellipsis-v"></i>
                                </button>

                                <ul className="dropdown-menu dropdown-menu-end shadow-lg" aria-labelledby="dropdownMenu">

                                    {!group.is_group_owner && group.is_joined === "1" && (
                                        <li>
                                            <button className="dropdown-item text-warning"
                                                onClick={() => handleAction("leave", group.id)}
                                                disabled={loading}>
                                                <i className="bi bi-box-arrow-right pe-2"></i> {loading ? "Leaving..." : "Leave Group"}
                                            </button>

                                        </li>
                                    )}

                                    {!group.is_group_owner && group.is_joined === "0" && (
                                        <li>
                                            <button className="dropdown-item"
                                                onClick={() => handleAction("join", group.id)}>
                                                <i className="bi bi-plus-circle pe-2"></i> Join Group
                                            </button>
                                        </li>
                                    )}

                                    {group.is_group_owner && (
                                        <>
                                            <li className="dropdown-item-container">
                                                <button className="dropdown-item d-flex align-items-center fw-semibold"
                                                    onClick={() => router.push(`/pages/groups/editGroup/${group.id}`)}
                                                >
                                                    <i className="bi bi-pencil-square fa-fw pe-2"></i> Edit Group
                                                </button>
                                            </li>
                                            <li className="dropdown-item-container">
                                                <button className="dropdown-item d-flex align-items-center text-danger fw-semibold"
                                                    onClick={() => handleAction("delete", group.id)}>
                                                    <i className="bi bi-trash fa-fw pe-2"></i> Delete Group
                                                </button>
                                            </li>
                                            <li><hr className="dropdown-divider" /></li>
                                        </>
                                    )}

                                </ul>


                            </div>

                        </div>

                    </div>

                    <hr className="text-muted" />

                    <div className="d-flex justify-content-start gap-4 ms-3">
                        <Link href={`/pages/groups/groupTimeline/${group_id}`} className={`text-decoration-none ${isActive('groupTimeline')}`}>
                            Posts
                        </Link>
                        <Link href={`/pages/groups/about/${group_id}`} className={`text-decoration-none ${isActive('about')}`}>
                            About
                        </Link>
                        <Link href={`/pages/groups/members/${group_id}`} className={`d-flex justify-content-evenly align-items-center text-decoration-none ${isActive('members')}`}>
                            Members <span className="badge bg-success mx-1">{group.members_count}</span>
                        </Link>
                    </div>
                </div>
            </div>

            <ImagePreviewModal
                show={showModal}
                onHide={() => setShowModal(false)}
                imageUrl={modalImage.url}
                imageAlt={modalImage.alt}
            />

            <GroupConfirmationModal
                show={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                onConfirm={confirmAction}
                actionType={actionType}
                loading={loading}
            />

        </>
    );
};

export default GroupProfilecard;
