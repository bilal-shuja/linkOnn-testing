
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";

import React, { useState, useEffect } from "react";
import EditPostModal from "../Modal/EditPostModal";
import MakeDonationModal from "../Modal/MakeDonationModal";
import { ReactionBarSelector } from '@charkour/react-reactions';
import EnableDisableCommentsModal from "../Modal/EnableDisableCommentsModal";
import PageImagesLayout from "../myPageTimeline/[myPageTimeline]/pageImagesLayout";

export default function sharedPosts({ sharedPost, userdata, post, posts, setPosts, myPageTimeline }) {
    if (!sharedPost) return null;
    const userID = localStorage.getItem('userid');
    const api = createAPI();


    const [postID, setPostID] = useState('');
    const [comments, setComments] = useState({});
    const [showComments, setShowComments] = useState({});

    const [showList, setShowList] = useState(false);
    const [commentText, setCommentText] = useState({});
    const [commentreplyText, setCommentreplyText] = useState({});
    const [showReplies, setShowReplies] = useState({});
    const [showReplyInput, setShowReplyInput] = useState({});
    const [repliesData, setRepliesData] = useState({});
    const [loading, setLoading] = useState(false);

    const [pageTimelineData, setPageTimelineData] = useState('');

    const [postReactions, setPostReactions] = useState({});
    const [activeReactionPost, setActiveReactionPost] = useState(null);

    const [donationModal, setDonationModal] = useState(false);
    const [donationID, setDonationID] = useState("");

    // const [showEnableDisableCommentsModal, setShowEnableDisableCommentsModal] = useState(false);
    // const [showEditPostModal, setShowEditPostModal] = useState(false);
    // const [sharePostTimelineModal, setShareShowTimelineModal] = useState(false);


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
        localStorage.setItem("postReactions", JSON.stringify(updatedReactions));
    };



    useEffect(() => {
        const storedReactions = JSON.parse(localStorage.getItem("postReactions")) || {};
        setPostReactions(storedReactions);
    }, []);


    const reverseGradientMap = {
        '_2j79': 'linear-gradient(45deg, #ff0047 0%, #2c34c7 100%)',
        '_2j80': 'linear-gradient(45deg, #fc36fd 0%, #5d3fda 100%)',
        '_2j81': 'linear-gradient(45deg, #5d6374 0%, #16181d 100%)'
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

                // toast.success(response.data.message);
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
                return error;
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


    const handleCopy = (link) => {
        navigator.clipboard.writeText(link);
        toast.success("Link copied successfully!");
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



    return (
        <>



                    <div className="card shadow-sm border rounded-1 my-2">
                                            
    
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">

                                    <div className="avatar-container" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                        onClick={() => handleClick(post.user.id)} >

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
                                                style={{ cursor: 'pointer' }}
                                            // onClick={() => handleClick(post.user.id)}
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
                                                )} <i className="bi bi-arrow-right"></i> {pageTimelineData?.page_title}
                                            </span>


                                        </h6>
                                        {/* <small className="text-secondary">
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
                                        </small> */}
                                    </div>
                                </div>


                            </div>
                            {/* <hr className="my-2 text-muted" /> */}
                            {
                                sharedPost.bg_color && (
                                    <div className="card-body inner-bg-post d-flex justify-content-center flex-wrap mb-1"
                                        style={{
                                            background: sharedPost?.bg_color?.startsWith('_') ? reverseGradientMap[sharedPost.bg_color] : sharedPost.bg_color,
                                            padding: "160px 27px"
                                        }}
                                    >
                                        <span className="text-dark fw-bold" style={{ fontSize: "1.5rem" }}>   {sharedPost.post_text} </span>
                                    </div>
                                )
                            }
                            {sharedPost?.post_type !== "donation" && !sharedPost.bg_color && (
                                <span
                                    dangerouslySetInnerHTML={{ __html: sharedPost.post_text }}
                                />
                            )}


                            {/* {post.post_text && sharedPost?.post_type !== "donation" && !sharedPost.bg_color && (
                                    <p className="mb-2">{sharedPost.post_text}</p>
                                )} */}

                            <PageImagesLayout key={sharedPost.id} post={sharedPost} />

                            {sharedPost.video && (
                                <div className="media-container mt-2">
                                    <video controls width="100%" style={{ borderRadius: "5px" }}>
                                        <source src={sharedPost.video.media_path} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}

                            {sharedPost.audio && (
                                <div className="media-container mt-2">
                                    <audio controls className="w-100">
                                        <source src={sharedPost.audio.media_path} />
                                        Your browser does not support the audio tag.
                                    </audio>
                                </div>
                            )}

                            {sharedPost.poll && (
                                <div className="poll-section mt-2">
                                    <h6 className="fw-bold">Poll</h6>
                                    <ul className="list-unstyled">
                                        {sharedPost.poll.poll_options.map((option) => {
                                            const totalVotes = sharedPost.poll.poll_total_votes || 0;
                                            const percentage = totalVotes > 0 ? Math.round((option.no_of_votes / totalVotes) * 100) : 0;
                                            return (
                                                <li key={option.id} className="mb-2">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div className="progress flex-grow-1" style={{ height: "30px", cursor: "pointer" }}>
                                                            <div className="progress-bar" role="progressbar" style={{ width: `${percentage}%`, backgroundColor: "#66b3ff" }}>
                                                                <span className="progress-text w-100 text-secondary fs-6 fw-bold">
                                                                    {option.option_text}
                                                                </span>
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

                            {sharedPost?.donation && (
                                <div>
                                    <Image
                                        src={sharedPost?.donation?.image}
                                        alt={sharedPost.donation.title}
                                        className="img-fluid d-block mx-auto"
                                        width={400}
                                        height={200}
                                        style={{
                                            objectFit: "cover",
                                        }}
                                        loader={({ src }) => src}
                                    />

                                    <div className="card-body text-center">
                                        <h5 className="card-title">
                                            {sharedPost.donation.title}
                                        </h5>
                                        <p className="card-text">
                                            {sharedPost.donation.description}
                                        </p>
                                        <div className="progress mb-3">
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{
                                                    width: `${(sharedPost.donation.collected_amount /
                                                        sharedPost.donation.amount) *
                                                        100
                                                        }%`,
                                                }}
                                                aria-valuenow={sharedPost.donation.collected_amount}
                                                aria-valuemin="0"
                                                aria-valuemax={sharedPost.donation.amount}
                                            ></div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <p className="text-muted">
                                                {sharedPost.donation.collected_amount} Collected
                                            </p>
                                            <p className="text-dark"> Required: <span className="fw-bold"> {sharedPost.donation.amount} </span> </p>
                                            {
                                                sharedPost.donation.collected_amount < sharedPost.donation.amount &&
                                                (
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => {
                                                            setDonationModal(!donationModal)

                                                            setDonationID(sharedPost.donation.id)
                                                        }}
                                                    >
                                                        Donate
                                                    </button>
                                                )

                                            }

                                        </div>
                                    </div>
                                </div>
                            )}


                        </div>
                    </div>


                     {/*  shared post till here*/}




            {/* {
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

                showEditPostModal && (
                    <EditPostModal
                        showEditPostModal={showEditPostModal}
                        setShowEditPostModal={setShowEditPostModal}
                        posts={posts}
                        setPosts={setPosts}
                        postID={postID}
                    />
                )
            } */}




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

        </>
    )
}
