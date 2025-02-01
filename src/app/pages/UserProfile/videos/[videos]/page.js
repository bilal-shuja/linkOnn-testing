"use client";

import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import RightNavbar from "../../components/right-navbar";
import { use } from "react";
import { toast } from "react-toastify";
import Profilecard from "../../components/profile-card";

export default function UserVideos({ params }) {

    const { videos } = use(params);
    const api = createAPI();
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

                        <Profilecard user_id={videos} />

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

                    <RightNavbar user={user} />

                </div>
            </div>
        </>
    );
}
