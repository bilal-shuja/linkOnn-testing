"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner"; 

export default function EditPostModal({ postID, setPosts, showEditPostModal, setShowEditPostModal }) {
    const [postText, setPostText] = useState("");
    const [loading, setLoading] = useState(false); 
    const api = createAPI();
    const { id, post_text } = postID;

    const handleClose = () => setShowEditPostModal(!showEditPostModal);

    const editPost = async () => {
        setLoading(true); // Start loading

        try {
            const response = await api.post("/api/post/update", {
                post_id: id,
                post_text: postText,
            });

            if (response.data.status == "200") {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.id === id
                            ? { 
                                ...post, 
                                post_text: postText ? postText : post_text 
                              }
                            : post
                    )
                );

                toast.success(response.data.message);
                handleClose();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error while updating post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal show={showEditPostModal} onHide={handleClose} backdrop="static" keyboard={false} centered>
                <Modal.Header>
                    <Modal.Title>Edit Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <textarea
                        className="form-control"
                        placeholder="Leave a comment here"
                        id="floatingTextarea2"
                        onChange={(e) => setPostText(e.target.value)}
                        defaultValue={post_text}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={editPost} disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                
                            </>
                        ) : (
                            "Update"
                        )}
                    </Button>

                    <button className="btn btn-dark" onClick={handleClose} disabled={loading}>
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
