"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
   

export default function SettingNavbar() {
      
    const pathname = usePathname();

    return (
        <div>
            <div className="card mb-3 shadow-lg border-1">
                <div className="card-body">
                    <div className="list-group list-group-flush">
                        <Link
                            href="/pages/settings/general-settings"
                            className={`list-group-item text-decoration-none border-0 text-secondary ${pathname === '/pages/settings/general-settings' ? 'bg-primary text-white' : ''}`}
                        >
                            <i className="bi bi-gear-fill"></i>
                            <span className="px-2"> General Settings </span>
                        </Link>
                        <Link
                            href="/pages/settings/social-links"
                            className={`list-group-item text-decoration-none border-0 text-secondary ${pathname === '/pages/settings/social-links' ? 'bg-primary text-white' : ''}`}
                        >
                            <i className="bi bi-share-fill "></i>
                            <span className="px-2"> Social Links </span>
                        </Link>
                        <Link
                            href="/pages/settings/notification-settings"
                            className={`list-group-item text-decoration-none border-0 text-secondary ${pathname === '/pages/settings/notification-settings' ? 'bg-primary text-white' : ''}`}
                        >
                            <i className="bi bi-bell-fill "></i>
                            <span className="px-2"> Notification Settings </span>
                        </Link>
                        <Link
                            href="/pages/settings/privacy-settings"
                            className={`list-group-item text-decoration-none border-0 text-secondary ${pathname === '/pages/settings/privacy-settings' ? 'bg-primary text-white' : ''}`}
                        >
                            <i className="bi bi-shield-lock-fill"></i>
                            <span className="px-2"> Privacy Settings </span>
                        </Link>
                        <Link
                            href="/pages/settings/blocked-users"
                            className={`list-group-item text-decoration-none border-0 text-secondary ${pathname === '/pages/settings/blocked-users' ? 'bg-primary text-white' : ''}`}
                        >
                            <i className="bi bi-person-fill-slash"></i>
                            <span className="px-2"> Blocked Users </span>
                        </Link>
                        <Link
                            href="/pages/settings/change-language"
                            className={`list-group-item text-decoration-none border-0 text-secondary ${pathname === '/pages/settings/change-language' ? 'bg-primary text-white' : ''}`}
                        >
                            <i className="bi bi-translate"></i>
                            <span className="px-2"> Change Language </span>
                        </Link>
                        <Link
                            href="/pages/settings/manage-sessions"
                            className={`list-group-item text-decoration-none border-0 text-secondary ${pathname === '/pages/settings/manage-sessions' ? 'bg-primary text-white' : ''}`}
                        >
                            <i className="bi bi-shield-fill-check"></i>
                            <span className="px-2"> Manage Sessions </span>
                        </Link>
                        <Link
                            href="/pages/settings/password"
                            className={`list-group-item text-decoration-none border-0 text-secondary ${pathname === '/pages/settings/password' ? 'bg-primary text-white' : ''}`}
                        >
                            <i className="bi bi-shield-lock-fill"></i>
                            <span className="px-2"> Password </span>
                        </Link>
                        <Link
                            href="/pages/settings/delete-account"
                            className={`list-group-item text-decoration-none border-0 text-secondary ${pathname === '/pages/settings/delete-account' ? 'bg-primary text-white' : ''}`}
                        >
                            <i className="bi bi-trash3"></i>
                            <span className="px-2"> Delete Account </span>
                        </Link>
                    </div>
                </div>
                <hr className="m-0" />
                <Link href="#" className="text-decoration-none text-dark d-flex justify-content-center my-3">
                    View Profile
                </Link>
            </div>

            <div className="d-flex justify-content-center mb-5">
                <Link href="#" className="text-decoration-none text-secondary">
                    ©2025 linkon
                </Link>
            </div>
        </div>
    );
}
