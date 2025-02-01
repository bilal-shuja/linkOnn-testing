"use client";

import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import RightNavbar from "../../components/right-navbar";
import Image from "next/image";
import { use } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import Profilecard from "../../components/profile-card";


export default function UserImages({ params }) {
    const { images } = use(params);
    const api = createAPI();
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

    return (
        <>
            <div className="container mt-5 pt-4">
                <div className="row d-flex justify-content-between">
                    <div className="col-12 col-md-8">

                        <Profilecard user_id={images} />

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
