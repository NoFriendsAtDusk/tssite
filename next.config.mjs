/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    level: 'info'
  },
  // Rewrite rules to handle both static site and app
  async rewrites() {
    return {
      beforeFiles: [
        // Serve static site files from /static
        {
          source: '/',
          destination: '/static/index.html',
        },
        {
          source: '/static/:path*',
          destination: '/static/:path*',
        },
      ],
      afterFiles: [
        // Handle app routes
        {
          source: '/login',
          destination: '/app/login',
        },
      ],
      fallback: [
        // Handle all other routes
        {
          source: '/:path*',
          destination: '/:path*',
        },
      ],
    }
  }
};

export default nextConfig;
