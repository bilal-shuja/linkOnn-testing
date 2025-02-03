"use client";
import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import Navbar from "@/app/assets/components/navbar/page";
import Image from "next/image";
import { use } from "react";
import Link from "next/link";
import useAuth from "@/app/lib/useAuth";
import { toast } from "react-toastify";
import useConfirmationToast from "@/app/hooks/useConfirmationToast";

export default function MyPageTimeline({ params }) {

    useAuth();

    const api = createAPI();
    // const router = useRouter();
    const { myPageTimeline } = use(params);
    const [pageTimelineData, setPageTimelineData] = useState('');

    function fetchSpecificMyPageTimline() {

        api.post(`/api/get-page-data?page_id=${myPageTimeline}`)
            .then((res) => {
                if (res.data.code == "200") {
                    setPageTimelineData(res.data.data);
                }

            })
            .catch((error) => {
                if (error)
                    toast.error("Error fetching page timeline.");
            })

    }





    useEffect(() => {
        fetchSpecificMyPageTimline()
    }, []);





    return (
        <>
            <Navbar />
            <div className="container-fluid bg-light">
                <div className="container mt-3 pt-5">
                    <div className="row">

                        <div className="col-12 col-md-8">
                            <div className="card shadow-lg border-0 rounded-3 mt-5">
                                {/* {myPageTimeline} */}

                                <div className="position-relative">
                                    <Image
                                        src={ !pageTimelineData?.cover || pageTimelineData.cover.trim() === "" 
                                            ? '/assets/images/placeholder-image.png' 
                                            : pageTimelineData.cover}
                                        className="card-img-top rounded-top img-fluid"
                                        alt="cover"
                                        width={800}
                                        height={400}
                                        style={{ objectFit: 'cover', height: '200px' }}
                                    />
                                    <div
                                        className="position-absolute start-0 translate-middle-y ms-4"
                                        style={{ top: 'calc(125% - 31px)', zIndex: 2 }}
                                    >
                                        <Image
                                            className="rounded-circle border border-white border-3 shadow-sm"
                                            src={!pageTimelineData?.avatar || pageTimelineData.avatar.trim() === "" 
                                                ? '/assets/images/placeholder-image.png'  
                                                : pageTimelineData.avatar}
                                            alt="avatar"
                                            width={125}
                                            height={125}
                                            style={{ objectFit: 'cover' }}
                                            onError={(e) => {
                                                console.error('Image load error:', e);
                                                e.target.src = '/assets/images/placeholder-image.png';
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="card-body">
                                    <div className=" mt-1" style={{ marginLeft: '10em' }} >
                                        <div>
                                            <h5 className="text-dark">
                                                {pageTimelineData?.page_title}
                                            </h5>
                                                <span className="small text-muted">@{pageTimelineData?.website}</span>
                                            
                                            
                                            {/* 
                                                {user.first_name} {user.last_name}

                                                {user.user_level.verified_badge === '1'
                                             && (
                                            )}
                                                <i className="bi bi-patch-check-fill text-success ms-2"></i>
                                            <span className="badge bg-primary mt-1">
                                                {user.user_level.name == 'Premium' && (
                                            )}
                                                <i className="bi bi-diamond pe-1"></i>

                                                {user.user_level.name == 'basic' && (
                                            )}

                                                <i className="bi bi-star pe-1"></i>

                                                {user.user_level.name == 'Diamond' && (
                                            )}
                                                <i className="bi bi-gem pe-1"></i>
                                                {user.user_level.name}
                                            </span> */}
                                            
                                        </div>
                                    </div>
                                    <p className="text-muted mt-4 mx-3">
                                        {/* <i className="bi bi-calendar2-plus me-1"></i> */}
                                        {/* Joined on {moment(user.created_at).format("MMM DD, YYYY")} */}

                                    </p>

                                    <hr className="text-muted" />

                                    
                                    <div className="d-flex justify-content-start gap-4 ms-3">
                                        <div
                                            // href={`/pages/UserProfile/timeline/${myPageTimeline}`} 
                                            // text-light bg-primary rounded-pill px-2 fw-semibold
                                            className="text-decoration-none text-muted">
                                            Posts
                                        </div>
                                        <div
                                            // href={`/pages/UserProfile/about/${myPageTimeline}`}
                                            className="text-decoration-none text-muted">
                                            About
                                        </div>
                                        {/* <Link
                                            href={`/pages/UserProfile/friends/${myPageTimeline}`} 
                                            className="d-flex justify-content-evenly align-items-center text-decoration-none text-muted">
                                            Friends <span className="badge bg-success mx-1">
                                                {user.friends_count}


                                            </span>
                                        </Link> */}
                                        <div className="text-decoration-none text-muted">
                                            {/* href={`/pages/UserProfile/images/${myPageTimeline}`} */}
                                            Followers
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
