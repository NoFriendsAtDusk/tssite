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
          source: '/app/login',
          destination: '/app/login',
        },
        {
          source: '/app/:path*',
          destination: '/app/:path*',
        },
      ],
    }
  },
  // Add basePath configuration
  basePath: '',
  // Configure trailing slash
  trailingSlash: true
};

export default nextConfig;
