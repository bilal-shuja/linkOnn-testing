"use client";

import React from "react";
import createAPI from "../../lib/axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import Leftnav from "@/app/assets/components/leftnav/page";
 
import("bootstrap/dist/js/bootstrap.bundle.min.js");
import { useRouter } from "next/navigation";
import Storycreate from "@/app/assets/components/createstory/page";
import EmojiPicker from 'emoji-picker-react';
import Image from "next/image";
import useAuth from "@/app/lib/useAuth";

export default function Newsfeed() {
  useAuth();
  const router = useRouter();
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
  const [showList, setShowList] = useState(false);
  const [userdata, setUserdata] = useState(null);
  const [privacy, setPrivacy] = useState(0);
  const [postText, setPostText] = useState("");
  const [pollText, setPollText] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [locationText, setlocationText] = useState("");
  const [images, setImages] = useState([]);
  const [donationImage, setDonationImage] = useState([]);
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
  const [donationTitle, setDonationTitle] = useState("");
  const [donate, setDonate] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [donationDescription, setDonationDescription] = useState("");
  const [stories, setStories] = useState([]);
  const [showCarousel, setShowCarousel] = useState(false);
  const [currentUserStories, setCurrentUserStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const api = createAPI();

  const fetchPosts = async (isInitialLoad = true) => {
    try {
      setLoading(true);

      const response = await api.post("/api/post/newsfeed", {
        limit,
        last_post_id: lastPostId,
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
        }
      } catch (err) {
        console.error("Error fetching stories:", err);
        setError("Error fetching stories. Please try again later.");
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
      alertify.error("Comment cannot be empty.");
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
        alertify.success(response.data.message);
        setCommentText((prevText) => ({
          ...prevText,
          [postId]: "",
        }));
      } else {
        alertify.error(response.data.message || "Failed to add the comment.");
      }
    } catch (error) {
      alertify.error("An error occurred while adding the comment.");
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
    alertify.confirm(
      "Confirm Delete",
      async function () {
        alertify.success("Comment deleted.");

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
          } else {
            alertify.error(response.data.message);
          }
        } catch (error) {
          alertify.error("An error occurred while deleting the comment.");
        }
      },
      function () {
        alertify.error("Cancel");
      }
    );
  };

  const handleCommentreplyDelete = async (reply_id) => {
    alertify.confirm(
      "Confirm Delete",
      async function () {
        alertify.success("Comment reply deleted.");

        try {
          const response = await api.post("/api/post/comments/delete-reply", {
            reply_id,
          });

          if (response.data.code == "200") {
          } else {
            alertify.error(response.data.code);
          }
        } catch (error) {
          alertify.error("An error occurred while deleting the comment.");
        }
      },
      function () {
        alertify.error("Cancel");
      }
    );
  };

  const handleCommentTextChange = (e, postId) => {
    setCommentText((prevText) => ({
      ...prevText,
      [postId]: e.target.value,
    }));
  };

  const handleLocationTextChange = (e) => { setlocationText(e.target.value) };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setImages(Array.from(files));
    }
  };

  const handleDonationImage = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setDonationImage(Array.from(files));
    }
  };

  const handleaudioChange = (e) => {
    const audioFiles = e.target.files;
    if (audioFiles.length > 0) {
      setaudio(Array.from(audioFiles));
    }
  };

  const handlevideoChange = (e) => {
    const videoFiles = e.target.files;
    if (videoFiles.length > 0) {
      setvideo(Array.from(videoFiles));
    }
  };

  const handlePostTextChange = (e) => { setPostText(e.target.value) };

  const handlePollTextChange = (e) => { setPollText(e.target.value) };

  const handleAddOption = () => {
    setOptions((prevOptions) => [...prevOptions, ""])
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const updatedOptions = [...options];
      updatedOptions.splice(index, 1);
      setOptions(updatedOptions);
    }
  };

  const handleDonationTitle = (e) => { setDonationTitle(e.target.value) };

  const handleDonationAmount = (e) => { setDonationAmount(e.target.value) };

  const handleDonationDescription = (e) => { setDonationDescription(e.target.value) };

  const uploadPost = async () => {
    try {
      const formData = new FormData();
      const combinedText = `${postText} ${pollText} ${donationTitle}`;
      formData.append("post_text", combinedText);
      formData.append("description", donationDescription);
      formData.append("amount", donationAmount);
      formData.append("poll_option", options);
      formData.append("post_location", locationText);
      images.forEach((image) => formData.append("images[]", image));
      donationImage.forEach((image) =>
        formData.append("donation_image", image)
      );
      audio.forEach((audioFile) => formData.append("audio", audioFile));
      video.forEach((videoFile) => formData.append("video", videoFile));

      let postType = "post";
      if (pollText) {
        postType = "poll";
      } else if (donationAmount) {
        postType = "donation";
      }

      formData.append("post_type", postType);

      formData.append("privacy", privacy);

      setLoading(true);

      const response = await api.post("/api/post/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.code == "200") {
        setPosts([response.data.data, ...posts]);
        setPostText("");
        setError("");
        setImages([]);
        setaudio([]);
        setvideo([]);
        setlocationText("");
        setOptions(["", ""]);
        setPollText("");
        setDonationAmount("");
        setDonationTitle("");
        setDonationDescription("");
        setDonationImage([]);
        alertify.success(response.data.message);
      } else {
        setError("Error from server: " + response.data.message);
        setSuccess("");
      }
    } catch (error) {
      setError(error.response.data.message);
      console.error(error);
    } finally {
      setLoading(false);
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

  const handlePostDelete = async (postId) => {
    alertify.confirm(
      "Confirm Delete",
      "Are you sure you want to delete this post? This action cannot be undone.",
      async function () {
        try {
          const response = await api.post("/api/post/action", {
            post_id: postId,
            action: "delete",
          });

          if (response.data.code == 200) {
            setPosts((prevPosts) =>
              prevPosts.filter((post) => post.id !== postId)
            );
            alertify.success("Post successfully deleted");
          } else {
            alertify.error("Failed to delete the post.");
          }
        } catch (error) {
          alertify.error("An error occurred while deleting the post.");
        }
      },
      function () {
        alertify.error("Cancel");
      }
    );
  };

  const handleVote = async (optionId, pollId, postId) => {
    try {
      const response = await api.post("/api/post/poll-vote", {
        poll_option_id: optionId,
        poll_id: pollId,
        post_id: postId,
      });

      if (response.data.status == "200") {
        alertify.success(response.data.message);
      } else {
        alertify.error(response.data.message);
      }
    } catch (error) {
      alertify.error("An error occurred while voting. Please try again.");
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
        alertify.error(response.data.message);
      }
    } catch (error) {
      alertify.error("An error occurred while fetching replies.");
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
        alertify.success("Reply added successfully!");
        setCommentreplyText((prevState) => ({
          ...prevState,
          [commentId]: "",
        }));
      } else {
        alertify.error(response.data.message);
      }
    } catch (error) {
      alertify.error("An error occurred while adding the reply");
    }
  };

  const LikeComment = async (commentId, postId) => {
    try {
      const response = await api.post("/api/post/comments/like", {
        comment_id: commentId,
        post_id: postId,
      });
      if (response.data.code == "200") {
        alertify.success(response.data.message);
      } else {
        alertify.error(response.data.message);
      }
    } catch (error) {
      alertify.error("Error while reacting to the comment");
    }
  };

  const commentReplyLike = async (replyId) => {
    try {
      const response = await api.post("/api/post/comments/reply_like", {
        comment_reply_id: replyId,
      });
      if (response.data.code == "200") {
        alertify.success(response.data.message);
      } else {
        alertify.error(response.data.message);
      }
    } catch (error) {
      alertify.error("Error while reacting to the comment reply");
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
        alertify.success(response.data.message);
      } else {
        alertify.error(response.data.message);
      }
    } catch (error) {
      alertify.error("Error while reacting to the Post");
    }
  };

  const donateAmount = (e) => {
    setDonate(e.target.value);
  };

  const handleDonationsend = async (postDonationId) => {
    try {
      const response = await api.post("/api/donate", {
        fund_id: postDonationId,
        amount: donate,
      });
      if (response.data.code == "200") {
        alertify.success(response.data.message);
      } else {
        alertify.error(response.data.message);
      }
    } catch (error) {
      alertify.error("Error while donating Fund.");
    }
  };



  const handleEmojiButtonClick = () => {
    setShowEmojiPicker((prev) => !prev);
  };


  const handleEmojiSelect = (emoji) => {
    setPostText((prevText) => prevText + emoji.emoji);
    setShowEmojiPicker(false);
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
              <div id="stories"></div>
              <div className="d-flex gap-2 mb-n3">
                <div>
                  <Storycreate />
                </div>

                <div className="container-fluid">
                  {loading && (
                    <div
                      className="spinner-grow text-secondary mt-5"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                  {error && <div className="alert alert-danger">{error}</div>}

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

                              {/* Story Image or Video */}
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

                  {/* Fullscreen Carousel for Story Preview */}
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
                                  {/* Profile Image - Circular */}
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

                                  {/* Story Image or Video */}
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

                        {/* Close Carousel Button */}
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
                  <div className="d-flex align-items-center mb-3">
                    <Image
                      src={userdata.data.avatar}
                      alt="User Avatar"
                      className="rounded-circle"
                      height={50}
                      width={50}
                    />
                    <div className="mx-2 flex-grow-1">
                      <span className="fw-semibold">
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

                  <div className="d-flex" style={{ position: 'relative' }}>
                    <input
                      className="form-control mb-5 border-0 no-border"
                      placeholder="Share your thoughts..."
                      value={postText}
                      onChange={handlePostTextChange}
                    />

                    <i
                      className="bi bi-emoji-smile text-warning"
                      onClick={handleEmojiButtonClick}
                      style={{ fontSize: '20px', cursor: 'pointer' }}
                    ></i>

                    {showEmojiPicker && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '50px',
                          left: '300px',
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
                  </div>

                  {showLocation && (
                    <div>
                      <label className="form-label text-muted">
                        <i className="bi bi-geo-alt-fill"></i> Location
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Where are you at?"
                        value={locationText}
                        onChange={handleLocationTextChange}
                      />
                    </div>
                  )}
                  {showimg && (
                    <input
                      className="form-control w-75 mt-3"
                      type="file"
                      id="imageFile"
                      onChange={handleFileChange}
                      accept="image/*"
                      multiple
                    />
                  )}

                  {showaudio && (
                    <input
                      className="form-control w-75 mt-3"
                      type="file"
                      id="audiofile"
                      onChange={handleaudioChange}
                      accept="audio/*"
                    />
                  )}

                  {showvideo && (
                    <input
                      className="form-control w-75 mt-3 mb-3"
                      type="file"
                      id="videofile"
                      onChange={handlevideoChange}
                      accept="video/*"
                      multiple
                    />
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
                      {/* Poll Button */}
                      <button
                        className="btn btn-light text-secondary align-items-center mt-2"
                        data-bs-toggle="modal"
                        data-bs-target="#pollModal"
                      >
                        <i className="bi bi-bar-chart text-primary pe-1"></i>{" "}
                        Poll
                      </button>

                      {/* Modal */}
                      <div
                        className="modal fade"
                        id="pollModal"
                        tabIndex="-1"
                        aria-labelledby="pollModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content">
                            {/* Modal Header */}
                            <div className="modal-header">
                              <h5 className="modal-title" id="pollModalLabel">
                                Create Poll
                              </h5>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>

                            <div className="modal-body">
                              <div className="mb-3">
                                <label className="form-label text-muted">
                                  Question
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter your question"
                                  value={pollText}
                                  onChange={handlePollTextChange}
                                />
                              </div>

                              {options.map((option, index) => (
                                <div
                                  key={index}
                                  className="mb-2 d-flex align-items-center"
                                >
                                  <input
                                    type="text"
                                    className="form-control me-2"
                                    placeholder={`Option ${index + 1}`}
                                    value={option}
                                    onChange={(e) => {
                                      const updatedOptions = [...options];
                                      updatedOptions[index] = e.target.value;
                                      setOptions(updatedOptions);
                                    }}
                                  />

                                  {/* "+" Button only for Option 1 */}
                                  {index === 0 && (
                                    <button
                                      className="btn btn-success btn-sm me-2"
                                      onClick={handleAddOption}
                                    >
                                      <i className="bi bi-plus"></i>
                                    </button>
                                  )}

                                  {/* "-" Button except for Option 1 and Option 2 */}
                                  {index > 1 && (
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() => handleRemoveOption(index)}
                                    >
                                      <i className="bi bi-dash"></i>
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={uploadPost}
                              >
                                Create Post
                              </button>
                              <button
                                type="button"
                                className="btn btn-dark"
                                data-bs-dismiss="modal"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div
                        className="modal fade"
                        id="fundModal"
                        tabIndex="-1"
                        aria-labelledby="fundModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title" id="fundModalLabel">
                                Raise Funding
                              </h5>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div className="modal-body">
                              <div>
                                <label className="form-label text-muted">
                                  Donation Title
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={donationTitle}
                                  onChange={handleDonationTitle}
                                />
                              </div>
                              <div>
                                <label className="form-label text-muted">
                                  Donation Image
                                </label>
                                <input
                                  className="form-control"
                                  type="file"
                                  onChange={handleDonationImage}
                                  accept="image/*"
                                />
                              </div>
                              <div>
                                <label className="form-label text-muted">
                                  Donation Amount
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={donationAmount}
                                  onChange={handleDonationAmount}
                                />
                              </div>
                              <div>
                                <label className="form-label text-muted">
                                  Donation Description
                                </label>
                                <textarea
                                  type="text"
                                  className="form-control"
                                  rows="2"
                                  value={donationDescription}
                                  onChange={handleDonationDescription}
                                />
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={uploadPost}
                              >
                                Save changes
                              </button>
                              <button
                                type="button"
                                className="btn btn-dark"
                                data-bs-dismiss="modal"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-light text-secondary align-items-center mt-2"
                        data-bs-toggle="modal"
                        data-bs-target="#fundModal"
                      >
                        <i className="bi bi-cash-coin text-success pe-1"></i>
                        Raise Funding
                      </button>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-outline-success mt-3 w-75"
                      onClick={uploadPost}
                    >
                      <i className="bi bi-send"></i> Post
                    </button>
                  </div>
                </div>
              </div>

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
                            {post.post_location && post.post_location !== "" && (
                              <span className="text-primary">
                                <small className="text-dark"> is in </small>
                                {post.post_location}
                              </span>
                            )}
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

                    {post.post_type !== "donation" && (
                      <p
                        className="mt-4"
                        dangerouslySetInnerHTML={{ __html: post.post_text }}
                      />
                    )}

                    <div className="d-flex justify-content-center flex-wrap mb-3">
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

                    <div className="container mt-5">
                      {post.donation && (
                        <div>
                          <Image
                            src={post.donation.image}
                            alt={post.donation.title}
                            className="img-fluid"
                            width={500}
                            height={300}
                            style={{
                              objectFit: "cover",
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
                                data-bs-toggle="modal"
                                data-bs-target="#DonateModal"
                              >
                                Donate
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      className="modal fade"
                      id="DonateModal"
                      tabIndex="-1"
                      aria-labelledby="ModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5
                              className="modal-title fw-semibold"
                              id="fundModalLabel"
                            >
                              Donate Amount
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <div>
                              <label className="form-label">Amount</label>
                              <input
                                type="number"
                                className="form-control"
                                value={donate}
                                onChange={donateAmount}
                              />
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() =>
                                handleDonationsend(post.donation.id)
                              }
                            >
                              Save changes
                            </button>
                            <button
                              type="button"
                              className="btn btn-dark"
                              data-bs-dismiss="modal"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-center flex-wrap mb-3">
                      {post.images &&
                        post.images.length > 0 &&
                        post.images.map((image, index) => (
                          <Image
                            key={index}
                            src={image.media_path}
                            alt={`Post image ${index + 1}`}
                            className="img-fluid mt-1"
                            width={500}
                            height={300}
                            style={{
                              objectFit: "cover",
                            }}
                          />

                        ))}

                      {post.event && post.event.cover && (
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

                          <button className="badge btn-primary rounded-pill mt-3">
                            {post.event.start_date}
                          </button>
                          <h5 className="fw-bold mt-2">{post.event.name}</h5>
                        </div>
                      )}

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

                      {post.audio && (
                        <div className="media-container w-100">
                          <audio controls className="w-100">
                            <source src={post.audio.media_path} />
                            Your browser does not support the audio tag.
                          </audio>
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
