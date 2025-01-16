"use client";

import Navbar from "@/app/assets/components/navbar/page";
import useAuth from "@/app/lib/useAuth";

export default function UserProfile() {
    useAuth();

    return (
        <div>
            <Navbar />
                
        </div>
    );
}
