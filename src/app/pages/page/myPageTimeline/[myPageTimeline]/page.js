"use client";
import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import Image from "next/image";
import { use } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import EmojiPicker from 'emoji-picker-react';
import styles from '../../css/page.module.css';
import RightNav from "@/app/pages/page/components/rightNav";
// import PageImagesLayout from "./pageImagesLayout";
// import FundingModal from "../../Modal/FundingModal";
import FundingModal from "@/app/pages/Modals/FundingModal";
// import PostPollModal from "../../Modal/PostPollModal";
import PostPollModal from "@/app/pages/Modals/PostPollModal";
// import EditPostModal from "../../Modal/EditPostModal";
import EditPostModal from "@/app/pages/Modals/EditPostModal";
import SavePostModal from "@/app/pages/Modals/SaveUnsavePost";
import ReportPostModal from "@/app/pages/Modals/ReportPost";

import CupofCoffee from "@/app/pages/Modals/CupOfCoffee/CupofCoffee";
import Greatjob from "@/app/pages/Modals/GreatJob/GreatJob";

import AdvertismentModal from "@/app/pages/Modals/Advertisment/AdvertismentModal";

import SharedPosts from "@/app/pages/components/sharedPosts";
import { useRouter } from "next/navigation";
// import MakeDonationModal from "../../Modal/MakeDonationModal";
import MakeDonationModal from "@/app/pages/Modals/MakeDonationModal";
import { ReactionBarSelector } from '@charkour/react-reactions';

import UserImagesLayout from "@/app/pages/components/userImagesLayout";
import useConfirmationToast from "@/app/pages/Modals/useConfirmationToast";
import TimelineProfileCard from "@/app/pages/page/components/timelineProfileCard";
// import SharePostTimelineModal from "../../Modal/SharePostTimelineModal";
import SharePostTimelineModal from "@/app/pages/Modals/SharePostTimelineModal";
import React, { useState, useEffect, useCallback, useRef } from "react";
// import EnableDisableCommentsModal from "../../Modal/EnableDisableCommentsModal";
import EnableDisableCommentsModal from "@/app/pages/Modals/EnableDisableCommentsModal";
import ReadMoreLess from 'react-read-more-less';

import { useSiteSettings } from "@/context/SiteSettingsContext"
import ModuleUnavailable from "@/app/pages/Modals/ModuleUnavailable";

export default function MyPageTimeline({ params }) {

    const settings = useSiteSettings()


    const router = useRouter();
    const api = createAPI();
    const [userdata, setUserData] = useState(null);

    const { myPageTimeline } = use(params);

    const [userId, setUserId] = useState(null);
    const [postID, setPostID] = useState('');
    const [pageTimelineData, setPageTimelineData] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [postText, setPostText] = useState("");

    const [postLoadingState, setPostLoadingState] = useState(false)

    const [color, setColor] = useState("");


    const [images, setImages] = useState([]);
    const fileImageRef = useRef(null);

    const [videoFiles, setVideoFiles] = useState([]);
    const fileVideoRef = useRef(null);

    const [audioFiles, setAudioFiles] = useState([]);
    const fileAudioRef = useRef(null);


    const [location, setLocation] = useState('');
    const [photoSection, setPhotoSection] = useState(false);
    const [videoSection, setVideoSection] = useState(false);
    const [audioSection, setAudioSection] = useState(false);

    const [showLocationField, setShowLocationField] = useState(false);

    const [pollModal, setPollModal] = useState(false);
    const [fundingModal, setFundingModal] = useState(false);
    const [donationModal, setDonationModal] = useState(false);
    const [donationID, setDonationID] = useState("");
    const [showSavePostModal, setShowSavePostModal] = useState(false);
    const [showReportPostModal, setShowReportPostModal] = useState(false);


    const [activeCupCoffeeId, setActiveCupCoffeeId] = useState(null);
    const [activeGreatJobId, setActiveGreatJobId] = useState(null);




    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [noMorePosts, setNoMorePosts] = useState(false);


    const [lastPostId, setLastPostId] = useState(0);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState({});
    const [showComments, setShowComments] = useState({});

    const [showList, setShowList] = useState(false);
    const [commentText, setCommentText] = useState({});
    const [commentreplyText, setCommentreplyText] = useState({});
    const [showReplies, setShowReplies] = useState({});
    const [showReplyInput, setShowReplyInput] = useState({});
    const [repliesData, setRepliesData] = useState({});

    const [postReactions, setPostReactions] = useState({});
    const [activeReactionPost, setActiveReactionPost] = useState(null);
    const [isOpenColorPalette, setIsOpenColorPalette] = useState(false);

    const [showEnableDisableCommentsModal, setShowEnableDisableCommentsModal] = useState(false);
    const [showEditPostModal, setShowEditPostModal] = useState(false);
    const [sharePostTimelineModal, setShareShowTimelineModal] = useState(false);

    const [showAdvertismentModal, setShowAdvertismentModal] = useState(false)

    const endpoint = "/api/post/create";




    const reactionEmojis = {
        satisfaction: "👍",
        love: "❤️",
        happy: "😂",
        surprise: "😮",
        sad: "😢",
        angry: "😡"
    };

    const reactionValues = {
        satisfaction: 1,
        love: 2,
        happy: 3,
        surprise: 4,
        sad: 5,
        angry: 6
    };


    const handleReactionSelect = (reaction, postId) => {
        const updatedReactions = {
            ...postReactions,
            [postId]: reactionEmojis[reaction] || "😊"
            // [postId]: [{ emoji: reactionEmojis[reaction] || "😊", label: reaction }]
        };


        LikePost(postId, reactionValues[reaction] || 0);

        setPostReactions(updatedReactions);
        setActiveReactionPost(null);
    };

    const colorMap = {
        '23jo': '#FFFFFF',
        '23ju': '#C600FF',
        '_2j78': '#111111',
        '_2j79': 'linear-gradient(45deg, rgb(255, 0, 71) 0%, rgb(44, 52, 199) 100%)',
        '_2j80': 'linear-gradient(45deg, rgb(252, 54, 253) 0%, rgb(93, 63, 218) 100%)',
        '_2j81': 'linear-gradient(45deg, rgb(93, 99, 116) 0%, rgb(22, 24, 29) 100%)',
        '_2j82': '#00A859',
        '_2j83': '#0098DA',
        '_2j84': '#3E4095',
        '_2j85': '#4B4F56',
        '_2j86': '#161616',
        '_2j87': 'url(https://images.socioon.com/assets/images/post/bgpst1.png)',
        '_2j88': 'url(https://images.socioon.com/assets/images/post/bgpst2.png)',
        '_2j89': 'url(https://images.socioon.com/assets/images/post/bgpst3.png)',
        '_2j90': 'url(https://images.socioon.com/assets/images/post/bgpst4.png)',
    };

    const reverseColorMap = Object.fromEntries(
        Object.entries(colorMap).map(([key, value]) => [value, key])
    );



    const handleColorSelect = (colorValue) => {
        const code = reverseColorMap[colorValue] || encodeURIComponent(colorValue);
        setColor(code);
    };

    const getDisplayColor = (code) => {
        return colorMap[code] || code;
    };

    const toggleOptionsColorPalette = () => {
        setIsOpenColorPalette(!isOpenColorPalette);

    };



    const openModalCupCoffee = (id) => {
        setActiveCupCoffeeId(id);
        setActiveGreatJobId(null);
    };
    const closeModalCupCoffee = () => {
        setActiveCupCoffeeId(null);
    };

    const openModalGreatJob = (id) => {
        setActiveGreatJobId(id);
        setActiveCupCoffeeId(null);
    };
    const closeModalGreatJob = () => {
        setActiveGreatJobId(null);
    };




    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        if (images.length + files.length > 10) {
            alert("You can only upload a maximum of 10 images at a time.");
            fileImageRef.current.value = "";
            return;

        }
        else {
            const newImages = files.map((file) => ({
                file,
                url: URL.createObjectURL(file),
            }));
            setImages([...images, ...newImages]);
        }

    }



    const removeImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);

        if (updatedImages.length === 0 && fileImageRef.current) {
            fileImageRef.current.value = "";
        }
    };



    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        if (videoFiles.length + files.length > 1) {
            alert("You can only upload 1 video at a time.");
            fileVideoRef.current.value = "";
            return;
        }
        else {
            const newVideos = files.map((file) => ({
                file,
                url: URL.createObjectURL(file),
            }));
            setVideoFiles((prevFiles) => [...prevFiles, ...newVideos]);

        }

    };

    const removeVideo = (index) => {
        const updatedVideos = videoFiles.filter((_, i) => i !== index);
        setVideoFiles(updatedVideos);

        if (updatedVideos.length === 0 && fileVideoRef.current) {
            fileVideoRef.current.value = "";
        }
    };




    const handleAudioChange = (event) => {
        const files = Array.from(event.target.files);


        if (audioFiles.length + files.length > 1) {
            alert("You can only upload 1 audio at a time.");
            fileAudioRef.current.value = "";
            return;
        }
        else {
            const newAudio = files.map((file) => ({
                file,
                url: URL.createObjectURL(file),
            }));
            setAudioFiles((prevFiles) => [...prevFiles, ...newAudio]);

        }


    };

    const removeAudio = (index) => {
        const updatedAudios = audioFiles.filter((_, i) => i !== index);
        setAudioFiles(updatedAudios);

        if (updatedAudios.length === 0 && fileVideoRef.current) {
            fileAudioRef.current.value = "";
        }
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

    const handlePageTimeline = () => {
        localStorage.setItem('_pageData', JSON.stringify(pageTimelineData));
    }




    const fetchPosts = async (isInitialLoad = true, limit = 10) => {
        if (loading || noMorePosts) return;

        try {
            setLoading(true);

            const response = await api.post("/api/post/newsfeed", {
                limit,
                last_post_id: lastPostId,
                page_id: myPageTimeline,
            });

            if (response.data && Array.isArray(response.data.data)) {
                const newPosts = response.data.data;

                if (newPosts.length > 0) {
                    const lastPost = newPosts[newPosts.length - 1];
                    setLastPostId(lastPost.id);
                }

                if (newPosts.length < limit) {
                    setNoMorePosts(true);
                }

                setPosts((prevPosts) => [...prevPosts, ...newPosts.filter((post) => !prevPosts.some((p) => p.id === post.id))]);


                const reactionsMap = {};
                newPosts.forEach((post) => {
                    if (post.reaction && post.reaction.reaction_type) {
                        const reactionType = Number(post.reaction.reaction_type);
                        const reactionKey = Object.keys(reactionValues).find(
                            (key) => reactionValues[key] === reactionType
                        );
                        if (reactionKey) {
                            reactionsMap[post.id] = reactionEmojis[reactionKey];
                        }
                    }
                });

                setPostReactions((prevReactions) => ({
                    ...prevReactions,
                    ...reactionsMap,
                }));

                if (isInitialLoad) setPage(1);
            }

            else {
                toast.error("Invalid data format received from API.");
            }
        } catch (error) {
            toast.error("An error occurred while fetching newsfeed data.");
        } finally {
            setLoading(false);
        }
    };


    const handleVote = async (optionId, pollId, postId) => {
        try {
            const response = await api.post("/api/post/poll-vote", {
                poll_option_id: optionId,
                poll_id: pollId,
                post_id: postId,
            });

            if (response.data.status == "200") {
                setPosts(prevPosts =>
                    prevPosts.map(post => {
                        if (post.id === postId) {
                            const updatedPoll = {
                                ...post.poll,
                                poll_total_votes: (post.poll.poll_total_votes || 0) + 1,
                                poll_options: post.poll.poll_options.map(option =>
                                    option.id === optionId
                                        ? { ...option, no_of_votes: (option.no_of_votes || 0) + 1 }
                                        : option
                                )
                            };

                            return {
                                ...post,
                                poll: updatedPoll
                            };
                        }
                        return post;
                    })
                );

                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred while voting. Please try again.");
        }
    };




    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.innerHeight + window.scrollY;
            const bottomPosition = document.documentElement.scrollHeight;

            if (scrollPosition >= bottomPosition - 100) {
                fetchPosts(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [loading, noMorePosts]);


    const handlePostDelete = (postId) => {
        showConfirmationToast(postId);
    };
    const handleDelete = useCallback(async (values) => {
        const postId = values;

        try {
            const response = await api.post("/api/post/action", {
                post_id: postId,
                action: "delete",
            });

            if (response.data.code == "200") {
                setPosts((prevPosts) =>
                    prevPosts.filter((post) => post.id !== postId)
                );
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred while deleting the post.");
        }
    }, [api]);

    const { showConfirmationToast } = useConfirmationToast({
        message: 'Are you sure you want to delete this post? This action cannot be undone.',
        onConfirm: handleDelete,
        onCancel: () => toast.dismiss(),
        confirmText: "Confirm",
        cancelText: "Cancel",
    });




    const toggleReplies = async (commentId) => {
        try {
            const response = await api.post("/api/post/comments/get-replies", {
                comment_id: commentId,
            });

            if (response.data.code == "200") {
                const replies = response.data.data || [];

                setRepliesData((prevState) => ({
                    ...prevState,
                    [commentId]: replies,
                }));

                setShowReplies((prevState) => ({
                    ...prevState,
                    [commentId]: !prevState[commentId],
                }));


            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("An error occurred while fetching replies.");
        }
    };


    const handleToggleReplyInput = (commentId) => {
        setShowReplyInput((prevState) => ({
            ...prevState,
            [commentId]: !prevState[commentId],
        }));
    };

    const ReplyComment = async (commentId, commentreplyText) => {
        try {
            const response = await api.post("/api/post/comments/add-reply", {
                comment_id: commentId,
                comment: commentreplyText,
            });

            if (response.data.code == "200") {
                toast.success("Reply added successfully!");
                setCommentreplyText((prevState) => ({
                    ...prevState,
                    [commentId]: "",
                }));
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred while adding the reply");
        }
    };

    const LikeComment = async (commentId, postId) => {
        try {
            const response = await api.post("/api/post/comments/like", {
                comment_id: commentId,
                post_id: postId,
            });
            if (response.data.code == "200") {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error while reacting to the comment");
        }
    };

    const commentReplyLike = async (replyId) => {
        try {
            const response = await api.post("/api/post/comments/reply_like", {
                comment_reply_id: replyId,
            });

            if (response.data.code == "200") {
                toast.success(response.data.message);
            } else {
                toast.info(response.data.message);
            }

        } catch (error) {
            toast.error("Error while reacting to the comment reply");
        }
    };

    const LikePost = async (postId, reactionType) => {

        try {
            const response = await api.post("/api/post/action", {
                post_id: postId,
                action: "reaction",
                reaction_type: reactionType,
            });



            if (response.data.code === "200") {
                setPosts(prevPosts =>
                    prevPosts.map(post => {
                        if (post.id === postId) {
                            return {
                                ...post,
                                reaction: {
                                    is_reacted: true,
                                    reaction_type: reactionType,
                                    count: post.reaction?.is_reacted
                                        ? post.reaction.count
                                        : (post.reaction?.count || 0) + 1,
                                    image: post.reaction?.image || "",
                                    color: post.reaction?.color || "",
                                    text: post.reaction?.text || ""
                                }
                            };
                        }
                        return post;
                    })
                );


                const reactionKey = Object.keys(reactionValues).find(
                    key => reactionValues[key] === reactionType
                );

                if (reactionKey) {
                    setPostReactions(prevReactions => ({
                        ...prevReactions,
                        [postId]: reactionEmojis[reactionKey]
                    }));
                }
            }

            else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error while reacting to the Post");
        }
    };

    const handleCommentToggle = async (postId) => {
        setShowList(!showList);

        setShowComments((prevState) => ({
            ...prevState,
            [postId]: !prevState[postId],
        }));

        if (!comments[postId]) {
            try {
                const response = await api.get(
                    `/api/post/comments/getcomment?post_id=${postId}`,
                    {}
                );

                if (response.data.data && Array.isArray(response.data.data)) {
                    setComments((prevComments) => ({
                        ...prevComments,
                        [postId]: response.data.data,
                    }));
                }
            } catch (error) {
                setError("An error occurred while fetching comments.");
            }
        }
    };

    const handleCommentTextChange = (e, postId) => {
        setCommentText((prevText) => ({
            ...prevText,
            [postId]: e.target.value,
        }));
    };

    const handleCommentSubmit = async (postId) => {
        const comment = commentText[postId] || "";

        if (!comment || comment.trim() === "") {
            toast.error("Comment cannot be empty.")
            return;
        }
        setLoading(true);
        try {
            const response = await api.post("/api/post/comments/add", {
                post_id: postId,
                comment_text: comment,
            });

            if (response.data.code === "200") {
                const optimisticComment = response.data.data;
                setComments((prevComments) => {
                    const updatedComments = prevComments[postId]
                        ? [...prevComments[postId]]
                        : [];
                    updatedComments.push(optimisticComment);
                    return {
                        ...prevComments,
                        [postId]: updatedComments,
                    };
                });
                toast.success(response.data.message);
                setCommentText((prevText) => ({
                    ...prevText,
                    [postId]: "",
                }));
            } else {
                toast.error(response.data.message || "Failed to add the comment.")
            }
        } catch (error) {
            toast.error("An error occurred while adding the comment.")
        } finally {
            setLoading(false);
        }
    };

    const handleCommentDelete = async (comment_id, postId) => {
        try {
            const response = await api.post("/api/post/comments/delete", {
                comment_id,
            });

            if (response.data.code == "200") {
                setComments((prevComments) => {
                    const updatedComments = prevComments[postId].filter(
                        (comment) => comment.id !== comment_id
                    );
                    return {
                        ...prevComments,
                        [postId]: updatedComments,
                    };
                });

                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred while deleting the comment.");
        }
    };


    const handleCommentreplyDelete = async (reply_id) => {
        try {
            const response = await api.post("/api/post/comments/delete-reply", {
                reply_id,
            });

            if (response.data.code == "200") {
                toast.success("Reply deleted successfully.");
            } else {
                toast.error(`Error: ${response.data.code}`);
            }
        } catch (error) {
            toast.error("An error occurred while deleting the reply.");
        }
    };


    const handleCopy = (link) => {
        navigator.clipboard.writeText(link);
        toast.success("Link copied successfully!");
    };


    useEffect(() => {
        const data = localStorage.getItem("userdata");
        if (data) {
            setUserData(JSON.parse(data));
        }
    }, []);






    const uploadPost = async (donationData = {}) => {

        try {
            setPostLoadingState(true)

            const formData = new FormData();
            const combinedText = donationData.donationTitle
                ? `${postText} ${donationData.donationTitle}`
                : postText;

            formData.append("page_id", myPageTimeline);
            if (combinedText) formData.append("post_text", combinedText);
            if (location) formData.append("post_location", location);

            if (images) images.map((image) => formData.append("images[]", image.file))
            if (videoFiles) videoFiles.map((videoFile) => formData.append("video", videoFile.file));
            if (audioFiles) audioFiles.map((audioFile) => formData.append("audio", audioFile.file));



            if (donationData.donationAmount) {
                formData.append("amount", donationData.donationAmount);
            }
            if (donationData.donationDescription) {
                formData.append("description", donationData.donationDescription);
            }

            if (donationData.donationImage) formData.append("donation_image", donationData.donationImage);

            let postType = "post";
            if (donationData.donationAmount) {
                postType = "donation";
            }

            formData.append("post_type", postType);
            formData.append("bg_color", color);



            const response = await api.post(endpoint, formData, {

                headers: {
                    "Content-Type": "multipart/form-data",
                },

            });




            if (response.data.code == "200") {
                toast.success(response.data.message)
                setPosts([response.data.data, ...posts]);
                setPostText("");
                setLocation("");
                setColor("");
                setIsOpenColorPalette(false);
                setImages([]);
                setVideoFiles([]);
                setAudioFiles([]);
                setPhotoSection(false);
                setVideoSection(false);
                setAudioSection(false);
                setShowLocationField(false);

                setFundingModal(false);
                setPostLoadingState(false)
                setIsOpenColorPalette(false)

            }
            else {
                toast.error("Error from server: " + response.data.message)
                setPostLoadingState(false)

            }
        }

        catch (error) {

            toast.error(error.response.data.message)
            setPostLoadingState(false)
        }

    };


    const getUserIdFromPages = posts.map((post) => post.page.user_id);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUserId = localStorage.getItem("userid");
            setUserId(storedUserId);
        }
    }, []);

    if (!settings) return null

    if (settings["chck-pages"] !== "1") {
        return <ModuleUnavailable />;
    }

    return (
        <>
            <div className="container-fluid">
                <div className="container mt-3 pt-2">

                    <div className="row">

                        <div className="col-12 col-md-8">

                            <TimelineProfileCard pageTimelineID={myPageTimeline} />
                            {
                                userId && userId === getUserIdFromPages[0] ?

                                    (

                                        <div className="card shadow-lg border-0 rounded-3 mt-3">
                                            <div className="card-body">

                                                <div className="form-floating mb-4">
                                                    <textarea className={`form-control border border-0 ${styles.pagePostInput} mb-2`}
                                                        placeholder="Leave a comment here"
                                                        id="floatingTextarea2"
                                                        style={{
                                                            height: "170px",
                                                            background: `${getDisplayColor(color)} no-repeat center/cover`,
                                                            resize: "none"
                                                        }}
                                                        value={postText}
                                                        onChange={handlePostTextChange}
                                                    />
                                                    <label htmlFor="floatingTextarea2" className="small text-muted ">Share your thoughts....</label>

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


                                                    <div className={`d-flex ${styles.optionsContainer} mb-2`}>
                                                        <button className={`btn btn-info ${styles.toggleButton}`} onClick={toggleOptionsColorPalette} >
                                                            <i className="bi bi-palette-fill"></i>
                                                        </button>

                                                        <div className={`${styles.colorOptions} ${isOpenColorPalette ? styles.open : ''}`}>
                                                            {Object.values(colorMap).map((color) => (
                                                                <div
                                                                    key={color}
                                                                    className={styles.colorOption}
                                                                    style={{ background: color }}
                                                                    onClick={() => handleColorSelect(color)}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <hr />
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
                                                                    <label className="form-label text-muted"> <i className="bi bi-image-fill"></i> Photos</label>
                                                                    <input className="form-control form-control-sm"
                                                                        type="file"
                                                                        id="formFile"
                                                                        onChange={handleImageChange}
                                                                        ref={fileImageRef}
                                                                        multiple
                                                                    />
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
                                                                                    top: "20px",
                                                                                    right: "-15px",
                                                                                    color: "white",
                                                                                    border: "none",
                                                                                    borderRadius: "50%",
                                                                                    cursor: "pointer",
                                                                                }}
                                                                            >
                                                                                <i className="bi bi-trash text-danger" />
                                                                            </button>

                                                                            <video width="150" height="150" controls>
                                                                                <source src={video.url} type={video.file.type} />
                                                                                Your browser does not support the video tag.
                                                                            </video>
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                                <div className="col-lg-12 mb-3">
                                                                    <label className="form-label text-muted"> <i className="bi bi-camera-reels-fill"></i> Videos</label>
                                                                    <input
                                                                        className="form-control form-control-sm"
                                                                        type="file"
                                                                        id="formFile"
                                                                        accept="video/*"
                                                                        multiple
                                                                        onChange={handleFileChange}
                                                                        ref={fileVideoRef}
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
                                                                        <div key={index} style={{ position: "relative" }}>

                                                                            <button
                                                                                onClick={() => removeAudio(index)}
                                                                                style={{
                                                                                    position: "absolute",
                                                                                    top: "-12px",
                                                                                    right: "-10px",
                                                                                    color: "white",
                                                                                    border: "none",
                                                                                    borderRadius: "50%",
                                                                                    cursor: "pointer",
                                                                                }}
                                                                            >
                                                                                <i className="bi bi-trash text-danger" />
                                                                            </button>

                                                                            <audio width="150" height="120" controls>
                                                                                <source src={audio.url} type={audio.file.type} />
                                                                                Your browser does not support the video tag.
                                                                            </audio>
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                                <div className="col-lg-12 mb-3">
                                                                    <label className="form-label text-muted"> <i className="bi bi-music-note-beamed"></i> Audio</label>
                                                                    <input
                                                                        className="form-control form-control-sm"
                                                                        type="file"
                                                                        id="formFile"
                                                                        accept="audio/*"
                                                                        multiple
                                                                        onChange={handleAudioChange}
                                                                        ref={fileAudioRef}
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







                                                    <ul className={`nav nav-pills nav-stack  fw-normal d-flex justify-content-evenly  `}>
                                                        <li className="nav-item">
                                                            <button className="nav-link photos_link bg-light py-1  px-2 mb-0 text-muted"
                                                                onClick={() => {
                                                                    setPhotoSection(!photoSection)
                                                                    setVideoSection(false)
                                                                    setAudioSection(false)
                                                                    setShowLocationField(false)

                                                                }}
                                                            >
                                                                <i className="bi bi-image-fill text-success pe-2" />
                                                                Photo
                                                            </button>
                                                        </li>
                                                        <li className="nav-item">
                                                            <button className="nav-link video_link bg-light py-1 px-2 mb-0 text-muted"
                                                                onClick={() => {
                                                                    setVideoSection(!videoSection)
                                                                    setPhotoSection(false)
                                                                    setAudioSection(false)
                                                                    setShowLocationField(false)

                                                                }}
                                                            >
                                                                <i className="bi bi-camera-reels-fill text-info pe-2" />
                                                                Video
                                                            </button>
                                                        </li>
                                                        <li className="nav-item">
                                                            <button className="nav-link audio_link bg-light py-1 px-2 mb-0 text-muted"
                                                                onClick={() => {
                                                                    setAudioSection(!audioSection)
                                                                    setPhotoSection(false)
                                                                    setVideoSection(false)
                                                                    setShowLocationField(false)
                                                                }}

                                                            >
                                                                <i className="bi bi-music-note-beamed text-primary pe-2" />
                                                                Audio
                                                            </button>
                                                        </li>
                                                        <li className="nav-item">
                                                            <button className="nav-link location_link bg-light py-1 px-2 mb-0 text-muted"
                                                                onClick={() => {
                                                                    setShowLocationField(!showLocationField)
                                                                    setPhotoSection(false)
                                                                    setVideoSection(false)
                                                                    setAudioSection(false)
                                                                }}
                                                            >
                                                                <i className="bi bi-geo-alt-fill text-danger pe-2" /> Location
                                                            </button>
                                                        </li>

                                                        {settings["chck-events"] === "1" && (
                                                            <li className="nav-item">
                                                                <Link href={'/pages/Events/create-event'} className="nav-link event_link bg-light py-1 px-2 mb-0 text-muted">
                                                                    <i className="bi bi-calendar2-event-fill text-danger pe-2" /> Event
                                                                </Link>
                                                            </li>
                                                        )}

                                                        <li className="nav-item">
                                                            <button className="nav-link event_link bg-light py-1 px-2 mb-0 text-muted" onClick={() => setPollModal(!pollModal)}>
                                                                <i className="fas fa-poll text-info pe-1" /> Poll
                                                            </button>
                                                        </li>
                                                        <li className="nav-item">
                                                            <button className="nav-link event_link bg-light py-1 px-2 mb-0 text-muted" onClick={() => setFundingModal(!fundingModal)}>
                                                                <i className="fas fa-hand-holding-usd text-success pe-1" /> Raise funding
                                                            </button>
                                                        </li>
                                                    </ul>



                                                </div>

                                                <div className="d-flex justify-content-between mt-3">

                                                    <button className={`btn w-100 ${styles.btnSuccessPost}`}
                                                        onClick={uploadPost}
                                                        disabled={postLoadingState}
                                                    >
                                                        Post <i className="bi bi-send me-2"></i>
                                                    </button>




                                                </div>
                                            </div>

                                        </div>
                                    )
                                    :
                                    null
                            }




                            {posts?.map((post, index) => {

                                return (


                                    <div key={`${post.id}-${index}`}>


                                        <div className="card shadow-lg border-0 rounded-1 mb-2 mt-2">
                                            <div className="card-body" >


                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">

                                                        <div className="avatar-container" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                                            onClick={() => handleClick(post.user.id)} >


                                                            <Image
                                                                className="avatar-img rounded-circle"
                                                                src={post.user.avatar || "/assets/images/userplaceholder.png"}
                                                                alt="User Avatar"
                                                                width={50}
                                                                height={50}
                                                                style={{ objectFit: 'cover' }}
                                                            />


                                                            {post.user.is_verified === '1' && (
                                                                <div
                                                                    className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                                                                    style={{
                                                                        position: 'absolute',
                                                                        bottom: '0',
                                                                        right: '0',
                                                                        width: '20px',
                                                                        height: '20px',
                                                                        fontSize: '1.2rem',
                                                                        padding: '2px',
                                                                    }}
                                                                >
                                                                    <i className="bi bi-check-circle-fill text-success"></i>
                                                                </div>
                                                            )}

                                                        </div>

                                                        <div className="mx-2">
                                                            <h6 className="card-title">

                                                                <span
                                                                    style={{ cursor: 'pointer' }}
                                                                    onMouseEnter={(e) => e.target.style.color = 'blue'}
                                                                    onMouseLeave={(e) => e.target.style.color = 'inherit'}
                                                                    onClick={() => router.push(`/pages/UserProfile/timeline/${post.user.id}`)}
                                                                >
                                                                    {post?.user.first_name} {post?.user.last_name}  {post?.post_location && post.post_location !== "" && (
                                                                        <span className="text-primary ms-1">
                                                                            <small className="text-dark"> is in </small>
                                                                            <i className="bi bi-geo-fill"></i>
                                                                            <a
                                                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(post?.post_location)}`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-primary text-decoration-none"
                                                                            >
                                                                                {post.post_location}
                                                                            </a>
                                                                        </span>
                                                                    )}
                                                                </span>
                                                                <i className="bi bi-arrow-right"></i> {pageTimelineData?.page_title}

                                                            </h6>
                                                            <small className="text-secondary">
                                                                {post.created_human} -
                                                                {post.privacy === '1' && (
                                                                    <i className="bi bi-globe-asia-australia mx-1 text-primary"></i>
                                                                )}

                                                                {post.privacy === '2' && (
                                                                    <i className=" bi bi-people-fill mx-1 text-primary"></i>
                                                                )}

                                                                {post.privacy === '4' && (
                                                                    <i className=" bi bi-people mx-1 text-primary"></i>
                                                                )}

                                                                {post.privacy === '5' && (
                                                                    <i className=" bi bi-briefcase mx-1 text-primary"></i>
                                                                )}

                                                                {post.privacy === '3' && (
                                                                    <i className=" bi bi-lock-fill mx-1 text-primary"></i>
                                                                )}
                                                            </small>
                                                        </div>
                                                    </div>

                                                    <div className="dropstart">
                                                        <button
                                                            className="btn border-0"
                                                            type="button"
                                                            id="dropdownMenuButton2"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                            <i className="bi bi-caret-down"></i>
                                                        </button>
                                                        <ul
                                                            className="dropdown-menu dropdown-menu-light"
                                                            aria-labelledby="dropdownMenuButton2"
                                                        >
                                                            {
                                                                post?.user?.id === userId ?
                                                                    <>
                                                                        <li className="align-items-center d-flex">
                                                                            <button
                                                                                className="text-decoration-none dropdown-item text-secondary d-flex align-items-center"
                                                                                onClick={() => {
                                                                                    setShowEnableDisableCommentsModal(true)
                                                                                    setPostID(post.id)

                                                                                }}
                                                                            >
                                                                                {
                                                                                    post.comments_status === '1' ?
                                                                                        <>
                                                                                            <i className="bi bi-chat-left-text "></i> <span>Disable Comments</span>
                                                                                        </>
                                                                                        :
                                                                                        <>
                                                                                            <i className="bi bi-chat-left-text-fill "></i> <span>Enable Comments</span>
                                                                                        </>


                                                                                }

                                                                            </button>
                                                                        </li>

                                                                        <li className="align-items-center d-flex">
                                                                            {post.post_type !== "donation" ? (
                                                                                <button
                                                                                    className="text-decoration-none dropdown-item text-secondary"
                                                                                    onClick={() => {
                                                                                        setShowEditPostModal(true);
                                                                                        setPostID({ id: post.id, post_text: post.post_text });
                                                                                    }}
                                                                                >
                                                                                    <i className="bi bi-pencil-fill fa-fw pe-2"></i> Edit Post
                                                                                </button>
                                                                            ) : (
                                                                                <Link className="text-decoration-none dropdown-item text-secondary" href={`/pages/Fundingslist/${post.id}`}>
                                                                                    <i className="bi bi-cash fa-fw pe-2"></i> Fundings
                                                                                </Link>
                                                                            )}
                                                                        </li>
                                                                    </>
                                                                    :

                                                                    (
                                                                        <>
                                                                            <li className="align-items-center d-flex">
                                                                                <button
                                                                                    className="text-decoration-none dropdown-item text-secondary"
                                                                                    onClick={() => {
                                                                                        setShowSavePostModal(true);
                                                                                        setPostID(post.id);
                                                                                    }}
                                                                                >

                                                                                    {post.is_saved === false ?
                                                                                        <>
                                                                                            <i className="bi bi-bookmark"></i> Save
                                                                                            post
                                                                                        </>
                                                                                        :
                                                                                        <>
                                                                                            <i className="bi bi-bookmark-fill"></i> Un save
                                                                                            post
                                                                                        </>}


                                                                                </button>
                                                                            </li>
                                                                            <li>
                                                                                <hr className="dropdown-divider" />
                                                                            </li><li className=" align-items-center d-flex">
                                                                                <button
                                                                                    className="text-decoration-none dropdown-item text-secondary"
                                                                                    onClick={() => {
                                                                                        setShowReportPostModal(true)
                                                                                        setPostID(post.id)

                                                                                    }}
                                                                                >
                                                                                    <i className="bi bi-flag"></i> Report Post
                                                                                </button>
                                                                            </li>
                                                                        </>
                                                                    )


                                                            }




                                                            {post?.user?.id == userId && (
                                                                <li className="align-items-center d-flex">
                                                                    <button
                                                                        className="btn dropdown-item text-secondary"
                                                                        onClick={() => handlePostDelete(post.id)}
                                                                    >
                                                                        <i className="bi bi-trash3 pe-2"></i>
                                                                        Delete Post
                                                                    </button>
                                                                </li>
                                                            )}

                                                            <hr className="dropdown-divider" />


                                                            <li className=" align-items-center d-flex">
                                                                <Link
                                                                    className="text-decoration-none dropdown-item text-secondary"
                                                                    href={`/pages/openPostInNewTab/${post.id}`}
                                                                    onClick={handlePageTimeline}
                                                                    target="_blank" rel="noopener noreferrer"
                                                                >
                                                                    <i className="bi bi-box-arrow-up-right"></i>
                                                                    Open post in new tab
                                                                </Link>
                                                            </li>



                                                        </ul>
                                                    </div>


                                                </div>
                                                <hr className="my-2 text-muted" />
                                                {post?.post_type !== "donation" && !post.bg_color && (
                                                    <span
                                                        dangerouslySetInnerHTML={{ __html: post.post_text }}
                                                    />
                                                )}



                                                {/* shared post check from here..  */}
                                                {post.parent_id !== "0" && !post.shared_post && (
                                                    <div className="alert alert-warning" role="alert">
                                                        <strong>This content is not available</strong>
                                                        <div className="mb-0" style={{ fontSize: "14px" }}>
                                                            This content isn&apos;t available right now. When this happens, it&apos;s usually because the owner
                                                            only shared it with a small group of people, changed who can see it, or it&apos;s been deleted.
                                                        </div>
                                                    </div>
                                                )}



                                                {post.shared_post === null ?
                                                    <>
                                                        {
                                                            post.bg_color && (
                                                                <div className="card-body inner-bg-post d-flex justify-content-center flex-wrap mb-1 h-100"
                                                                    style={{
                                                                        background: getDisplayColor(post.bg_color),
                                                                        backgroundSize: post.bg_color?.startsWith('_2j8') || post.bg_color?.startsWith('_2j9') ? 'cover' : 'auto',
                                                                        backgroundRepeat: post.bg_color?.startsWith('_2j8') || post.bg_color?.startsWith('_2j9') ? 'no-repeat' : 'repeat',
                                                                        backgroundPosition: post.bg_color?.startsWith('_2j8') || post.bg_color?.startsWith('_2j9') ? 'center' : 'unset',
                                                                        padding: "220px 27px",
                                                                    }}
                                                                >
                                                                    <span className="text-dark fw-bold" style={{ fontSize: "1.5rem" }}>   {post.post_text} </span>
                                                                </div>
                                                            )
                                                        }


                                                        <div className="d-flex justify-content-center flex-wrap mb-1">
                                                            {post?.poll && post?.poll.poll_options && (
                                                                <div className="w-100">
                                                                    <ul className="list-unstyled">
                                                                        {post.poll.poll_options.map((option) => {
                                                                            const totalVotes =
                                                                                post.poll.poll_total_votes || 0;
                                                                            const percentage =
                                                                                totalVotes > 0
                                                                                    ? Math.round(
                                                                                        (option.no_of_votes / totalVotes) * 100
                                                                                    )
                                                                                    : 0;

                                                                            return (
                                                                                <li key={option.id} className="mb-3 w-100">
                                                                                    <div className="d-flex align-items-center justify-content-between">
                                                                                        <div
                                                                                            className="progress flex-grow-1"
                                                                                            style={{
                                                                                                height: "30px",
                                                                                                cursor: "pointer",
                                                                                            }}
                                                                                            onClick={() =>
                                                                                                handleVote(
                                                                                                    option.id,
                                                                                                    post.poll.id,
                                                                                                    post.id
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <div
                                                                                                className="progress-bar"
                                                                                                role="progressbar"
                                                                                                style={{
                                                                                                    width: `${percentage}%`,
                                                                                                    backgroundColor: "#66b3ff",
                                                                                                }}
                                                                                                aria-valuenow={percentage}
                                                                                                aria-valuemin="0"
                                                                                                aria-valuemax="100"
                                                                                            >
                                                                                                <div
                                                                                                    className="progress-text w-100 text-secondary fs-6 fw-bold"
                                                                                                    style={{
                                                                                                        position: "absolute",
                                                                                                        overflow: "hidden",
                                                                                                        textOverflow: "ellipsis",
                                                                                                        whiteSpace: "nowrap",
                                                                                                    }}
                                                                                                >
                                                                                                    {option.option_text}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <span className="px-3">{percentage}%</span>
                                                                                    </div>
                                                                                </li>
                                                                            );
                                                                        })}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {post?.donation && (
                                                            <div>
                                                                <Image
                                                                    src={post?.donation?.image || "/assets/images/placeholder-image.png"}
                                                                    alt={post.donation.title}
                                                                    className="img-fluid d-block mx-auto"
                                                                    width={400}
                                                                    height={200}
                                                                    style={{
                                                                        objectFit: "cover",
                                                                    }}
                                                                // loader={({ src }) => src}
                                                                />

                                                                <div className="card-body text-center">
                                                                    <h5 className="card-title">
                                                                        {post.donation.title}
                                                                    </h5>
                                                                    <p className="card-text">
                                                                        {post.donation.description}
                                                                    </p>
                                                                    <div className="progress mb-3">
                                                                        <div
                                                                            className="progress-bar"
                                                                            role="progressbar"
                                                                            style={{
                                                                                width: `${(post.donation.collected_amount /
                                                                                    post.donation.amount) *
                                                                                    100
                                                                                    }%`,
                                                                            }}
                                                                            aria-valuenow={post.donation.collected_amount}
                                                                            aria-valuemin="0"
                                                                            aria-valuemax={post.donation.amount}
                                                                        ></div>
                                                                    </div>
                                                                    <div className="d-flex align-items-center justify-content-between">
                                                                        <p className="text-muted">
                                                                            {post?.donation?.collected_amount
                                                                                ? `${post.donation.collected_amount} Collected`
                                                                                : "0 Collected"
                                                                            }
                                                                        </p>
                                                                        <p className="text-dark"> Required: <span className="fw-bold"> {post.donation.amount} </span> </p>
                                                                        {/* {
                                                                    post.donation.collected_amount < post.donation.amount &&
                                                                    (
                                                                     
                                                                    )

                                                                } */}

                                                                        <button
                                                                            className="btn btn-primary btn-sm"
                                                                            onClick={() => {
                                                                                setDonationModal(!donationModal)

                                                                                setDonationID(post.donation.id)
                                                                            }}
                                                                        >
                                                                            Donate
                                                                        </button>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="d-flex justify-content-center flex-wrap">

                                                            {
                                                                post?.images && post?.images.length > 0 && (
                                                                    <UserImagesLayout key={`${post.id}-${index}`} post={post} />
                                                                )
                                                            }
                                                            {
                                                                post.event && post.event.cover && (
                                                                    <div>
                                                                        <Image
                                                                            src={post.event.cover || "/assets/images/placeholder-image.png"}
                                                                            alt="Event Cover"
                                                                            className="img-fluid mt-1"
                                                                            width={500}
                                                                            height={300}
                                                                            style={{
                                                                                objectFit: "cover",
                                                                            }}
                                                                        // loader={({ src }) => src}
                                                                        />

                                                                        <h5 className="fw-bold mt-2">{post.event.name}</h5>
                                                                        <button className="badge btn-primary rounded-pill mt-3">
                                                                            {post.event.start_date}
                                                                        </button>
                                                                    </div>
                                                                )}

                                                            {post.product && (
                                                                <div>
                                                                    <Image
                                                                        src={post.product.images[0].image || "/assets/images/placeholder-image.png"}
                                                                        alt="Product"
                                                                        className="img-fluid"
                                                                        width={600}
                                                                        height={400}
                                                                        style={{
                                                                            objectFit: "cover",
                                                                        }}
                                                                    />
                                                                    <div className="row mt-3">
                                                                        <div className="col-md-9">
                                                                            <h6><b>{post.product.product_name}</b></h6>
                                                                            <span><b>Price: </b>{post.product.price} ({post.product.currency})</span>
                                                                            <br />
                                                                            <span><b>Category: </b>{post.product.category}</span>
                                                                            <br />
                                                                            <span><i className="bi bi-geo-alt-fill text-primary"></i> {post.product.location}</span>
                                                                        </div>
                                                                        <div className="col-md-3 mt-4">
                                                                            <Link href={`/pages/Marketplace/productdetails/${post.product.id}`}>
                                                                                <button className="btn btn-primary rounded-pill px-3 py-2">
                                                                                    {userId === post.user_id ? "Edit Product" : "Buy Product"}
                                                                                </button>
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {post?.video && (
                                                                <div
                                                                    className="media-container w-100 mt-1"

                                                                >
                                                                    <video
                                                                        controls
                                                                        className="w-100 rounded"
                                                                        style={{ maxHeight: '400px', objectFit: 'contain' }}
                                                                    >
                                                                        <source
                                                                            src={post.video.media_path}
                                                                            type="video/mp4"
                                                                        />
                                                                        Your browser does not support the video tag.
                                                                    </video>
                                                                </div>
                                                            )}



                                                            {post?.audio && (
                                                                <div className="media-container w-100">
                                                                    <audio controls className="w-100">
                                                                        <source src={post.audio.media_path} />
                                                                        Your browser does not support the audio tag.
                                                                    </audio>
                                                                </div>
                                                            )}


                                                            {
                                                                post?.post_location && (
                                                                    <div className="media-container text-center w-100 mt-3">
                                                                        <span className="text-muted">
                                                                            <i className="bi bi-geo-alt-fill"></i> {post.post_location}
                                                                        </span>


                                                                    </div>
                                                                )

                                                            }
                                                        </div>

                                                        {/*  shared post till here*/}
                                                    </>


                                                    :

                                                    post.shared_post && <SharedPosts sharedPost={post.shared_post} userdata={userdata} post={post} posts={posts} setPosts={setPosts} />

                                                }


                                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-2 mt-2 px-3">
                                                    <div className="d-flex align-items-center mb-2 mb-md-0">
                                                        <span className="me-2">
                                                            {post?.reaction ? post.reaction.count || 0 : 0}
                                                        </span>
                                                        {
                                                            post?.reaction.is_reacted === true ?
                                                                <i className="bi bi-hand-thumbs-up-fill text-primary"></i>
                                                                :
                                                                <i className="bi bi-hand-thumbs-up"></i>

                                                        }
                                                    </div>
                                                    <div className="d-flex flex-wrap align-items-center text-muted">
                                                        <span className="me-3 d-flex align-items-center">
                                                            <i className="bi bi-eye me-1"></i>
                                                            {post.view_count || 0}
                                                        </span>
                                                        <span className="me-3 d-flex align-items-center">
                                                            <i className="bi bi-chat-dots me-1"></i>
                                                            {post.comment_count || 0} comments
                                                        </span>
                                                        <span className="d-flex align-items-center">
                                                            <i className="bi bi-share me-1"></i>
                                                            {post.share_count || 0} Shares
                                                        </span>
                                                    </div>
                                                </div>

                                                <hr className="my-1" />

                                                <div className="d-flex justify-content-between">


                                                    <div style={{ position: "relative", display: "inline-block" }}>
                                                        <button
                                                            className="btn border-0 d-flex align-items-center post-action-btn"
                                                            onMouseEnter={() => setActiveReactionPost(post.id)}
                                                            onMouseLeave={() => setActiveReactionPost(null)}
                                                            onClick={() => {
                                                                setActiveReactionPost(activeReactionPost === post.id ? null : post.id);
                                                            }}
                                                        >
                                                            <span style={{ fontSize: "18px", marginRight: "8px" }}>

                                                                {postReactions[post.id] || (post.reaction?.reaction_type ?
                                                                    reactionEmojis[
                                                                    Object.keys(reactionValues).find(
                                                                        key => reactionValues[key] === Number(post.reaction.reaction_type)
                                                                    )
                                                                    ] : "😊")}
                                                            </span>
                                                            Reaction
                                                        </button>


                                                        {activeReactionPost === post.id && (
                                                            <div
                                                                style={{
                                                                    position: "absolute",
                                                                    bottom: "100%",
                                                                    left: "0",
                                                                    zIndex: 1000,
                                                                    backgroundColor: "white",
                                                                    borderRadius: "5px",
                                                                }}
                                                                onMouseEnter={() => setActiveReactionPost(post.id)}
                                                                onMouseLeave={() => setActiveReactionPost(null)}
                                                            >
                                                                <ReactionBarSelector
                                                                    onSelect={(reaction) => handleReactionSelect(reaction, post.id)}
                                                                />
                                                            </div>
                                                        )}

                                                    </div>

                                                    <button
                                                        className="btn border-0 d-flex align-items-center post-action-btn"
                                                        onClick={() => handleCommentToggle(post.id)}
                                                    >
                                                        <i className="bi bi-chat me-2"></i> Comments
                                                    </button>

                                                    <div className="dropdown">
                                                        <button
                                                            className="btn border-0 post-action-btn"
                                                            type="button"
                                                            id="dropdownMenuButton3"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                            <i className="bi bi-share me-2"></i> Share
                                                        </button>

                                                        <ul
                                                            className="dropdown-menu"
                                                            aria-labelledby="dropdownMenuButton3"
                                                        >
                                                            <li className=" align-items-center d-flex">
                                                                <Link
                                                                    className="text-decoration-none dropdown-item text-muted"
                                                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(post.post_link)}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <i className="bi bi-facebook pe-2"></i> Share on Facebook
                                                                </Link>
                                                            </li>

                                                            <li className=" align-items-center d-flex">
                                                                <Link
                                                                    className="text-decoration-none dropdown-item text-muted"
                                                                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(post.post_link)}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <i className="bi bi-twitter-x pe-2"></i> Share on
                                                                    X
                                                                </Link>
                                                            </li>
                                                            <li className=" align-items-center d-flex">
                                                                <Link
                                                                    className="text-decoration-none dropdown-item text-muted"
                                                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(post.post_link)}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <i className="bi bi-linkedin pe-2"></i> Share on
                                                                    Linkedln
                                                                </Link>
                                                            </li>

                                                            <li>
                                                                <hr className="dropdown-divider" />
                                                            </li>

                                                            <li className=" align-items-center d-flex">
                                                                <button
                                                                    className="text-decoration-none dropdown-item text-muted custom-hover"
                                                                    onClick={() => {
                                                                        setShareShowTimelineModal(true)
                                                                        setPostID(post.id)
                                                                    }}
                                                                >
                                                                    <i className="bi bi-bookmark-check pe-2"></i> Post
                                                                    on Timeline
                                                                </button>
                                                            </li>

                                                            <li className=" align-items-center d-flex">
                                                                <span
                                                                    className="text-decoration-none dropdown-item text-muted"
                                                                    onClick={() => handleCopy(post.post_link)}
                                                                >
                                                                    <i className="bi bi-link pe-2"></i> Copy Post Link
                                                                </span>
                                                            </li>
                                                        </ul>

                                                    </div>
                                                </div>

                                                <hr className="my-1" />


                                                <div className="d-flex mb-3 mt-2">

                                                    {settings["chck-cup_of_coffee"] === "1" &&
                                                        userId &&
                                                        post.user_id !== userId && (
                                                            <button
                                                                className="btn me-2 d-flex align-items-center rounded-1 fw-semibold"
                                                                onClick={() => openModalCupCoffee(post.id)}
                                                                style={{
                                                                    backgroundColor: "#A87F50",
                                                                    borderRadius: "10px",
                                                                    color: "#fff",
                                                                }}
                                                            >
                                                                <i className="bi bi-cup-hot me-2"></i>Cup of Coffee
                                                            </button>
                                                        )}


                                                    {activeCupCoffeeId === post.id && (
                                                        <CupofCoffee postId={post.id} handleClose={closeModalCupCoffee} />
                                                    )}

                                                    {settings["chck-great_job"] === "1" &&
                                                        userId && post.user_id !== userId && (
                                                            <button
                                                                className="btn btn-danger d-flex align-items-center rounded-1 fw-semibold"
                                                                onClick={() => openModalGreatJob(post.id)}
                                                            >
                                                                <i className="bi bi-hand-thumbs-up me-2"></i> Great Job
                                                            </button>
                                                        )}


                                                    {activeGreatJobId === post.id && (
                                                        <Greatjob postId={post.id} handleClose={closeModalGreatJob} />
                                                    )}
                                                </div>


                                                {
                                                    post.comments_status === "1" && showComments[post.id] ? (
                                                        <div className="mt-2">
                                                            {comments[post.id] && comments[post.id].length > 0 ? (
                                                                comments[post.id].map((comment) => (
                                                                    <div key={comment.id} className="mb-3">
                                                                        <div className="d-flex">
                                                                            <Image
                                                                                src={comment.avatar || "/assets/images/userplaceholder.png"}
                                                                                alt="Profile"
                                                                                className="rounded-circle me-1 mt-2"
                                                                                width={40}
                                                                                height={40}
                                                                                style={{
                                                                                    objectFit: "cover",
                                                                                }}
                                                                            // loader={({ src }) => src}
                                                                            />

                                                                            <div className="mb-3">
                                                                                <div className="card border-0 bg-light w-100 mx-2 p-2">
                                                                                    <div className="flex-grow-1 mx-2">
                                                                                        <div className="d-flex align-items-center justify-content-between">
                                                                                            <p className="mb-0 fw-bold">
                                                                                                {comment.first_name}{" "}
                                                                                                {comment.last_name}
                                                                                            </p>
                                                                                            <small className="text-muted lead-font-size">
                                                                                                {comment.created_human}
                                                                                            </small>
                                                                                        </div>
                                                                                        <p className="mb-1">
                                                                                            {comment.comment || "No text available"}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="mx-3">
                                                                                    <button
                                                                                        className="btn text-secondary p-0 me-3 text-decoration-none"
                                                                                        onClick={() =>
                                                                                            LikeComment(post.id, comment.id)
                                                                                        }
                                                                                    >
                                                                                        <i className="bi bi-hand-thumbs-up"></i>{" "}
                                                                                        Like {comment.like_count}
                                                                                    </button>
                                                                                    <button
                                                                                        className="btn text-secondary p-0 me-3 text-decoration-none"
                                                                                        onClick={() =>
                                                                                            handleToggleReplyInput(comment.id)
                                                                                        }
                                                                                    >
                                                                                        Reply
                                                                                    </button>

                                                                                    <button
                                                                                        className="btn text-dark p-0 text-danger text-decoration-none"
                                                                                        onClick={() =>
                                                                                            handleCommentDelete(comment.id, post.id)
                                                                                        }
                                                                                    >
                                                                                        Delete
                                                                                    </button>
                                                                                    <button
                                                                                        className="btn text-secondary p-0 me-3 text-decoration-none mx-3"
                                                                                        onClick={() => toggleReplies(comment.id)}
                                                                                    >
                                                                                        ({comment.reply_count}) Replies
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {showReplies[comment.id] &&
                                                                            repliesData[comment.id] && (
                                                                                <div className="ms-4 mt-2">
                                                                                    {repliesData[comment.id].length > 0 ? (
                                                                                        repliesData[comment.id].map((reply) => (
                                                                                            <div
                                                                                                key={reply.id}
                                                                                                className="d-flex mb-2 mx-5"
                                                                                            >
                                                                                                <Image
                                                                                                    src={reply.avatar || "/assets/images/userplaceholder.png"}
                                                                                                    alt="Profile"
                                                                                                    className="rounded-circle me-1 mt-2"
                                                                                                    width={40}
                                                                                                    height={40}
                                                                                                    style={{
                                                                                                        objectFit: "cover",
                                                                                                    }}
                                                                                                // loader={({ src }) => src}
                                                                                                />

                                                                                                <div className="mb-3">
                                                                                                    <div className="card border-0 bg-light w-100 mx-2 p-2">
                                                                                                        <div className="flex-grow-1 mx-2">
                                                                                                            <div className="d-flex align-items-center justify-content-between">
                                                                                                                <p className="mb-0 fw-bold">
                                                                                                                    {reply.first_name}{" "}
                                                                                                                    {reply.last_name}
                                                                                                                </p>
                                                                                                                <small className="text-muted lead-font-size">
                                                                                                                    {reply.created_human}
                                                                                                                </small>
                                                                                                            </div>
                                                                                                            <p className="mb-1">
                                                                                                                {reply.comment}
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    </div>

                                                                                                    <div className="mx-3">
                                                                                                        <button
                                                                                                            className="btn text-secondary p-0 me-3 text-decoration-none"
                                                                                                            onClick={() =>
                                                                                                                commentReplyLike(reply.id)
                                                                                                            }
                                                                                                        >
                                                                                                            <i className="bi bi-hand-thumbs-up"></i>{" "}
                                                                                                            Like {reply.like_count}
                                                                                                        </button>
                                                                                                        <button
                                                                                                            className="btn text-dark p-0 text-danger text-decoration-none"
                                                                                                            onClick={() =>
                                                                                                                handleCommentreplyDelete(
                                                                                                                    reply.id
                                                                                                                )
                                                                                                            }
                                                                                                        >
                                                                                                            Delete
                                                                                                        </button>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        ))
                                                                                    ) : (
                                                                                        <p className="mx-5">
                                                                                            No replies available
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                            )}

                                                                        {showReplyInput[comment.id] && (
                                                                            <div className="mt-2 w-75 mx-5">
                                                                                <div className="input-group">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        placeholder="Write a reply..."
                                                                                        aria-label="Reply"
                                                                                        value={commentreplyText[comment.id] || ""}
                                                                                        onChange={(e) =>
                                                                                            setCommentreplyText((prevState) => ({
                                                                                                ...prevState,
                                                                                                [comment.id]: e.target.value,
                                                                                            }))
                                                                                        }
                                                                                    />
                                                                                    <button
                                                                                        className="btn btn-primary"
                                                                                        type="button"
                                                                                        onClick={() =>
                                                                                            ReplyComment(
                                                                                                comment.id,
                                                                                                commentreplyText[comment.id]
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Submit
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="form-control w-100 d-flex justify-content-center">
                                                                    No Comments Yet!
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                        :
                                                        null
                                                }


                                                {
                                                    post?.comments_status === "1" && (
                                                        <div className="d-flex align-items-center mt-3">
                                                            <Image
                                                                src={userdata.data.avatar || "/assets/images/userplaceholder.png"}
                                                                alt="User Avatar"
                                                                className="rounded-5"
                                                                width={40}
                                                                height={40}
                                                            // loader={({ src }) => src}
                                                            />
                                                            <form className="position-relative w-100 ms-2">
                                                                <input
                                                                    type="text"
                                                                    className="form-control bg-light border-1 rounded-2"
                                                                    placeholder="Add a comment..."
                                                                    value={commentText[post.id] || ""}
                                                                    onChange={(e) => handleCommentTextChange(e, post.id)}
                                                                />
                                                                <button
                                                                    className="btn btn-transparent position-absolute top-50 end-0 translate-middle-y"
                                                                    type="button"
                                                                    onClick={() => handleCommentSubmit(post.id)}
                                                                >
                                                                    <i className="bi bi-send"></i>
                                                                </button>
                                                            </form>
                                                        </div>
                                                    )
                                                }



                                                <hr />

                                                
                                                            {/* <div className="row mx-n1">
                                                                <div className="col-md-4 advertisment-image">
                                                                    <Image src={post?.post_advertisement.image || "/assets/images/userplaceholder.png"} width={200} height={100} className="img-fluid rounded-4" alt="adv-img" style={{ objectFit: "cover" }} />
                                                                </div>
                                                                <div className="col-md-8 ">
                                                                    <div className="card-body advertistment-details p-1">
                                                                        <a href={`${post?.post_advertisement.link}`} className="card-title text-primary text-decoration-none" target="_blank">{post?.post_advertisement.link}</a>
                                                                        <h5 className="card-title">{post?.post_advertisement.title}</h5>
                                                                        <div className="card-text">
                                                                            {post?.post_advertisement.body ? (
                                                                                <span>
                                                                                    <ReadMoreLess
                                                                                        charLimit={50}
                                                                                        readMoreText="read more"
                                                                                        readLessText="read less"
                                                                                    >
                                                                                        {post?.post_advertisement.body}
                                                                                    </ReadMoreLess>
                                                                                </span>
                                                                            ) : null}
                                                                        </div>
                                                                        <p className="card-text"><small className="text-body-secondary">{post?.post_advertisement.created_at.split(' ')[0]}</small></p>
                                                                    </div>
                                                                </div>
                                                                ///
                                                            </div> */}




                                                {
                                                    post?.post_advertisement ? (
                                                        <div className="card mb-3 mt-4 p-2 border-secondary">
                                                            <div className="d-flex flex-column flex-md-row  align-items-center align-items-md-start">
                                                                <div className="flex-shrink-0 mb-3 mb-md-0 align-self-center">
                                                                    <Image
                                                                        src={post?.post_advertisement.image || "/assets/images/userplaceholder.png"}
                                                                        width={200}
                                                                        height={100}
                                                                        className="img-fluid rounded-4"
                                                                        alt="adv-img"
                                                                        style={{ objectFit: "conatin",  }}
                                                                    />
                                                                </div>
                                                                <div className="flex-grow-1 ms-md-3 align-self-center">
                                                                <div className="card-body advertistment-details">
                                                                        <a href={`${post?.post_advertisement.link}`} className="card-title text-primary text-decoration-none " target="_blank">{post?.post_advertisement.link}</a>
                                                                        <h5 className="card-title mb-lg-3">{post?.post_advertisement.title}</h5>
                                                                        <div className="card-text mb-lg-2">
                                                                            {post?.post_advertisement.body ? (
                                                                                <span>
                                                                                    <ReadMoreLess
                                                                                        charLimit={70}
                                                                                        readMoreText="read more"
                                                                                        readLessText="read less"
                                                                                    >
                                                                                        {post?.post_advertisement.body}
                                                                                    </ReadMoreLess>
                                                                                </span>
                                                                            ) : null}
                                                                        </div>
                                                                        <p className="card-text"><small className="text-body-secondary">{post?.post_advertisement.created_at.split(' ')[0]}</small></p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) 
                                                    : 
                                                    null
                                                }

                                                {
                                                    userId !== post?.user_id && (
                                                        <>
                                                            {/* <hr /> */}
                                                            <div className="text-center mt-2">
                                                                <button
                                                                    className="btn btn-outline-primary"
                                                                    onClick={() => {
                                                                        setShowAdvertismentModal(true);
                                                                        setPostID(post.id);
                                                                    }}
                                                                >
                                                                    <i className="bi bi-aspect-ratio-fill"></i> Advertise Here
                                                                </button>
                                                            </div>
                                                        </>
                                                    )
                                                }





                                            </div>



                                        </div>



                                    </div>






                                )

                            }

                            )}




                            <div className="card col-md-12 shadow-lg border-0 rounded-3 mt-2 mb-2">
                                <div className="my-sm-5 py-sm-5 text-center">
                                    <i className="display-1 text-secondary bi bi-card-list" />
                                    <h5 className="mt-2 mb-3 text-body text-muted">No More Posts to Show</h5>
                                </div>
                            </div>




                        </div>

                        <RightNav pageTimelineData={pageTimelineData} />


                        {
                            pollModal &&
                            (
                                <PostPollModal
                                    pollModal={pollModal}
                                    setPollModal={setPollModal}
                                    posts={posts}
                                    setPosts={setPosts}
                                    myPageTimeline={myPageTimeline}
                                    endpoint={endpoint}
                                />
                            )

                        }


                        {
                            fundingModal && (
                                <FundingModal
                                    fundingModal={fundingModal}
                                    setFundingModal={setFundingModal}
                                    uploadPost={uploadPost}
                                />
                            )


                        }


                        {
                            donationModal && (
                                <MakeDonationModal
                                    donationID={donationID}
                                    donationModal={donationModal}
                                    setDonationModal={setDonationModal}
                                    posts={posts}
                                    setPosts={setPosts}
                                />
                            )

                        }

                        {
                            showEnableDisableCommentsModal && (
                                <EnableDisableCommentsModal
                                    showEnableDisableCommentsModal={showEnableDisableCommentsModal}
                                    setShowEnableDisableCommentsModal={setShowEnableDisableCommentsModal}
                                    postID={postID}
                                    posts={posts}
                                    setPosts={setPosts}

                                />
                            )


                        }


                        {
                            showSavePostModal && (
                                <SavePostModal
                                    postID={postID}
                                    posts={posts}
                                    setPosts={setPosts}
                                    showSavePostModal={showSavePostModal}
                                    setShowSavePostModal={setShowSavePostModal}
                                />
                            )}


                        {
                            showReportPostModal && (
                                <ReportPostModal
                                    postID={postID}
                                    posts={posts}
                                    setPosts={setPosts}
                                    showReportPostModal={showReportPostModal}
                                    setShowReportPostModal={setShowReportPostModal}
                                />
                            )}

                        {

                            showEditPostModal && (
                                <EditPostModal
                                    showEditPostModal={showEditPostModal}
                                    setShowEditPostModal={setShowEditPostModal}
                                    posts={posts}
                                    setPosts={setPosts}
                                    postID={postID}
                                />
                            )
                        }


                        {
                            sharePostTimelineModal && (
                                <SharePostTimelineModal
                                    sharePostTimelineModal={sharePostTimelineModal}
                                    setShareShowTimelineModal={setShareShowTimelineModal}
                                    postID={postID}
                                />
                            )
                        }


                        {
                            showAdvertismentModal && (

                                <AdvertismentModal
                                    showAdvertismentModal={showAdvertismentModal}
                                    setShowAdvertismentModal={setShowAdvertismentModal}
                                    postID={postID}
                                />
                            )

                        }



                    </div>
                </div>
            </div>

        </>
    )
}
