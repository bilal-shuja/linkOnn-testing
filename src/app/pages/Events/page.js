"use client";

import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useAuth from "@/app/lib/useAuth";

export default function Events() {
  useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [eventLoading, setEventLoading] = useState({ allEvents: false, myEvents: false });
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [suggestedPage, setSuggestedPage] = useState(1);
  const [myEventsPage, setMyEventsPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const itemsPerPage = 6;
  const router = useRouter();

  const api = createAPI();

  const fetchAllEvents = async (page) => {
    const offset = (page - 1) * itemsPerPage;
    setEventLoading((prev) => ({ ...prev, allEvents: true }));

    try {
      const response = await api.post("/api/get-events", {
        fetch: "events",
        offset: offset,
        limit: itemsPerPage,
      });

      if (response.data.code == "200") {
        setEvents(response.data.data);
        setErrorMessage("");
      } else {
        setErrorMessage(response.data.message);
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("Error fetching events");
      setSuccessMessage("");
    } finally {
      setEventLoading((prev) => ({ ...prev, allEvents: false }));
    }
  };

  const fetchMyEvents = async (page) => {
    const offset = (page - 1) * itemsPerPage;
    setEventLoading((prev) => ({ ...prev, myEvents: true }));

    try {
      const response = await api.post("/api/get-events", {
        fetch: "myevents",
        offset: offset,
        limit: itemsPerPage,
      });

      if (response.data.code == "200") {
        setMyEvents(response.data.data);
        setErrorMessage("");
      } else {
        setErrorMessage(response.data.message);
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("Error fetching events");
      setSuccessMessage("");
    } finally {
      setEventLoading((prev) => ({ ...prev, myEvents: false }));
    }
  };

  useEffect(() => {
    if (activeTab === 0) {
      fetchAllEvents(suggestedPage);
    }
  }, [suggestedPage, activeTab]);

  useEffect(() => {
    if (activeTab === 1) {
      fetchMyEvents(myEventsPage);
    }
  }, [myEventsPage, activeTab]);

  const handlePageChange = (page, type) => {
    if (type === "events") {
      setSuggestedPage(page);
    } else {
      setMyEventsPage(page);
    }
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      api
        .post("/api/delete-event", { event_id: eventId })
        .then((response) => {
          if (response.data.code === "200") {
            setSuccessMessage(response.data.message);
            setMyEvents((prevEvents) =>
              prevEvents.filter((event) => event.id !== eventId)
            );
          } else {
            setErrorMessage(response.data.message);
          }
        })
        .catch((error) => {
          setErrorMessage("Error deleting event");
        });
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
            <div className="col-md-9 p-3">
              <div className="d-flex flex-column">
                <ul
                  className="nav nav-pills bg-white d-flex justify-content-evenly"
                  id="myTab"
                  role="tablist"
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === 0 ? "active" : ""}`}
                      id="suggested-tab"
                      role="tab"
                      aria-controls="suggested"
                      aria-selected={activeTab === 0}
                      onClick={() => {
                        setActiveTab(0);
                        fetchAllEvents(suggestedPage);
                      }}
                    >
                      All Events
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === 1 ? "active" : ""}`}
                      id="my-events-tab"
                      role="tab"
                      aria-controls="my-events"
                      aria-selected={activeTab === 1}
                      onClick={() => {
                        setActiveTab(1);
                        fetchMyEvents(myEventsPage);
                      }}
                    >
                      My Events
                    </button>
                  </li>
                </ul>
              </div>


              {errorMessage && (
                <div className="alert alert-danger mt-3">{errorMessage}</div>
              )}
              {successMessage && (
                <div className="alert alert-success mt-3">{successMessage}</div>
              )}

              <div className="tab-content mt-5">

                <div
                  className={`tab-pane fade ${activeTab === 0 ? "show active" : ""}`}
                  id="suggested"
                >
                  <div className="card shadow-lg border-0 p-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4>All Events</h4>
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-primary"
                            onClick={() => router.push("/pages/Events/create-event")}
                          >
                            + Create Event
                          </button>
                        </div>
                      </div>
                      <hr className="text-muted" />

                      {eventLoading.allEvents ? (
                        <div className="d-flex justify-content-center">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {events.length === 0 ? (
                            <div className="text-center">
                              <i
                                className="bi bi-calendar text-secondary"
                                style={{ fontSize: "3rem" }}
                              ></i>
                              <p
                                className="mt-3 text-secondary fw-semibold"
                                style={{ fontSize: "1.5rem" }}
                              >
                                No Events Found
                              </p>
                            </div>
                          ) : (
                            <div className="row">
                              {events.map((event) => (
                                <div key={event.id} className="col-md-4 mb-4">
                                  <div className="card text-center">
                                    <Image
                                      src={event.cover || "https://via.placeholder.com/150"}
                                      alt="Event Image"
                                      className="card-img-top mx-auto mt-3"
                                      width={80}
                                      height={80}
                                      style={{
                                        objectFit: "cover",
                                      }}
                                    />

                                    <div className="card-body">
                                      <h5 className="card-title mb-1">
                                        {event.name}
                                      </h5>
                                      <p className="text-muted">{event.location}</p>
                                      <div className="d-flex justify-content-around align-items-center">
                                        <p>{event.start_date}</p>
                                      </div>
                                      <button className="btn btn-outline-success mt-3">
                                        {event.is_going ? "Going" : "Join"}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}


                      <div className="d-flex justify-content-center mt-4">
                        <ul className="pagination">
                          <li
                            className={`page-item ${suggestedPage === 1 ? "disabled" : ""}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(suggestedPage - 1, "events")}
                            >
                              Previous
                            </button>
                          </li>
                          {[...Array(Math.ceil(events.length / itemsPerPage))].map(
                            (_, index) => (
                              <li
                                key={index}
                                className={`page-item ${suggestedPage === index + 1 ? "active" : ""}`}
                              >
                                <button
                                  className="page-link"
                                  onClick={() => handlePageChange(index + 1, "events")}
                                >
                                  {index + 1}
                                </button>
                              </li>
                            )
                          )}
                          <li
                            className={`page-item ${suggestedPage === Math.ceil(events.length / itemsPerPage) ? "disabled" : ""}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(suggestedPage + 1, "events")}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`tab-pane fade ${activeTab === 1 ? "show active" : ""}`}
                  id="my-events"
                >
                  <div className="card shadow-lg border-0 p-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4>My Events</h4>
                        <button
                          className="btn btn-primary"
                          onClick={() => router.push("/pages/Events/create-event")}
                        >
                          + Create Event
                        </button>
                      </div>
                      <hr className="text-muted" />

                      {eventLoading.myEvents ? (
                        <div className="d-flex justify-content-center">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <div className="row">
                          {myEvents.length === 0 ? (
                            <div className="text-center">
                              <i
                                className="bi bi-calendar text-secondary"
                                style={{ fontSize: "3rem" }}
                              ></i>
                              <p
                                className="mt-3 text-secondary fw-semibold"
                                style={{ fontSize: "1.5rem" }}
                              >
                                No Events Found
                              </p>
                            </div>
                          ) : (
                            myEvents.map((event) => (
                              <div key={event.id} className="col-md-4 mb-4">
                                <div className="row">
                                  <div className="card h-100">
                                    <Image
                                      src={event.cover || "https://via.placeholder.com/150"}
                                      alt="Event Image"
                                      className="card-img-top mx-auto mt-3"
                                      width={80}
                                      height={80}
                                      style={{
                                        objectFit: "cover",
                                      }}
                                    />
                                    <div className="card-body">
                                      <h5 className="card-title mb-1">
                                        {event.name}
                                      </h5>
                                      <p className="text-muted">{event.location}</p>
                                      <div className="d-flex justify-content-between align-items-center">
                                        <button
                                          className="btn btn-outline-danger mt-2"
                                          onClick={() => handleDeleteEvent(event.id)}
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}

                      <div className="d-flex justify-content-center mt-4">
                        <ul className="pagination">
                          <li
                            className={`page-item ${myEventsPage === 1 ? "disabled" : ""}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(myEventsPage - 1, "myevents")}
                            >
                              Previous
                            </button>
                          </li>
                          {[...Array(Math.ceil(myEvents.length / itemsPerPage))].map(
                            (_, index) => (
                              <li
                                key={index}
                                className={`page-item ${myEventsPage === index + 1 ? "active" : ""}`}
                              >
                                <button
                                  className="page-link"
                                  onClick={() => handlePageChange(index + 1, "myevents")}
                                >
                                  {index + 1}
                                </button>
                              </li>
                            )
                          )}
                          <li
                            className={`page-item ${myEventsPage === Math.ceil(myEvents.length / itemsPerPage) ? "disabled" : ""}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(myEventsPage + 1, "myevents")}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
