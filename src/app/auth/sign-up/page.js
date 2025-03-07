"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/app/lib/auth/axios";
import { toast } from "react-toastify";
import Image from "next/image";
import { useSiteSettings } from '@/context/SiteSettingsContext';

export default function SignUp() {
  const [password, setPassword] = useState("");
  const [password_confirm, setPassword_Confirm] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [username, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const settings = useSiteSettings();

  const router = useRouter();

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfirmRef = useRef(null);
  const dobRef = useRef(null);
  const genderRef = useRef(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };


  const handleArrowKeyPress = (e, currentRef, nextRef, prevRef) => {
    if (e.key === "ArrowDown") {
      if (nextRef?.current) {
        nextRef.current.focus();
      }
    } else if (e.key === "ArrowUp") {
      if (prevRef?.current) {
        prevRef.current.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !password_confirm || !first_name || !last_name || !dob) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== password_confirm) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    const formData = new FormData();
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirm", password_confirm);
    formData.append("date_of_birth", dob);
    formData.append("gender", gender);

    try {
      setIsLoading(true);
      const response = await api.post("/api/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success(response.data.message)
        setSuccess(response.data.message);
        setFirstName("");
        setLastName("");
        setPassword("");
        setPassword_Confirm("");
        setEmail("");
        setDob("");
        setError("");
        setUserName("");

        setTimeout(() => {
          router.push("/auth/sign-in");
        }, 4000);
      } else {
        setError(response.data.message || "An error occurred during registration.");
        toast.error(response.data.message || "An error occurred during registration.");
      }
    } catch (err) {
      setSuccess("");
      const errorMessage = err.response?.data?.messages?.error || "An error occurred. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage)
    }
    finally {
      setIsLoading(false);
    }
  };

  if (!settings) return null;

  return (
    <div className="min-vh-100 d-flex">

      <div className="d-none d-lg-block col-lg-6 bg-gradient-left">
        <div className="h-100 d-flex flex-column justify-content-center align-items-center text-white">
          <h2>{settings.login_page_title}</h2>
          <p className="text-center mx-5 my-3">
            {settings.login_page_text}
          </p>
        </div>
      </div>


      <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4">
        <div className="card border rounded-3 w-75 p-4">
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold text-primary">Sign Up</h1>
            <p className="text-muted">
              Already have an account?
              <Link href="/auth/sign-in" className="text-decoration-none text-primary mx-2">
                Sign in here
              </Link>
            </p>
          </div>

          {error && <div className="alert alert-danger mt-2 text-center">{error}</div>}
          {success && <div className="alert alert-success mt-2 text-center">{success}</div>}

          {settings["chck-user_registration"] === "1" ? (

            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  placeholder="First Name"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  ref={firstNameRef}
                  onKeyDown={(e) => handleArrowKeyPress(e, firstNameRef, lastNameRef, null)}
                />
                <label htmlFor="firstName">First Name</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  placeholder="Last Name"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  ref={lastNameRef}
                  onKeyDown={(e) => handleArrowKeyPress(e, lastNameRef, usernameRef, firstNameRef)}
                />
                <label htmlFor="lastName">Last Name</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  ref={usernameRef}
                  onKeyDown={(e) => handleArrowKeyPress(e, usernameRef, emailRef, lastNameRef)}
                />
                <label htmlFor="username">Username</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  ref={emailRef}
                  onKeyDown={(e) => handleArrowKeyPress(e, emailRef, passwordRef, usernameRef)}
                />
                <label htmlFor="email">Email Address</label>
              </div>

              <p className="text-muted">We will never share your email with anyone else.</p>

              <div className="form-floating mb-3 position-relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  ref={passwordRef}
                  onKeyDown={(e) => handleArrowKeyPress(e, passwordRef, passwordConfirmRef, emailRef)}
                />
                <label htmlFor="password">Password</label>
                <button
                  type="button"
                  className="btn position-absolute top-50 end-0 translate-middle-y"
                  onClick={togglePasswordVisibility}
                >
                  <i className={`fa ${passwordVisible ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>

              <div className="form-floating mb-3 position-relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="form-control"
                  id="passwordConfirm"
                  placeholder="Confirm Password"
                  value={password_confirm}
                  onChange={(e) => setPassword_Confirm(e.target.value)}
                  ref={passwordConfirmRef}
                  onKeyDown={(e) => handleArrowKeyPress(e, passwordConfirmRef, dobRef, passwordRef)}
                />
                <label htmlFor="passwordConfirm">Confirm Password</label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="date"
                  className="form-control"
                  id="dob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  ref={dobRef}
                  onKeyDown={(e) => handleArrowKeyPress(e, dobRef, genderRef, passwordConfirmRef)}
                />
                <label htmlFor="dob">Date of Birth</label>
              </div>

              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  ref={genderRef}
                  onKeyDown={(e) => handleArrowKeyPress(e, genderRef, null, dobRef)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <label htmlFor="gender">Gender</label>
              </div>

              <div className="form-check mb-3">
                <input type="checkbox" className="form-check-input" id="keepSignedIn" />
                <label className="form-check-label" htmlFor="keepSignedIn">
                  Keep me signed in
                </label>
              </div>

              <div className="d-grid mb-3">
                <button type="submit" className="btn btn-primary btn-lg rounded-2" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    </>
                  ) : (
                    "Sign up"
                  )}
                </button>
              </div>

              <div className="text-center mt-4">
                <Link href="/aboutapp/terms" className="text-decoration-none me-3 text-muted">
                  Terms
                </Link>
                <Link href="/aboutapp/about" className="text-decoration-none me-3 text-muted">
                  About
                </Link>
                <Link href="/aboutapp/privacy" className="text-decoration-none me-3 text-muted">
                  Privacy
                </Link>
                <Link href="/aboutapp/data" className="text-decoration-none text-muted">
                  Data Deletion
                </Link>
              </div>

              <p className="text-center text-muted mt-4">
                ©2023{" "}
                <Link href="https://www.socioon.com/" target="_blank" className="text-decoration-none text-primary">
                  Socioon
                </Link>
                . All rights reserved.
              </p>

            </form>

          ) : (

            <>
             
              <div className="d-flex justify-content-center">
                <Image
                  src="/assets/images/signupClose.svg"
                  width={200}
                  height={300}
                  alt="Registration Close"
                />
              </div>
              <p className="text-center text-danger">We are sorry. We are not accepting any new registrations at the moment.</p>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
