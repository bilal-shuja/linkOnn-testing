"use client";

import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import Image from "next/image";
import useAuth from "@/app/lib/useAuth";
import React, { useState } from "react";
import createAPI from "@/app/lib/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Addbloodreq() {
    useAuth();
    const api = createAPI();
    const [isChecked, setIsChecked] = useState(false);
    const [bloodGroup, setBloodGroup] = useState("");
    const [location, setLocation] = useState("");
    const [phone, setPhone] = useState("");
    const router = useRouter();

    const handleSwitchChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const urgentNeedValue = isChecked ? 1 : 0;

        const formData = new FormData();
        formData.append("blood_group", bloodGroup);
        formData.append("location", location);
        formData.append("phone", phone);
        formData.append("is_urgent_need", urgentNeedValue);

        try {
            const response = await api.post("/api/add-blood-request", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.code == "200") {
                toast.success(response.data.message);
                setTimeout(() => {
                    router.push("/pages/Blood/bloodrequests");
                }, 2000);

            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred while submitting the request.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container-fluid bg-light">
                <div className="container mt-5 pt-5">
                    <div className="row">
                        <div className="col-md-3">
                            <Rightnav />
                        </div>
                        <div className="col-md-9 p-4">
                            <div className="card shadow-lg border-0 rounded-3">
                                <div className="card-body">
                                    <div className="d-flex justify-content-center">
                                        <Image
                                            src="/assets/images/blood.png"
                                            alt="Blood donation illustration"
                                            layout="intrinsic"
                                            width={500}
                                            height={300}
                                            className="img-fluid rounded mb-4"
                                        />
                                    </div>

                                    <div className="d-flex justify-content-center">
                                        <form onSubmit={handleSubmit}>
                                            <h3 className="fw-bold text-success">Add Blood Request</h3>
                                            <div className="mb-3">
                                                <label className="form-label" htmlFor="bloodGroup">Blood Group</label>
                                                <select
                                                    id="bloodGroup"
                                                    className="form-select"
                                                    aria-label="Select Blood Group"
                                                    value={bloodGroup}
                                                    onChange={(e) => setBloodGroup(e.target.value)}
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
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label" htmlFor="location">Location</label>
                                                <input
                                                    id="location"
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="Enter your location"
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label" htmlFor="phone">Phone Number</label>
                                                <input
                                                    id="phone"
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="Enter your phone number"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                />
                                            </div>

                                            <div className="mb-3 form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="flexSwitchCheckChecked"
                                                    checked={isChecked}
                                                    onChange={handleSwitchChange}
                                                />
                                                <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                                                    Urgent Need
                                                </label>
                                            </div>

                                            <button type="submit" className="btn btn-success py-2">
                                                Submit
                                            </button>
                                        </form>
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
