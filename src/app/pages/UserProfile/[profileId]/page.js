"use client";

import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import Navbar from "@/app/assets/components/navbar/page";
import Image from "next/image";
import { use } from "react";
import Link from "next/link";
import moment from "moment";

export default function UserProfileCard({ params }) {
    const api = createAPI();
    const { profileId } = use(params);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!profileId) return;
            try {
                const response = await api.get(`/api/get-user-profile?user_id=${profileId}`);
                if (response.data.code === "200") {
                    setUser(response.data.data);
                } else {
                    console.log("Failed to fetch user profile.");
                }
            } catch (error) {
                console.log("An error occurred while fetching data.");
            }
        };

        fetchUserProfile();
    }, [profileId]);

    if (!user) {
        return (
            <div>
                <p> </p>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container mt-5 pt-4">
                <div className="row d-flex justify-content-between">

                    <div className="col-12 col-md-8">
                        <div className="card shadow-lg border-0 rounded-3">
                            <div className="position-relative">
                                <Image
                                    src={user.cover}
                                    className="card-img-top rounded-top img-fluid"
                                    alt="cover"
                                    width={800}
                                    height={400}
                                    style={{ objectFit: 'cover', height: '200px' }}
                                />
                                <div
                                    className="position-absolute start-0 translate-middle-y ms-4"
                                    style={{ top: 'calc(125% - 31px)', zIndex: 2 }}
                                >
                                    <Image
                                        className="rounded-circle border border-white border-3 shadow-sm"
                                        src={user.avatar}
                                        alt="avatar"
                                        width={125}
                                        height={125}
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            </div>

                            <div className="card-body">
                                <div className=" mt-1" style={{ marginLeft: '10rem' }} >
                                    <div>
                                        <h5 className="fw-bold text-dark">
                                            {user.first_name} {user.last_name}
                                            {user.user_level.verified_badge === '1' && (
                                                <i className="bi bi-patch-check-fill text-success ms-2"></i>
                                            )}
                                        </h5>
                                        <span className="badge bg-primary mt-1">
                                            {user.user_level.name == 'Premium' && (
                                                <i className="bi bi-diamond pe-1"></i>
                                            )}
                                            {user.user_level.name == 'basic' && (
                                                <i className="bi bi-star pe-1"></i>
                                            )}
                                            {user.user_level.name == 'Diamond' && (
                                                <i className="bi bi-gem pe-1"></i>
                                            )}
                                            {user.user_level.name}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-muted mt-4 mx-3">
                                    <i className="bi bi-calendar2-plus me-1"></i>
                                    Joined on {moment(user.created_at).format("MMM DD, YYYY")}
                                </p>

                                <hr className="text-muted" />

                                <div className="d-flex justify-content-start gap-4 ms-3">
                                    <Link href="#" className="text-decoration-none text-muted">
                                        Posts
                                    </Link>
                                    <Link href="#" className="text-decoration-none text-muted">
                                        About
                                    </Link>
                                    <Link href="#" className="d-flex justify-content-evenly align-items-center text-decoration-none text-muted">
                                        Friends <span className="badge bg-success mx-1">{user.friends_count}</span>
                                    </Link>
                                    <Link href="#" className="text-decoration-none text-muted">
                                        Photos
                                    </Link>
                                    <Link href="#" className="text-decoration-none text-muted">
                                        Videos
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* <div className="card mb-3 shadow-lg border-0 mt-3">
                            {error && <p className="text-center text-danger">{error}</p>}

                            {success && (
                                <div className="alert alert-success mt-2">{success}</div>
                            )}

                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                    <Image
                                        src={userdata.data.avatar}
                                        alt="User Avatar"
                                        className="rounded-circle"
                                        height={50}
                                        width={50}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => router.push(`/pages/UserProfile/${userdata.data.id}`)}
                                    />
                                    <div className="mx-2 flex-grow-1">
                                        <span className="fw-semibold"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => router.push(`/pages/UserProfile/${userdata.data.id}`)}
                                        >
                                            {userdata.data.first_name} {userdata.data.last_name}
                                        </span>

                                        <div className="dropdown">
                                            <button
                                                className="btn border-0 dropdown-toggle text-muted btn-sm"
                                                type="button"
                                                id="dropdownMenuLink"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                {getDropdownIcon(dropdownSelection)}{" "}
                                                {dropdownSelection} {""}
                                            </button>
                                            <ul
                                                className="dropdown-menu p-3"
                                                aria-labelledby="dropdownMenuLink"
                                            >
                                                <li
                                                    className="dropdown-item text-primary"
                                                    onClick={() => handleDropdownChange("PUBLIC")}
                                                >
                                                    <i className="bi bi-globe-asia-australia pe-2"></i>{" "}
                                                    Public
                                                </li>
                                                <hr className="mb-0 mt-0 text-muted" />
                                                <li
                                                    className="dropdown-item text-primary"
                                                    onClick={() => handleDropdownChange("Friends")}
                                                >
                                                    <i className="bi bi-people-fill pe-2"></i> Friends
                                                </li>
                                                <hr className="mb-0 mt-0 text-muted" />
                                                <li
                                                    className="dropdown-item text-primary"
                                                    onClick={() => handleDropdownChange("Family")}
                                                >
                                                    <i className="bi bi-people pe-2"></i> Family
                                                </li>
                                                <hr className="mb-0 mt-0 text-muted" />
                                                <li
                                                    className="dropdown-item text-primary"
                                                    onClick={() => handleDropdownChange("Business")}
                                                >
                                                    <i className="bi bi-briefcase pe-2"></i> Business
                                                </li>
                                                <hr className="mb-0 mt-0 text-muted" />
                                                <li
                                                    className="dropdown-item text-primary"
                                                    onClick={() => handleDropdownChange("Only me")}
                                                >
                                                    <i className="bi bi-lock-fill pe-2"></i> Only me
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex" style={{ position: 'relative' }}>
                                    <input
                                        className="form-control mb-5 border-0 no-border"
                                        placeholder="Share your thoughts..."
                                        value={postText}
                                        onChange={handlePostTextChange}
                                    />

                                    <i
                                        className="bi bi-emoji-smile text-warning"
                                        onClick={handleEmojiButtonClick}
                                        style={{ fontSize: '20px', cursor: 'pointer' }}
                                    ></i>

                                    {showEmojiPicker && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '50px',
                                                left: '100px',
                                                zIndex: '1000',
                                            }}
                                        >
                                            <EmojiPicker
                                                onEmojiClick={handleEmojiSelect}
                                                width="100%"
                                                height="400px"
                                            />
                                        </div>
                                    )}
                                </div>

                                {showLocation && (
                                    <div>
                                        <label className="form-label text-muted">
                                            <i className="bi bi-geo-alt-fill"></i> Location
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Where are you at?"
                                            value={locationText}
                                            onChange={handleLocationTextChange}
                                        />
                                    </div>
                                )}
                                {showimg && (
                                    <input
                                        className="form-control w-75 mt-3"
                                        type="file"
                                        id="imageFile"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        multiple
                                    />
                                )}

                                {showaudio && (
                                    <input
                                        className="form-control w-75 mt-3"
                                        type="file"
                                        id="audiofile"
                                        onChange={handleaudioChange}
                                        accept="audio/*"
                                    />
                                )}

                                {showvideo && (
                                    <input
                                        className="form-control w-75 mt-3 mb-3"
                                        type="file"
                                        id="videofile"
                                        onChange={handlevideoChange}
                                        accept="video/*"
                                        multiple
                                    />
                                )}

                                <div className="d-flex flex-wrap justify-content-evenly">
                                    <div>
                                        <button
                                            htmlFor="imageFile"
                                            className="btn btn-light text-secondary align-items-center mt-2"
                                            onClick={toggleimg}
                                        >
                                            <i className="bi bi-image text-success pe-1"></i> Photo
                                        </button>
                                    </div>

                                    <div>
                                        <button
                                            htmlFor="videofile"
                                            className="btn btn-light text-secondary align-items-center mt-2"
                                            onClick={togglevideo}
                                        >
                                            <i className="bi bi-camera-video text-primary pe-2"></i>
                                            Video
                                        </button>
                                    </div>

                                    <div>
                                        <button
                                            htmlFor="audiofile"
                                            className="btn btn-light text-secondary align-items-center mt-2"
                                            onClick={toggleaudio}
                                        >
                                            <i className="bi bi-music-note text-primary pe-1"></i>{" "}
                                            Audio
                                        </button>
                                    </div>

                                    <button
                                        className="btn btn-light text-secondary align-items-center mt-2"
                                        onClick={toggleLocation}
                                    >
                                        <i className="bi bi-geo-alt text-danger pe-1"></i>{" "}
                                        Location
                                    </button>

                                    <button
                                        className="btn btn-light text-secondary align-items-center mt-2"
                                        onClick={() => router.push("/pages/Events/create-event")}
                                    >
                                        <i className="bi bi-calendar-event text-danger pe-1"></i>{" "}
                                        Event
                                    </button>

                                    <div>
                                        <button
                                            className="btn btn-light text-secondary align-items-center mt-2"
                                            data-bs-toggle="modal"
                                            data-bs-target="#pollModal"
                                        >
                                            <i className="bi bi-bar-chart text-primary pe-1"></i>{" "}
                                            Poll
                                        </button>

                                        <div
                                            className="modal fade"
                                            id="pollModal"
                                            tabIndex="-1"
                                            aria-labelledby="pollModalLabel"
                                            aria-hidden="true"
                                        >
                                            <div className="modal-dialog modal-dialog-centered">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="pollModalLabel">
                                                            Create Poll
                                                        </h5>
                                                        <button
                                                            type="button"
                                                            className="btn-close"
                                                            data-bs-dismiss="modal"
                                                            aria-label="Close"
                                                        ></button>
                                                    </div>

                                                    <div className="modal-body">
                                                        <div className="mb-3">
                                                            <label className="form-label text-muted">
                                                                Question
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter your question"
                                                                value={pollText}
                                                                onChange={handlePollTextChange}
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
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary"
                                                            onClick={uploadPost}
                                                        >
                                                            Create Post
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-dark"
                                                            data-bs-dismiss="modal"
                                                        >
                                                            Close
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div
                                            className="modal fade"
                                            id="fundModal"
                                            tabIndex="-1"
                                            aria-labelledby="fundModalLabel"
                                            aria-hidden="true"
                                        >
                                            <div className="modal-dialog modal-dialog-centered">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="fundModalLabel">
                                                            Raise Funding
                                                        </h5>
                                                        <button
                                                            type="button"
                                                            className="btn-close"
                                                            data-bs-dismiss="modal"
                                                            aria-label="Close"
                                                        ></button>
                                                    </div>
                                                    <div className="modal-body">
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
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary"
                                                            onClick={uploadPost}
                                                        >
                                                            Save changes
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-dark"
                                                            data-bs-dismiss="modal"
                                                        >
                                                            Close
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-light text-secondary align-items-center mt-2"
                                            data-bs-toggle="modal"
                                            data-bs-target="#fundModal"
                                        >
                                            <i className="bi bi-cash-coin text-success pe-1"></i>
                                            Raise Funding
                                        </button>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <button
                                        className="btn btn-outline-success mt-3 w-75"
                                        onClick={uploadPost}
                                    >
                                        <i className="bi bi-send"></i> Post
                                    </button>
                                </div>
                            </div>
                        </div> */}

                    </div>

                    <div className="col-12 col-lg-4 position-sticky top-0">
                        <div className="row g-4">

                            <div className="col-12">
                                <div className="card shadow-lg border-0">
                                    <div className="card-body p-4">
                                        <h4>About</h4>
                                        <p className="text-muted">Full Stack Developer</p>
                                        <div className="d-flex justify-content-between text-muted">

                                            <p className="fw-semibold">
                                                {user.gender == 'Male' && (
                                                    <i className="bi bi-gender-male fa-fw pe-1"></i>
                                                )}
                                                {user.gender == 'Female' && (
                                                    <i className="bi bi-gender-female fa-fw pe-1"></i>
                                                )}
                                                {user.gender}
                                            </p>

                                            <p> <i className="bi bi-person-circle fa-fw pe-1"></i>
                                                Posts
                                                <span className="badge bg-danger mx-1">29</span>
                                            </p>
                                        </div>
                                        <p className="text-muted">
                                            <i className="bi bi-calendar-date fa-fw pe-1"></i>
                                            DOB:
                                            <strong className="mx-1">
                                                {moment(user.date_of_birth).format("MMM DD, YYYY")}
                                            </strong>
                                        </p>
                                        <p className="text-muted"> <i className="bi bi-heart fa-fw pe-1"></i>
                                            Status:
                                            <strong className="mx-1">
                                                {user.relation_id == '0' && (
                                                    <span>None</span>
                                                )}
                                                {user.relation_id == '1' && (
                                                    <span>Single</span>
                                                )}
                                                {user.relation_id == '2' && (
                                                    <span>In a Relationship</span>
                                                )}
                                                {user.relation_id == '3' && (
                                                    <span>Married</span>
                                                )}
                                                {user.relation_id == '4' && (
                                                    <span>Engaged</span>
                                                )}
                                            </strong>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="card shadow-lg border-0">
                                    <div className="card-body p-4">
                                        <h4 className="mb-3">Social Links</h4>
                                        <div className="d-flex justify-content-between mx-3">


                                            {user.facebook && user.facebook !== "" && user.facebook !== "#" ? (
                                                <Link href={user.facebook}>
                                                    <i className="bi bi-facebook text-primary" style={{ fontSize: '1.5rem' }}></i>
                                                </Link>
                                            ) : null}

                                            {user.twitter && user.twitter !== "" && user.twitter !== "#" ? (
                                                <Link href={user.twitter}>
                                                    <i className="bi bi-twitter text-info" style={{ fontSize: '1.5rem' }}></i>
                                                </Link>
                                            ) : null}

                                            {user.instagram && user.instagram !== "" && user.instagram !== "#" ? (
                                                <Link href={user.instagram}>
                                                    <i className="bi bi-instagram text-danger" style={{ fontSize: '1.5rem' }}></i>
                                                </Link>
                                            ) : null}

                                            {user.linkedin && user.linkedin !== "" && user.linkedin !== "#" ? (
                                                <Link href={user.linkedin}>
                                                    <i className="bi bi-linkedin text-primary" style={{ fontSize: '1.5rem' }}></i>
                                                </Link>
                                            ) : null}

                                            {user.youtube && user.youtube !== "" && user.youtube !== "#" ? (
                                                <Link href={user.youtube}>
                                                    <i className="bi bi-youtube text-danger" style={{ fontSize: '1.5rem' }}></i>
                                                </Link>
                                            ) : null}

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="card shadow-lg border-0">
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between">
                                            <h4>Photos</h4>
                                            <button className="btn btn-light text-primary border-0 rounded-1">See all photos</button>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="card shadow-lg border-0">
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center justify-content-evenly">
                                                <h4>Friends</h4>
                                                <span className="badge bg-danger mb-1 mx-1">{user.friends_count}</span>
                                            </div>
                                            <button className="btn btn-light text-primary border-0 rounded-1">See all photos</button>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
