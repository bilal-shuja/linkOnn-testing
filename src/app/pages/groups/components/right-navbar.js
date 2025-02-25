'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import createAPI from '@/app/lib/axios';
import Image from 'next/image';
import { Modal, Spinner } from 'react-bootstrap';
import { toast } from "react-toastify";

const RightNavbar = ({ group_id }) => {
    const api = createAPI();
    const router = useRouter();
    const [groupData, setGroupData] = useState({});
    const [loadingGroupData, setLoadingGroupData] = useState(false);
    const [membersList, setMembersList] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [suggessList, setSuggessList] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [groupToJoin, setGroupToJoin] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchGroupData = async () => {
            if (!group_id) return;
            try {
                setLoadingGroupData(true);
                const response = await api.post(`/api/get-group-data?group_id=${group_id}`);
                if (response.data.code === '200') {
                    setGroupData(response.data.data);
                } else {
                    console.error('Failed to fetch group data.');
                }
            } catch (error) {
                console.error('Error fetching group data.');
            } finally {
                setLoadingGroupData(false);
            }
        };

        fetchGroupData();
    }, [group_id]);

    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                setLoadingMembers(true);
                const response = await api.post('/api/get-group-members', {
                    group_id: group_id,
                });

                if (response.data.code === '200') {
                    setMembersList(response.data.data);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching members.');
            } finally {
                setLoadingMembers(false);
            }
        };

        fetchGroupMembers();
    }, [group_id]);

    useEffect(() => {
        const fetchGroupSuggessted = async () => {
            try {
                setLoadingSuggestions(true);
                const response = await api.post('/api/all-groups');

                if (response.data.code === '200') {
                    setSuggessList(response.data.data);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching suggested groups.');
            } finally {
                setLoadingSuggestions(false);
            }
        };

        fetchGroupSuggessted();
    }, []);

    const handleSeeAllMembers = () => {
        router.push(`/pages/groups/members/${group_id}`);
    };

    const handleSeeAllgroups = () => {
        router.push(`/pages/groups`);
    };

    const handleJoinGroup = async (groupId) => {
        setGroupToJoin(groupId);
        setShowModal(true);
    };

    const handleConfirmJoinGroup = async () => {
        setLoading(true);
        try {
            const response = await api.post("/api/join-group", {
                group_id: groupToJoin,
            });

            if (response.data.code === "200") {
                toast.success(response.data.message);

                // 🔥 Update the UI immediately after a successful join
                setSuggessList((prevGroups) =>
                    prevGroups.map((group) =>
                        group.id === groupToJoin ? { ...group, is_joined: "1" } : group
                    )
                );
            } else {
                toast.error(`Error: ${response.data.message}`);
            }
        } catch (error) {
            toast.error("Error while Joining group");
        } finally {
            setLoading(false);
            setShowModal(false);
        }
    };


    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="col-12 col-lg-4 position-sticky top-0">
            <div className="row g-4">

                <div className="col-12">
                    <div className="card shadow-lg border-0 rounded-3 about-card">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-3">
                                <i className="bi bi-person-circle text-primary fs-3 me-2"></i>
                                <h4 className="fw-bold mb-0">About</h4>
                            </div>
                            {loadingGroupData ? (
                                <div className="text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-muted about-text">{groupData.about_group || "No overview available."}</p>
                                    <p className="mb-2 text-muted">
                                        <i className="bi bi-calendar-date fa-fw pe-1"></i>
                                        Privacy: <strong> {groupData.privacy || "N/A"} </strong>
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-12">
                    <div className="card shadow-lg border-0 mt-2">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="mb-0">Members</h4>
                                <button
                                    className="btn btn-light text-primary border-0 rounded-1"
                                    onClick={handleSeeAllMembers}
                                    type="button"
                                >
                                    See all members
                                </button>
                            </div>

                            <div className="min-vh-25">
                                {loadingMembers ? (
                                    <div className="text-center">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : membersList.length > 0 ? (
                                    membersList.map((member) => (
                                        <div key={member.id} className="d-flex align-items-center mb-3">
                                            <Image
                                                src={member.avatar || "/assets/images/userplaceholder.png"}
                                                alt={member.username}
                                                width={50}
                                                height={50}
                                                className="rounded-circle me-3"
                                            />
                                            <div
                                                style={{
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => router.push(`/pages/UserProfile/timeline/${member.id}`)}
                                            >
                                                <h6 className="mb-0">{member.first_name} {member.last_name}</h6>
                                                <small className="text-muted">@{member.username}</small>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No members found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-12">
                    <div className="card shadow-lg border-0 rounded-3 mb-3">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0">Suggested Groups</h5>
                                <button className="btn btn-light text-primary border-0 rounded-1" onClick={handleSeeAllgroups}>
                                    See all Groups
                                </button>
                            </div>

                            {loadingSuggestions ? (
                                <div className="text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : suggessList.length > 0 ? (
                                suggessList.map((group) => (
                                    <div key={group.id} className="d-flex align-items-center mb-3">

                                            <Image
                                                src={group.avatar || "/assets/images/placeholder-image.png"}
                                                alt={group.group_title}
                                                width={40}
                                                height={40}
                                                className="rounded-circle me-3"
                                            />

                                        <div className="flex-grow-1">
                                            <h6 className="mb-0 text-truncate" style={{ maxWidth: '150px', cursor: 'pointer' }}
                                                onClick={() => router.push(`/pages/groups/groupTimeline/${group.id}`)}
                                            >{group.group_name}</h6>
                                            <small className="text-muted">{group.members_count} Members</small>
                                        </div>

                                        {group.is_joined === "1" ? (
                                            <button className="btn btn-success btn-sm">
                                                <i className="bi bi-check-circle-fill pe-1"> </i>
                                                Joined</button>
                                        ) : (
                                            <button className="btn btn-primary btn-sm"
                                                onClick={() => handleJoinGroup(group.id)}
                                            >+ Join Group</button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No suggested groups available.</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            <Modal show={showModal} centered onHide={handleCloseModal}>
                <Modal.Body className="text-center">
                    <i className="bi bi-exclamation-circle text-danger pe-2"></i>
                    Are you sure you want to join this group?
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-sm btn-primary ps-4 pe-4" onClick={handleConfirmJoinGroup} disabled={loading}>
                        {loading ? (
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        ) : (
                            "Yes, Join"
                        )}
                    </button>
                    <button className="btn btn-sm btn-secondary ps-4 pe-4" onClick={handleCloseModal} disabled={loading}>
                        Cancel
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RightNavbar;
