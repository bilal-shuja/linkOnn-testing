"use client";

import React, { useState, useEffect, use } from "react";
import createAPI from "@/app/lib/axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import GroupProfilecard from "../../components/group-card";
import RightNavbar from "../../components/right-navbar";

export default function GroupMembers({ params }) {
    const resolvedParams = use(params);
    const { members } = resolvedParams;
    const api = createAPI();
    const router = useRouter();
    const [membersList, setMembersList] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchGroupMembers = async () => {
        try {
            setLoading(true);
            const response = await api.post("/api/get-group-members", {
                group_id: members,
            });

            if (response.data.code === "200") {
                setMembersList(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error fetching members.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupMembers();
    }, []);

    return (
        <div className="container mt-5 pt-4">
            <div className="row d-flex justify-content-between">
                <div className="col-12 col-md-8">
                    <GroupProfilecard group_id={members} />

                    <div className="card shadow-lg border-0 p-3 mt-3">
                        <div className="card-body">
                        <h4 className="fw-bold text-primary mb-4">Group Members</h4>

                            {loading ? (
                                <div className="d-flex justify-content-center align-items-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="list-group">
                                    {membersList.length > 0 ? (
                                        membersList.map((member) => (
                                            <div
                                                key={member.id}
                                                className="list-group-item shadow-sm d-flex align-items-center my-2"
                                            >
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
                                                    <h5 className="mb-0">
                                                        {member.first_name} {member.last_name}
                                                    </h5>
                                                    <small className="text-muted">@{member.username}</small>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted">No members found.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
                    <RightNavbar group_id={members} />
            </div>
        </div>
    );
}
