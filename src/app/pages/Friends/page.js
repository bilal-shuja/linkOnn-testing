"use client";

import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
 
import Image from "next/image";
import useAuth from "@/app/lib/useAuth";

export default function FriendsPage() {
  useAuth();
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendsloading, setfriendsLoading] = useState(false);
  const [getReqLoading, setgetReqLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("friends");
  const [people, setPeople] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [peopleLoading, setPeopleLoading] = useState(true);
  const [sentReqLoad, setSentReqLoad] = useState(true);
  const api = createAPI();

  const fetchFriends = async () => {
    setfriendsLoading(true);
    try {
      const response = await api.post("/api/get-friends");
      if (response.data.code == "200") {
        setFriends(response.data.data);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      setError("Failed to load friends.");
      alert("Error fetching friends");
    } finally {
      setfriendsLoading(false);
    }
  };

  const fetchFriendRequests = async () => {
    setgetReqLoading(true);
    try {
      const response = await api.post("/api/friend-requests");
      if (response.data.code == "200") {
        setFriendRequests(response.data.data);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      setError("Failed to load friend requests.");
      alert("Error fetching friend requests");
    } finally {
      setgetReqLoading(false);
    }
  };

  const fetchPeopleRecommendations = async () => {
    setPeopleLoading(true);
    try {
      const response = await api.post(`/api/fetch-recommended`);

      if (response.data.code == "200") {
        setPeople(response.data.data);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      setError("Error fetching recommendations");
    } finally {
      setPeopleLoading(false);
    }
  };

  const fetchSentRequests = async () => {
    setSentReqLoad(true);
    try {
      const response = await api.post(`/api/get-sent-requests`);

      if (response.data.code == "200") {
        setSentRequests(response.data.data);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      setError("Error fetching sent requests");
    } finally {
      setSentReqLoad(false);
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
    fetchPeopleRecommendations();
    fetchSentRequests();
  }, []);

  const handleAddFriend = async (personId, isPending) => {
    try {
      const response = isPending
        ? await api.post("/api/make-friend", { friend_two: personId })
        : await api.post("/api/make-friend", { friend_two: personId });

      if (response.data.code == "200") {
        fetchPeopleRecommendations();
        alert(
          isPending ? "Friend request canceled" : "Friend request sent"
        );
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("Error updating friend request");
    }
  };

  const handleRoleChange = async (friendId, newRole) => {
    try {
      const response = await api.post("/api/change-friend-role", {
        user_id: friendId,
        role: newRole,
      });

      if (response.data.code === "200") {
        setFriends((prevFriends) =>
          prevFriends.map((friend) =>
            friend.id === friendId ? { ...friend, role: newRole } : friend
          )
        );
        alert(response.data.message);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("An error occurred while updating the role.");
    }
  };

  const handleUnfriend = (friendId) => {
    const confirmUnfriend = window.confirm("Are you sure you want to unfriend this person?");
  
    if (confirmUnfriend) {
      async function unfriend() {
        try {
          const response = await api.post("/api/unfriend", { user_id: friendId });
  
          if (response.data.code === "200") {
            console.log("Successfully unfriended!");
            setFriends((prevFriends) =>
              prevFriends.filter((friend) => friend.id !== friendId)
            );
          } else {
            console.error(response.data.message);
          }
        } catch (error) {
          console.error("Error unfriending the person:", error);
        }
      }
      unfriend();
    } else {
      console.log("Unfriend action canceled");
    }
  };
  
  const handleFriendRequestAction = async (userId, action) => {
    try {
      const response = await api.post("/api/friend-request-action", {
        user_id: userId,
        request_action: action,
      });

      if (response.data.code == "200") {
        alert(response.data.message);
        fetchFriendRequests();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error processing friend request action:", error);
      alert("An error occurred while processing the friend request.");
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
            <div className="col-md-6 p-3">
              <ul className="nav nav-pills nav-fill bg-white" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "friends" ? "active" : ""
                      }`}
                    id="friends-tab"
                    data-bs-toggle="tab"
                    role="tab"
                    aria-controls="friends"
                    aria-selected={activeTab === "friends"}
                    onClick={() => {
                      setActiveTab("friends");
                      fetchFriends();
                    }}
                  >
                    Friends
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "friend-requests" ? "active" : ""
                      }`}
                    id="friend-requests-tab"
                    data-bs-toggle="tab"
                    role="tab"
                    aria-controls="friend-requests"
                    aria-selected={activeTab === "friend-requests"}
                    onClick={() => {
                      setActiveTab("friend-requests");
                      fetchFriendRequests();
                    }}
                  >
                    Friend Requests
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "suggestions" ? "active" : ""
                      }`}
                    id="suggestions-tab"
                    data-bs-toggle="tab"
                    role="tab"
                    aria-controls="suggestions"
                    aria-selected={activeTab === "suggestions"}
                    onClick={() => {
                      setActiveTab("suggestions");
                      fetchPeopleRecommendations();
                    }}
                  >
                    Suggestions
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "sent-requests" ? "active" : ""
                      }`}
                    id="sent-requests-tab"
                    data-bs-toggle="tab"
                    role="tab"
                    aria-controls="sent-requests"
                    aria-selected={activeTab === "sent-requests"}
                    onClick={() => {
                      setActiveTab("sent-requests");
                      fetchSentRequests();
                    }}
                  >
                    Sent Requests
                  </button>
                </li>
              </ul>

              <div className="tab-content mt-3" id="myTabContent">
                <div
                  className={`tab-pane fade ${activeTab === "friends" ? "show active" : ""
                    }`}
                  id="friends"
                  role="tabpanel"
                  aria-labelledby="friends-tab"
                >
                  <div className="card shadow-lg border-0 p-3">
                    <div className="card-body">
                      <h4 className="text-dark">Friends</h4>
                      <hr />
                      <br />
                      {friendsloading ? (
                        <div className="d-flex justify-content-center">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : error ? (
                        <div className="text-danger">{error}</div>
                      ) : friends.length === 0 ? (
                        <div className="text-center">
                          <i
                            className="bi bi-people text-secondary"
                            style={{ fontSize: "3rem" }}
                          ></i>
                          <p
                            className="mt-3 text-secondary fw-semibold"
                            style={{ fontSize: "1.5rem" }}
                          >
                            You Currently Have No Friends.
                          </p>
                        </div>
                      ) : (
                        friends.map((friend) => (
                          <div
                            key={friend.id}
                            className="d-flex justify-content-between align-items-center mb-3"
                          >
                            <div className="d-flex align-items-center">
                              <Image
                                src={friend.avatar}
                                alt={`${friend.first_name} ${friend.last_name}`}
                                className="rounded-circle"
                                width={50}
                                height={50}
                                style={{
                                  objectFit: "cover",
                                }}
                              />

                              <div className="ms-3">
                                <h6 className="mb-0">
                                  {friend.first_name} {friend.last_name}
                                </h6>
                                <small>
                                  {friend.details.mutualfriendsCount} Mutual
                                  Friends
                                </small>
                              </div>
                            </div>

                            <div className="d-flex justify-content-between">
                              <select
                                className="form-select bg-light"
                                value={friend.role}
                                onChange={(e) =>
                                  handleRoleChange(friend.id, e.target.value)
                                }
                              >
                                <option value={2}>Friends</option>
                                <option value={3}>Family</option>
                                <option value={4}>Business</option>
                              </select>
                              <button
                                className="btn btn-danger rounded-0 border border-0 mx-3"
                                onClick={() => handleUnfriend(friend.id)}
                              >
                                Unfriend
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`tab-pane fade ${activeTab === "friend-requests" ? "show active" : ""
                    }`}
                  id="friend-requests"
                  role="tabpanel"
                  aria-labelledby="friend-requests-tab"
                >
                  <div className="card shadow-lg border-0 p-3">
                    <div className="card-body">
                      <h4 className="text-dark">Friend Requests</h4>
                      <hr />
                      <br />
                      {getReqLoading ? (
                        <div className="d-flex justify-content-center">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : error ? (
                        <div className="text-danger">{error}</div>
                      ) : friendRequests.length === 0 ? (
                        <div className="text-center">
                          <i
                            className="bi bi-people text-secondary"
                            style={{ fontSize: "3rem" }}
                          ></i>
                          <p
                            className="mt-3 text-secondary fw-semibold"
                            style={{ fontSize: "1.5rem" }}
                          >
                            No Friend Request Found
                          </p>
                        </div>
                      ) : (
                        friendRequests.map((friend) => (
                          <div
                            key={friend.id}
                            className="d-flex justify-content-between align-items-center mb-3"
                          >
                            <div className="d-flex align-items-center">
                              <Image
                                src={friend.avatar}
                                alt={`${friend.first_name} ${friend.last_name}`}
                                className="rounded-circle"
                                width={50}
                                height={50}
                                style={{
                                  objectFit: "cover",
                                }}
                              />

                              <div className="ms-3">
                                <h6 className="mb-0">
                                  {friend.first_name} {friend.last_name}
                                </h6>
                                <small>
                                  {friend.details.mutualfriendsCount} Mutual
                                  Friends
                                </small>
                              </div>
                            </div>
                            <div>
                              <button
                                className="btn btn-primary mx-3"
                                onClick={() =>
                                  handleFriendRequestAction(friend.id, "accept")
                                }
                              >
                                Accept
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() =>
                                  handleFriendRequestAction(
                                    friend.id,
                                    "decline"
                                  )
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`tab-pane fade ${activeTab === "suggestions" ? "show active" : ""
                    }`}
                  id="suggestions"
                  role="tabpanel"
                  aria-labelledby="suggestions-tab"
                >
                  <div className="card shadow-lg border-0 p-3">
                    <div className="card-body">
                      <h4 className="text-dark">Suggestions</h4>
                      <hr />
                      <br />
                      {peopleLoading ? (
                        <div className="d-flex justify-content-center mt-3">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : people.length > 0 ? (
                        people.map((person) => (
                          <div
                            key={person.id}
                            className="d-flex align-items-center justify-content-between mt-3"
                          >
                            <div className="d-flex align-items-center">
                              <Image
                                src={person.avatar}
                                alt="User Avatar"
                                className="rounded-circle"
                                width={40}
                                height={40}
                              />
                              <div className="mx-3">
                                <h6>{`${person.first_name} ${person.last_name}`}</h6>
                                <p className="text-muted mb-3">
                                  @{person.username}
                                </p>
                              </div>
                            </div>
                            <div>
                              <button
                                className="btn border border-0"
                                onClick={() =>
                                  handleAddFriend(
                                    person.id,
                                    person.ispending === 1
                                  )
                                }
                              >
                                {person.ispending === 1 ? (
                                  <i className="bi bi-person-check fs-4 text-success"></i>
                                ) : (
                                  <i className="bi bi-plus-circle fs-4 text-primary"></i>
                                )}
                              </button>
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
                            className="mt-3 fw-semibold text-secondary"
                            style={{ fontSize: "1.5rem" }}
                          >
                            No people recommendations available
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`tab-pane fade ${activeTab === "sent-requests" ? "show active" : ""
                    }`}
                  id="sent-requests"
                  role="tabpanel"
                  aria-labelledby="sent-requests-tab"
                >
                  <div className="card shadow-lg border-0 p-3">
                    <div className="card-body">
                      <h4 className="text-dark">Sent Requests</h4>
                      <hr />
                      <br />
                      {sentReqLoad ? (
                        <div className="d-flex justify-content-center">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : error ? (
                        <div className="text-danger">{error}</div>
                      ) : sentRequests.length > 0 ? (
                        sentRequests.map((request) => (
                          <div
                            key={request.id}
                            className="d-flex justify-content-between align-items-center mb-3"
                          >
                            <div className="d-flex align-items-center">
                              <Image
                                src={request.avatar}
                                alt={`${request.first_name} ${request.last_name}`}
                                className="rounded-circle"
                                width={50}  
                                height={50}  
                                style={{
                                  objectFit: "cover",  
                                }}
                              />

                              <div className="ms-3">
                                <h6 className="mb-0">{`${request.first_name} ${request.last_name}`}</h6>
                                <small>
                                  {request.details.mutualfriendsCount} Mutual
                                  Friends
                                </small>
                              </div>
                            </div>
                            <div>
                              <button
                                className="btn border border-0"
                                onClick={() =>
                                  handleAddFriend(
                                    request.id,
                                    request.ispending === 1
                                  )
                                }
                              >
                                {request.ispending === 1 ? (
                                  <i className="bi bi-person-check fs-4 text-success"></i>
                                ) : (
                                  <i className="bi bi-plus-circle fs-4 text-primary"></i>
                                )}
                              </button>
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
                            className="mt-3 fw-semibold text-secondary"
                            style={{ fontSize: "1.5rem" }}
                          >
                            No sent requests found.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="bg-white rounded shadow-sm p-3">
                <div className="d-flex mx-3  text-muted">
                  <i className="bi bi-search pe-3"></i>
                  <h6>Search</h6>
                </div>
                <hr />
                <div className="mb-3 mt-4">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    className="form-control"
                  />
                </div>
                <div className="mb-3 mt-2">
                  <label className="form-label">Gender</label>
                  <select className="form-select bg-light">
                    <option>Any</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Relationship</label>
                  <select className="form-select bg-light">
                    <option>Any</option>
                    <option>Single</option>
                    <option>Married</option>
                    <option>Engaged</option>
                  </select>
                </div>
                <button className="btn btn-primary w-100">Search</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
