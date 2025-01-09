"use client";

import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
 
import { useRouter } from "next/navigation";
import Image from "next/image";
import useAuth from "@/app/lib/useAuth";

export default function Pages() {
  useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [suggesPLoading, setSuggesPLoading] = useState(false);
  const [myPLoading, setMyPLoading] = useState(false);
  const [pages, setPages] = useState([]);
  const [myPages, setMyPages] = useState([]);
  const router = useRouter();

  const api = createAPI();

  const fetchSuggestedPages = async () => {
    setSuggesPLoading(true);
    try {
      const response = await api.get("/api/get-all-pages");
      if (response.data.code == "200") {
        setPages(response.data.data);
      } else {
        alertify.error(response.data.message);
      }
    } catch (error) {
      alertify.error("Error fetching Suggested Pages");
    } finally {
      setSuggesPLoading(false);
    }
  };

  const fetchMyPages = async () => {
    setMyPLoading(true);
    try {
      const response = await api.get("/api/user-pages");
      if (response.data.code == "200") {
        setMyPages(response.data.data);
      } else {
        console.log("No pages found");
      }
    } catch (error) {
      alertify.error("Error fetching My Pages");
    } finally {
      setMyPLoading(false);
    }
  };

  // Using useEffect to ensure the code runs only on the client side.
  useEffect(() => {
    fetchSuggestedPages();
    fetchMyPages();
  }, []);

  const handleDeletePage = (pageId) => {
    alertify.confirm(
      "Delete Page",
      "Are you sure you want to delete this page?",
      async function () {
        try {
          const formData = new FormData();
          formData.append("page_id", pageId);
          formData.append("request_action", "accept");

          const response = await api.post("/api/delete-page", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (response.data.code === "200") {
            alertify.success(response.data.message);
            setMyPages((prevPages) =>
              prevPages.filter((page) => page.id !== pageId)
            );
          } else {
            alertify.error(response.data.message);
          }
        } catch (error) {
          alertify.error("Error deleting page");
        }
      },
      function () {
        alertify.error("Deleting Page canceled");
      }
    );
  };

  const handleLikeUnlikePage = (pageId) => {
    alertify.confirm(
      "Confirm Action",
      "Are you sure you want to perform this action ?",
      async () => {
        try {
          const formData = new FormData();
          formData.append("page_id", pageId);

          const response = await api.post("/api/like-unlike-page", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (response.data.code == "200") {
            alertify.success(response.data.message);

            setMyPages((prevPages) =>
              prevPages.map((page) =>
                page.id === pageId ? { ...page, isLiked: !page.isLiked } : page
              )
            );
          } else {
            alertify.error(response.data.message);
          }
        } catch (error) {
          alertify.error("Error liking/unliking the page");
        }
      },
      function () {
        alertify.error("Action cancelled");
      }
    );
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
                        fetchSuggestedPages();
                      }}
                    >
                      Suggested Pages
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === 1 ? "active" : ""}`}
                      id="my-pages-tab"
                      role="tab"
                      aria-controls="my-pages"
                      aria-selected={activeTab === 1}
                      onClick={() => {
                        setActiveTab(1);
                        fetchMyPages();
                      }}
                    >
                      My Pages
                    </button>
                  </li>
                </ul>
              </div>

              <div className="tab-content mt-5">
                <div
                  className={`tab-pane fade ${activeTab === 0 ? "show active" : ""
                    }`}
                  id="suggested"
                >
                  <div className="card shadow-lg border-0 p-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4>All Pages</h4>
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
                            onClick={() => router.push("/pages/createPage")}
                          >
                            + Create page
                          </button>
                        </div>
                      </div>
                      <hr className="text-muted" />

                      {suggesPLoading ? (
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
                          {pages.length === 0 ? (
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
                              {pages.map((page) => (
                                <div key={page.id} className="col-md-4 mb-4">
                                  <div className="card text-center">
                                    <Image
                                      src={page.avatar || "https://via.placeholder.com/150"}
                                      alt="Profile"
                                      className="card-img-top rounded-circle mx-auto mt-3"
                                      width={80}
                                      height={80}
                                      style={{
                                        objectFit: "cover",
                                      }}
                                    />

                                    <div className="card-body">
                                      <h5 className="card-title mb-1">
                                        {page.page_title}
                                      </h5>
                                      <p className="text-muted">
                                        {page.page_category}
                                      </p>
                                      <div className="d-flex justify-content-around align-items-center py-3 border-bottom">
                                        <div className="text-center">
                                          <button
                                            onClick={() =>
                                              handleLikeUnlikePage(page.id)
                                            }
                                            className="btn d-flex align-items-center justify-content-center"
                                          >
                                            <i
                                              className={`bi bi-hand-thumbs-up fs-6 ${page.is_liked === false
                                                ? "text-primary"
                                                : "text-danger"
                                                }`}
                                            />
                                          </button>
                                          <p className=" mb-0 text-dark fw-semibold">
                                            {page.likes_count}
                                          </p>
                                        </div>
                                        <div className="text-center">
                                          <p className="fs-5 text-dark fw-semibold mb-2">
                                            {page.posts_count || 0}
                                          </p>
                                          <p className=" mb-0">Posts</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`tab-pane fade ${activeTab === 1 ? "show active" : ""
                    }`}
                  id="my-pages"
                >
                  <div className="card shadow-lg border-0 p-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4>My Pages</h4>
                        <button
                          className="btn btn-primary"
                          onClick={() => router.push("/pages/createPage")}
                        >
                          + Create page
                        </button>
                      </div>
                      <hr className="text-muted" />

                      {myPLoading ? (
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
                          {myPages.length > 0 ? (
                            myPages.map((page) => (
                              <div key={page.id} className="col-md-4 mb-4">
                                <div className="card text-center">
                                  <Image
                                    src={page.avatar || "https://via.placeholder.com/150"}
                                    alt="Page Image"
                                    className="card-img-top rounded-circle mx-auto mt-3"
                                    width={80} 
                                    height={80}  
                                    style={{
                                      objectFit: "cover",  
                                    }}
                                  />

                                  <div className="card-body">
                                    <h5 className="card-title mb-1">
                                      {page.page_title}
                                    </h5>
                                    <p className="text-muted">
                                      {page.page_category}
                                    </p>
                                    <div className="d-flex justify-content-around text-muted">
                                      <div>
                                        <i className="bi bi-hand-thumbs-up"></i>
                                        <p>{page.likes_count} Likes</p>
                                      </div>
                                      <div>
                                        <i className="bi bi-file-text"></i>
                                        <p>{page.post_count || 0} Posts</p>
                                      </div>
                                    </div>
                                    <div className="d-flex justify-content-around mt-3">
                                      <button className="btn btn-sm btn-primary">
                                        Edit Page
                                      </button>
                                      <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() =>
                                          handleDeletePage(page.id)
                                        }
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
                                No Pages Found
                              </p>
                              <div className="d-flex justify-content-center">
                                <button
                                  className="btn btn-primary align-items-center justify-content-center d-flex btn-sm"
                                  onClick={() =>
                                    router.push("/pages/createPage")
                                  }
                                >
                                  <i className="bi bi-plus fs-4"></i>
                                  Click here to add
                                </button>
                              </div>
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
