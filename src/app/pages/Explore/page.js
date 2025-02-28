"use client";

import { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function Explore() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const api = createAPI();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [pages, setPages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Get query parameter on initial load
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
      setSearchTerm(query); // Set the search term for API calls
    }
    setIsInitialLoad(false);
  }, [searchParams]);

  // Get the type value based on activeTab
  const getTypeValue = () => {
    switch (activeTab) {
      case "users":
        return "people";
      case "pages":
        return "page";
      case "groups":
        return "group";
      case "events":
        return "event";
      default:
        return "people";
    }
  };

  // Fetch data based on tab and search query
  const fetchData = async (searchStr = "") => {
    setLoading(true);
    try {
      const response = await api.post("/api/search-user", {
        type: getTypeValue(),
        search_string: searchStr
      });

      if (response.data.code === "200") {
        // Update the appropriate state based on active tab
        switch (activeTab) {
          case "users":
            setUsers(response.data.data);
            break;
          case "pages":
            setPages(response.data.data);
            break;
          case "groups":
            setGroups(response.data.data);
            break;
          case "events":
            setEvents(response.data.data);
            break;
          default:
            break;
        }
      } else {
        console.error("API returned non-200 code:", response.data);
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}`, error);
    }
    setLoading(false);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Update URL with search query without page refresh
      router.push(`/pages/Explore?q=${encodeURIComponent(searchQuery)}`, { scroll: false });
      // Update the searchTerm which will trigger the API call
      setSearchTerm(searchQuery);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Fetch data with the current search term when tab changes
    fetchData(searchTerm);
  };

  // Combined useEffect to handle both initial load and tab/searchTerm changes
  useEffect(() => {
    // Skip on the first render to avoid conflict with the URL parameter effect
    if (!isInitialLoad) {
      fetchData(searchTerm);
    }
  }, [activeTab, searchTerm, isInitialLoad]);

  const renderUserCards = (data) => {
    return (
      <div className="row">
        {data.length > 0 ? (
          data.map((item) => (
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
                  <button className="btn btn-primary w-100"
                    onClick={() => router.push(`/pages/UserProfile/timeline/${item.id}`)}
                  >
                    <i className="bi bi-eye me-1"></i> View User
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center mt-4">
            <p>No users found. Try a different search term.</p>
          </div>
        )}
      </div>
    );
  };

  const renderPageCards = (data) => {
    return (
      <div className="row">
        {data.length > 0 ? (
          data.map((item) => (
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
                  <button className="btn btn-primary w-100"
                    onClick={() => router.push(`/pages/page/myPageTimeline/${item.id}`)}
                  >
                    <i className="bi bi-eye me-1"></i> View Page
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center mt-4">
            <p>No pages found. Try a different search term.</p>
          </div>
        )}
      </div>
    );
  };

  const renderGroupCards = (data) => {
    return (
      <div className="row">
        {data.length > 0 ? (
          data.map((item) => (
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
                  <button className="btn btn-primary w-100"
                    onClick={() => router.push(`/pages/groups/groupTimeline/${item.id}`)}
                  >
                    <i className="bi bi-eye me-1"></i> View Group
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center mt-4">
            <p>No groups found. Try a different search term.</p>
          </div>
        )}
      </div>
    );
  };

  const renderEventCards = (data) => {
    return (
      <div className="row">
        {data.length > 0 ? (
          data.map((item) => (
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
                  <button className="btn btn-primary w-100"
                    onClick={() => router.push(`/pages/Events/eventDetails/${item.id}`)}
                  >
                    <i className="bi bi-eye me-1"></i> View Event
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center mt-4">
            <p>No events found. Try a different search term.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="container-fluid bg-light py-5">
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-12">
         
              <div className="card shadow-sm border-0 rounded-3 mb-4">
                <div className="card-body d-flex justify-content-center">
                  <form className="w-50" onSubmit={handleSearch}>
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        required
                        className="form-control me-3"
                        placeholder="Enter a keyword"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button type="submit" className="btn btn-primary d-flex">
                        <i className="bi bi-search me-2"></i> Search
                      </button>
                    </div>
                  </form>
                </div>
              </div>

        
              <div className="card shadow-sm border-0 rounded-3">
                <div className="card-body bg-light p-3">
                  <ul
                    className="nav nav-pills nav-fill flex-column flex-md-row justify-content-evenly"
                    id="myTab"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "users" ? "active" : ""}`}
                        onClick={() => handleTabChange("users")}
                      >
                        <i className="bi bi-people-fill me-2"></i> Users
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "pages" ? "active" : ""}`}
                        onClick={() => handleTabChange("pages")}
                      >
                        <i className="bi bi-book-fill me-2"></i> Pages
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "groups" ? "active" : ""}`}
                        onClick={() => handleTabChange("groups")}
                      >
                        <i className="bi bi-people me-2"></i> Groups
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "events" ? "active" : ""}`}
                        onClick={() => handleTabChange("events")}
                      >
                        <i className="bi bi-calendar-event me-2"></i> Events
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-4">
                {loading ? (
                  <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading...</p>
                  </div>
                ) : (
                  <>
                    {activeTab === "users" && renderUserCards(users)}
                    {activeTab === "pages" && renderPageCards(pages)}
                    {activeTab === "groups" && renderGroupCards(groups)}
                    {activeTab === "events" && renderEventCards(events)}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}