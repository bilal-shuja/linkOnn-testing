// src/app/layout.js
"use client"; // This is crucial for client-side execution of Stripe Elements
import localFont from "next/font/local";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Elements } from '@stripe/react-stripe-js'; // Import the Elements provider
import { loadStripe } from '@stripe/stripe-js'; 
import("bootstrap/dist/js/bootstrap.bundle.min.js"); 

// Load custom fonts
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

// Stripe key for loading Elements
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Wrap with Elements provider for Stripe */}
        <Elements stripe={stripePromise}>
          {children}
        </Elements>
      </body>
    </html>
  );
}
