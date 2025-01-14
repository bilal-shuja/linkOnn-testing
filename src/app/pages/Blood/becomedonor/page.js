"use client";

import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import Image from "next/image";
import useAuth from "@/app/lib/useAuth";
import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";

export default function Becomedonor() {
    useAuth();
    const [isChecked, setIsChecked] = useState(false);
    const [bloodGroup, setBloodGroup] = useState('');
    const [location, setLocation] = useState('');
    const [phone, setPhone] = useState('');
    const [donationDate, setDonationDate] = useState('');
    const [userdata, setUserdata] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const api = createAPI();

    useEffect(() => {
        const data = localStorage.getItem("userdata");
        if (data) {
            const parsedData = JSON.parse(data);
            setUserdata(parsedData);
            setBloodGroup(parsedData.data.blood_group);
            setLocation(parsedData.data.address);
            setPhone(parsedData.data.phone);
            setDonationDate(parsedData.data.donation_date);
            setIsChecked(parsedData.data.donation_available === '1');
        }
    }, []);

    const handleSwitchChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!bloodGroup || !location || !phone || !donationDate) {
            setErrorMessage('Please fill in all fields before submitting.');
            return;
        }

        setLoading(true);
        setErrorMessage('');

        try {
            await updateBlood();
        } catch (error) {
            setErrorMessage('There was an error submitting your details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateBlood = async () => {
        try {
            const formData = new FormData();
            formData.append("blood_group", bloodGroup);
            formData.append("address", location);
            formData.append("phone", phone);
            formData.append("donation_date", donationDate);
            formData.append("donation_available", isChecked ? '1' : '0');

            const response = await api.post("/api/update-user-profile", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.code == '200') {
                const userProfile = await api.get("/api/get-user-profile?user_id=" + localStorage.getItem("userid"));

                if (userProfile.data.code === "200") {
                    localStorage.setItem("userdata", JSON.stringify(userProfile.data));
                }
            } else {
                setErrorMessage('Failed to update profile. Please try again.');
            }
        } catch (error) {
            setErrorMessage('There was an error updating your profile.');
        }
    };

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
                                            <h3 className="fw-bold text-success">Become a Donor</h3>
                                            <p className="text-muted mb-4">Help save lives by donating blood. Please fill out the form below.</p>

                                            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

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

                                            <div className="mb-3">
                                                <label className="form-label" htmlFor="donationDate">Donation Date</label>
                                                <input
                                                    id="donationDate"
                                                    className="form-control"
                                                    type="date"
                                                    value={donationDate}
                                                    onChange={(e) => setDonationDate(e.target.value)}
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
                                                    Available to donate blood
                                                </label>
                                            </div>

                                            <button type="submit" className="btn btn-success py-2" disabled={loading}>
                                                {loading ? 'Submitting...' : 'Submit'}
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
