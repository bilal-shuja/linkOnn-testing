'use client';

import Navbar from "@/app/assets/components/navbar/page";
import React, { useState, useEffect } from "react";
import SettingNavbar from "../settingNav";
import createAPI from "@/app/lib/axios";
import Image from "next/image";
import useAuth from "@/app/lib/useAuth";

export default function GeneralSett() {
    useAuth();
    const [userdata, setUserdata] = useState(null);
    const api = createAPI();
    const [avatar, setAvatar] = useState(null);
    const [cover, setCover] = useState(null);
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [about_you, setAboutyou] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [relation_id, setRelation] = useState('');
    const [working, setWorking] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const data = localStorage.getItem("userdata");
        if (data) {
            const parsedData = JSON.parse(data);
            setUserdata(parsedData);
            setFirstName(parsedData?.data?.first_name || '');
            setLastName(parsedData?.data?.last_name || '');
            setAboutyou(parsedData?.data?.about_you || '');
            setGender(parsedData?.data?.gender || '');
            setAddress(parsedData?.data?.address || '');
            setPhone(parsedData?.data?.phone || '');
            setCity(parsedData?.data?.city || '');
            setRelation(parsedData?.data?.relation_id || '');
            setWorking(parsedData?.data?.working || '');
            setAvatar(parsedData?.data?.avatar || null);
            setCover(parsedData?.data?.cover || null);

            if (parsedData?.data?.avatar) {
                setAvatarPreview(parsedData?.data?.avatar);
            }
            if (parsedData?.data?.cover) {
                setCoverPreview(parsedData?.data?.cover);
            }
        }
    }, []);

    const handleChange = (setter) => (e) => setter(e.target.value);

    const handleFileChange = (setter, previewSetter) => (e) => {
        const file = e.target.files[0];
        if (file) {
            setter(file);
            previewSetter(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async () => {
        const confirmation = window.confirm(
            "Are you sure you want to update the general settings? This action will apply the changes."
        );

        if (confirmation) {
            try {
                const formData = new FormData();
                formData.append("first_name", first_name);
                formData.append("last_name", last_name);
                formData.append("about_you", about_you);
                formData.append("gender", gender);
                formData.append("address", address);
                formData.append("phone", phone);
                formData.append("city", city);
                formData.append("relation_id", relation_id);
                formData.append("working", working);

                if (avatar) {
                    formData.append("avatar", avatar);
                }

                if (cover) {
                    formData.append("cover", cover);
                }

                const response = await api.post("/api/update-user-profile", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (response.data.code === '200') {
                    const userProfile = await api.get(
                        "/api/get-user-profile?user_id=" + localStorage.getItem("userid")
                    );

                    if (userProfile.data.code === "200") {
                        localStorage.setItem("userdata", JSON.stringify(userProfile.data));
                    }

                    setSuccess(response.data.message);
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                setError("An error occurred.");
            }
        } else {
            setError("Action canceled.");
        }
    };
    
    return (
        <div>
            <Navbar />
            <div className="container-fluid bg-light">
                <div className="container mt-3 pt-5">
                    <div className="row">
                        <div className="col-md-3 p-3 rounded">
                            <SettingNavbar />
                        </div>
                        <div className="col-md-9 p-3">
                            <div className="card shadow-lg border-1">
                                <div className="card-body">
                                    <h4 className="fs-5 fw-bold my-3">Update Profile</h4>
                                    <hr />


                                    <div className="mt-3">
                                        <label className="form-label text-muted px-2">Profile Avatar</label>
                                        <input className="form-control text-muted" type="file" onChange={(e) => handleFileChange(setAvatar, setAvatarPreview)(e)} />
                                        {avatarPreview ? (
                                            <div className="mt-2">
                                                <Image
                                                    src={avatarPreview}
                                                    alt="Avatar Preview"
                                                    className="img-thumbnail"
                                                    width={100}
                                                    height={100}
                                                />

                                            </div>
                                        ) : avatar && (
                                            <div className="mt-2">
                                                <Image
                                                    src={avatar}
                                                    alt="Avatar"
                                                    className="img-thumbnail"
                                                    width={100}
                                                    height={100}
                                                />

                                            </div>
                                        )}
                                    </div>


                                    <div className="mt-5">
                                        <label className="form-label px-2 text-secondary">Profile Cover</label>
                                        <input className="form-control text-muted" type="file" onChange={(e) => handleFileChange(setCover, setCoverPreview)(e)} />
                                        {coverPreview ? (
                                            <div className="mt-2">
                                                <Image
                                                    src={coverPreview}
                                                    alt="Cover Preview"
                                                    className="img-thumbnail"
                                                    width={200}
                                                    height={200}
                                                />

                                            </div>
                                        ) : cover && (
                                            <div className="mt-2">
                                                <Image
                                                    src={cover}
                                                    alt="Cover"
                                                    className="img-thumbnail"
                                                    width={200}
                                                    height={200}
                                                />

                                            </div>
                                        )}
                                    </div>


                                    <div className="mt-5 d-flex gap-3">
                                        <div className="w-50">
                                            <label className="form-label text-muted px-1">First Name</label>
                                            <input type="text" className="form-control" value={first_name} onChange={handleChange(setFirstName)} />
                                        </div>
                                        <div className="w-50">
                                            <label className="form-label text-muted px-1">Last Name</label>
                                            <input type="text" className="form-control" value={last_name} onChange={handleChange(setLastName)} />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="form-label text-muted px-2">About You</label>
                                        <textarea className="form-control" rows="2" value={about_you} onChange={handleChange(setAboutyou)} />
                                    </div>

                                    <div className="mt-4">
                                        <label className="form-label text-muted px-2">Gender</label>
                                        <select className="form-select w-50 bg-light" value={gender} onChange={handleChange(setGender)}>
                                            <option value="1">Male</option>
                                            <option value="2">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="mt-4">
                                        <label className="form-label text-muted px-2">Address</label>
                                        <textarea className="form-control" rows="2" value={address} onChange={handleChange(setAddress)} />
                                    </div>

                                    <div className="mt-3 d-flex gap-3">
                                        <div className="w-50">
                                            <label className="form-label text-muted px-1">Phone Number</label>
                                            <input type="text" className="form-control" value={phone} onChange={handleChange(setPhone)} />
                                        </div>
                                        <div className="w-50">
                                            <label className="form-label text-muted px-1">City</label>
                                            <input type="text" className="form-control" value={city} onChange={handleChange(setCity)} />
                                        </div>
                                    </div>

                                    <div className="mt-3 d-flex gap-3">
                                        <div className="w-50">
                                            <label className="form-label text-muted px-1">Email</label>
                                            <input type="text" className="form-control" value={userdata?.data?.email || ''} readOnly />
                                        </div>
                                        <div className="w-50">
                                            <label className="form-label text-muted px-1">Relationship Status</label>
                                            <select className="form-select bg-light" value={relation_id} onChange={handleChange(setRelation)}>
                                                <option value="0">None</option>
                                                <option value="1">Single</option>
                                                <option value="2">Married</option>
                                                <option value="3">In a Relationship</option>
                                                <option value="4">Engaged</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="form-label text-muted px-1">Working</label>
                                        <input type="text" className="form-control" value={working} onChange={handleChange(setWorking)} />
                                    </div>

                                    <div className="mt-4 d-flex justify-content-end">
                                        <button className="btn btn-primary" onClick={handleUpdate}>Save Changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
