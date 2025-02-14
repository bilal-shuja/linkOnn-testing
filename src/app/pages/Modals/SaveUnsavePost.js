"use client";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import Modal from 'react-bootstrap/Modal';

export default function SavePostModal({ postID, setPosts, showSavePostModal, setShowSavePostModal }) {
    const api = createAPI();

    const handleClose = () => setShowSavePostModal(false);

    const savePost = async () => {
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
                            is_saved: post.is_saved == false ? "Save Post" : "Unsave Post" }
                            : post
                    )
                );

                toast.success(response.data.message);
                handleClose();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error while saving the post");
        }
    };

    return (
        <>
            <Modal show={showSavePostModal} centered>
                <Modal.Body className='text-center'>
                    <i className="bi bi-bookmark-fill text-info pe-3"></i>
                    Are you sure to perform this action?
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-sm btn-primary ps-4 pe-4' onClick={savePost}>
                        Yes
                    </button>
                    <button className='btn btn-sm btn-secondary ps-4 pe-4' onClick={handleClose}>
                        Cancel
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
