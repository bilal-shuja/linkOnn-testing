import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import MakeDonationModal from "../Modals/MakeDonationModal";
import UserImagesLayout from "./userImagesLayout";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";

export default function SharedPosts({ sharedPost, posts, setPosts }) {

    const [donationModal, setDonationModal] = useState(false);
    const [donationID, setDonationID] = useState("");
    const router = useRouter();
    const api = createAPI();

    const handleVote = async (optionId, pollId, postId) => {
        try {
            const response = await api.post("/api/post/poll-vote", {
                poll_option_id: optionId,
                poll_id: pollId,
                post_id: postId,
            });

            if (response.data.status == "200") {

                setPosts(prevPosts =>
                    prevPosts.map(sharedPost => {
                        if (sharedPost.id === postId && sharedPost.shared_post) {
                            return {
                                ...sharedPost,
                                shared_post: {
                                    ...sharedPost.shared_post,
                                    poll: {
                                        ...sharedPost.shared_post.poll,
                                        poll_total_votes: (sharedPost.shared_post.poll.poll_total_votes || 0) + 1,
                                        poll_options: sharedPost.shared_post.poll.poll_options.map(option =>
                                            option.id === optionId
                                                ? { ...option, no_of_votes: (option.no_of_votes || 0) + 1 }
                                                : option
                                        )
                                    }
                                }
                            };
                        }
                        return sharedPost;
                    })
                );



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

    const reverseGradientMap = {
        '_2j79': 'linear-gradient(45deg, #ff0047 0%, #2c34c7 100%)',
        '_2j80': 'linear-gradient(45deg, #fc36fd 0%, #5d3fda 100%)',
        '_2j81': 'linear-gradient(45deg, #5d6374 0%, #16181d 100%)'
    };

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
                                    src={sharedPost.user.avatar}
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
                                        onClick={() => router.push(`/pages/UserProfile/timeline/${post.user.id}`)}
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
                                        onClick={() => router.push(`/pages/page/myPageTimeline/${post.group_id}`)}
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
                        <div className="card-body inner-bg-post d-flex justify-content-center flex-wrap mb-1"
                            style={{
                                background: sharedPost?.bg_color?.startsWith('_') ? reverseGradientMap[sharedPost.bg_color] : sharedPost.bg_color,
                                padding: "160px 27px"
                            }}
                        >
                            <span className="text-dark fw-bold" style={{ fontSize: "1.5rem" }}>  {sharedPost.post_text} </span>
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


                    {sharedPost.poll && sharedPost.poll.poll_options && (
                        <div className="w-100">
                            <ul className="list-unstyled">
                                {sharedPost.poll.poll_options.map((option) => {
                                    const totalVotes = sharedPost.poll.poll_total_votes || 0;
                                    const percentage =
                                        totalVotes > 0
                                            ? Math.round((option.no_of_votes / totalVotes) * 100)
                                            : 0;

                                    return (
                                        <li key={option.id} className="mb-4 w-100">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div
                                                    className="progress flex-grow-1"
                                                    style={{
                                                        height: "30px",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                        handleVote(
                                                            option.id,
                                                            sharedPost.poll.id,
                                                            sharedPost.id
                                                        )
                                                    }
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



                    {sharedPost?.donation && (
                        <div>
                            <Image
                                src={sharedPost?.donation?.image}
                                alt={sharedPost.donation.title}
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
                                    {sharedPost.donation.title}
                                </h5>
                                <p className="card-text">
                                    {sharedPost.donation.description}
                                </p>
                                <div className="progress mb-3">
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{
                                            width: `${(sharedPost.donation.collected_amount /
                                                sharedPost.donation.amount) *
                                                100
                                                }%`,
                                        }}
                                        aria-valuenow={sharedPost.donation.collected_amount}
                                        aria-valuemin="0"
                                        aria-valuemax={sharedPost.donation.amount}
                                    ></div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <p className="text-muted">
                                        {sharedPost.donation.collected_amount} Collected
                                    </p>
                                    <p className="text-dark"> Required: <span className="fw-bold"> {sharedPost.donation.amount} </span> </p>
                                    {
                                        sharedPost.donation.collected_amount < sharedPost.donation.amount &&
                                        (
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => {
                                                    setDonationModal(!donationModal)

                                                    setDonationID(sharedPost.donation.id)
                                                }}
                                            >
                                                Donate
                                            </button>
                                        )

                                    }

                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {
                donationModal && (
                    <MakeDonationModal
                        donationID={donationID}
                        donationModal={donationModal}
                        setDonationModal={setDonationModal}
                        posts={posts}
                        setPosts={setPosts}
                    />
                )
            }
        </>
    );
}
