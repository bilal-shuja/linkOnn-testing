"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useAuth from "@/app/lib/useAuth";
import { useState } from "react";

export default function Leftnav() {
  useAuth();
  const router = useRouter();
  const [isOffcanvasOpen, setOffcanvasOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userdata");
    localStorage.removeItem("siteSetting");
    localStorage.removeItem("userid");
    router.push("/auth/sign-in");
  };

  const toggleOffcanvas = () => {
    setOffcanvasOpen(!isOffcanvasOpen);
  };

  return (
    <div className="position-sticky top-0">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleOffcanvas}
            aria-controls="offcanvasLeft"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`offcanvas offcanvas-start ${isOffcanvasOpen ? "show" : ""}`}
            tabIndex="-1"
            id="offcanvasLeft"
            aria-labelledby="offcanvasLeftLabel"
            data-bs-backdrop="false"
            style={{ zIndex: 1050 }}
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasLeftLabel">
                Menu
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={toggleOffcanvas}
                aria-label="Close"
              ></button>
            </div>
            <div className="card mb-3 shadow-lg border-0">
              <div className="card-body">
                <div className="list-group list-group-flush">
                  {[
                    { href: "/pages/newsfeed", icon: "home.svg", label: "News Feed" },
                    { href: "/pages/page", icon: "page.svg", label: "Pages" },
                    { href: "/pages/groups", icon: "group.svg", label: "Groups" },
                    { href: "/pages/Movies", icon: "movie.svg", label: "Movies" },
                    { href: "/pages/Events", icon: "events.svg", label: "Events" },
                    { href: "/pages/jobs", icon: "jobs.svg", label: "Jobs" },
                    { href: "/pages/Videos", icon: "video_play.svg", label: "Videos" },
                    { href: "/pages/Games", icon: "game.svg", label: "Games" },
                    { href: "/pages/Wallet", icon: "wallet.svg", label: "Wallet" },
                    { href: "/pages/Friends", icon: "friend.svg", label: "Friends" },
                    { href: "/pages/Packages", icon: "offer.svg", label: "Packages" },
                    { href: "/pages/Blogs", icon: "blog.svg", label: "Blogs/Articles" },
                    { href: "/pages/Marketplace", icon: "market.svg", label: "Marketplace" },
                    { href: "/pages/Blood", icon: "directory.svg", label: "Blood" },
                    { href: "/pages/postAdReq", icon: "boost.svg", label: "Post Ads" },
                    { href: "/pages/savedposts", icon: "saved.svg", label: "Saved Posts" },
                    { href: "#", icon: "more.svg", label: "Explore" },
                  ].map((item, index) => (
                    <Link
                      key={index}
                      className="list-group-item list-group-item-action text-decoration-none"
                      href={item.href}
                    >
                      <Image
                        src={`/assets/images/newicons/${item.icon}`}
                        alt="icon"
                        width={22}
                        height={22}
                      />
                      <span className="ms-3">{item.label}</span>
                    </Link>
                  ))}
                  <Link
                    className="list-group-item list-group-item-action text-decoration-none"
                    href="/auth/sign-in"
                    onClick={handleLogout}
                  >
                    <Image
                      src="/assets/images/newicons/logout.svg"
                      alt="icon"
                      width={22}
                      height={22}
                    />
                    <span className="ms-3">Log out</span>
                  </Link>

                  <div className="mt-3">
                    <div className="d-flex justify-content-around">
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
                    <div className="d-flex justify-content-around mt-2">
                      <Link href="#" className="text-decoration-none text-secondary">
                        Terms & Conditions
                      </Link>
                      <Link href="#" className="text-decoration-none text-secondary">
                        Privacy Policy
                      </Link>
                    </div>
                    <div className="text-center mt-2">
                      <Link href="#" className="text-decoration-none text-secondary">
                        ©2024 linkon
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
