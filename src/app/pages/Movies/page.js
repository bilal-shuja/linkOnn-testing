"use client";

import Navbar from "@/app/assets/components/navbar/page";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import createAPI from "@/app/lib/axios";
import Image from "next/image";
import useAuth from "@/app/lib/useAuth";
import { toast } from "react-toastify";

export default function MoviesPage() {
  useAuth();
  const api = createAPI();
  const [movies, setMovies] = useState([]);
  const [movieLoading, setMovieLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const genres = [
    "Action", "Adventure", "Comedy", "Drama", "Thriller", "Horror",
    "Science Fiction (Sci-Fi)", "Fantasy", "Mystery", "Romance", "Animation",
    "Family", "Superhero", "Documentary", "Biography"
  ];

  const fetchMovies = async () => {
    setMovieLoading(true);
    try {
      const response = await api.post("/api/all-movies");
      if (response.data.code === "200") {
        setMovies(response.data.data);
        setFilteredMovies(response.data.data);
      } else {
        toast.error("No movies found");
      }
    } catch (error) {
      toast.error("Error fetching Movies");
    } finally {
      setMovieLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    if (genre) {
      const filtered = movies.filter(movie => movie.genre === genre);
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(movies);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const filtered = movies.filter(movie =>
        movie.movie_name.toLowerCase().includes(query)
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(movies);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div
          className="d-flex justify-content-center align-items-center mb-5 position-relative"
          style={{
            backgroundImage: 'url(/assets/images/0.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '30vh',
            marginTop: '80px'
          }}
        >
          <div className="text-center position-absolute top-50 start-50 translate-middle z-index-1">
            <h2 className="fw-bold text-white">Movies</h2>
            <p className="text-white">Discover new movies</p>
            <div className="d-flex justify-content-center align-items-center">
              <div className="input-group" style={{ minWidth: '400px' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for movies"
                  aria-label="Search for movies"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button className="btn btn-primary form-buton" type="button">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-3">
            <div className="card mb-3 shadow-lg border-0">
              <div className="card-body">
                <div className="list-group list-group-flush">
                  {/* Always show the full list of categories */}
                  {genres.map((genre) => (
                    <Link
                      key={genre}
                      className="list-group-item text-decoration-none border-0 bold-text"
                      href="#"
                      onClick={() => handleGenreClick(genre)}
                    >
                      <i className="bi bi-film"></i>
                      <span className="mx-3">{genre}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center mt-5">
              <Link href="#" className="text-muted mx-2 text-decoration-none">About Us</Link>
              <Link href="#" className="text-muted mx-2 text-decoration-none">Settings</Link>
              <Link href="#" className="text-muted mx-2 text-decoration-none">Support</Link>
              <Link href="#" className="text-muted mx-2 text-decoration-none">Terms & Conditions</Link>
              <Link href="#" className="text-muted mx-2 text-decoration-none">Privacy Policy</Link>
              <p className="text-muted mt-3">©2024 linkon</p>
            </div>
          </div>

          <div className="col-md-9">
            <div className="card shadow-lg border-0 p-1">
              <div className="card-body">
                <h4 className="fw-semibold">Movies</h4>
                <hr className="text-muted" />
                {movieLoading ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    {filteredMovies.length > 0 ? (
                      filteredMovies.map((movie) => (
                        <div key={movie.id} className="col-md-4 col-sm-6 col-12 mb-4">
                          <div className="card shadow-lg border-0" style={{ height: '100%' }}>
                            <Image
                              src={movie.cover_pic}
                              alt={movie.movie_name}
                              className="card-img-top"
                              width={300}
                              height={200}
                              style={{
                                objectFit: "cover",
                              }}
                            />

                            <div className="card-body" style={{ minHeight: '200px' }}>
                              <h5 className="card-title text-truncate text-center" title={movie.movie_name}>
                                {movie.movie_name}
                              </h5>
                              <div className="text-center">
                                <p className="text-muted mb-0">
                                  <i className="bi bi-star-fill"></i> Stars: {movie.stars}
                                </p>
                                <p className="text-muted">
                                  <i className="bi bi-person"></i> Producer: {movie.producer}
                                </p>
                                <p className="text-muted">
                                  <i className="bi bi-calendar"></i> Release Year: {movie.release_year}
                                </p>
                                <p className="text-muted">
                                  <i className="bi bi-clock"></i> Duration: {movie.duration || '0'} mins
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted">No movies found for this search.</p>
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
}
