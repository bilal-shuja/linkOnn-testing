"use client";


import Rightnav from "@/app/assets/components/rightnav/page";
import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { toast } from "react-toastify";
import useConfirmationToast from "@/app/pages/Modals/useConfirmationToast";
import Link from "next/link";

export default function Pages() {

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
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error fetching Suggested Pages");
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
        toast.error("No pages found");
      }
    } catch (error) {
      toast.error("Error fetching My Pages");
    } finally {
      setMyPLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestedPages();
    fetchMyPages();
  }, []);

  const handleDeletePage = (pageId) => {
    showConfirmationToastDelete([pageId]);
  };

  const DeletePage = async (pageId) => {
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
        toast.success(response.data.message);
        fetchMyPages();
        setMyPages((prevPages) =>
          prevPages.filter((page) => page.id !== pageId)
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error deleting Page");
    }
  };

  const { showConfirmationToast: showConfirmationToastDelete } = useConfirmationToast({
    message: 'Are you sure you want to delete this Page?',
    onConfirm: DeletePage,
    onCancel: () => toast.dismiss(),
    confirmText: 'Delete',
    cancelText: 'Cancel',
  });

  const handleLikeUnlikePage = (pageId) => {
    showConfirmationToastLikeUnlike([pageId]);
  };

  const LikeUnlikePage = async (pageId) => {
    try {
      const formData = new FormData();
      formData.append("page_id", pageId);

      const response = await api.post("/api/like-unlike-page", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.code == "200") {
        toast.success(response.data.message);
        fetchSuggestedPages();
        setMyPages((prevPages) =>
          prevPages.map((page) =>
            page.id === pageId ? { ...page, isLiked: !page.isLiked } : page
          )
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error liking/unliking the page");
    }
  };

  const { showConfirmationToast: showConfirmationToastLikeUnlike } = useConfirmationToast({
    message: 'Are you sure you want to perform this action?',
    onConfirm: LikeUnlikePage,
    onCancel: () => toast.dismiss(),
    confirmText: 'Yes',
    cancelText: 'No',
  });


  return (
    <div>

      <div className="container-fluid">
        <div className="container mt-3 pt-5">
          <div className="row">
            <div className="col-md-3 p-3 rounded">
              <Rightnav />
            </div>
            <div className="col-md-9 p-3">
              <div className="d-flex flex-column">
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

              <div className="tab-content mt-2">
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
                                    {/* <Image
                                      src={page.avatar || "/assets/images/placeholder-image.png"}
                                      alt="Profile"
                                      className="card-img-top mx-auto mt-3"
                                      width={80}
                                      height={200}
                                      style={{
                                        objectFit: "cover",
                                      }}
                                    /> */}


                                    <Image
                                      src={page.avatar || "/assets/images/placeholder-image.png"}
                                      alt="Page Image"
                                      className="d-block mx-auto mt-1 rounded-circle mt-2"
                                      width={150}
                                      height={150}
                                    // style={{ objectFit: "cover" }}
                                    />

                                    <div className="card-body">
                                      <Link className="card-title mb-1 text-decoration-none"

                                        href={`/pages/page/myPageTimeline/${page.id}`}
                                        onMouseEnter={(e) => e.target.style.color = '#0D6EFD'}
                                        onMouseLeave={(e) => e.target.style.color = 'inherit'}
                                      >
                                        {page.page_title}
                                      </Link>
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
                                            {page.post_count || 0}
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

                                  {/* <Image
                                    src={page.avatar || "/assets/images/placeholder-image.png"}
                                    alt="Page Image"
                                    className="card-img-top mx-auto mt-3"
                                    width={80}
                                    height={200}
                                    style={{
                                      objectFit: "cover",
                                    }}
                                  /> */}


                                  <Image
                                    src={page.avatar || "/assets/images/placeholder-image.png"}
                                    alt="Page Image"
                                    className="d-block mx-auto mt-1 rounded-circle mt-2"
                                    width={150}
                                    height={150}
                                  // style={{ objectFit: "cover" }}
                                  />

                                  <div className="card-body">
                                    <Link className="card-title mb-1 text-decoration-none"
                                      href={`/pages/page/myPageTimeline/${page.id}`}
                                      onMouseEnter={(e) => e.target.style.color = '#0D6EFD'}
                                      onMouseLeave={(e) => e.target.style.color = 'inherit'}
                                    >
                                      {page.page_title}
                                    </Link>
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
                                    <div className="d-flex justify-content-center mt-3">
                                      <Link className="btn btn-sm btn-outline-info"
                                        href={`/pages/page/editMyPage/${page.id}`}
                                      >
                                        <i className="bi bi-pencil" /> &nbsp;
                                        Edit
                                      </Link>
                                      &nbsp;
                                      <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() =>
                                          handleDeletePage(page.id)
                                        }
                                      >
                                        <i className="bi bi-trash" />
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
