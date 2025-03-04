import Image from "next/image";
import React, { useState } from 'react';
import createAPI from "@/app/lib/axios";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function ApproveRejectAdvModal({ advID, showApproveRejectAdvModal, setShowApproveRejectAdvModal }) {

    const api = createAPI();
    const handleClose = () => setShowApproveRejectAdvModal(false);

    console.log(advID)
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
                                <strong>User:</strong>
                            </div>
                            <div className="col-md-8">
                                <p>{advID?.user_data.first_name}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <strong>Email:</strong>
                            </div>
                            <div className="col-md-8">
                                <p>{advID?.user_data.email}</p>
                            </div>
                        </div>
{/*                         
                        <div className="row">
                            <div className="col-md-4">
                                <strong>Post Details:</strong>
                            </div>
                            <div className="col-md-8">
                                <a href="#">View Post</a>
                            </div>
                        </div> */}

                        <div className="row mb-2">
                            <div className="col-md-4">
                                <strong>Advertisement Image:</strong>
                            </div>
                            <div className="col-md-8">
                                <Image
                                    src={advID?.image || "/assets/images/placeholder-image.png"}
                                    width={350}
                                    height={350}
                                    className="rounded-3"
                                    alt="ad Img"
                                    style={{objectFit:"cover"}}
                                    loader={({ src }) => src}

                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <strong>Ad Link:</strong>
                            </div>
                            <div className="col-md-8">
                                <a href={`${advID.link}`} target="_blank">Ad Link</a>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <strong>Ad Title:</strong>
                            </div>
                            <div className="col-md-8">
                                <p>Odio quis esse conse</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <strong>Advertisement Body:</strong>
                            </div>
                            <div className="col-md-8">
                                <p>Lorem aliquip in lab</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <strong>Status:</strong>
                            </div>
                            <div className="col-md-8 fs-5">
                                <span className="badge bg-warning text-dark p-2"> <i className="bi bi-hourglass-bottom"></i> Pending</span>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='danger' onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
