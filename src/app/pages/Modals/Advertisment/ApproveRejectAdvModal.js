import Image from "next/image";
import createAPI from "@/app/lib/axios";
import Modal from 'react-bootstrap/Modal';
import React, { useState, useEffect } from 'react';
import ConfirmAppRejAdvModal from "./ConfirmAppRejAdvModal";

export default function ApproveRejectAdvModal({ advID, showApproveRejectAdvModal, setShowApproveRejectAdvModal , fetchPostsReq }) {

    const api = createAPI();



    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');

    const [advTitle, setAdvTitle] = useState('');
    const [advBody, setAdvBody] = useState('');
    const [advLink, setAdvLink] = useState('');
    const [advStatus, setAdvStatus] = useState('');
    const [advImage, setAdvImage] = useState('');

    const [showConfirmAppRejModal, setShowConfirmAppRejModal] = useState(false);

    const [addIdenti, setAddIdenti] = useState('');
    const handleClose = () => setShowApproveRejectAdvModal(false);





    function fetchSpecificAdv() {
        api.post("/api/ad-details", { ad_id: advID })
            .then((res) => {
                if (res.data.code == "200") {
                    const advData = res.data.data;
                    setUserName(advData?.userdata.first_name)
                    setUserEmail(advData?.userdata.email)

                    setAdvTitle(advData?.title)
                    setAdvBody(advData?.body)
                    setAdvLink(advData?.link)
                    setAdvStatus(advData?.status)
                    setAdvImage(advData?.image)


                }
            })
            .catch((error) => {
                if (error) toast.error("Error fetching ads");
            });
    }


    useEffect(() => {
        fetchSpecificAdv();

    }, []);


    // useEffect(() => {
    //     if (!showApproveRejectAdvModal && approveIdenti === "approve") {
    //       setShowConfirmAppRejModal(true);
    //     }
    //   }, [showApproveRejectAdvModal, approveIdenti]);

    return (
        <>
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={showApproveRejectAdvModal}
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter ">
                        Advertisment Info
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-4">
                                <strong>Username:</strong>
                            </div>
                            <div className="col-md-8">
                                <p>{userName}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <strong>Email:</strong>
                            </div>
                            <div className="col-md-8">
                                <p>{userEmail}</p>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-md-4">
                                <strong>Ad Image:</strong>
                            </div>
                            <div className="col-md-8">
                                <Image
                                    src={advImage || "/assets/images/placeholder-image.png"}
                                    width={200}
                                    height={200}
                                    className="img-fluid rounded-3"
                                    alt="ad Img"
                                    style={{ objectFit: "cover" }}
                                // loader={({ src }) => src}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <strong>Ad Link:</strong>
                            </div>
                            <div className="col-md-8">
                                <a href={`${advLink}`} target="_blank">Ad Link</a>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <strong>Ad Title:</strong>
                            </div>
                            <div className="col-md-8">
                                <p>{advTitle}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <strong>Description:</strong>
                            </div>
                            <div className="col-md-8">
                                <p>{advBody}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <strong>Status:</strong>
                            </div>
                            <div className="col-md-8 fs-5">
                                <span className={advStatus === "1" ?"badge bg-warning  p-2": "badge bg-success  p-2"}> {advStatus === "1" ? <i className="bi bi-hourglass-bottom"></i> : <i className="bi bi-check2-circle"></i>} {advStatus === "1" ? "pending" : "approved"}</span>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-outline-success btn-sm" onClick={() => {
                        setAddIdenti("approve")
                        setShowConfirmAppRejModal(true)
                        // setShowApproveRejectAdvModal(false)
                    }}><i className="bi bi-check-circle-fill" /> Approve</button>
                    <button className="btn btn-outline-warning  btn-sm" onClick={() => {
                        setAddIdenti("reject")
                        setShowConfirmAppRejModal(true)
                        // setShowApproveRejectAdvModal(false)
                    }}><i className="bi bi-x-circle-fill"></i> Reject</button>

                    <button className="btn btn-outline-danger btn-sm" onClick={handleClose}> Cancel</button>

                </Modal.Footer>
            </Modal>

            {
                showConfirmAppRejModal && (
                    <ConfirmAppRejAdvModal
                        advID={advID}
                        addIdenti={addIdenti}
                        showConfirmAppRejModal={showConfirmAppRejModal}
                        setShowConfirmAppRejModal={setShowConfirmAppRejModal}
                        setShowApproveRejectAdvModal = {setShowApproveRejectAdvModal}

                        fetchPostsReq = {fetchPostsReq}
                    />
                )
            }
        </>
    )
}
