"use client";

import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import Navbar from "@/app/assets/components/navbar/page";

export default function UserProfileCard({ params }) {
    const api = createAPI();
    const { profileId } = React.use(params);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!profileId) return;
            try {
                const response = await api.get(`/api/get-user-profile?user_id=${profileId}`);
                if (response.data.code === "200") {
                    setUser(response.data.data);
                } else {
                    console.log("Failed to fetch user profile.");
                }
            } catch (error) {
                console.log("An error occurred while fetching data.");
            }
        };

        fetchUserProfile();
    }, [profileId]);


    return (
        <>
            <Navbar />
            <div>
                <h1>{user?.name}</h1>
                <p>{user?.email}</p>
            </div>
        </>
    );
}
