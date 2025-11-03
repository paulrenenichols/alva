//@ts-check

const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
  // ALB routes /admin/* to this service
  // Next.js rewrites strip /admin prefix internally, so routes work from root
  // This avoids redirect loops from basePath configuration
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: '/:path*', // Strip /admin prefix internally
      },
      {
        source: '/admin',
        destination: '/', // Map /admin to root
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env['NEXT_PUBLIC_API_URL'],
    NEXT_PUBLIC_AUTH_URL: process.env['NEXT_PUBLIC_AUTH_URL'],
  },
  webpack: (config, { isServer, dev }) => {
    // Enable polling for file watching in Docker development
    // This is necessary because Docker volume mounts don't always trigger file system events
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay before rebuilding once the first file changed
        ignored: /node_modules/,
      };
    }
    return config;
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
