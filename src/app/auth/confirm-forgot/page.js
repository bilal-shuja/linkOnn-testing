"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/auth/axios";
import { toast } from "react-toastify";

export default function ConfirmForgot() {
  const [email, setEmail] = useState("");
  const [reset_code, setResetCode] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef(null);
  const resetCodeRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("email");
      if (savedEmail) {
        setEmail(savedEmail);
      }
    }
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      if (document.activeElement === emailRef.current) {
        resetCodeRef.current.focus();
      } else if (document.activeElement === resetCodeRef.current) {
        passwordRef.current.focus();
      } else if (document.activeElement === passwordRef.current) {
        confirmPasswordRef.current.focus();
      }
    } else if (event.key === "ArrowUp") {
      if (document.activeElement === confirmPasswordRef.current) {
        passwordRef.current.focus();
      } else if (document.activeElement === passwordRef.current) {
        resetCodeRef.current.focus();
      } else if (document.activeElement === resetCodeRef.current) {
        emailRef.current.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirm_password || !reset_code) {
      toast.error("Please fill in all fields.")
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirm_password) {
      toast.error("Password and Confirm Password do not match.")
      setError("Password and Confirm Password do not match.");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("email", email);
      formData.append("reset_code", reset_code);
      formData.append("password", password);
      formData.append("confirm_password", confirm_password);

      const response = await api.post("/api/reset-password-confirm", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.code === "200") {
        toast.success(response.data.message)
        setSuccess(response.data.message);
        setResetCode("");
        setPassword("");
        setConfirmPassword("");
        setError("");
        router.push("/auth/sign-in");
      } else {
        toast.error(response.data.message)
        setError(response.data.message);
        setSuccess("");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred. Please try again.";
      setError(errorMessage);
      setSuccess("");
      toast.error(errorMessage)
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex">
      <div className="d-none d-lg-block col-lg-6 bg-gradient-left">
        <div className="h-100 d-flex flex-column justify-content-center align-items-center text-white">
          <h2>Reset your Password</h2>
          <p className="text-center mx-5 my-3">
            LinkOn is a versatile social network template designed to bring
            people together. Utilize this template for a variety of social
            activities, including job networking, dating, posting, blogging, and
            much more. Join now to connect and make amazing friends from all
            corners of the world!
          </p>
        </div>
      </div>

      <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center">
        <div className="card2 border rounded-3 w-75 p-4">
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold text-primary">Reset Your Password</h1>
            <p className="text-muted">
              Please enter all fields to reset your password.
            </p>
          </div>

          {error && <div className="text-center alert alert-danger">{error}</div>}
          {success && <div className="text-center alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                value={email}
                readOnly
                ref={emailRef}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="form-floating position-relative mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Reset Code"
                value={reset_code}
                onChange={(e) => setResetCode(e.target.value)}
                ref={resetCodeRef}
                onKeyDown={handleKeyDown}
              />
              <label htmlFor="reset_code">Reset Code</label>
            </div>

            <div className="form-floating mb-3 position-relative">
              <input
                type={passwordVisible ? "text" : "password"}
                className="form-control"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ref={passwordRef}
                onKeyDown={handleKeyDown}
              />
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className="btn position-absolute top-50 end-0 translate-middle-y"
                onClick={togglePasswordVisibility}
              >
                <i
                  className={`fa ${passwordVisible ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            <div className="form-floating mb-3 position-relative">
              <input
                type={passwordVisible ? "text" : "password"}
                className="form-control"
                id="passwordConfirm"
                placeholder="Confirm Password"
                value={confirm_password}
                onChange={(e) => setConfirmPassword(e.target.value)}
                ref={confirmPasswordRef}
                onKeyDown={handleKeyDown}
              />
              <label htmlFor="passwordConfirm">Confirm Password</label>
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-lg btn-primary rounded-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>

            <div className="text-center mt-3">
              <p className="text-muted">
                Back to{" "}
                <Link
                  href="/auth/sign-in"
                  className="text-decoration-none text-primary"
                >
                  Sign in
                </Link>
              </p>
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
