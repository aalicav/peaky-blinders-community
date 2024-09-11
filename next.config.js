/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        aws4: false,
      };
    }

    config.module.rules.push({
      test: /\.map$/,
      use: ["ignore-loader"],
    });

    return config;
  },
};

module.exports = nextConfig;