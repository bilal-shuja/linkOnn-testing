"use client";

 
   
import { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";

export default function Explore() {
    
  const api = createAPI();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [pages, setPages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.post("/api/search-user", {
        type: "people",
      });
      if (response.data.code === "200") {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching users", error);
    }
    setLoading(false);
  };

  // Fetch Pages
  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await api.post("/api/search-user", {
        type: "page",
      });
      if (response.data.code === "200") {
        setPages(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching pages", error);
    }
    setLoading(false);
  };

  // Fetch Groups
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await api.post("/api/search-user", {
        type: "group",
        limit: '15',
        offset: '4',
      });
      if (response.data.code === "200") {
        setGroups(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching groups", error);
    }
    setLoading(false);
  };

  // Fetch Events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await api.post("/api/search-user", {
        type: "event",
      });
      if (response.data.code === "200") {
        setEvents(response.data.data);
      } else {
        alert("Fails to fetch");
      }
    } catch (error) {
      console.error("Error fetching events", error);
    }
    setLoading(false);
  };

  // Fetch data when the tab changes
  useEffect(() => {
    switch (activeTab) {
      case "users":
        fetchUsers();
        break;
      case "pages":
        fetchPages();
        break;
      case "groups":
        fetchGroups();
        break;
      case "events":
        fetchEvents();
        break;
      default:
        break;
    }
  }, [activeTab]);

  const renderUserCards = (data) => {
    return (
      <div className="row">
        {data.map((item) => (
          <div key={item.id} className="col-md-3 mb-4">
            <div className="card text-center shadow-lg border-0 rounded-3">
              <div
                className="card-img-top rounded-3"
                style={{
                  height: "200px",
                  background: `url(${item.avatar || '/placeholder.png'}) no-repeat center center/cover`,
                  transition: "transform 0.3s ease, filter 0.3s ease",
                }}
              ></div>
              <div className="card-body">
                <h5 className="card-title">{item.first_name} {item.last_name}</h5>
                <button className="btn btn-primary w-100">
                  <i className="bi bi-eye me-1"></i> View User
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderPageCards = (data) => {
    return (
      <div className="row">
        {data.map((item) => (
          <div key={item.id} className="col-md-3 mb-4">
            <div className="card text-center shadow-lg border-0 rounded-3">
              <div
                className="card-img-top rounded-3"
                style={{
                  height: "200px",
                  background: `url(${item.cover || '/placeholder.png'}) no-repeat center center/cover`,
                  transition: "transform 0.3s ease, filter 0.3s ease",
                }}
              ></div>
              <div className="card-body">
                <h5 className="card-title">{item.page_title}</h5>
                <button className="btn btn-primary w-100">
                  <i className="bi bi-eye me-1"></i> View Page
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderGroupCards = (data) => {
    return (
      <div className="row">
        {data.map((item) => (
          <div key={item.id} className="col-md-3 mb-4">
            <div className="card text-center shadow-lg border-0 rounded-3">
              <div
                className="card-img-top rounded-3"
                style={{
                  height: "200px",
                  background: `url(${item.cover || '/placeholder.png'}) no-repeat center center/cover`,
                  transition: "transform 0.3s ease, filter 0.3s ease",
                }}
              ></div>
              <div className="card-body">
                <h5 className="card-title">{item.group_title}</h5>
                <button className="btn btn-primary w-100">
                  <i className="bi bi-eye me-1"></i> View Group
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderEventCards = (data) => {
    return (
      <div className="row">
        {data.map((item) => (
          <div key={item.id} className="col-md-3 mb-4">
            <div className="card text-center shadow-lg border-0 rounded-3">
              <div
                className="card-img-top rounded-3"
                style={{
                  height: "200px",
                  background: `url(${item.cover || '/placeholder.png'}) no-repeat center center/cover`,
                  transition: "transform 0.3s ease, filter 0.3s ease",
                }}
              ></div>
              <div className="card-body">
                <h5 className="card-title">{item.event_title}</h5>
                <button className="btn btn-primary w-100">
                  View Card
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div>
        
      <div className="container-fluid bg-light py-5">
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-12">
              {/* Search Bar */}
              <div className="card shadow-sm border-0 rounded-3 mb-4">
                <div className="card-body d-flex justify-content-center">
                  <form className="w-50">
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        required
                        className="form-control me-3"
                        placeholder="Enter a keyword"
                      />
                      <button type="submit" className="btn btn-primary d-flex">
                        <i className="bi bi-search me-2"></i> Search
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="card shadow-sm border-0 rounded-3">
                <div className="card-body bg-light p-3">
                  <ul
                    className="nav nav-pills nav-fill flex-column flex-md-row justify-content-evenly"
                    id="myTab"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "users" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("users")}
                      >
                        <i className="bi bi-people-fill me-2"></i> Users
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "pages" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("pages")}
                      >
                        <i className="bi bi-book-fill me-2"></i> Pages
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "groups" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("groups")}
                      >
                        <i className="bi bi-people me-2"></i> Groups
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "events" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("events")}
                      >
                        <i className="bi bi-calendar-event me-2"></i> Events
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Tab Content */}
              <div className="mt-4">
                {activeTab === "users" && renderUserCards(users)}
                {activeTab === "pages" && renderPageCards(pages)}
                {activeTab === "groups" && renderGroupCards(groups)}
                {activeTab === "events" && renderEventCards(events)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
