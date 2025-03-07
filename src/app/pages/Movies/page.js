"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSiteSettings } from "@/context/SiteSettingsContext"
import { toast } from "react-toastify"
import createAPI from "@/app/lib/axios"
import ModuleUnavailable from "../Modals/ModuleUnavailable"

export default function MoviesPage() {
  const api = createAPI()
  const [movies, setMovies] = useState([])
  const [movieLoading, setMovieLoading] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [filteredMovies, setFilteredMovies] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  const settings = useSiteSettings()

  const fetchMovies = async () => {
    setMovieLoading(true)
    try {
      const response = await api.post("/api/all-movies")
      if (response.data.code === "200") {
        setMovies(response.data.data)
        setFilteredMovies(response.data.data)
      } else {
        toast.error("No movies found")
      }
    } catch (error) {
      toast.error("Error fetching Movies")
    } finally {
      setMovieLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [])

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre)
    if (genre) {
      const filtered = movies.filter((movie) => movie.genre === genre)
      setFilteredMovies(filtered)
    } else {
      setFilteredMovies(movies)
    }
  }

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    if (query) {
      const filtered = movies.filter((movie) => movie.movie_name.toLowerCase().includes(query))
      setFilteredMovies(filtered)
    } else {
      setFilteredMovies(movies)
    }
  }

  if (!settings) return null

  if (settings["chck-movies"] !== "1")  {
    return <ModuleUnavailable />;
}

  return (
    <div className="movies-page bg-light">
      {/* Hero Banner */}
      <div
        className="hero-banner position-relative mb-5"
        style={{
          backgroundImage: "url(/assets/images/0.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "50vh",
          marginTop: "80px",
        }}
      >
        <div className="overlay position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
        <div className="container h-100">
          <div className="row h-100 justify-content-center align-items-center">
            <div className="col-lg-8 text-center position-relative">
              <h1 className="display-4 fw-bold text-white mb-3 text-shadow">Discover Movies</h1>
              <p className="lead text-white mb-4 text-shadow">Find your next favorite film from our collection</p>

              <div className="search-container">
                <div className="input-group input-group-lg shadow">
                  <input
                    type="text"
                    className="form-control border-0"
                    placeholder="Search for movies..."
                    aria-label="Search for movies"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button className="btn btn-primary px-4" type="button">
                    <i className="bi bi-search me-2"></i>
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid py-4">
        <div className="row g-4">
          {/* Sidebar Toggle Button for Small Screens */}
          <div className="col-12 d-lg-none mb-3">
            <button
              className="btn btn-primary w-100"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#sidebar"
              aria-controls="sidebar"
            >
              <i className="bi bi-list me-2"></i>
              Toggle Genres
            </button>
          </div>

          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="offcanvas-lg offcanvas-start" tabIndex="-1" id="sidebar" aria-labelledby="sidebarLabel">
              <div className="offcanvas-header d-lg-none">
                <h5 className="offcanvas-title" id="sidebarLabel">
                  Movie Genres
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                  data-bs-target="#sidebar"
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body p-0">
                <div className="card rounded-3 shadow-sm border-0 mb-4">
                  <div className="card-header bg-primary text-white py-3">
                    <h5 className="mb-0 fw-bold">Movie Genres</h5>
                  </div>
                  <div className="card-body p-0">
                    <div className="list-group list-group-flush">
                      <button
                        className={`list-group-item list-group-item-action d-flex align-items-center py-3 ${!selectedGenre ? "active" : ""}`}
                        onClick={() => handleGenreClick(null)}
                      >
                        <i className="bi bi-film me-3"></i>
                        <span className="fw-medium">All Genres</span>
                      </button>

                      {settings.movie_genres?.map((genre) => (
                        <button
                          key={genre}
                          className={`list-group-item list-group-item-action d-flex align-items-center py-3 ${selectedGenre === genre ? "active" : ""}`}
                          onClick={() => handleGenreClick(genre)}
                        >
                          <i className="bi bi-film me-3"></i>
                          <span className="fw-medium">{genre}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="card rounded-3 shadow-sm border-0">
                    <div className="card-body text-center p-4">
                      <h6 className="text-muted mb-3">Movie Streaming Platform</h6>
                      <p className="small text-muted mb-0">
                        &copy; {new Date().getFullYear()} linkon
                        <br />
                        All rights reserved
                      </p>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            <div className="card rounded-3 shadow-sm border-0">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="fw-bold m-0">
                    {selectedGenre ? selectedGenre : "All Movies"}
                    <span className="badge bg-primary ms-2 rounded-pill">{filteredMovies.length}</span>
                  </h3>

                </div>

                {movieLoading ? (
                  <div className="text-center py-5">
                    <div
                      className="spinner-border text-primary"
                      role="status"
                      style={{ width: "3rem", height: "3rem" }}
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading movies...</p>
                  </div>
                ) : (
                  <>
                    {filteredMovies.length > 0 ? (
                      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                        {filteredMovies.map((movie) => (
                          <div key={movie.id} className="col">
                            <div className="card h-100 movie-card border-0 shadow-sm rounded-3 overflow-hidden transition-all">
                              <div className="position-relative movie-image-container">
                                <Link href={`/pages/Movies/player/${movie.id}`} passHref>
                                  <Image
                                    src={movie.cover_pic || "/assets/images/placeholder-image.png"}
                                    alt={movie.movie_name}
                                    className="card-img-top movie-image"
                                    width={500}
                                    height={300}
                                    style={{
                                      objectFit: "cover",
                                      height: "200px",
                                      width: "100%",
                                    }}
                                  />
                                  <div className="movie-overlay">
                                    <span className="play-button">
                                      <i className="bi bi-play-circle-fill fs-1"></i>
                                    </span>
                                  </div>
                                </Link>
                                <span className="position-absolute top-0 end-0 bg-primary text-white px-2 py-1 m-2 rounded-pill small">
                                  {movie.genre}
                                </span>
                              </div>

                              <div className="card-body p-3">
                                <h5 className="card-title fw-bold text-truncate mb-3" title={movie.movie_name}>
                                  {movie.movie_name}
                                </h5>

                                <div className="movie-details">
                                  <div className="d-flex align-items-center mb-2">
                                    <i className="bi bi-star-fill text-warning me-2"></i>
                                    <span className="small">{movie.stars || "N/A"}</span>
                                  </div>

                                  <div className="d-flex align-items-center mb-2">
                                    <i className="bi bi-person-fill text-muted me-2"></i>
                                    <span className="small text-truncate">{movie.producer || "Unknown"}</span>
                                  </div>

                                  <div className="d-flex align-items-center mb-2">
                                    <i className="bi bi-calendar-event text-muted me-2"></i>
                                    <span className="small">{movie.release_year || "N/A"}</span>
                                  </div>

                                  <div className="d-flex align-items-center">
                                    <i className="bi bi-clock text-muted me-2"></i>
                                    <span className="small">{movie.duration || "0"} mins</span>
                                  </div>
                                </div>
                              </div>

                              <div className="card-footer bg-transparent border-top-0 p-3">
                                <Link
                                  href={`/pages/Movies/player/${movie.id}`}
                                  className="btn btn-primary w-100"
                                  passHref
                                >
                                  Watch Now
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <div className="empty-state">
                          <i className="bi bi-film text-muted mb-3" style={{ fontSize: "4rem" }}></i>
                          <h4>No movies found</h4>
                          <p className="text-muted">We could not find any movies matching your search criteria.</p>
                          <button
                            className="btn btn-outline-primary mt-2"
                            onClick={() => {
                              setSearchQuery("")
                              setSelectedGenre(null)
                              setFilteredMovies(movies)
                            }}
                          >
                            Clear Filters
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx global>{`
        @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css");

        .movies-page {
          min-height: 100vh;
          background-color: #f8f9fa;
        }
        
        .text-shadow {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .search-container {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .movie-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .movie-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }
        
        .movie-image-container {
          position: relative;
          overflow: hidden;
        }
        
        .movie-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .movie-image-container:hover .movie-overlay {
          opacity: 1;
        }
        
        .play-button {
          color: white;
          font-size: 3rem;
        }
        
        .list-group-item-action {
          transition: all 0.2s ease;
        }
        
        .list-group-item-action:hover {
          background-color: #f8f9fa;
          transform: translateX(5px);
        }
        
        .list-group-item-action.active {
          background-color: #0d6efd;
          border-color: #0d6efd;
          color: white;
          font-weight: 500;
        }
        
        .empty-state {
          padding: 2rem;
        }
        
        .transition-all {
          transition: all 0.3s ease;
        }
        
        @media (max-width: 768px) {
          .hero-banner {
            height: 40vh !important;
          }
        }

        /* Styles for the offcanvas sidebar on small screens */
        @media (max-width: 991.98px) {
          .offcanvas-lg {
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  )
}
