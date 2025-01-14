"use client";

import React, { useEffect, useState } from "react";
import createAPI from "../../lib/axios";
import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import Leftnav from "@/app/assets/components/leftnav/page";
import Image from "next/image";
import useAuth from "@/app/lib/useAuth";

export default function Poke() {
    useAuth();
    const api = createAPI();
    const [pokes, setPokes] = useState([]);
    const [userdata, setUserdata] = useState(null);

    useEffect(() => {
        const fetchPokes = async () => {
            try {
                const response = await api.post(`/api/get-pokes`);

                if (response.data.code == "200") {
                    setPokes(response.data.data);
                } else {
                    alert("Failed to fetch pokes");
                }
            } catch (error) {
                alert("Error fetching pokes");
            }
        };

        fetchPokes();
    }, []);

    useEffect(() => {
        const data = localStorage.getItem("userdata");
        if (data) {
            setUserdata(JSON.parse(data));
        }
    }, []);

    if (!userdata) {
        return null;
    }

    const handlePokeBack = async (postId) => {
        try {
            const response = await api.post("/api/poke-user", {
                user_id: postId,
            });

            if (response.data.code == "200") {
                alert(response.data.message);
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (error) {
            alert("Error while Poking Back");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container-fluid bg-light">
                <div className="container mt-3 pt-5">
                    <div className="row">
                        <div className="col-md-3 p-3 rounded">
                            <Rightnav />
                        </div>
                        <div className="col-md-6 p-3">
                            <div className="card p-3 mb-3 border border-0 shadow-lg mt-2">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <h5>Pokes</h5>
                                        <Image
                                            src="/assets/images/newicons/poke.svg"
                                            alt="Poke"
                                            width={30}
                                            height={30}
                                        />
                                    </div>
                                </div>
                            </div>

                            {pokes
                                .filter((poke) => poke.id !== userdata.data.id)
                                .map((poke, index) => (
                                    <div key={`${poke.id}-${index}`} className="card p-3 mb-3 border border-0 shadow-lg mt-2">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center">
                                                <Image
                                                    src={poke.avatar}
                                                    alt={poke.username}
                                                    width={50}
                                                    height={50}
                                                    className="rounded-circle"
                                                />
                                                <div className="ms-3">
                                                    <h6>{poke.first_name} {poke.last_name}</h6>
                                                </div>
                                                <button
                                                    className="btn btn-outline-primary ms-auto d-flex align-items-center gap-2 px-4 py-2 transition-all"
                                                    onClick={() => handlePokeBack(poke.id)}
                                                >
                                                    <Image
                                                        src="/assets/images/poke.png"
                                                        alt="poke"
                                                        height={20}
                                                        width={20}
                                                    />
                                                    <span className="font-weight-bold">Poke Back</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div className="col-md-3 p-3 rounded">
                            <Leftnav />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
