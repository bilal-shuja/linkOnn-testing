"use client";

import createAPI from "@/app/lib/axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import moment from "moment";
import Image from "next/image";
import { useSiteSettings } from "@/context/SiteSettingsContext"
import ModuleUnavailable from "../Modals/ModuleUnavailable";

export default function Blogs() {
  const [error, setError] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [recentTags, setRecentTags] = useState([]);
  const settings = useSiteSettings()
  const api = createAPI();

  const fetchRecentBlogs = async () => {
    try {
      const response = await api.post("/api/recent-blogs");
      if (response.data.code == "200") {
        setRecentBlogs(response.data.data);
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
      const response = await api.post(`/api/recent-tags`);
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

  if (!settings) return null

  if (settings["chck-blogs"] !== "1")  {
    return <ModuleUnavailable />;
}

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Main Blog Section */}
        <div className="col-md-8 mt-5">
          <div className="card shadow-lg border-0 p-4">
            <div className="card-body">
              <h3 className="mb-4 fw-bold text-center text-primary">Blogs</h3>
              {blogs.map((blog) => (
                <div key={blog.id} className="col-md-12 mb-4">
                  <div className="d-flex align-items-start shadow-sm p-3 rounded bg-light">
                    <div>
                      <Image
                        src={blog.thumbnail || "/assets/images/placeholder-image.png"}
                        alt={blog.title}
                        className="rounded"
                        width={200}
                        height={150}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="ms-3">
                      <span className="badge bg-danger text-white mb-2">{blog.category}</span>
                      <Link href={`/pages/Blogs/details/${blog.id}`} className="text-decoration-none fw-semibold text-primary">
                      <h5 className="fw-bold">{blog.title}</h5>
                      </Link>
                      <p className="text-muted mb-2">
                        <i className="bi bi-calendar-event pe-2"></i>
                        {moment(blog.created_at).format("MMM DD, YYYY")}
                      </p>
                      <Link href={`/pages/Blogs/details/${blog.id}`} className="text-decoration-none fw-semibold text-primary">
                        Read more →
                      </Link>
                    </div>
                  </div>
                  <hr className="text-muted" />
                </div>
              ))}

              {/* Pagination */}
              <div className="d-flex justify-content-center mt-4">
                <nav>
                  <ul className="pagination pagination-sm">
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

        {/* Sidebar Section */}
        <div className="col-md-4 mt-5">
          {/* Recent Posts */}
          <div className="card shadow-lg border-0 p-3">
            <div className="card-body">
              <h5 className="fw-bold text-dark">Recent Blogs</h5>
              <ul className="list-group list-group-flush">
                {recentBlogs.map((blog) => (
                  <li key={blog.id} className="list-group-item">
                    <Link href={`/pages/Blogs/details/${blog.id}`} className="text-decoration-none text-dark fw-semibold">
                      {blog.title}
                    </Link>
                    <br />
                    <small className="text-muted">
                      {blog.created_at}
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tags Section */}
          {/* <div className="card shadow-lg border-0 mt-4 p-3">
            <div className="card-body">
              <h5 className="fw-bold text-dark">Popular Tags</h5>
              <div className="d-flex flex-wrap">
                {recentTags.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/pages/Blogs/tags/${tag.id}`}
                    className="btn btn-outline-primary btn-sm me-2 mb-2"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          </div> */}

        </div>
      </div>
    </div>
  );
}
