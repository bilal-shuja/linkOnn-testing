"use client";

import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import useAuth from "@/app/lib/useAuth";

export default function Packages() {
    useAuth();

    return (
        <div>
            <Navbar />
            <div className="container-fluid bg-light">
                <div className="container mt-5 pt-5">
                    <div className="row">
                        <div className="col-md-3">
                            <Rightnav />
                        </div>
                        <div className="col-md-9 p-3">
                            <div className="card mb-3 shadow-lg border-0">
                                <div className="card-body p-4">
                                    <h4 className="fw-bold">Pick Your Plan</h4>
                                    <p className="text-secondary">Pro features give you complete control over your profile.</p>
                                    <hr className="text-muted my-4" />
                                    <div className="row">
                                        
                                        <div className="col-md-4 mb-4">
                                            <div className="card h-100 shadow-lg border-0 p-2 package-card">
                                                <div className="card-body">
                                                    <h5 className="fw-bold text-uppercase text-center">Basic</h5>
                                                    <h2 className="fw-bold text-center my-3">$0<span className="fs-6 fw-semibold">/year</span></h2>
                                                    <hr className="text-muted m-0" />
                                                    <ul className="list-unstyled my-4 mx-3">
                                                        <li className="my-2"> <i className="fas fa-close text-danger"></i> Feature Members</li>
                                                        <li className="my-2"> <i className="fas fa-close text-danger"></i> Verified Badge</li>
                                                        <li className="my-2"> <i className="fas fa-check text-success"></i> Page Promotion</li>
                                                        <li className="my-2"> <i className="fas fa-check text-success"></i> Post Promotion</li>
                                                        <li className="my-2"> <i className="fas fa-close text-danger"></i> Edit Post</li>
                                                        <li className="my-2"> <i className="fas fa-check text-success"></i> 0 Point Spendable</li>
                                                    </ul>
                                                    <button className="btn btn-outline-primary w-100 rounded-pill">Select</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-4">
                                            <div className="card h-100 shadow-lg border-0 package-card">
                                                <div className="card-body">
                                                    <h5 className="fw-bold text-uppercase text-center">Diamond</h5>
                                                    <h2 className="fw-bold text-center my-3">$20<span className="fs-6 fw-semibold">/year</span></h2>
                                                    <hr className="text-muted m-0" />
                                                    <ul className="list-unstyled my-4 mx-3">
                                                        <li className="my-2"> <i className="fas fa-check text-success"></i> Feature Members</li>
                                                        <li className="my-2"> <i className="fas fa-close text-danger"></i> Verified Badge</li>
                                                        <li className="my-2"> <i className="fas fa-check text-success"></i> Page Promotion</li>
                                                        <li className="my-2"> <i className="fas fa-close text-danger"></i>  Post Promotion</li>
                                                        <li className="my-2"> <i className="fas fa-check text-success"></i> Edit Post</li>
                                                        <li className="my-2"> <i className="fas fa-check text-success"></i> 10 Point Spendable</li>
                                                    </ul>
                                                    <button className="btn btn-outline-primary w-100 rounded-pill">Select</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4 mb-4">
                                            <div className="card h-100 shadow-lg border-0 package-card">
                                                <div className="card-body">
                                                    <h5 className="fw-bold text-uppercase text-center">Premium</h5>
                                                    <h2 className="fw-bold text-center my-3">$60<span className="fs-6 fw-semibold">/year</span></h2>
                                                    <hr className="text-muted m-0" />
                                                    <ul className="list-unstyled my-4 mx-3">
                                                        <li className="my-2"> <i className="fas fa-check text-success"></i> Feature Members</li>
                                                        <li className="my-2"> <i className="fas fa-check text-success"></i> Verified Badge</li>
                                                        <li className="my-2"> <i className="fas fa-check text-success"></i> Page Promotion</li>
                                                        <li className="my-2"> <i className="fas fa-check text-success"></i> Post Promotion</li>
                                                        <li className="my-2"> <i className="fas fa-check text-success"></i> Edit Post</li>
                                                        <li className="my-2"> <i className="fas fa-check text-success"></i> 40 Point Spendable</li>
                                                    </ul>
                                                    <button className="btn btn-outline-success w-100 rounded-pill">Selected</button>
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
        </div>
    );
}
