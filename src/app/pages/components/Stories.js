"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import styles from "./Storycss.module.css";
import moment from "moment";

const Stories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCarousel, setShowCarousel] = useState(false);
    const [currentUserStories, setCurrentUserStories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [userdata, setUserdata] = useState(null);
    const api = createAPI();

    useEffect(() => {
        const data = localStorage.getItem("userdata");
        if (data) {
            setUserdata(JSON.parse(data));
        }
    }, []);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                setLoading(true);
                const response = await api.post("/api/story/get-stories");

                if (response.data.code === "200") {
                    const groupedStories = response.data.data.map((user) => ({
                        id: user.id,
                        username: user.username,
                        avatar: user.avatar,
                        userName: `${user.first_name} ${user.last_name}`,
                        stories: user.stories.map((story) => ({
                            id: story.id,
                            media: story.media,
                            description: story.description,
                            duration: parseInt(story.duration) * 1000,
                            created_at: story.created_at,
                            type: story.type,
                        })),
                    }));

                    setStories(groupedStories);
                } else {
                    toast.error("Failed to load stories");
                }
            } catch (err) {
                toast.error("Error fetching stories. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, []);

    useEffect(() => {
        if (!showCarousel || isPaused) return;

        const storyDuration = currentUserStories[currentIndex]?.duration || 5000;
        const interval = 100;
        const steps = storyDuration / interval;
        let currentProgress = 0;

        const timer = setInterval(() => {
            currentProgress += 100 / steps;
            setProgress(currentProgress);

            if (currentProgress >= 100) {
                if (currentIndex < currentUserStories.length - 1) {
                    setCurrentIndex((prevIndex) => prevIndex + 1);
                    setProgress(0);
                } else {
                    setShowCarousel(false);
                }
            }
        }, interval);

        return () => clearInterval(timer);
    }, [showCarousel, currentIndex, currentUserStories, isPaused]);

    const openStoryCarousel = (userStories) => {
        setCurrentUserStories(userStories);
        setCurrentIndex(0);
        setProgress(0);
        setShowCarousel(true);
    };

    const closeCarousel = () => {
        setShowCarousel(false);
        setProgress(0);
    };

    const handleStoryNavigation = (direction) => {
        if (direction === "next") {
            if (currentIndex < currentUserStories.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setProgress(0);
            } else {
                closeCarousel();
            }
        } else if (direction === "prev") {
            if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
                setProgress(0);
            }
        }
    };

    const formatTimeAgo = (timestamp) => {
        return moment(timestamp).fromNow();
    };



    return (
        <div className={styles.storiesSection}>
            <div className="container-fluid px-2">
                <div className={`${styles.storiesRow} d-flex py-2`} style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
                    {userdata && (
                        <div className={`${styles.storyPreviewCard} me-2 mb-3 rounded-4`} style={{ width: "8rem", border: "none" }}>
                            <Link href="/pages/storydata">
                                <div className="position-relative">
                                    <Image
                                        src={userdata.data.avatar || "/assets/images/userplaceholder.png"}
                                        alt="Story Background"
                                        className="card-img-top rounded-4"
                                        style={{ objectFit: "cover" }}
                                        width={300}
                                        height={192}
                                    />
                                    <button className="btn position-absolute bottom-0 start-50 translate-middle-x bg-primary rounded-circle d-flex justify-content-center align-items-center text-white">
                                        +
                                    </button>
                                </div>
                            </Link>
                        </div>
                    )}

                    {stories.map((userStory, index) => (
                        <div
                            key={index}
                            className={`${styles.storyPreviewCard} me-2 mb-3 rounded-4`}
                            onClick={() => openStoryCarousel(userStory.stories)}
                        >
                            <div className={styles.storyCardInner}>
                                <div className={styles.storyPreviewImage}>
                                    {userStory.stories[0].type === "video" ? (
                                        <video className={styles.storyMediaPreview} muted>
                                            <source src={userStory.stories[0].media} type="video/mp4" />
                                        </video>
                                    ) : (
                                        <Image
                                            src={userStory.stories[0].media || "/assets/images/placeholder-image.png"}
                                            alt="Story"
                                            fill
                                            className={styles.storyMediaPreview}
                                        />
                                    )}
                                </div>
                                <div className={styles.userProfileCircle}>
                                    <Image src={userStory.avatar} alt="User" width={40} height={40} />
                                </div>
                                <div className={styles.userNameDisplay}>
                                    <span>{userStory.userName}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {showCarousel && (
                    <div className={styles.fullscreenStoryViewer}>
                        <div className={styles.storyProgressContainer}>
                            {currentUserStories.map((_, idx) => (
                                <div key={idx} className={styles.progressBarSegment}>
                                    <div
                                        className={`${styles.progressBarFill} ${idx < currentIndex ? styles.completed : idx === currentIndex ? styles.active : ""
                                            }`}
                                        style={idx === currentIndex ? { width: `${progress}%` } : {}}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className={styles.storyHeader}>
                            <div className={styles.userInfo}>
                                <div className={styles.userAvatar}>
                                    <Image src={stories.find(user => user.stories.includes(currentUserStories[currentIndex]))?.avatar} alt="User" width={40} height={40} />
                                </div>
                                <div className={styles.userDetails}>
                                    <div className={styles.username}>
                                        {stories.find(user => user.stories.includes(currentUserStories[currentIndex]))?.userName}
                                    </div>
                                    <div className={styles.timestamp}>{formatTimeAgo(currentUserStories[currentIndex]?.created_at)}</div>
                                </div>
                            </div>
                            <button className={styles.closeButton} onClick={closeCarousel}>✖</button>
                        </div>

                        <div className={styles.storyContent}>
                            {currentUserStories.map((story, idx) => (
                                <div key={story.id} className={`${styles.storySlide} ${idx === currentIndex ? styles.active : ""}`}>
                                    {story.type === "video" ? (
                                        <video className={styles.storyMedia} autoPlay muted loop onClick={() => setIsPaused(!isPaused)}>
                                            <source src={story.media} type="video/mp4" />
                                        </video>
                                    ) : (
                                        <Image src={story.media} alt="Story" fill className={styles.storyMedia} />
                                    )}
                                    <div className={styles.storyDescription}>{story.description}</div>
                                </div>
                            ))}
                        </div>

                        <div className={`${styles.navArea} ${styles.navPrev}`} onClick={() => handleStoryNavigation("prev")}></div>
                        <div className={`${styles.navArea} ${styles.navNext}`} onClick={() => handleStoryNavigation("next")}></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Stories;
