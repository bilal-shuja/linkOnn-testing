"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/app/lib/auth/axios";
import { toast } from "react-toastify";
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
      toast.error("Please fill in all fields.")
      return;
    }

    if (password !== password_confirm) {
      setError("Password and Confirm Password do not match.");
      toast.error("Password and Confirm Password do not match.")
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
  };

  if (!settings) return
  <div> </div>;

  return (
    <div className="min-vh-100 d-flex">
      {/* Left Side */}
      <div className="d-none d-lg-block col-lg-6 bg-gradient-left">
        <div className="h-100 d-flex flex-column justify-content-center align-items-center text-white">
          <h2>{settings.login_page_title}</h2>
          <p className="text-center mx-5 my-3">
          {settings.login_page_text}
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
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
                onKeyDown={(e) => handleArrowKeyPress(e, firstNameRef, lastNameRef, null)} // Arrow down to next, Arrow up to previous
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
                onKeyDown={(e) => handleArrowKeyPress(e, lastNameRef, usernameRef, firstNameRef)} // Arrow down to next, Arrow up to previous
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
                onKeyDown={(e) => handleArrowKeyPress(e, usernameRef, emailRef, lastNameRef)} // Arrow down to next, Arrow up to previous
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
                onKeyDown={(e) => handleArrowKeyPress(e, emailRef, passwordRef, usernameRef)} // Arrow down to next, Arrow up to previous
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
                onKeyDown={(e) => handleArrowKeyPress(e, passwordRef, passwordConfirmRef, emailRef)} // Arrow down to next, Arrow up to previous
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
                onKeyDown={(e) => handleArrowKeyPress(e, passwordConfirmRef, dobRef, passwordRef)} // Arrow down to next, Arrow up to previous
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
                onKeyDown={(e) => handleArrowKeyPress(e, dobRef, genderRef, passwordConfirmRef)} // Arrow down to next, Arrow up to previous
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
                onKeyDown={(e) => handleArrowKeyPress(e, genderRef, null, dobRef)} // Arrow down to next, Arrow up to previous
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
              <button type="submit" className="btn btn-primary btn-lg rounded-2">
                Sign me up
              </button>
            </div>

            <div className="text-center mt-3">
              <Link href="/LINKS" className="text-decoration-none me-3 text-muted">
                Terms
              </Link>
              <Link href="/LINKS" className="text-decoration-none me-3 text-muted">
                Privacy
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
