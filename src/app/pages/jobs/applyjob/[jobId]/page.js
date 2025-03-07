"use client";


import React, { useState, useEffect } from "react";
import Link from "next/link";
import createAPI from "@/app/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


export default function ApplyJob({ params }) {

  const { jobId } = React.use(params);
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [cv, setCv] = useState(null);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const api = createAPI();
  const router = useRouter();
  const handlePhone = (e) => setPhone(e.target.value);
  const handlePosition = (e) => setPosition(e.target.value);
  const handleCompany = (e) => setCompany(e.target.value);
  const handleAddress = (e) => setAddress(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const [jobCategory, setJobCategory] = useState([]);

  const handleFile = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.size > 5000000) {
        toast.error("File size exceeds 5MB limit");
        setCv(null);
      } else {
        setCv(file);
      }
    }
  };

  const applyJob = async () => {
    if (!cv || !phone || !position || !jobId) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("phone", phone);
      formData.append("position", position);
      formData.append("description", description);
      formData.append("location", address);
      formData.append("job_id", jobId);

      if (cv) formData.append("cv_file", cv);

      const response = await api.post("/api/apply-for-job", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setLoading(false);
      if (response.data.code == "200") {
        setPhone("");
        setPosition("");
        setDescription("");
        setAddress("");
        setCompany("");
        setCv(null);
        setError("");
        toast.success(response.data.message);
        router.push("/pages/jobs");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
      toast.error(error.message);
    }
  };


  const resetForm = () => {
    setPhone("");
    setPosition("");
    setCompany("");
    setCv(null);
    setAddress("");
    setDescription("");
    setError("");
  };


  function fetchJobCategories() {

    api.get("/api/get-job_categories")
      .then((res) => {
        if (res.data.code == "200") {
          setJobCategory(res.data.data);
        }
        else {
          toast.error("Error fetching event details");
        }

      })
      .catch((error) => {
        if (error)
          console.log(error)
        toast.error("Error fetching event details");
      })

  }

    useEffect(() => {
      fetchJobCategories();
    }, []);


  return (
    <div>

      <div>
        <div className="container-fluid">
          <div
            className="d-flex justify-content-center align-items-center mb-5 position-relative"
            style={{
              backgroundImage: 'url(/assets/images/0.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '30vh',
              marginTop: '80px',
            }}
          >
            <div className="text-center position-absolute top-50 start-50 translate-middle z-index-1">
              <h2 className="fw-bold text-white">Jobs</h2>
              <p className="text-light">Discover new jobs around you.</p>
              <div className="d-flex justify-content-center align-items-center">
                <div className="input-group" style={{ minWidth: '400px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for jobs"
                    aria-label="Search for jobs"
                  />
                  <button className="btn btn-primary form-buton" type="button">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <div className="card mb-3 shadow-lg border-0">
                  <div className="card-body">
                    <div className="list-group list-group-flush">
                      {
                        jobCategory.length > 0 ?

                          (
                            jobCategory.map((category) => (
                              <Link
                                key={category.id}
                                className="list-group-item text-decoration-none border-0 bold-text d-flex align-items-center text-wrap"
                                href="#"
                              >
                                <i className="bi bi-briefcase"></i>
                                <span className="mx-3">{category.name}</span>
                              </Link>
                            ))
                          )
                          :
                          <>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33].map((item) => (
                              <div
                                key={item}
                                className="list-group-item placeholder-glow d-flex align-items-center"
                              >
                                {/* <div className="placeholder col-1 me-3"></div> */}
                                <div className="placeholder col-8"></div>
                              </div>
                            ))}
                          </>

                      }
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-9">
                <div className="card shadow-lg border-0 p-1">
                  <div className="card-body">
                    <h4 className="fw-semibold">Apply Job</h4>
                    <hr className="text-muted" />

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div>
                      <div className="mt-4 d-flex gap-3">
                        <div className="w-50">
                          <label className="form-label mx-1">Phone no</label>
                          <input
                            placeholder="Phone no"
                            type="text"
                            className="form-control"
                            value={phone}
                            onChange={handlePhone}
                          />
                        </div>
                        <div className="w-50">
                          <label className="form-label mx-1">Position</label>
                          <input
                            placeholder="Position"
                            type="text"
                            className="form-control"
                            value={position}
                            onChange={handlePosition}
                          />
                        </div>
                      </div>

                      <div className="mt-4 d-flex gap-3">
                        <div className="w-50">
                          <label className="form-label mx-1">Company Name</label>
                          <input
                            className="form-control"
                            placeholder="Company Name"
                            type="text"
                            value={company}
                            onChange={handleCompany}
                          />
                        </div>
                        <div className="w-50">
                          <label className="form-label mx-1">CV File</label>
                          <input
                            className="form-control"
                            type="file"
                            onChange={handleFile}
                          />
                        </div>
                      </div>

                      <div className="mt-4 d-flex gap-3">
                        <div className="w-50">
                          <label className="form-label mx-1">Address</label>
                          <input
                            className="form-control"
                            placeholder="Address"
                            type="text"
                            value={address}
                            onChange={handleAddress}
                          />
                        </div>
                        <div className="w-50">
                          <label className="form-label mx-1">Description</label>
                          <input
                            className="form-control"
                            placeholder="Description"
                            type="text"
                            value={description}
                            onChange={handleDescriptionChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 d-flex gap-3 mx-2">
                      <button
                        className="btn btn-success border-0 rounded-1"
                        onClick={() => applyJob("jobId")}
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : "Submit"}
                      </button>
                      <button className="btn btn-danger border-0 rounded-1" onClick={resetForm}>
                        Cancel
                      </button>
                    </div>
                    <hr className="text-muted" />
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
