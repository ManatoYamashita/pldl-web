// next.config.js は CommonJS で読み込まれるため、import ではなく require を使う
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { buildContentSecurityPolicy } = require('./csp');

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    // 既定の候補に、表示幅 420〜535px のカード向けの 448・512 と、1280〜1440px の画面の全幅画像向けの 1440 を足す
    // （既定では 384 の次が 640、1200 の次が 1920 で、大きすぎる画像が選ばれていた）
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 448, 512],
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048, 3840],
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
