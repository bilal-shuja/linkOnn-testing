'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import createAPI from "@/app/lib/axios";
import Link from "next/link";
import Image from "next/image";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";


export default function Navbar() {

  const api = createAPI();
  const [userdata, setUserdata] = useState(null);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const response = await api.post(`/api/notifications/new`);
        if (response.data.code === "200") {
          setNotifications(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError("Error fetching notifications");
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, []);

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
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("userdata");
      if (data) {
        setUserdata(JSON.parse(data));
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      Cookies.remove('token', { path: '/' });
      localStorage.removeItem("userdata");
      localStorage.removeItem("siteSetting");
      localStorage.removeItem("userid");
    }
  };

  const toggleOffcanvas = () => {
    setIsOffcanvasOpen(!isOffcanvasOpen);
  };

  if (!userdata) return null;

  const handleMarkAllAsRead = async () => {
    try {
      const response = await api.post("/api/notifications/mark-all-as-read");
      if (response.data.code === "200") {
        toast.success(response.data.message)
        setNotifications([]);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Error occurred while marking notifications as read");
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
            <span className="icon">
              <i className="bi-gear"></i>
            </span>
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

              <div className="dropdown mx-3 dropstart dropdown-bell">
                <Image
                  src="/assets/images/newicons/bell.svg"
                  alt="icon"
                  width={24}
                  height={24}
                  role="button"
                  unoptimized={true}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  className={notifications.length > 0 ? "position-relative" : ""}
                />
                {notifications.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                )}
                <ul className="dropdown-menu p-3">
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
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}

                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map((notification) => (
                      <li key={notification.id} className={`dropdown-item ${notifications.length > 0 ? 'bg-light' : ''}`} style={{ width: "350px" }}>
                        <div className="d-flex align-items-center">
                          <Image
                            src={notification.notifier.avatar}
                            alt={notification.notifier.first_name}
                            width={50}
                            height={50}
                            className="rounded-circle me-2"
                            unoptimized={true}
                          />
                          <div
                            className="text-truncate mx-2"
                            style={{ maxWidth: "calc(100% - 50px)" }}
                          >
                            <p className="mb-0 text-wrap">
                              <strong>{notification.notifier.first_name}</strong>
                            </p>
                            <p className="mb-0 text-wrap">{notification.text}</p>

                            <small>{notification.created_human}</small>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="dropdown-item text-center">
                      <div className="d-flex flex-column align-items-center py-3">
                        <i className="bi bi-bell-slash fs-4 text-muted mb-2"></i>
                        <p className="mb-0 text-muted">No notifications found.</p>
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

              <div className="dropdown position-relative mx-3">
                {/* Profile Avatar Dropdown Toggle */}
                <Image
                  src={userdata.data.avatar}
                  alt="Profile"
                  className="rounded-circle profile-avatar shadow-sm"
                  height={40}
                  width={40}
                  role="button"
                  unoptimized={true}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                />

                {/* Dropdown Menu - Responsive & Fully Adaptable */}
                <ul className="dropdown-menu dropdown-menu-end dropdown-custom">

                  {/* User Info Section */}
                  <li className="d-flex align-items-center mt-2 mx-3 mb-3">
                    <Image
                      src={userdata.data.avatar}
                      alt="User Avatar"
                      className="rounded-circle border border-2 border-light shadow-sm"
                      width={50}
                      height={50}
                      unoptimized={true}
                    />
                    <div className="ms-3">
                      <Link href="#" className="text-decoration-none text-dark fw-bold dropdown-username">
                        {userdata.data.first_name} {userdata.data.last_name}
                      </Link>
                      <small className="text-muted d-block">@{userdata.data.username}</small>
                    </div>
                  </li>

                  {/* View Profile Button */}
                  <li className="d-flex justify-content-center my-2">
                    <button
                      className="btn btn-outline-primary fw-semibold rounded-pill w-100"
                      onClick={() => router.push(`/pages/UserProfile/timeline/${userdata.data.id}`)}
                    >
                      <i className="bi bi-person-circle me-2"></i> View Profile
                    </button>
                  </li>

                  {/* Settings & Privacy */}
                  <li>
                    <Link className="dropdown-item py-2 d-flex align-items-center" href="/pages/settings/general-settings">
                      <i className="bi bi-gear pe-3 text-primary"></i> Settings & Privacy
                    </Link>
                  </li>

                  {/* Upgrade to Pro */}
                  <li>
                    <Link className="dropdown-item py-2 d-flex align-items-center" href="/pages/Packages">
                      <i className="bi bi-currency-dollar pe-3 text-warning"></i> Upgrade to Pro
                    </Link>
                  </li>

                  {/* Dark Mode Toggle */}
                  <li>
                    <div className="dropdown-item d-flex align-items-center py-2">
                      <i className="bi bi-moon-stars pe-3 text-secondary"></i>
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="darkModeSwitch" />
                        <label className="form-check-label ms-2" htmlFor="darkModeSwitch">Dark Mode</label>
                      </div>
                    </div>
                  </li>

                  <hr className="dropdown-divider mx-3" />

                  {/* Sign Out */}
                  <li>
                    <Link className="dropdown-item py-2 d-flex align-items-center text-danger" href="/auth/sign-in" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right pe-3"></i> Sign Out
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
