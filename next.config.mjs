/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    level: 'info'
  },
  experimental: {
    appDir: true
  },
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
        }
      ],
      afterFiles: [
        {
          source: '/app',
          destination: '/app',
        },
        {
          source: '/app/login',
          destination: '/app/login',
        },
        {
          source: '/app/:path*',
          destination: '/app/:path*',
        }
      ]
    }
  }
};

export default nextConfig;
