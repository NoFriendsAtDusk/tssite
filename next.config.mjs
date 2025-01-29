/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/app',
  assetPrefix: '/app/',
  trailingSlash: true,
  logging: {
    level: 'info'
  }
};

export default nextConfig;
