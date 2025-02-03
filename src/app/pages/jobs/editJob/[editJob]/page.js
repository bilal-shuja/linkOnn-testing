"use client"
import { useState, useEffect } from "react";
import { use } from "react";
 
import Rightnav from "@/app/assets/components/rightnav/page";
   
import createAPI from "@/app/lib/axios";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import Link from "next/link";


export default function EditJob({ params }) {

      

    const api = createAPI();
    const router = useRouter();
    const { editJob } = use(params);

    const [specificJobDetails, setSpecificJobDetails] = useState("");

    const [jobTitle, seJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [jobLocation, setJobLocation] = useState('');
    const [salaryDate, setSalaryDate] = useState('');
    const [currency, setCurrency] = useState('');
    const [minimSalary, setMiniSalary] = useState('');
    const [maxSalary, setMaxSalary] = useState('');
    const [jobType, setJobType] = useState('');
    const [jobSelectedCategory, setJobSelectedCategory] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [yearsOfExp, setYearOfExp] = useState('');

    const [jobCategories, setJobCategories] = useState([]);
    const [isActive, setIsActive] = useState("0");
    const [isUrgentHiring, setIsUrgentHiring] = useState("0")




    function fetchSpecificJob() {

        api.post("/api/job-details", { job_id: editJob })
            .then((res) => {

                if (res.data.status == 200) {
                    setSpecificJobDetails(res.data.data);
                    setCurrency(res.data.data.currency)
                    setSalaryDate(res.data.data.salary_date)
                    setJobType(res.data.data.job_type)
                    setIsActive(res.data.data.is_active)
                }
                else {
                    toast.error("Error fetching job details");
                }
            })
            .catch((error) => {
                if (error)
                    toast.error("Error fetching job details");
            })

    }

    function fetchJobCategories() {
        api.get("/api/get-job_categories")
            .then((res) => {

                if (res.data.code == "200") {
                    setJobCategories(res.data.data);
                }

            })
            .catch((error) => {
                console.log(error)
                if (error) toast.error("Error fetching job categories");
            })

    }

    const updateJobDetails = () => {

        // try {
        const formData = new FormData();
        if (editJob) formData.append("job_id", editJob);
        if (jobTitle) formData.append("job_title", jobTitle);
        if (jobDescription) formData.append("job_description", jobDescription);
        if (jobLocation) formData.append("job_location", jobLocation);
        if (salaryDate) formData.append("salary_date", salaryDate);


        if (jobSelectedCategory) formData.append("category", jobSelectedCategory);
        if (minimSalary) formData.append("minimum_salary", minimSalary);
        if (maxSalary) formData.append("maximum_salary", maxSalary);
        if (yearsOfExp) formData.append("experience_years", yearsOfExp);
        if (jobType) formData.append("job_type", jobType);
        if (companyName) formData.append("company_name", companyName);
        if (currency) formData.append("currency", currency);

        
        if (isActive) formData.append("is_active", isActive);

        if (isUrgentHiring) formData.append("is_urgent_hiring", isUrgentHiring);







        api.post("/api/update-job-post", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(async (res) => {

                if (res.data.code == "200") {
                    toast.success(res.data.message);
                    setTimeout(() => {
                        router.push('/pages/jobs');
                    }, 1000);
                }
                else {
                    toast.error("Error from server: " + res.data.message);
                }
            })
            .catch((error) => {

                toast.error(error)
            })

    }





    useEffect(() => {
        fetchSpecificJob();
        fetchJobCategories();
    }, [])






    return (
        <div>
            <Navbar />
            <div className="container-fluid bg-light">
                <div className="container mt-3 pt-5">
                    <div className="row">
                        <div className="col-md-3 p-3 rounded">
                            <Rightnav />
                        </div>

                        <div className="col-md-9 p-3 mt-2">
                            <div className="card shadow-lg border-0 p-3">
                                <div className="card-body">

                                    <h5 className="fw-bold  fs-4">Update Job</h5>

                                    <div className="col-12 mb-2">
                                        <label className="form-label">Job Title</label>
                                        <input type="text" className="form-control" id="job_title" name="job_title" placeholder="Job Title"
                                            onChange={(e) => seJobTitle(e.target.value)}
                                            defaultValue={specificJobDetails.job_title}

                                        />
                                    </div>
                                    <div className="col-12 mb-2">
                                        <label className="form-label">Job Description</label>
                                        <textarea className="form-control" id="job_description" name="job_description" rows={3} placeholder="Job Description"
                                            onChange={(e) => setJobDescription(e.target.value)}
                                            defaultValue={specificJobDetails.job_description}

                                        />
                                    </div>
                                    <div className="col-12 mb-2">
                                        <label className="form-label">Job Location</label>
                                        <input type="text" className="form-control" id="job_location" name="job_location" placeholder="Job Location"
                                            onChange={(e) => setJobLocation(e.target.value)}
                                            defaultValue={specificJobDetails.job_location}

                                        />
                                    </div>

                                    <div className="row mb-2">
                                        <div className="col-sm-6">
                                            <label className="form-label">Salary Date</label>
                                            <select name="salary_date" className="form-control"
                                                onChange={(e) => setSalaryDate(e.target.value)}
                                                value={salaryDate || specificJobDetails.salary_date || ''}
                                            >
                                                <option value="month">Month</option>
                                                <option value="week">Week</option>
                                                <option value="hour">Hour</option>
                                                <option value="year">Year</option>
                                                <option value="day">Day</option>
                                            </select>
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="form-label">Currency</label>
                                            <select className="form-control" id="currency" name="currency"
                                               value={currency || specificJobDetails.currency || ''}
                                                onChange={(e) => setCurrency(e.target.value)}


                                            >
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                                <option value="JPY">JPY</option>
                                                <option value="TRY">TRY</option>
                                                <option value="GBP">GBP</option>
                                                <option value="RUB">RUB</option>
                                                <option value="PLN">PLN</option>
                                                <option value="ILS">ILS</option>
                                                <option value="BRL">BRL</option>
                                                <option value="INR">INR</option>
                                                <option value="PKR">PKR</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row mb-2">
                                        <div className="col-sm-6">
                                            <label className="form-label">Minimum Salary</label>
                                            <input type="number" className="form-control" id="minimum_salary" name="minimum_salary" placeholder="Minimum Salary"
                                                defaultValue={specificJobDetails.minimum_salary}
                                                onChange={(e) => setMiniSalary(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="form-label">Maximum Salary</label>
                                            <input type="number" className="form-control" id="maximum_salary" name="maximum_salary" placeholder="Maximum Salary"
                                                defaultValue={specificJobDetails.maximum_salary}
                                                onChange={(e) => setMaxSalary(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 mb-2">
                                        <label htmlFor="job_type" className="form-label">Job Type</label>
                                        <select className="form-select" id="job_type" name="job_type"
                                            onChange={(e) => setJobType(e.target.value)}
                                            value={jobType || specificJobDetails.job_type || ''}
                                        >
                                            <option value="" disabled>Select Job Type</option>
                                            <option value="fulltime">Full Time</option>
                                            <option value="parttime">Part Time</option>
                                            <option value="internship">Internship</option>
                                            <option value="volunteer" >Volunteer</option>
                                            <option value="contract">Contract</option>
                                        </select>
                                    </div>
                                    <div className="col-12 mb-2">
                                        <label htmlFor="category" className="form-label">Category</label>
                                        <select className="form-select" id="category" name="category"

                                            value={jobSelectedCategory || jobCategories.find(cat => cat.name === specificJobDetails?.category)?.id || ''}
                                            onChange={(e) => {
                                                setJobSelectedCategory(e.target.value);
                                            }}
                                        >
                                            {/* <option disabled>Select Category</option> */}
                                            {jobCategories?.map((jobCate) => (
                                                <option key={jobCate.id} value={jobCate.id}>
                                                    {jobCate.name}
                                                </option>
                                            ))}
                                            {/* 
                            <option value={1}>Healthcares</option>
                            <option value={2}>Government</option>
                            <option value={3}>Science and Research</option>
                            <option value={4}>Information Technology</option>
                            <option value={5}>Transportation</option>
                            <option value={6}>Education</option>
                            <option value={7}>Finance</option>
                            <option value={8}>Sales</option>
                            <option value={9}>Engineering</option>
                            <option value={10}>Hospitality</option>
                            <option value={11}>Retail</option>
                            <option value={12}>Human Resources</option>
                            <option value={13}>Construction</option>
                            <option value={14}>Marketing</option>
                            <option value={15}>Legal</option>
                            <option value={16}>Customer Service</option>
                            <option value={17}>Design</option>
                            <option value={18}>Media and Entertainment</option>
                            <option value={19}>Agriculture and Forestry</option>
                            <option value={20}>Arts and Culture</option>
                            <option value={21}>Real Estate</option>
                            <option value={22}>Manufacturing</option>
                            <option value={23}>Environmental</option>
                            <option value={24}>Non-Profit and Social Services</option>
                            <option value={25}>Telecommunications</option>
                            <option value={26}>Sports and Recreation</option>
                            <option value={27}>Travel and Tourism</option>
                            <option value={28}>Food Services</option>
                            <option value={29}>Beauty and Wellness</option>
                            <option value={30}>Security and Law Enforcement</option>
                            <option value={31}>Writer</option>
                            <option value={32}>test</option>
                            <option value={33}>testing</option> */}

                                        </select>
                                        {/* <div className="invalid-feedback">Please select a category</div> */}
                                    </div>
                                    <div className="col-12 mb-2">
                                        <label className="form-label">Company Name</label>
                                        <input type="text" className="form-control" id="company_name" name="company_name" placeholder="Company Name"

                                            defaultValue={specificJobDetails.company_name}
                                            onChange={(e) => setCompanyName(e.target.value)}

                                        />
                                    </div>

                                    <div className="col-12 mb-2">
                                        <label className="form-label">Experience Years</label>
                                        <input type="number" className="form-control" id="experience_years" name="experience_years" placeholder="Experience Years"
                                            onChange={(e) => setYearOfExp(e.target.value)}

                                            defaultValue={specificJobDetails.experience_years}
                                            maxLength={2}
                                        />
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-2">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox"
                                                    id="is_active"
                                                    name="is_active"
                                                    checked={isActive === "1"}
                                                    onChange={(e) => setIsActive(e.target.checked ? "1" : "0")}
                                                />
                                                <label className="form-check-label" htmlFor="is_active">
                                                    Active
                                                </label>
                                            </div>
                                        </div>

                                        <div className="col-lg-2">
                                            <div className="form-check">
                                                <input className="form-check-input"
                                                    type="checkbox"
                                                    id="is_urgent_hiring"
                                                    name="is_urgent_hiring"
                                                    checked={isUrgentHiring === "1"}
                                                    onChange={(e) => setIsUrgentHiring(e.target.checked ? "1" : "0")}

                                                />
                                                <label className="form-check-label" htmlFor="is_urgent_hiring">
                                                    Urgent Hiring
                                                </label>
                                            </div>
                                        </div>


                                    </div>


                                    <div className="col-12 text-end">
                                    <Link href="/pages/jobs" className="btn btn-danger me-2">Cancel</Link>
                                        <button type="submit" className="btn btn-primary mb-0"
                                            onClick={updateJobDetails}
                                        >Update Job </button>
                                    </div>

                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </>
    )
}
