"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic"; // Import dynamic for SSR handling
import createAPI from "@/app/lib/axios";
import Link from "next/link";
import Image from "next/image";

const api = createAPI();

export default function Navbar() {
  const [userdata, setUserdata] = useState(null);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  // Fetch notifications only on the client-side
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const response = await api.post(`/api/notifications/new`);
        if (response.data.code === "200") {
          setNotifications(response.data.data);
        } else {
          setError(response.data.message); // Replace alertify with error state
        }
      } catch (error) {
        setError("Error fetching notifications"); // Replace alertify with error state
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, []); // Runs only on mount (client-side)

  // Fetch chats only on the client-side
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoadingChats(true);
        const response = await api.post("/api/chat/get-all-chats");

        if (response.data.status === "200") {
          setChats(response.data.data);
        } else {
          setError("Failed to load chats.");
        }
      } catch (err) {
        setError("Error fetching chats. Please try again later.");
      } finally {
        setLoadingChats(false);
      }
    };

    fetchChats();
  }, []); // Runs only on mount (client-side)

  // Ensure to access localStorage only on the client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("userdata");
      if (data) {
        setUserdata(JSON.parse(data));
      }
    }
  }, []); // Runs only on mount (client-side)

  // Logout function with client-side localStorage manipulation
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userdata");
      localStorage.removeItem("siteSetting");
      localStorage.removeItem("userid");
    }
    router.push("/sign-in");
  };

  // Toggle for offcanvas (for mobile menu, or similar purposes)
  const toggleOffcanvas = () => {
    setIsOffcanvasOpen(!isOffcanvasOpen);
  };

  // If userdata is null, return nothing
  if (!userdata) return null;

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      const response = await api.post("/api/notifications/mark-all-as-read");
      if (response.data.code === "200") {
        // Remove alertify and use state or other methods to notify success
      } else {
        setError(response.data.message); // Replace alertify with error state
      }
    } catch (error) {
      setError("Error occurred while marking notifications as read"); // Replace alertify with error state
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-white shadow-sm py-1">
        <div className="container">
          <Link href="/pages/newsfeed" className="navbar-brand">
            <Image
              src="/assets/images/linkON.png"
              alt="Logo"
              width={150}
              height={40}
              unoptimized={true}
            />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="d-flex flex-column flex-lg-row align-items-center justify-content-center w-75">
              <form className="position-relative mb-3 mb-lg-0 py-0 w-75">
                <input
                  className="form-control ps-5 bg-light border-0 rounded-3"
                  type="search"
                  placeholder="Search people and pages"
                  aria-label="Search"
                />
                <button
                  className="btn bg-transparent position-absolute top-50 start-0 translate-middle-y border-0"
                  type="submit"
                >
                  <i className="bi bi-search fs-5 text-muted"></i>
                </button>
              </form>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <button
                className="btn mx-3"
                type="button"
                onClick={toggleOffcanvas}
              >
                <Image
                  src="/assets/images/newicons/message.svg"
                  alt="icon"
                  width={24}
                  height={24}
                  unoptimized={true}
                />
              </button>

              <div className="dropdown mx-3 dropstart">
                <Image
                  src="/assets/images/newicons/bell.svg"
                  alt="icon"
                  width={24}
                  height={24}
                  role="button"
                  unoptimized={true}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                />
                <ul className="dropdown-menu p-3" style={{ width: "350px" }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-bell pe-2"></i>
                      <p className="mb-0 fw-bold">Notifications</p>
                    </div>
                    <button
                      className="btn border border-0 mb-0 text-primary text-nowrap"
                      onClick={handleMarkAllAsRead}
                    >
                      Mark all as read
                    </button>
                  </div>

                  <hr className="text-muted my-2" />
                  {loadingNotifications && (
                    <div className="d-flex justify-content-center">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}

                  {notifications.length > 0 ? (
                    notifications.slice(0, 7).map((notification) => (
                      <li key={notification.id} className="dropdown-item">
                        <div className="d-flex align-items-center">
                          <Image
                            src={notification.notifier.avatar}
                            alt={notification.notifier.first_name}
                            width={40}
                            height={40}
                            className="rounded-circle me-2"
                            unoptimized={true}
                          />
                          <div
                            className="text-truncate"
                            style={{ maxWidth: "calc(100% - 50px)" }}
                          >
                            <p className="mb-0 text-wrap">
                              <strong>
                                {notification.notifier.first_name}
                              </strong>{" "}
                              {notification.text}
                            </p>
                            <small>{notification.created_human}</small>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="dropdown-item text-center">
                      <div className="d-flex flex-column align-items-center py-3">
                        <i className="bi bi-bell-slash fs-4 text-muted mb-2"></i>
                        <p className="mb-0 text-muted">
                          No notifications found.
                        </p>
                      </div>
                    </li>
                  )}

                  <hr className="my-2" />
                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => router.push("/pages/notifications")}
                    >
                      See all
                    </button>
                  </div>
                </ul>
              </div>

              <Link
                href="/pages/settings/general-settings"
                className="mx-3 text-decoration-none"
              >
                <Image
                  src="/assets/images/newicons/settings.svg"
                  alt="icon"
                  width={24}
                  height={24}
                  unoptimized={true}
                />
              </Link>

              <div className="dropstart mx-3">
                <Image
                  src={userdata.data.avatar}
                  alt="Profile"
                  className="rounded-2"
                  height={40}
                  width={40}
                  role="button"
                  unoptimized={true}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                />
                <ul className="dropdown-menu my-2 p-3 shadow-lg rounded-3 border-0">
                  <li>
                    <div className="d-flex align-items-center mt-2 mx-3 mb-3">
                      <Image
                        src={userdata.data.avatar}
                        alt="User Avatar"
                        className="rounded-3"
                        width={40}
                        height={40}
                        unoptimized={true}
                      />
                      <div className="mx-3">
                        <Link
                          href="#"
                          className="text-decoration-none text-dark fw-bold"
                        >
                          {userdata.data.first_name} {userdata.data.last_name}
                        </Link>
                        <small className="text-muted"> @{userdata.data.username} </small>
                      </div>
                    </div>
                  </li>

                  <li className="d-flex justify-content-center my-2 align-items-center">
                    <Link href="/pages/MyProfile">
                      <button className="btn btn-outline-primary border border-1" style={{ width: '200px' }}>
                        View Profile
                      </button>
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item align-items-center d-flex py-2"
                      href="/pages/settings/general-settings"
                    >
                      <i className="bi bi-gear pe-3"></i> Settings & Privacy
                    </Link>
                  </li>

                  <li>
                    <Link className="dropdown-item py-2" href="#">
                      <i className="bi bi-currency-dollar pe-3"></i>
                      Upgrade to Pro
                    </Link>
                  </li>

                  <li>
                    <Link className="dropdown-item py-2" href="#">
                      <div className="form-check form-switch d-flex align-items-center">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="flexSwitchCheckDefault"
                        />
                        <label className="form-check-label ms-2">Dark Theme</label>
                      </div>
                    </Link>
                  </li>

                  <hr />

                  <li>
                    <Link
                      className="dropdown-item mx-2 py-2"
                      href="/auth/sign-in"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right pe-3"></i>
                      Sign out
                    </Link>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </nav>

      <div
        className={`offcanvas offcanvas-end ${isOffcanvasOpen ? "show" : ""}`}
        tabIndex="-1"
        id="offcanvasChat"
        aria-labelledby="offcanvasChatLabel"
        data-bs-backdrop="false"
      >
        <div className="offcanvas-header">
          <h3 id="offcanvasChatLabel">Chats</h3>
          <button
            type="button"
            className="btn-close text-reset"
            onClick={toggleOffcanvas}
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {loadingChats && (
            <div className="d-flex justify-content-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {error && !loadingChats && (
            <div className="alert alert-danger">{error}</div>
          )}

          {chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat.id}
                className="d-flex align-items-center p-2 bg-light rounded-3 mb-2"
              >
                <Image
                  src={chat.avatar}
                  alt={`${chat.first_name} ${chat.last_name} Avatar`}
                  className="rounded-circle me-3"
                  width={40}
                  height={40}
                  unoptimized={true}
                />
                <div className="d-flex justify-content-between w-100">
                  <div className="flex-grow-1">
                    <h6>
                      {chat.first_name} {chat.last_name}
                    </h6>
                    <p>{chat.last_message}</p>
                  </div>
                  <div>
                    <p className="text-muted">{chat.last_time}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No chats available.</div>
          )}
        </div>
      </div>
    </>
  );
}
