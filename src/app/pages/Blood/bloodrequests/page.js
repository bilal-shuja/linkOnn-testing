"use client";

import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import Image from "next/image";
import useAuth from "@/app/lib/useAuth";
import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import Link from "next/link";

export default function BloodReqs() {
    useAuth();
    const [bloodreqs, setBloodreqs] = useState([]);
    const [userdata, setUserdata] = useState(null);
    const api = createAPI();

    const fetchDonors = async () => {
        try {
            const response = await api.post(`/api/get-blood-request`);
            if (response.data.code === "200") {
                setBloodreqs(response.data.data);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert("Error fetching requests");
        }
    };

    useEffect(() => {
        fetchDonors();
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
                                <div className="card-body text-center">
                                    <Image
                                        src="/assets/images/blood.png"
                                        alt="Blood donation illustration"
                                        layout="intrinsic"
                                        width={500}
                                        height={300}
                                        className="rounded-3"
                                    />
                                    <Link href="/pages/Blood/addbloodreq" className="float-end btn btn-success btn-xs"><i className="bi bi-plus-circle"></i></Link>
                                </div>

                                <div className="mt-4 mx-4">
                                    <table className="table table-bordered table-hover table-striped table-responsive">
                                        <thead className="table-secondary">
                                            <tr>
                                                <th>User Name</th>
                                                <th>Phone Number</th>
                                                <th>Location</th>
                                                <th>Blood Group</th>
                                                <th>Urgent Need</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bloodreqs.map((req) => (
                                                <tr key={req.id}>
                                                    <td>{req.user.username}</td>
                                                    <td>{req.phone}</td>
                                                    <td>{req.location}</td>
                                                    <td>{req.blood_group}</td>
                                                    <td>{req.is_urgent_need === "1" ? "Yes" : "No"}</td>
                                                    <td>
                                                        <div>
                                                            {userdata.data.id === req.user_id ? (
                                                                <button className="btn btn-danger">
                                                                    <i className="bi bi-trash3"></i> Delete
                                                                </button>
                                                            ) : (
                                                                <button className="btn btn-success">
                                                                    <i className="bi bi-chat-dots"></i> Message
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
