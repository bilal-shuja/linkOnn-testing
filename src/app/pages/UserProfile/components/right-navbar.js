'use client'

import Link from 'next/link';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import Image from "next/image";

const RightNavbar = ({ user }) => {
  const api = createAPI();
  const router = useRouter();
  const [friendsList, setFriendsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postImages, setPostImages] = useState([]);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await api.post("/api/get-friends", {
        user_id: user.id,
      });
      if (response.data.code == "200") {
        setFriendsList(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error fetching friends.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchPosts = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const response = await api.post("/api/post/newsfeed", {
        user_id: user.id,
        post_type: "post",
        limit: '50'
      });

      if (response.data && Array.isArray(response.data.data)) {
        const newPosts = response.data.data;

        const imagesFromPosts = newPosts
          .filter(post => post.images && Array.isArray(post.images) && post.images.length > 0)
          .map(post => post.images[0].media_path);

        setPostImages(imagesFromPosts);
      } else {
        toast.error("Invalid data format received from API.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching newsfeed data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSeeAllPhotos = () => {
    router.push(`/pages/UserProfile/images/${user.id}`);
  };

  const handleSeeAllFriends = () => {
    router.push(`/pages/UserProfile/friends/${user.id}`);
  };

  return (
    <div className="col-12 col-lg-4 position-sticky top-0">
      <div className="row g-4">
        <div className="col-12">
          <div className="card shadow-lg border-0 rounded-3 about-card">
            <div className="card-body p-4">
              {/* Header with Icon */}
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-person-circle text-primary fs-3 me-2"></i>
                <h4 className="fw-bold mb-0">About</h4>
              </div>

              {/* About Description */}
              <p className="text-muted about-text">{user.about_you}</p>

              {/* Gender Info */}
              <div className="d-flex align-items-center text-muted mb-2">
                {user.gender === 'Male' && (
                  <i className="bi bi-gender-male text-primary fs-5 me-2"></i>
                )}
                {user.gender === 'Female' && (
                  <i className="bi bi-gender-female text-danger fs-5 me-2"></i>
                )}
                <p className="fw-semibold mb-0">{user.gender}</p>
              </div>

              {/* Date of Birth */}
              <p className="text-muted d-flex align-items-center">
                <i className="bi bi-calendar-date fs-5 text-warning me-2"></i>
                <span>
                  DOB:
                  {user.date_of_birth && user.date_of_birth.trim() !== "" && (
                    <strong className="mx-1">{moment(user.date_of_birth).format("MMM DD, YYYY")}</strong>
                  )}
                </span>
              </p>

              {/* Relationship Status */}
              <p className="text-muted d-flex align-items-center">
                <i className="bi bi-heart fs-5 text-danger me-2"></i>
                <span>
                  Status:
                  <strong className="mx-1">
                    {user.relation_id === '0' && 'None'}
                    {user.relation_id === '1' && 'Single'}
                    {user.relation_id === '2' && 'In a Relationship'}
                    {user.relation_id === '3' && 'Married'}
                    {user.relation_id === '4' && 'Engaged'}
                  </strong>
                </span>
              </p>
            </div>
          </div>
        </div>


        <div className="col-12">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              <h4 className="mb-3">Social Links</h4>
              <div className="d-flex justify-content-between mx-3">
                {user.facebook && user.facebook !== "" && user.facebook !== "#" && (
                  <Link href={user.facebook}>
                    <i className="bi bi-facebook text-primary" style={{ fontSize: '1.5rem' }}></i>
                  </Link>
                )}
                {user.twitter && user.twitter !== "" && user.twitter !== "#" && (
                  <Link href={user.twitter}>
                    <i className="bi bi-twitter text-info" style={{ fontSize: '1.5rem' }}></i>
                  </Link>
                )}
                {user.instagram && user.instagram !== "" && user.instagram !== "#" && (
                  <Link href={user.instagram}>
                    <i className="bi bi-instagram text-danger" style={{ fontSize: '1.5rem' }}></i>
                  </Link>
                )}
                {user.linkedin && user.linkedin !== "" && user.linkedin !== "#" && (
                  <Link href={user.linkedin}>
                    <i className="bi bi-linkedin text-primary" style={{ fontSize: '1.5rem' }}></i>
                  </Link>
                )}
                {user.youtube && user.youtube !== "" && user.youtube !== "#" && (
                  <Link href={user.youtube}>
                    <i className="bi bi-youtube text-danger" style={{ fontSize: '1.5rem' }}></i>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-12">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Photos</h4>
                <button
                  className="btn btn-light text-primary border-0 rounded-1"
                  onClick={handleSeeAllPhotos}
                  type="button"
                >
                  See all Photos
                </button>
              </div>
              <div className="min-vh-25">
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : postImages.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-images text-secondary fs-1"></i>
                    <p className="mt-3 text-secondary fw-semibold fs-4">
                      No Photos Available
                    </p>
                  </div>
                ) : (
                  <div className="row g-2">
                    {postImages.slice(0, 6).map((img, index) => (
                      img && (
                        <div className="col-6 col-md-4 col-lg-4" key={index}>
                          <div className="position-relative" style={{ paddingBottom: '100%' }}>
                            <Link
                              href={img}
                              className="d-block position-absolute top-0 start-0 w-100 h-100"
                            >
                              <Image
                                src={img}
                                alt={`Post Image ${index + 1}`}
                                fill
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                className="rounded-3"
                                style={{ objectFit: 'cover' }}
                                priority={index < 2}
                              />
                            </Link>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-12">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-body p-4">
              {/* Friends Header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <h4 className="fw-bold mb-0">Friends</h4>
                  <span className="badge bg-danger ms-2">{user.friends_count}</span>
                </div>
                <button className="btn btn-outline-primary rounded-3 px-3" onClick={handleSeeAllFriends}>
                  See all
                </button>
              </div>

              {/* Loading Spinner */}
              {loading ? (
                <div className="d-flex justify-content-center align-items-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="row g-3">
                  {/* No Friends UI */}
                  {friendsList.length === 0 ? (
                    <div className="text-center">
                      <i className="bi bi-people text-secondary fs-1"></i>
                      <p className="mt-3 text-secondary fw-semibold fs-4">No Friends</p>
                    </div>
                  ) : (
                    friendsList.map((friend, index) => (
                      <div key={`${friend.id}-${index}`} className="col-6 text-center">
                        {/* Friend Avatar */}
                        <div className="friend-avatar mx-auto">
                          <Image
                            src={friend.avatar}
                            alt={`${friend.first_name} ${friend.last_name}`}
                            className="rounded-circle border border-2 border-light shadow"
                            width={60}
                            height={60}
                            onClick={() => router.push(`/pages/UserProfile/timeline/${friend.id}`)}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                        {/* Friend Name */}
                        <h6
                          className="fw-semibold mt-2 text-primary friend-name"
                          onClick={() => router.push(`/pages/UserProfile/timeline/${friend.id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          {friend.first_name} {friend.last_name}
                        </h6>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>



      </div>
    </div>
  );
};

export default RightNavbar;