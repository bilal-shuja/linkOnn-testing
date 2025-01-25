"use client"
import { useState, useEffect } from "react";
import { use } from "react";
import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import useAuth from "@/app/lib/useAuth";
import createAPI from "@/app/lib/axios";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';

export default function EditJob({params}) {

    useAuth();

    const api = createAPI();
    const router = useRouter();
    const {editJob} = use(params);


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
                            <input type="text" className="form-control" id="job_title" name="job_title" placeholder="Job Title" defaultValue="Officiis est nisi id" />
                        </div>
                        <div className="col-12 mb-2">
                            <label className="form-label">Job Description</label>
                            <textarea className="form-control" id="job_description" name="job_description" rows={3} placeholder="Job Description" defaultValue={"Eveniet sequi repel"} />
                        </div>
                        <div className="col-12 mb-2">
                            <label className="form-label">Job Location</label>
                            <input type="text" className="form-control" id="job_location" name="job_location" placeholder="Job Location" defaultValue="Quisquam consequuntu" />
                        </div>

                        <div className="row mb-2">
                        <div className="col-sm-6">
                            <label className="form-label">Salary Date</label>
                            <select name="salary_date" id className="form-control">
                            <option value="month" selected>Month</option>
                            <option value="week">Week</option>
                            <option value="hour">Hour</option>
                            <option value="year">Year</option>
                            <option value="day">Day</option>
                            </select>
                        </div>
                        <div className="col-sm-6">
                            <label className="form-label">Currency</label>
                            <select className="form-control" id="currency" name="currency">
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
                            <input type="number" className="form-control" id="minimum_salary" name="minimum_salary" placeholder="Minimum Salary" defaultValue={6} />
                        </div>
                        <div className="col-sm-6">
                            <label className="form-label">Maximum Salary</label>
                            <input type="number" className="form-control" id="maximum_salary" name="maximum_salary" placeholder="Maximum Salary" defaultValue={22} />
                        </div>
                        </div>

                        <div className="col-12 mb-2">
                            <label htmlFor="job_type" className="form-label">Job Type</label>
                            <select className="form-select" id="job_type" name="job_type" required>
                            <option value selected>Select Job Type</option>
                            <option value="fulltime">Full Time</option>
                            <option value="parttime">Part Time</option>
                            <option value="internship">Internship</option>
                            <option value="volunteer" >Volunteer</option>
                            <option value="contract">Contract</option>
                            </select>
                        </div>
                        <div className="col-12 mb-2">
                            <label htmlFor="category" className="form-label">Category</label>
                            <select className="form-select" id="category" name="category" required>
                            <option value selected>Select Category</option>
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
                            <option value={19} selected>Agriculture and Forestry</option>
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
                            <option value={33}>testing</option>
                            </select>
                            <div className="invalid-feedback">Please select a category</div>
                        </div>
                        <div className="col-12 mb-2">
                            <label className="form-label">Company Name</label>
                            <input type="text" className="form-control" id="company_name" name="company_name" placeholder="Company Name" defaultValue="Rutledge Little Plc" />
                        </div>

                        <div className="col-12 mb-2">
                            <label className="form-label">Experience Years</label>
                            <input type="number" className="form-control" id="experience_years" name="experience_years" placeholder="Experience Years" defaultValue={2} maxLength={2} />
                        </div>
                        
                        <div className="row">
                        <div className="col-lg-2">
                            <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="is_active" name="is_active" defaultChecked />
                            <label className="form-check-label" htmlFor="is_active">
                                Active                          
                            </label>
                            </div>
                        </div>

                        <div className="col-lg-2">
                            <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="is_urgent_hiring" name="is_urgent_hiring" />
                            <label className="form-check-label" htmlFor="is_urgent_hiring">
                                Urgent Hiring                          
                                </label>
                            </div>
                        </div>


                        </div>


                        <div className="col-12 text-end">
                            <button type="submit" className="btn btn-primary mb-0">Update Job </button>
                        </div>

                   </div>
                 </div>
               </div>


                    </div>
                </div>
            </div>
        </div>
    )
}
