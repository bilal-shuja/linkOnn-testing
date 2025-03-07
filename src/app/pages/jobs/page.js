"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import createAPI from "@/app/lib/axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import useConfirmationToast from "@/app/pages/Modals/useConfirmationToast";
import moment from "moment";
import { useSiteSettings } from "@/context/SiteSettingsContext"
import ModuleUnavailable from "../Modals/ModuleUnavailable";

export default function JobsPage() {
  const [jobCategory, setJobCategory] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const api = createAPI();
  const [jobs, setJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [jobLoading, setJobLoading] = useState(false);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const settings = useSiteSettings()

  const handleJobDelete = (jobId) => {
    showConfirmationToast(jobId);
  };

  const handleDeleteFun = (jobId) => {
    api.post("/api/delete-job-post", {
      job_id: jobId,
    })
      .then((res) => {
        if (res.data.code == "200") {
          setMyJobs((prevPosts) =>
            prevPosts.filter((job) => job.id !== jobId)
          );
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        if (error)
          toast.error("An error occurred while deleting the job post.");
      });
  };

  const { showConfirmationToast } = useConfirmationToast({
    message: 'Are you sure you want to delete this job post?',
    onConfirm: handleDeleteFun,
    onCancel: () => toast.dismiss(),
    confirmText: "Confirm",
    cancelText: "Cancel",
  });

  function fetchJobCategories() {
    api.get("/api/get-job_categories")
      .then((res) => {
        if (res.data.code == "200") {
          setJobCategory(res.data.data);
        }
        else {
          toast.error("Error fetching job categories");
        }
      })
      .catch((error) => {
        if (error)
          console.log(error);
        toast.error("Error fetching job categories");
      });
  }

  const fetchJobs = async () => {
    setJobLoading(true);
    try {
      const response = await api.post("/api/get-jobs", {
        type: "all",
      });
      if (response.data.code === "200") {
        setJobs(response.data.data);
      } else {
        toast.error("No jobs found");
      }
    } catch (error) {
      toast.error("Error fetching Jobs");
    } finally {
      setJobLoading(false);
    }
  };

  const fetchMyJobs = async () => {
    setJobLoading(true);
    try {
      const response = await api.post("/api/get-jobs", {
        type: "my",
      });
      if (response.data.code === "200") {
        setMyJobs(response.data.data);
      } else {
        toast.error("No my jobs found");
      }
    } catch (error) {
      toast.error("Error fetching My Jobs");
    } finally {
      setJobLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // If search is empty, fetch all jobs
      if (activeTab === 0) {
        fetchJobs();
      } else {
        fetchMyJobs();
      }
      return;
    }

    setJobLoading(true);
    try {
      const response = await api.post("/api/search-job", {
        title: searchQuery
      });

      if (response.data.code === "200") {
        const searchResults = response.data.data;

        // Handle the results based on active tab
        if (activeTab === 0) {
          setJobs(searchResults);
        } else {
          // For "My Jobs" tab, we need to filter the search results to only show the user's own jobs
          // This assumes the API returns all matching jobs, and we filter on the client side
          const myJobIds = new Set(myJobs.map(job => job.id));
          const filteredMyJobs = searchResults.filter(job => myJobIds.has(job.id));
          setMyJobs(filteredMyJobs);
        }
      } else {
        if (activeTab === 0) {
          setJobs([]);
        } else {
          setMyJobs([]);
        }
        toast.info("No matching jobs found");
      }
    } catch (error) {
      toast.error("Error searching for jobs");
    } finally {
      setJobLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCategoryClick = async (categoryId) => {
    setJobLoading(true);
    try {
      const response = await api.post("/api/search-job", {
        category_id: categoryId
      });

      if (response.data.code === "200") {
        const searchResults = response.data.data;

        // Handle the results based on active tab
        if (activeTab === 0) {
          setJobs(searchResults);
        } else {
          // For "My Jobs" tab, filter results to only show user's own jobs
          const myJobIds = new Set(myJobs.map(job => job.id));
          const filteredMyJobs = searchResults.filter(job => myJobIds.has(job.id));
          setMyJobs(filteredMyJobs);
        }
      } else {
        if (activeTab === 0) {
          setJobs([]);
        } else {
          setMyJobs([]);
        }
        toast.info("No jobs found in this category");
      }
    } catch (error) {
      toast.error("Error filtering jobs by category");
    } finally {
      setJobLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchJobCategories();
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (activeTab === 0) {
      fetchJobs();
    } else {
      fetchMyJobs();
    }
    // Clear search when switching tabs
    setSearchQuery("");
  }, [activeTab, isClient]);

  if (!isClient) return null;

  if (!settings) return null

  if (settings["chck-job_system"] !== "1")  {
    return <ModuleUnavailable />;
}

  return (
    <div>
      <div>
        <div className="container-fluid">
          <div
            className="d-flex justify-content-center align-items-center mb-5 position-relative"
            style={{
              backgroundImage: 'url(/assets/images/0.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '30vh',
              marginTop: '80px',
            }}
          >
            <div className="text-center position-absolute top-50 start-50 translate-middle z-index-1">
              <h2 className="fw-bold text-white">Find a Job you Need</h2>
              <p className="text-white">Find Jobs, Employment & Career Opportunities</p>
              <div className="d-flex justify-content-center align-items-center">
                <div className="input-group" style={{ minWidth: '400px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for jobs"
                    aria-label="Search for jobs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    className="btn btn-primary form-buton"
                    type="button"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <div className="card mb-3 shadow-lg border-0">
                  <div className="card-body">
                    <div className="list-group list-group-flush">
                      {
                        jobCategory.length > 0 ?
                          (
                            <>
                              <Link
                                className="list-group-item text-decoration-none border-0 bold-text d-flex align-items-center text-wrap"
                                href="#"
                                onClick={() => {
                                  if (activeTab === 0) {
                                    fetchJobs();
                                  } else {
                                    fetchMyJobs();
                                  }
                                }}
                              >
                                <i className="bi bi-grid"></i>
                                <span className="mx-3">All Categories</span>
                              </Link>
                              {jobCategory.map((category) => (
                                <Link
                                  key={category.id}
                                  className="list-group-item text-decoration-none border-0 bold-text d-flex align-items-center text-wrap"
                                  href="#"
                                  onClick={() => handleCategoryClick(category.id)}
                                >
                                  <i className="bi bi-briefcase"></i>
                                  <span className="mx-3">{category.name}</span>
                                </Link>
                              ))}
                            </>
                          )
                          :
                          <>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((item) => (
                              <div
                                key={item}
                                className="list-group-item placeholder-glow d-flex align-items-center"
                              >
                                <div className="placeholder col-8"></div>
                              </div>
                            ))}
                          </>
                      }
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-9">
                <div className="d-flex flex-column">
                  <ul className="nav nav-pills nav-fill bg-light d-flex justify-content-evenly" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === 0 ? "active" : ""}`}
                        id="jobs-tab"
                        role="tab"
                        aria-controls="Jobs"
                        aria-selected={activeTab === 0}
                        onClick={() => {
                          setActiveTab(0);
                          fetchJobs();
                        }}
                      >
                        Jobs
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === 1 ? "active" : ""}`}
                        id="my-jobs-tab"
                        role="tab"
                        aria-controls="my-jobs"
                        aria-selected={activeTab === 1}
                        onClick={() => {
                          setActiveTab(1);
                          fetchMyJobs();
                        }}
                      >
                        My Jobs
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Tab Content */}
                <div className="tab-content mt-4">
                  <div
                    className={`tab-pane fade ${activeTab === 0 ? "show active" : ""}`}
                    id="Jobs"
                    role="tabpanel"
                    aria-labelledby="jobs-tab"
                  >
                    <div className="card shadow-lg border-0 p-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                          <h5 className="card-title">Jobs</h5>
                          {searchQuery && (
                            <p className="text-muted">Search results for: {searchQuery} </p>
                          )}
                        </div>
                        <hr className="text-muted" />
                        {jobLoading ? (
                          <div className="d-flex justify-content-center">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        ) : jobs.length > 0 ? (
                          jobs.map((job, index) => (
                            <div key={index} className="mb-3">
                              <div className="d-flex align-items-center justify-content-between">

                                <Link href={`/pages/jobs/details/${job.id}`} className="text-decoration-none" passHref>
                                  <h6 className="cursor-pointer text-blue-600">{job.job_title}</h6>
                                </Link>

                                {job.is_applied ? (
                                  <button className="btn btn-primary border-0 rounded-1">
                                    <i className="bi bi-check"></i> Applied
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-primary border-0 rounded-1"
                                    onClick={() => router.push(`/pages/jobs/applyjob/${job.id}`)}
                                  >
                                    <i className="bi bi-person-fill"></i> Apply now
                                  </button>
                                )}
                              </div>

                              <p className="mb-0">
                                <span className="text-truncate me-3"> <i className="bi bi-geo-alt-fill text-primary me-2"></i> {job.job_location} </span>
                                <span className="text-truncate me-3"> <i className="bi bi-clock text-primary me-2"></i> {job.job_type} </span>
                                <span className="text-truncate me-3"> <i className="bi bi-cash text-primary me-2"></i> {job.minimum_salary} - {job.maximum_salary} / {job.currency} </span>
                              </p>
                              <p className="text-end text-muted">
                                <i className="far fa-calendar-alt text-primary me-2"></i>
                                Created: {moment(job.created_at).format("MMM DD, YYYY")}
                              </p>
                              <hr />
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-5">
                            <i className="bi bi-search fs-1 text-muted"></i>
                            <p className="mt-3">No jobs found. Try a different search term.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`tab-pane fade ${activeTab === 1 ? "show active" : ""}`}
                    id="my-jobs"
                    role="tabpanel"
                    aria-labelledby="my-jobs-tab"
                  >
                    <div className="card shadow-lg border-0 p-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="card-title">My Jobs</h5>
                          <div className="d-flex">
                            {searchQuery && (
                              <p className="text-muted me-3 mt-2">Search results for: {searchQuery} </p>
                            )}
                            <button className="btn btn-outline-primary" onClick={() => router.push("/pages/jobs/createJob")}>
                              <i className="bi bi-plus-lg"></i> Create a Job
                            </button>
                          </div>
                        </div>
                        <hr />
                        {jobLoading ? (
                          <div className="d-flex justify-content-center">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        ) : myJobs.length > 0 ? (
                          <div className="row">
                            {myJobs.map((job, index) => (
                              <div key={index} className="col-12 col-md-4 mb-3">
                                <div className="card" style={{ width: '18rem' }}>
                                  <div
                                    className="card-img-top d-flex justify-content-center align-items-center position-relative"
                                    style={{
                                      height: '180px',
                                      backgroundColor: '#f5f5f5',
                                    }}
                                  >
                                    <Image
                                      src={job.image || "/assets/images/placeholder-image.png"}
                                      alt="job image"
                                      className="card-img-top"
                                      width={300}
                                      height={180}
                                    />

                                    {/* Applicants Badge at the bottom */}
                                    <Link
                                      href={`/pages/jobs/applicants/${job.id}`}
                                      passHref
                                      className="applicants-badge position-absolute w-100 text-center text-decoration-none"
                                      style={{
                                        bottom: '0',
                                        left: '0',
                                        padding: '5px 0',
                                        backgroundColor: '#17a2b8',
                                        color: '#fff',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      <span>
                                        <i className="fa fa-user-tie mr-2"></i> View Applicants
                                      </span>
                                    </Link>
                                  </div>

                                  <div className="card-body">
                                    <Link href={`/pages/jobs/details/${job.id}`} className="text-decoration-none" passHref>
                                      <h6 className="cursor-pointer card-title text-blue-600">{job.job_title}</h6>
                                    </Link>

                                    <h6>
                                      <i className="bi bi-briefcase-fill" style={{ color: "#2bb431" }}></i>&nbsp;{job.job_type}
                                    </h6>
                                    <p className="card-text">
                                      <i className="bi bi-geo-fill" style={{ color: "#1f9cff" }}></i> {job.job_location}
                                    </p>

                                    <div className="d-flex justify-content-evenly">
                                      <Link
                                        className="btn btn-sm btn-outline-info text-center"
                                        href={`/pages/jobs/editJob/${job.id}`}
                                      >
                                        <i className="bi bi-pencil" /> Edit Job
                                      </Link>

                                      <button
                                        className="btn btn-sm btn-outline-danger text-center"
                                        onClick={() => handleJobDelete(job.id)}
                                      >
                                        <i className="bi bi-trash" /> Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Inline CSS for Hover Effect */}
                                <style jsx>{`
                            .card-img-top {
                              position: relative;
                            }
                        
                            .applicants-badge {
                              position: absolute;
                              bottom: 0;
                              left: 0;
                              padding: 5px 0;
                              width: 100%;
                              text-align: center;
                              background-color: #17a2b8;
                              color: #fff;
                              font-size: 14px;
                              font-weight: bold;
                            }
                        
                            .applicants-badge:hover {
                              background-color: #138496;
                            }
                          `}</style>
                              </div>

                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-5">
                            <i className="bi bi-search fs-1 text-muted"></i>
                            <p className="mt-3">No jobs found. Try a different search term or create a new job.</p>
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
    </div>
  );
}