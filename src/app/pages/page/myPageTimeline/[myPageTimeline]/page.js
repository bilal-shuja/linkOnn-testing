"use client";
import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import Image from "next/image";
import { use } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
// import useConfirmationToast from "@/app/hooks/useConfirmationToast";
import styles from '../../css/page.module.css';
import EmojiPicker from 'emoji-picker-react';
// import { Dropzone, FileMosaic } from "@files-ui/react";
import RightNav from "../../components/rightNav";



export default function MyPageTimeline({ params }) {


    const api = createAPI();
    const userID = localStorage.getItem('userid');
    const { myPageTimeline } = use(params);
    const [pageTimelineData, setPageTimelineData] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [postText, setPostText] = useState("");

    const [color, setColor] = useState("");




    const handlePostTextChange = (e) => { setPostText(e.target.value) };

    const handleEmojiButtonClick = () => {
        setShowEmojiPicker((prev) => !prev);
    };

    const handleEmojiSelect = (emoji) => {
        setPostText((prevText) => prevText + emoji.emoji);
        setShowEmojiPicker(false);
    };

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
        fetchSpecificMyPageTimline();
    }, []);

    const [files, setFiles] = useState([]);
    const updateFiles = (incommingFiles) => {
        setFiles(incommingFiles);
    };





    return (
        <>
            <div className="container-fluid bg-light">
                <div className="container mt-3 pt-5">
                    <div className="row">

                        <div className="col-12 col-md-8">
                            <div className="card shadow-lg border-0 rounded-3 mt-5">
                                {/* {myPageTimeline} */}

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
                                    <div className={` mt-1 ${styles.userTimelineInfoContainer}`}  >
                                        <div className="user-timeline-info">
                                            <h5 className="text-dark">
                                                {pageTimelineData?.page_title}
                                            </h5>
                                            <span className="small text-muted">@{pageTimelineData?.website}</span>
                                        </div>
                                        {
                                            userID === pageTimelineData.user_id ?
                                                <div className="edit-btn">
                                                    <Link href={`/pages/page/editMyPage/${pageTimelineData.id}`} className="btn btn-danger"> <i className="fa fa-pencil"></i> Edit button</Link>
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

                            <div className="card shadow-lg border-0 rounded-3 mt-5">
                                <div className="card-body">

                                    <div className="form-floating">
                                        <textarea className={`form-control border border-0 ${styles.pagePostInput}`}
                                            placeholder="Leave a comment here"
                                            id="floatingTextarea2"
                                            style={{ height: "150px", backgroundColor: color }}
                                            value={postText}
                                            onChange={handlePostTextChange}
                                        />
                                        <label htmlFor="floatingTextarea2" className="small text-muted mb-2">Share your thoughts....</label>

                                        <button type="button" id="emoji-button" onClick={handleEmojiButtonClick} className="p-1 btn btn-light position-absolute trigger" style={{ right: "10px", top: "10px" }}>😊</button>

                                        {showEmojiPicker && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '-100px',
                                                    left: '600px',
                                                    zIndex: '1000',
                                                }}
                                            >
                                                <EmojiPicker
                                                    onEmojiClick={handleEmojiSelect}
                                                    width="100%"
                                                    height="400px"
                                                />
                                            </div>
                                        )}
                                        <input
                                            type="color"
                                            className="form-control-color mb-4"
                                            id="exampleColorInput"
                                            title="Choose your color"
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                        />


                                            <div className="mb-3">
                                            {/* <label for="formFile" className="form-label">Default file input example</label> */}
                                            <input className="form-control form-control-sm" type="file" id="formFile"/>
                                            </div>

                                        {/* <div className="card p-2  mb-2" style={{width:"10em", height: "7em", border:"3px dotted blue" }}>
                                            <div className="d-flex justify-content-center align-self-center">
                                                <i className="bi bi-plus " style={{ fontSize: "30px" }}></i> 
                                             
                                            </div>
                                        </div> */}

                                        {/* 
                                            <Dropzone onChange={updateFiles} value={files}
                                            className="mb-3"
                                            style={{ width: '250px', height: '150px' }}
                                            >
                                                {files.map((file) => (
                                                    <div key={file.id}>
                                                         <FileMosaic {...file} preview 
                                                    />
                                                    </div>
                                                   
                                                ))}
                                                </Dropzone> */}

                                        <ul className="nav nav-pills nav-stack  fw-normal justify-content-between">
                                            <li className="nav-item">
                                                <button className="nav-link photos_link bg-light py-1  px-2 mb-0 text-muted" href="#!">
                                                    <i className="bi bi-image-fill text-success pe-2" />
                                                    Photo
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button className="nav-link video_link bg-light py-1 px-2 mb-0 text-muted" href="#!">
                                                    <i className="bi bi-camera-reels-fill text-info pe-2" />
                                                    Video
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button className="nav-link audio_link bg-light py-1 px-2 mb-0 text-muted" href="#!">
                                                    <i className="bi bi-music-note-beamed text-primary pe-2" />
                                                    Audio
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button href="#" className="nav-link location_link bg-light py-1 px-2 mb-0 text-muted">
                                                    <i className="bi bi-geo-alt-fill text-danger pe-2" /> Location
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button href="https://demo.socioon.com/events/create-event" className="nav-link event_link bg-light py-1 px-2 mb-0 text-muted">
                                                    <i className="bi bi-calendar2-event-fill text-danger pe-2" /> Event
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button href className="nav-link event_link bg-light py-1 px-2 mb-0 text-muted" data-bs-toggle="modal" data-bs-target="#pollModel">
                                                    <i className="fas fa-poll text-info pe-1" /> Poll                  </button>
                                            </li>
                                            <li className="nav-item">
                                                <button href className="nav-link event_link bg-light py-1 px-2 mb-0 text-muted" data-bs-toggle="modal" data-bs-target="#fundModel">
                                                    <i className="fas fa-hand-holding-usd text-success pe-1" /> Raise funding                  </button>
                                            </li>
                                        </ul>



                                    </div>
                                </div>

                            </div>

                        </div>


                    <RightNav pageTimelineData = {pageTimelineData}/>

                    </div>
                </div>
            </div>

        </>
    )
}
