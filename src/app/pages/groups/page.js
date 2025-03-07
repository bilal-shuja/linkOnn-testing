"use client";


import Rightnav from "@/app/assets/components/rightnav/page";
import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Modal, Spinner } from 'react-bootstrap';
import { toast } from "react-toastify";
import useConfirmationToast from "@/app/pages/Modals/useConfirmationToast";
import Link from "next/link";
import { useSiteSettings } from "@/context/SiteSettingsContext"

export default function Groups() {

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState({ suggested: false, myGroups: false });
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [suggestedPage, setSuggestedPage] = useState(1);
  const [myGroupsPage, setMyGroupsPage] = useState(1);
  const [totalSuggested, setTotalSuggested] = useState(0);
  const [totalMyGroups, setTotalMyGroups] = useState(0);
  const itemsPerPage = 6;
  const router = useRouter();
  const api = createAPI();
  const [groupToJoin, setGroupToJoin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingJoin, setLoadingJoin] = useState(false);
  const settings = useSiteSettings()

  const fetchSuggestedGroups = async (page) => {
    const offset = (page - 1) * itemsPerPage;
    setLoading((prev) => ({ ...prev, suggested: true }));

    try {
      const response = await api.post("/api/all-groups", {
        offset,
        limit: itemsPerPage,
      });

      if (response.data.code == "200") {
        setGroups(response.data.data);
        setTotalSuggested(response.data.total);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error fetching suggested groups");
    } finally {
      setLoading((prev) => ({ ...prev, suggested: false }));
    }
  };

  const fetchMyGroups = async (page) => {
    const offset = (page - 1) * itemsPerPage;
    setLoading((prev) => ({ ...prev, myGroups: true }));

    try {
      const response = await api.get("/api/user-groups", {
        offset,
        limit: itemsPerPage,
      });

      if (response.data.code === "200") {
        setMyGroups(response.data.data);
        setTotalMyGroups(response.data.total);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error fetching my groups");
    } finally {
      setLoading((prev) => ({ ...prev, myGroups: false }));
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchSuggestedGroups(suggestedPage);
      fetchMyGroups(myGroupsPage);
    }
  }, [suggestedPage, myGroupsPage]);

  const handlePageChange = (type, page) => {
    if (type === "suggested") {
      setSuggestedPage(page);
    } else {
      setMyGroupsPage(page);
    }
  };

  const handleDeleteGroup = (groupId) => {
    showConfirmationToast([groupId]);
  };

  const handleConfirmDelete = async (groupId) => {
    try {
      const formData = new FormData();
      formData.append("group_id", groupId);
      formData.append("request_action", "accept");

      const response = await api.post("/api/delete-group", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.code == "200") {
        toast.success(response.data.message);
        fetchMyGroups(myGroupsPage);
        setMyGroups((prevGroups) =>
          prevGroups.filter((group) => group.id !== groupId)
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error deleting group");
    }
  };

  const { showConfirmationToast } = useConfirmationToast({
    message: 'Are you sure you want to delete this group?',
    onConfirm: handleConfirmDelete,
    onCancel: () => toast.dismiss(),
    confirmText: 'Delete',
    cancelText: 'Cancel',
  });

  const handleJoinGroup = async (groupId) => {
    setGroupToJoin(groupId);
    setShowModal(true);
  };

  const handleConfirmJoinGroup = async () => {
    setLoadingJoin(true);
    try {
      const response = await api.post("/api/join-group", {
        group_id: groupToJoin,
      });

      if (response.data.code === "200") {
        setGroups((prevGroups) =>
          prevGroups.map((group) =>
            group.id === groupToJoin ? { ...group, is_joined: "1" } : group
          )
        );
        toast.success(response.data.message);
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      toast.error("Error while Joining group");
    } finally {
      setLoadingJoin(false);
      setShowModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };


  const suggestedTotalPages = totalSuggested ? Math.ceil(totalSuggested / itemsPerPage) : 0;
  const myGroupsTotalPages = totalMyGroups ? Math.ceil(totalMyGroups / itemsPerPage) : 0;


  if (!settings) return null

  if (settings["chck-groups"] !== "1")

    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );


  return (
    <div>

      <div className="container-fluid bg-light">
        <div className="container pt-5">
          <div className="row">
            <div className="col-md-3 p-3 rounded">
              <Rightnav />
            </div>
            <div className="col-md-9 p-3">
              <div className="d-flex flex-column mt-2">
                <ul
                  className="nav nav-pills nav-fill bg-white d-flex justify-content-evenly"
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
                        fetchSuggestedGroups(suggestedPage);
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
                        fetchMyGroups(myGroupsPage);
                      }}
                    >
                      My Groups
                    </button>
                  </li>
                </ul>
              </div>

              <div className="tab-content mt-3">
                <div
                  className={`tab-pane fade ${activeTab === 0 ? "show active" : ""}`}
                  id="suggested"
                >
                  <div className="card shadow-lg border-0 p-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4>All Groups</h4>
                        <div className="d-flex align-items-center">

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
                                      src={group.avatar || "/assets/images/placeholder-image.png"}
                                      alt="Group Image"
                                      className="d-block mx-auto mt-1 rounded-circle"
                                      width={150}
                                      height={150}
                                    // style={{ objectFit: "cover" }}
                                    />


                                    <div className="card-body">
                                      <h5 className="card-title mb-1"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => router.push(`/pages/groups/groupTimeline/${group.id}`)}
                                      >{group.group_title}</h5>
                                      <p className="text-muted align-items-center">
                                        <i className="bi bi-globe pe-2"></i>
                                        {group.category}
                                      </p>
                                      <div className="d-flex justify-content-around align-items-center border-bottom py-2">
                                        <div className="text-center">
                                          <p className="fs-6 text-dark fw-semibold mb-0">{group?.members_count || 0}</p>
                                          <p className="mb-1 text-secondary">Members</p>
                                        </div>
                                        <div className="text-center">
                                          <p className="fs-5 text-dark fw-semibold mb-0">{group?.post_count || 0}</p>
                                          <p className="mb-1 text-secondary">Posts</p>
                                        </div>
                                      </div>
                                      {group.is_joined === "1" ? (
                                        <button className="btn btn-outline-success btn-sm mt-2">
                                          <i className="bi bi-check-circle-fill pe-1"> </i>
                                          Joined</button>
                                      ) : (
                                        <button className="btn btn-outline-primary btn-sm mt-2"
                                          onClick={() => handleJoinGroup(group.id)}
                                        >+ Join Group</button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

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
                          {[...Array(suggestedTotalPages)].map((_, index) => (
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
                          ))}
                          <li
                            className={`page-item ${suggestedPage === suggestedTotalPages ? "disabled" : ""}`}
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
                                    src={group.avatar || "/assets/images/placeholder-image.png"}
                                    alt="Group Image"
                                    className="d-block mx-auto mt-1 rounded-circle"
                                    width={150}
                                    height={150}
                                  // style={{ objectFit: "cover" }}
                                  />

                                  <div className="card-body">
                                    <h5 className="card-title mb-1"
                                      style={{ cursor: 'pointer' }}
                                      onClick={() => router.push(`/pages/groups/groupTimeline/${group.id}`)}
                                    >{group.group_title}</h5>
                                    <div className="text-muted align-items-center fs-6">
                                      <i className="bi bi-globe pe-2 fs-6"></i>
                                      {group.category}
                                    </div>
                                    <div className="d-flex justify-content-around align-items-center border-bottom py-2">
                                      <div className="text-center">
                                        <p className="fs-6 text-dark fw-semibold mb-0">{group?.members_count || 0}</p>
                                        <p className="mb-1 text-secondary">Members</p>
                                      </div>
                                      <div className="text-center">
                                        <p className="fs-5 text-dark fw-semibold mb-0">{group?.post_count || 0}</p>
                                        <p className="mb-1 text-secondary">Posts</p>
                                      </div>
                                    </div>
                                    <div className="d-flex justify-content-center mt-3">
                                      <Link
                                        href={`/pages/groups/editGroup/${group.id}`}
                                        className="btn btn-sm btn-outline-info me-2">
                                        <i className="bi bi-pencil"></i>&nbsp;
                                        Edit
                                      </Link>
                                      <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDeleteGroup(group.id)}
                                      >
                                        <i className="bi bi-trash"></i>
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
      <Modal show={showModal} centered onHide={handleCloseModal}>
        <Modal.Body className="text-center">
          <i className="bi bi-exclamation-circle text-danger pe-2"></i>
          Are you sure you want to join this group?
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-sm btn-primary ps-4 pe-4" onClick={handleConfirmJoinGroup} disabled={loadingJoin}>
            {loadingJoin ? (
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            ) : (
              "Yes, Join"
            )}
          </button>
          <button className="btn btn-sm btn-secondary ps-4 pe-4" onClick={handleCloseModal} disabled={loadingJoin}>
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
