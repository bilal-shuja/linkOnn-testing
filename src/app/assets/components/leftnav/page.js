"use client";

import Link from "next/link";
import createAPI from "@/app/lib/axios";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useAuth from "@/app/lib/useAuth";

export default function Leftnav() {
  useAuth();
  const [error, setError] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [people, setPeople] = useState([]);
  const [peopleLoading, setPeopleLoading] = useState(true);
  const [isClient, setIsClient] = useState(false); // Track if it's client-side

  const api = createAPI();

  // Ensure code runs only on the client-side
  useEffect(() => {
    setIsClient(true); // Set to true once the component is mounted in the browser
  }, []);

  // Fetch Articles Blogs (Client-side)
  const fetchArticlesBlogs = useCallback(async () => {
    if (!isClient) return; // Only run on client-side
    setLoading(true);
    try {
      const response = await api.post("/public_api/recent-blogs");
      if (response.data.code === "200") {
        const lastFiveBlogs = response.data.data.slice(0, 5);
        setBlogs(lastFiveBlogs);
      } else {
        alertify.error(response.data.message);
      }
    } catch (error) {
      setError("Catch Error");
      alertify.error("Error fetching blogs");
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  // Fetch People Recommendations (Client-side)
  const fetchPeopleRecommendations = useCallback(async () => {
    if (!isClient) return; // Only run on client-side
    setPeopleLoading(true);
    try {
      const response = await api.post(`/api/fetch-recommended`);
      if (response.data.code === "200") {
        setPeople(response.data.data);
      } else {
        alertify.error(response.data.message);
      }
    } catch (error) {
      setError("Error fetching recommendations");
      alertify.error("Error fetching recommendations");
    } finally {
      setPeopleLoading(false);
    }
  }, [isClient]);

  const handleAddFriend = async (personId, isPending) => {
    if (!isClient) return; // Only run on client-side
    try {
      const response = await api.post("/api/make-friend", { friend_two: personId });
      if (response.data.code === "200") {
        fetchPeopleRecommendations();
        alertify.success(isPending ? "Friend request canceled" : "Friend request sent");
      } else {
        alertify.error(response.data.message);
      }
    } catch (error) {
      alertify.error("Error updating friend request");
    }
  };

  useEffect(() => {
    if (isClient) {
      fetchArticlesBlogs();
      fetchPeopleRecommendations();
    }
  }, [isClient, fetchArticlesBlogs, fetchPeopleRecommendations]);

  // If any data is still loading, show a loading spinner
  if (peopleLoading || loading) {
    return (
      <div className="d-flex justify-content-center mt-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="position-sticky top-0">
      {/* People Recommendations */}
      <div className="card mb-3 shadow-lg border-0">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between">
            <h6 className="mb-0">People you may know</h6>
            <button className="border-0 bg-transparent" onClick={fetchPeopleRecommendations}>
              <i className="bi bi-arrow-clockwise text-primary fs-5"></i>
            </button>
          </div>

          {people.length > 0 ? (
            people.map((person) => (
              <div key={person.id} className="d-flex align-items-center justify-content-between mt-2 p-2">
                <div className="d-flex align-items-center">
                  <Image
                    src={person.avatar || '/default-avatar.png'}
                    alt="Avatar"
                    className="rounded-circle img-fluid"
                    width={40}
                    height={40}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="ms-3">
                    <h6 className="mb-0 text-truncate" style={{ maxWidth: '150px' }}>
                      {`${person.first_name} ${person.last_name}`}
                    </h6>
                    <p className="text-muted mb-0 text-truncate">@{person.username}</p>
                  </div>
                </div>

                <div>
                  <button
                    className="btn btn-sm border-0 bg-transparent"
                    onClick={() => handleAddFriend(person.id, person.ispending === 1)}
                  >
                    {person.ispending === 1 ? (
                      <i className="bi bi-person-check fs-5 text-success"></i>
                    ) : (
                      <i className="bi bi-plus-circle fs-5 text-primary"></i>
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted mt-3">No people recommendations available</p>
          )}

          <Link href="/pages/Friends" className="btn btn-outline-primary w-100 mt-3 border border-1">
            View more
          </Link>
        </div>
      </div>

      {/* Articles and Blogs */}
      <div className="card mb-3 shadow-lg border-0">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between">
            <h6 className="mb-0">Articles & Blogs</h6>
            <button className="border-0" onClick={fetchArticlesBlogs}>
              <i className="bi bi-arrow-clockwise text-primary"></i>
            </button>
          </div>

          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog.id}>
                <div className="mt-3 mx-2">
                  <Link className="text-decoration-none" href="#">
                    {blog.title}
                  </Link>
                  <br />
                  <small className="text-muted">{blog.created_at} ago</small>
                </div>
                <hr />
              </div>
            ))
          ) : (
            <p>No blogs available</p>
          )}

          <Link href="/pages/Blogs" className="btn btn-outline-primary w-100 mt-3 border border-1">
            View more
          </Link>
        </div>
      </div>
    </div>
  );
}
