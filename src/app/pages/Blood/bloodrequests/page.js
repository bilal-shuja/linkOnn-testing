"use client";


import Rightnav from "@/app/assets/components/rightnav/page";
import Image from "next/image";
import ChatWindow from "@/app/pages/Chat/ChatWindow/ChatWindow";
import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import Link from "next/link";
import useConfirmationToast from "../../Modals/useConfirmationToast";
import { toast } from "react-toastify";

export default function BloodReqs() {

    const [bloodreqs, setBloodreqs] = useState([]);
    const [userdata, setUserdata] = useState(null);
    const api = createAPI();
    const [selectedChat, setSelectedChat] = useState(null);

    const fetchDonors = async () => {
        try {
            const response = await api.post(`/api/get-blood-request`, { limit: 50 });
            if (response.data.code === "200") {
                setBloodreqs(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error fetching requests");
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

    const toggleChatWindow = (chat) => {
        setSelectedChat(chat);
    };

    const handleDeleteReq = async (requestId) => {
        try {
            const response = await api.post(`/api/delete-bloodrequest`, { request_id: requestId });
            if (response.data.code == "200") {
                toast.success(response.data.message);
                setBloodreqs(prev => prev.filter(req => req.id !== requestId));
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error deleting request");
        }
    };

    const { showConfirmationToast } = useConfirmationToast({
        message: "Are you sure you want to delete this request?",
        onConfirm: (values) => handleDeleteReq(values[0]),
        onCancel: () => toast.dismiss(),
        confirmText: "Confirm",
        cancelText: "Cancel",
    });

    if (!userdata) {
        return null;
    }

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
                                    <Link href="/pages/Blood/addbloodreq" className="float-end btn btn-success btn-xs">
                                        <i className="bi bi-plus-circle"></i>
                                    </Link>
                                </div>

                                <div className="mt-4 mx-4">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-hover table-striped">
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
                                                        <td>
                                                            {req.is_urgent_need === "1" ? (
                                                                <span className="badge rounded-pill bg-success">Yes</span>
                                                            ) : (
                                                                <span className="badge rounded-pill bg-danger">No</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div>
                                                                {userdata.data.id === req.user_id ? (
                                                                    <button
                                                                        className="btn btn-danger"
                                                                        onClick={() => showConfirmationToast([req.id])}
                                                                    >
                                                                        <i className="bi bi-trash3"></i> Delete
                                                                    </button>
                                                                ) : (
                                                                    <button className="btn btn-success"
                                                                        onClick={() => toggleChatWindow(req.user_id)}
                                                                    >
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
            {selectedChat && (
                <ChatWindow chat={selectedChat} onClose={() => setSelectedChat(null)} />
            )}
        </div>
    );
}
