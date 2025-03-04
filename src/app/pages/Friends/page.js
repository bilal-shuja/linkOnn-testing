"use client";

import Rightnav from "@/app/assets/components/rightnav/page";
import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import Image from "next/image";
import { toast } from "react-toastify";
import useConfirmationToast from "@/app/pages/Modals/useConfirmationToast";
import { useSiteSettings } from "@/context/SiteSettingsContext"
import ModuleUnavailable from "../Modals/ModuleUnavailable";

export default function FriendsPage() {
  const api = createAPI();
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendsloading, setfriendsLoading] = useState(false);
  const [getReqLoading, setgetReqLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("friends");
  const [people, setPeople] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [peopleLoading, setPeopleLoading] = useState(true);
  const [sentReqLoad, setSentReqLoad] = useState(true);
  const [friendkeyword, setFriendKeyword] = useState("");
  const [friendrelation, setFriendRelation] = useState("");
  const [friendgender, setFriendGender] = useState("");
  const [friendsearches, setFriendSearches] = useState([]);
  const [suggkeyword, setSuggKeyword] = useState("");
  const [suggrelation, setSuggRelation] = useState("");
  const [sugggender, setSuggGender] = useState("");
  const [suggsearches, setSuggSearches] = useState([]);
  const settings = useSiteSettings()

  const resetSearchValues = () => {
    setFriendKeyword("");
    setFriendRelation("");
    setFriendGender("");
    setFriendSearches([]);
    setSuggKeyword("");
    setSuggRelation("");
    setSuggGender("");
    setSuggSearches([]);
  };

  const handleTabChange = (tab) => {
    resetSearchValues();
    setActiveTab(tab);

    if (tab === "friends") {
      fetchFriends();
    } else if (tab === "friend-requests") {
      fetchFriendRequests();
    } else if (tab === "suggestions") {
      fetchPeopleRecommendations();
    } else if (tab === "sent-requests") {
      fetchSentRequests();
    }
  };

  const fetchFriends = async () => {
    setfriendsLoading(true);
    try {
      const response = await api.post("/api/get-friends");
      if (response.data.code == "200") {
        setFriends(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error fetching friends.");
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
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error fetching friend requests.");
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
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error fetching recommendations.");
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
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error fetching sent requests.");
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
      const response = await api.post("/api/make-friend", { friend_two: personId });
      if (response.data.code == "200") {
        fetchPeopleRecommendations();
        toast.success(isPending ? "Friend request canceled" : "Friend request sent");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error updating friend request.");
    }
  };

  const handleRoleChange = async (friendId, newRole) => {
    try {
      const response = await api.post("/api/change-friend-role", {
        user_id: friendId,
        role: newRole,
      });
      if (response.data.code === "200") {
        setFriends(prevFriends =>
          prevFriends.map(friend =>
            friend.id === friendId ? { ...friend, role: newRole } : friend
          )
        );
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating the role.");
    }
  };

  const handleUnfriend = (friendId) => {
    showConfirmationToast([friendId]);
  };

  const Unfriend = async (friendId) => {
    try {
      const response = await api.post("/api/unfriend", { user_id: friendId });
      if (response.data.code === "200") {
        setFriends(prevFriends =>
          prevFriends.filter(friend => friend.id !== friendId)
        );
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error");
    }
  };

  const { showConfirmationToast } = useConfirmationToast({
    message: "Are you sure you want to unfriend this person?",
    onConfirm: Unfriend,
    onCancel: () => toast.dismiss(),
    confirmText: 'Unfriend',
    cancelText: 'Cancel',
  });

  const handleFriendRequestAction = async (userId, action) => {
    try {
      const response = await api.post("/api/friend-request-action", {
        user_id: userId,
        request_action: action,
      });
      if (response.data.code == "200") {
        toast.success(response.data.message);
        fetchFriendRequests();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while processing the friend request.");
    }
  };

  const handleFriendSearch = async () => {
    const formData = new FormData();
    formData.append("keyword", friendkeyword);
    formData.append("relation", friendrelation);
    formData.append("gender", friendgender);

    try {
      const response = await api.post("/api/get-friends", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.code == "200") {
        setFriendSearches(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Catch error occurred");
    }
  };

  const handleSuggesSearch = async () => {
    const formData = new FormData();
    formData.append("keyword", suggkeyword);
    formData.append("relation", suggrelation);
    formData.append("gender", sugggender);

    try {
      const response = await api.post("/api/fetch-recommended", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.code == "200") {
        setSuggSearches(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Catch error occurred");
    }
  };

  if (!settings) return null

  if (settings["is_friend_system"] !== "1")  {
    return <ModuleUnavailable />;
}

  return (
    <div>
      <div className="container-fluid bg-light">
        <div className="container mt-5 pt-5">
          <div className="row">
            <div className="col-md-3">
              <Rightnav />
            </div>
            <div className="col-md-6 p-3">
              <ul className="nav nav-pills nav-fill bg-white" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "friends" ? "active" : ""}`}
                    onClick={() => handleTabChange("friends")}
                    role="tab"
                    aria-selected={activeTab === "friends"}
                    tabIndex={0}
                  >
                    Friends
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "friend-requests" ? "active" : ""}`}
                    onClick={() => handleTabChange("friend-requests")}
                    role="tab"
                    aria-selected={activeTab === "friend-requests"}
                    tabIndex={0}
                  >
                    Friend Requests
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "suggestions" ? "active" : ""}`}
                    onClick={() => handleTabChange("suggestions")}
                    role="tab"
                    aria-selected={activeTab === "suggestions"}
                    tabIndex={0}
                  >
                    Suggestions
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "sent-requests" ? "active" : ""}`}
                    onClick={() => handleTabChange("sent-requests")}
                    role="tab"
                    aria-selected={activeTab === "sent-requests"}
                    tabIndex={0}
                  >
                    Sent Requests
                  </button>
                </li>
              </ul>

              <div className="tab-content mt-3">
                <div
                  className={`tab-pane fade ${activeTab === "friends" ? "show active" : ""}`}
                  role="tabpanel"
                >
                  <div className="card shadow-lg border-0 p-3">
                    <div className="card-body">
                      <h4 className="text-dark">Friends</h4>
                      <hr />
                      <br />
                      {friendsloading ? (
                        <div className="d-flex justify-content-center">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : friendsearches.length > 0 ? (
                        friendsearches.map((friend) => (
                          <div key={friend.id} className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center">
                              <Image
                                src={friend.avatar || "/assets/images/userplaceholder.png"}
                                alt={`${friend.first_name} ${friend.last_name}`}
                                className="rounded-circle"
                                width={50}
                                height={50}
                                style={{ objectFit: "cover" }}
                              />
                              <div className="ms-3">
                                <h6 className="mb-0">
                                  {friend.first_name} {friend.last_name}
                                </h6>
                                <small>{friend.details.mutualfriendsCount} Mutual Friends</small>
                              </div>
                            </div>
                            <div className="d-flex justify-content-between">
                              <select
                                className="form-select bg-light"
                                value={friend.role}
                                onChange={(e) => handleRoleChange(friend.id, e.target.value)}
                              >
                                <option value={2}>Friends</option>
                                <option value={3}>Family</option>
                                <option value={4}>Business</option>
                              </select>
                              <button
                                className="btn btn-danger rounded-2 border border-0 mx-3"
                                onClick={() => handleUnfriend(friend.id)}
                              >
                                Unfriend
                              </button>
                            </div>
                          </div>
                        ))
                      ) : friends.length === 0 ? (
                        <div className="text-center">
                          <i className="bi bi-people text-secondary" style={{ fontSize: "3rem" }}></i>
                          <p className="mt-3 text-secondary fw-semibold" style={{ fontSize: "1.5rem" }}>
                            You Currently Have No Friends.
                          </p>
                        </div>
                      ) : (
                        friends.map((friend) => (
                          <div key={friend.id} className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center">
                              <Image
                                src={friend.avatar || "/assets/images/userplaceholder.png"}
                                alt={`${friend.first_name} ${friend.last_name}`}
                                className="rounded-circle"
                                width={50}
                                height={50}
                                style={{ objectFit: "cover" }}
                              />
                              <div className="ms-3">
                                <h6 className="mb-0">
                                  {friend.first_name} {friend.last_name}
                                </h6>
                                <small>{friend.details.mutualfriendsCount} Mutual Friends</small>
                              </div>
                            </div>
                            <div className="d-flex justify-content-between">
                              <select
                                className="form-select bg-light"
                                value={friend.role}
                                onChange={(e) => handleRoleChange(friend.id, e.target.value)}
                              >
                                <option value={2}>Friends</option>
                                <option value={3}>Family</option>
                                <option value={4}>Business</option>
                              </select>
                              <button
                                className="btn btn-danger rounded-2 border border-0 mx-3"
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
                  className={`tab-pane fade ${activeTab === "friend-requests" ? "show active" : ""}`}
                  role="tabpanel"
                >
                  <div className="card shadow-lg border-0 p-3">
                    <div className="card-body">
                      <h4 className="text-dark">Friend Requests</h4>
                      <hr />
                      <br />
                      {getReqLoading ? (
                        <div className="d-flex justify-content-center">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : friendRequests.length === 0 ? (
                        <div className="text-center">
                          <i className="bi bi-people text-secondary" style={{ fontSize: "3rem" }}></i>
                          <p className="mt-3 text-secondary fw-semibold" style={{ fontSize: "1.5rem" }}>
                            No Friend Request Found
                          </p>
                        </div>
                      ) : (
                        friendRequests.map((friend) => (
                          <div key={friend.id} className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center">
                              <Image
                                src={friend.avatar || "/assets/images/userplaceholder.png"}
                                alt={`${friend.first_name} ${friend.last_name}`}
                                className="rounded-circle"
                                width={50}
                                height={50}
                                style={{ objectFit: "cover" }}
                              />
                              <div className="ms-3">
                                <h6 className="mb-0">
                                  {friend.first_name} {friend.last_name}
                                </h6>
                                <small>{friend.details.mutualfriendsCount} Mutual Friends</small>
                              </div>
                            </div>
                            <div>
                              <button
                                className="btn btn-primary mx-3"
                                onClick={() => handleFriendRequestAction(friend.id, "accept")}
                              >
                                Accept
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => handleFriendRequestAction(friend.id, "decline")}
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
                  className={`tab-pane fade ${activeTab === "suggestions" ? "show active" : ""}`}
                  role="tabpanel"
                >
                  <div className="card shadow-lg border-0 p-3">
                    <div className="card-body">
                      <h4 className="text-dark">Suggestions</h4>
                      <hr />
                      <br />
                      {peopleLoading ? (
                        <div className="d-flex justify-content-center mt-3">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : suggsearches.length > 0 ? (
                        suggsearches.map((person) => (
                          <div
                            key={person.id}
                            className="d-flex align-items-center justify-content-between mt-3"
                          >
                            <div className="d-flex align-items-center">
                              <Image
                                src={person.avatar || "/assets/images/userplaceholder.png"}
                                alt="User Avatar"
                                className="rounded-circle"
                                width={40}
                                height={40}
                              />
                              <div className="mx-3">
                                <h6>{`${person.first_name} ${person.last_name}`}</h6>
                                <p className="text-muted mb-3">@{person.username}</p>
                              </div>
                            </div>
                            <div>
                              <button
                                className="btn border border-0"
                                onClick={() => handleAddFriend(person.id, person.ispending === 1)}
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
                      ) : people.length > 0 ? (
                        people.map((person) => (
                          <div
                            key={person.id}
                            className="d-flex align-items-center justify-content-between mt-3"
                          >
                            <div className="d-flex align-items-center">
                              <Image
                                src={person.avatar || "/assets/images/userplaceholder.png"}
                                alt="User Avatar"
                                className="rounded-circle"
                                width={40}
                                height={40}
                              />
                              <div className="mx-3">
                                <h6>{`${person.first_name} ${person.last_name}`}</h6>
                                <p className="text-muted mb-3">@{person.username}</p>
                              </div>
                            </div>
                            <div>
                              <button
                                className="btn border border-0"
                                onClick={() => handleAddFriend(person.id, person.ispending === 1)}
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
                          <i className="bi bi-people text-secondary" style={{ fontSize: "3rem" }}></i>
                          <p className="mt-3 fw-semibold text-secondary" style={{ fontSize: "1.5rem" }}>
                            No people recommendations available
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`tab-pane fade ${activeTab === "sent-requests" ? "show active" : ""}`}
                  role="tabpanel"
                >
                  <div className="card shadow-lg border-0 p-3">
                    <div className="card-body">
                      <h4 className="text-dark">Sent Requests</h4>
                      <hr />
                      <br />
                      {sentReqLoad ? (
                        <div className="d-flex justify-content-center">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : sentRequests.length > 0 ? (
                        sentRequests.map((request) => (
                          <div key={request.id} className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center">
                              <Image
                                src={request.avatar || "/assets/images/userplaceholder.png"}
                                alt={`${request.first_name} ${request.last_name}`}
                                className="rounded-circle"
                                width={50}
                                height={50}
                                style={{ objectFit: "cover" }}
                              />
                              <div className="ms-3">
                                <h6 className="mb-0">{`${request.first_name} ${request.last_name}`}</h6>
                                <small>{request.details.mutualfriendsCount} Mutual Friends</small>
                              </div>
                            </div>
                            <div>
                              <button
                                className="btn border border-0"
                                onClick={() => handleAddFriend(request.id, request.ispending === 1)}
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
                          <i className="bi bi-people text-secondary" style={{ fontSize: "3rem" }}></i>
                          <p className="mt-3 fw-semibold text-secondary" style={{ fontSize: "1.5rem" }}>
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
              {activeTab === "friends" && (
                <div className="bg-white rounded shadow-sm p-3">
                  <div className="d-flex mx-3 text-muted">
                    <i className="bi bi-search pe-3"></i>
                    <h6>Search</h6>
                  </div>
                  <hr />
                  <div className="mb-3 mt-4">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      placeholder="Username"
                      className="form-control"
                      value={friendkeyword}
                      onChange={(e) => setFriendKeyword(e.target.value)}
                    />
                  </div>
                  <div className="mb-3 mt-2">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select bg-light"
                      value={friendgender}
                      onChange={(e) => setFriendGender(e.target.value)}
                    >
                      <option>Any</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Relationship</label>
                    <select
                      className="form-select bg-light"
                      value={friendrelation}
                      onChange={(e) => setFriendRelation(e.target.value)}
                    >
                      <option>Any</option>
                      <option value="1">Single</option>
                      <option value="3">Married</option>
                      <option value="4">Engaged</option>
                    </select>
                  </div>
                  <button className="btn btn-primary w-100" onClick={handleFriendSearch}>Search</button>
                </div>
              )}
              {activeTab === "suggestions" && (
                <div className="bg-white rounded shadow-sm p-3">
                  <div className="d-flex mx-3 text-muted">
                    <i className="bi bi-search pe-3"></i>
                    <h6>Search</h6>
                  </div>
                  <hr />
                  <div className="mb-3 mt-4">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      placeholder="Username"
                      className="form-control"
                      value={suggkeyword}
                      onChange={(e) => setSuggKeyword(e.target.value)}
                    />
                  </div>
                  <div className="mb-3 mt-2">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select bg-light"
                      value={sugggender}
                      onChange={(e) => setSuggGender(e.target.value)}
                    >
                      <option>Any</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Relationship</label>
                    <select
                      className="form-select bg-light"
                      value={suggrelation}
                      onChange={(e) => setSuggRelation(e.target.value)}
                    >
                      <option>Any</option>
                      <option value="1">Single</option>
                      <option value="3">Married</option>
                      <option value="4">Engaged</option>
                    </select>
                  </div>
                  <button className="btn btn-primary w-100" onClick={handleSuggesSearch}>Search</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}