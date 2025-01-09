"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useAuth from "@/app/lib/useAuth";

export default function Rightnav() {
  useAuth();
  const [userdata, setUserdata] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state

  const router = useRouter();

  // Logout function to clear localStorage and redirect to sign-in
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userdata");
    localStorage.removeItem("siteSetting");
    localStorage.removeItem("userid");
    router.push("/auth/sign-in");
  };

  // Fetch user data from localStorage
  useEffect(() => {
    const data = localStorage.getItem("userdata");
    if (data) {
      setUserdata(JSON.parse(data));
      setLoading(false); // Set loading to false when data is available
    } else {
      setError("No user data found."); // Set error if no data is found
      setLoading(false); // Ensure loading is false even if no user data is found
    }
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="loading-state">
        <p>Loading user data...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="position-sticky top-0">
      <div className="card mb-3 shadow-lg border-0">
        <div className="card-body">
          <div className="list-group list-group-flush">
            <Link
              className="list-group-item text-decoration-none border-0 bold-text"
              href="/pages/newsfeed"
            >
              <Image
                src="/assets/images/newicons/home.svg"
                alt="icon"
                width={22}
                height={22}
              />
              <span className="mx-3">News Feed</span>
            </Link>
            <Link
              className="list-group-item text-decoration-none border-0 bold-text"
              href="/pages/page"
            >
              <Image
                src="/assets/images/newicons/page.svg"
                alt="icon"
                width={22}
                height={22} />
              <span className="mx-3">Pages</span>
            </Link>
            <Link
              className="list-group-item text-decoration-none border-0 bold-text"
              href="/pages/groups"
            >
              <Image
                src="/assets/images/newicons/group.svg"
                alt="icon"
                width={22}
                height={22}
              />
              <span className="mx-2"> Groups</span>
            </Link>
            <Link
              className="list-group-item text-decoration-none border-0 bold-text"
              href="/pages/Movies"
            >
              <Image
                src="/assets/images/newicons/movie.svg"
                alt="icon"
                width={22}
                height={22}
              />
              <span className="mx-2"> Movies</span>
            </Link>
            <Link
              className="list-group-item text-decoration-none border-0 bold-text"
              href="/pages/Events"
            >
              <Image
                src="/assets/images/newicons/events.svg"
                alt="icon"
                width={22}
                height={22}
              />
              <span className="mx-2"> Events</span>
            </Link>
            <Link
              className="list-group-item text-decoration-none border-0 bold-text"
              href="/pages/jobs"
            >
              <Image
                src="/assets/images/newicons/jobs.svg"
                alt="icon"
                width={22}
                height={22}
              />
              <span className="mx-2"> Jobs</span>
            </Link>
            <Link
              className="list-group-item text-decoration-none border-0 bold-text"
              href="/pages/Videos"
            >
              <Image
                src="/assets/images/newicons/video_play.svg"
                alt="icon"
                width={22}
                height={22}
              />
              <span className="mx-2">Videos</span>
            </Link>
            <Link
              className="list-group-item text-decoration-none border-0 bold-text"
              href="/pages/Games"
            >
              <Image
                src="/assets/images/newicons/game.svg"
                alt="icon"
                width={22}
                height={22}
              />
              <span className="mx-2">Games</span>
            </Link>
            <Link
              className="list-group-item text-decoration-none border-0 bold-text"
              href="/pages/Wallet"
            >
              <Image
                src="/assets/images/newicons/wallet.svg"
                alt="icon"
                width={22}
                height={22}
              />
              <span className="mx-2">Wallet</span>
            </Link>
            <Link
              className="list-group-item text-decoration-none border-0 bold-text"
              href="/pages/Friends"
            >
              <Image
                src="/assets/images/newicons/friend.svg"
                alt="icon"
                width={22}
                height={22}
              />
              <span className="mx-2">Friends</span>
            </Link>
            <Link
              className="list-group-item text-decoration-none border-0 bold-text"
              href="/pages/Packages"
            >
              <Image
                src="/assets/images/newicons/offer.svg"
                alt="icon"
                width={22}
                height={22}
              />
              <span className="mx-2">Packages</span>
            </Link>
            <Link
              className="list-group-item text-decoration-none border-0 bold-text"
              href="/pages/Blogs"
            >
              <Image
                src="/assets/images/newicons/blog.svg"
                alt="icon"
                width={22}
                height={22}
              />
              <span className="mx-2">Blogs/Articles</span>
            </Link>
            <Link
              className="list-group-item text-decoration-none border-0 bold-text"
              href="/pages/Marketplace"
            >
              <Image
                src="/assets/images/newicons/market.svg"
                alt="icon"
                width={22}
                height={22}
              />
              <span className="mx-2">MarketPlace</span>
            </Link>
            <Link
              className="list-group-item text-decoration-none border-0 bold-text"
              href="/pages/Blood"
            >
              <Image
                src="/assets/images/newicons/directory.svg"
                alt="icon"
                width={22}
                height={22}
              />
              <span className="mx-2">Blood</span>
            </Link>
            <Link
              className="list-group-item text-decoration-none border-0 bold-text"
              href="#"
            >
              <Image
                src="/assets/images/newicons/boost.svg"
                alt="icon"
                width={22}
                height={22}
              />
              <span className="mx-2">Post Ads Requests</span>
            </Link>
            <Link
              className="list-group-item text-decoration-none border-0 bold-text "
              href="#"
            >
              <Image
                src="/assets/images/newicons/saved.svg"
                alt="icon"
                width={22}
                height={22}
              />
              <span className="mx-2">Saved Posts</span>
            </Link>
            <Link
              className="list-group-item text-decoration-none border-0 bold-text"
              href="#"
            >
              <Image
                src="/assets/images/newicons/more.svg"
                alt="icon"
                width={22}
                height={22}
              />
              <span className="mx-2">Explore</span>
            </Link>
            <Link
              className="list-group-item text-decoration-none border-0 bold-text p-3"
              href="/auth/sign-in"
              onClick={handleLogout}
            >
              <Image
                src="/assets/images/newicons/logout.svg"
                alt="icon"
                width={22}
                height={22}
              />
              <span className="mx-2">Log out</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-evenly">
        <Link href="#" className="text-decoration-none text-secondary">
          About Us
        </Link>
        <Link href="#" className="text-decoration-none text-secondary">
          Settings
        </Link>
        <Link href="#" className="text-decoration-none text-secondary">
          Support
        </Link>
      </div>

      <div className="d-flex align-items-center justify-content-evenly">
        <Link href="#" className="text-decoration-none text-secondary">
          Terms & Conditions
        </Link>
        <Link href="#" className="text-decoration-none text-secondary">
          Privacy Policy
        </Link>
      </div>

      <div className="d-flex justify-content-center mb-5">
        <Link href="#" className="text-decoration-none text-secondary">
          ©2024 linkon
        </Link>
      </div>
    </div>
  );
}
