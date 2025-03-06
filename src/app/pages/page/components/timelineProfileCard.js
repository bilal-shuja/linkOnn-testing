"use client";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import styles from '../css/page.module.css';
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from 'react';

export default function TimelineProfileCard({ pageTimelineID }) {

    const api = createAPI();
    const pathname = usePathname();
    const userID = localStorage.getItem('userid');
    const [pageTimelineData, setPageTimelineData] = useState('');


    const handlePagesInfo = () => {
        localStorage.setItem('_pageData', JSON.stringify(pageTimelineData));
    }

    

    function fetchSpecificMyPageTimline() {

        api.post(`/api/get-page-data?page_id=${pageTimelineID}`)
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
        fetchSpecificMyPageTimline();
    }, []);

    return (
        <>
            <div className="card shadow-lg border-0 rounded-3 mt-5">
                <div className="position-relative">
                    <Image
                        src={!pageTimelineData?.cover || pageTimelineData.cover.trim() === ""
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
                    <div className={`mt-1 ${styles.userTimelineInfoContainer}`}>
                        <div className="user-timeline-info">
                            <h5 className="text-dark">
                                {pageTimelineData?.page_title}
                            </h5>
                            <span className="small text-muted">@{pageTimelineData?.page_username}</span>
                        </div>
                        {
                            userID === pageTimelineData.user_id ?
                                <div className="edit-btn">
                                    <Link href={`/pages/page/editMyPage/${pageTimelineData.id}`} className="btn btn-danger"> <i className="fa fa-pencil"></i> Edit</Link>
                                </div>
                                :
                                null
                        }

                    </div>
                    <p className="text-muted mt-4 mx-3">
                        {/* <i className="bi bi-calendar2-plus me-1"></i> */}
                        {/* Joined on {moment(user.created_at).format("MMM DD, YYYY")} */}

                    </p>

                    <hr className="text-muted" />


                    <div className="d-flex justify-content-start gap-4 ms-3">
                        <Link
                            href={`/pages/page/myPageTimeline/${pageTimelineID}`}
                            // text-light bg-primary rounded-pill px-2 fw-semibold
                            className={`text-decoration-none ${pathname.includes("myPageTimeline") ? `${styles.activeLink}` : "text-muted"}`}

                        >
                            Posts
                        </Link>
                        <Link
                            href={`/pages/page/About/${pageTimelineID}`}
                            onClick={handlePagesInfo}
                            className={`text-decoration-none ${pathname.includes("About") ? `${styles.activeLink}` : "text-muted"}`}

                        >
                            About
                        </Link>
                        <Link
                            href={`/pages/page/Followers/${pageTimelineID}`}
                            className={`text-decoration-none ${pathname.includes("Followers") ? `${styles.activeLink}` : "text-muted"}`}
                            onClick={handlePagesInfo}

                        >

                            Followers
                        </Link>

                    </div>
                </div>

            </div>

        </>
    )
}
