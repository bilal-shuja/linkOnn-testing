import { useState } from "react";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner"; // Import Bootstrap Spinner

export default function MakeDonationModal({ donationID, donationModal, setDonationModal, setPosts }) {
    const api = createAPI();
    const [donate, setDonate] = useState("");
    const [loading, setLoading] = useState(false); // Loading state

    const donateAmount = (e) => {
        setDonate(e.target.value);
    };

    const handleDonationSend = async () => {
        setLoading(true); 

        try {
            const response = await api.post("/api/donate", {
                fund_id: donationID,
                amount: donate,
            });

            if (response.data.code == "200") {

                setPosts(prevPosts =>
                    prevPosts.map(post =>
                        post.donation && post.donation.id === donationID
                            ? {
                                ...post,
                                donation: {
                                    ...post.donation,
                                    collected_amount: (Number(post.donation.collected_amount) || 0) + Number(donate)
                                }
                            }
                            : post
                    )
                );
                
                toast.success(response.data.message);
                setDonationModal(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error while donating Fund.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={donationModal} backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title>Donate</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <label className="form-label">Amount</label>
                <input
                    type="number"
                    className="form-control"
                    value={donate}
                    onChange={donateAmount}
                    disabled={loading}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleDonationSend} disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        </>
                    ) : (
                        "Donate"
                    )}
                </Button>
                <Button className="bg-dark border border-0" onClick={() => setDonationModal(false)} disabled={loading}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
