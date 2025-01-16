"use client";

import Navbar from "@/app/assets/components/navbar/page";
import createAPI from "@/app/lib/axios";
import { useState, useEffect } from "react";
 
import Link from "next/link";
import moment from "moment";
import Image from "next/image";
import useAuth from "@/app/lib/useAuth";

export default function Blogs() {
  useAuth();
  const [error, setError] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [recentTags, setRecentTags] = useState([]);

  const api = createAPI();

  const fetchRecentBlogs = async () => {
    try {
      const response = await api.post("/public_api/recent-blogs");
      if (response.data.code == "200") {
        const lastFiveBlogs = response.data.data.slice(0, 5);
        setRecentBlogs(lastFiveBlogs);
      } else {
        if (typeof window !== "undefined") {
          alert(response.data.message);
        }
      }
    } catch (error) {
      setError("Catch Error");
    }
  };

  const fetchArticlesBlogs = async () => {
    try {
      const response = await api.get(`/api/all-blogs`);
      if (response.data.code == "200") {
        setBlogs(response.data.data);
      } else {
        if (typeof window !== "undefined") {
          alert(response.data.message);
        }
      }
    } catch (error) {
      setError("Catch Error");
    }
  };

  const fetchRecentTags = async () => {
    try {
      const response = await api.post(`/web_api/recent-tags`);
      if (response.data.code == "200") {
        setRecentTags(response.data.data);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log("Catch Error");
    }
  };

  useEffect(() => {
    fetchArticlesBlogs();
    fetchRecentBlogs();
    fetchRecentTags();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row">
          <div className="col-md-8 mt-5">
            <div className="card shadow-lg border-0 p-3">
              <div className="card-body">
                <h3 className="mb-4 fw-bold text-center">Blogs</h3>
                {blogs.map((blog) => (
                  <div key={blog.id} className="col-md-12 mb-4">
                    <div className="border-0 d-flex mb-3">
                      <div>
                        <Image
                          src={blog.thumbnail}
                          alt={blog.title}
                          className="card-img-top"
                          width={250}
                          height={300}
                          style={{ objectFit: "cover" }}
                        />

                      </div>
                      <div className="mx-4">
                        <span
                          className="badge bg-danger text-white mb-2"
                          style={{
                            fontSize: "12px",
                            padding: "5px 10px",
                          }}
                        >
                          {blog.category}
                        </span>
                        <h5 className="card-title">{blog.title}</h5>
                        <Link
                          href="#"
                          className="text-primary text-decoration-none"
                        >
                          Read more...
                        </Link>
                        <div className="text-dark fw-semibold mt-2">
                          <small>
                            <i className="bi bi-calendar-event pe-2"></i>
                            {moment(blog.created_at).format("MMM DD, YYYY")}
                          </small>
                        </div>
                      </div>
                    </div>
                    <hr className="text-muted m-0" />
                  </div>
                ))}

                <div className="d-flex justify-content-center mt-4">
                  <nav>
                    <ul className="pagination">
                      <li className="page-item">
                        <Link href="#" className="page-link">
                          1
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mt-5">
            <div className="card shadow-lg border-0 p-3">
              <div className="card-body">
                <div className="card-title bg-white fw-bold">Recent Posts</div>
                <ul className="list-group list-group-flush">
                  {recentBlogs.map((blog) => (
                    <div key={blog.id}>
                      <Link
                        href="#"
                        className="text-decoration-none text-primary"
                      >
                        {blog.title}
                      </Link>
                      <br />
                      <small className="text-muted">
                        {" "}
                        {moment(blog.created_at).format("MMM DD, YYYY")}{" "}
                      </small>
                      <hr />
                    </div>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card shadow-lg border-0 mt-5 p-3">
              <div className="card-body">
                <div className="card-title bg-white fw-bold">Tags</div>
                <div className="card-body">
                  <ul className="list-inline mb-0 d-flex flex-wrap gap-2">
                    <li className="list-inline-item m-0">
                      <button className="btn btn-outline-secondary btn-sm">
                        Accusamus cum deleni
                      </button>
                    </li>
                    <li className="list-inline-item m-0">
                      <button className="btn btn-outline-secondary btn-sm">
                        Eum aliquip quia dis
                      </button>
                    </li>
                    <li className="list-inline-item m-0">
                      <button className="btn btn-outline-secondary btn-sm">
                        Culpa voluptas ullam
                      </button>
                    </li>
                  </ul>
                </div>
                {recentTags.map((tag, index) => (
                  <Link
                    key={index}
                    href="#"
                    className="btn btn-light btn-sm me-2 mb-2 border"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
