"use client";

import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
 
import Link from "next/link";
import Image from "next/image";

export default function GamesPage() {
    const [gamesData, setGamesData] = useState([]);
    const [gameloading, setGameloading] = useState(true);
    const [error, setError] = useState(null);
    const api = createAPI();

    const fetchGames = async () => {
        setGameloading(true);
        try {
            const response = await api.post(`/api/get-games`);

            if (response.data.code == "200") {
                setGamesData(response.data.data);
            } else {
                alertify.error(response.data.message);
            }
        } catch (error) {
            setError("Error fetching game data");
            alertify.error("Error fetching game data");
        } finally {
            setGameloading(false);
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container-fluid bg-light">
                <div className="container mt-5 pt-5">
                    <div className="row">
                        <div className="col-md-3">
                            <Rightnav />
                        </div>
                        <div className="col-md-9 p-3">
                            <div className="card mb-3 shadow-lg border-0">
                                <div className="card-body">
                                    <h3>All Games </h3>
                                    <hr className="text-muted" />
                                    {gameloading ? (
                                        <div className="d-flex justify-content-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : error ? (
                                        <div className="alert alert-danger" role="alert">
                                            {error}
                                        </div>
                                    ) : (
                                        <div className="row">
                                            {gamesData.map((game) => (
                                                <div key={game.id} className="col-md-4 mb-4">
                                                    <div className="card h-100 d-flex">
                                                        <Image
                                                            src={game.image}
                                                            alt={game.name}
                                                            className="card-img-top"
                                                            width={300}  
                                                            height={200} 
                                                            style={{
                                                                objectFit: "cover", 
                                                            }}
                                                        />

                                                        <div className="card-body d-flex flex-column">
                                                            <h5 className="card-title text-center">{game.name}</h5>
                                                            <Link href={game.link} className="btn btn-primary mt-auto">
                                                                Play Game
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
