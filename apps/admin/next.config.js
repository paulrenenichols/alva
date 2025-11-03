//@ts-check

const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
  // Set base path for ALB routing (admin service is routed via /admin/*)
  basePath: '/admin',
  // Disable trailing slash redirect to prevent redirect loop with ALB
  trailingSlash: true,
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
