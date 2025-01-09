"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/app/lib/auth/axios";
import createAPI from "@/app/lib/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (isClient && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      setError("Geolocation is not supported by this browser.");
    }

    function showPosition(position) {
      setLat(position.coords.latitude);
      setLon(position.coords.longitude);
    }

    function showError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError("User denied the request for Geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          setError("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          setError("The request to get user location timed out.");
          break;
        default:
          setError("An unknown error occurred.");
          break;
      }
    }

    try {
      const response = await api.post("/api/login", { email, password, lat, lon });

      if (response.status === 200 && response.data.token) {
        // Save token and user info to localStorage only on client-side
        if (isClient) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userid", response.data.user_id);

          const userProfile = await createAPI().get(
            "/api/get-user-profile?user_id=" + response.data.user_id
          );

          if (userProfile.data.code === "200") {
            localStorage.setItem("userdata", JSON.stringify(userProfile.data));
          }

          const siteSetting = await createAPI().get("/api/get_site_settings");

          if (siteSetting.data.status === "200") {
            localStorage.setItem("siteSetting", JSON.stringify(siteSetting.data));
          }

          router.push("/pages/newsfeed");
        }
      } else {
        const errorMessage = response?.data?.messages?.error || "An unknown error occurred";
        setError(errorMessage);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.messages?.error || "An error occurred. Please try again.";
      setError(errorMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  // if (!isClient) {
  //   return <div>Loading...</div>;
  // }


  return (
    <div className="min-vh-100 d-flex">
      <div className="d-none d-lg-block col-lg-6 bg-gradient-left">
        <div className="h-100 d-flex flex-column justify-content-center align-items-center text-white">
          <h2>Welcome to linkOn</h2>
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
          <h2 className="text-center mb-3 fw-bold text-primary">Sign In</h2>
          <p className="text-center text-muted">
            Do not have an account?
            <Link href="/auth/sign-up" className="text-primary text-decoration-none mx-2">
              Click here to sign up
            </Link>
          </p>

          {error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="emailInput"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="emailInput">Email address</label>
            </div>

            <div className="form-floating mb-3 position-relative">
              <input
                type={passwordVisible ? "text" : "password"}
                className="form-control"
                id="passwordInput"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="passwordInput">Password</label>
              <button
                type="button"
                className="btn position-absolute top-50 end-0 translate-middle-y"
                onClick={togglePasswordVisibility}
                style={{ zIndex: 2 }}
              >
                <i
                  className={`fa ${passwordVisible ? "fa-eye-slash" : "fa-eye"
                    }`}
                ></i>
              </button>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="rememberCheck"
                />
                <label className="form-check-label" htmlFor="rememberCheck">
                  Remember me
                </label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-decoration-none text-primary"
              >
                Forgot password?
              </Link>
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary btn-lg rounded-0"
              >
                Login
              </button>
            </div>

            <div className="text-center mt-4">
              <Link
                href="/LINKS"
                className="text-decoration-none me-3 text-muted"
              >
                Terms
              </Link>
              <Link
                href="/LINKS"
                className="text-decoration-none me-3 text-muted"
              >
                About
              </Link>
              <Link
                href="/LINKS"
                className="text-decoration-none me-3 text-muted"
              >
                Privacy
              </Link>
              <Link href="/LINKS" className="text-decoration-none text-muted">
                Data Deletion
              </Link>
            </div>

            <p className="text-center text-muted mt-4">
              ©2023{" "}
              <Link
                href="https://www.socioon.com/"
                target="_blank"
                className="text-decoration-none text-primary"
              >
                Socioon
              </Link>
              . All rights reserved.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
