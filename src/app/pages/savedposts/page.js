"use client";

import React, { useEffect, useState } from "react";
import createAPI from "../../lib/axios";
import Link from "next/link";
import { ReactionBarSelector } from '@charkour/react-reactions';
import Rightnav from "@/app/assets/components/rightnav/page";
import Leftnav from "@/app/assets/components/leftnav/page";
import Image from "next/image";
import Greatjob from "../Modals/GreatJob/GreatJob";
import CupofCoffee from "../Modals/CupOfCoffee/CupofCoffee";
import { toast } from "react-toastify";
import ReportPostModal from "../Modals/ReportPost";
import SavePostModal from "../Modals/SaveUnsavePost";
import MakeDonationModal from "../Modals/MakeDonationModal";
import UserImagesLayout from "../components/userImagesLayout";
import SharePostTimelineModal from "../Modals/SharePostTimelineModal";
import SharedPosts from "../components/sharedPosts";
import { useRouter } from "next/navigation";
import { useSiteSettings } from "@/context/SiteSettingsContext"

export default function Savedposts() {

    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastPostId, setLastPostId] = useState(0);
    const [userId, setUserId] = useState(null);
    const [limit] = useState(5);
    const [page, setPage] = useState(1);
    const [noMorePosts, setNoMorePosts] = useState(false);
    const [commentText, setCommentText] = useState({});
    const [showComments, setShowComments] = useState({});
    const [comments, setComments] = useState({});
    const [userdata, setUserdata] = useState(null);
    const [showReplies, setShowReplies] = useState({});
    const [repliesData, setRepliesData] = useState({});
    const [showReplyInput, setShowReplyInput] = useState({});
    const [commentreplyText, setCommentreplyText] = useState({});
    const [message, setMessage] = useState("");
    const [showList, setShowList] = useState(false);
    const [activeCupCoffeeId, setActiveCupCoffeeId] = useState(null);
    const [activeGreatJobId, setActiveGreatJobId] = useState(null);
    const [postID, setPostID] = useState("")
    const [showReportPostModal, setShowReportPostModal] = useState(false);
    const [showSavePostModal, setShowSavePostModal] = useState(false);
    const [donationModal, setDonationModal] = useState(false);
    const [donationID, setDonationID] = useState("");
    const [sharePostTimelineModal, setShareShowTimelineModal] = useState(false);
    const api = createAPI();
    const [postReactions, setPostReactions] = useState({});
    const [activeReactionPost, setActiveReactionPost] = useState(null);
    const settings = useSiteSettings()


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

    const fetchPosts = async (isInitialLoad = true) => {
        try {
            const response = await api.get("/api/post/saved");

            if (response.data && Array.isArray(response.data.data)) {
                const newPosts = response.data.data;

                if (newPosts.length < limit) {
                    setNoMorePosts(true);
                }

                setPosts((prevPosts) => {
                    const allPosts = [...prevPosts];
                    newPosts.forEach((newPost) => {
                        if (!allPosts.some((post) => post.id === newPost.id)) {
                            allPosts.push(newPost);
                        }
                    });
                    return allPosts;
                });

                if (isInitialLoad) setPage(1);
            } else {
                toast.error("Invalid data format received from API.");
            }
        } catch (error) {
            toast.error("An error occurred while fetching data.");
        }
    };


    const handleScroll = () => {
        if (loading || noMorePosts) return;

        const scrollPosition =
            document.documentElement.scrollTop + window.innerHeight;
        const bottomPosition = document.documentElement.scrollHeight;

        if (scrollPosition >= bottomPosition - 100) {
            setPage((prevPage) => prevPage + 1);
            fetchPosts(false);
        }
    };

    useEffect(() => {
        fetchPosts();
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [page]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUserId = localStorage.getItem("userid");
            setUserId(storedUserId);
        }
    }, []);


    const handleCommentSubmit = async (postId) => {
        const comment = commentText[postId] || "";

        if (!comment || comment.trim() === "") {
            toast.error("Comment cannot be empty.");
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
                toast.error(response.data.message || "Failed to add the comment.");
            }
        } catch (error) {
            toast.error("An error occurred while adding the comment.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const data = localStorage.getItem("userdata");
        if (data) {
            setUserdata(JSON.parse(data));
        }
    }, []);

    if (!userdata) {
        return null;
    }

    const handleCommentToggle = async (postId) => {
        setShowList(!showList);

        setShowComments((prevState) => ({
            ...prevState,
            [postId]: !prevState[postId],
        }));

        if (!comments[postId]) {
            try {
                const response = await api.get(
                    `/api/post/comments/getcomment?post_id=${postId}`
                );

                if (response.data.data && Array.isArray(response.data.data)) {
                    setComments((prevComments) => ({
                        ...prevComments,
                        [postId]: response.data.data,
                    }));
                }
            } catch (error) {
                toast.error("An error occurred while fetching comments.");
            }
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

    const handleCommentTextChange = (e, postId) => {
        setCommentText((prevText) => ({
            ...prevText,
            [postId]: e.target.value,
        }));
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
                toast.error(`Error: ${response.data.message}`);
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
                toast.error(`Error: ${response.data.message}`);
            }
        } catch (error) {
            toast.error("An error occurred while adding the reply.");
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
                toast.error(`Error: ${response.data.message}`);
            }
        } catch (error) {
            toast.error("Error while reacting to the comment.");
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
                toast.error(`Error: ${response.data.message}`);
            }
        } catch (error) {
            toast.error("Error while reacting to the comment reply.");
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

    const getDisplayColor = (code) => {
        return colorMap[code] || code;
    };

    if (!settings) return null

    return (
        <div>

            <div className="container-fluid bg-light">
                <div className="container mt-3 pt-5">
                    <div className="row">
                        <div className="col-md-3 p-3 rounded">
                            <Rightnav />
                        </div>

                        <div className="col-md-6 p-3">

                            {/* {posts.length === 0 && !loading && (
                                <p className="text-center">No posts found.</p>
                            )} */}

                            {error && <p className="text-center text-danger">{error}</p>}

                            {posts.map((post, index) => (
                                <div
                                    key={`${post.id}-${index}`}
                                    className="card mb-4 shadow-lg border-0 rounded-1"
                                >
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">

                                                <div className="avatar-container" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>

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
                                                                onClick={() => router.push(`/pages/UserProfile/timeline/${post.user.id}`)}
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
                                                                onClick={() => router.push(`/pages/page/myPageTimeline/${post.group_id}`)}
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
                                                                <button className="text-decoration-none dropdown-item text-secondary"
                                                                    onClick={() => {
                                                                        setShowSavePostModal(true)
                                                                        setPostID(post.id)

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
                                                                                {userId === post.user_id ? "Edit Product" : "Buy Product"}
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
                                                    This content is not available right now. When this happens, it is usually because the owner
                                                    only shared it with a small group of people, changed who can see it, or it is been deleted.
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
                                                    id={`dropdownMenuButton-${post.id}`}
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

                                        {showComments[post.id] && (
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
                                        )}

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
                        <div className="col-md-3 p-3 rounded">
                            <Leftnav />
                        </div>
                    </div>
                </div>
            </div>

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
                        saveFeed="saveFeed"
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
                sharePostTimelineModal && (
                    <SharePostTimelineModal
                        sharePostTimelineModal={sharePostTimelineModal}
                        setShareShowTimelineModal={setShareShowTimelineModal}
                        postID={postID}
                    />
                )
            }

        </div>
    );
}
