/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Viewport-Width",
            value: "device-width",
          },
          {
            key: "X-UA-Compatible",
            value: "IE=edge",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
