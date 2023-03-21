/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "doodleipsum.com",
      "illustrations.popsy.co",
      "cdn-icons-png.flaticon.com",
    ],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
