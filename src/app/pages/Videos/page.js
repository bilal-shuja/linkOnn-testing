"use client";

import React, { useEffect, useState } from "react";
import createAPI from "../../lib/axios";
import Link from "next/link";
import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import Leftnav from "@/app/assets/components/leftnav/page";
import Image from "next/image";
import useAuth from "@/app/lib/useAuth";


export default function VideoFeed() {
    useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastPostId, setLastPostId] = useState(0);
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

    const api = createAPI();

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

                if (newPosts.length > 0) {
                    const lastPost = newPosts[newPosts.length - 1];
                    setLastPostId(lastPost.id);
                }

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
                setError("Invalid data format received from API.");
            }
        } catch (error) {
            setError("An error occurred while fetching data.");
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


    const handleCommentSubmit = async (postId) => {
        const comment = commentText[postId] || "";

        if (!comment || comment.trim() === "") {
            setMessage("Comment cannot be empty.");
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
                setMessage(response.data.message);
                setCommentText((prevText) => ({
                    ...prevText,
                    [postId]: "",
                }));
            } else {
                setMessage(response.data.message || "Failed to add the comment.");
            }
        } catch (error) {
            setMessage("An error occurred while adding the comment.");
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
                setError("An error occurred while fetching comments.");
            }
        }
    };

    const handleCommentDelete = async (comment_id, postId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
        if (confirmDelete) {
            setComments((prevComments) => {
                const updatedComments = prevComments[postId].filter(
                    (comment) => comment.id !== comment_id
                );
                return {
                    ...prevComments,
                    [postId]: updatedComments,
                };
            });

            try {
                const response = await api.post("/api/post/comments/delete", {
                    comment_id,
                });

                if (response.data.code == "200") {
                    alert("Comment deleted.");
                } else {
                    alert(`Error: ${response.data.message}`);
                }
            } catch (error) {
                alert("An error occurred while deleting the comment.");
            }
        } else {
            alert("Comment deletion cancelled.");
        }
    };

    const handleCommentreplyDelete = async (reply_id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this reply?");
        if (confirmDelete) {
            alert("Comment reply deleted.");

            try {
                const response = await api.post("/api/post/comments/delete-reply", {
                    reply_id,
                });

                if (response.data.code == "200") {
                    // Handle success
                } else {
                    alert(`Error: ${response.data.message}`);
                }
            } catch (error) {
                alert("An error occurred while deleting the comment reply.");
            }
        } else {
            alert("Reply deletion cancelled.");
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
                alert(`Error: ${response.data.message}`);
            }
        } catch (error) {
            alert("An error occurred while fetching replies.");
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
                alert("Reply added successfully!");
                setCommentreplyText((prevState) => ({
                    ...prevState,
                    [commentId]: "",
                }));
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (error) {
            alert("An error occurred while adding the reply.");
        }
    };

    const LikeComment = async (commentId, postId) => {
        try {
            const response = await api.post("/api/post/comments/like", {
                comment_id: commentId,
                post_id: postId,
            });
            if (response.data.code == "200") {
                alert(response.data.message);
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (error) {
            alert("Error while reacting to the comment.");
        }
    };

    const commentReplyLike = async (replyId) => {
        try {
            const response = await api.post("/api/post/comments/reply_like", {
                comment_reply_id: replyId,
            });
            if (response.data.code == "200") {
                alert(response.data.message);
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (error) {
            alert("Error while reacting to the comment reply.");
        }
    };

    const LikePost = async (postId) => {
        try {
            const response = await api.post("/api/post/action", {
                post_id: postId,
                action: "reaction",
                reaction_type: 1,
            });

            if (response.data.code == "200") {
                alert(response.data.message);
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (error) {
            alert("Error while reacting to the Post");
        }
    };
    
    const handlePostDelete = async (postId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this post? This action cannot be undone."
        );

        if (confirmDelete) {
            try {
                const response = await api.post("/api/post/action", {
                    post_id: postId,
                    action: "delete",
                });

                if (response.data.code == 200) {
                    setPosts((prevPosts) =>
                        prevPosts.filter((post) => post.id !== postId)
                    );
                    alert("Post successfully deleted");
                } else {
                    alert("Failed to delete the post.");
                }
            } catch (error) {
                alert("An error occurred while deleting the post.");
            }
        } else {
            alert("Cancel");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container-fluid bg-light">
                <div className="container mt-3 pt-5">
                    <div className="row">
                        <div className="col-md-3 p-3 rounded">
                            <Rightnav />
                        </div>

                        <div className="col-md-6 p-3">

                            {posts.length === 0 && !loading && (
                                <p className="text-center">No posts found.</p>
                            )}

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
                                                        {post.user.first_name} {post.user.last_name}
                                                        {post.post_location &&
                                                            post.post_location !== "" && (
                                                                <span className="text-primary">
                                                                    <small className="text-dark"> is in </small>
                                                                    {post.post_location}
                                                                </span>
                                                            )}
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
                                                        <li className=" align-items-center d-flex">
                                                            <Link
                                                                className="text-decoration-none dropdown-item text-secondary"
                                                                href="#"
                                                            >
                                                                <i className="bi bi-bookmark pe-2"></i> Save
                                                                post
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <hr className="dropdown-divider" />
                                                        </li>
                                                        <li className=" align-items-center d-flex">
                                                            <Link
                                                                className="text-decoration-none dropdown-item text-secondary"
                                                                href="#"
                                                            >
                                                                <i className="bi bi-flag pe-2"></i> Report Post
                                                            </Link>
                                                        </li>
                                                        <li className=" align-items-center d-flex">
                                                            <Link
                                                                className="text-decoration-none dropdown-item text-secondary"
                                                                href="#"
                                                            >
                                                                <i className="bi bi-box-arrow-up-right pe-2"></i>
                                                                Open post in new tab
                                                            </Link>
                                                        </li>
                                                        {post.user.id == userdata.data.id && (
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
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="my-2 text-muted" />

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

                                        <div className="d-flex justify-content-between align-items-center mb-2 mt-5 px-3">
                                            <div className="d-flex align-items-center">
                                                <span className="me-2">
                                                    {post.reaction ? post.reaction.count || 0 : 0}
                                                </span>
                                                <i className="bi bi-hand-thumbs-up"></i>
                                            </div>
                                            <div className="d-flex align-items-center text-muted">
                                                <span className="me-3">
                                                    <i className="bi bi-eye me-1"></i>
                                                    {post.view_count || 0}
                                                </span>
                                                <span className="me-3">
                                                    <i className="bi bi-chat-dots me-1"></i>
                                                    {post.comment_count || 0} comments
                                                </span>
                                                <span>
                                                    <i className="bi bi-share me-1"></i>
                                                    {post.share_count || 0} Shares
                                                </span>
                                            </div>
                                        </div>
                                        <hr className="my-1" />

                                        <div className="d-flex justify-content-between">
                                            <button
                                                className="btn border-0 d-flex align-items-center"
                                                onClick={() => LikePost(post.id)}
                                            >
                                                <i className="bi bi-emoji-smile me-2"></i> Reaction
                                            </button>

                                            <button
                                                className="btn border-0 d-flex align-items-center"
                                                onClick={() => handleCommentToggle(post.id)}
                                            >
                                                <i className="bi bi-chat me-2"></i> Comments
                                            </button>

                                            <div className="dropdown">
                                                <button
                                                    className="btn border-0"
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
                                                            href="#"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <i className="bi bi-facebook pe-2"></i> Share on
                                                            Facebook
                                                        </Link>
                                                    </li>

                                                    <li className=" align-items-center d-flex">
                                                        <Link
                                                            className="text-decoration-none dropdown-item text-muted"
                                                            href="#"
                                                        >
                                                            <i className="bi bi-twitter-x pe-2"></i> Share on
                                                            X
                                                        </Link>
                                                    </li>
                                                    <li className=" align-items-center d-flex">
                                                        <Link
                                                            className="text-decoration-none dropdown-item text-muted"
                                                            href="#"
                                                        >
                                                            <i className="bi bi-linkedin pe-2"></i> Share on
                                                            Linkedln
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <hr className="dropdown-divider" />
                                                    </li>
                                                    <li className=" align-items-center d-flex">
                                                        <Link
                                                            className="text-decoration-none dropdown-item text-muted custom-hover"
                                                            href="#"
                                                        >
                                                            <i className="bi bi-bookmark-check pe-2"></i> Post
                                                            on Timeline
                                                        </Link>
                                                    </li>
                                                    <li className=" align-items-center d-flex">
                                                        <Link
                                                            className="text-decoration-none dropdown-item text-muted"
                                                            href="#"
                                                        >
                                                            <i className="bi bi-link pe-2"></i> Copy Post Link
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <hr className="my-1" />

                                        <div className="d-flex mb-3 mt-2">
                                            <button
                                                className="btn me-2 d-flex align-items-center rounded-1"
                                                style={{
                                                    backgroundColor: "#C19A6B",
                                                    borderRadius: "10px",
                                                    color: "#fff",
                                                }}
                                            >
                                                <i className="bi bi-cup-hot me-2"></i>Cup of Coffee
                                            </button>
                                            <button className="btn btn-danger d-flex align-items-center rounded-1">
                                                <i className="bi bi-hand-thumbs-up me-2"></i> Great Job
                                            </button>
                                        </div>

                                        {showComments[post.id] && (
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
                                        )}

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
                                    </div>
                                </div>
                            ))}
                            <div className="d-grid gap-2 col-3 mx-auto mt-4">
                                {noMorePosts ? (
                                    <button className="btn btn-primary" disabled>
                                        No more posts
                                    </button>
                                ) : (
                                    <button className="btn btn-primary" disabled={loading}>
                                        {loading ? "Loading..." : ""}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="col-md-3 p-3 rounded">
                            <Leftnav />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
