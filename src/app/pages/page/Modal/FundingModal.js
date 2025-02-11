import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";

export default function FundingModal({ fundingModal, setFundingModal, uploadPost }) {

    const [donationTitle, setDonationTitle] = useState("");
    const [donationAmount, setDonationAmount] = useState("");
    const [donationDescription, setDonationDescription] = useState("");
    const [donationImage, setDonationImage] = useState(null);

    const handleDonationTitle = (e) => { setDonationTitle(e.target.value) };

    const handleDonationAmount = (e) => { setDonationAmount(e.target.value) };

    const handleDonationDescription = (e) => { setDonationDescription(e.target.value) };

    // const handleDonationImage = (e) => {
    //     const files = e.target.files[0];

    //     setDonationImage(files);

    // };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const donationData = {
            donationTitle,
            donationAmount,
            donationDescription,
            donationImage,
        };

        if (!donationAmount) {
           
           toast.warning("Donation Amount is required");
        }

        else{
            await uploadPost(donationData);

        }

        // Reset the modal state
        // setDonationTitle("");
        // setDonationAmount("");
        // setDonationDescription("");
        // setDonationImage(null);
        // setFundingModal(false);
    };



    return (
        <>
            <Modal
                show={fundingModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Raise Funding
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <div>
                            <label className="form-label text-muted">
                                Donation Title
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={donationTitle}
                                onChange={handleDonationTitle}
                            />
                        </div>
                        <div>
                            <label className="form-label text-muted">
                                Donation Image
                            </label>
                            <input
                                className="form-control"
                                type="file"
                                onChange={(e)=> setDonationImage(e.target.files[0])}
                                accept="image/*"
                            />
                        </div>

                        <div>
                            <label className="form-label text-muted">
                                Donation Amount
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                value={donationAmount}
                                onChange={handleDonationAmount}
                                required
                            />
                        </div>
                        <div>
                            <label className="form-label text-muted">
                                Donation Description
                            </label>
                            <textarea
                                type="text"
                                className="form-control"
                                rows="2"
                                value={donationDescription}
                                onChange={handleDonationDescription}
                            />
                        </div>

                </Modal.Body>

                <Modal.Footer>
                <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                        >
                            Create Fund
                        </button>
                        &nbsp;
                        <Button
                            className='btn bg-dark border border-0'
                            onClick={() => setFundingModal(false)}
                        >Close
                        </Button>
                    </Modal.Footer>

            </Modal>

        </>
    )
}
