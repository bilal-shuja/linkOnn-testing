"use client";

import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useAuth from "@/app/lib/useAuth";
import { toast } from "react-toastify";


export default function Storyform() {
    useAuth();
    const router = useRouter();
    const [files, setFiles] = useState(null);
    const [caption, setCaption] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [activeTab, setActiveTab] = useState("addNewStory");
    const [stories, setStories] = useState([]);
    const [userdata, setUserdata] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const api = createAPI();

    

    useEffect(() => {
    
        const fetchStories = async () => {
            try {
                setLoading(true);
                const response = await api.post("/api/story/get-stories");
    
                if (response.data.code === "200") {
                    const allStories = response.data.data.flatMap(user => user.stories);
                    setStories(allStories);
                    setError("");
    
                    // toast.success("Stories loaded successfully");
                } else {
                    toast.error("Failed to load stories");
                }
            } catch (err) {
                // console.error("Error fetching stories:", err);
                toast.error("Error fetching stories. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        // activeTab === "myStories" ? fetchStories() : null;
        fetchStories();
    }, []);

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            if (uploadedFile.type.startsWith("image/")) {
                setErrorMessage("");
                setFiles(uploadedFile);
            } else if (uploadedFile.type.startsWith("video/")) {
                getVideoDuration(uploadedFile).then((duration) => {
                    if (duration > 30) {
                        setErrorMessage("The video duration exceeds the maximum allowed duration of 30 seconds.");
                        alert("The video duration exceeds the maximum allowed duration of 30 seconds.");
                        setFiles(null);
                    } else {
                        setErrorMessage("");
                        setFiles(uploadedFile);
                    }
                }).catch(() => {
                    setErrorMessage("Unable to determine video duration.");
                    alert("Unable to determine video duration.");
                    setFiles(null);
                });
            } else {
                setErrorMessage("Only image or video files are allowed.");
                alert("Only image or video files are allowed.");
                setFiles(null);
            }
        }
    };

    const handleCaptionChange = (e) => {
        setCaption(e.target.value);
    };

    const getVideoDuration = (file) => {
        return new Promise((resolve, reject) => {
            const video = document.createElement("video");
            video.src = URL.createObjectURL(file);
            video.onloadedmetadata = () => {
                resolve(video.duration);
            };
            video.onerror = reject;
        });
    };

    const addStory = async () => {
        if (!files) {
            toast.error("Please upload a valid media file.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("description", caption);
            formData.append("media", files);

            let duration = 10;
            let type = "image";

            if (files.type.startsWith("video/")) {
                type = "video";
                const videoDuration = await getVideoDuration(files);
                duration = videoDuration;
            }

            formData.append("type", type);
            formData.append("duration", duration);

            const response = await api.post("/api/story/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.code === "200") {
                toast.success(response.data.message);
                setTimeout(() => {

                    router.push("/pages/newsfeed");

                }, 3000);
            } else {
                toast.success("Error from server: " + response.data.message);
            }
        } catch (error) {
            toast.error("Error creating story:", error);
        }
    };

    const handleDeleteStory = async (story_id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this story?");

        if (confirmDelete) {
            try {
                const response = await api.post("/api/story/delete-story", { story_id });

                if (response.data.code == '200') {
                    toast.success("Story deleted.");
                    setStories(prevStories => prevStories.filter(story => story.id !== story_id));
                } else {
                    toast.error(response.data.message || "Failed to delete story.");
                }
            } catch (error) {
                toast.error("An error occurred while deleting the story.");
            }
        } else {
            toast.error("Cancel");
        }
    };



    useEffect(() => {
        const data = localStorage.getItem("userdata");
        if (data) {
            setUserdata(JSON.parse(data));
        }
    }, []);
    if (!userdata) {
        return;
    }

    return (
        <div>
            <Navbar />
            <div className="container-fluid bg-light">
                <div className="container mt-3 pt-5">
                    <div className="row">
                        <div className="col-md-3 p-3 rounded">
                            <Rightnav />
                        </div>
                        <div className="col-md-9 p-3">

                            <ul className="nav nav-pills" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${activeTab === "addNewStory" ? "active" : ""}`}
                                        id="addNewStory-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#addNewStory"
                                        type="button"
                                        role="tab"
                                        onClick={() => setActiveTab("addNewStory")}
                                    >
                                        <i className="bi bi-plus-circle"></i>
                                        <span className="fw-semibold"> Add New Story </span>
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${activeTab === "myStories" ? "active" : ""}`}
                                        id="myStories-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#myStories"
                                        type="button"
                                        role="tab"
                                        onClick={() => setActiveTab("myStories")}
                                    >
                                        <span className="fw-semibold"> <i className="bi bi-book-fill"></i> My Stories </span>
                                    </button>
                                </li>
                            </ul>
                            <div className="tab-content mt-3" id="myTabContent">
                                {/* Add New Story Tab Content */}
                                <div
                                    className={`tab-pane fade ${activeTab === "addNewStory" ? "show active" : ""}`}
                                    id="addNewStory"
                                    role="tabpanel"
                                    aria-labelledby="addNewStory-tab"
                                >
                                    <div className="card shadow-lg border-0 p-3">
                                        <div className="card-body">
                                            <h4 className="fw-bold mt-3">  Add New Story</h4>
                                            <div className="mt-4">
                                                <label htmlFor="formFileMultiple" className="form-label mx-1">
                                                    Choose Your Media
                                                </label>
                                                <input
                                                    className="form-control"
                                                    type="file"
                                                    id="formFileMultiple"
                                                    multiple
                                                    onChange={handleFileChange}
                                                    accept="image/*,video/*"
                                                />
                                                {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
                                            </div>
                                            <div className="mt-4">
                                                <label className="form-label mx-1">Story Caption</label>
                                                <textarea
                                                    className="form-control p-2"
                                                    rows="6"
                                                    placeholder="Story Caption..."
                                                    value={caption}
                                                    onChange={handleCaptionChange}
                                                ></textarea>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary mt-4 mb-3 mx-1 float-end"
                                                    onClick={addStory}
                                                >
                                                    <i className="bi bi-plus-circle pe-1"></i> Add Story
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* My Stories Tab Content */}
                                <div
                                    className={`tab-pane fade ${activeTab === "myStories" ? "show active" : ""}`}
                                    id="myStories"
                                    role="tabpanel"
                                    aria-labelledby="myStories-tab"
                                >
                                    <div className="card shadow-lg border-0 p-2">
                                        <div className="card-body  text-center">
                                            <table className="table table-responsive table-bordered table-hover">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Sr</th>
                                                        <th scope="col">Media</th>
                                                        <th scope="col">Caption</th>
                                                        <th scope="col">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {stories.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="4" className="text-center">No stories available</td>
                                                        </tr>
                                                    ) : (
                                                        // Filter stories to show only those whose user_id matches the current user's ID
                                                        stories.filter(story => story.user_id === userdata.data.id).map((story, index) => (
                                                            <tr key={story.id} >
                                                                <th scope="row">{index + 1}</th>
                                                                <td>
                                                                    {story.media && (
                                                                        story.type === "video" ? (
                                                                            <video
                                                                                src={story.media}
                                                                                alt="Story media"
                                                                                className="img-thumbnail"
                                                                                style={{
                                                                                    width: '75px',
                                                                                    height: '75px',
                                                                                    objectFit: 'cover'
                                                                                }}
                                                                                controls={false}

                                                                            />

                                                                        ) : (
                                                                            <Image
                                                                                src={story.media}
                                                                                alt="Story media"
                                                                                className="img-thumbnail"
                                                                                width={75}
                                                                                height={75}
                                                                                style={{
                                                                                    objectFit: "cover",
                                                                                }}
                                                                            />

                                                                        )
                                                                    )}
                                                                </td>
                                                                <td>{story.description || "No caption"}</td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-outline-danger btn-sm"
                                                                        onClick={() => handleDeleteStory(story.id)}
                                                                    >
                                                                        <i className="bi bi-trash3"></i> <small>Story</small>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>

                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
