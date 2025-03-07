import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { toast } from "react-toastify";
import React, { useState } from "react";

export default function FundingModal({ fundingModal, setFundingModal, uploadPost }) {
    const [donationTitle, setDonationTitle] = useState("");
    const [donationAmount, setDonationAmount] = useState("");
    const [donationDescription, setDonationDescription] = useState("");
    const [donationImage, setDonationImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false); 

    const handleDonationTitle = (e) => setDonationTitle(e.target.value);
    const handleDonationAmount = (e) => setDonationAmount(e.target.value);
    const handleDonationDescription = (e) => setDonationDescription(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!donationTitle || !donationAmount || donationImage === null || !donationDescription) {
            toast.warning("All fields are required");
            return; 
        }
    
        setIsLoading(true);
    
        const donationData = {
            donationTitle,
            donationAmount,
            donationDescription,
            donationImage,
        };
    
        try {
            await uploadPost(donationData);
            // toast.success("Fund created successfully!");
            setFundingModal(false);
            setDonationTitle("");
            setDonationAmount("");
            setDonationDescription("");
            setDonationImage(null);
        } catch (error) {
            toast.error("Something went wrong!");
            console.error(error);
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <Modal show={fundingModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">Raise Funding</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <label className="form-label text-muted">Donation Title</label>
                    <input type="text" className="form-control" value={donationTitle} onChange={handleDonationTitle} required/>
                </div>
                <div>
                    <label className="form-label text-muted">Donation Image</label>
                    <input className="form-control" type="file" onChange={(e) => setDonationImage(e.target.files[0])} accept="image/*"  required/>
                </div>
                <div>
                    <label className="form-label text-muted">Donation Amount</label>
                    <input type="number" className="form-control" value={donationAmount} onChange={handleDonationAmount} required />
                </div>
                <div>
                    <label className="form-label text-muted">Donation Description</label>
                    <textarea type="text" className="form-control" rows="2" value={donationDescription} onChange={handleDonationDescription} required/>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button type="submit" className="btn btn-primary" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Create Fund"}
                </Button>
                &nbsp;
                <Button className="btn bg-dark border border-0" onClick={() => setFundingModal(false)} disabled={isLoading}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
