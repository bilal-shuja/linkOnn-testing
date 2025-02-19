"use client";

import React from "react";
import createAPI from "../../lib/axios";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Rightnav from "@/app/assets/components/rightnav/page";
import Leftnav from "@/app/assets/components/leftnav/page";
import { useRouter } from "next/navigation";
import Storycreate from "@/app/pages/storydata/createstory/page";
import EmojiPicker from 'emoji-picker-react';
import Image from "next/image";
import { toast } from "react-toastify";
import Greatjob from "../Modals/GreatJob/GreatJob";
import CupofCoffee from "../Modals/CupOfCoffee/CupofCoffee";
import styles from './css/page.module.css'
import EditPostModal from "../Modals/EditPostModal";
import ReportPostModal from "../Modals/ReportPost";
import EnableDisableCommentsModal from "../Modals/EnableDisableCommentsModal";
import SavePostModal from "../Modals/SaveUnsavePost";
import useConfirmationToast from "../Modals/useConfirmationToast";
import MakeDonationModal from "../Modals/MakeDonationModal";
import UserImagesLayout from "../components/userImagesLayout";
import FundingModal from "../Modals/FundingModal";
import PostPollModal from "../Modals/PostPollModal";
import SharePostTimelineModal from "../Modals/SharePostTimelineModal";
import Spinner from 'react-bootstrap/Spinner';
import SharedPosts from "../components/sharedPosts";

export default function Newsfeed() {

  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadPloading, setUploadPLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastPostId, setLastPostId] = useState(0);
  const [limit] = useState(5);
  const [noMorePosts, setNoMorePosts] = useState(false);
  const [page, setPage] = useState(1);
  const [userId, setUserId] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [comments, setComments] = useState({});
  const [showList, setShowList] = useState(false);
  const [userdata, setUserdata] = useState(null);
  const [privacy, setPrivacy] = useState(0);
  const [postText, setPostText] = useState("");
  const [locationText, setlocationText] = useState("");
  const [images, setImages] = useState([]);
  const [video, setvideo] = useState([]);
  const [audio, setaudio] = useState([]);
  const [success, setSuccess] = useState("");
  const [dropdownSelection, setDropdownSelection] = useState("PUBLIC");
  const [showLocation, setShowLocation] = useState(false);
  const [showaudio, setShowaudio] = useState(false);
  const [showvideo, setShowvideo] = useState(false);
  const [showimg, setShowimg] = useState(false);
  const [showReplies, setShowReplies] = useState({});
  const [repliesData, setRepliesData] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [commentreplyText, setCommentreplyText] = useState({});
  const [stories, setStories] = useState([]);
  const [showCarousel, setShowCarousel] = useState(false);
  const [currentUserStories, setCurrentUserStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeCupCoffeeId, setActiveCupCoffeeId] = useState(null);
  const [activeGreatJobId, setActiveGreatJobId] = useState(null);
  const [isOpenColorPalette, setIsOpenColorPalette] = useState(false);
  const [color, setColor] = useState("");
  const api = createAPI();
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


  const fileImageRef = useRef(null);

  const fileVideoRef = useRef(null);

  const fileAudioRef = useRef(null);


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
    const fetchStories = async () => {
      try {
        setLoading(true);
        const response = await api.post("/api/story/get-stories");

        if (response.data.code === "200") {
          const allStories = response.data.data.flatMap((user) =>
            user.stories.map((story) => ({
              id: story.id,
              username: user.username,
              avatar: user.avatar,
              userName: `${user.first_name} ${user.last_name}`,
              media: story.media,
              description: story.description,
              userProfileImage: user.avatar,
            }))
          );
          setStories(allStories);
          setError("");
        } else {
          setError("Failed to load stories");
          toast.error("Failed to load stories")
        }
      } catch (err) {
        toast.error("Error fetching stories. Please try again later.")
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  useEffect(() => {
    const data = localStorage.getItem("userdata");
    if (data) {
      setUserdata(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userid");
      setUserId(storedUserId);
    }
  }, []);

  if (!userdata) {
    return;
  }

  const openStoryCarousel = (userStories, startIndex = 0) => {
    setCurrentUserStories(userStories);
    setCurrentIndex(startIndex);
    setShowCarousel(true);
  };

  const closeCarousel = () => setShowCarousel(false);

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

  const handleLocationTextChange = (e) => { setlocationText(e.target.value) };

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
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error while reacting to the comment reply");
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
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error while reacting to the Post");
    }
  };


  const handleEmojiButtonClick = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiSelect = (emoji) => {
    setPostText((prevText) => prevText + emoji.emoji);
    setShowEmojiPicker(false);
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


  const gradientMap = {
    'linear-gradient(45deg, #ff0047 0%, #2c34c7 100%)': '_2j79',
    'linear-gradient(45deg, #fc36fd 0%, #5d3fda 100%)': '_2j80',
    'linear-gradient(45deg, #5d6374 0%, #16181d 100%)': '_2j81'
  };

  const reverseGradientMap = {
    '_2j79': 'linear-gradient(45deg, #ff0047 0%, #2c34c7 100%)',
    '_2j80': 'linear-gradient(45deg, #fc36fd 0%, #5d3fda 100%)',
    '_2j81': 'linear-gradient(45deg, #5d6374 0%, #16181d 100%)'
  };


  const handleColorSelect = (colorValue) => {
    if (colorValue.includes('gradient')) {
      const shortCode = gradientMap[colorValue] || encodeURIComponent(colorValue);
      setColor(shortCode);
    } else {
      setColor(colorValue);
    }
  };

  const getDisplayColor = (color) => {
    if (color?.startsWith('_')) {
      return reverseGradientMap[color] || color;
    }
    return color;
  };

  return (
    <div>
      <div className="container-fluid bg-light">
        <div className="container mt-3 pt-5">
          <div className="row">
            <div className="col-md-3 rounded">
              <Rightnav />
            </div>

            <div className="col-md-6 p-3">
              <div id="stories"></div>

              <div className="d-flex gap-2 mb-n3">
                <div>
                  <Storycreate />
                </div>

                <div className="container-fluid">

                  <div className="carousel">
                    <div
                      className="d-flex flex-nowrap overflow-auto"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {stories
                        .reduce((acc, story) => {
                          if (
                            !acc.some(
                              (existing) => existing.username === story.username
                            )
                          ) {
                            acc.push(story);
                          }
                          return acc;
                        }, [])
                        .map((story, index) => (
                          <div
                            key={story.id}
                            className="text-center mb-3 mx-2"
                            style={{ width: "9rem", flexShrink: 0 }}
                            onClick={() =>
                              openStoryCarousel(
                                stories.filter(
                                  (s) => s.username === story.username
                                ),
                                index
                              )
                            }
                          >
                            <div className="position-relative">
                              <div
                                className="rounded-circle border border-3 border-light position-absolute"
                                style={{
                                  top: "0.5rem",
                                  left: "0.5rem",
                                  width: "3rem",
                                  height: "3rem",
                                  backgroundImage: `url(${story.userProfileImage})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                                }}
                              ></div>

                              <div
                                className="position-absolute"
                                style={{
                                  bottom: "0.5rem",
                                  left: "0.5rem",
                                }}
                              >
                                <p className="mb-0 text-white fw-bold">
                                  {story.userName}
                                </p>
                              </div>

                              <div className="story-img-container">
                                {story.media.endsWith(".mp4") ? (
                                  <video
                                    className="card-img-top rounded-3"
                                    style={{
                                      height: "12rem",
                                      width: "9rem",
                                      objectFit: "cover",
                                      borderRadius: "10px",
                                    }}
                                    controls={false}
                                    onClick={(e) => {
                                      const video = e.target;
                                      if (video.paused) {
                                        video.play();
                                      } else {
                                        video.pause();
                                      }
                                    }}
                                  >
                                    <source
                                      src={story.media}
                                      type="video/mp4"
                                    />
                                  </video>
                                ) : (
                                  <Image
                                    src={story.media}
                                    className="card-img-top rounded-3"
                                    alt="Story Background"
                                    width={144}
                                    height={192}
                                    style={{
                                      objectFit: "cover",
                                      borderRadius: "10px",
                                    }}
                                  />

                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {showCarousel && (
                    <div
                      className="fullscreen-carousel"
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1050,
                        background: "rgba(0, 0, 0, 0.8)",
                      }}
                    >
                      <div
                        className="container"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          marginTop: "2rem",
                        }}
                      >
                        <div
                          id="storyCarousel"
                          className="carousel slide"
                          data-bs-ride="carousel"
                        >
                          <div className="carousel-inner">
                            {currentUserStories.map((story, index) => (
                              <div
                                key={story.id}
                                className={`carousel-item ${currentIndex === index ? "active" : ""
                                  }`}
                              >
                                <div className="position-relative">
                                  <div
                                    className="rounded-circle border border-3 border-light position-absolute"
                                    style={{
                                      bottom: "1rem",
                                      left: "50%",
                                      transform: "translateX(-50%)",
                                      width: "5rem",
                                      height: "5rem",
                                      backgroundImage: `url(${story.userProfileImage})`,
                                      backgroundSize: "cover",
                                      backgroundPosition: "center",
                                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                                    }}
                                  ></div>


                                  <div className="story-img-container">
                                    {story.media.endsWith(".mp4") ? (
                                      <video
                                        className="d-block w-100"
                                        style={{
                                          height: "80rem",
                                          objectFit: "cover",
                                        }}
                                        controls={false}
                                      >
                                        <source
                                          src={story.media}
                                          type="video/mp4"
                                        />
                                      </video>
                                    ) : (
                                      <Image
                                        src={story.media}
                                        className="d-block"
                                        alt="Story Background"
                                        width={1200}
                                        height={1280}
                                        style={{
                                          objectFit: "cover",
                                        }}
                                      />

                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target="#storyCarousel"
                            data-bs-slide="prev"
                            onClick={() =>
                              setCurrentIndex(
                                currentIndex === 0
                                  ? currentUserStories.length - 1
                                  : currentIndex - 1
                              )
                            }
                          >
                            <span
                              className="carousel-control-prev-icon"
                              aria-hidden="true"
                            ></span>
                            <span className="visually-hidden">Previous</span>
                          </button>
                          <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target="#storyCarousel"
                            data-bs-slide="next"
                            onClick={() =>
                              setCurrentIndex(
                                currentIndex === currentUserStories.length - 1
                                  ? 0
                                  : currentIndex + 1
                              )
                            }
                          >
                            <span
                              className="carousel-control-next-icon"
                              aria-hidden="true"
                            ></span>
                            <span className="visually-hidden">Next</span>
                          </button>
                        </div>

                        <button
                          className="btn btn-light position-absolute"
                          style={{ top: "1rem", right: "1rem", zIndex: 1100 }}
                          onClick={closeCarousel}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="card mb-3 shadow-lg border-0 mt-3">
                {error && <p className="text-center text-danger">{error}</p>}

                {success && (
                  <div className="alert alert-success mt-2">{success}</div>
                )}

                <div className="card-body">
                  <div className="d-flex align-items-center mb-4">
                    <Image
                      src={userdata.data.avatar}
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

                    <button type="button" id="emoji-button" onClick={handleEmojiButtonClick} className="p-1 btn btn-light position-absolute trigger" style={{ right: "25px", top: "100px" }}>😊</button>

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

                        {/* Solid Colors */}
                        {['#FFFFFF', '#c600ff', '#000000', '#C70039', '#900C3F', '#581845', '#FF5733', '#00a859', '#0098da'].map((solidColor) => (
                          <div
                            key={solidColor}
                            className={styles.colorOption}
                            style={{ background: solidColor }}
                            onClick={() => handleColorSelect(solidColor)}
                          />
                        ))}

                        {/* Gradient Colors */}
                        {Object.keys(gradientMap).map((gradient) => (
                          <div
                            key={gradient}
                            className={styles.colorOption}
                            style={{ background: gradient }}
                            onClick={() => handleColorSelect(gradient)}
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

              {error && <p className="text-center text-danger">{error}</p>}

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
                        <div className="card-body inner-bg-post d-flex justify-content-center flex-wrap mb-1"
                          style={{
                            background: post?.bg_color?.startsWith('_') ? reverseGradientMap[post.bg_color] : post.bg_color,
                            padding: "160px 27px"
                          }}
                        >
                          <span className="text-dark fw-bold" style={{ fontSize: "1.5rem" }}>  {post.post_text} </span>
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
                                src={post.donation.image}
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
                                src={post.event.cover}
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
                                  src={post.product.images[0].image}
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

                                  {/* Edit Product Button */}
                                  <div className="col-md-3 text-end">
                                    <Link href="#">
                                      <button className="btn btn-primary rounded-pill px-3 py-2">
                                        Edit Product
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
                      <button
                        className="post-action-btn"
                        onClick={() => LikePost(post.id)}
                      >
                        <i className="bi bi-emoji-smile"></i> Reaction
                      </button>

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



              <div className="d-flex justify-content-center align-items-center mt-4">
                {!noMorePosts ? (
                  loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "100px" }}>
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="card col-md-12 shadow-lg border-0 rounded-3 mt-2 mb-2">
                      <div className="my-sm-5 py-sm-5 text-center">
                        <i className="display-1 text-secondary bi bi-card-list" />
                        <h5 className="mt-2 mb-3 text-body text-muted fw-bold">No More Posts to Show</h5>
                      </div>
                    </div>
                  )
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

    </div>

  );
}
