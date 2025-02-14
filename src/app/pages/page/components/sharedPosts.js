import React from "react";
import Link from "next/link";
import Image from "next/image";
import PageImagesLayout from "../myPageTimeline/[myPageTimeline]/pageImagesLayout";

export default function sharedPosts({ sharedPost }) {
    if (!sharedPost) return null;

    const reverseGradientMap = {
        '_2j79': 'linear-gradient(45deg, #ff0047 0%, #2c34c7 100%)',
        '_2j80': 'linear-gradient(45deg, #fc36fd 0%, #5d3fda 100%)',
        '_2j81': 'linear-gradient(45deg, #5d6374 0%, #16181d 100%)'
    };

    return (
        <>
            <div className="card shadow-sm border rounded-1 my-2">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <Image
                                className="rounded-circle me-2"
                                src={sharedPost.user.avatar}
                                alt="User Avatar"
                                width={40}
                                height={40}
                                style={{ objectFit: "cover" }}
                            />
                            <div>
                                <h6 className="mb-0">
                                    {sharedPost.user.first_name} {sharedPost.user.last_name}
                                </h6>
                                <small className="text-muted">{sharedPost.created_human}</small>
                            </div>
                        </div>
                        {/* <Link href={sharedPost.post_link} className="text-primary">
            <i className="bi bi-box-arrow-up-right"></i>
          </Link> */}
                    </div>


                    <hr className="my-2 text-muted" />
                    {
                        sharedPost.bg_color && (
                            <div className="card-body inner-bg-post d-flex justify-content-center flex-wrap mb-1"
                                style={{
                                    background: sharedPost?.bg_color?.startsWith('_') ? reverseGradientMap[sharedPost.bg_color] : sharedPost.bg_color,
                                    padding: "160px 27px"
                                }}
                            >
                                <span className="text-dark fw-bold" style={{ fontSize: "1.5rem" }}>   {sharedPost.post_text} </span>
                            </div>
                        )
                    }


                    {sharedPost.post_text && sharedPost?.post_type !== "donation" && !sharedPost.bg_color && (
                        <p className="mb-2">{sharedPost.post_text}</p>
                    )}

                    <PageImagesLayout key={sharedPost.id} post={sharedPost} />

                    {sharedPost.video && (
                        <div className="media-container mt-2">
                            <video controls width="100%" style={{ borderRadius: "5px" }}>
                                <source src={sharedPost.video.media_path} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}

                    {sharedPost.audio && (
                        <div className="media-container mt-2">
                            <audio controls className="w-100">
                                <source src={sharedPost.audio.media_path} />
                                Your browser does not support the audio tag.
                            </audio>
                        </div>
                    )}

                    {sharedPost.poll && (
                        <div className="poll-section mt-2">
                            <h6 className="fw-bold">Poll</h6>
                            <ul className="list-unstyled">
                                {sharedPost.poll.poll_options.map((option) => {
                                    const totalVotes = sharedPost.poll.poll_total_votes || 0;
                                    const percentage = totalVotes > 0 ? Math.round((option.no_of_votes / totalVotes) * 100) : 0;
                                    return (
                                        <li key={option.id} className="mb-2">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="progress flex-grow-1" style={{ height: "30px", cursor: "pointer" }}>
                                                    <div className="progress-bar" role="progressbar" style={{ width: `${percentage}%`, backgroundColor: "#66b3ff" }}>
                                                        <span className="progress-text w-100 text-secondary fs-6 fw-bold">
                                                            {option.option_text}
                                                        </span>
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
                                                // onClick={() => {
                                                //     setDonationModal(!donationModal)

                                                //     setDonationID(sharedPost.donation.id)
                                                // }}
                                            >
                                                Donate
                                            </button>
                                        )

                                    }

                                </div>
                            </div>
                        </div>
                    )}

                    <div className="d-flex justify-content-between mt-2 text-muted">
                        <span>
                            <i className="bi bi-hand-thumbs-up me-1"></i> {sharedPost.like_count} Likes
                        </span>
                        <span>
                            <i className="bi bi-chat me-1"></i> {sharedPost.comment_count} Comments
                        </span>
                        <span>
                            <i className="bi bi-share me-1"></i> {sharedPost.share_count} Shares
                        </span>
                    </div>


                </div>
            </div>

        </>
    )
}
