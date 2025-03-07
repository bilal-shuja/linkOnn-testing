import { useState } from 'react';
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function MakeDonationModal({ donationID, donationModal, setDonationModal, posts, setPosts }) {

    const api = createAPI();
    const [donate, setDonate] = useState("");

    const donateAmount = (e) => {
        setDonate(e.target.value);
    };

    const handleDonationSend = async () => {
        try {
            const response = await api.post("/api/donate", {
                fund_id: donationID,
                amount: donate,
            });
            if (response.data.code == "200") {
                toast.success(response.data.message);
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
                setDonationModal(false);
            }
            else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error while donating Fund.");
        }
    };
    return (
        <>
            <Modal
                show={donationModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header >
                    <Modal.Title>Donate</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label className="form-label">Amount</label>
                    <input
                        type="number"
                        className="form-control"
                        value={donate}
                        onChange={donateAmount}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleDonationSend}>Donate</Button>&nbsp;
                    <Button className='bg-dark border border-0' onClick={() => setDonationModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}
