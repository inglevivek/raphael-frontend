/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com', // This is the missing link
      },
      {
        protocol: 'https',
        hostname: 's.gravatar.com',
      },
    ],
  },
};

module.exports = nextConfig;