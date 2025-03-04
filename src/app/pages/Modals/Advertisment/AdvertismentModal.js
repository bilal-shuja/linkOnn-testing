import { toast } from "react-toastify";
import React, { useState } from 'react';
import createAPI from "@/app/lib/axios";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from "react-bootstrap/Spinner";

export default function AdvertismentModal({ postID, showAdvertismentModal, setShowAdvertismentModal }) {

    const api = createAPI();

    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [advImg, setAdvImg] = useState('');
    const [description, setDescription] = useState('')

    const handleClose = () => setShowAdvertismentModal(false);
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {

            if (file.size > 100 * 1024 * 1024) {
                alert("File size should not exceed 100MB!");
                return;
            }

            const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
            if (!allowedTypes.includes(file.type)) {
                alert("Only image files (JPG/PNG) are allowed!");
                return;
            }

            setAdvImg(file)

            // const imageUrl = URL.createObjectURL(file);
            // setSelectedImage(imageUrl);


        }
    };



    const postAdvertisement = async () => {
        setLoading(true);


        if (!title || !link || !advImg || !description) {
            toast.warn("Fill the information!")
            setLoading(false);

        }

        else {

            const formdata = new FormData();
            formdata.append("post_id", postID);
            formdata.append("title", title);
            formdata.append("link", link);
            formdata.append("body", description);
            formdata.append("image", advImg);

            try {
                const response = await api.post("/api/post/add-advertisement", formdata);

                if (response.data.code == "200") {

                    toast.success(response.data.message);
                    handleClose();
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error("Error while adding advertisment");
            } finally {
                setLoading(false);
            }

        }


    };
    return (
        <>
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                show={showAdvertismentModal}
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Boost Your Visibility: Advertise Under this Post
                    </Modal.Title>
                </Modal.Header>
                <p className="p-3 text-dark" style={{ backgroundColor: "#ffe484" }}>
                    Get noticed by advertising under a popular post for only $1/month! Easy, affordable, and effective - your ad will be prominently displayed for 30 days. The fee is automatically deducted from your account. Boost your reach today!
                </p>
                <Modal.Body>

                    <div className="row">

                        <div className="col-md-6 mb-2">
                            <label htmlFor="validationCustom011" className="form-label fw-bold">Title*</label>
                            <input type="text" className="form-control" id="validationCustom011" placeholder="Enter title..." value={title} onChange={(e) => setTitle(e.target.value)} />

                        </div>
                        <div className="col-md-6 mb-2">
                            <label htmlFor="validationCustom022" className="form-label fw-bold">Link*</label>
                            <input type="text" className="form-control" id="validationCustom022" placeholder="Enter link..." value={link} onChange={(e) => setLink(e.target.value)} />

                        </div>

                        <div className="col-md-12 mb-3">
                            <label htmlFor="validationCustom033" className="form-label fw-bold">Image*</label>
                            <input type="file" className="form-control" id="validationCustom033" onChange={handleFileChange} />

                        </div>

                        <div className="col-md-12">
                            <label htmlFor="validationCustomUsername" className="form-label fw-bold">Description*</label>
                            <div className="input-group has-validation">
                                <textarea
                                    type="text"
                                    className="form-control"
                                    placeholder='Enter description...'
                                    id="validationCustomUsername"
                                    aria-describedby="inputGroupPrepend"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    style={{ resize: "none" }}
                                    rows={3}

                                />

                            </div>
                        </div>

                    </div>



                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={postAdvertisement} disabled={loading}>

                        {loading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />

                            </>
                        ) : (
                            "Submit"
                        )}
                    </button>

                    <Button variant="danger" onClick={handleClose}
                        disabled={loading}
                    >Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
