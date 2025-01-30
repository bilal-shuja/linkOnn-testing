"use client";

 
import React, { useState, useEffect } from "react";
import Link from "next/link";
import createAPI from "@/app/lib/axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import useConfirmationToast from "@/app/hooks/useConfirmationToast";


export default function JobsPage() {

  const [jobCategory , setJobCategory] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const api = createAPI();
  const [jobs, setJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [jobLoading, setJobLoading] = useState(false);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);


  // const categories = [
  //   "All", "Healthcares Jobs", "Government Jobs", "Science and Research Jobs", "Information Technology Jobs",
  //   "Transportation Jobs", "Education Jobs", "Finance Jobs", "Sales Jobs", "Engineering Jobs",
  //   "Hospitality Jobs", "Retail Jobs", "Human Resources Jobs", "Construction Jobs", "Marketing Jobs",
  //   "Legal Jobs", "Customer Service Jobs", "Design Jobs", "Media and Entertainment Jobs",
  //   "Agriculture and Forestry Jobs", "Arts and Culture Jobs", "Real Estate Jobs", "Manufacturing Jobs",
  //   "Environmental Jobs", "Non-Profit and Social Services Jobs", "Telecommunications Jobs",
  //   "Sports and Recreation Jobs", "Travel and Tourism Jobs", "Food Services Jobs", "Beauty and Wellness Jobs",
  //   "Security and Law Enforcement Jobs", "Writer Jobs", "test Jobs", "testing Jobs"
  // ];


  const handleJobDelete = (jobId) => {
    showConfirmationToast(jobId);
  };

  const handleDeleteFun =  (jobId) => {

     api.post("/api/delete-job-post", {
        job_id: jobId,
      })
      .then((res)=>{
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
          console.log(error)
          toast.error("An error occurred while deleting the job post.");
      })
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
                toast.error("Error fetching event details");
            }

        })
        .catch((error) => {
            if (error)
              console.log(error)
                toast.error("Error fetching event details");
        })

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
  }, [activeTab, isClient]);

  if (!isClient) return null;


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
                  />
                  <button className="btn btn-primary form-buton" type="button">
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
                          jobCategory.map((category) => (
                            <Link
                              key={category.id}
                              className="list-group-item text-decoration-none border-0 bold-text d-flex align-items-center text-wrap"
                              href="#"
                            >
                              <i className="bi bi-briefcase"></i>
                              <span className="mx-3">{category.name}</span>
                            </Link>
                          ))
                        )
                        :
                        <>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33].map((item) => (
                          <div 
                            key={item} 
                            className="list-group-item placeholder-glow d-flex align-items-center"
                          >
                            {/* <div className="placeholder col-1 me-3"></div> */}
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
                          <div className="dropdown">
                            <button className="btn btn-light dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown">
                              <i className="fas fa-bars fa-fw"> </i> Sort
                            </button>

                            <ul className="dropdown-menu p-2" aria-labelledby="dropdownMenuLink">
                              <li className="dropdown-item">Latest</li>
                              <li className="dropdown-item">Salary High to Low</li>
                              <li className="dropdown-item">Salary Low to High</li>
                            </ul>
                          </div>
                        </div>
                        <hr className="text-muted" />
                        {jobLoading ? (
                          <div className="d-flex justify-content-center">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        ) : (
                          jobs.map((job, index) => (
                            <div key={index} className="mb-3">
                              <div className="d-flex align-items-center justify-content-between">
                                <h6>{job.job_title}</h6>

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
                                Created :
                                {job.created_at}
                              </p>
                              <hr />
                            </div>
                          ))
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
                          <button className="btn btn-outline-primary" onClick={() => router.push("/pages/jobs/createJob")}>
                            <i className="bi bi-plus-lg"></i> Create a Job
                          </button>
                        </div>
                        <hr />
                        {jobLoading ? (
                          <div className="d-flex justify-content-center">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        ) : (
                          <div className="row">
                            {myJobs.map((job, index) => (
                              <div key={index} className="col-12 col-md-4 mb-3">
                                <div className="card" style={{ width: '18rem' }}>
                                  <div
                                    className="card-img-top d-flex justify-content-center align-items-center"
                                    style={{
                                      height: '180px',
                                      backgroundColor: '#f5f5f5',
                                    }}
                                  >
                                    {job.image ? (
                                      <Image
                                        src={job.image}
                                        alt="job image"
                                        className="card-img-top"
                                        width={300}
                                        height={180}
                                      />
                                    ) : (
                                      <p>No image available</p>
                                    )}
                                  </div>
                                  <div className="card-body">
                                    <h5 className="card-title text-primary">{job.job_title}</h5>
                                    <h6><i className="bi bi-briefcase-fill" style={{color:"#2bb431"}}></i>&nbsp;{job.job_type}</h6>  
                                    <p className="card-text"> <i className="bi bi-geo-fill" style={{color:"#1f9cff"}}></i> {job.job_location}</p>

                                    <Link className="btn btn-sm btn-outline-primary me-1"
                                     href={`/pages/jobs/editJob/${job.id}`}
                                    >
                                       <i className="bi bi-pencil"/> Edit Job
                                      </Link>

                                      <button className="btn btn-sm btn-outline-danger"
                                      
                                      onClick={() => handleJobDelete(job.id)}
                                      >
                                       <i className="bi bi-trash"/> Delete
                                      </button>

                                    {/* <a href="#" className="btn btn-primary">
                                      View Details
                                    </a> */}


                                  </div>
                                </div>
                              </div>
                            ))}
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
