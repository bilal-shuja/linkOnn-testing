// module.exports = {
//   images: {
//     domains: ['demo.socioon.com'],
//   },
// }

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "demo.socioon.com",
        pathname: "/uploads/photos/post/**", // Allow images from this path
      },
    ],
    domains: ["demo.socioon.com"],
    minimumCacheTTL: 60, // Optional: Reduce caching issues
  },
  reactStrictMode: true, // Ensure best practices
};

module.exports = nextConfig;