"use client"; // Ensures this code runs only in the client environment

import { useState, useEffect } from "react";
import Navbar from "@/app/assets/components/navbar/page";
import Rightnav from "@/app/assets/components/rightnav/page";
import createAPI from "@/app/lib/axios";
import { useRouter } from "next/navigation";

export default function Eventform() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [image, setImage] = useState(null); // Fixed to store a single file

  const api = createAPI();

  // Handlers for input changes
  const handleNameChange = (e) => setEventName(e.target.value);
  const handleLocationChange = (e) => setEventLocation(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleStartDate = (e) => setStartDate(e.target.value);
  const handleStartTime = (e) => setStartTime(e.target.value);
  const handleEndDate = (e) => setEndDate(e.target.value);
  const handleEndTime = (e) => setEndTime(e.target.value);

  // Image file change handler
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setImage(files[0]); // Store the selected file (single file)
    }
  };

  // Event addition logic
  const addEvent = async () => {
    if (!eventName || !eventLocation || !startDate || !startTime || !endDate || !endTime) {
      setError("Please fill in all fields!");
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    const currentDateTime = new Date();

    if (startDateTime < currentDateTime) {
      setError("Event start date and time cannot be in the past.");
      return;
    }

    if (startDateTime >= endDateTime) {
      setError("Event start date and time must be earlier than end date and time.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", eventName);
      formData.append("location", eventLocation);
      formData.append("description", description);
      formData.append("start_date", startDate);
      formData.append("start_time", startTime);
      formData.append("end_date", endDate);
      formData.append("end_time", endTime);
      if (image) {
        formData.append("cover", image); // Attach the image file
      }

      const response = await api.post("/api/add-event", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.code == "200") {
        setError("");
        setSuccess(response.data.message);
        router.push("/newsfeed");
      } else {
        setError("Error from server: " + response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred");
      }
      console.error(error);
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
              <div className="card shadow-lg border-0 p-3">
                <div className="card-body">
                  <h5 className="fw-bold mt-2 fs-4">Create Event</h5>
                  {success && (
                    <div className="alert alert-success mt-2">{success}</div>
                  )}
                  {error && <p className="text-center text-danger">{error}</p>}
                  <div className="mt-4">
                    <label className="form-label mx-1 text-muted">Event Name</label>
                    <input
                      className="form-control px-3"
                      type="text"
                      placeholder="Event Name (Required)"
                      value={eventName}
                      onChange={handleNameChange}
                    />
                  </div>
                  <div className="mt-4">
                    <label className="form-label mx-1 text-muted">Location</label>
                    <input
                      className="form-control px-3"
                      type="text"
                      placeholder="Location (Required)"
                      value={eventLocation}
                      onChange={handleLocationChange}
                    />
                  </div>
                  <div className="mt-4">
                    <label className="form-label mx-1 text-muted">Description</label>
                    <textarea
                      className="form-control px-3"
                      rows="3"
                      placeholder="Description (Required)"
                      value={description}
                      onChange={handleDescriptionChange}
                    ></textarea>
                  </div>
                  <div className="mt-4 d-flex gap-3">
                    <div className="w-50">
                      <label className="form-label text-muted px-1">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={handleStartDate}
                      />
                    </div>
                    <div className="w-50">
                      <label className="form-label text-muted px-1">Start Time</label>
                      <input
                        type="time"
                        className="form-control"
                        value={startTime}
                        onChange={handleStartTime}
                      />
                    </div>
                  </div>
                  <div className="mt-4 d-flex gap-3">
                    <div className="w-50">
                      <label className="form-label text-muted px-1">End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={handleEndDate}
                      />
                    </div>
                    <div className="w-50">
                      <label className="form-label text-muted px-1">End Time</label>
                      <input
                        type="time"
                        className="form-control"
                        value={endTime}
                        onChange={handleEndTime}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="form-label text-muted px-2">Cover Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="mt-4 d-flex justify-content-end">
                    <button className="btn btn-primary" onClick={addEvent}>
                      Create Event
                    </button>
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
