"use client";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import Modal from 'react-bootstrap/Modal';

export default function ReportPostModal({ postID, showReportPostModal, setShowReportPostModal }) {
    const api = createAPI();

    const handleClose = () => setShowReportPostModal(false);

    const reportPost = async () => {
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
        }
    };

    return (
        <>
            <Modal show={showReportPostModal} centered>
                <Modal.Body className='text-center'>
                    <i className="bi bi-exclamation-circle text-danger pe-5"></i> 
                    Are you sure you want to report this post?
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-sm btn-primary ps-4 pe-4' onClick={reportPost}>
                        Yes, Report
                    </button>
                    <button className='btn btn-sm btn-secondary ps-4 pe-4' onClick={handleClose}>
                        Cancel
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
