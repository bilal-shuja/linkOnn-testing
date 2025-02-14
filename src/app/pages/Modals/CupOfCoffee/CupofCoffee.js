import createAPI from "@/app/lib/axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./CupofCoffee.module.css";  // ✅ Import CSS Module

const CupofCoffee = ({ postId, handleClose }) => {
    const api = createAPI();
    const [balance, setBalance] = useState(null); // State to store balance

    useEffect(() => {
        // Disable scrolling when modal opens
        document.documentElement.classList.add(styles.modalOpen);
        document.body.classList.add(styles.modalOpen);

        // Fetch balance when modal opens
        GetBalance();

        return () => {
            // Enable scrolling when modal closes
            document.documentElement.classList.remove(styles.modalOpen);
            document.body.classList.remove(styles.modalOpen);
        };
    }, []); // Runs once when the modal opens

    const GetBalance = async () => {
        try {
            const response = await api.post("/api/get-balance");

            if (response.data.code == "200") {
                setBalance(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error fetching balance");
        }
    };

    const handleConfirm = async () => {
        handleClose();
        try {
            const response = await api.post("/api/post/cup-of-coffee", { post_id: postId });

            if (response.data.status == "200") {
                toast.success(response.data.message);
            } else {
                toast.info(response.data.message);
            }
        } catch (error) {
            toast.error("Error processing request");
        }
    };

    return (
        <div className={styles.cupCoffeeModalOverlay}>
            <div className={styles.cupCoffeeModalDialog}>
                <div className="modal-content">
                    <div className="modal-header d-flex justify-content-between">
                        <h5 className="modal-title">
                            <i className="bi bi-exclamation-circle text-warning me-2"></i>
                            Award Cup of Coffee?
                        </h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body my-3">
                        <p>
                            Your available balance is <b>{balance !== null ? balance.toFixed(1) : "Loading..."}</b>
                        </p>
                    </div>
                    <div className={styles.cupCoffeeModalFooter}>
                        <button className="btn btn-primary mx-2" onClick={handleConfirm}>
                            Yes!
                        </button>
                        <button className="btn btn-danger mx-2" onClick={handleClose}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CupofCoffee;
