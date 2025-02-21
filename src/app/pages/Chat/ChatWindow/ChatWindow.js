import Image from "next/image";
import { toast } from "react-toastify";
import createAPI from "@/app/lib/axios";
import styles from "../css/ChatWindow.module.css";
import React, { useState, useEffect } from "react";

const ChatWindow = ({ chat, onClose }) => {

    const api = createAPI();
    const userID = localStorage.getItem('userid');

    const [textArea, setTextArea] = useState('');
    const [userChat, setUserChat] = useState([]);



    console.log("chat data", chat.id);

    //   setLoadingChats(true);

    const getUserChat = async () => {

        const chatID = chat?.id;
        if (!chatID) return;
        try {
            const formdata = new FormData();
            formdata.append("to_id", chatID);

            const response = await api.post("/api/chat/get-user-chat", formdata, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })

            if (response.data.status === "success") {

                setUserChat(response.data.data);
                // console.log(response)
            } else {
                toast.error("Failed to load chats.");
            }
        } catch (err) {
            console.log(err)
            toast.error("Error fetching chats. Please try again in a while.");
        } finally {
            // setLoadingChats(false);
        }
    };

    useEffect(() => {
        if (chat?.id) {
            getUserChat();
        }
    }, [chat?.id]);


    console.log("userChat", userChat)



    // function getUserChat() {
    //     const formdata = new FormData();
    //     formdata.append("to_id", chat?.id);

    //     api.post("/api/chat/get-user-chat", formdata, {
    //         headers: {
    //             "Content-Type": "multipart/form-data",
    //         }
    //     })
    //         .then((response) => console.log(response.data))
    //         .catch((error) => console.error(error));
    // }

    // useEffect(() => {
    //     if (chat?.id) {
    //         getUserChat();
    //     }
    // }, [chat?.id]);

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
                            width={35}
                            height={35}
                            style={{ objectFit: 'cover' }}
                            loader={({ src }) => src}
                            alt="user-img"
                        />
                        <h6 className="mt-2 fw-light">{chat?.first_name}</h6>
                    </div>
                    <i className="fas fa-times" onClick={onClose} style={{ cursor: "pointer" }}></i>
                </div>


                {/* Scrollable Messages Container */}
                <div className={`px-3 py-2 ${styles.messageContainer}`}>
                    {/* 
                    <div className="d-flex flex-row align-items-center justify-content-end p-2">
                        <div className={`bg-white p-3 ${styles.bgWhite}`} style={{ borderRadius: "20px" }}>
                            <span className="text-muted">Hello and thank you for visiting Birdlymind.</span>
                        </div>
                        <img
                            src="https://img.icons8.com/color/48/000000/circled-user-male-skin-type-7.png"
                            width="30"
                            height="30"
                            className="ms-2"
                        />
                    </div> */}
                    {/* 
                    {
                        userChat?.map((userChat) => {

                            userID === userChat.from_id ?
                                (
                                    <div className="d-flex flex-row align-items-center justify-content-end p-2">
                                        <div className={`bg-white p-3 ${styles.bgWhite}`} style={{ borderRadius: "20px" }}>
                                            <span className="text-muted">{userChat.message}</span>
                                        </div>
                                    </div>
                                )
                                :
                                (

                                    <div className="d-flex flex-row align-items-center justify-content-start p-2">
                                        <Image
                                            src={!chat?.avatar || chat?.avatar.trim() === ""
                                                ? 'https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png'
                                                : chat?.avatar}
                                            className="rounded-circle me-1 flex-shrink-0"
                                            width={35}
                                            height={35}
                                            style={{ objectFit: 'cover' }}
                                            loader={({ src }) => src}
                                            alt="user-img"
                                        />
                                        <div className={`chat p-3 ${styles.chat}`}>{userChat?.message}</div>
                                    </div>

                                )
                        })
                    } */}

                    {/* <div className="d-flex flex-row align-items-center justify-content-start p-2">
                        <Image
                            src={!chat?.avatar || chat?.avatar.trim() === ""
                                ? 'https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png'
                                : chat?.avatar}
                            className="rounded-circle me-1 flex-shrink-0"
                            width={35}
                            height={35}
                            style={{ objectFit: 'cover' }}
                            loader={({ src }) => src}
                            alt="user-img"
                        />
                        <div className={`chat p-3 ${styles.chat}`}>{chat?.last_message}</div>
                    </div>

                    <div className="d-flex flex-row align-items-center justify-content-end p-2">
                        <div className={`bg-white p-3 ${styles.bgWhite}`} style={{ borderRadius: "20px" }}>
                            <span className="text-muted">Hello and thank you for visiting birdlynind.</span>
                        </div>
                    </div>
                    <div className="d-flex flex-row align-items-center justify-content-end p-2">
                        <div className={`bg-white p-3 ${styles.bgWhite}`} style={{ borderRadius: "20px" }}>
                            <span className="text-muted">Hello and thank you for visiting birdlynind.</span>
                        </div>
                    </div>

                    <div className="d-flex flex-row align-items-center justify-content-end p-2">
                        <div className={`bg-white p-3 ${styles.bgWhite}`} style={{ borderRadius: "20px" }}>
                            <span className="text-muted">Hello and thank you</span>
                        </div>
                    </div>

                    <div className="d-flex flex-row align-items-center justify-content-end p-2">
                        <div className={`bg-white p-3 ${styles.bgWhite}`} style={{ borderRadius: "20px" }}>
                            <span className="text-muted">Hey</span>
                        </div>
                    </div> */}




                    {/* {userChat?.map((chatMessage, index) => {
                        const userID = localStorage.getItem("userid");
                        const isSentByUser = chatMessage.from_id === userID || chatMessage.to_id === userID;

                        return (
                            <div key={index}>

                                <div
                                    className={`d-flex flex-row align-items-center ${isSentByUser ? "justify-content-end" : "justify-content-start"} p-2`}
                                >
                                    {!isSentByUser && (
                                        <Image
                                            src={
                                                !chat?.avatar || chat?.avatar.trim() === ""
                                                    ? "https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png"
                                                    : chat?.avatar
                                            }
                                            className="rounded-circle me-1 flex-shrink-0"
                                            width={35}
                                            height={35}
                                            style={{ objectFit: "cover" }}
                                            loader={({ src }) => src}
                                            alt="user-img"
                                        />
                                    )}

                                    <div
                                        className={`p-3 ${isSentByUser ? styles.bgWhite : styles.chat}`}
                                        style={{
                                            borderRadius: "20px",
                                            background: isSentByUser ? "#fff" : "#e2ffe8",
                                        }}
                                    >
                                        <span className="text-muted">{chatMessage.message}</span>
                                    </div>
                                </div>
                            </div>

                        );
                    })} */}

                    {/* {userChat?.map((chatMessage, index) => {
                        const userID = Number(localStorage.getItem("userid"));

                        console.log(`Message: ${chatMessage.message}`);
                        console.log(`From ID: ${chatMessage.from_id}, To ID: ${chatMessage.to_id}, User ID: ${userID}`);
                        console.log(`Comparison: from_id === userID ->`, Number(chatMessage.from_id) === userID);
                        console.log(`Comparison: to_id === userID ->`, Number(chatMessage.to_id) === userID);

                        if (Number(chatMessage.from_id) === userID || Number(chatMessage.to_id) === userID) {
                            return (
                                <div key={index} className="d-flex flex-row align-items-center justify-content-end p-2">
                                    <div className={`bg-white p-3 ${styles.bgWhite}`} style={{ borderRadius: "20px" }}>
                                        <span className="text-muted fw-bold">{chatMessage.message}</span>
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <div key={index} className="d-flex flex-row align-items-center justify-content-start p-2">
                                    <Image
                                        src={
                                            !chat?.avatar || chat?.avatar.trim() === ""
                                                ? "https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png"
                                                : chat?.avatar
                                        }
                                        className="rounded-circle me-1 flex-shrink-0"
                                        width={35}
                                        height={35}
                                        style={{ objectFit: "cover" }}
                                        loader={({ src }) => src}
                                        alt="user-img"
                                    />
                                    <span className={`chat p-3 ${styles.chat}`} style={{ background: "#e2ffe8", borderRadius: "20px" }}>
                                        {chatMessage.message}
                                    </span>
                                </div>
                            );
                        }
                    })} */}

                    {userChat?.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).map((chatMessage, index) => {
                        const userID = Number(localStorage.getItem("userid"));
                        const isSentByUser = Number(chatMessage.from_id) === userID;
                        const formattedTime = new Date(chatMessage.updated_at)
                            .toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

                        return (
                            <div
                                key={index}
                                className={`d-flex flex-row align-items-center p-2 ${isSentByUser ? "justify-content-end" : "justify-content-start"
                                    }`}
                            >
                                {!isSentByUser && (
                                    <Image
                                        src={
                                            !chat?.avatar || chat?.avatar.trim() === ""
                                                ? "https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png"
                                                : chat?.avatar
                                        }
                                        className="rounded-circle me-1 flex-shrink-0"
                                        width={35}
                                        height={35}
                                        style={{ objectFit: "cover" }}
                                        loader={({ src }) => src}
                                        alt="user-img"
                                    />
                                )}
                                <div
                                    className={`p-3 ${isSentByUser ? styles.bgWhite : styles.chat}`}
                                    style={{
                                        borderRadius: "20px",
                                        background: isSentByUser ? "#fff" : "#e2ffe8",
                                    }}
                                >
                                    <span className="text-muted fw-bold">{chatMessage.message}</span>
                                    <div className={`text-muted small mt-1 text-${isSentByUser ? "end" : "start"}`}>
                                    {formattedTime}
                                </div>
                                </div>
                            
                            </div>
                        );
                    })}

          </div>
                {/* Scrollable Messages Container */}


                <div className="d-flex align-items-center">
                    <div className="w-100">
                        <div className="form-group px-2">
                            <input className={`form-control ${styles.formControl}`} rows="2" placeholder="Type your message..."
                                onChange={(e) => setTextArea(e.target.value)}
                            ></input>
                        </div>
                    </div>
                    {
                        textArea && (
                            <div className="d-flex align-items-center px-2">
                                <i onClick={() => alert("Show data")} className="bi bi-send-fill text-primary fs-5 me-3 mb-2" style={{ cursor: "pointer" }} />
                            </div>

                        )
                    }

                </div>

            </div>
        </div>
    );
};

export default ChatWindow;