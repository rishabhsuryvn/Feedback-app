/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "feedbackupload.s3.amazonaws.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
