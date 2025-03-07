'use client';

import { Modal, Spinner } from 'react-bootstrap';

const GroupConfirmationModal = ({ show, onClose, onConfirm, actionType, loading }) => {
    const actionMessages = {
        delete: {
            icon: "bi bi-trash text-danger",
            message: "Are you sure you want to delete this group?",
        },
        leave: {
            icon: "bi bi-box-arrow-right text-warning",
            message: "Are you sure you want to leave this group?",
        },
        join: {
            icon: "bi bi-plus-circle text-success",
            message: "Are you sure you want to join this group?",
        }
    };

    const { icon, message } = actionMessages[actionType] || {};

    return (
        <Modal show={show} centered onHide={onClose}>
            <Modal.Body className="text-center">
                <i className={`${icon} fs-3 pe-2`}></i>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-sm btn-primary ps-4 pe-4" onClick={onConfirm} disabled={loading}>
                    {loading ? (
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    ) : (
                        "Yes"
                    )}
                </button>
                <button className="btn btn-sm btn-secondary ps-4 pe-4" onClick={onClose} disabled={loading}>
                    Cancel
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default GroupConfirmationModal;
