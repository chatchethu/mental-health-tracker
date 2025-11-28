/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // disables PWA in dev
});

const nextConfig = {
  reactStrictMode: true,

  // ✅ Enable App Router (you’re using src/app/)
  experimental: {
    appDir: true,
  },

  images: {
    domains: ["localhost", "api.assemblyai.com"],
  },
};

module.exports = withPWA(nextConfig);
