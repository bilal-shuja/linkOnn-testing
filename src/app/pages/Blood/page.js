'use client '
import useAuth from "@/app/lib/useAuth"
import React from "react"

export default function Blood () {
    useAuth();
    return(
        <div>
        <h5>Blood</h5>
        </div>
    )
}