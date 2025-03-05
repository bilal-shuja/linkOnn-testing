"use client";

import Link from "next/link";
import Image from "next/image";
import Cookies from 'js-cookie';
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function Leftnav() {
  const settings = useSiteSettings();

  const handleLogout = () => {
    Cookies.remove('token', { path: '/' });
    localStorage.removeItem("userdata");
    localStorage.removeItem("siteSetting");
    localStorage.removeItem("userid");
  };


  if (!settings) {
    return (
      <div className="position-sticky top-0">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <div className="collapse navbar-collapse show" id="navbarNav">
              <div className="card mb-3 shadow-lg border-0 w-100">
                <div className="card-body">
                  <div className="list-group list-group-flush">
                    {Array(15).fill(0).map((_, index) => (
                      <div
                        key={index}
                        className="list-group-item d-flex align-items-center"
                      >
                        <div className="bg-secondary bg-opacity-25 rounded" style={{ width: "22px", height: "22px" }}></div>
                        <div className="ms-3 bg-secondary bg-opacity-25 rounded" style={{ width: "120px", height: "16px" }}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="position-sticky top-0">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="card mb-3 shadow-lg border-0 w-100">
              <div className="card-body">
                <div className="list-group list-group-flush">
                  {/* News Feed */}
                  <Link
                    className="list-group-item list-group-item-action text-decoration-none"
                    href="/pages/newsfeed"
                  >
                    <Image
                      src="/assets/images/newicons/home.svg"
                      alt="icon"
                      width={22}
                      height={22}
                    />
                    <span className="ms-3">News Feed</span>
                  </Link>

                  {/* Pages */}
                  {settings["chck-pages"] === "1" && (
                    <Link
                      className="list-group-item list-group-item-action text-decoration-none"
                      href="/pages/page"
                    >
                      <Image
                        src="/assets/images/newicons/page.svg"
                        alt="icon"
                        width={22}
                        height={22}
                      />
                      <span className="ms-3">Pages</span>
                    </Link>
                  )}

                  {/* Groups */}
                  {settings["chck-groups"] === "1" && (
                    <Link
                      className="list-group-item list-group-item-action text-decoration-none"
                      href="/pages/groups"
                    >
                      <Image
                        src="/assets/images/newicons/group.svg"
                        alt="icon"
                        width={22}
                        height={22}
                      />
                      <span className="ms-3">Groups</span>
                    </Link>
                  )}

                  {/* Movies */}
                  {settings["chck-movies"] === "1" && (
                    <Link
                      className="list-group-item list-group-item-action text-decoration-none"
                      href="/pages/Movies"
                    >
                      <Image
                        src="/assets/images/newicons/movie.svg"
                        alt="icon"
                        width={22}
                        height={22}
                      />
                      <span className="ms-3">Movies</span>
                    </Link>
                  )}

                  {/* Events */}
                  {settings["chck-events"] === "1" && (
                    <Link
                      className="list-group-item list-group-item-action text-decoration-none"
                      href="/pages/Events"
                    >
                      <Image
                        src="/assets/images/newicons/events.svg"
                        alt="icon"
                        width={22}
                        height={22}
                      />
                      <span className="ms-3">Events</span>
                    </Link>
                  )}

                  {/* Jobs */}
                  {settings["chck-job_system"] === "1" && (
                    <Link
                      className="list-group-item list-group-item-action text-decoration-none"
                      href="/pages/jobs"
                    >
                      <Image
                        src="/assets/images/newicons/jobs.svg"
                        alt="icon"
                        width={22}
                        height={22}
                      />
                      <span className="ms-3">Jobs</span>
                    </Link>
                  )}

                  {/* Videos */}
                  <Link
                    className="list-group-item list-group-item-action text-decoration-none"
                    href="/pages/Videos"
                  >
                    <Image
                      src="/assets/images/newicons/video_play.svg"
                      alt="icon"
                      width={22}
                      height={22}
                    />
                    <span className="ms-3">Videos</span>
                  </Link>

                  {/* Games */}
                  {settings["chck-games"] === "1" && (
                    <Link
                      className="list-group-item list-group-item-action text-decoration-none"
                      href="/pages/Games"
                    >
                      <Image
                        src="/assets/images/newicons/game.svg"
                        alt="icon"
                        width={22}
                        height={22}
                      />
                      <span className="ms-3">Games</span>
                    </Link>
                  )}

                  {/* Wallet */}
                  {settings["chck-wallet"] === "1" && (
                    <Link
                      className="list-group-item list-group-item-action text-decoration-none"
                      href="/pages/Wallet"
                    >
                      <Image
                        src="/assets/images/newicons/wallet.svg"
                        alt="icon"
                        width={22}
                        height={22}
                      />
                      <span className="ms-3">Wallet</span>
                    </Link>
                  )}

                  {/* Friends */}
                  {settings["is_friend_system"] === "1" && (
                    <Link
                      className="list-group-item list-group-item-action text-decoration-none"
                      href="/pages/Friends"
                    >
                      <Image
                        src="/assets/images/newicons/friend.svg"
                        alt="icon"
                        width={22}
                        height={22}
                      />
                      <span className="ms-3">Friends</span>
                    </Link>
                  )}

                  {/* Packages */}
                  {settings["chck-point_level_system"] === "1" && (
                    <Link
                      className="list-group-item list-group-item-action text-decoration-none"
                      href="/pages/Packages"
                    >
                      <Image
                        src="/assets/images/newicons/offer.svg"
                        alt="icon"
                        width={22}
                        height={22}
                      />
                      <span className="ms-3">Packages</span>
                    </Link>
                  )}

                  {/* Blogs */}
                  {settings["chck-blogs"] === "1" && (
                    <Link
                      className="list-group-item list-group-item-action text-decoration-none"
                      href="/pages/Blogs"
                    >
                      <Image
                        src="/assets/images/newicons/blog.svg"
                        alt="icon"
                        width={22}
                        height={22}
                      />
                      <span className="ms-3">Blogs/Articles</span>
                    </Link>
                  )}

                  {/* Poke */}
                  <Link
                    className="list-group-item list-group-item-action text-decoration-none"
                    href="/pages/Poke"
                  >
                    <Image
                      src="/assets/images/newicons/poke.svg"
                      alt="icon"
                      width={22}
                      height={22}
                    />
                    <span className="ms-3">Poke</span>
                  </Link>

                  {/* Marketplace */}
                  {settings["chck-product"] === "1" && (
                    <Link
                      className="list-group-item list-group-item-action text-decoration-none"
                      href="/pages/Marketplace"
                    >
                      <Image
                        src="/assets/images/newicons/market.svg"
                        alt="icon"
                        width={22}
                        height={22}
                      />
                      <span className="ms-3">Marketplace</span>
                    </Link>
                  )}

                  {/* Blood */}
                  {settings["chck-blood"] === "1" && (
                    <Link
                      className="list-group-item list-group-item-action text-decoration-none"
                      href="/pages/Blood"
                    >
                      <Image
                        src="/assets/images/newicons/directory.svg"
                        alt="icon"
                        width={22}
                        height={22}
                      />
                      <span className="ms-3">Blood</span>
                    </Link>
                  )}


                  {/* Post Ads */}
                  <Link
                    className="list-group-item list-group-item-action text-decoration-none"
                    href="/pages/postAdReq"
                  >
                    <Image
                      src="/assets/images/newicons/boost.svg"
                      alt="icon"
                      width={22}
                      height={22}
                    />
                    <span className="ms-3">Post Ads</span>
                  </Link>

                  {/* Saved Posts */}
                  <Link
                    className="list-group-item list-group-item-action text-decoration-none"
                    href="/pages/savedposts"
                  >
                    <Image
                      src="/assets/images/newicons/saved.svg"
                      alt="icon"
                      width={22}
                      height={22}
                    />
                    <span className="ms-3">Saved Posts</span>
                  </Link>

                  {/* Explore */}
                  <Link
                    className="list-group-item list-group-item-action text-decoration-none"
                    href="/pages/Explore"
                  >
                    <Image
                      src="/assets/images/newicons/more.svg"
                      alt="icon"
                      width={22}
                      height={22}
                    />
                    <span className="ms-3">Explore</span>
                  </Link>

                  {/* Logout */}
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
                    <div className="text-center mt-2">
                      <Link href="#" className="text-decoration-none text-secondary">
                        ©2025 linkon
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