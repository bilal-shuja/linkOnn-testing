"use client"
import Image from "next/image";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import styles from "../css/ChatWindow.module.css";
import { OverlayTrigger, Popover } from "react-bootstrap";
import React, { useState, useEffect, useRef, useCallback } from "react";
import MessageDeleteModal from "@/app/pages/Modals/MessageDeleteModal";
import { debounce } from "lodash"

const ChatWindow = ({ chat, chatID, onClose }) => {
    const api = createAPI();
    const limit = 30;
    const userID = Number(localStorage.getItem("userid"));

    const [textMessage, setTextMessage] = useState('');
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [userChat, setUserChat] = useState([]);

    const [loading, setLoading] = useState(false);

    const [sendTextLoading, setSendTextLoading] = useState(false)
    const [hoveredMessage, setHoveredMessage] = useState(null);
    const [chatMessageID, setChatMessageID] = useState('');

    const [lastMessageTimestamp, setLastMessageTimestamp] = useState(null)

    const [pollingLoading, setPollingLoading] = useState(false);

    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [isUserAtBottom, setIsUserAtBottom] = useState(true);

    const [selectedImage, setSelectedImage] = useState(null);
    const [chatImg, setChatImg] = useState(null);
    const fileImgRef = useRef(null)

    const [chatVideo, setChatVideo] = useState(null)
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null)
    const fileVideoRef = useRef(null);

    const [chatAudio, setChatAudio] = useState(null)
    const [audioPreviewUrl, setAudioPreviewUrl] = useState(null)
    const fileAudioRef = useRef(null);



    const [mediaType, setMediaType] = useState('')
    const [showPopover, setShowPopover] = useState(false);


    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [offset, setOffset] = useState(0);


    const [isScrolling, setIsScrolling] = useState(false)
    const lastScrollPosition = useRef(0)

    const [isLoadingLock, setIsLoadingLock] = useState(false);
    const scrollLockTimeout = useRef(null);

    const preserveScrollPosition = useRef(null)


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {

            if (file.size > 100 * 1024 * 1024) {
                alert("File size should not exceed 100MB!");
                return;
            }
            setMediaType(1)
            setChatImg(file)

            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);

            setShowPopover(false);

        }
    };

    const removeImage = () => {

        if (fileImgRef.current) {
            fileImgRef.current.value = "";
        }

        setChatImg("");
        setSelectedImage("");

        setTimeout(() => {
            setChatImg(null);
            setSelectedImage(null);
        }, 50);
    };


    const handleVideoChange = (event) => {
        const videoFile = event.target.files[0]


        if (videoFile) {

            if (videoFile.size > 100 * 1024 * 1024) {
                alert("Video size should not exceed 100MB!");
                return;
            }
            setMediaType(2)
            setChatVideo(videoFile)

            const videoUrl = URL.createObjectURL(videoFile)
            setVideoPreviewUrl(videoUrl)
            setShowPopover(false);
        } else {
            console.log("No file selected")
        }
    }


    useEffect(() => {
        return () => {
            if (videoPreviewUrl) {
                URL.revokeObjectURL(videoPreviewUrl)
            }
        }
    }, [videoPreviewUrl])

    const removeVideo = () => {
        if (videoPreviewUrl) {
            URL.revokeObjectURL(videoPreviewUrl)
        }

        if (fileVideoRef.current) {
            fileVideoRef.current.value = "";
        }

        setChatVideo("");
        setVideoPreviewUrl("");

        setTimeout(() => {
            setChatVideo(null);
            setVideoPreviewUrl(null);
        }, 50);
    }


    const handleAudioChange = (event) => {
        const audioFile = event.target.files[0]

        if (audioFile) {
            setMediaType(4)
            setChatAudio(audioFile)

            const audioUrl = URL.createObjectURL(audioFile)
            setAudioPreviewUrl(audioUrl)
            setShowPopover(false);
        } else {
            console.log("No file selected")
        }
    }


    useEffect(() => {
        return () => {
            if (audioPreviewUrl) {
                URL.revokeObjectURL(audioPreviewUrl)
            }
        }
    }, [audioPreviewUrl])

    const removeAudio = () => {
        if (audioPreviewUrl) {
            URL.revokeObjectURL(audioPreviewUrl)
        }

        if (fileAudioRef.current) {
            fileAudioRef.current.value = "";
        }

        setChatAudio("");
        setAudioPreviewUrl("");

        setTimeout(() => {
            setChatAudio(null);
            setAudioPreviewUrl(null);
        }, 50);
    }


    const popoverTop = (
        <Popover id="popover-positioned-top">
            <Popover.Body>
                <div className="chat-img" style={{ cursor: "pointer" }}>
                    <input type="file"
                        id="imageFileInput"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                        ref={fileImgRef}
                    />

                    <label htmlFor="imageFileInput" style={{ cursor: "pointer" }}>
                        <i className="bi bi-file-earmark-image text-primary fs-5" />&nbsp;
                        <span className="fw-bold">Attach a file up to 100 MB</span>
                    </label>
                </div>





                <div className="chat-video" style={{ cursor: "pointer" }}>
                    <input
                        type="file"
                        id="videoFileInput"
                        style={{ display: "none" }}
                        accept="video/*"
                        onChange={handleVideoChange}
                        ref={fileVideoRef}
                    />
                    <label htmlFor="videoFileInput" style={{ cursor: "pointer" }}>
                        <i className="bi bi-camera-reels-fill text-primary fs-5" /> &nbsp;
                        <span className="fw-bold">Attach a video file</span>
                    </label>
                </div>


                <div className="chat-audio" style={{ cursor: "pointer" }}>
                    <input type="file"
                        id="audioFileInput"
                        style={{ display: "none" }}
                        accept="audio/*"
                        onChange={handleAudioChange}
                        ref={fileAudioRef}
                    />

                    <label htmlFor="audioFileInput" style={{ cursor: "pointer" }}>
                        <i className="bi bi-soundwave text-primary fs-5" />&nbsp;
                        <span className="fw-bold">Attach a audio file</span>
                    </label>
                </div>




            </Popover.Body>

        </Popover>
    )


    // Initialize last message timestamp when chat loads
    useEffect(() => {
        if (userChat.length > 0) {
            const timestamps = userChat.map((msg) => new Date(msg.created_at).getTime())
            setLastMessageTimestamp(Math.max(...timestamps))
        }
    }, [userChat])



    // const getUserChat = async () => {

    //     const chatID = chatID;
    //     if (!chatID) return;

    //     try {
    //        setLoading(true);
    //         setLoadingMore(true);

    //         const formdata = new FormData();
    //         formdata.append("to_id", chatID);
    //         formdata.append("limit", limit);



    //         const response = await api.post("/api/chat/get-user-chat", formdata, {
    //             headers: {
    //                 "Content-Type": "multipart/form-data",
    //             }
    //         })
    //         if (response.data.status === "success") {

    //             setUserChat(response.data.data);

    //             const newMessages = response.data.data;
    //             if (newMessages.length < limit) {
    //                 setHasMore(false);
    //                 setLoadingMore(false)
    //             }


    //             else if(newMessages.length !== userChat.length) {
    //                 setUserChat(newMessages);
    //                 scrollToBottom(true);
    //             }

    //             else {
    //                 setUserChat(newMessages);
    //                 scrollToBottom(true);
    //             }
    //         } 


    //         else {
    //             toast.error("Failed to load chats.");
    //         }
    //     } catch (err) {
    //         toast.error("Error fetching chats. Please try again in a while.");
    //     } finally {
    //        setLoading(false);
    //      setLoadingMore(false);
    //     }
    // };


    // useEffect(() => {
    //     if (chatID) {
    //         getUserChat();
    //     }
    // }, [chatID]);

    const fetchNewMessages = useCallback(async () => {
        if (!chatID || !lastMessageTimestamp) return;

        try {
            // Don't set the main loading state here
            setPollingLoading(true);
            const formdata = new FormData();
            formdata.append("to_id", chat.id);

            const response = await api.post("/api/chat/get-user-chat", formdata, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            if (response.data.status === "success") {
                const allMessages = response.data.data;
                const newMessages = allMessages.filter(msg => new Date(msg.created_at).getTime() > lastMessageTimestamp);

                if (newMessages.length > 0) {
                    setUserChat(prev => {
                        const updatedChat = [...prev];
                        const existingIds = new Set(prev.map(msg => msg.id));

                        newMessages.forEach(msg => {
                            if (!existingIds.has(msg.id)) {
                                updatedChat.push(msg);
                            }
                        });

                        // Don't trigger scroll here
                        return updatedChat;
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching new messages:", error);
        } finally {
            setPollingLoading(false);
        }
    }, [chatID, lastMessageTimestamp, api.post]);




    // Initial messages fetch

    // const getUserChat = async (loadMore = false) => {
    //     if (!chatID || isLoadingLock) return
    //     try {
    //         if (loadMore) {
    //             setLoadingMore(true)
    //             setIsLoadingLock(true)
    //             if (scrollLockTimeout.current) {
    //                 clearTimeout(scrollLockTimeout.current)
    //             }
    //             console.log("Loading more messages with offset:", offset + limit);
    //         }

    //         else {
    //             setLoading(true)
    //         }

    //         // setLoading(true);
    //         const formdata = new FormData();
    //         formdata.append("to_id", chatID);
    //         formdata.append("limit", limit);
    //         formdata.append("offset", loadMore ? offset : 0)

    //         console.log("Sending request with params:", {
    //             to_id: chatID,
    //             limit,
    //             offset: loadMore ? offset : 0
    //         });

    //         const response = await api.post("/api/chat/get-user-chat", formdata, {
    //             headers: {
    //                 "Content-Type": "multipart/form-data",
    //             }
    //         });

    //         if (response.data.status === "success") {
    //             // setUserChat(response.data.data);
    //             // setHasMore(response.data.data.length >= limit);
    //             // scrollToBottom(true);

    //             const newMessages = response.data.data

    //             console.log(`Received ${newMessages.length} messages from API`);

    //             // if (newMessages.length < limit) {
    //             //     setHasMore(false)
    //             // } else {
    //             //     setHasMore(true)
    //             // }
    //             setHasMore(newMessages.length >= limit)
    //             // if (loadMore) {
    //             //   // Prepend older messages to the beginning of the chat
    //             //   setUserChat((prev) => [...newMessages, ...prev])
    //             //   setOffset((prev) => prev + limit)
    //             // } 
    //             if (loadMore) {
    //                 setUserChat((prev) => {
    //                     // Create a Map of existing messages using ID as key
    //                     const existingMessages = new Map(prev.map((msg) => [msg.id, msg]))

    //                     // Filter and add only unique messages

    //                     // newMessages.forEach((msg) => {
    //                     //     if (!existingMessages.has(msg.id)) {
    //                     //         existingMessages.set(msg.id, msg)
    //                     //     }
    //                     // })

    //                     const addedCount = newMessages.reduce((count, msg) => {
    //                         if (!existingMessages.has(msg.id)) {
    //                             existingMessages.set(msg.id, msg);
    //                             return count + 1;
    //                         }
    //                         return count;
    //                     }, 0);


    //                     console.log(`Added ${addedCount} new unique messages`);

    //                     // Convert Map back to array and sort by creation date
    //                     const updatedMessages = Array.from(existingMessages.values()).sort(
    //                         (a, b) => new Date(a.created_at) - new Date(b.created_at),
    //                     )

    //                     return updatedMessages
    //                 })

    //                 // Only update offset if we actually got new messages
    //                 if (newMessages.length > 0) {
    //                     setOffset((prev) => prev + limit);
    //                     console.log("Updated offset to:", offset + limit);
    //                 }
    //             }
    //             else {
    //                 // Initial load
    //                 setUserChat(newMessages)
    //                 setOffset(limit)
    //                 scrollToBottom(true)
    //             }
    //         }
    //         else {
    //             toast.error("Failed to load chats.");
    //         }
    //     } catch (err) {
    //         toast.error("Error fetching chats. Please try again in a while.");
    //     } finally {
    //         setLoading(false)
    //         setLoadingMore(false)
    //         if (loadMore) {
    //             scrollLockTimeout.current = setTimeout(() => {
    //                 setIsLoadingLock(false);
    //                 console.log("Loading lock released");
    //             }, 2000); // Longer timeout to prevent rapid re-triggering
    //         }
    //     }
    // };


    const getUserChat = async (loadMore = false) => {
        if (!chatID || isLoadingLock) return;
        try {
            if (loadMore) {
                setLoadingMore(true);
                setIsLoadingLock(true);
                if (scrollLockTimeout.current) {
                    clearTimeout(scrollLockTimeout.current);
                }
                console.log("Loading more messages with offset:", offset + limit);
            } else {
                setLoading(true);
            }
    
            const formdata = new FormData();
            formdata.append("to_id", chatID);
            formdata.append("limit", limit);
            formdata.append("offset", loadMore ? offset : 0);
    
            console.log("Sending request with params:", {
                to_id: chatID,
                limit,
                offset: loadMore ? offset : 0
            });
    
            const response = await api.post("/api/chat/get-user-chat", formdata, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
    
            if (response.data.status === "success") {
                const newMessages = response.data.data;
                setHasMore(newMessages.length >= limit);
    
                if (loadMore) {
                    setUserChat((prev) => {
                        const existingMessages = new Map(prev.map((msg) => [msg.id, msg]));
                        const addedCount = newMessages.reduce((count, msg) => {
                            if (!existingMessages.has(msg.id)) {
                                existingMessages.set(msg.id, msg);
                                return count + 1;
                            }
                            return count;
                        }, 0);
                        console.log(`Added ${addedCount} new unique messages`);
                        const updatedMessages = Array.from(existingMessages.values()).sort(
                            (a, b) => new Date(a.created_at) - new Date(b.created_at)
                        );
                        return updatedMessages;
                    });
    
                    if (newMessages.length > 0) {
                        setOffset((prev) => prev + limit);
                        console.log("Updated offset to:", offset + limit);
                    }
                } else {
                    setUserChat(newMessages);
                    setOffset(limit);
                    scrollToBottom(true);
                }
            } else {
                toast.error("Failed to load chats.");
            }
        } catch (err) {
            toast.error("Error fetching chats. Please try again in a while.");
        } finally {
            setLoading(false);
            setLoadingMore(false);
            if (loadMore) {
                // Ensure isLoadingLock is reset after loading more messages
                setIsLoadingLock(false);
                console.log("Loading lock released");
            }
        }
    };

    useEffect(() => {
        if (!chatID) return;

        let currentInterval = null;

        const startPolling = () => {
            fetchNewMessages();
            currentInterval = setInterval(fetchNewMessages, 5000);
            return currentInterval;
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (currentInterval) {
                    clearInterval(currentInterval);
                    currentInterval = null;
                }
            } else {
                if (!currentInterval) {
                    currentInterval = startPolling();
                }
            }
        };

        currentInterval = startPolling();
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            if (currentInterval) clearInterval(currentInterval);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [chatID, fetchNewMessages]);


    // useEffect(() => {
    //     if (!chatID) return;
    //     getUserChat(false);
    // }, [chatID]);


    // useEffect(() => {
    //     if (!chatID) return
    //     setOffset(0)
    //     setHasMore(true)

    //     getUserChat(false)
    // }, [chatID])



    // const scrollToBottom = (smooth = true) => {
    //     if (messagesEndRef.current) {
    //         messagesEndRef.current.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
    //     }
    // };
    const scrollToBottom = useCallback(
        (smooth = true) => {
            if (!messagesEndRef.current || isScrolling || loadingMore || isLoadingLock) return

            try {
                messagesEndRef.current.scrollIntoView({
                    behavior: smooth ? "smooth" : "auto",
                    block: "end",
                })
            } catch (error) {
                console.error("Error scrolling to bottom:", error)
            }
        },
        [isScrolling, loadingMore, isLoadingLock],
    )


    // const handleScroll = () => {
    //     if (!chatContainerRef.current) return;
    //     const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    //     setIsUserAtBottom(scrollTop + clientHeight >= scrollHeight - 10);

    //     if (scrollTop < 10 && hasMore && !loadingMore && !loading) {
    //         if (chatContainerRef.current) {
    //             preserveScrollPosition.current = chatContainerRef.current.scrollHeight
    //         }
    //         getUserChat(true)
    //     }
    // };



    // const handleScroll = useCallback(
    //     debounce(() => {
    //         if (!chatContainerRef.current || loading || loadingMore || isLoadingLock) {
    //             console.log("Scroll handling skipped due to:", { loading, loadingMore, isLoadingLock });
    //             return;
    //         }

    //         const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    //         const isNearTop = scrollTop < 130; 
    //         const isNearBottom = scrollTop + clientHeight >= scrollHeight - 5;

    //         setIsUserAtBottom(isNearBottom);

    //         console.log("Scroll position:", {
    //             scrollTop,
    //             scrollHeight,
    //             clientHeight,
    //             isNearTop,
    //             hasMore,
    //             loadingMore,
    //             isLoadingLock
    //         });

           
    //         if (isNearTop && hasMore && !loadingMore && !isLoadingLock) {
    //             console.log("Attempting to load more messages");

               
    //             setIsLoadingLock(true);
    //             setIsScrolling(true);

    //             if (chatContainerRef.current) {
                   
    //                 preserveScrollPosition.current = chatContainerRef.current.scrollHeight;
    //                 console.log("Saved scroll height:", preserveScrollPosition.current);
    //             }

         
    //             setTimeout(() => {
    //                 getUserChat(true);
    //             }, 50);
    //         }

    //         lastScrollPosition.current = scrollTop;
    //     }, 150), 
    //     [hasMore, loading, loadingMore, isLoadingLock]
    // );

    const handleScroll = useCallback(
        debounce(() => {
            if (!chatContainerRef.current || loading || loadingMore || isLoadingLock) {
                console.log("Scroll handling skipped due to:", { loading, loadingMore, isLoadingLock });
                return;
            }
    
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            const isNearTop = scrollTop < 150; // Increased tolerance for "near top"
            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 5;
    
            // Update bottom detection
            setIsUserAtBottom(isNearBottom);
    
            // Only load more if we're near the top, have more to load, and not already loading
            if (isNearTop && hasMore && !loadingMore && !isLoadingLock) {
    
                // Set scroll lock immediately to prevent multiple calls
                setIsLoadingLock(true);
                setIsScrolling(true);
    
                if (chatContainerRef.current) {
                    // Important: Save the exact current scroll height before loading more
                    preserveScrollPosition.current = chatContainerRef.current.scrollHeight;
                }
    
                // Small delay before actual loading to ensure UI state is updated
                setTimeout(() => {
                    getUserChat(true);  // Fetch more messages
                }, 50);
            }
    
            lastScrollPosition.current = scrollTop;
        }, 150), // Increased debounce time
        [hasMore, loading, loadingMore, isLoadingLock]
    );

    useEffect(() => {
        return () => {
            handleScroll.cancel()
            if (scrollLockTimeout.current) {
                clearTimeout(scrollLockTimeout.current);
            }
        }
    }, [handleScroll])


    useEffect(() => {

        const lastMessage = userChat[userChat.length - 1];
        const isNewMessageFromCurrentUser = lastMessage && Number(lastMessage.from_id) === userID;

        if (isNewMessageFromCurrentUser || isUserAtBottom) {
            scrollToBottom(true);
        }
    }, [userChat.length, scrollToBottom, isUserAtBottom, userID]);



    useEffect(() => {
        const lastMessage = userChat[userChat.length - 1];
        const isNewMessageFromOther = lastMessage && Number(lastMessage.from_id) !== userID;

        if (isNewMessageFromOther && isUserAtBottom) {
            scrollToBottom(true);
        }
    }, [userChat[userChat.length - 1], userID, isUserAtBottom, scrollToBottom]);



    // useEffect(() => {
    //     if (preserveScrollPosition.current && chatContainerRef.current) {
    //         const { scrollHeight, scrollTop } = chatContainerRef.current;

    //         chatContainerRef.current.scrollTop = scrollHeight - preserveScrollPosition.current
    //         preserveScrollPosition.current = null
    //     }
    // }, [userChat])



    // useEffect(() => {
    //     if (preserveScrollPosition.current && chatContainerRef.current && loadingMore) {
    //         const { scrollHeight } = chatContainerRef.current
    //         const previousHeight = preserveScrollPosition.current
    //         const newPosition = scrollHeight - previousHeight


    //         console.log("Adjusting scroll position:", {
    //             scrollHeight,
    //             previousHeight,
    //             newPosition
    //         });

    //         if (newPosition > 0) {
    //             requestAnimationFrame(() => {
    //                 if (chatContainerRef.current) {
    //                     chatContainerRef.current.scrollTop = newPosition;

    //                     requestAnimationFrame(() => {
    //                         if (chatContainerRef.current) {
    //                             const currentPos = chatContainerRef.current.scrollTop;
    //                             if (Math.abs(currentPos - newPosition) > 10) {
    //                                 console.log("First adjustment didn't work, trying again");
    //                                 chatContainerRef.current.scrollTop = newPosition;
    //                             }

    //                             setTimeout(() => {
    //                                 setIsScrolling(false);
    //                                 console.log("Reset scrolling flag");
    //                             }, 300);
    //                         }
    //                     });
    //                 }
    //             });
    //         }
    //         preserveScrollPosition.current = null
    //     }
    //     else if (loadingMore && !preserveScrollPosition.current) {

    //         setTimeout(() => {
    //             setIsScrolling(false);
    //             console.log("Reset scrolling flag (no position preserved)");
    //         }, 200)
    //     }
    // }, [userChat, loadingMore])

    useEffect(() => {
        if (preserveScrollPosition.current && chatContainerRef.current && loadingMore) {
            const { scrollHeight } = chatContainerRef.current
            const previousHeight = preserveScrollPosition.current
            const newPosition = scrollHeight - previousHeight
    
            console.log("Adjusting scroll position:", {
                scrollHeight,
                previousHeight,
                newPosition
            });
    
            if (newPosition > 0) {
                // Use requestAnimationFrame for more reliable DOM updates
                requestAnimationFrame(() => {
                    if (chatContainerRef.current) {
                        chatContainerRef.current.scrollTop = newPosition;
    
                        requestAnimationFrame(() => {
                            if (chatContainerRef.current) {
                                const currentPos = chatContainerRef.current.scrollTop;
                                if (Math.abs(currentPos - newPosition) > 10) {
                                    console.log("First adjustment didn't work, trying again");
                                    chatContainerRef.current.scrollTop = newPosition;
                                }
    
                                setTimeout(() => {
                                    setIsScrolling(false);
                                    console.log("Reset scrolling flag");
                                }, 300);
                            }
                        });
                    }
                });
            }
            preserveScrollPosition.current = null;
        }
        else if (loadingMore && !preserveScrollPosition.current) {
            // If we're loading more but don't have a position to preserve,
            // still reset the scrolling flag
            setTimeout(() => {
                setIsScrolling(false);
                console.log("Reset scrolling flag (no position preserved)");
            }, 200)
        }
    }, [userChat, loadingMore]);


    useEffect(() => {
        if (!chatID) return

        setOffset(0)
        setHasMore(true)
        setIsUserAtBottom(true)
        setUserChat([])
        lastScrollPosition.current = 0
        preserveScrollPosition.current = null


        if (scrollLockTimeout.current) {
            clearTimeout(scrollLockTimeout.current);
            scrollLockTimeout.current = null;
        }

        getUserChat(false)

        return () => {
            setUserChat([])
            setOffset(0)
            setHasMore(true)
            setIsUserAtBottom(true)
            lastScrollPosition.current = 0
            preserveScrollPosition.current = null

            if (scrollLockTimeout.current) {
                clearTimeout(scrollLockTimeout.current);
                scrollLockTimeout.current = null;
            }
        }
    }, [chatID])


    const sendMessage = async () => {
        const newchatID = Number(chatID);
        setSendTextLoading(true);

        const localTime = new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });

        const formData = new FormData();
        formData.append("to_id", newchatID);
        formData.append("from_id", userID);
        formData.append("message", textMessage);

        formData.append("created_at", localTime);
        formData.append("updated_at", localTime);
        formData.append("local_time", localTime);


        if (mediaType) {
            formData.append("media_type", mediaType);
        }

        if (chatImg) {
            formData.append("media", chatImg);
        }

        if (chatVideo) {
            formData.append("media", chatVideo);
        }

        if (chatAudio) {
            formData.append("media", chatAudio);
        }




        try {
            const response = await api.post("/api/chat/send-message", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });


            if (response.data.status == "success") {
                // setUserChat(prev => [...prev, {
                //     ...response.data.data,
                //     local_time: new Date(response.data.data.created_at.replace(" ", "T")).toLocaleString("en-GB", {
                //         hour12: false
                //     })
                // }]);
                setUserChat(prev => [
                    ...prev,
                    {
                        ...response.data.data,
                        local_time: new Date(response.data.data.created_at.replace(" ", "T") + "Z").toISOString()
                    }
                ]);
                setTextMessage('');
                setChatImg(null);
                setChatVideo(null);
                setChatAudio(null);
                setSendTextLoading(false);

            } else {
                toast.error(response.data.message);
                setSendTextLoading(false);
            }
        } catch (error) {
            toast.error("Error while sending message.");
        } finally {
            setSendTextLoading(false);
        }
    };



    return (
        <div className="container d-flex justify-content-center">
            <div className={`card mt-5 ${styles.chatCard}`}>
                <div className={`d-flex flex-row justify-content-between p-3 ${styles.adiv} text-white`}>
                    <i className="fas fa-chevron-left"></i>
                    <div className="d-flex align-items-center">
                        <Image
                            src={!chat?.avatar || chat?.avatar.trim() === ""
                                ? 'https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png'
                                : chat?.avatar}
                            className="rounded-circle me-2"
                            width={30}
                            height={30}
                            style={{ objectFit: 'cover' }}
                            loader={({ src }) => src}
                            alt="user-img"
                        />
                        <h6 className="mt-2 fw-light">{chat?.first_name}</h6>
                    </div>
                    <i className="fas fa-times" onClick={onClose} style={{ cursor: "pointer" }}></i>
                </div>


                {/* Scrollable Messages Container */}

                <div className={`px-3 py-2  ${styles.messageContainer}`}
                    ref={chatContainerRef}
                    onScroll={handleScroll}
                >

                    {loadingMore && (
                        <div className="text-center p-2">
                            <div className="spinner-border spinner-border-sm text-secondary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}

                    {/* {!loadingMore && hasMore && (
                        <div className="text-center p-2">
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => {
                                    if (chatContainerRef.current) {
                                        preserveScrollPosition.current = chatContainerRef.current.scrollHeight
                                    }
                                    getUserChat(true)
                                    debugLoadingState()
                                }}
                            >
                                Load more messages
                            </button>
                        </div>
                    )} */}


                    {
                        loading ? (
                            <>
                                <div className="p-3">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="rounded-circle bg-secondary placeholder-glow" style={{ width: "40px", height: "40px" }}></div>
                                        <div className="ms-2 w-50">
                                            <div className="placeholder-glow">
                                                <span className="placeholder col-8 rounded"></span>
                                            </div>
                                            <div className="placeholder-glow mt-1">
                                                <span className="placeholder col-6 rounded"></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end mb-3">
                                        <div className="bg-secondary placeholder-glow p-3 rounded w-50">
                                            <span className="placeholder col-8 rounded"></span>
                                            <div className="placeholder col-6 rounded mt-2"></div>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle bg-secondary placeholder-glow" style={{ width: "40px", height: "40px" }}></div>
                                        <div className="ms-2 w-50">
                                            <div className="placeholder-glow">
                                                <span className="placeholder col-8 rounded"></span>
                                            </div>
                                            <div className="placeholder-glow mt-1">
                                                <span className="placeholder col-6 rounded"></span>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </>
                        ) :

                            (
                                userChat?.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).map((chatMessage, index) => {
                                    const isSentByUser = Number(chatMessage.from_id) === userID;
                                    // const formattedTime = new Date(chatMessage.local_time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" , hour12: true});
                                    // const formattedTime = new Date(chatMessage.created_at.replace(" ", "T")).toLocaleTimeString("en-US", { 
                                    //     hour: "2-digit", 
                                    //     minute: "2-digit", 
                                    //     hour12: true 
                                    // });

                                    const formattedTime = chatMessage.local_time
                                        ? new Date(chatMessage.local_time).toLocaleTimeString("en-GB", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true
                                        })
                                        : "Time Unavailable";

                                    const messageDate = new Date(chatMessage.created_at).toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                    });
                                    const previousMessageDate =
                                        index > 0
                                            ? new Date(userChat[index - 1].created_at).toLocaleDateString("en-US", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "short",
                                                day: "2-digit",
                                            })
                                            : null;
                                    return (
                                        <React.Fragment key={index}>
                                            {messageDate !== previousMessageDate && (
                                                <div className="text-center my-2">
                                                    <span className="bg-light px-3 py-1 rounded-pill text-muted" style={{ fontSize: "13px" }}>{messageDate}</span>
                                                </div>
                                            )}
                                            <div className={`d-flex flex-row align-items-center p-2 ${isSentByUser ? "justify-content-end" : "justify-content-start"}`}
                                                onMouseEnter={() => setHoveredMessage(chatMessage.id)}
                                                onMouseLeave={() => setHoveredMessage(null)}
                                            >
                                                {
                                                    isSentByUser && hoveredMessage === chatMessage.id &&
                                                    <div className="small">

                                                        <i className="bi bi-three-dots-vertical" data-bs-toggle="dropdown" aria-expanded="false" />
                                                        <ul className="dropdown-menu text-center" >
                                                            <li><button className="dropdown-item" onClick={() => {
                                                                setShowMessageModal(true)
                                                                setChatMessageID(chatMessage.id)

                                                            }}> <span className="fw-bold small"> Delete - </span> <i className="bi bi-trash3 text-danger fs-6" /></button></li>
                                                        </ul>

                                                    </div>

                                                }
                                                {!isSentByUser && (
                                                    <Image
                                                        src={
                                                            !chat?.avatar || chat?.avatar.trim() === ""
                                                                ? "https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png"
                                                                : chat?.avatar
                                                        }
                                                        className="rounded-circle me-1 flex-shrink-0"
                                                        width={25}
                                                        height={25}
                                                        style={{ objectFit: "cover" }}
                                                        loader={({ src }) => src}
                                                        alt="user-img"
                                                    />
                                                )}
                                                <div
                                                    className={`p-2  ${isSentByUser ? `${styles.bgWhite} ps-3 text-start ` : `${styles.chat} pe-4`}`}
                                                    style={{
                                                        borderRadius: "5px",
                                                        background: isSentByUser ? "#FDF7F4" : "#e2ffe8",
                                                    }}
                                                >
                                                    <div className="row">
                                                        {
                                                            chatMessage.media && chatMessage.media_type == "1" ?
                                                                <Image
                                                                    src={chatMessage?.media}
                                                                    className=" me-1 flex-shrink-0"
                                                                    width={25}
                                                                    height={55}
                                                                    style={{ objectFit: "contain" }}
                                                                    loader={({ src }) => src}
                                                                    alt="chat-img"
                                                                />
                                                                :
                                                                null


                                                        }

                                                        {
                                                            chatMessage.media && chatMessage.media_type == "2" ?
                                                                <video
                                                                    controls
                                                                    style={{
                                                                        objectFit: "cover",
                                                                        width: "100%",
                                                                        height: "auto",
                                                                    }}
                                                                >
                                                                    <source
                                                                        src={chatMessage?.media}
                                                                        type="video/mp4"
                                                                    />
                                                                    Your browser does not support the video tag.
                                                                </video>
                                                                :
                                                                null


                                                        }


                                                        {chatMessage.media && chatMessage.media_type == "4" && (
                                                            <div className="media-container w-100 d-flex align-items-center">
                                                                <audio key={chatAudio} controls className="w-100" style={{ minWidth: chatMessage.message ? "15em" : "14em", height: "30px", maxWidth: "200px" }}>
                                                                    <source src={chatMessage?.media} type="audio/mpeg" />
                                                                    Your browser does not support the audio tag.
                                                                </audio>
                                                            </div>
                                                        )}
                                                        <span className={chatMessage?.media ? "text-center text-muted fw-bold mt-2" : "text-muted fw-bold"}>
                                                            {chatMessage.message}
                                                        </span>

                                                    </div>


                                                    <div className={`text-muted small mt-1 text-${isSentByUser ? "end" : "start"}`}>
                                                        {formattedTime}
                                                    </div>
                                                </div>


                                            </div>
                                        </React.Fragment>
                                    );
                                })
                            )
                    }
                    <div ref={messagesEndRef}></div>
                </div>

                <div className="d-flex align-items-center">
                    {
                        // textMessage && (
                        <OverlayTrigger
                            trigger="click"
                            placement="top"
                            overlay={popoverTop}
                            // onToggle={(nextShow) => setShowPopover(nextShow)}
                            // ref={overlayRef}
                            show={showPopover}
                        >
                            <i className="bi bi-patch-plus-fill text-primary fs-5 ms-2 mb-2"
                                style={{ cursor: "pointer" }}
                                onClick={() => setShowPopover(!showPopover)}
                            />
                        </OverlayTrigger>
                        // )

                    }


                    <div className="w-100">

                        <div className="form-group px-2 d-flex align-items-center position-relative">

                            {selectedImage && (
                                <div className="position-relative me-1 mb-2">
                                    <Image
                                        src={selectedImage}
                                        alt="Preview"
                                        width={50}
                                        height={50}
                                        style={{ borderRadius: "8px", objectFit: "cover" }}
                                    />
                                    {/* Remove Image Button */}
                                    <button
                                        onClick={removeImage}
                                        className="btn btn-sm btn-light text-danger position-absolute small"
                                        style={{ top: "-8px", right: "-5px", borderRadius: "50%", padding: "0 0" }}
                                    >
                                        <i className="bi bi-x" />
                                    </button>
                                </div>
                            )}

                            {chatVideo && videoPreviewUrl && (
                                <div className="position-relative me-1 mb-2">
                                    <video
                                        src={videoPreviewUrl}
                                        width={50}
                                        height={50}
                                        controls
                                        style={{ borderRadius: "8px", objectFit: "cover" }}
                                    />
                                    <button
                                        onClick={removeVideo}
                                        className="btn btn-sm btn-light text-danger position-absolute small "
                                        style={{ top: "-8px", right: "-5px", borderRadius: "50%", padding: "0 0" }}
                                    >
                                        <i className="bi bi-x" />
                                    </button>
                                </div>
                            )}


                            {
                                chatAudio && audioPreviewUrl && (

                                    <div className="position-relative me-1 mb-2 mt-2 ms-4">

                                        <audio
                                            controls
                                            style={{ width: "15em", height: "30px" }}
                                        >
                                            <source src={audioPreviewUrl}
                                            />
                                            Your browser does not support the video tag.
                                            {/* type={audioPreviewUrl.file.type} */}
                                        </audio>
                                        <button
                                            onClick={removeAudio}
                                            className="btn btn-sm btn-light text-danger position-absolute small "
                                            style={{ top: "-10px", right: "-5px", borderRadius: "50%", padding: "0 0" }}
                                        >
                                            <i className="bi bi-x" />
                                        </button>
                                    </div>

                                )
                            }

                            {
                                chatAudio ? null :
                                    <textarea
                                        className={`form-control ${styles.formControl}`}
                                        value={textMessage}
                                        onChange={(e) => setTextMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                !textMessage ? null : sendMessage();
                                            }
                                        }}
                                        placeholder="Type your message..."
                                        rows={3}
                                        style={{ resize: "none" }}

                                    ></textarea>
                            }

                        </div>
                    </div>


                    {/* {
                        textMessage ? || chatAudio ? 
                        
                        
                        
                        (
                            
                            <div className="d-flex align-items-center px-2 me-1">
                                {
                                    sendTextLoading ? <span className="text-center text-primary"> <i className="bi bi-three-dots"></i> </span> :
                                        <i onClick={sendMessage} className="bi bi-send-fill text-primary fs-5 mb-2" style={{ cursor: "pointer", transform: "rotate(45deg)" }} />
                                }
                            </div>

                        )
                    } */}

                    {((textMessage) || chatAudio || chatVideo || chatImg) && (
                        <div className="d-flex align-items-center px-2 me-1">
                            {sendTextLoading ? (
                                <span className="text-center text-primary">
                                    <i className="bi bi-three-dots"></i>
                                </span>
                            ) : (
                                <i
                                    onClick={sendMessage}
                                    className="bi bi-send-fill text-primary fs-5 mb-2"
                                    style={{ cursor: "pointer", transform: "rotate(45deg)" }}
                                />
                            )}
                        </div>
                    )}

                </div>

                {
                    showMessageModal && (
                        <MessageDeleteModal
                            showMessageModal={showMessageModal}
                            setShowMessageModal={setShowMessageModal}
                            setUserChat={setUserChat}
                            chatMessageID={chatMessageID}
                            setIsUserAtBottom={setIsUserAtBottom}
                        />
                    )
                }

            </div>
        </div>
    );
};

export default ChatWindow;