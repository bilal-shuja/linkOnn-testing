"use client";

 
import Rightnav from "@/app/assets/components/rightnav/page";
import React, { useState, useEffect } from "react";
import createAPI from "@/app/lib/axios";
import { useRouter } from "next/navigation";
   
import { toast } from "react-toastify";

export default function Pageform() {
    
  const router = useRouter();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [pageName, setPageName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);
  const [category, setCategory] = useState("");
  const [isClient, setIsClient] = useState(false);

  const api = createAPI();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleNameChange = (e) => {
    setPageName(e.target.value);
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleAvatarChange = (e) => {
    if (e.target.files.length > 0) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleCoverChange = (e) => {
    if (e.target.files.length > 0) {
      setCover(e.target.files[0]);
    }
  };

  const addPage = async () => {
    if (!pageName || !description || !category) {
      if (typeof window !== "undefined") {
        toast.error("Please fill in all fields!");
      }
      return;
    }

    try {
      const formData = new FormData();
      formData.append("page_title", pageName);
      formData.append("website", url);
      formData.append("page_description", description);
      formData.append("page_category", category);
      if (cover) {
        formData.append("cover", cover);
      }
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const response = await api.post("/api/add-page", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.code == "200") {
        setError("");
        toast.success(response.data.message);
        router.push("/pages/page");
      } else {
        toast.error("Error from server: " + response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        
      <div className="container-fluid bg-light">
        <div className="container mt-3 pt-5">
          <div className="row">
            <div className="col-md-3 p-3 rounded">
              <Rightnav />
            </div>
            <div className="col-md-9 p-3">
              <div className="card shadow-lg border-0 p-3">
                <div className="card-body">
                  <h5 className="fw-bold mt-2 fs-4">Create a page</h5>
                  {success && (
                    <div className="alert alert-success mt-2">{success}</div>
                  )}
                  {error && <p className="text-center text-danger">{error}</p>}
                  <div className="mt-4">
                    <label className="form-label mx-1 text-muted">
                      Page Name
                    </label>
                    <input
                      className="form-control px-3"
                      type="text"
                      placeholder="Page Name (Required)"
                      value={pageName}
                      onChange={handleNameChange}
                    />
                    <label className="text-secondary form-label">
                      {" "}
                      <small>
                        {" "}
                        Name that describes what the page is about.{" "}
                      </small>{" "}
                    </label>
                  </div>
                  <div className="mt-4 d-flex gap-3">
                    <div className="w-50">
                      <label className="form-label text-muted px-1">
                        Category (required)
                      </label>
                      <select
                        className="form-select bg-light"
                        aria-label="Default select example"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">Select Category</option>{" "}
                        <option value="1">Arts & Entertainment</option>
                        <option value="2">Business & Finance</option>
                        <option value="3">Education & Learning</option>
                        <option value="4">Fashion & Beauty</option>
                        <option value="5">Food & Beverage</option>
                        <option value="6">Health & Wellness</option>
                        <option value="7">News & Media</option>
                        <option value="8">Science & Technology</option>
                        <option value="9">Sports & Recreation</option>
                        <option value="10">Travel & Tourism</option>
                        <option value="11">Community & Social Services</option>
                        <option value="12">Home & Garden</option>
                        <option value="13">Real Estate</option>
                        <option value="14">Automotive</option>
                        <option value="15">Pets & Animals</option>
                        <option value="16">Music & Performing Arts</option>
                        <option value="17">Photography & Visual Arts</option>
                        <option value="18">Legal & Government</option>
                        <option value="19">Environmental & Nature</option>
                        <option value="20">Hobbies & Crafts</option>
                        <option value="21">Books & Literature</option>
                        <option value="22">Religion & Spirituality</option>
                      </select>
                    </div>
                    <div className="w-50">
                      <label className="form-label text-muted px-1">
                        Website URL
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="https://www.example.com/"
                        value={url}
                        onChange={handleUrlChange}
                      />
                    </div>
                  </div>

                  <div className="mt-4 d-flex gap-3">
                    <div className="w-50">
                      <label className="form-label text-muted px-1">
                        Avatar
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </div>
                    <div className="w-50">
                      <label className="form-label text-muted px-1">
                        Cover
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleCoverChange}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="form-label mx-1 text-muted">
                      About Page
                    </label>
                    <textarea
                      className="form-control px-3"
                      rows="3"
                      placeholder="Description (Required)"
                      value={description}
                      onChange={handleDescriptionChange}
                      maxLength={500}
                    ></textarea>

                    <label className="text-secondary form-label">
                      {" "}
                      <small> Character limit: 500 </small>{" "}
                    </label>
                  </div>

                  <div className="mt-4 d-flex justify-content-end">
                    <button className="btn btn-primary" onClick={addPage}>
                      Create Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
