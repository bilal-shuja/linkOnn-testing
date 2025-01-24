"use client"

import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import useAuth from "@/app/lib/useAuth";
import createAPI from "@/app/lib/axios";
import { useState, useEffect } from 'react';
import { use } from "react";
import Image from "next/image";

export default function EventDetails({params}) {

    useAuth();

    const api = createAPI();

    const userid = localStorage.getItem("userid");

    const {eventDetails} = use(params)

    // const searchParams = useSearchParams();
    // const eveID = searchParams.get('id');


    const [specificEventDetails, setSpecificEventDetails] = useState();
    const [eventSection, setEventSection] = useState();

    function fetchSpecificEvent() {

        api.post("/api/event-details", { event_id: eventDetails })
            .then((res) => {
                if (res.data.code == "200") {
                    setSpecificEventDetails(res.data.data.event);
                    setEventSection(res.data.data);
                }
                else {
                    toast.error("Error fetching event details");
                }

            })
            .catch((error) => {
                if (error)
                    toast.error("Error fetching event details");
            })

    }



    useEffect(() => {
        fetchSpecificEvent();
    }, [])

    return (
        <>
            <Navbar />
            <div className="container-fluid bg-light">
                <div className="container mt-3 pt-5">
                    <div className="row">
                        <div className="col-md-3 p-3 rounded">
                            <Rightnav />
                        </div>

                        <div className="col-md-9 p-3 mt-2">
                            <div className="card shadow-lg border-0 p-3">

                                <div className='card-header border-0 border-bottom bg-white'>
                                    <div className="row g-2">
                                        <div className="col-lg-9">
                                            <h1 className="h4 card-title mb-lg-0">Event Details</h1>
                                        </div>
                                        <div className="col-sm-4 col-lg-3">
                                            <button className="btn btn-primary ms-auto w-100"
                                                onClick={() => router.push("/pages/Events/create-event")}><i className="fa-solid fa-plus pe-1"></i> Create Event</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    {userid === specificEventDetails?.user_id ? 
                                    (
                                        <ul className="nav nav-tabs nav-fill" id="myTab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link active bg-light" id="event-detail-tab" data-bs-toggle="tab" data-bs-target="#event-detail" type="button" role="tab" aria-controls="event-detail" aria-selected="true">Event Detail</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="interested-tab" data-bs-toggle="tab" data-bs-target="#interested" type="button" role="tab" aria-controls="interested" aria-selected="false" tabIndex={-1}>Interested</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="going-tab" data-bs-toggle="tab" data-bs-target="#going" type="button" role="tab" aria-controls="going" aria-selected="false" tabIndex={-1}>Going</button>
                                        </li>
                                    </ul>
                                    )

                                        :
                                        null
                                        
                                        }
                                    <div className="tab-content" id="myTabContent">
                                        <div className="tab-pane fade active show" id="event-detail" role="tabpanel" aria-labelledby="event-detail-tab">
                                            <div className="ed-main-wrap">
                                                <h3 className='mt-5'>{specificEventDetails?.name}</h3>
                                                <hr />
                                                <div className="event-info row align-items-center">
                                                    <div className="col text-center">
                                                        <div className="single-event-info">
                                                            <div className="info-icon"><i className="bi bi-stopwatch-fill" /></div>
                                                            <div className="info-content">
                                                                <h5>Event Start Time</h5>
                                                                <p>{specificEventDetails?.start_date} {specificEventDetails?.start_time}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col text-center">
                                                        <div className="single-event-info">
                                                            <div className="info-icon"><i className="bi bi-calendar-check" /></div>
                                                            <div className="info-content">
                                                                <h5>Event End Time</h5>
                                                                <p>{specificEventDetails?.end_date} {specificEventDetails?.end_time}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col text-center">
                                                        <div className="single-event-info">
                                                            <div className="info-icon"><i className="bi bi-geo-alt-fill" /></div>
                                                            <div className="info-content">
                                                                <h5>Location</h5>
                                                                <p>{specificEventDetails?.location}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-lg-9 mx-auto">
                                                    <div className="card">
                                                        <div className='card-body'>
                                                            <Image

                                                                src={specificEventDetails?.cover || '/assets/images/placeholder-image.png'}
                                                                className="img-fluid"
                                                                alt=''
                                                                width={1000}
                                                                height={100}

                                                            />
                                                        </div>
                                                    </div>
                                                 
                                                </div>

                                                <h4 className='mt-4'><i className="bi bi-text-paragraph"></i> Event Description</h4>
                                                <p className='text-muted small'>{specificEventDetails?.description}</p>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="interested" role="tabpanel" aria-labelledby="interested-tab">
                                            <div className="row">
                                                <div className="my-sm-5 py-sm-5 text-center">
                                                    {
                                                        eventSection?.interestedusers.length === 0 ? (
                                                            <>
                                                                <i className="display-1 text-body-secondary bi bi-person-x" />
                                                                <h4 className="mt-2 mb-3 text-body"> <p>No interested users yet</p> </h4>
                                                            </>
                                                        ) : null
                                                    }
                                              
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="going" role="tabpanel" aria-labelledby="going-tab">
                                            <div className="row">
                                                <div className="my-sm-5 py-sm-5 text-center">
                                                    {
                                                        eventSection?.goingusers.length === 0 ? (
                                                            <>
                                                                <i className="display-1 text-body-secondary bi bi-person-x" />
                                                                <h4 className="mt-2 mb-3 text-body"> <p>No going users yet</p> </h4>
                                                            </>
                                                        ) : null
                                                    }
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
        </>
    )
}
