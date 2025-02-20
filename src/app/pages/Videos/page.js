"use client";

import React, { useEffect, useState } from "react";
import createAPI from "../../lib/axios";
import Link from "next/link";
import Rightnav from "@/app/assets/components/rightnav/page";
import Leftnav from "@/app/assets/components/leftnav/page";
import Image from "next/image";
import Greatjob from "../Modals/GreatJob/GreatJob";
import CupofCoffee from "../Modals/CupOfCoffee/CupofCoffee";
import { toast } from "react-toastify";
import EditPostModal from "../Modals/EditPostModal";
import ReportPostModal from "../Modals/ReportPost";
import EnableDisableCommentsModal from "../Modals/EnableDisableCommentsModal";
import SavePostModal from "../Modals/SaveUnsavePost";
import useConfirmationToast from "../Modals/useConfirmationToast";
import { ReactionBarSelector } from '@charkour/react-reactions';
import SharePostTimelineModal from "../Modals/SharePostTimelineModal";

export default function VideoFeed() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastPostId, setLastPostId] = useState(0);
    const [limit] = useState(5);
    const [page, setPage] = useState(1);
    const [userId, setUserId] = useState(null);
    const [noMorePosts, setNoMorePosts] = useState(false);
    const [showList, setShowList] = useState(false);
    const [commentText, setCommentText] = useState({});
    const [showComments, setShowComments] = useState({});
    const [comments, setComments] = useState({});
    const [userdata, setUserdata] = useState(null);
    const [showReplies, setShowReplies] = useState({});
    const [repliesData, setRepliesData] = useState({});
    const [showReplyInput, setShowReplyInput] = useState({});
    const [commentreplyText, setCommentreplyText] = useState({});
    const [activeCupCoffeeId, setActiveCupCoffeeId] = useState(null);
    const [activeGreatJobId, setActiveGreatJobId] = useState(null);
    const api = createAPI();
    const [showEditPostModal, setShowEditPostModal] = useState(false);
    const [postID, setPostID] = useState("")
    const [showEnableDisableCommentsModal, setShowEnableDisableCommentsModal] = useState(false);
    const [showReportPostModal, setShowReportPostModal] = useState(false);
    const [showSavePostModal, setShowSavePostModal] = useState(false);
    const [postReactions, setPostReactions] = useState({});
    const [activeReactionPost, setActiveReactionPost] = useState(null);
    const [sharePostTimelineModal, setShareShowTimelineModal] = useState(false);

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


    const handlePostDelete = (postId) => {
        showConfirmationToast([postId]);
    };

    const handleDelete = async (values) => {
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
    };

    const { showConfirmationToast } = useConfirmationToast({
        message: 'Are you sure you want to delete this post? This action cannot be undone.',
        onConfirm: handleDelete,
        onCancel: () => toast.dismiss(),
        confirmText: "Confirm",
        cancelText: "Cancel",
    });


    const fetchPosts = async (isInitialLoad = true) => {
        try {
            setLoading(true);

            const response = await api.post("/api/post/newsfeed", {
                limit,
                last_post_id: lastPostId,
                post_type: 2,
            });

            if (response.data && Array.isArray(response.data.data)) {
                const newPosts = response.data.data;

                // If no new posts are returned, mark noMorePosts as true
                if (newPosts.length === 0) {
                    setNoMorePosts(true);
                    return; // Exit early since there are no new posts
                }

                if (newPosts.length > 0) {
                    const lastPost = newPosts[newPosts.length - 1];
                    setLastPostId(lastPost.id);
                }

                // If fewer posts are returned than the limit, there might be no more posts
                if (newPosts.length < limit) {
                    setNoMorePosts(true);
                } else {
                    setNoMorePosts(false); // Reset when new posts are still available
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
        } finally {
            setLoading(false);
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

    return (
        <div>

            <div className="container-fluid bg-light">
                <div className="container mt-3 pt-5">
                    <div className="row">
                        <div className="col-md-3 p-3 rounded">
                            <Rightnav />
                        </div>

                        <div className="col-md-6 p-3">

                            {posts.map((post, index) => (
                                <div
                                    key={`${post.id}-${index}`}
                                    className="card mb-2 shadow-lg border-0 rounded-1"
                                >
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <div className="avatar-container" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Link href="#">
                                                        <Image
                                                            className="avatar-img rounded-circle"
                                                            src={post.user.avatar}
                                                            alt="User Avatar"
                                                            width={50}
                                                            height={50}
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                    </Link>

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
                                                    <small className="text-muted lead-font-size">
                                                        {post.created_human}
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
                                        <hr className="my-2 text-muted post-divider" />

                                        <p> {post.post_text} </p>

                                        <div className="d-flex justify-content-center flex-wrap mb-3">
                                            {post.video && (
                                                <div
                                                    className="media-container mt-1"
                                                    style={{ width: "100%", height: "auto" }}
                                                >
                                                    <video
                                                        controls
                                                        style={{
                                                            objectFit: "cover",
                                                            width: "100%",
                                                            height: "auto",
                                                        }}
                                                    >
                                                        <source
                                                            src={post.video.media_path}
                                                            type="video/mp4"
                                                        />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </div>
                                            )}
                                        </div>

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
                                                                    src={comment.avatar}
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
                                                                                        src={reply.avatar}
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
                                                        src={userdata.data.avatar}
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

                            <div className="d-flex justify-content-center align-items-center">
                                {loading ? (
                                    <div className="d-flex justify-content-center align-items-center" style={{ height: "100px" }}>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : noMorePosts ? (
                                    <div className="card col-md-12 shadow-lg border-0 rounded-3 mt-2 mb-2">
                                        <div className="my-sm-5 py-sm-5 text-center">
                                            <i className="display-1 text-secondary bi bi-card-list" />
                                            <h5 className="mt-2 mb-3 text-body text-muted fw-bold">No More Posts to Show</h5>
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                        </div>
                        <div className="col-md-3 p-3 rounded">
                            <Leftnav />
                        </div>
                    </div>
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
