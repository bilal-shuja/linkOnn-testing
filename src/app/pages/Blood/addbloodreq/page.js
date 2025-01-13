"use client";

import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import Image from "next/image";
import useAuth from "@/app/lib/useAuth";
import React, { useState} from "react";

export default function Addbloodreq() {
    useAuth();
    const [isChecked, setIsChecked] = useState(false);

    const handleSwitchChange = (event) => {
        setIsChecked(event.target.checked);
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
                                        <form>
                                            <h3 className="fw-bold text-success">Add Blood Request</h3>
                                            <div className="mb-3">
                                                <label className="form-label" htmlFor="bloodGroup">Blood Group</label>
                                                <select id="bloodGroup" className="form-select" aria-label="Select Blood Group">
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
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label" htmlFor="location">Location</label>
                                                <input id="location" className="form-control" type="text" placeholder="Enter your location" />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label" htmlFor="phone">Phone Number</label>
                                                <input id="phone" className="form-control" type="text" placeholder="Enter your phone number" />
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
