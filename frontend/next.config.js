/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  env: {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: "GOOGLE_CLIENT _ID.apps.googleusercontent.com"
  }
};

module.exports = nextConfig;
