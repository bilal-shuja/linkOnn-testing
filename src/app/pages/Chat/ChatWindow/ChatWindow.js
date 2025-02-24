import Image from "next/image";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import styles from "../css/ChatWindow.module.css";
import React, { useState, useEffect, useRef } from "react";
import MessageDeleteModal from "@/app/pages/Modals/MessageDeleteModal";

const ChatWindow = ({ chat, onClose }) => {

    const api = createAPI();
    const limit = 20;
    const userID = Number(localStorage.getItem("userid"));

    const [textMessage, setTextMessage] = useState('');
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [userChat, setUserChat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sendTextLoading, setSendTextLoading] = useState(false)
    const [hoveredMessage, setHoveredMessage] = useState(null);
    const [chatMessageID, setChatMessageID] = useState('');

    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [isUserAtBottom, setIsUserAtBottom] = useState(true);


    const [msg , setMsg] = useState([])
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const getUserChat = async (pageNum = 1, append = false) => {

        const chatID = chat?.id;
        if (!chatID) return;
        if (!chatID || (!hasMore && pageNum > 1)) return;
        try {
            if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);

            const formdata = new FormData();
            formdata.append("to_id", chatID);
            formdata.append("limit", limit);
            formdata.append("page", pageNum);


            const prevScrollHeight = chatContainerRef.current?.scrollHeight || 0;

            const response = await api.post("/api/chat/get-user-chat", formdata, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            console.log("API Response:", response);
            // if (response.data.status === "success") {

            //     setUserChat(response.data.data);

            //     const newMessages = response.data.data;
            //     if (newMessages.length < limit) {
            //         setHasMore(false);
            //     }

            //     if (append) {
            //         setUserChat(prev => [...newMessages, ...prev]);
            //     } else {
            //         setUserChat(newMessages);
            //         scrollToBottom(true);
            //     }
            //     if (newMessages.length !== userChat.length) {
            //         setUserChat(newMessages);
            //         scrollToBottom(true);
            //     }
            // } 
            
            if (response.data.status === "success") {
                const newMessages = response.data.data;
    
                if (newMessages.length < limit) setHasMore(false);
    
                if (append) {
                    setUserChat(prev => {
                        const existingIds = new Set(prev.map(msg => msg.id));
                        return [...newMessages.filter(msg => !existingIds.has(msg.id)), ...prev];
                    });
    
                    setTimeout(() => {
                        if (chatContainerRef.current) {
                            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight - prevScrollHeight;
                        }
                    }, 100);
                } else {
                    setUserChat(newMessages);
                    scrollToBottom();
                }

                setMsg((prevMessages) => [...newMessages, ...prevMessages]);
            }
            else {
                toast.error("Failed to load chats.");
            }
        } catch (err) {
            toast.error("Error fetching chats. Please try again in a while.");
        } finally {
            if (pageNum === 1) setLoading(false);
            else setLoadingMore(false);
        }
    };


    useEffect(() => {
        if (chat?.id) {
            setPage(1);
            setHasMore(true);
            getUserChat(1, false);

        }
    }, [chat?.id]);


    const scrollToBottom = (smooth = true) => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
        }
    };


    // const handleScroll = () => {
    //     if (chatContainerRef.current) {
    //         const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    //         setIsUserAtBottom(scrollTop + clientHeight >= scrollHeight - 10);

    //         if (scrollTop === 0 && hasMore && !loadingMore && !loading) {
    //             setPage(prev => prev + 1);
    //             getUserChat(page + 1, true);
    //         }
    //     }
    // };

    const handleScroll = () => {
        if (!chatContainerRef.current) return;
        
        const { scrollTop } = chatContainerRef.current;
        
        if (scrollTop === 0 && hasMore && !loadingMore && !loading) {
            setLoadingMore(true);
            setPage(prevPage => prevPage + 1);
        }
    };
    

    // useEffect(() => {
    //     if (!loading && isUserAtBottom || userChat.length > 0) {
    //         scrollToBottom(true);
    //     }
    // }, [userChat, userChat.length, loading]);

    // useEffect(() => {
    //     if ((!loading && isUserAtBottom) || (userChat.length > 0 && page === 1)) {
    //         scrollToBottom(true);
    //     }
    // }, [userChat, userChat.length, loading, page]);


    useEffect(() => {
        if (!loading && page === 1) {
            scrollToBottom(true);
        }
    }, [userChat, loading, page]);

    useEffect(() => {
        if (page > 1) {
            getUserChat(page, true);
        }
    }, [page]);

    const sendMessage = async () => {
        const chatID = Number(chat?.id);
        setSendTextLoading(true);

        const chatObj = {
            to_id: chatID,
            from_id: userID,
            message: textMessage,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }


        try {
            const response = await api.post("/api/chat/send-message", chatObj, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            if (response.data.status == "success") {
                setUserChat(prev => [...prev, response.data.data]);
                setTextMessage('');
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

                <div className={`px-3 py-2 ${styles.messageContainer}`}
                    style={{ maxHeight: "400px", overflowY: "auto" }}
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
                                                className={`p-3 ${isSentByUser ? styles.bgWhite : styles.chat}`}
                                                style={{
                                                    borderRadius: "20px",
                                                    background: isSentByUser ? "#FDF7F4" : "#e2ffe8",
                                                }}
                                            >
                                                <span className="text-muted fw-bold">{chatMessage.message}
                                                </span>

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
                    <div className="w-100">
                        <div className="form-group px-2">
                            <input
                                className={`form-control ${styles.formControl}`}
                                value={textMessage}
                                onChange={(e) => setTextMessage(e.target.value)}
                                placeholder="Type your message..."

                            ></input>
                        </div>
                    </div>
                    {
                        textMessage && (
                            <div className="d-flex align-items-center px-2">
                                {
                                    sendTextLoading ? <span className="text-center"> ...... </span> :
                                        <i onClick={sendMessage} className="bi bi-send-fill text-primary fs-5 me-3 mb-2" style={{ cursor: "pointer" }} />
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