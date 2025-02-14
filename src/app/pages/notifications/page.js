"use client";

 
import Rightnav from "@/app/assets/components/rightnav/page";
import createAPI from "@/app/lib/axios";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
   
import useConfirmationToast from "@/app/pages/Modals/useConfirmationToast";
import { toast } from 'react-toastify';

export default function Notifications() {
    
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
          toast.error("Failed to fetch notifications");
        }
      } catch (error) {
        toast.error("Error fetching notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleDeleteAllNotif = () => {
    showConfirmationToastAll();
  };

  const handleDeleteAll = async () => {
    try {
      const response = await api.post("/api/notifications/delete-all");
      if (response.data.code == "200") {
        toast.success(response.data.message);
        setNotifications([]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error deleting notifications");
    }
  };


  const handleDelete = async (notification_id) => {
    try {
      const response = await api.post("/api/notifications/delete-notification", {
        notification_id: notification_id
      });

      if (response.data.code === "200") {
        toast.success(response.data.message);
        setNotifications(prevNotifications => prevNotifications.filter(n => n.id !== notification_id));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error while deleting notification");
    }
  };


  const { showConfirmationToast: showConfirmationToastAll } = useConfirmationToast({
    message: "Are you sure you want to delete all notifications?",
    onConfirm: handleDeleteAll,
    onCancel: () => toast.dismiss(),
    confirmText: "Confirm",
    cancelText: "Cancel",
  });

  return (
    <div>
        
      <div className="container-fluid bg-light">
        <div className="container mt-3 pt-5">
          <div className="row">
            <div className="col-md-3 p-3 rounded">
              <Rightnav />
            </div>
            <div className="col-md-9 p-3">
              <div className="card shadow-lg border-0 ">
                <div className="card-body d-flex flex-column">
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
                                  <span className="mx-2">{notification.text}</span>
                                </p>
                              </div>
                            </div>
                            <div>
                              <small className="me-5">
                                {formatDistanceToNow(
                                  new Date(notification.created_at)
                                )} ago
                              </small>
                              <button
                                className="text-secondary btn py-0 px-2"
                                id="cardNotiAction2"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                type="button"
                              >
                                <i className="bi bi-three-dots"></i>
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="cardNotiAction2">
                                <li>
                                  <button
                                    className="dropdown-item delete_notification"
                                    onClick={() => handleDelete(notification.id)}
                                  >
                                    <i className="bi bi-trash fa-fw pe-2"></i>Delete
                                  </button>
                                </li>
                              </ul>
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
