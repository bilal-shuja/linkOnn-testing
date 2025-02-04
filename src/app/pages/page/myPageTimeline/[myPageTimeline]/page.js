"use client";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import EmojiPicker from 'emoji-picker-react';
import styles from '../../css/page.module.css';
import RightNav from "../../components/rightNav";
import React, { useState, useEffect } from "react";
import PostPollModal from "../../Modal/PostPollModal";
// import { Dropzone, FileMosaic } from "@files-ui/react";
// import useConfirmationToast from "@/app/hooks/useConfirmationToast";



export default function MyPageTimeline({ params }) {


    const api = createAPI();
    const userID = localStorage.getItem('userid');
    const { myPageTimeline } = use(params);
    const [pageTimelineData, setPageTimelineData] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [postText, setPostText] = useState("");

    const [color, setColor] = useState("");


    const [images, setImages] = useState([]);
    const [videoFiles, setVideoFiles] = useState([]);
    const [audioFiles, setAudioFiles] = useState([]);

    const [location, setLocation] = useState('');


    const [photoSection, setPhotoSection] = useState(false);
    const [videoSection, setVideoSection] = useState(false);
    const [audioSection, setAudioSection] = useState(false);

    const [showLocationField, setShowLocationField] = useState(false);

    const [pollModal, setPollModal] = useState(false);


    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setImages([...images, ...newImages]);
    };

    const removeImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
    };



    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const newVideos = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setVideoFiles((prevFiles) => [...prevFiles, ...newVideos]);
    };

    const removeVideo = (index) => {
        const updatedVideos = videoFiles.filter((_, i) => i !== index);
        setVideoFiles(updatedVideos);
    };


    const handleAudioChange = (event) => {
        const files = Array.from(event.target.files);
        const newAudio = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setAudioFiles((prevFiles) => [...prevFiles, ...newAudio]);
    };

    const removeAudio = (index) => {
        const updatedVideos = audioFiles.filter((_, i) => i !== index);
        setAudioFiles(updatedVideos);
    };





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
                                    <div className={`mt-1 ${styles.userTimelineInfoContainer}`}>
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

                            <div className="card shadow-lg border-0 rounded-3 mt-3">
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

                                        {
                                            photoSection ?
                                                <>
                                                    <div style={{ display: "flex", gap: "20px", marginTop: "5px", flexWrap: "wrap" }}>
                                                        {images.map((img, index) => (
                                                            <div key={index} style={{ position: "relative", display: "inline-block" }}>

                                                                <button
                                                                    onClick={() => removeImage(index)}
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: "-5px",
                                                                        right: "-5px",
                                                                        color: "white",
                                                                        border: "none",
                                                                        borderRadius: "50%",
                                                                        cursor: "pointer",
                                                                    }}
                                                                >
                                                                    <i className="bi bi-trash text-danger" />
                                                                </button>

                                                                <Image
                                                                    className="mb-3"
                                                                    src={img.url}
                                                                    alt={`Preview ${index}`}
                                                                    width={50}
                                                                    height={50}
                                                                    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>


                                                    <div className="col-lg-12 mb-3">
                                                        <input className="form-control form-control-sm" type="file" id="formFile" onChange={handleImageChange} multiple />
                                                    </div>
                                                </>

                                                :
                                                ""

                                        }



                                        {
                                            videoSection ?
                                                <>

                                                    <div style={{ display: "flex", gap: "20px", marginTop: "5px", flexWrap: "wrap" }}>
                                                        {videoFiles.map((video, index) => (
                                                            <div key={index} style={{ position: "relative", display: "inline-block" }}>

                                                                <button
                                                                    onClick={() => removeVideo(index)}
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: "10px",
                                                                        right: "-5px",
                                                                        color: "white",
                                                                        border: "none",
                                                                        borderRadius: "50%",
                                                                        cursor: "pointer",
                                                                    }}
                                                                >
                                                                    <i className="bi bi-trash text-danger" />
                                                                </button>

                                                                <video width="120" height="120" controls>
                                                                    <source src={video.url} type={video.file.type} />
                                                                    Your browser does not support the video tag.
                                                                </video>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="col-lg-12 mb-3">
                                                        <input
                                                            className="form-control form-control-sm"
                                                            type="file"
                                                            id="formFile"
                                                            accept="video/*"
                                                            multiple
                                                            onChange={handleFileChange}
                                                        />


                                                    </div>
                                                </>
                                                :
                                                ""
                                        }


                                        {
                                            audioSection ?
                                                <>

                                                    <div style={{ display: "flex", gap: "20px", marginTop: "5px", flexWrap: "wrap" }}>
                                                        {audioFiles.map((audio, index) => (
                                                            <div key={index} style={{ position: "relative", display: "inline-block" }}>

                                                                <button
                                                                    onClick={() => removeAudio(index)}
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: "10px",
                                                                        right: "-5px",
                                                                        color: "white",
                                                                        border: "none",
                                                                        borderRadius: "50%",
                                                                        cursor: "pointer",
                                                                    }}
                                                                >
                                                                    <i className="bi bi-trash text-danger" />
                                                                </button>

                                                                <audio width="120" height="120" controls>
                                                                    <source src={audio.url} type={audio.file.type} />
                                                                    Your browser does not support the video tag.
                                                                </audio>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="col-lg-12 mb-3">
                                                        <input
                                                            className="form-control form-control-sm"
                                                            type="file"
                                                            id="formFile"
                                                            accept="audio/*"
                                                            multiple
                                                            onChange={handleAudioChange}
                                                        />


                                                    </div>
                                                </>
                                                :
                                                ""
                                        }


                                        {
                                            showLocationField ?
                                                <div className="col-lg-12 mb-2">
                                                    <label className="form-label text-muted"> <i className="bi bi-geo-alt-fill"></i> location</label>
                                                    <input className="form-control" placeholder="Where are you at?" onChange={(e) => setLocation(e.target.value)} />
                                                </div>
                                                :
                                                ""

                                        }







                                        <ul className="nav nav-pills nav-stack  fw-normal justify-content-between">
                                            <li className="nav-item">
                                                <button className="nav-link photos_link bg-light py-1  px-2 mb-0 text-muted"
                                                    onClick={() => setPhotoSection(!photoSection)}
                                                >
                                                    <i className="bi bi-image-fill text-success pe-2" />
                                                    Photo
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button className="nav-link video_link bg-light py-1 px-2 mb-0 text-muted"
                                                    onClick={() => setVideoSection(!videoSection)}
                                                >
                                                    <i className="bi bi-camera-reels-fill text-info pe-2" />
                                                    Video
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button className="nav-link audio_link bg-light py-1 px-2 mb-0 text-muted"
                                                    onClick={() => setAudioSection(!audioSection)}

                                                >
                                                    <i className="bi bi-music-note-beamed text-primary pe-2" />
                                                    Audio
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button className="nav-link location_link bg-light py-1 px-2 mb-0 text-muted"
                                                    onClick={() => setShowLocationField(!showLocationField)}
                                                >
                                                    <i className="bi bi-geo-alt-fill text-danger pe-2" /> Location
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <Link href={'/pages/Events/create-event'} className="nav-link event_link bg-light py-1 px-2 mb-0 text-muted">
                                                    <i className="bi bi-calendar2-event-fill text-danger pe-2" /> Event
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <button className="nav-link event_link bg-light py-1 px-2 mb-0 text-muted" onClick={()=> setPollModal(!pollModal)}>
                                                    <i className="fas fa-poll text-info pe-1" /> Poll
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button className="nav-link event_link bg-light py-1 px-2 mb-0 text-muted" data-bs-toggle="modal" data-bs-target="#fundModel">
                                                    <i className="fas fa-hand-holding-usd text-success pe-1" /> Raise funding
                                                </button>
                                            </li>
                                        </ul>



                                    </div>
                                </div>

                            </div>

                            <div className="card col-md-12 shadow-lg border-0 rounded-3 mt-2 mb-2">
                                <div className="my-sm-5 py-sm-5 text-center">
                                    <i className="display-1 text-secondary bi bi-card-list" />
                                    <h5 className="mt-2 mb-3 text-body text-muted">No More Posts to Show</h5>
                                </div>
                            </div>


                        </div>


                        <RightNav pageTimelineData={pageTimelineData} />


                        {
                            pollModal === true?
                            <PostPollModal
                            pollModal = {pollModal}
                            setPollModal = {setPollModal}
                            />
                            :
                            ""
                        }

                    </div>
                </div>
            </div>

        </>
    )
}
