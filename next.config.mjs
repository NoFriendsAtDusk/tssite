/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    level: 'info'
  },
  // Rewrite rules to handle both static site and app
  // Configure app directory
  experimental: {
    appDir: true
  },
  // Rewrite rules for static site
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          destination: '/static/index.html',
        },
        {
          source: '/static/:path*',
          destination: '/static/:path*',
        },
      ]
    }
  }
};

export default nextConfig;
