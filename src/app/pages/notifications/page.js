"use client";

import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import createAPI from "@/app/lib/axios";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
 
import Image from "next/image";
import useAuth from "@/app/lib/useAuth";

export default function Notifications() {
  useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const api = createAPI();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.post(`/api/notifications/user-old-notification`);

        if (response.data.code == "200") {
          setNotifications(response.data.data);
        } else {
          setError("Failed to fetch notifications");
        }
      } catch (error) {
        setError("Error fetching notifications");
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleDeleteAllNotif = async () => {
    try {
      const response = await api.post("/api/notifications/delete-all");
      if (response.data.code == "200") {
        alertify.success(response.data.message);
      } else {
        alertify.error(response.data.message);
      }
    } catch (error) {
      alertify.error("catch error");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container-fluid bg-light">
        <div className="container mt-3 pt-5">
          <div className="row">
            <div className="col-md-3 p-3 rounded">
              <Rightnav />
            </div>
            <div className="col-md-9 p-3 min-vh-50">
              <div className="card shadow-lg border-0 h-50">
                <div className="card-body d-flex flex-column h-50">
                  <ul className="mt-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-bell fs-3 pe-2"></i>
                        <h4 className="mb-0 fw-bold">Notifications</h4>
                      </div>

                      {notifications.length > 0 && (
                        <div>
                          <button
                            className="btn btn-danger"
                            onClick={handleDeleteAllNotif}
                          >
                            <i className="bi bi-trash3 me-2"></i>
                            Delete All
                          </button>
                        </div>
                      )}
                    </div>
                    <hr />
                    {/* Loading or Error state */}
                    {loading ? (
                      <li className="dropdown-item">
                        <div className="d-flex justify-content-center">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      </li>
                    ) : error ? (
                      <li className="dropdown-item">
                        <p className="mb-0 text-center text-danger">{error}</p>
                      </li>
                    ) : notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <li key={notification.id} className="dropdown-item">
                          <div className="d-flex justify-content-between align-items-center mt-4">
                            <div className="d-flex align-items-center">
                              <Image
                                src={notification.notifier?.avatar || '/default-avatar.png'}
                                alt={notification.notifier?.first_name || 'Unknown'}
                                width={40}
                                height={40}
                                className="rounded-circle me-2"
                              />
                              <div>
                                <p>
                                  <strong>
                                    {notification.notifier?.first_name || 'Unknown'}
                                  </strong>
                                  <strong>
                                    {notification.notifier?.last_name || 'Unknown'}
                                  </strong>
                                  <span className="mx-2">{notification.text}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div>

                              <small className="me-5">
                                {formatDistanceToNow(
                                  new Date(notification.created_at)
                                )}
                                ago
                              </small>
                              <i className="bi bi-three-dots me-3"></i>
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="dropdown-item justify-content-center d-flex align-items-center mt-5">
                        <div className="text-center mt-5">
                          <i className="bi bi-bell-slash fs-1 text-secondary mb-3"></i>
                          <p className="fw-bold text-secondary fs-4">
                            No Notifications
                          </p>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
