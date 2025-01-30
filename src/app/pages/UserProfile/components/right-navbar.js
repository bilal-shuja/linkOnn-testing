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
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              <h4>About</h4>
              <p className="text-muted">{user.about_you}</p>
              <div className="d-flex justify-content-between text-muted">
                <p className="fw-semibold">
                  {user.gender === 'Male' && (
                    <i className="bi bi-gender-male fa-fw pe-1"></i>
                  )}
                  {user.gender === 'Female' && (
                    <i className="bi bi-gender-female fa-fw pe-1"></i>
                  )}
                  {user.gender}
                </p>
              </div>
              <p className="text-muted">
                <i className="bi bi-calendar-date fa-fw pe-1"></i>
                DOB:
                <strong className="mx-1">
                  {moment(user.date_of_birth).format("MMM DD, YYYY")}
                </strong>
              </p>
              <p className="text-muted">
                <i className="bi bi-heart fa-fw pe-1"></i>
                Status:
                <strong className="mx-1">
                  {user.relation_id === '0' && 'None'}
                  {user.relation_id === '1' && 'Single'}
                  {user.relation_id === '2' && 'In a Relationship'}
                  {user.relation_id === '3' && 'Married'}
                  {user.relation_id === '4' && 'Engaged'}
                </strong>
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
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center justify-content-evenly">
                  <h4>Friends</h4>
                  <span className="badge bg-danger mb-1 mx-1">{user.friends_count}</span>
                </div>
                <button className="btn btn-light text-primary border-0 rounded-1" onClick={handleSeeAllFriends} >See all Friends</button>
              </div>
              <div className='my-3'>
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="row g-3">
                    {friendsList.length === 0 ? (
                      <div className="text-center">
                        <i className="bi bi-people text-secondary fs-1"></i>
                        <p className="mt-3 text-secondary fw-semibold fs-4">
                          No Friends.
                        </p>
                      </div>
                    ) : (
                      friendsList.map((friend, index) => (
                        <div key={`${friend.id}-${index}`} className="col-6">
                          <div className="card shadow-none text-center h-100">
                            <div className="card-body p-2 pb-0">
                              <div className="avatar avatar-xl">
                                <Image
                                  src={friend.avatar}
                                  alt={`${friend.first_name} ${friend.last_name}`}
                                  className="avatar-img rounded-circle"
                                  width={50}
                                  height={50}
                                  onClick={() => router.push(`/pages/UserProfile/timeline/${friend.id}`)}
                                  style={{ cursor: "pointer" }}
                                />
                              </div>
                              <h6 className="card-title mb-1 mt-3"
                                onClick={() => router.push(`/pages/UserProfile/timeline/${friend.id}`)}
                                style={{ cursor: "pointer" }} >
                                {friend.first_name} {friend.last_name}
                              </h6>
                            </div>
                          </div>
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
    </div>
  );
};

export default RightNavbar;