"use client"

import Image from "next/image";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import styles from "../css/ChatWindow.module.css";
import { OverlayTrigger, Popover } from "react-bootstrap";
import React, { useState, useEffect, useRef, useCallback } from "react";
import MessageDeleteModal from "@/app/pages/Modals/MessageDeleteModal";

const ChatWindow = ({ chat, onClose }) => {

    const api = createAPI();
    const limit = 20;
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


    const [mediaType, setMediaType] = useState('')


    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);



    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {

            if (file.size > 100 * 1024 * 1024) {
                alert("File size should not exceed 100MB!");
                return; // Stop further execution
            }
            setMediaType(1)
            setChatImg(file)

            // Create a preview URL
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    // Remove selected image
    const removeImage = () => {
        setSelectedImage(null);
    };

    const popoverTop = (
        <Popover id="popover-positioned-top">
            <Popover.Body>
                <div className="chat-img" style={{ cursor: "pointer" }}>
                    <input type="file" id="fileInput" style={{ display: "none" }}

                        onChange={handleFileChange}
                    />

                    <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
                        <i className="bi bi-file-earmark-image text-primary fs-5" />
                        <span className="fw-bold">Attach a file up to 100 MB</span>
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

    //   const fetchNewMessages = useCallback(async () => {
    //     if (!chat?.id || !lastMessageTimestamp) return

    //     try {
    //       const formdata = new FormData()
    //       formdata.append("to_id", chat.id)

    //       const response = await api.post("/api/chat/get-user-chat", formdata, {
    //         headers: {
    //           "Content-Type": "multipart/form-data",
    //         },
    //       })

    //       if (response.data.status === "success") {
    //         const allMessages = response.data.data;
    //         const newMessages = allMessages.filter(msg => 
    //             new Date(msg.created_at).getTime() > lastMessageTimestamp
    //         );

    //         if (newMessages.length > 0) {
    //           setUserChat((prev) => {
    //             const updatedChat = [...prev]

    //             const existingIds = new Set(prev.map((msg) => msg.id))
    //             newMessages.forEach((msg) => {
    //               if (!existingIds.has(msg.id)) {
    //                 updatedChat.push(msg)
    //               }
    //             })

    //             updatedChat.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

    //             const timestamps = updatedChat.map((msg) => new Date(msg.created_at).getTime())
    //             setLastMessageTimestamp(Math.max(...timestamps))

    //             const hasNewMessagesFromOthers = newMessages.some((msg) => Number(msg.from_id) !== userID)
    //             if (hasNewMessagesFromOthers && isUserAtBottom) {
    //               setTimeout(() => scrollToBottom(true), 100)
    //             }

    //             return updatedChat
    //           })
    //         }
    //       }
    //     } catch (error) {
    //       console.error("Error fetching new messages:", error)
    //     }
    //   }, [api, chat?.id, lastMessageTimestamp, userID, isUserAtBottom])


    // const getUserChat = async () => {

    //     const chatID = chat?.id;
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
    //     if (chat?.id) {
    //         getUserChat();
    //     }
    // }, [chat?.id]);

    const fetchNewMessages = useCallback(async () => {
        if (!chat?.id || !lastMessageTimestamp) return;

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
                const newMessages = allMessages.filter(msg =>
                    new Date(msg.created_at).getTime() > lastMessageTimestamp
                );

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
    }, [chat?.id, lastMessageTimestamp]);


    useEffect(() => {
        if (!chat?.id) return;

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
    }, [chat?.id, fetchNewMessages]);



    useEffect(() => {
        if (!chat?.id) return;

        // Initial messages fetch
        const getUserChat = async () => {
            try {
                setLoading(true);
                const formdata = new FormData();
                formdata.append("to_id", chat.id);
                formdata.append("limit", limit);

                const response = await api.post("/api/chat/get-user-chat", formdata, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                });

                if (response.data.status === "success") {
                    setUserChat(response.data.data);
                    setHasMore(response.data.data.length >= limit);
                    scrollToBottom(true);
                } else {
                    toast.error("Failed to load chats.");
                }
            } catch (err) {
                toast.error("Error fetching chats. Please try again in a while.");
            } finally {
                setLoading(false);
            }
        };

        getUserChat();
    }, [chat?.id]);


    const scrollToBottom = (smooth = true) => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
        }
    };


    const handleScroll = () => {
        if (!chatContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        // Check if user is at bottom (within 10px tolerance)
        setIsUserAtBottom(scrollTop + clientHeight >= scrollHeight - 10);

        // Your existing code for loading more messages
        if (scrollTop === 0 && hasMore && !loadingMore && !loading) {
            //   setLoadingMore(true);
        }
    };


    useEffect(() => {

        const lastMessage = userChat[userChat.length - 1];
        const isNewMessageFromCurrentUser = lastMessage && Number(lastMessage.from_id) === userID;

        if (isNewMessageFromCurrentUser || isUserAtBottom) {
            scrollToBottom(true);
        }
    }, [userChat.length]);


    useEffect(() => {
        const lastMessage = userChat[userChat.length - 1];
        const isNewMessageFromOther = lastMessage && Number(lastMessage.from_id) !== userID;

        if (isNewMessageFromOther && isUserAtBottom) {
            scrollToBottom(true);
        }
    }, [userChat, userID, isUserAtBottom]);




    const sendMessage = async () => {
        const chatID = Number(chat?.id);
        setSendTextLoading(true);

        // const chatObj = {
        //     to_id: chatID,
        //     from_id: userID,
        //     message: textMessage,
        //     media_type: mediaType,
        //     media: chatImg,
        //     created_at: new Date().toISOString(),
        //     updated_at: new Date().toISOString(),
        // }

        console.log("Img", chatImg)

        const formData = new FormData();
        formData.append("to_id", chatID);
        formData.append("from_id", userID);
        formData.append("message", textMessage);
        formData.append("media_type", mediaType);

        // Append the image file only if it exists
        if (chatImg) {
            formData.append("media", chatImg); // Ensure chatImg is a File object
        }



        try {
            const response = await api.post("/api/chat/send-message", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            console.log(response)

            if (response.data.status == "success") {
                setUserChat(prev => [...prev, response.data.data]);
                setTextMessage('');
                setChatImg(null)
            } else {
                toast.error(response.data.message);
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
                    {/* 
                    {loadingMore && (
                        <div className="text-center p-2">
                            <div className="spinner-border spinner-border-sm text-secondary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )} */}


                    {loading ? (
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
                                const formattedTime = new Date(chatMessage.updated_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
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
                                                        chatMessage.media =="" ?
                                                        null
                                                        :
                                                        <Image
                                                        src={chatMessage?.media}
                                                        className=" me-1 flex-shrink-0"
                                                        width={25}
                                                        height={55}
                                                        style={{ objectFit:"contain" }}
                                                        loader={({ src }) => src}
                                                        alt="chat-img"
                                                    />

                                                    }
                                              
                                                <span className={chatMessage?.media?"text-center text-muted fw-bold":"text-muted fw-bold"}>
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
                        textMessage && (
                            <OverlayTrigger trigger="click" placement="top" overlay={popoverTop}>
                                <i className="bi bi-patch-plus-fill text-primary fs-5 ms-2 mb-2" />
                            </OverlayTrigger>
                        )

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
                                        className="btn btn-sm btn-light position-absolute small"
                                        style={{ top: "-8px", right: "-5px", borderRadius: "50%", padding: "0 0" }}
                                    >
                                        <i className="bi bi-x" />
                                    </button>
                                </div>
                            )}

                            <textarea
                                className={`form-control ${styles.formControl}`}
                                value={textMessage}
                                onChange={(e) => setTextMessage(e.target.value)}
                                placeholder="Type your message..."
                                // draggable="false"
                                height="200"

                            ></textarea>
                        </div>
                    </div>
                    {
                        textMessage && (
                            <div className="d-flex align-items-center px-2 me-1">
                                {
                                    sendTextLoading ? <span className="text-center text-primary"> <i className="bi bi-three-dots"></i> </span> :
                                        <i onClick={sendMessage} className="bi bi-send-fill text-primary fs-5 mb-2" style={{ cursor: "pointer", transform: "rotate(45deg)" }} />
                                }
                            </div>

                        )
                    }

                </div>

                {
                    showMessageModal && (
                        <MessageDeleteModal
                            showMessageModal={showMessageModal}
                            setShowMessageModal={setShowMessageModal}
                            setUserChat={setUserChat}
                            chatMessageID={chatMessageID}
                        />
                    )
                }

            </div>
        </div>
    );
};

export default ChatWindow;