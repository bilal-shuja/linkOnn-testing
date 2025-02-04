import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function PostPollModal({ pollModal, setPollModal }) {


    const [options, setOptions] = useState(["", ""]);

    const handleAddOption = () => {
        setOptions((prevOptions) => [...prevOptions, ""])
    };

    const handleRemoveOption = (index) => {
        if (options.length > 2) {
            const updatedOptions = [...options];
            updatedOptions.splice(index, 1);
            setOptions(updatedOptions);
        }
    };
    return (
        <>
            <Modal
                //   {...props}
                show={pollModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                       Polling
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label text-muted">
                            Question
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your question"
                            // value={pollText}
                            // onChange={handlePollTextChange}
                        />
                    </div>

                    {options.map((option, index) => (
                        <div
                            key={index}
                            className="mb-2 d-flex align-items-center"
                        >
                            <input
                                type="text"
                                className="form-control me-2"
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) => {
                                    const updatedOptions = [...options];
                                    updatedOptions[index] = e.target.value;
                                    setOptions(updatedOptions);
                                }}
                            />

                            {index === 0 && (
                                <button
                                    className="btn btn-success btn-sm me-2"
                                    onClick={handleAddOption}
                                >
                                    <i className="bi bi-plus"></i>
                                </button>
                            )}

                            {index > 1 && (
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleRemoveOption(index)}
                                >
                                    <i className="bi bi-dash"></i>
                                </button>
                            )}
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setPollModal(!pollModal)}>Close</Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}
