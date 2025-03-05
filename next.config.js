/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_API_BASE_URL.replace("https://", ""),
        pathname: "/uploads/photos/**",
      },
    ],
    domains: [process.env.NEXT_PUBLIC_API_BASE_URL.replace("https://", "")],
    minimumCacheTTL: 60,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
