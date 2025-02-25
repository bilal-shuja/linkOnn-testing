"use client";

import localFont from "next/font/local";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import("bootstrap/dist/js/bootstrap.bundle.min.js");

import { ToastContainer } from 'react-toastify';
import Navbar from "@/app/assets/components/navbar/page";
import { usePathname } from 'next/navigation';
import { SiteSettingsProvider } from '@/context/SiteSettingsContext';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const noNavbarPages = ['/auth/sign-in', '/auth/sign-up', '/auth/forgot-password', '/auth/confirm-forgot'];

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SiteSettingsProvider> {/* Wrap the entire app */}
          {!noNavbarPages.includes(pathname) && <Navbar />}
          {children}
          <ToastContainer />
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
