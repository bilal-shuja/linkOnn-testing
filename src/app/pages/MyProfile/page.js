'use client'

import useAuth from "@/app/lib/useAuth"
import React from "react"

export default function Myprofile() {
    useAuth();
    return(
        <div>
                <h1>Welcome to My Profile</h1>
                <p>Page is Under Development</p>
        </div>
    )
}