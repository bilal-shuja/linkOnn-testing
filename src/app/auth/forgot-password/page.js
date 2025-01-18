"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/auth/axios";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [isClient, setIsClient] = useState(false); // State to track client-side rendering
  const router = useRouter();

  // This effect ensures the code runs only on the client-side
  useEffect(() => {
    setIsClient(true); // Set to true once the component has mounted
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please Enter Email")
      setError("Please Enter Email");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);

      const response = await api.post("/api/reset-password", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === 200) {
        toast.success(response.data.message)
        setSuccess(response.data.message);

        if (isClient) {
          localStorage.setItem("email", email);
        }

        router.push("/auth/confirm-forgot");
      } else {
        toast.error(response.data.message)
        setError(response.data.message);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage)
    }
  };

  return (
    <div className="min-vh-100 d-flex">
      <div className="d-none d-lg-block col-lg-6 bg-gradient-left">
        <div className="h-100 d-flex flex-column justify-content-center align-items-center text-white">
          <h2>Reset your Password</h2>
          <p className="text-center mx-5 my-3">
            LinkOn is a versatile social network template designed to bring people together. Utilize this template for a variety of social activities, including job networking, dating, posting, blogging, and much more. Join now to connect and make amazing friends from all corners of the world!
          </p>
        </div>
      </div>

      <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center">
        <div className="card2 border rounded-3 w-75 p-4">
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold text-primary">Forgot Password?</h1>
            <p className="text-muted">
              Enter the email address associated with your account.
            </p>
          </div>

          {error && <div className="alert alert-danger mt-2 text-center">{error}</div>}
          {success && <div className="alert alert-success mt-2">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">Email Address</label>
            </div>

            <div className="text-center mb-3">
              <p className="text-muted">
                Back to{" "}
                <Link href="/auth/sign-in" className="text-decoration-none text-primary">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="d-grid mb-3">
              <button type="submit" className="btn btn-lg btn-primary rounded-2">
                Reset Password
              </button>
            </div>

            <div className="text-center mt-3">
              <p className="mb-0 text-muted">
                ©2023{" "}
                <Link
                  target="_blank"
                  className="text-decoration-none"
                  href="https://www.socioon.com/"
                >
                  Socioon
                </Link>
                . All rights reserved.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
