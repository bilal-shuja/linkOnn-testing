"use client";

import Link from "next/link";
import createAPI from "@/app/lib/axios";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSiteSettings } from "@/context/SiteSettingsContext"

export default function Leftnav() {
  // const [blogs, setBlogs] = useState([]);
  // const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [people, setPeople] = useState([]);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const api = createAPI();
  const router = useRouter();
  const settings = useSiteSettings()

  useEffect(() => {
    setIsClient(true);
  }, []);

  // const fetchArticlesBlogs = useCallback(async () => {
  //   setLoadingBlogs(true);
  //   try {
  //     const response = await api.post("/api/recent-blogs");
  //     if (response.data.code === "200") {
  //       setBlogs(response.data.data);
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   } catch (error) {
  //     toast.error("Error fetching blogs");
  //   } finally {
  //     setLoadingBlogs(false);
  //   }
  // }, []);

  const fetchPeopleRecommendations = useCallback(async () => {
    setLoadingPeople(true);
    try {
      const response = await api.post(`/api/fetch-recommended`);
      if (response.data.code === "200") {
        setPeople(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error fetching recommendations");
    } finally {
      setLoadingPeople(false);
    }
  }, []);

  const handleAddFriend = async (personId, isPending) => {
    if (!isClient) return;
    try {
      const response = await api.post("/api/make-friend", { friend_two: personId });
      if (response.data.code === "200") {
        fetchPeopleRecommendations();
        toast.success(isPending ? "Friend request canceled" : "Friend request sent");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error updating friend request");
    }
  };

  useEffect(() => {
    if (isClient) {
      // fetchArticlesBlogs();
      fetchPeopleRecommendations();
    }
  }, [isClient]);

  if (!settings) return null;

  return (
    <div className="position-sticky top-0 leftnav-container">
      {settings["is_friend_system"] === "1" && (
        <div className="card mb-4 custom-shadow border-0 rounded-4">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <h6 className="mb-0 fw-bold">People You May Know</h6>
              <button className="border-0 bg-transparent" onClick={fetchPeopleRecommendations}>
                <i className="bi bi-arrow-clockwise text-primary fs-5"></i>
              </button>
            </div>

            {loadingPeople ? (
              <div className="d-flex justify-content-center mt-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : people.length > 0 ? (
              <div className="people-list">
                {people.map((person) => (
                  <div key={person.id} className="d-flex align-items-center justify-content-between mt-3 p-2 hover-effect rounded-3">
                    <div
                      className="d-flex align-items-center person-info"
                      style={{ cursor: 'pointer' }}
                      onClick={() => router.push(`/pages/UserProfile/timeline/${person.id}`)}
                    >
                      <Image
                        src={person.avatar || "/assets/images/userplaceholder.png"}
                        alt="Avatar"
                        className="rounded-circle img-fluid person-avatar"
                        width={40}
                        height={40}
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="ms-3 person-details">
                        <h6 className="mb-0 text-truncate text-dark fw-bold person-name">
                          {`${person.first_name} ${person.last_name}`}
                        </h6>
                        <p className="text-muted mb-0 text-truncate person-username">@{person.username}</p>
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
                ))}
              </div>
            ) : (
              <p className="text-center text-muted mt-3">No people recommendations available</p>
            )}

            <Link href="/pages/Friends" className="btn btn-gradient w-100 mt-3">
              View More
            </Link>
          </div>
        </div>
      )}

      {/* {settings["chck-blogs"] === "1" && (
        <div className="card mb-4 custom-shadow border-0 rounded-4">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between">
              <h6 className="mb-0 fw-bold">Articles & Blogs</h6>
              <button className="border-0 bg-transparent" onClick={fetchArticlesBlogs}>
                <i className="bi bi-arrow-clockwise text-primary"></i>
              </button>
            </div>

            {loadingBlogs ? (
              <div className="d-flex justify-content-center mt-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : blogs.length > 0 ? (
              <div className="blogs-list">
                {blogs.map((blog) => (
                  <div key={blog.id}>
                    <div className="mt-3 mx-2">
                      <Link className="text-decoration-none fw-bold text-dark hover-text blog-title" href={`/pages/blogs/blogdetails/${blog.id}`}>
                        {blog.title}
                      </Link>

                      <br />
                      <small className="text-muted">{blog.created_at}</small>
                    </div>
                    <hr />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted">No blogs available</p>
            )}

            <Link href="/pages/Blogs" className="btn btn-gradient w-100 mt-3">
              View More
            </Link>
          </div>
        </div>
      )} */}

      <style jsx>{`
        /* Responsive styles for the left navigation */
        .leftnav-container {
          width: 100%;
          max-width: 100%;
        }
        
        .person-info {
          flex: 1;
          min-width: 0; /* Important for text-truncate to work properly */
        }
        
        .person-details {
          flex: 1;
          min-width: 0;
        }
        
        .person-name {
          max-width: 100%;
        }
        
        .person-username {
          max-width: 100%;
        }
        
        .blog-title {
          display: block;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        /* Extra small devices (phones) */
        @media (max-width: 575.98px) {
          .person-avatar {
            width: 35px;
            height: 35px;
          }
          
          .person-name {
            font-size: 0.9rem;
          }
          
          .person-username {
            font-size: 0.75rem;
          }
        }
        
        /* Small devices (tablets) */
        @media (min-width: 576px) and (max-width: 767.98px) {
          .person-avatar {
            width: 35px;
            height: 35px;
          }
        }
        
        /* Medium devices */
        @media (min-width: 768px) and (max-width: 991.98px) {
          .person-details {
            max-width: 120px;
          }
        }
        
        /* Ensure the sidebar doesn't overflow on larger screens */
        @media (min-width: 992px) {
          .leftnav-container {
            max-width: 350px;
          }
        }
      `}</style>
    </div>
  );
}