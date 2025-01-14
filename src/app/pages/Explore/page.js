"use client";

import Navbar from "@/app/assets/components/navbar/page";
import useAuth from "@/app/lib/useAuth";
import { useState } from "react";

export default function Explore() {
    useAuth();

    const [activeTab, setActiveTab] = useState("users");

    return (
        <div>
            <Navbar />
            <div className="container-fluid bg-light py-5">
                <div className="container mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-12">
                            <div className="card shadow-sm border-0 rounded-3 mb-4">
                                <div className="card-body d-flex justify-content-center">
                                    <form className="w-50">
                                        <div className="d-flex align-items-center">
                                            <input
                                                type="text"
                                                required
                                                className="form-control form-control-lg me-3"
                                                placeholder="Enter a keyword"
                                            />
                                            <button type="submit" className="btn btn-primary btn-lg d-flex">
                                                <i className="bi bi-search me-2"></i> Search
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div className="card shadow-sm border-0 rounded-3">
                                <div className="card-body bg-light p-3">

                                    <ul className="nav nav-tabs flex-column flex-md-row justify-content-evenly" id="myTab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`nav-link ${activeTab === "users" ? "active" : ""}`}
                                                onClick={() => setActiveTab("users")}
                                                id="users-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#users"
                                                type="button"
                                                role="tab"
                                            >
                                                <i className="bi bi-people-fill me-2"></i>
                                                Users
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`nav-link ${activeTab === "pages" ? "active" : ""}`}
                                                onClick={() => setActiveTab("pages")}
                                                id="pages-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#pages"
                                                type="button"
                                                role="tab"
                                            >
                                                <i className="bi bi-book-fill me-2"></i>
                                                Pages
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`nav-link ${activeTab === "groups" ? "active" : ""}`}
                                                onClick={() => setActiveTab("groups")}
                                                id="groups-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#groups"
                                                type="button"
                                                role="tab"
                                            >
                                                <i className="bi bi-people me-2"></i>
                                                Groups
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`nav-link ${activeTab === "events" ? "active" : ""}`}
                                                onClick={() => setActiveTab("events")}
                                                id="events-tab"
                                                data-bs-toggle="tab"
                                                data-bs-target="#events"
                                                type="button"
                                                role="tab"
                                            >
                                                <i className="bi bi-calendar-event me-2"></i>
                                                Events
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>


                            <div className="card shadow-lg border-0 rounded-3 mt-4">
                                <div className="card-body p-3">
                                    <div className="tab-content mt-4" id="myTabContent">

                                        <div
                                            className={`tab-pane fade ${activeTab === "users" ? "show active" : ""}`}
                                            id="users"
                                            role="tabpanel"
                                        >
                                            <h5>Users Content</h5>
                                            <p>Here will be the content related to users.</p>
                                        </div>

                                        <div
                                            className={`tab-pane fade ${activeTab === "pages" ? "show active" : ""}`}
                                            id="pages"
                                            role="tabpanel"
                                        >
                                            <h5>Pages Content</h5>
                                            <p>Here will be the content related to pages.</p>
                                        </div>


                                        <div
                                            className={`tab-pane fade ${activeTab === "groups" ? "show active" : ""}`}
                                            id="groups"
                                            role="tabpanel"
                                        >
                                            <h5>Groups Content</h5>
                                            <p>Here will be the content related to groups.</p>
                                        </div>


                                        <div
                                            className={`tab-pane fade ${activeTab === "events" ? "show active" : ""}`}
                                            id="events"
                                            role="tabpanel"
                                        >
                                            <h5>Events Content</h5>
                                            <p>Here will be the content related to events.</p>
                                        </div>
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
