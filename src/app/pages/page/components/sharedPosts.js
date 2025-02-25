
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import { useRouter } from "next/navigation";

import React, { useState, useEffect } from "react";
import MakeDonationModal from "../Modal/MakeDonationModal";
import PageImagesLayout from "../myPageTimeline/[myPageTimeline]/pageImagesLayout";

export default function sharedPosts({ sharedPost,post ,setPosts, myPageTimeline }) {
    if (!sharedPost) return null;
    const api = createAPI();

    const router = useRouter();


    const [pageTimelineData, setPageTimelineData] = useState('');

    const [postReactions, setPostReactions] = useState({});
    const [activeReactionPost, setActiveReactionPost] = useState(null);

    const [donationModal, setDonationModal] = useState(false);
    const [donationID, setDonationID] = useState("");


    const reactionEmojis = {
        satisfaction: "👍",
        love: "❤️",
        happy: "😂",
        surprise: "😮",
        sad: "😢",
        angry: "😡"
    };

    const reactionValues = {
        satisfaction: 1,
        love: 2,
        happy: 3,
        surprise: 4,
        sad: 5,
        angry: 6
    };


    const handleReactionSelect = (reaction, postId) => {
        const updatedReactions = {
            ...postReactions,
            [postId]: reactionEmojis[reaction] || "😊"
        };

        LikePost(postId, reactionValues[reaction] || 0);

        setPostReactions(updatedReactions);
        setActiveReactionPost(null);
        localStorage.setItem("postReactions", JSON.stringify(updatedReactions));
    };



    useEffect(() => {
        const storedReactions = JSON.parse(localStorage.getItem("postReactions")) || {};
        setPostReactions(storedReactions);
    }, []);


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
    };
    const getDisplayColor = (code) => {
        return colorMap[code] || code;
    };


 
    const handleCopy = (link) => {
        navigator.clipboard.writeText(link);
        toast.success("Link copied successfully!");
    };

    function fetchSpecificMyPageTimline() {

        api.post(`/api/get-page-data?page_id=${myPageTimeline}`)
            .then((res) => {
                if (res.data.code == "200") {
                    setPageTimelineData(res.data.data);
                }

            })
            .catch((error) => {
                if (error)
                    toast.error("Error fetching page timeline.");
            })

    }

    useEffect(() => {
        fetchSpecificMyPageTimline();
    }, []);

    const handlePageTimeline = () => {
        localStorage.setItem('_pageData', JSON.stringify(pageTimelineData));
    }

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
                                    ...post,
                                    shared_post: {
                                        ...post.shared_post,
                                        poll: {
                                            ...post.shared_post.poll,
                                            poll_total_votes: (post.shared_post.poll.poll_total_votes || 0) + 1,
                                            poll_options: post.shared_post.poll.poll_options.map(option =>
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
                } 
                else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error("An error occurred while voting. Please try again.");
            }
        };



    return (
        <>



                    <div className="card shadow-sm border rounded-1 my-2">
                                            
    
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">

                                    <div className="avatar-container" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                        onClick={() => handleClick(sharedPost.user.id)} >

                             
                                            <Image
                                                className="avatar-img rounded-circle"
                                                src={sharedPost.user.avatar || "/assets/images/userplaceholder.png"}
                                                alt="User Avatar"
                                                width={50}
                                                height={50}
                                                style={{ objectFit: 'cover' }}
                                            />
                                    

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
                                                style={{ cursor: 'pointer' }}
                                                onMouseEnter={(e) => e.target.style.color = 'blue'}
                                                onMouseLeave={(e) => e.target.style.color = 'inherit'}
                                                onClick={() => router.push(`/pages/UserProfile/timeline/${sharedPost.user.id}`)}
                                            >
                                                {sharedPost?.user.first_name} {sharedPost?.user.last_name}  {sharedPost?.post_location && sharedPost.post_location !== "" && (
                                                    <span className="text-primary ms-1">
                                                        <small className="text-dark"> is in </small>
                                                        <i className="bi bi-geo-fill"></i>
                                                        <a
                                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sharedPost?.post_location)}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary text-decoration-none"
                                                        >
                                                            {sharedPost.post_location}
                                                        </a>
                                                    </span>
                                                )} 
                                                
                                           
                                            </span>

                                            {
                                               (sharedPost.group || sharedPost.page) && 
                                                (

                                                    <>
                                                    <i className="bi bi-arrow-right"></i> {sharedPost?.page?.page_title}
                                                    
                                                    </>
                                                )
                                               } 


                                        </h6>
                                        <small className="text-secondary">
                                            {sharedPost.created_human} -
                                            {sharedPost.privacy === '1' && (
                                                <i className="bi bi-globe-asia-australia mx-1 text-primary"></i>
                                            )}

                                            {sharedPost.privacy === '2' && (
                                                <i className=" bi bi-people-fill mx-1 text-primary"></i>
                                            )}

                                            {sharedPost.privacy === '4' && (
                                                <i className=" bi bi-people mx-1 text-primary"></i>
                                            )}

                                            {sharedPost.privacy === '5' && (
                                                <i className=" bi bi-briefcase mx-1 text-primary"></i>
                                            )}

                                            {sharedPost.privacy === '3' && (
                                                <i className=" bi bi-lock-fill mx-1 text-primary"></i>
                                            )}
                                        </small>
                                    </div>
                                </div>


                            </div>
                            {/* <hr className="my-2 text-muted" /> */}
                            {
                                // sharedPost.bg_color && (
                                //     <div className="card-body inner-bg-post d-flex justify-content-center flex-wrap mb-1"
                                //         style={{
                                //             background: sharedPost?.bg_color?.startsWith('_') ? reverseGradientMap[sharedPost.bg_color] : sharedPost.bg_color,
                                //             padding: "160px 27px"
                                //         }}
                                //     >
                                //         <span className="text-dark fw-bold" style={{ fontSize: "1.5rem" }}>   {sharedPost.post_text} </span>
                                //     </div>
                                // )
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
                            {sharedPost?.post_type !== "donation" && !sharedPost.bg_color && (
                                <span
                                    dangerouslySetInnerHTML={{ __html: sharedPost.post_text }}
                                />
                            )}


                            {/* {post.post_text && sharedPost?.post_type !== "donation" && !sharedPost.bg_color && (
                                    <p className="mb-2">{sharedPost.post_text}</p>
                                )} */}

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
                                        src={sharedPost?.donation?.image || "/assets/images/placeholder-image.png"}
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


                     {/*  shared post till here*/}






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
    )
}
