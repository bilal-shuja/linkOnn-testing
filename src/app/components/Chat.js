"use client";

import { useState, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    avatar: "https://via.placeholder.com/150",
  });
  const [isChatVisible, setIsChatVisible] = useState(true); // Track visibility of the chat

  // Dummy data for messages
  const dummyMessages = [
    {
      id: "1",
      text: "Hello, how are you?",
      sender: "me",
      timestamp: "Just now",
      avatar: "https://via.placeholder.com/150",
    },
    {
      id: "2",
      text: "I'm good, thanks! How about you?",
      sender: "other",
      timestamp: "1 minute ago",
      avatar: "https://via.placeholder.com/150",
    },
    {
      id: "3",
      text: "I'm doing well, thank you!",
      sender: "me",
      timestamp: "2 minutes ago",
      avatar: "https://via.placeholder.com/150",
    },
    {
      id: "4",
      text: "I'm doing well, thank you!",
      sender: "me",
      timestamp: "2 minutes ago",
      avatar: "https://via.placeholder.com/150",
    },
    {
      id: "5",
      text: "I'm doing well, thank you!",
      sender: "me",
      timestamp: "2 minutes ago",
      avatar: "https://via.placeholder.com/150",
    },
  ];

  // Simulate fetching chat messages
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setMessages(dummyMessages);
      setLoading(false);
    }, 1000); // Simulate a network delay
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const tempMessage = {
        id: Date.now().toString(),
        text: newMessage,
        sender: "me",
        timestamp: "Just now",
        avatar: userInfo.avatar,
      };

      // Optimistic UI update
      setMessages((prevMessages) => [...prevMessages, tempMessage]);
      setNewMessage("");

      // Simulate a network request
      setTimeout(() => {
        // Simulate successful message send
        // Optionally, replace with an actual response if needed
      }, 1000);
    }
  };

  const closeChat = () => {
    setIsChatVisible(false); // Close the chat window
  };

  if (!isChatVisible) return null; // Return null if the chat is not visible

  return (
    <div
      className="chat-container border rounded shadow p-3"
      style={{ width: "400px", margin: "auto", backgroundColor: "#f8f9fa" }}
    >
      {/* Chat Header */}
      <div className="chat-header d-flex justify-content-between align-items-center mb-3">
        <h6 className="m-0">{userInfo.name}</h6>
        <span className="badge bg-success">Online</span>
        <button
          className="btn btn-sm btn-danger"
          onClick={closeChat}
          style={{ backgroundColor: "transparent", border: "none" }}
        >
          <i className="fas fa-times"></i> 
        </button>
      </div>

      {/* Chat Messages */}
      <div
        className="chat-messages border rounded p-3"
        style={{ height: "300px", overflowY: "auto", backgroundColor: "#fff" }}
      >
        {loading && <p>Loading messages...</p>}
        {error && <p className="text-danger">{error}</p>}
        {!loading &&
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`d-flex mb-2 ${
                msg.sender === "me" ? "justify-content-end" : "justify-content-start"
              }`}
            >
              {msg.sender !== "me" && (
                <img
                  src={msg.avatar}
                  alt="Avatar"
                  className="rounded-circle me-2"
                  style={{ width: "30px", height: "30px" }}
                />
              )}
              <div
                className={`p-2 rounded ${
                  msg.sender === "me" ? "bg-primary text-white" : "bg-light"
                }`}
                style={{ maxWidth: "75%" }}
              >
                <small>{msg.text}</small>
                <br />
                <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                  {msg.timestamp}
                </small>
              </div>
            </div>
          ))}

        <div className="input-group mt-3">
          <input
            type="text"
            className="form-control"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button className="btn btn-primary" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
