import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import UserImagesLayout from "./userImagesLayout";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

export default function SharedPosts({ sharedPost, posts, setPosts }) {

    const api = createAPI();
    const router = useRouter();
    const [donationModal, setDonationModal] = useState(false);
    const [donationID, setDonationID] = useState("");
    const [pollData, setPollData] = useState(sharedPost.poll);
    const [donate, setDonate] = useState("");
    const [loading, setLoading] = useState(false);
    const [localDonation, setLocalDonation] = useState(sharedPost.donation);


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
                const donationAmount = parseFloat(donate);

                setLocalDonation(prev => ({
                    ...prev,
                    collected_amount: (parseFloat(prev.collected_amount) + donationAmount).toString()
                }));

                if (setPosts && posts) {
                    setPosts(prevPosts => {
                        return prevPosts.map(post => {
                            if (post.id === sharedPost.id && post.donation) {
                                return {
                                    ...post,
                                    donation: {
                                        ...post.donation,
                                        collected_amount: (parseFloat(post.donation.collected_amount) + donationAmount).toString()
                                    }
                                };
                            }
                            return post;
                        });
                    });
                }

                toast.success(response.data.message);
                setDonationModal(false);
                setDonate("");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error while donating Fund.");
        } finally {
            setLoading(false);
        }
    };


    const handleVote = async (optionId, pollId, postId) => {
        try {
            const response = await api.post("/api/post/poll-vote", {
                poll_option_id: optionId,
                poll_id: pollId,
                post_id: postId,
            });

            if (response.data.status == "200") {
                setPollData((prevPoll) => {
                    if (!prevPoll) return prevPoll;

                    const updatedOptions = prevPoll.poll_options.map((option) => {
                        if (option.id === optionId) {
                            return { ...option, no_of_votes: option.no_of_votes + 1 };
                        }
                        return option;
                    });

                    return {
                        ...prevPoll,
                        poll_options: updatedOptions,
                        poll_total_votes: prevPoll.poll_total_votes + 1,
                    };
                });
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred while voting. Please try again.");
        }
    };

    const handleClick = (userId) => {
        router.push(`/pages/UserProfile/timeline/${userId}`);
    };


    const colorMap = {
        '23jo': '#FFFFFF',
        '23ju': '#C600FF',
        '_2j78': '#111111',
        '_2j79': 'linear-gradient(45deg, rgb(255, 0, 71) 0%, rgb(44, 52, 199) 100%)',
        '_2j80': 'linear-gradient(45deg, rgb(252, 54, 253) 0%, rgb(93, 63, 218) 100%)',
        '_2j81': 'linear-gradient(45deg, rgb(93, 99, 116) 0%, rgb(22, 24, 29) 100%)',
        '_2j82': '#00A859',
        '_2j83': '#0098DA',
        '_2j84': '#3E4095',
        '_2j85': '#4B4F56',
        '_2j86': '#161616',
        '_2j87': 'url(https://images.socioon.com/assets/images/post/bgpst1.png)',
        '_2j88': 'url(https://images.socioon.com/assets/images/post/bgpst2.png)',
        '_2j89': 'url(https://images.socioon.com/assets/images/post/bgpst3.png)',
        '_2j90': 'url(https://images.socioon.com/assets/images/post/bgpst4.png)',

    }

    const getDisplayColor = (code) => {
        return colorMap[code] || code;
    }

    return (
        <>
            <div className="card-body border border-1 shadow-sm mb-2 rounded-2">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">

                        <div className="avatar-container" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={() => handleClick(sharedPost.user.id)} >

                            <Link href="#">
                                <Image
                                    className="avatar-img rounded-circle"
                                    src={sharedPost.user.avatar || "/assets/images/userplaceholder.png"}
                                    alt="User Avatar"
                                    width={50}
                                    height={50}
                                    style={{ objectFit: 'cover' }}
                                />
                            </Link>

                            {sharedPost.user.is_verified === '1' && (
                                <div
                                    className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                        position: 'absolute',
                                        bottom: '0',
                                        right: '0',
                                        width: '20px',
                                        height: '20px',
                                        fontSize: '1.2rem',
                                        padding: '2px',
                                    }}
                                >
                                    <i className="bi bi-check-circle-fill text-success"></i>
                                </div>
                            )}
                        </div>

                        <div className="mx-2">
                            <h6 className="card-title">
                                <span
                                    style={{
                                        cursor: 'pointer',
                                        color: 'inherit',
                                        transition: 'color 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = 'blue'}
                                    onMouseLeave={(e) => e.target.style.color = 'inherit'}
                                    onClick={() => router.push(`/pages/UserProfile/timeline/${sharedPost.user.id}`)}
                                >
                                    {sharedPost.user.first_name} {sharedPost.user.last_name}
                                </span>

                                {sharedPost.post_location && (
                                    <span className="text-primary">
                                        <small className="text-dark"> is in </small> {sharedPost.post_location}
                                    </span>
                                )}

                                {(sharedPost.group || sharedPost.page) && <i className="bi bi-arrow-right fa-fw mx-2"></i>}

                                {sharedPost.group &&
                                    <span
                                        style={{
                                            cursor: 'pointer',
                                            color: 'inherit',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = 'blue'}
                                        onMouseLeave={(e) => e.target.style.color = 'inherit'}
                                        onClick={() => router.push(`/pages/groups/groupTimeline/${sharedPost.group.id}`)}
                                    >
                                        {sharedPost.group.group_title}
                                    </span>
                                }

                                {sharedPost.page &&
                                    <span
                                        style={{
                                            cursor: 'pointer',
                                            color: 'inherit',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = 'blue'}
                                        onMouseLeave={(e) => e.target.style.color = 'inherit'}
                                        onClick={() => router.push(`/pages/page/myPageTimeline/${sharedPost.page.id}`)}
                                    >
                                        {sharedPost.page.page_title}
                                    </span>}
                            </h6>
                            <small className="text-secondary">
                                {sharedPost.created_human} -
                                {sharedPost.privacy === '1' && (
                                    <i className="bi bi-globe-asia-australia mx-1 text-primary"></i>
                                )}

                                {sharedPost.privacy === '2' && (
                                    <i className=" bi bi-people-fill mx-1 text-primary"></i>
                                )}

                                {sharedPost.privacy === '3' && (
                                    <i className=" bi bi-lock-fill mx-1 text-primary"></i>
                                )}
                            </small>
                        </div>
                    </div>
                </div>

                <hr className="my-2 post-divider" />
                {
                      
                      sharedPost.bg_color && (
                          <div className="card-body inner-bg-post d-flex justify-content-center flex-wrap mb-1 h-100"
                              style={{
                                  background: getDisplayColor(sharedPost.bg_color),
                                  backgroundSize: sharedPost.bg_color?.startsWith('_2j8') ? 'cover' : 'auto',
                                  backgroundRepeat: sharedPost.bg_color?.startsWith('_2j8') ? 'no-repeat' : 'repeat',
                                  backgroundPosition: sharedPost.bg_color?.startsWith('_2j8') ? 'center' : 'unset',
                                  padding: "220px 27px",
                              }}
                          >
                              <span className="text-dark fw-bold" style={{ fontSize: "1.5rem" }}>   {sharedPost.post_text} </span>
                          </div>
                      )
                  }



                {!sharedPost.bg_color && (
                    <p
                        className="mt-4"
                        dangerouslySetInnerHTML={{ __html: sharedPost.post_text }}
                    />
                )}

                <div className="d-flex flex-column align-items-center mb-1">
                    <UserImagesLayout key={sharedPost.id} post={sharedPost} />

                    {sharedPost.video && (
                        <div className="w-100 mt-3">
                            <video controls className="w-100 rounded">
                                <source src={sharedPost.video.media_path} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}

                    {sharedPost.audio && (
                        <div className="w-100 mt-3">
                            <audio controls className="w-100">
                                <source src={sharedPost.audio.media_path} />
                                Your browser does not support the audio tag.
                            </audio>
                        </div>
                    )}


                    {pollData && pollData.poll_options && (
                        <div className="w-100">
                            <ul className="list-unstyled">
                                {pollData.poll_options.map((option) => {
                                    const totalVotes = pollData.poll_total_votes || 0;
                                    const percentage = totalVotes > 0 ? Math.round((option.no_of_votes / totalVotes) * 100) : 0;

                                    return (
                                        <li key={option.id} className="mb-4 w-100">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div
                                                    className="progress flex-grow-1"
                                                    style={{
                                                        height: "30px",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => handleVote(option.id, pollData.id, sharedPost.id)}
                                                >
                                                    <div
                                                        className="progress-bar"
                                                        role="progressbar"
                                                        style={{
                                                            width: `${percentage}%`,
                                                            backgroundColor: "#66b3ff",
                                                        }}
                                                        aria-valuenow={percentage}
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                    >
                                                        <div
                                                            className="progress-text w-100 text-secondary fs-6 fw-bold"
                                                            style={{
                                                                position: "absolute",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap",
                                                            }}
                                                        >
                                                            {option.option_text}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="px-3">{percentage}%</span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    {localDonation && (
                        <div>
                            <Image
                                src={localDonation.image || "/assets/images/placeholder-image.png"}
                                alt={localDonation.title}
                                className="img-fluid d-block mx-auto"
                                width={400}
                                height={200}
                                style={{
                                    objectFit: "cover",
                                }}
                                loader={({ src }) => src}
                            />

                            <div className="card-body text-center">
                                <h5 className="card-title">
                                    {localDonation.title}
                                </h5>
                                <p className="card-text">
                                    {localDonation.description}
                                </p>
                                <div className="progress mb-3">
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{
                                            width: `${(parseFloat(localDonation.collected_amount) /
                                                parseFloat(localDonation.amount)) *
                                                100}%`,
                                        }}
                                        aria-valuenow={localDonation.collected_amount}
                                        aria-valuemin="0"
                                        aria-valuemax={localDonation.amount}
                                    ></div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <p className="text-muted">
                                        {localDonation.collected_amount} Collected
                                    </p>
                                    <p className="text-dark"> Required: <span className="fw-bold"> {localDonation.amount} </span> </p>

                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => {
                                            setDonationModal(!donationModal)
                                            setDonationID(localDonation.id)
                                        }}
                                    >
                                        Donate
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

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

        </>
    )
}
