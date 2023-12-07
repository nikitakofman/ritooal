/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Add this line to disable React Strict Mode
  images: {
    domains: ["cloud.appwrite.io", "links.papareact.com"],
  },
};

module.exports = nextConfig;
