"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function SharePostTimelineModal({ postID, sharePostTimelineModal, setShareShowTimelineModal }) {

    const api = createAPI();
    const [data, setData] = useState([]);
    const userID = localStorage.getItem('userid');
    const [sharedText, setSharedText] = useState("");
    const [pageID, setPageID] = useState("");
    const [groupID, setGroupID] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);
    const [isPosting, setIsPosting] = useState(false);
    const handleClose = () => setShareShowTimelineModal(!sharePostTimelineModal);
    const fetchMyPages = async () => {

        try {
            setSelectedOption("pages");
            const response = await api.post("/api/get-my-pages", {
                user_id: userID
            });
            if (response.data.code === "200") {
                setData(response.data.data);
            } else {
                setData([]);
                toast.error("No pages found");
            }
        } catch (error) {
            setData([]);
            toast.error("Error fetching My Pages");
        }
    };

    const fetchMyGroups = async () => {

        try {
            setSelectedOption("groups");
            const response = await api.post("/api/get-my-group", {
                user_id: userID
            });
            if (response.data.code === "200") {
                setData(response.data.data);
            } else {
                setData([]);
                toast.error("No groups found");
            }
        } catch (error) {
            setData([]);
            toast.error("Error fetching My Groups");
        }
    };

    const sharePost = async () => {
        setIsPosting(true);
        try {
            const response = await api.post("/api/post/share", {
                post_id: postID,
                shared_text: sharedText,
                page_id: pageID ? pageID : "",
                group_id: groupID ? groupID : ""
            });
            console.log(response)
            if (response.data.code === "200") {
                toast.success(response.data.message);
                handleClose();
            }
            else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error while updating post");
        }
        finally {
            setIsPosting(false);
        }
    };
    
    return (
        <Modal size="md" aria-labelledby="contained-modal-title-vcenter" show={sharePostTimelineModal} centered>
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    <i className="bi bi-share-fill"></i> Share Post
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h6>Share post on</h6>
                {/* My Timeline Option */}
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                        onChange={() => setSelectedOption("timeline")}
                        checked={selectedOption === "timeline"}
                    />
                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                        My Timeline
                    </label>
                </div>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                        onChange={fetchMyPages}
                        checked={selectedOption === "pages"}
                    />
                    <label className="form-check-label" htmlFor="flexRadioDefault2">
                        Page
                    </label>
                </div>
                {selectedOption === "pages" && data.length > 0 && (
                    <select className="form-select mt-2 mb-2" aria-label="Select a Page"
                        onChange={(e) => setPageID(e.target.value)}
                    >
                        <option value="" >Select page</option>
                        {data?.map((page) => (
                            <option key={page.id} value={page.id}>
                                {page.page_title}
                            </option>
                        ))}
                    </select>
                )}
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault3"
                        onChange={fetchMyGroups}
                        checked={selectedOption === "groups"}
                    />
                    <label className="form-check-label" htmlFor="flexRadioDefault3">
                        Group
                    </label>
                </div>
                {selectedOption === "groups" && data.length > 0 && (
                    <select className="form-select mt-2" aria-label="Select a Group"
                        onChange={(e) => setGroupID(e.target.value)}
                    >
                        <option value="" >Select group</option>
                        {data?.map((group) => (
                            <option key={group.id} value={group.id}>
                                {group.group_title}
                            </option>
                        ))}
                    </select>
                )}
                {/* Comment Box */}
                <div className="form-floating mt-3">
                    <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea" style={{ height: "100px" }}
                        onChange={(e) => setSharedText(e.target.value)}
                    />
                    <label htmlFor="floatingTextarea">Share your thoughts...</label>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className={`btn ${isPosting ? "btn-secondary" : "btn-primary"}`}
                onClick={sharePost}
                disabled={isPosting}
                >
                    <i className="bi bi-send"></i>
                    &nbsp;
                    Post
                </button>
                <button className="btn btn-danger" onClick={handleClose}>Close</button>
            </Modal.Footer>
        </Modal>
    );
}