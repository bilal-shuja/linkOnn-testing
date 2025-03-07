"use client";

import createAPI from "@/app/lib/axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import moment from "moment";
import Image from "next/image";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import ModuleUnavailable from "@/app/pages/Modals/ModuleUnavailable";
import { use } from "react";
import { toast } from "react-toastify";

export default function BlogsDetails({ params }) {

  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const [blogs, setBlogs] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const settings = useSiteSettings();
  const api = createAPI();
  const [loading, setLoading] = useState(true);

  const fetchRecentBlogs = async () => {
    try {
      const response = await api.post("/api/recent-blogs");
      if (response.data.code == "200") {
        setRecentBlogs(response.data.data);
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error("Catch Error");
    }
  };

  const fetchArticlesBlogs = async () => {
    if (!id) return;
    try {
      const response = await api.post("/api/blog-details", { blog_id: id });
      if (response.data.code == "200") {
        setBlogs(response.data.data);
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      toast.error("Catch Error");
    }  finally {
      setLoading(false);
  }
  };

  useEffect(() => {
    fetchArticlesBlogs();
    fetchRecentBlogs();
  }, []);

  if (loading) {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}

  if (!blogs) {
    return (
        <div className="container mt-5 pt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card p-5 shadow text-center">
                        <i className="bi bi-exclamation-circle text-warning" style={{ fontSize: "3rem" }}></i>
                        <h3 className="mt-3">Blog Not Found</h3>
                        <p className="text-muted">The Blog details you are looking for could not be found.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
  if (!settings) return null;

  if (settings["chck-blogs"] !== "1") {
    return <ModuleUnavailable />;
  }


  return (
    <div className="blog-container mt-5 pt-5">
      <div className="row">
        {/* Main Blog Content Section */}
        <div className="col-md-8">
          {blogs && (
            <div className="blog-card">
              {/* Blog Thumbnail */}
              <Image
                src={blogs.thumbnail || "/assets/images/placeholder-image.png"}
                alt={blogs.title}
                width={800}
                height={400}
                className="blog-thumbnail"
                priority
              />

              {/* Blog Content */}
              <div className="blog-content">
                <h1 className="blog-title">{blogs.title}</h1>

                <div className="blog-meta">
                  <span className="blog-category">{blogs.category}</span>
                  <small className="blog-date">
                    <i className="bi bi-calendar me-2"></i>
                    {moment(blogs.created_at).format("MMMM D, YYYY")}
                  </small>
                </div>

                <div
                  className="blog-text"
                  dangerouslySetInnerHTML={{ __html: blogs.content }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Section */}
        <div className="col-md-4">
          {/* Recent Blogs Tags */}
          <div className="sidebar">
            <h5 className="sidebar-title">Recent Blogs</h5>
            <ul className="recent-blogs-list">
              {recentBlogs.map((blog) => (
                <li key={blog.id} className="recent-blog-item">
                  <Link
                    href={`/pages/Blogs/details/${blog.id}`}
                    className="recent-blog-link text-decoration-none"
                  >
                    {blog.title}
                  </Link>
                  <br />
                  <small className="recent-blog-date">{blog.created_at}</small>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .blog-container {
          max-width: 1200px;
          margin: auto;
          padding: 40px 20px;
          background-color: #f8f9fa;
        }

        .blog-card {
          background: #fff;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          overflow: hidden;
          transition: transform 0.3s ease-in-out;
        }

        .blog-card:hover {
          transform: translateY(-5px);
        }

        .blog-thumbnail {
          width: 100%;
          object-fit: cover;
        }

        .blog-content {
          padding: 20px;
        }

        .blog-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 15px;
          color: #333;
        }

        .blog-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: #777;
          margin-bottom: 20px;
        }

        .blog-category {
          background: #dc3545;
          color: #fff;
          padding: 5px 10px;
          border-radius: 5px;
        }

        .blog-date {
          font-style: italic;
        }

        .blog-text {
          font-size: 1rem;
          color: #555;
          line-height: 1.7;
        }

        .sidebar {
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }

        .sidebar-title {
          font-size: 1.3rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 15px;
        }

        .recent-blogs-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .recent-blog-item {
          border-bottom: 1px solid #ddd;
          padding: 10px 0;
        }

        .recent-blog-item:last-child {
          border-bottom: none;
        }

        .recent-blog-link {
          text-decoration: none;
          font-weight: bold;
          color: #333;
          transition: color 0.3s;
        }

        .recent-blog-link:hover {
          color: #dc3545;
        }

        .recent-blog-date {
          font-size: 0.9rem;
          color: #777;
        }
      `}</style>
    </div>
  );
}
