"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner"; 

export default function EnableDisableCommentsModal({ postID, posts, setPosts, showEnableDisableCommentsModal, setShowEnableDisableCommentsModal }) {
    const [loading, setLoading] = useState(false); // Loading state
    const api = createAPI();

    const handleClose = () => setShowEnableDisableCommentsModal(!showEnableDisableCommentsModal);

    const enableDisableComment = async () => {
        setLoading(true); // Start loading

        try {
            const response = await api.post("/api/post/action", {
                post_id: postID,
                action: "disablecomments",
            });

            if (response.data.code === "200") {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.id === postID
                            ? { ...post, comments_status: post.comments_status === "1" ? "0" : "1" }
                            : post
                    )
                );

                toast.success(response.data.message);
                handleClose();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error while performing this action");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={showEnableDisableCommentsModal} centered>
            <Modal.Body className="text-center">
                <i className="bi bi-exclamation-circle text-warning"></i> Are you sure you want to perform this action on this post?
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-sm btn-primary ps-4 pe-4" onClick={enableDisableComment} disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            
                        </>
                    ) : (
                        "Yes!"
                    )}
                </button>
                <button className="btn btn-sm btn-danger ps-4 pe-4" onClick={handleClose} disabled={loading}>
                    No
                </button>
            </Modal.Footer>
        </Modal>
    );
}
