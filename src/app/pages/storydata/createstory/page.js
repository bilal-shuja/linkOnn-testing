"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; 
   

export default function Storycreate() {
      
    const [userdata, setUserdata] = useState(null);

    useEffect(() => {
        const data = localStorage.getItem("userdata");
        if (data) {
            setUserdata(JSON.parse(data));
        }
    }, []);

    if (!userdata) {
        return <div></div>;
    }
    
    return (
        <div
            className="text-center mb-3 rounded-4"
            style={{ width: "8rem", border: "none" }}
        >
            <Link href="/pages/storydata">
                <div className="position-relative">
                    <Image
                        src={userdata.data.avatar}
                        alt="Story Background"
                        className="card-img-top rounded-4"
                        style={{ objectFit: "cover" }}
                        width={300} 
                        height={192} 
                    />
                    <button className="btn position-absolute bottom-0 start-50 translate-middle-x bg-primary rounded-circle d-flex justify-content-center align-items-center text-white">
                        +
                    </button>
                </div>
            </Link>
        </div>
    );
}
