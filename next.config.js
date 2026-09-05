/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable SWC minify to reduce memory during build
  swcMinify: false,
  // Reduce workers to save memory
  experimental: {
    forceSwcTransforms: false,
  },
};

module.exports = nextConfig;
