"use client";

import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import Image from "next/image";
import useAuth from "@/app/lib/useAuth";
import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import Link from "next/link";

export default function FindDonors() {
    useAuth();
    const [donors, setDonors] = useState([]);
    const api = createAPI();

    const fetchDonors = async () => {
        try {
            const response = await api.post(`/api/get-donor-list`);
            if (response.data.code === 200) {
                setDonors(response.data.data);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert("Error fetching donors");
        }
    };

    useEffect(() => {
        fetchDonors();
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
                                <div className="card-body text-center">

                                    <Image
                                        src="/assets/images/blood.png"
                                        alt="Blood donation illustration"
                                        layout="intrinsic"
                                        width={500}
                                        height={300}
                                        className="rounded-3"
                                    />
                                    <Link href="/pages/Blood/becomedonor" className="float-end btn btn-success btn-xs"><i className="bi bi-plus-circle"></i></Link>
                                </div>

                                <div className="d-flex justify-content-center mt-3">
                                    <div className="d-flex align-items-center border rounded-3 p-3">
                                        <select className="form-select me-3" aria-label="Select Blood Group">
                                            <option defaultValue>Select Blood Group</option>
                                            <option value="A+">A+</option>
                                            <option value="B+">B+</option>
                                            <option value="A-">A-</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                        <button className="btn btn-success d-flex align-items-center px-4">
                                            <i className="bi bi-search me-2"></i> Find
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 mx-4">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-hover table-striped">
                                            <thead className="table-secondary">
                                                <tr>
                                                    <th>User Name</th>
                                                    <th>Email</th>
                                                    <th>Blood Group</th>
                                                    <th>Phone Number</th>
                                                    <th>Location</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {donors.map(donor => (
                                                    <tr key={donor.id}>
                                                        <td>{donor.username}</td>
                                                        <td>{donor.email}</td>
                                                        <td>{donor.blood_group}</td>
                                                        <td>{donor.phone}</td>
                                                        <td>{donor.address}</td>
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
        </div>
    );
}
