/** @type {import('next').NextConfig} */
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

module.exports = nextConfig;
