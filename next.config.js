/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_API_BASE_URL.replace("https://", ""), // Extract hostname dynamically
        pathname: "/uploads/photos/**", // Allow images from this path
      },
    ],
    domains: [process.env.NEXT_PUBLIC_API_BASE_URL.replace("https://", "")], // Extract domain dynamically
    minimumCacheTTL: 60, // Optional: Reduce caching issues
  },
  reactStrictMode: true, // Ensure best practices
};

module.exports = nextConfig;
