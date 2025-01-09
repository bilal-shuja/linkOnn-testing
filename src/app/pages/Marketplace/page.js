'use client'
import useAuth from "@/app/lib/useAuth"
import React from "react"

export default function Marketplace() {
    useAuth();
    return(
        <div>
            <h5>Marketplace</h5>
        </div>
    )
}