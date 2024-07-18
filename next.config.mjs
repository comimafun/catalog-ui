/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-3edbda22ada445d086b21416d66c81c1.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'cdn.innercatalog.com',
      },
    ],
  },
};

export default nextConfig;
