"use client";

import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import RightNav from "../../components/RightNav";
import React, { useState, useEffect } from "react";
import TimelineProfileCard from "../../components/TimelineProfileCard";
import { use } from "react";
import Image from 'next/image';
import { useRouter } from "next/navigation";


export default function Followers({ params }) {
    const { Followers } = use(params);
    const [pageTimelineData, setPageTimelineData] = useState(null);
    const [followersList, setFollowersList] = useState([]);
    const api = createAPI();
        const router = useRouter();

    useEffect(() => {
        const data = localStorage.getItem("_pagesInfo");
        if (data) {
            setPageTimelineData(JSON.parse(data));
            localStorage.removeItem("_pagesInfo");
        }
    }, []);

    useEffect(() => {
        const fetchFollowers = async () => {
            if (!Followers) return;
            try {
                const response = await api.post(`/api/get-page-followers`, { page_id: Followers });
                if (response.data.code === "200") {
                    setFollowersList(response.data.data);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error("Error fetching page followers");
            }
        };
        fetchFollowers();
    }, [Followers]);

    return (
        <div className="container mt-4">
            <div className="row d-flex justify-content-between">
                <div className="col-12 col-md-8">
                    <TimelineProfileCard pageTimelineID={Followers} />

                    <div className="card shadow-lg border-0 rounded-3 mt-3">
                        <div className="card-header border-0 pb-0 bg-white">
                            <h5 className="card-title text-primary">Page Followers</h5>
                        </div>
                        <div className="card-body">
                            {followersList.length > 0 ? (
                                <div className="rounded border px-3 py-2 mb-3">
                                    <div className="list-group">
                                        {followersList.map((follower) => (
                                            <div key={follower.id} className="border-0 list-group-item d-flex align-items-center my-1"
                                                onClick={() =>
                                                    router.push(`/pages/UserProfile/timeline/${follower.user_id}`)
                                                } >
                                                <Image
                                                    src={follower.avatar || "/assets/images/userplaceholder.png"}
                                                    alt={follower.username}
                                                    className="rounded-circle"
                                                    width={50}
                                                    height={50}
                                                />
                                                <div className="ms-3">
                                                    <h6 className="mb-0">{follower.first_name} {follower.last_name}</h6>
                                                    <p className="text-muted mb-0">@{follower.username}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="row">
                                    <div className="my-sm-5 py-sm-5 text-center">
                                        <i className="display-1 bi bi-people-fill text-primary" />
                                        <h4 className="mt-2 mb-3 text-body">No Followers Found!</h4>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
                <RightNav pageTimelineData={pageTimelineData} pageTimelineID={Followers} />
            </div>
        </div>
    );
}
