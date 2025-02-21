"use client"
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import EditPostModal from "../../Modal/EditPostModal";
import { useState, useEffect, useCallback } from "react";
import MakeDonationModal from "../../Modal/MakeDonationModal";
import Rightnav from "@/app/assets/components/rightnav/page";
import { ReactionBarSelector } from '@charkour/react-reactions';
import SavePostModal from "@/app/pages/Modals/SaveUnsavePost";
import ReportPostModal from "@/app/pages/Modals/ReportPost";
import useConfirmationToast from "@/app/pages/Modals/useConfirmationToast";
import SharePostTimelineModal from "@/app/pages/Modals/SharePostTimelineModal";
import EnableDisableCommentsModal from '../../Modal/EnableDisableCommentsModal';
// import PageImagesLayout from "../../myPageTimeline/[myPageTimeline]/pageImagesLayout";
import SharedPosts from "../../components/sharedPosts";
import UserImagesLayout from "@/app/pages/components/userImagesLayout";
import CupofCoffee from "@/app/pages/Modals/CupOfCoffee/CupofCoffee";
import Greatjob from "@/app/pages/Modals/GreatJob/GreatJob";
import { useRouter } from "next/navigation";


export default function OpenPostInNewTab({ params }) {
    const api = createAPI();
    const router = useRouter();

    const { openPostInNewTab } = use(params)
    const userID = localStorage.getItem('userid');
    const [userdata, setUserData] = useState(null);
    const [postID, setPostID] = useState('');


    const [pageTimelineData, setPageTimelineData] = useState(null);
    const [donationModal, setDonationModal] = useState(false);
    const [donationID, setDonationID] = useState("");

    const [loading, setLoading] = useState(false);
    const [noMorePosts, setNoMorePosts] = useState(false);
    const [page, setPage] = useState(1);

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

    const [showEnableDisableCommentsModal, setShowEnableDisableCommentsModal] = useState(false);
    const [showEditPostModal, setShowEditPostModal] = useState(false);

    const [showSavePostModal, setShowSavePostModal] = useState(false);
    const [showReportPostModal, setShowReportPostModal] = useState(false);


    const [activeCupCoffeeId, setActiveCupCoffeeId] = useState(null);
    const [activeGreatJobId, setActiveGreatJobId] = useState(null);

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


    // localStorage.setItem("postReactions", JSON.stringify(updatedReactions));

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

    const openModalCupCoffee = (id) => {
        setActiveCupCoffeeId(id);
        setActiveGreatJobId(null);
    };
    const closeModalCupCoffee = () => {
        setActiveCupCoffeeId(null);
    };

    const openModalGreatJob = (id) => {
        setActiveGreatJobId(id);
        setActiveCupCoffeeId(null); // Ensure other modal closes
    };
    const closeModalGreatJob = () => {
        setActiveGreatJobId(null);
    };



    const fetchPosts = async (isInitialLoad = true, limit = 10) => {
        if (loading || noMorePosts) return;

        try {
            setLoading(true);

            const response = await api.post("/api/post/newsfeed", {
                limit,
                post_id: openPostInNewTab,
            });

            if (response.data && Array.isArray(response.data.data)) {
                const newPosts = response.data.data;

                // if (newPosts.length > 0) {
                //     const lastPost = newPosts[newPosts.length - 1];
                //     setLastPostId(lastPost.id);
                // }

                // if (newPosts.length < limit) {
                //     setNoMorePosts(true);
                // }

                setPosts((prevPosts) => [...prevPosts, ...newPosts.filter((post) => !prevPosts.some((p) => p.id === post.id))]);
                setPosts(newPosts)


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


                // if (isInitialLoad) setPage(1);
            }
            //  else {
            //     toast.error("Invalid data format received from API.");
            // }
        } catch (error) {
            toast.error("An error occurred while fetching newsfeed data.");
        } finally {
            setLoading(false);
        }
    }




    useEffect(() => {
        fetchPosts();
        const _pageData = localStorage.getItem('_pageData');
        setPageTimelineData(JSON.parse(_pageData));

        const storedReactions = JSON.parse(localStorage.getItem("postReactions")) || {};
        setPostReactions(storedReactions);


        const _userData = localStorage.getItem("userdata");
        if (_userData) {
            setUserData(JSON.parse(_userData));
        }



    }, []);


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
                return error
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


    return (
        <>
            <div className="container-fluid bg-light">
                <div className="container mt-3 pt-5">
                    <div className="row">
                        <div className="col-md-3 p-3">
                            <Rightnav />
                        </div>

                        <div className="col-md-9 p-3 mt-2">


                            {posts?.map((post, index) => {



                                return (

                                    <div key={`${post.id}-${index}`} className="card shadow-lg border-0 rounded-1 mb-2">
                                        <div className="card-body" >

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
                                                                onMouseEnter={(e) => e.target.style.color = 'blue'}
                                                                onMouseLeave={(e) => e.target.style.color = 'inherit'}
                                                                onClick={() => router.push(`/pages/UserProfile/timeline/${post.user.id}`)}
                                                            >
                                                                {post?.user.first_name} {post?.user.last_name}  {post?.post_location && post.post_location !== "" && (
                                                                    <span className="text-primary ms-1">
                                                                        <small className="text-dark"> is in </small>
                                                                        {/* {post.post_location} */}
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
                                                            userID && post?.user?.id === userID ?
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
                                                                    <li>
                                                                    </li><li className=" align-items-center d-flex">
                                                                        <button
                                                                            className="text-decoration-none dropdown-item text-secondary"
                                                                            onClick={() => {
                                                                                setShowEditPostModal(true)
                                                                                setPostID({ id: post.id, post_text: post.post_text })

                                                                            }}
                                                                        >
                                                                            <i className="bi bi-pencil-fill"></i> Edit Post
                                                                        </button>
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




                                                        {post?.user?.id == userID && (
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
                                                                href={`/pages/page/openPostInNewTab/${post.id}`}
                                                                target="_blank" rel="noopener noreferrer"
                                                            >
                                                                <i className="bi bi-box-arrow-up-right pe-2"></i>
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
                                                            This content isn't available right now. When this happens, it's usually because the owner
                                                            only shared it with a small group of people, changed who can see it, or it's been deleted.
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


                                                    {
                                                        post?.images && post?.images.length > 0 && (
                                                            <UserImagesLayout key={`${post.id}-${index}`} post={post} />
                                                        )
                                                    }




                                                    {post.poll && post.poll.poll_options && (
                                                        <div className="d-flex justify-content-center flex-wrap mb-1">

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

                                                        </div>
                                                    )}

                                                    {post?.donation && (
                                                        <div>
                                                            <Image
                                                                src={post?.donation?.image}
                                                                alt={post.donation.title}
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
                                                                    {
                                                                        post.donation.collected_amount < post.donation.amount &&
                                                                        (
                                                                            <button
                                                                                className="btn btn-primary btn-sm"
                                                                                onClick={() => {
                                                                                    setDonationModal(!donationModal)

                                                                                    setDonationID(post.donation.id)
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



                                                    {
                                                        post.event && post.event.cover && (
                                                            <div>
                                                                <Image
                                                                    src={post.event.cover}
                                                                    alt="Event Cover"
                                                                    className="img-fluid mt-1"
                                                                    width={500}
                                                                    height={300}
                                                                    style={{
                                                                        objectFit: "cover",
                                                                    }}
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
                                                                src={post.product.images[0].image}
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
                                                                    <Link href="#" >
                                                                        <button className="btn btn-primary-hover btn-outline-primary rounded-pill">Edit Product</button>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {post?.video && (
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

                                                    {/*  shared post till here*/}

                                                </>


                                                :

                                                post.shared_post && <SharedPosts sharedPost={post.shared_post} userdata={userdata} post={post} posts={posts} setPosts={setPosts}  />

                                            }



                                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-2 mt-2 px-3">
                                                <div className="d-flex align-items-center mb-2 mb-md-0">
                                                    <span className="me-2">
                                                        {post.reaction ? post.reaction.count || 0 : 0}
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
                                                        className="btn border-0 d-flex align-items-center"
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


                                            {
                                                userID && post?.user?.id === userID ?
                                                    null
                                                    :

                                                    <div className="d-flex mb-3 mt-2">
                                                        <button
                                                            className="btn me-2 d-flex align-items-center rounded-1"
                                                            style={{
                                                                backgroundColor: "#C19A6B",
                                                                borderRadius: "10px",
                                                                color: "#fff",
                                                            }}
                                                            onClick={() => openModalCupCoffee(post.id)}
                                                        >
                                                            <i className="bi bi-cup-hot me-2"></i>Cup of Coffee
                                                        </button>

                                                        {activeCupCoffeeId === post.id && (
                                                            <CupofCoffee postId={post.id} handleClose={closeModalCupCoffee} />
                                                        )}

                                                        <button className="btn btn-danger d-flex align-items-center rounded-1"
                                                            onClick={() => openModalGreatJob(post.id)}
                                                        >
                                                            <i className="bi bi-hand-thumbs-up me-2"></i> Great Job
                                                        </button>
                                                        {activeGreatJobId === post.id && (
                                                            <Greatjob postId={post.id} handleClose={closeModalGreatJob} />
                                                        )}
                                                    </div>

                                            }



                                            {


                                                post.comments_status === "1" && showComments[post.id] ? (
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


                                )


                            }

                            )}



                        </div>


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




                    </div>
                </div>
            </div>
        </>
    )
}
