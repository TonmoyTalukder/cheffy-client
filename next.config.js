/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "www.bayarea.com", // Add the specific domain here
      },
    ],
  },
};

module.exports = nextConfig;
