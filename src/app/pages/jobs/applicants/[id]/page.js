"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import createAPI from "@/app/lib/axios";
import { toast } from "react-toastify";
import { use } from "react";
import Link from 'next/link';
import Image from "next/image";

export default function JobApplicantPage({ params }) {
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
                const response = await api.post("/api/applied-candidates", { job_id: id });

                if (response.data.code === "200") {
                    setJob(response.data.data);
                } else {
                    toast.error("Failed to fetch job applicants");
                }
            } catch (error) {
                toast.error("An error occurred while fetching job applicants");
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!job || job.length === 0) {
        return (
            <div className="container mt-5 pt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card p-5 shadow text-center">
                            <i className="bi bi-exclamation-circle text-warning" style={{ fontSize: "3rem" }}></i>
                            <h3 className="mt-3">No Job Applicants Found</h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5 pt-5">
            <h3 className="text-center mb-4 text-primary font-weight-bold">Job Applicants</h3>
            <div className="table-responsive shadow-sm rounded-lg overflow-hidden">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Avatar</th>
                            <th scope="col">Username</th>
                            <th scope="col">Position</th>
                            <th scope="col">Location</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                            <th scope="col">CV</th>
                        </tr>
                    </thead>
                    <tbody>
                        {job.map((applicant) => (
                            <tr key={applicant.id}>
                                <td>
                                    <Image
                                        src={applicant.avatar}
                                        alt={applicant.username}
                                        height={50}
                                        width={50}
                                        className="img-fluid rounded-circle"
                                        style={{objectFit: "cover" }}
                                    />
                                </td>
                                <td>{applicant.username}</td>
                                <td>{applicant.position}</td>
                                <td>{applicant.location || "Not provided"}</td>
                                <td>{applicant.email}</td>
                                <td>{applicant.phone}</td>
                                <td>
                                    {applicant.cv_file ? (
                                        <a
                                            href={applicant.cv_file}
                                            className="btn btn-primary btn-sm"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <i className="bi bi-download"></i> Download CV
                                        </a>
                                    ) : (
                                        <span className="text-muted">No CV Available</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Custom CSS */}
            <style jsx>{`
                .table th, .table td {
                    vertical-align: middle;
                    text-align: center;
                    padding: 15px;
                    font-size: 14px;
                }

                .table img {
                    object-fit: cover;
                    border-radius: 50%;
                }

                .table tbody tr:hover {
                    background-color: #f0f8ff;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                .table th {
                    background-color: #007bff;
                    color: white;
                    font-weight: bold;
                    text-transform: uppercase;
                }

                .table-responsive {
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                h3 {
                    font-size: 2rem;
                    font-weight: 600;
                }

                .btn-primary {
                    font-weight: bold;
                    text-transform: uppercase;
                }

                .card {
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                }

                .card:hover {
                    transform: scale(1.03);
                    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
                }

                .bi-download {
                    margin-right: 5px;
                }

                .font-weight-bold {
                    font-weight: bold !important;
                }

                .text-primary {
                    color: #007bff !important;
                }
            `}</style>
        </div>
    );
}
