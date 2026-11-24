// next.config.js は CommonJS で読み込まれるため、import ではなく require を使う
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { buildContentSecurityPolicy } = require('./csp');

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    qualities: [60, 65, 70, 75, 80],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
  },
  async headers() {
    return [
      {
        source: '/_next/static/media/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // /activities 配下は proxy.ts が nonce 付きの CSP を付ける
        source: '/((?!activities(?:/|$)).*)',
        headers: [{ key: 'Content-Security-Policy', value: buildContentSecurityPolicy() }],
      },
    ];
  },
};

module.exports = nextConfig;
