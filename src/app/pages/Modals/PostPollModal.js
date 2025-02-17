import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import React, { useState } from 'react';

export default function PostPollModal({ pollModal, setPollModal, posts, setPosts, myPageTimeline, newsFeed, privacy, myGroupTimeline }) {

    const api = createAPI();
    const [postText, setPostText] = useState("");
    const [pollText, setPollText] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [isLoading, setIsLoading] = useState(false);

    const handlePollTextChange = (e) => setPollText(e.target.value);

    const handleAddOption = () => {
        setOptions((prevOptions) => [...prevOptions, ""]);
    };

    const handleRemoveOption = (index) => {
        if (options.length > 2) {
            const updatedOptions = [...options];
            updatedOptions.splice(index, 1);
            setOptions(updatedOptions);
        }
    };

    const uploadPost = async () => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            const combinedText = `${postText} ${pollText}`;

            if (!newsFeed) {
                if (myPageTimeline) {
                    formData.append("page_id", myPageTimeline);
                } else {
                    formData.append("group_id", myGroupTimeline);
                }
            }

            formData.append("post_text", combinedText);
            formData.append("poll_option", options);
            formData.append("post_type", "poll");
            formData.append("privacy", privacy);

            const response = await api.post("/api/post/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.code === "200") {
                toast.success(response.data.message);
                setPosts([response.data.data, ...posts]);
                setPostText("");
                setOptions(["", ""]);
                setPollText("");
                setPollModal(false);
            } else {
                toast.error("Error from server: " + response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={pollModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">Create Poll</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label className="form-label text-muted">Question</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your question"
                        value={pollText}
                        onChange={handlePollTextChange}
                    />
                </div>

                {options.map((option, index) => (
                    <div key={index} className="mb-2 d-flex align-items-center">
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

                        {index === 0 && (
                            <button className="btn btn-success btn-sm me-2" onClick={handleAddOption}>
                                <i className="bi bi-plus"></i>
                            </button>
                        )}

                        {index > 1 && (
                            <button className="btn btn-danger btn-sm" onClick={() => handleRemoveOption(index)}>
                                <i className="bi bi-dash"></i>
                            </button>
                        )}
                    </div>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={uploadPost} disabled={isLoading}>
                    {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Create Poll"}
                </Button>
                <Button className="bg-dark border border-0" onClick={() => setPollModal(false)} disabled={isLoading}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
