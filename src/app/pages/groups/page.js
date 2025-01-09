"use client";

import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Groups() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState({ suggested: false, myGroups: false });
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [suggestedPage, setSuggestedPage] = useState(1);
  const [myGroupsPage, setMyGroupsPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const itemsPerPage = 6; // Number of groups per page
  const router = useRouter();

  const api = createAPI();

  // Reusable fetch function for groups
  const fetchGroups = async (type, page) => {
    const offset = (page - 1) * itemsPerPage;
    setLoading((prev) => ({ ...prev, [type]: true }));

    try {
      const endpoint = type === "suggested" ? "/api/all-groups" : "/api/user-groups";
      const response = await api.post(endpoint, {
        offset,
        limit: itemsPerPage,
      });

      if (response.data.code === "200") {
        type === "suggested" ? setGroups(response.data.data) : setMyGroups(response.data.data);
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage(`Error fetching ${type === "suggested" ? "Suggested" : "My"} Groups`);
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Fetch Suggested Groups and My Groups only on the client-side
      fetchGroups("suggested", suggestedPage);
      fetchGroups("myGroups", myGroupsPage);
    }
  }, [suggestedPage, myGroupsPage]);

  const handlePageChange = (type, page) => {
    type === "suggested" ? setSuggestedPage(page) : setMyGroupsPage(page);
  };

  const handleDeleteGroup = async (groupId) => {
    // Confirm deletion without alertify
    const confirmDelete = window.confirm("Are you sure you want to delete this group?");
    if (!confirmDelete) return;

    try {
      const formData = new FormData();
      formData.append("group_id", groupId);
      formData.append("request_action", "accept");

      const response = await api.post("/api/delete-group", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.code === "200") {
        setSuccessMessage(response.data.message);
        setMyGroups((prevGroups) =>
          prevGroups.filter((group) => group.id !== groupId)
        );
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage("Error deleting group");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container-fluid bg-light">
        <div className="container mt-3 pt-5">
          <div className="row">
            <div className="col-md-3 p-3 rounded">
              <Rightnav />
            </div>
            <div className="col-md-9 p-3">
              <div className="d-flex flex-column">
                <ul
                  className="nav nav-pills bg-white d-flex justify-content-evenly"
                  id="myTab"
                  role="tablist"
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === 0 ? "active" : ""}`}
                      id="suggested-tab"
                      role="tab"
                      aria-controls="suggested"
                      aria-selected={activeTab === 0}
                      onClick={() => {
                        setActiveTab(0);
                        fetchGroups("suggested", suggestedPage);
                      }}
                    >
                      All Groups
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === 1 ? "active" : ""}`}
                      id="my-groups-tab"
                      role="tab"
                      aria-controls="my-groups"
                      aria-selected={activeTab === 1}
                      onClick={() => {
                        setActiveTab(1);
                        fetchGroups("myGroups", myGroupsPage);
                      }}
                    >
                      My Groups
                    </button>
                  </li>
                </ul>
              </div>

              <div className="tab-content mt-5">
                <div
                  className={`tab-pane fade ${activeTab === 0 ? "show active" : ""}`}
                  id="suggested"
                >
                  <div className="card shadow-lg border-0 p-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4>All Groups</h4>
                        <div className="d-flex align-items-center">
                          <select
                            className="form-select me-2"
                            style={{ width: "150px" }}
                          >
                            <option>Newest</option>
                            <option>Alphabetical</option>
                          </select>
                          <button
                            className="btn btn-primary"
                            onClick={() => router.push("/pages/createGroup")}
                          >
                            + Create Group
                          </button>
                        </div>
                      </div>
                      <hr className="text-muted" />

                      {loading.suggested ? (
                        <div className="d-flex justify-content-center">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {groups.length === 0 ? (
                            <div className="text-center">
                              <i
                                className="bi bi-people text-secondary"
                                style={{ fontSize: "3rem" }}
                              ></i>
                              <p
                                className="mt-3 text-secondary fw-semibold"
                                style={{ fontSize: "1.5rem" }}
                              >
                                No Suggestions Found
                              </p>
                            </div>
                          ) : (
                            <div className="row">
                              {groups.map((group) => (
                                <div key={group.id} className="col-md-4 mb-4">
                                  <div className="card text-center">
                                    <Image
                                      src={group.avatar || "https://via.placeholder.com/150"}
                                      alt="Group Image"
                                      className="card-img-top rounded-circle mx-auto mt-3"
                                      width={80}
                                      height={80}
                                      style={{
                                        objectFit: "cover",
                                      }}
                                    />
                                    <div className="card-body">
                                      <h5 className="card-title mb-1">
                                        {group.group_title}
                                      </h5>
                                      <p className="text-muted align-items-center">
                                        <i className="bi bi-globe pe-2"></i>
                                        {group.category}
                                      </p>
                                      <div className="d-flex justify-content-around align-items-center border-bottom">
                                        <div className="text-center">
                                          <p className="fs-5 text-dark fw-semibold mb-0">
                                            {group.members_count}
                                          </p>
                                          <p className=" mb-1">Members</p>
                                        </div>
                                      </div>
                                      <button className="btn btn-outline-success mt-3">
                                        <i className="bi bi-check-circle-fill pe-2"></i>
                                        {group.is_joined == 1 ? "Joined" : "Join"}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Suggested Groups Pagination */}
                      <div className="d-flex justify-content-center mt-4">
                        <ul className="pagination">
                          <li
                            className={`page-item ${suggestedPage === 1 ? "disabled" : ""}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange("suggested", suggestedPage - 1)}
                            >
                              Previous
                            </button>
                          </li>
                          {[...Array(Math.ceil(groups.length / itemsPerPage))].map(
                            (_, index) => (
                              <li
                                key={index}
                                className={`page-item ${suggestedPage === index + 1 ? "active" : ""}`}
                              >
                                <button
                                  className="page-link"
                                  onClick={() => handlePageChange("suggested", index + 1)}
                                >
                                  {index + 1}
                                </button>
                              </li>
                            )
                          )}
                          <li
                            className={`page-item ${suggestedPage === Math.ceil(groups.length / itemsPerPage) ? "disabled" : ""}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange("suggested", suggestedPage + 1)}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* My Groups Pagination */}
                <div
                  className={`tab-pane fade ${activeTab === 1 ? "show active" : ""}`}
                  id="my-groups"
                >
                  <div className="card shadow-lg border-0 p-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4>My Groups</h4>
                        <button
                          className="btn btn-primary"
                          onClick={() => router.push("/pages/createGroup")}
                        >
                          + Create Group
                        </button>
                      </div>
                      <hr className="text-muted" />

                      {loading.myGroups ? (
                        <div className="d-flex justify-content-center">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <div className="row">
                          {myGroups.length > 0 ? (
                            myGroups.map((group) => (
                              <div key={group.id} className="col-md-4 mb-4">
                                <div className="card text-center">
                                  <Image
                                    src={group.avatar || "https://via.placeholder.com/150"}
                                    alt="Group Image"
                                    className="card-img-top rounded-circle mx-auto mt-3"
                                    width={80}
                                    height={80}
                                    style={{
                                      objectFit: "cover",
                                    }}
                                  />
                                  <div className="card-body">
                                    <h5 className="card-title mb-1">
                                      {group.group_title}
                                    </h5>
                                    <p className="text-muted align-items-center">
                                      <i className="bi bi-globe pe-2"></i>
                                      {group.category}
                                    </p>
                                    <div className="d-flex justify-content-around align-items-center border-bottom">
                                      <div className="text-center">
                                        <p className="fs-5 text-dark fw-semibold mb-0">
                                          {group.members_count}
                                        </p>
                                        <p className=" mb-1">Members</p>
                                      </div>
                                    </div>
                                    <div className="d-flex justify-content-around mt-3">
                                      <button className="btn btn-sm btn-primary">
                                        Edit Group
                                      </button>
                                      <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDeleteGroup(group.id)}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center">
                              <i
                                className="bi bi-people text-secondary"
                                style={{ fontSize: "3rem" }}
                              ></i>
                              <p
                                className="mt-3 text-secondary fw-semibold"
                                style={{ fontSize: "1.5rem" }}
                              >
                                No Groups Found
                              </p>
                            </div>
                          )}
                        </div>
                      )}
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
