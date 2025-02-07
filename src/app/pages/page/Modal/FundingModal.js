import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useState, useEffect } from "react";

export default function FundingModal({ fundingModal, setFundingModal, uploadPost }) {

    const [donationTitle, setDonationTitle] = useState("");
    const [donationAmount, setDonationAmount] = useState("");
    const [donationDescription, setDonationDescription] = useState("");
    const [donationImage, setDonationImage] = useState(null);

    const handleDonationTitle = (e) => { setDonationTitle(e.target.value) };

    const handleDonationAmount = (e) => { setDonationAmount(e.target.value) };

    const handleDonationDescription = (e) => { setDonationDescription(e.target.value) };

    const handleDonationImage = (e) => {
        const files = e.target.files[0];

        setDonationImage(files);

        // console.log(files);
        // if (files.length > 0) {
           
        // }
    };


    const handleSubmit = async () => {
        const donationData = {
            donationTitle,
            donationAmount,
            donationDescription,
            donationImage,
        };


        await uploadPost(donationData);

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
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Raise Funding
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form onSubmit={handleSubmit}>
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
                            onChange={handleDonationImage}
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

                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={handleSubmit}
                    >
                       Create Fund
                    </button>
                    <Button
                        className='btn bg-dark border border-0'
                        onClick={() => setFundingModal(false)}
                    >Close</Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                   
                </Modal.Footer>
            </Modal>

        </>
    )
}
