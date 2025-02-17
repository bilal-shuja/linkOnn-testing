"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner"; // Import Bootstrap Spinner

export default function ReportPostModal({ postID, showReportPostModal, setShowReportPostModal }) {
    const [loading, setLoading] = useState(false); // Loading state
    const api = createAPI();

    const handleClose = () => {
        if (!loading) setShowReportPostModal(false);
    };

    const reportPost = async () => {
        setLoading(true); // Start loading

        try {
            const response = await api.post("/api/post/action", {
                post_id: postID,
                action: "report",
            });

            if (response.data.code == "200") {
                toast.success(response.data.message);
                handleClose();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error while reporting the post");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <Modal show={showReportPostModal} centered>
            <Modal.Body className="text-center">
                <i className="bi bi-exclamation-circle text-danger pe-2"></i> 
                Are you sure you want to report this post?
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-sm btn-primary ps-4 pe-4" onClick={reportPost} disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        </>
                    ) : (
                        "Yes, Report"
                    )}
                </button>
                <button className="btn btn-sm btn-secondary ps-4 pe-4" onClick={handleClose} disabled={loading}>
                    Cancel
                </button>
            </Modal.Footer>
        </Modal>
    );
}
