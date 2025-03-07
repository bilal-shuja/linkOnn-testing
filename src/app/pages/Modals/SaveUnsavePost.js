"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

export default function SavePostModal({ postID, setPosts, showSavePostModal, setShowSavePostModal, saveFeed }) {
    const [loading, setLoading] = useState(false);
    const api = createAPI();

    const handleClose = () => {
        if (!loading) setShowSavePostModal(false);
    };

    const savePost = async () => {
        setLoading(true);

        try {
            const response = await api.post("/api/post/action", {
                post_id: postID,
                action: "save",
            });

            if (response.data.code == "200") {

                setPosts(prevPosts =>
                    prevPosts.map(post =>
                        post.id === postID ? {
                            ...post,
                            is_saved: post.is_saved === false ? true : false
                        } : post
                    )
                );

                if (saveFeed) {
                    setPosts(prevPosts => prevPosts.filter(post => post.id !== postID));
                }

                toast.success(response.data.message);
                handleClose();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error while saving the post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={showSavePostModal} centered>
            <Modal.Body className="text-center">
                <i className="bi bi-bookmark-fill text-info pe-3"></i>
                Are you sure you want to perform this action?
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-sm btn-primary ps-4 pe-4" onClick={savePost} disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        </>
                    ) : (
                        "Yes"
                    )}
                </button>
                <button className="btn btn-sm btn-secondary ps-4 pe-4" onClick={handleClose} disabled={loading}>
                    Cancel
                </button>
            </Modal.Footer>
        </Modal>
    );
}
