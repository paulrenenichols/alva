//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
  // Enable standalone output for Docker
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env['NEXT_PUBLIC_API_URL'],
    NEXT_PUBLIC_AUTH_URL: process.env['NEXT_PUBLIC_AUTH_URL'],
  },
  images: {
    domains: ['localhost'],
  },
  webpack: (config, { isServer }) => {
    // Exclude Storybook files from Next.js build
    config.module.rules.push({
      test: /\.stories\.(js|jsx|ts|tsx)$/,
      use: 'ignore-loader',
    });
    
    // Also exclude Storybook configuration files
    config.module.rules.push({
      test: /\.storybook\//,
      use: 'ignore-loader',
    });
    
    return config;
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
