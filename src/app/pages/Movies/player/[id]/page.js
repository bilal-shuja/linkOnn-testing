"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import createAPI from "@/app/lib/axios";
import Image from "next/image";
import { toast } from "react-toastify";
import { use } from "react";
import { useSiteSettings } from "@/context/SiteSettingsContext"
import ModuleUnavailable from "@/app/pages/Modals/ModuleUnavailable";

export default function MovieDetailPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const api = createAPI();
  const settings = useSiteSettings()
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchMovie = async () => {
      try {
        const response = await api.post("/api/all-movies");
        if (response.data.code === "200") {
          const movieData = response.data.data.find(m => m.id === id);
          if (movieData) {
            setMovie(movieData);
          } else {
            toast.error("Movie not found");
            router.push("/pages/Movies");
          }
        } else {
          toast.error("Error fetching movie data");
        }
      } catch (error) {
        toast.error("Error fetching movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!movie) {
    return <div className="text-center text-white movie-bg vh-100 d-flex align-items-center justify-content-center fs-2">Movie not found</div>;
  }

  if (settings["chck-movies"] !== "1")  {
    return <ModuleUnavailable />;
}
  return (
    <div className="movie-details-page">
      {/* Backdrop */}
      <div className="backdrop-container position-relative mb-5">
        <div className="backdrop-gradient"></div>
        <div className="backdrop-image" style={{
          backgroundImage: `url(${movie.cover_pic || "/assets/images/placeholder-image.png"})`
        }}></div>
      </div>

      <div className="container pb-5">
        <div className="row g-4">
          {/* Left Column - Poster */}
          <div className="col-lg-4">
            <div className="movie-poster-container">
              <div className="movie-poster-wrapper">
                <Image
                  src={movie.cover_pic || "/assets/images/placeholder-image.png"}
                  alt={movie.movie_name}
                  width={400}
                  height={600}
                  className="movie-poster"
                />
              </div>
            </div>

            <div className="movie-info-card mt-4">
              <h3 className="info-title mb-3">Movie Info</h3>

              <ul className="list-group list-group-flush movie-info-list">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="info-icon">📅</span>
                  <span className="info-label">Release Year:</span>
                  <span className="info-value">{movie.release_year}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="info-icon">⏱️</span>
                  <span className="info-label">Duration:</span>
                  <span className="info-value">{movie.duration} mins</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="info-icon">🎬</span>
                  <span className="info-label">Genre:</span>
                  <span className="info-value">{movie.genre}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="info-icon">👤</span>
                  <span className="info-label">Producer:</span>
                  <span className="info-value">{movie.producer}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Details & Player */}
          <div className="col-lg-8">
            <h1 className="movie-title">{movie.movie_name}</h1>

            <div className="d-flex align-items-center gap-2 mb-4 stars-section">
              <span className="star-icon">⭐</span>
              <span className="starring">Starring:</span>
              <span className="stars-names">{movie.stars}</span>
            </div>

            <div className="synopsis-card mb-4">
              <h3 className="synopsis-title mb-3">Synopsis</h3>
              <p className="synopsis-text">{movie.description}</p>
            </div>

            {/* Video Player */}
            <div className="video-container">
              {isPlaying ? (
                <video
                  controls
                  autoPlay
                  className="movie-video"
                >
                  <source src={movie.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="video-thumbnail" onClick={handlePlayClick}>
                  <div className="thumbnail-image" style={{
                    backgroundImage: `url(${movie.cover_pic || "/assets/images/placeholder-image.png"})`
                  }}></div>
                  <div className="play-button-wrapper">
                    <div className="play-button">
                      <div className="play-icon"></div>
                    </div>
                  </div>
                  <div className="thumbnail-info">
                    <h3 className="thumbnail-title">Watch {movie.movie_name}</h3>
                    <p className="thumbnail-duration">{movie.duration} minutes</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .movie-details-page {
          background: linear-gradient(to bottom, #141e30, #243b55);
          min-height: 100vh;
          color: white;
          padding-top: 1rem;
          padding-bottom: 2rem;
        }

        .movie-bg {
          background: linear-gradient(to bottom, #141e30, #243b55);
        }

        .backdrop-container {
          height: 300px;
          width: 100%;
          overflow: hidden;
          border-radius: 12px;
          margin-bottom: 2rem;
        }

        .backdrop-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          opacity: 0.6;
        }

        .backdrop-gradient {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, #141e30 5%, transparent 100%);
          z-index: 1;
        }

        .movie-poster-container {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0, 123, 255, 0.2);
          transition: transform 0.3s ease;
        }

        .movie-poster-container:hover {
          transform: scale(1.03);
        }

        .movie-poster-wrapper {
          position: relative;
          aspect-ratio: 2/3;
          width: 100%;
        }

        .movie-poster {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover;
          border-radius: 12px;
        }

        .movie-info-card {
          background: rgba(33, 37, 41, 0.8);
          border-radius: 12px;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .info-title {
          color: #0dcaf0;
          font-weight: 600;
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }

        .movie-info-list .list-group-item {
          background: transparent;
          border-color: rgba(255, 255, 255, 0.1);
          color: #f8f9fa;
          padding: 0.75rem 0;
        }

        .info-icon {
          font-size: 1.2rem;
          margin-right: 0.5rem;
        }

        .info-label {
          color: #adb5bd;
        }

        .info-value {
          font-weight: 500;
        }

        .movie-title {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, #0dcaf0, #6610f2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
        }

        .stars-section {
          margin-bottom: 1.5rem;
        }

        .star-icon {
          color: #ffc107;
          font-size: 1.2rem;
        }

        .starring {
          color: #ffc107;
          font-weight: 600;
        }

        .stars-names {
          color: #dee2e6;
        }

        .synopsis-card {
          background: rgba(33, 37, 41, 0.6);
          border-radius: 12px;
          padding: 1.5rem;
          backdrop-filter: blur(5px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .synopsis-title {
          color: #0dcaf0;
          font-weight: 600;
          font-size: 1.3rem;
        }

        .synopsis-text {
          color: #dee2e6;
          line-height: 1.6;
        }

        .video-container {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 123, 255, 0.3);
          background: #343a40;
        }

        .movie-video {
          width: 100%;
          aspect-ratio: 16/9;
          background: #000;
          display: block;
        }

        .video-thumbnail {
          position: relative;
          aspect-ratio: 16/9;
          cursor: pointer;
          background: #000;
        }

        .thumbnail-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          opacity: 0.6;
          transition: opacity 0.3s ease;
        }

        .video-thumbnail:hover .thumbnail-image {
          opacity: 0.4;
        }

        .play-button-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .play-button {
          width: 80px;
          height: 80px;
          background: rgba(13, 110, 253, 0.7);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease, background-color 0.3s ease;
          box-shadow: 0 0 20px rgba(13, 110, 253, 0.5);
          backdrop-filter: blur(4px);
        }

        .play-icon {
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 15px 0 15px 25px;
          border-color: transparent transparent transparent white;
          margin-left: 5px;
        }

        .video-thumbnail:hover .play-button {
          transform: scale(1.1);
          background: rgba(13, 110, 253, 0.9);
        }

        .thumbnail-info {
          position: absolute;
          bottom: 20px;
          left: 20px;
          z-index: 2;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
        }

        .thumbnail-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.25rem;
        }

        .thumbnail-duration {
          font-size: 0.9rem;
          color: #adb5bd;
        }

        @media (max-width: 992px) {
          .movie-title {
            font-size: 2rem;
            margin-top: 1.5rem;
          }
          
          .backdrop-container {
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
}