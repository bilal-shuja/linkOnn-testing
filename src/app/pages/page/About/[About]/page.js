"use client"
import { use } from "react";
import React, { useState, useEffect } from 'react';
import RightNav from '@/app/pages/page/components/rightNav';
import TimelineProfileCard from '@/app/pages/page/components/timelineProfileCard';

export default function About({ params }) {
  const { About } = use(params);
  const [pageTimelineData, setPageTimelineData] = useState('');

  useEffect(() => {
    const data = localStorage.getItem('_pageData');
    if (data) {
      setPageTimelineData(JSON.parse(data));
      // localStorage.removeItem('_pagesInfo');
    }
  }, []);



  const createdAt = pageTimelineData?.created_at;  
  const dateOnly = createdAt ? createdAt.split(" ")[0] : ""; 

  return (
    <>
      <div className="container mt-4">
        <div className="row d-flex justify-content-between">
          <div className="col-12 col-md-8">
            <TimelineProfileCard pageTimelineID={About} />


            <div className="card shadow-lg border-0 rounded-3 mt-3">
              <div className="card-header border-0 pb-0  bg-white">
                <h5 className="card-title text-primary">Page Profile Info</h5>
              </div>
              <div className="card-body">
                <div className="rounded border px-3 py-2 mb-3 text-muted bg-light">
                  <div className="d-flex align-items-center justify-content-between">
                    <h6>Overview</h6>
                  </div>
                  <p> {pageTimelineData?.page_description} </p>
                </div>
                <div className="row g-4">
                  <div className="col-6">
                    <div className="d-flex align-items-center rounded border px-3 py-2">
                      <p className="mb-0">
                        <i className="bi bi-people fa-fw me-2 text-primary" /> Followers like Count: <strong>{pageTimelineData?.likes_count}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center rounded border px-3 py-2">
                      <p className="mb-0">
                        <i className="bi bi-share-fill fa-fw me-2 text-primary" /> {pageTimelineData?.website} <strong></strong>
                      </p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center rounded border px-3 py-2">
                      <p className="mb-0">
                        <i className="bi bi-card-checklist fa-fw me-2 text-primary" /> Category: <strong> {pageTimelineData?.page_category}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center rounded border px-3 py-2">
                      <p className="mb-0">
                        <i className="bi bi-calendar fa-fw me-2 text-primary" /> Created on: <strong> {dateOnly} </strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>


          <RightNav pageTimelineData={pageTimelineData} />

        </div>
      </div>

    </>
  )
}
