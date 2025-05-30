/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['app', 'src']
  }
};

export default nextConfig; 