"use client";

import React, { useState, useEffect, use } from "react";
import createAPI from "@/app/lib/axios";
import RightNavbar from "../../components/right-navbar";
import { toast } from "react-toastify";
import Profilecard from "../../components/profile-card";
import Link from 'next/link';
import Image from 'next/image';

export default function Common({ params }) {
    const resolvedParams = use(params);
    const { common } = resolvedParams;
    const api = createAPI();

    const [userdata, setUserData] = useState(null);
    const [user, setUser] = useState(null);
    const [commonthings, setCommonthings] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!common) return;
            try {
                const response = await api.get(`/api/get-user-profile?user_id=${common}`);
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
    }, [common]);

    useEffect(() => {
        const data = localStorage.getItem("userdata");
        if (data) {
            setUserData(JSON.parse(data));
        }
    }, []);

    useEffect(() => {
        const fetchCommon = async () => {
            if (!common) return;
            try {
                const response = await api.post(`/api/get-commons`, { user_id: common });
                if (response.data.code == "200") {
                    setCommonthings(response.data.data);
                } else {
                    toast.error("Failed to fetch common.");
                }
            } catch (error) {
                toast.error("Error fetching common");
            }
        };

        fetchCommon();
    }, [common]);

    if (!user || !userdata || !commonthings) {
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
                        <Profilecard user_id={common} />

                        <div className="card shadow-lg border-0 mt-5">
                            <div className="card-body">
                                <h4 className="fw-bold text-primary mb-4">Common Interests</h4>

                                {/* 🟢 GROUPS */}
                                {commonthings.groups && commonthings.groups.length > 0 && (
                                    <>
                                        <h5 className="text-secondary">Groups</h5>
                                        {commonthings.groups.map((group) => (
                                            <div key={group.id} className="rounded border p-3 mb-3 bg-light">
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar me-3">
                                                        <Link href={`/pages/groups/groupTimeline/${group.id}`}>
                                                            <Image
                                                                className="avatar-img rounded-circle border"
                                                                src={group.avatar || "/assets/images/placeholder-image.png"}
                                                                alt={group.group_title}
                                                                width={50}
                                                                height={50}
                                                                style={{ objectFit: "cover", border: "2px solid #ddd" }}
                                                            />
                                                        </Link>
                                                    </div>
                                                    <div className="w-100">
                                                        <h6 className="mb-0 fw-semibold">
                                                            <Link href={`/pages/groups/groupTimeline/${group.id}`} className="text-decoration-none text-dark">
                                                                {group.group_title}
                                                            </Link>
                                                        </h6>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}

                                {/* 🟢 PAGES */}
                                {commonthings.pages && commonthings.pages.length > 0 && (
                                    <>
                                        <h5 className="text-secondary">Pages</h5>
                                        {commonthings.pages.map((page) => (
                                            <div key={page.id} className="rounded border p-3 mb-3 bg-light">
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar me-3">
                                                        <Link href={`/pages/page/myPageTimeline/${page.id}`}>
                                                            <Image
                                                                className="avatar-img rounded-circle border"
                                                                src={page.avatar || "/assets/images/placeholder-image.png"}
                                                                alt={page.page_title}
                                                                width={50}
                                                                height={50}
                                                                style={{ objectFit: "cover", border: "2px solid #ddd" }}
                                                            />
                                                        </Link>
                                                    </div>
                                                    <div className="w-100">
                                                        <h6 className="mb-0 fw-semibold">
                                                            <Link href={`/pages/page/myPageTimeline/${page.id}`} className="text-decoration-none text-dark">
                                                                {page.page_title}
                                                            </Link>
                                                        </h6>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}

                                {/* 🟢 EVENTS */}
                                {commonthings.events && commonthings.events.length > 0 && (
                                    <>
                                        <h5 className="text-secondary">Events</h5>
                                        {commonthings.events.map((event) => (
                                            <div key={event.id} className="rounded border p-3 mb-3 bg-light">
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar me-3">
                                                        <Link href={`/events/event-details/${event.id}`}>
                                                            <Image
                                                                className="avatar-img rounded border"
                                                                src={event.cover || "/assets/images/placeholder-image.png"}
                                                                alt={event.name}
                                                                width={50}
                                                                height={50}
                                                                style={{ objectFit: "cover", border: "2px solid #ddd" }}
                                                            />
                                                        </Link>
                                                    </div>
                                                    <div className="w-100">
                                                        <h6 className="mb-0 fw-semibold">
                                                            <Link href={`pages/Events/eventDetails/${event.id}`} className="text-decoration-none text-dark">
                                                                {event.name}
                                                            </Link>
                                                        </h6>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
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
