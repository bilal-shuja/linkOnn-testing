"use client";


import Rightnav from "@/app/assets/components/rightnav/page";
import React, { useState } from "react";
import createAPI from "@/app/lib/axios";
import { useEffect } from "react";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { useRouter } from "next/navigation";


export default function Createjob() {

    const router = useRouter();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");
    const [title, setTitle] = useState("");
    const [jobLocation, setJobLocation] = useState("");
    const [description, setDescription] = useState("");
    const [currency, setCurrency] = useState("");
    const [minSalary, setMinSalary] = useState("");
    const [maxSalary, setMaxSalary] = useState("");
    const [salaryType, setSalaryType] = useState("");
    const [jobType, setJobType] = useState("");
    const [category, setCategory] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [experience, setExperience] = useState("");
    const [urgentHiring, setUrgentHiring] = useState(false);
    const [active, setActive] = useState(false);
    const [jobCategory, setJobCategory] = useState([]);
    const settings = useSiteSettings();
    const api = createAPI();

    const handletitlechange = (e) => setTitle(e.target.value);
    const handleLocationChange = (e) => setJobLocation(e.target.value);
    const handleDescriptionChange = (e) => setDescription(e.target.value);
    const handleSalaryTypeChange = (e) => setSalaryType(e.target.value);
    const handleCurrencyChange = (e) => setCurrency(e.target.value);
    const handleMinS = (e) => setMinSalary(e.target.value);
    const handleMaxS = (e) => setMaxSalary(e.target.value);
    const handleJobTypeChange = (e) => setJobType(e.target.value);
    const handleCategoryChange = (e) => setCategory(e.target.value);
    const handleCompanyNameChange = (e) => setCompanyName(e.target.value);
    const handleExperienceChange = (e) => setExperience(e.target.value);
    const handleUrgentHiringChange = () => setUrgentHiring(!urgentHiring);
    const handleActiveChange = () => setActive(!active);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description || !jobLocation || !minSalary || !maxSalary || !currency || !salaryType || !jobType || !category) {
            setError("All fields are required.");
            return;
        }

        if (parseFloat(minSalary) > parseFloat(maxSalary)) {
            setError("Minimum salary should be less than Maximum salary.");
            return;
        }

        try {

            const formData = new FormData();

            formData.append("job_title", title);
            formData.append("job_description", description);
            formData.append("job_location", jobLocation);
            formData.append("category", category);
            formData.append("minimum_salary", minSalary);
            formData.append("maximum_salary", maxSalary);
            formData.append("is_urgent_hiring", urgentHiring ? 'on' : 'off');
            formData.append("experience_years", experience);
            formData.append("job_type", jobType);
            formData.append("company_name", companyName);
            formData.append("currency", currency);
            formData.append("salary_date", salaryType);
            formData.append("is_active", active ? 'on' : 'off');

            const response = await api.post("/api/post-job", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.code == '200') {
                setSuccess("Job created successfully!");
                alert(response.data.message);
                setTimeout(() => router.push("/pages/jobs"), 2000);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            setError("Failed to create job. Please try again.");
        }
    };

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

    useEffect(() => {
        fetchJobCategories();
    }, []);

    if (!settings) return null;

    return (
        <div>

            <div className="container-fluid bg-light">
                <div className="container mt-3 pt-5">
                    <div className="row">
                        <div className="col-md-3 p-3 rounded">
                            <Rightnav />
                        </div>
                        <div className="col-md-9 p-3">
                            <div className="card shadow-lg border-0 p-3">
                                <div className="card-body">
                                    <h5 className="fw-bold mt-2 fs-4">Create a Job</h5>
                                    {success && <div className="alert alert-success mt-2">{success}</div>}
                                    {error && <p className="text-center text-danger">{error}</p>}

                                    <form onSubmit={handleSubmit}>
                                        <div className="mt-4">
                                            <label className="form-label mx-1 text-muted">Job Title</label>
                                            <input
                                                className="form-control px-3"
                                                type="text"
                                                placeholder="Job Title (Required)"
                                                value={title}
                                                onChange={handletitlechange}
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <label className="form-label mx-1 text-muted">Job Description</label>
                                            <textarea
                                                className="form-control px-3"
                                                rows="3"
                                                placeholder="Job Description (Required)"
                                                value={description}
                                                onChange={handleDescriptionChange}
                                            ></textarea>
                                        </div>

                                        <div className="mt-4">
                                            <label className="form-label mx-1 text-muted">Job Location</label>
                                            <input
                                                className="form-control px-3"
                                                type="text"
                                                placeholder="Job Location (Required)"
                                                value={jobLocation}
                                                onChange={handleLocationChange}
                                            />
                                        </div>

                                        <div className="mt-4 d-flex gap-3">
                                            <div className="w-50">
                                                <label className="form-label text-muted px-1">Salary Date</label>
                                                <select
                                                    className="form-select bg-light"
                                                    aria-label="Default select example"
                                                    value={salaryType}
                                                    onChange={handleSalaryTypeChange}
                                                >
                                                    <option value="Month">Month</option>
                                                    <option value="Week">Week</option>
                                                    <option value="Hour">Hour</option>
                                                    <option value="Year">Year</option>
                                                    <option value="Day">Day</option>
                                                </select>
                                            </div>
                                            <div className="w-50">
                                                <label className="form-label text-muted px-1">Currency</label>
                                                <select
                                                    className="form-select bg-light"
                                                    aria-label="Default select example"
                                                    value={currency}
                                                    onChange={handleCurrencyChange}
                                                >
                                                    <option value="">Select Currency</option>
                                                    {settings?.currecy_array?.map((cur, index) => (
                                                        <option key={index} value={cur}>
                                                            {cur}
                                                        </option>
                                                    ))}
                                                </select>

                                            </div>
                                        </div>

                                        <div className="mt-4 d-flex gap-3">
                                            <div className="w-50">
                                                <label className="form-label text-muted px-1">Minimum Salary</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Minimum Salary"
                                                    value={minSalary}
                                                    onChange={handleMinS}
                                                />
                                            </div>
                                            <div className="w-50">
                                                <label className="form-label text-muted px-1">Maximum Salary</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Maximum Salary"
                                                    value={maxSalary}
                                                    onChange={handleMaxS}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <label className="form-label text-muted px-1">Job Type</label>
                                            <select
                                                className="form-select bg-light"
                                                value={jobType}
                                                onChange={handleJobTypeChange}
                                            >
                                                <option value="">Select Job Type</option>
                                                <option value="Full Time">Full Time</option>
                                                <option value="Part Time">Part Time</option>
                                                <option value="Internship">Internship</option>
                                                <option value="Volunteer">Volunteer</option>
                                                <option value="Contract">Contract</option>
                                            </select>
                                        </div>

                                        <div className="mt-4">
                                            <label className="form-label text-muted px-1">Category</label>
                                            <select
                                                className="form-select bg-light"
                                                value={category}
                                                onChange={handleCategoryChange}
                                            >
                                                <option value="">Select Category</option>
                                                {jobCategory.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>

                                        </div>

                                        <div className="mt-4">
                                            <label className="form-label text-muted px-1">Company Name</label>
                                            <input
                                                className="form-control px-3"
                                                type="text"
                                                placeholder="Company Name"
                                                value={companyName}
                                                onChange={handleCompanyNameChange}
                                            />
                                        </div>

                                        <div className="mt-4">
                                            <label className="form-label text-muted px-1">Experience Years</label>
                                            <input
                                                className="form-control px-3"
                                                type="number"
                                                placeholder="Experience Years"
                                                value={experience}
                                                onChange={handleExperienceChange}
                                            />
                                        </div>

                                        <div className="form-check mt-4">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={urgentHiring}
                                                onChange={handleUrgentHiringChange}
                                                id="flexCheckUrgentHiring"
                                            />
                                            <label className="form-check-label text-muted" htmlFor="flexCheckUrgentHiring">
                                                Urgent Hiring
                                            </label>
                                        </div>

                                        <div className="form-check mt-4">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={active}
                                                onChange={handleActiveChange}
                                                id="flexCheckActive"
                                            />
                                            <label className="form-check-label text-muted" htmlFor="flexCheckActive">
                                                Active
                                            </label>
                                        </div>

                                        <div className="mt-4 d-flex justify-content-end">
                                            <button className="btn btn-primary" type="submit">
                                                Create a Job
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
