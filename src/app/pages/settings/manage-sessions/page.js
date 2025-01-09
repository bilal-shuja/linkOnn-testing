'use client';

import Navbar from "@/app/assets/components/navbar/page";
import SettingNavbar from "../settingNav";
import { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import useAuth from "@/app/lib/useAuth";

export default function SessionsSett() {
    useAuth();
    const [sessions, setSessionsData] = useState([]);
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const api = createAPI();

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await api.get(`/api/get-sessions`);
                if (response.data.code === "200") {
                    setSessionsData(response.data.data);
                } else {
                    setMessageType('error');
                    setMessage("Failed to fetch sessions");
                }
            } catch (error) {
                setMessageType('error');
                setMessage("Error fetching sessions");
            }
        };

        fetchSessions();
    }, []);

    const handleDelete = (sessionId) => {
        setSessionToDelete(sessionId);
        setConfirmationVisible(true);
    };

    const confirmDelete = async () => {
        if (sessionToDelete) {
            try {
                const response = await api.post("/api/delete-session", {
                    session_id: sessionToDelete,
                });

                if (response.data.code === '200') {
                    setSessionsData(prevSessions =>
                        prevSessions.filter(session => session.id !== sessionToDelete)
                    );
                    setMessageType('success');
                    setMessage("Session successfully deleted");
                } else {
                    setMessageType('error');
                    setMessage("Failed to delete the session.");
                }
            } catch (error) {
                setMessageType('error');
                setMessage("An error occurred while deleting the session.");
            }
        }
        setConfirmationVisible(false);
    };

    const cancelDelete = () => {
        setConfirmationVisible(false);
        setMessageType('error');
        setMessage("Session deletion canceled");
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
                                    <h5 className="mb-4 my-3 fw-bold">Manage Sessions</h5>
                                    <hr className="text-muted" />
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Sr</th>
                                                <th scope="col">Device Model</th>
                                                <th scope="col">IP Address</th>
                                                <th scope="col">Session ID</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sessions.length > 0 ? (
                                                sessions.map((session, index) => (
                                                    <tr key={session.id}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td className="fw-semibold">{session.device_model}</td>
                                                        <td>{session.ip_address}</td>
                                                        <td>{session.session_id}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-danger rounded-1"
                                                                onClick={() => handleDelete(session.id)}
                                                            >
                                                                <i className="bi bi-trash me-1"></i> Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center">No sessions available</td>
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
    );
}
