"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import createAPI from "@/app/lib/axios";
import RightNavbar from "../../components/right-navbar";
import Image from "next/image";
import { use } from "react";
import Link from "next/link";
import EmojiPicker from 'emoji-picker-react';
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Profilecard from "../../components/profile-card";
import CupofCoffee from "@/app/pages/Modals/CupOfCoffee/CupofCoffee";
import Greatjob from "@/app/pages/Modals/GreatJob/GreatJob";
import styles from '../../css/page.module.css';
import EditPostModal from "@/app/pages/Modals/EditPostModal";
import EnableDisableCommentsModal from "@/app/pages/Modals/EnableDisableCommentsModal";
import SavePostModal from "@/app/pages/Modals/SaveUnsavePost";
import ReportPostModal from "@/app/pages/Modals/ReportPost";
import useConfirmationToast from "@/app/pages/Modals/useConfirmationToast";
import MakeDonationModal from "@/app/pages/Modals/MakeDonationModal";
import UserImagesLayout from "@/app/pages/components/userImagesLayout";
import PostPollModal from "@/app/pages/Modals/PostPollModal";
import FundingModal from "@/app/pages/Modals/FundingModal";
import SharePostTimelineModal from "@/app/pages/Modals/SharePostTimelineModal";
import Spinner from 'react-bootstrap/Spinner';
import SharedPosts from "@/app/pages/components/sharedPosts";
import { ReactionBarSelector } from '@charkour/react-reactions';


export default function UserProfileCard({ params }) {

    const { profileId } = use(params);
    const api = createAPI();
    const router = useRouter();
    const [userId, setUserId] = useState(null);
    const [activeCupCoffeeId, setActiveCupCoffeeId] = useState(null);
    const [activeGreatJobId, setActiveGreatJobId] = useState(null);
    const [page, setPage] = useState(1);
    const [userdata, setUserData] = useState(null);
    const [lastPostId, setLastPostId] = useState(0);
    const [noMorePosts, setNoMorePosts] = useState(false);
    const [user, setUser] = useState(null);
    const [uploadPloading, setUploadPLoading] = useState(false)
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [dropdownSelection, setDropdownSelection] = useState("PUBLIC");
    const [success, setSuccess] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showLocation, setShowLocation] = useState(false);
    const [showimg, setShowimg] = useState(false);
    const [video, setvideo] = useState([]);
    const [images, setImages] = useState([]);
    const [comments, setComments] = useState({});
    const [showComments, setShowComments] = useState({});
    const [commentText, setCommentText] = useState({});
    const [showaudio, setShowaudio] = useState(false);
    const [postText, setPostText] = useState("");
    const [privacy, setPrivacy] = useState(0);
    const [locationText, setlocationText] = useState("");
    const [showList, setShowList] = useState(false);
    const [showvideo, setShowvideo] = useState(false);
    const [audio, setaudio] = useState([]);
    const [showReplies, setShowReplies] = useState({});
    const [showReplyInput, setShowReplyInput] = useState({});
    const [commentreplyText, setCommentreplyText] = useState({});
    const [repliesData, setRepliesData] = useState({});
    const [isOpenColorPalette, setIsOpenColorPalette] = useState(false);
    const [color, setColor] = useState("");
    const [showEditPostModal, setShowEditPostModal] = useState(false);
    const [postID, setPostID] = useState("")
    const [showEnableDisableCommentsModal, setShowEnableDisableCommentsModal] = useState(false);
    const [showReportPostModal, setShowReportPostModal] = useState(false);
    const [showSavePostModal, setShowSavePostModal] = useState(false);
    const [donationModal, setDonationModal] = useState(false);
    const [donationID, setDonationID] = useState("");
    const [fundingModal, setFundingModal] = useState(false);
    const [pollModal, setPollModal] = useState(false);
    const [sharePostTimelineModal, setShareShowTimelineModal] = useState(false);
    const [postReactions, setPostReactions] = useState({});
    const [activeReactionPost, setActiveReactionPost] = useState(null);


    const fileImageRef = useRef(null);

    const fileVideoRef = useRef(null);

    const fileAudioRef = useRef(null);

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
        };

        LikePost(postId, reactionValues[reaction] || 0);

        setPostReactions(updatedReactions);
        setActiveReactionPost(null);
    };


    const handleDelete = useCallback(async (values) => {
        const postId = values[0];

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

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!profileId) return;
            try {
                const response = await api.get(`/api/get-user-profile?user_id=${profileId}`);
                if (response.data.code === "200") {
                    setUser(response.data.data);
                } else {
                    toast.error("Failed to fetch user profile.");
                    setError("Could not load user profile");
                }
            } catch (error) {
                toast.error("Error fetching user profile");
                setError("Error fetching user profile");
            }
        };

        fetchUserProfile();
    }, [profileId]);

    useEffect(() => {
        const data = localStorage.getItem("userdata");
        if (data) {
            setUserData(JSON.parse(data));
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUserId = localStorage.getItem("userid");
            setUserId(storedUserId);
        }
    }, []);

    const fetchPosts = async (isInitialLoad = true, limit = 10) => {
        if (loading || noMorePosts) return;

        try {
            setLoading(true);

            const response = await api.post("/api/post/newsfeed", {
                limit,
                last_post_id: lastPostId,
                user_id: profileId,
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

                if (isInitialLoad) setPage(1);
            } else {
                toast.error("Invalid data format received from API.");
            }
        } catch (error) {
            toast.error("An error occurred while fetching newsfeed data.");
        } finally {
            setLoading(false);
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

    if (!user || !userdata) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const handlePostDelete = (postId) => {
        showConfirmationToast([postId]);
    };
    const handleDropdownChange = (selection) => {
        setDropdownSelection(selection);

        switch (selection) {
            case "PUBLIC":
                setPrivacy(1);
                break;
            case "Friends":
                setPrivacy(2);
                break;
            case "Family":
                setPrivacy(4);
                break;
            case "Business":
                setPrivacy(5);
                break;
            case "Only me":
                setPrivacy(3);
                break;
            default:
                setPrivacy(1);
                break;
        }
    };

    const getDropdownIcon = (selection) => {
        switch (selection) {
            case "PUBLIC":
                return <i className="bi bi-globe-asia-australia"></i>;
            case "Friends":
                return <i className="bi bi-people-fill"></i>;
            case "Family":
                return <i className="bi bi-people"></i>;
            case "Business":
                return <i className="bi bi-briefcase"></i>;
            case "Only me":
                return <i className="bi bi-lock-fill"></i>;
            default:
                return <i className="bi bi-globe-asia-australia"></i>;
        }
    };

    const toggleLocation = () => {
        setShowLocation((prev) => !prev);
    };

    const toggleaudio = () => {
        setShowaudio((prev) => !prev);
    };

    const togglevideo = () => {
        setShowvideo((prev) => !prev);
    };

    const toggleimg = () => {
        setShowimg((prev) => !prev);
    };

    const handleImageChange = (event) => {
        const files = event.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        if (newFiles.length + images.length > 10) {
            alert("You can only upload up to 10 images.");
            toast.info("You can only upload up to 10 images.")
            return;
        }

        const newImages = newFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        setImages((prevImages) => [...prevImages, ...newImages]);
    };

    const handlevideoChange = (e) => {
        const videoFiles = e.target.files;

        if (videoFiles.length > 1) {
            alert("You can only upload one video at a time.");
            toast.info("You can only upload one video at a time.");
            return;
        }

        if (videoFiles.length === 1) {
            const newVideo = {
                file: videoFiles[0],
                url: URL.createObjectURL(videoFiles[0]),
            };
            setvideo([newVideo]);
        }
    };



    const removeImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };


    const removeVideo = (index) => {
        setvideo((prevVideos) => prevVideos.filter((_, i) => i !== index));
    };

    const handleaudioChange = (event) => {
        const files = Array.from(event.target.files);
        const newAudio = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setaudio((prevFiles) => [...prevFiles, ...newAudio]);
    };

    const removeAudio = (index) => {
        const updatedAudios = audio.filter((_, i) => i !== index);
        setaudio(updatedAudios);
    };

    const handlePostTextChange = (e) => { setPostText(e.target.value) };
    const handleLocationTextChange = (e) => { setlocationText(e.target.value) };


    const handleEmojiButtonClick = () => {
        setShowEmojiPicker((prev) => !prev);
    };

    const handleEmojiSelect = (emoji) => {
        setPostText((prevText) => prevText + emoji.emoji);
        setShowEmojiPicker(false);
    };


    const uploadPost = async (donationData = {}) => {
        try {
            const formData = new FormData();
            const combinedText = donationData.donationTitle
                ? `${postText} ${donationData.donationTitle}`
                : postText;
            formData.append("post_text", combinedText);
            if (donationData.donationAmount) {
                formData.append("amount", donationData.donationAmount);
            }
            if (donationData.donationDescription) {
                formData.append("description", donationData.donationDescription);
            }

            if (donationData.donationImage) formData.append("donation_image", donationData.donationImage);
            formData.append("bg_color", color);
            formData.append("post_location", locationText);
            images.forEach((image) => formData.append("images[]", image.file));
            audio.forEach((audioFile) => formData.append("audio", audioFile.file));
            video.forEach((videoFile) => formData.append("video", videoFile.file));

            let postType = "post";
            if (donationData.donationAmount) {
                postType = "donation";
            }

            formData.append("post_type", postType);

            formData.append("privacy", privacy);

            setUploadPLoading(true);

            const response = await api.post("/api/post/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.code == "200") {
                toast.success(response.data.message)
                setPosts([response.data.data, ...posts]);
                setPostText("");
                setError("");
                setImages([]);
                setColor("");
                setShowimg(false);
                setFundingModal(false);
                setShowaudio(false);
                setShowvideo(false);
                setaudio([]);
                setvideo([]);
                setShowLocation(false);
            } else {
                toast.error("Error from server: " + response.data.message)
                setSuccess("");
            }
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            setUploadPLoading(false);
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
            console.error(error);
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

    const handleClick = (userId) => {
        router.push(`/pages/UserProfile/timeline/${userId}`);
    };

    const handleCopy = (link) => {
        navigator.clipboard.writeText(link);
        toast.success("Link copied successfully!");
    };

    // Function to open/close Cup of Coffee modal
    const openModalCupCoffee = (id) => {
        setActiveCupCoffeeId(id);
        setActiveGreatJobId(null); // Ensure other modal closes
    };
    const closeModalCupCoffee = () => {
        setActiveCupCoffeeId(null);
    };

    // Function to open/close Great Job modal
    const openModalGreatJob = (id) => {
        setActiveGreatJobId(id);
        setActiveCupCoffeeId(null); // Ensure other modal closes
    };
    const closeModalGreatJob = () => {
        setActiveGreatJobId(null);
    };

    const toggleOptionsColorPalette = () => {
        setIsOpenColorPalette(!isOpenColorPalette);

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


    return (
        <>

            <div className="container mt-5 pt-4">
                <div className="row d-flex justify-content-between">

                    <div className="col-12 col-md-8">

                        <Profilecard user_id={profileId} />

                        {userdata.data.id === profileId && (
                            <div className="card mb-3 shadow-lg border-0 mt-3">
                                {error && <p className="text-center text-danger">{error}</p>}

                                {success && (
                                    <div className="alert alert-success mt-2">{success}</div>
                                )}

                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-3">
                                        <Image
                                            src={userdata.data.avatar || "/assets/images/userplaceholder.png"}
                                            alt="User Avatar"
                                            className="rounded-circle"
                                            height={50}
                                            width={50}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => router.push(`/pages/UserProfile/timeline/${userdata.data.id}`)}
                                        />
                                        <div className="mx-2 flex-grow-1">
                                            <span className="fw-semibold"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => router.push(`/pages/UserProfile/timeline/${userdata.data.id}`)}
                                            >
                                                {userdata.data.first_name} {userdata.data.last_name}
                                            </span>

                                            <div className="dropdown">
                                                <button
                                                    className="btn border-0 dropdown-toggle text-muted btn-sm"
                                                    type="button"
                                                    id="dropdownMenuLink"
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                >
                                                    {getDropdownIcon(dropdownSelection)}{" "}
                                                    {dropdownSelection} {""}
                                                </button>
                                                <ul
                                                    className="dropdown-menu p-3"
                                                    aria-labelledby="dropdownMenuLink"
                                                >
                                                    <li
                                                        className="dropdown-item text-primary"
                                                        onClick={() => handleDropdownChange("PUBLIC")}
                                                    >
                                                        <i className="bi bi-globe-asia-australia pe-2"></i>{" "}
                                                        Public
                                                    </li>
                                                    <hr className="mb-0 mt-0 text-muted" />
                                                    <li
                                                        className="dropdown-item text-primary"
                                                        onClick={() => handleDropdownChange("Friends")}
                                                    >
                                                        <i className="bi bi-people-fill pe-2"></i> Friends
                                                    </li>
                                                    <hr className="mb-0 mt-0 text-muted" />
                                                    <li
                                                        className="dropdown-item text-primary"
                                                        onClick={() => handleDropdownChange("Family")}
                                                    >
                                                        <i className="bi bi-people pe-2"></i> Family
                                                    </li>
                                                    <hr className="mb-0 mt-0 text-muted" />
                                                    <li
                                                        className="dropdown-item text-primary"
                                                        onClick={() => handleDropdownChange("Business")}
                                                    >
                                                        <i className="bi bi-briefcase pe-2"></i> Business
                                                    </li>
                                                    <hr className="mb-0 mt-0 text-muted" />
                                                    <li
                                                        className="dropdown-item text-primary"
                                                        onClick={() => handleDropdownChange("Only me")}
                                                    >
                                                        <i className="bi bi-lock-fill pe-2"></i> Only me
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <textarea
                                            className="form-control mb-2 border-0 no-border"
                                            placeholder="Share your thoughts..."
                                            value={postText}
                                            onChange={handlePostTextChange}
                                            style={{
                                                height: "150px", background: getDisplayColor(color)
                                            }}
                                        />

                                        <button type="button" id="emoji-button" onClick={handleEmojiButtonClick} className="p-1 btn btn-light position-absolute trigger" style={{ right: "25px", top: "90px" }}>😊</button>

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
                                    </div>

                                    {showLocation && (
                                        <div>
                                            <label className="form-label text-muted">
                                                <i className="bi bi-geo-alt-fill"></i> Location
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder="Where are you at?"
                                                value={locationText}
                                                onChange={handleLocationTextChange}
                                            />
                                        </div>
                                    )}

                                    {showimg && (
                                        <div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "10px",
                                                    marginTop: "5px",
                                                    flexWrap: "wrap",
                                                }}
                                            >
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
                                                                backgroundColor: "red",
                                                                width: "20px",
                                                                height: "20px",
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            <i className="bi bi-trash text-light"></i>
                                                        </button>

                                                        <Image
                                                            className="mb-3"
                                                            src={img.url}
                                                            alt={`Preview ${index}`}
                                                            width={100}
                                                            height={100}
                                                            style={{ objectFit: "cover", borderRadius: "5px" }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="col-lg-12 mb-3">
                                                <label className="form-label text-muted">
                                                    <i className="bi bi-image-fill"></i> Photos
                                                </label>
                                                <input
                                                    className="form-control form-control-sm"
                                                    type="file"
                                                    id="formFile"
                                                    onChange={handleImageChange}
                                                    ref={fileImageRef}
                                                    multiple
                                                    accept="image/*"
                                                />
                                            </div>
                                        </div>
                                    )}


                                    {showvideo && (
                                        <div>
                                            <div style={{ display: "flex", gap: "20px", marginTop: "5px", flexWrap: "wrap" }}>
                                                {video.map((video, index) => (
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
                                                <label className="form-label text-muted">
                                                    <i className="bi bi-camera-reels-fill"></i> Videos
                                                </label>
                                                <input
                                                    className="form-control form-control-sm"
                                                    type="file"
                                                    id="videofile"
                                                    onChange={handlevideoChange}
                                                    ref={fileVideoRef}
                                                    accept="video/*"
                                                    multiple
                                                />
                                            </div>
                                        </div>
                                    )}


                                    {showaudio && (
                                        <div>
                                            <div style={{ display: "flex", gap: "20px", marginTop: "5px", flexWrap: "wrap" }}>
                                                {audio.map((audio, index) => (
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
                                                <label className="form-label text-muted">
                                                    <i className="bi bi-music-note-beamed"></i> Audio
                                                </label>
                                                <input
                                                    className="form-control form-control-sm"
                                                    type="file"
                                                    id="audiofile"
                                                    onChange={handleaudioChange}
                                                    ref={fileAudioRef}
                                                    accept="audio/*"
                                                />
                                            </div>
                                        </div>
                                    )}


                                    <div className="d-flex flex-wrap justify-content-evenly">
                                        <div>
                                            <button
                                                htmlFor="imageFile"
                                                className="btn btn-light text-secondary align-items-center mt-2"
                                                onClick={toggleimg}
                                            >
                                                <i className="bi bi-image text-success pe-1"></i> Photo
                                            </button>
                                        </div>

                                        <div>
                                            <button
                                                htmlFor="videofile"
                                                className="btn btn-light text-secondary align-items-center mt-2"
                                                onClick={togglevideo}
                                            >
                                                <i className="bi bi-camera-video text-primary pe-2"></i>
                                                Video
                                            </button>
                                        </div>

                                        <div>
                                            <button
                                                htmlFor="audiofile"
                                                className="btn btn-light text-secondary align-items-center mt-2"
                                                onClick={toggleaudio}
                                            >
                                                <i className="bi bi-music-note text-primary pe-1"></i>{" "}
                                                Audio
                                            </button>
                                        </div>

                                        <button
                                            className="btn btn-light text-secondary align-items-center mt-2"
                                            onClick={toggleLocation}
                                        >
                                            <i className="bi bi-geo-alt text-danger pe-1"></i>{" "}
                                            Location
                                        </button>

                                        <button
                                            className="btn btn-light text-secondary align-items-center mt-2"
                                            onClick={() => router.push("/pages/Events/create-event")}
                                        >
                                            <i className="bi bi-calendar-event text-danger pe-1"></i>{" "}
                                            Event
                                        </button>

                                        <div>
                                            <button className="btn btn-light text-secondary align-items-center mt-2" onClick={() => setPollModal(!pollModal)}>
                                                <i className="fas fa-poll text-info pe-1" /> Poll
                                            </button>
                                        </div>

                                        <div>
                                            <button className="btn btn-light text-secondary align-items-center mt-2" onClick={() => setFundingModal(!fundingModal)}>
                                                <i className="fas fa-hand-holding-usd text-success pe-1" /> Raise funding
                                            </button>
                                        </div>

                                    </div>

                                    <div className="d-flex justify-content-center">
                                        <button
                                            className="btn btn-outline-success mt-3 w-100 d-flex align-items-center justify-content-center"
                                            disabled={uploadPloading}
                                            onClick={uploadPost}
                                        >
                                            {!uploadPloading && <i className="bi bi-send me-2"></i>}
                                            {uploadPloading ? (
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    role="status"
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                "Post"
                                            )}
                                        </button>
                                    </div>

                                </div>
                            </div>
                        )}

                        {posts.map((post, index) => (
                            <div
                                key={`${post.id}-${index}`}
                                className="card mb-2 shadow-lg border-0 rounded-1"
                            >
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">

                                            <div className="avatar-container" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                onClick={() => handleClick(post.user.id)}
                                            >


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
                                                        style={{
                                                            cursor: 'pointer',
                                                            color: 'inherit',
                                                            transition: 'color 0.3s ease'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.color = 'blue'}
                                                        onMouseLeave={(e) => e.target.style.color = 'inherit'}
                                                        onClick={() => router.push(`/pages/UserProfile/timeline/${post.user.id}`)}
                                                    >
                                                        {post.user.first_name} {post.user.last_name}
                                                    </span>

                                                    {post.post_location && post.post_location !== "" && (
                                                        <span className="text-primary">
                                                            <small className="text-dark"> is in </small> {post.post_location}
                                                        </span>
                                                    )}
                                                    {(post.group || post.page) && <i className="bi bi-arrow-right fa-fw mx-2"></i>}

                                                    {post.group &&
                                                        <span
                                                            style={{
                                                                cursor: 'pointer',
                                                                color: 'inherit',
                                                                transition: 'color 0.3s ease'
                                                            }}
                                                            onMouseEnter={(e) => e.target.style.color = 'blue'}
                                                            onMouseLeave={(e) => e.target.style.color = 'inherit'}
                                                            onClick={() => router.push(`/pages/groups/groupTimeline/${post.group_id}`)}
                                                        >
                                                            {post.group.group_title}
                                                        </span>
                                                    }

                                                    {post.page &&
                                                        <span
                                                            style={{
                                                                cursor: 'pointer',
                                                                color: 'inherit',
                                                                transition: 'color 0.3s ease'
                                                            }}
                                                            onMouseEnter={(e) => e.target.style.color = 'blue'}
                                                            onMouseLeave={(e) => e.target.style.color = 'inherit'}
                                                            onClick={() => router.push(`/pages/page/myPageTimeline/${post.page_id}`)}
                                                        >
                                                            {post.page.page_title}
                                                        </span>}
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

                                        <div>
                                            <div className="dropstart">
                                                <button
                                                    className="btn border-0"
                                                    type="button"
                                                    id={`dropdownMenuButton-${post.id}`}
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                >
                                                    <i className="bi bi-caret-down"></i>
                                                </button>

                                                {post.user.id !== userdata.data.id && (
                                                    <ul
                                                        className="dropdown-menu dropdown-menu-light"
                                                        aria-labelledby={`dropdownMenuButton-${post.id}`}
                                                    >


                                                        <li className="align-items-center d-flex">
                                                            <button
                                                                className="text-decoration-none dropdown-item text-secondary"
                                                                onClick={() => {
                                                                    setShowSavePostModal(true);
                                                                    setPostID(post.id);
                                                                }}
                                                            >
                                                                <i className="bi bi-bookmark pe-2"></i>

                                                                {post.is_saved === false ? "Save Post" : "Unsave Post"}

                                                            </button>
                                                        </li>



                                                        <li>
                                                            <hr className="dropdown-divider" />
                                                        </li>
                                                        <li className="align-items-center d-flex">
                                                            <button className="text-decoration-none dropdown-item text-secondary"
                                                                onClick={() => {
                                                                    setShowReportPostModal(true)
                                                                    setPostID(post.id)

                                                                }}
                                                            >
                                                                <i className="bi bi-flag pe-2"></i> Report Post
                                                            </button>
                                                        </li>
                                                        <li className="align-items-center d-flex">
                                                            <Link
                                                                href={`/pages/openPostInNewTab/${post.id}`}
                                                                target="_blank" rel="noopener noreferrer"
                                                                className="text-decoration-none dropdown-item text-secondary">
                                                                <i className="bi bi-box-arrow-up-right pe-2"></i> Open post in new tab
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                )}

                                                {post.user.id === userdata.data.id && (
                                                    <ul
                                                        className="dropdown-menu dropdown-menu-light"
                                                        aria-labelledby={`dropdownMenuButton-${post.id}`}
                                                    >

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
                                                                            <i className="bi bi-chat-left-text pe-2"></i> <span>Disable Comments</span>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <i className="bi bi-chat-left-text-fill pe-2"></i> <span>Enable Comments</span>
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
                                                                <button className="text-decoration-none dropdown-item text-secondary">
                                                                    <i className="bi bi-cash fa-fw pe-2"></i> Fundings
                                                                </button>
                                                            )}
                                                        </li>

                                                        <li className="align-items-center d-flex">
                                                            <button
                                                                className="btn dropdown-item text-secondary"
                                                                onClick={() => handlePostDelete(post.id)}
                                                            >
                                                                <i className="bi bi-trash3 pe-2"></i> Delete Post
                                                            </button>
                                                        </li>

                                                        <li>
                                                            <hr className="dropdown-divider" />
                                                        </li>
                                                        <li className="align-items-center d-flex">
                                                            <Link
                                                                href={`/pages/openPostInNewTab/${post.id}`}
                                                                target="_blank" rel="noopener noreferrer"
                                                                className="text-decoration-none dropdown-item text-secondary">
                                                                <i className="bi bi-box-arrow-up-right pe-2"></i> Open post in new tab
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                )}
                                            </div>
                                        </div>

                                    </div>

                                    <hr className="my-2 post-divider" />

                                    {
                                        post.bg_color && (
                                            <div className="card-body inner-bg-post d-flex justify-content-center flex-wrap mb-1 h-100"
                                                style={{
                                                    background: getDisplayColor(post.bg_color),
                                                    backgroundSize: post.bg_color?.startsWith('_2j8') ? 'cover' : 'auto',
                                                    backgroundRepeat: post.bg_color?.startsWith('_2j8') ? 'no-repeat' : 'repeat',
                                                    backgroundPosition: post.bg_color?.startsWith('_2j8') ? 'center' : 'unset',
                                                    padding: "220px 27px",
                                                }}
                                            >
                                                <span className="text-dark fw-bold" style={{ fontSize: "1.5rem" }}>   {post.post_text} </span>
                                            </div>
                                        )

                                    }

                                    {post.post_type !== "donation" && !post.bg_color && (
                                        <p
                                            className="mt-2 mx-2"
                                            dangerouslySetInnerHTML={{ __html: post.post_text }}
                                        />
                                    )}

                                    {post.shared_post === null ?

                                        <>
                                            <div className="d-flex justify-content-center flex-wrap">
                                                {post.poll && post.poll.poll_options && (
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
                                                                    <li key={option.id} className="mb-4 w-100">
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

                                            <div className="container mt-1">
                                                {post.donation && (
                                                    <div>
                                                        <Image
                                                            src={post.donation.image || "/assets/images/placeholder-image.png"}
                                                            alt={post.donation.title}
                                                            width={500}
                                                            height={300}
                                                            className="img-fluid rounded"
                                                            style={{
                                                                objectFit: "contain",
                                                                objectPosition: "center",
                                                                display: "block",
                                                                margin: "0 auto",
                                                            }}
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
                                                                    {post.donation.collected_amount} Collected
                                                                </p>
                                                                <p className="text-dark"> Required: <span className="fw-bold"> {post.donation.amount} </span> </p>

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
                                            </div>

                                            <div className="d-flex flex-column align-items-center mb-3">

                                                <UserImagesLayout key={`${post.id}-${index}`} post={post} />

                                                {/* Event Section */}
                                                {post.event && post.event.cover && (
                                                    <div className="w-100 text-center mt-2">
                                                        <Image
                                                            src={post.event.cover || "/assets/images/placeholder-image.png"}
                                                            alt="Event Cover"
                                                            width={500}
                                                            height={300}
                                                            className="img-fluid rounded"
                                                            style={{ objectFit: "cover" }}
                                                        />

                                                        <h5 className="fw-bold mt-2"
                                                            style={{
                                                                cursor: 'pointer',
                                                                color: 'inherit',
                                                                transition: 'color 0.3s ease'
                                                            }}
                                                            onMouseEnter={(e) => e.target.style.color = 'blue'}
                                                            onMouseLeave={(e) => e.target.style.color = 'inherit'}
                                                            onClick={() => router.push(`/pages/Events/eventDetails/${post.event_id}`)}
                                                        >
                                                            {post.event.name}
                                                        </h5>

                                                        <span className="badge bg-primary rounded-pill mt-2 px-3 py-2">{post.event.start_date}</span>
                                                    </div>
                                                )}

                                                {post.product && post.product.images.length > 0 && (
                                                    <div className="w-100 mt-4 card shadow-sm border-0 rounded p-3">
                                                        {/* Product Image */}
                                                        <div className="text-center">
                                                            <Image
                                                                src={post.product.images[0].image || "/assets/images/placeholder-image.png"}
                                                                alt={post.product.product_name}
                                                                width={600}
                                                                height={400}
                                                                className="img-fluid rounded"
                                                                style={{ objectFit: "cover", maxHeight: "300px" }}
                                                            />
                                                        </div>

                                                        {/* Product Details */}
                                                        <div className="card-body">
                                                            <h5 className="fw-bold text-dark">{post.product.product_name}</h5>
                                                            <hr className="mb-2" />

                                                            <div className="row align-items-center">
                                                                <div className="col-md-9">
                                                                    <p className="mb-1"><b>Price:</b> <span className="text-success fw-bold">{post.product.price} {post.product.currency}</span></p>
                                                                    <p className="mb-1"><b>Category:</b> {post.product.category}</p>
                                                                    <p className="mb-0 text-primary">
                                                                        <i className="bi bi-geo-alt-fill"></i> {post.product.location}
                                                                    </p>
                                                                </div>

                                                                <div className="col-md-3 text-end">
                                                                    <Link href={`/pages/Marketplace/productdetails/${post.product.id}`}>
                                                                        <button className="btn btn-primary rounded-pill px-3 py-2">
                                                                            Product
                                                                        </button>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Video Section */}
                                                {post.video && (
                                                    <div className="w-100 mt-3">
                                                        <video controls className="w-100 rounded">
                                                            <source src={post.video.media_path} type="video/mp4" />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    </div>
                                                )}

                                                {/* Audio Section */}
                                                {post.audio && (
                                                    <div className="w-100 mt-3">
                                                        <audio controls className="w-100">
                                                            <source src={post.audio.media_path} />
                                                            Your browser does not support the audio tag.
                                                        </audio>
                                                    </div>
                                                )}

                                            </div>

                                        </>

                                        :

                                        post.shared_post && <SharedPosts sharedPost={post.shared_post} post={post} posts={posts} setPosts={setPosts} />

                                    }


                                    {post.parent_id !== "0" && !post.shared_post && (
                                        <div className="alert alert-warning" role="alert">
                                            <strong>This content is not available</strong>
                                            <p className="mb-0" style={{ fontSize: "14px" }}>
                                                This content isn't available right now. When this happens, it's usually because the owner
                                                only shared it with a small group of people, changed who can see it, or it's been deleted.
                                            </p>
                                        </div>
                                    )}

                                    <div className="post-card-info">
                                        {/* Reaction Section */}
                                        <div className="post-card-reactions">
                                            <span className="post-card-reaction-count">
                                                {post.reaction ? post.reaction.count || 0 : 0}
                                            </span>
                                            <i className="bi bi-hand-thumbs-up post-card-icon reaction-icon"></i>
                                        </div>

                                        {/* Post Engagement Stats */}
                                        <div className="post-card-stats">
                                            <span className="post-card-stat">
                                                <i className="bi bi-eye post-card-icon"></i>
                                                {post.view_count || 0}
                                            </span>
                                            <span className="post-card-stat">
                                                <i className="bi bi-chat-dots post-card-icon"></i>
                                                {post.comment_count || 0} comments
                                            </span>
                                            <span className="post-card-stat">
                                                <i className="bi bi-share post-card-icon"></i>
                                                {post.share_count || 0} Shares
                                            </span>
                                        </div>
                                    </div>


                                    <hr className="post-divider" />

                                    <div className="post-actions">

                                        <div style={{ position: "relative", display: "inline-block" }}>
                                            <button
                                                className="post-action-btn"
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
                                            className="post-action-btn"
                                            onClick={() => handleCommentToggle(post.id)}
                                        >
                                            <i className="bi bi-chat"></i> Comments
                                        </button>

                                        <div className="post-dropdown">
                                            <button
                                                className="post-action-btn dropdown-toggle"
                                                type="button"
                                                id={`dropdownMenuButton-${post.id}`} // UNIQUE ID
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                <i className="bi bi-share"></i> Share
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

                                    <hr className="post-divider" />


                                    <div className="d-flex mb-3 mt-2">

                                        {userId && post.user_id !== userId && (
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


                                        {userId && post.user_id !== userId && (
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


                                    {post.comments_status === "1" && showComments[post.id] ? (
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


                                </div>
                            </div>
                        ))}

                        <div className="card col-md-12 shadow-lg border-0 rounded-3 mt-2 mb-2">
                            <div className="my-sm-5 py-sm-5 text-center">
                                <i className="display-1 text-secondary bi bi-card-list" />
                                <h5 className="mt-2 mb-3 text-body text-muted fw-bold">No More Posts to Show</h5>
                            </div>
                        </div>

                    </div>

                    <RightNavbar user={user} />

                </div>
            </div>

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
                showEnableDisableCommentsModal && (
                    <EnableDisableCommentsModal
                        showEnableDisableCommentsModal={showEnableDisableCommentsModal}
                        setShowEnableDisableCommentsModal={setShowEnableDisableCommentsModal}
                        postID={postID}
                        posts={posts}
                        setPosts={setPosts}

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
                pollModal &&
                (
                    <PostPollModal
                        pollModal={pollModal}
                        setPollModal={setPollModal}
                        posts={posts}
                        setPosts={setPosts}
                        newsFeed="newsFeed"
                        privacy={privacy}
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
                sharePostTimelineModal && (
                    <SharePostTimelineModal
                        sharePostTimelineModal={sharePostTimelineModal}
                        setShareShowTimelineModal={setShareShowTimelineModal}
                        postID={postID}
                    />
                )
            }

        </>
    );
}
