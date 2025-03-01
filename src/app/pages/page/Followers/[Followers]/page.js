"use client";
import { use } from "react";
import RightNav from '../../components/RightNav';
import React, { useState, useEffect } from 'react';
import TimelineProfileCard from '../../components/TimelineProfileCard';

export default function Followers({ params }) {
    const { Followers } = use(params);

    const [pageTimelineData, setPageTimelineData] = useState(null);

    useEffect(() => {
        const data = localStorage.getItem('_pagesInfo');
        if (data) {
            setPageTimelineData(JSON.parse(data));
            localStorage.removeItem('_pagesInfo');
        }
    }, []);
    return (
        <>
            <div className="container mt-4">
                <div className="row d-flex justify-content-between">
                    <div className="col-12 col-md-8">
                        <TimelineProfileCard pageTimelineID={Followers} />


                        <div className="card shadow-lg border-0 rounded-3 mt-3">
                            <div className="card-header border-0 pb-0 bg-white">
                                <h5 className="card-title text-primary">Page Followers</h5>
                            </div>
                            <div className="card-body">
                                <div className="rounded border px-3 py-2 mb-3">
                                    <div className="row g-4">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="my-sm-5 py-sm-5 text-center">
                                                    <i className="display-1  bi bi-people-fill text-primary" />
                                                    <h4 className="mt-2 mb-3 text-body">No Followers Found!</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>


                    <RightNav pageTimelineData={pageTimelineData} pageTimelineID={Followers} />

                </div>
            </div>

        </>
    )
}
