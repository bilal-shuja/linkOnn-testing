"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import createAPI from "@/app/lib/axios";
import { toast } from "react-toastify";
import { use } from "react";

export default function JobDetailPage({ params }) {
    const router = useRouter();
    const unwrappedParams = use(params);
    const id = unwrappedParams.id;
    const api = createAPI();
    const [loading, setLoading] = useState(true);
    const [job, setJob] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchJobDetails = async () => {
            try {
                const response = await api.post("/api/job-details", { job_id: id });

                if (response.data.status === 200) {
                    setJob(response.data.data);
                } else {
                    toast.error("Failed to fetch job details");
                }
            } catch (error) {
                console.error("Error fetching job details:", error);
                toast.error("An error occurred while fetching job details");
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="container mt-5 pt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card p-5 shadow text-center">
                            <i className="bi bi-exclamation-circle text-warning" style={{ fontSize: "3rem" }}></i>
                            <h3 className="mt-3">Job Not Found</h3>
                            <p className="text-muted">The job details you are looking for could not be found.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5 mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card shadow border-0 rounded-3 overflow-hidden">
                        <div className="card-header bg-primary bg-gradient text-white p-4">
                            <div className="d-flex justify-content-between align-items-center flex-wrap">
                                <h2 className="fs-2 fw-bold mb-0">{job.job_title}</h2>
                                {job.is_urgent_hiring === "1" && (
                                    <span className="badge bg-danger px-3 py-2 rounded-pill">
                                        <i className="bi bi-lightning-fill me-1"></i>Urgent Hiring
                                    </span>
                                )}
                            </div>
                            <p className="fs-5 mt-2 mb-0 opacity-75">{job.company_name}</p>
                        </div>

                        <div className="card-body p-4">
                            <div className="row g-4 mb-4">
                                <div className="col-md-6 col-xl-4">
                                    <div className="card h-100 bg-light border-0 rounded-3">
                                        <div className="card-body p-3">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-white p-3 rounded-circle shadow-sm me-3 text-primary">
                                                    <i className="bi bi-geo-alt-fill fs-4"></i>
                                                </div>
                                                <div>
                                                    <h6 className="text-muted mb-1">Location</h6>
                                                    <p className="fs-6 fw-semibold mb-0">{job.job_location}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 col-xl-4">
                                    <div className="card h-100 bg-light border-0 rounded-3">
                                        <div className="card-body p-3">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-white p-3 rounded-circle shadow-sm me-3 text-primary">
                                                    <i className="bi bi-briefcase-fill fs-4"></i>
                                                </div>
                                                <div>
                                                    <h6 className="text-muted mb-1">Job Type</h6>
                                                    <p className="fs-6 fw-semibold mb-0">{job.job_type && job.job_type.replace ? job.job_type.replace("_", " ") : job.job_type}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 col-xl-4">
                                    <div className="card h-100 bg-light border-0 rounded-3">
                                        <div className="card-body p-3">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-white p-3 rounded-circle shadow-sm me-3 text-primary">
                                                    <i className="bi bi-tags-fill fs-4"></i>
                                                </div>
                                                <div>
                                                    <h6 className="text-muted mb-1">Category</h6>
                                                    <p className="fs-6 fw-semibold mb-0">{job.category}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 col-xl-4">
                                    <div className="card h-100 bg-light border-0 rounded-3">
                                        <div className="card-body p-3">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-white p-3 rounded-circle shadow-sm me-3 text-primary">
                                                    <i className="bi bi-clock-history fs-4"></i>
                                                </div>
                                                <div>
                                                    <h6 className="text-muted mb-1">Experience Required</h6>
                                                    <p className="fs-6 fw-semibold mb-0">{job.experience_years} years</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 col-xl-4">
                                    <div className="card h-100 bg-light border-0 rounded-3">
                                        <div className="card-body p-3">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-white p-3 rounded-circle shadow-sm me-3 text-primary">
                                                    <i className="bi bi-cash-stack fs-4"></i>
                                                </div>
                                                <div>
                                                    <h6 className="text-muted mb-1">Salary Range</h6>
                                                    <p className="fs-6 fw-semibold mb-0">{job.minimum_salary} - {job.maximum_salary} {job.currency}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-4" />

                            <div className="mb-4">
                                <div className="d-flex align-items-center mb-3">
                                    <i className="bi bi-file-text-fill fs-3 text-primary me-2"></i>
                                    <h4 className="mb-0 fw-bold">Job Description</h4>
                                </div>
                                <div className="p-3 bg-light rounded-3">
                                    {job.job_description && typeof job.job_description === 'string' ?
                                        job.job_description.split('\n').map((paragraph, index) => (
                                            <p key={index} className="mb-3">{paragraph}</p>
                                        ))
                                        : <p className="mb-0">{job.job_description}</p>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}