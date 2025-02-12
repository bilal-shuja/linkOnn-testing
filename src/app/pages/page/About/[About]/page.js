"use client"
import { use } from "react";
import React, { useState, useEffect } from 'react';
import RightNav from '../../components/rightNav';
import TimelineProfileCard from '../../components/timelineProfileCard';

export default function About({ params }) {
  const { About } = use(params);
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
                  <p> Cupidatat deserunt tempora eu beatae iste autem tempora quibusdam a aut nobis veniam </p>
                </div>
                <div className="row g-4">
                  <div className="col-6">
                    <div className="d-flex align-items-center rounded border px-3 py-2">
                      <p className="mb-0">
                        <i className="bi bi-people fa-fw me-2 text-primary" /> Followers Count: <strong> 1</strong>
                      </p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center rounded border px-3 py-2">
                      <p className="mb-0">
                        <i className="bi bi-shield-lock fa-fw me-2 text-primary" /> Facebook: <strong></strong>
                      </p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center rounded border px-3 py-2">
                      <p className="mb-0">
                        <i className="bi bi-card-checklist fa-fw me-2 text-primary" /> Category: <strong> Health &amp; Wellness</strong>
                      </p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center rounded border px-3 py-2">
                      <p className="mb-0">
                        <i className="bi bi-calendar fa-fw me-2 text-primary" /> Created on: <strong> Jan 21, 2025 </strong>
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
