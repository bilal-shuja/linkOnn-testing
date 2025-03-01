"use client";

import Rightnav from "@/app/assets/components/rightnav/page";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import Link from "next/link";
import { toast } from "react-toastify";

export default function FindDonors() {
    const [donors, setDonors] = useState([]);
    const [filteredDonors, setFilteredDonors] = useState([]);
    const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
    const api = createAPI();

    const fetchDonors = async () => {
        try {
            const response = await api.post(`/api/get-donor-list`);
            if (response.data.code === 200) {
                setDonors(response.data.data);
                setFilteredDonors(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error fetching donors");
        }
    };

    useEffect(() => {
        fetchDonors();
    }, []);

    const handleBloodGroupChange = (e) => {
        setSelectedBloodGroup(e.target.value);
    };

    const filterDonors = () => {
        if (selectedBloodGroup === "" || selectedBloodGroup === "Select Blood Group") {
            setFilteredDonors(donors);
        } else {
            const filtered = donors.filter(donor => donor.blood_group === selectedBloodGroup);
            setFilteredDonors(filtered);
        }
    };

    return (
        <div>
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
                                        <select
                                            className="form-select me-3"
                                            value={selectedBloodGroup}
                                            onChange={handleBloodGroupChange}
                                            aria-label="Select Blood Group"
                                        >
                                            <option value="">Select Blood Group</option>
                                            <option value="A+">A+</option>
                                            <option value="B+">B+</option>
                                            <option value="A-">A-</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                        <button
                                            className="btn btn-success d-flex align-items-center px-4"
                                            onClick={filterDonors}
                                        >
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
                                                {filteredDonors.length > 0 ? (
                                                    filteredDonors.map(donor => (
                                                        <tr key={donor.id}>
                                                            <td>{donor.username}</td>
                                                            <td>{donor.email}</td>
                                                            <td>{donor.blood_group}</td>
                                                            <td>{donor.phone}</td>
                                                            <td>{donor.address}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="text-center">No Data Found</td>
                                                    </tr>
                                                )}
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