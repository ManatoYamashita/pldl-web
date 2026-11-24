/**
 * Content-Security-Policy を組み立てる。next.config.js（全ページ）と proxy.ts（/activities 配下）で共有する。
 *
 * nonce を渡すと script-src を nonce と 'strict-dynamic' に限定し、'unsafe-inline' を外す。
 * nonce はリクエストごとに作る必要があり、動的レンダリングのページにしか使えない。
 * このサイトで動的なのは /activities 配下だけなので、そこにだけ nonce 版を付けている。
 *
 * @param {{ nonce?: string }} [options]
 * @returns {string}
 */
function buildContentSecurityPolicy({ nonce } = {}) {
  const isDev = process.env.NODE_ENV === 'development';
  const scriptSrc = [
    "'self'",
    nonce ? `'nonce-${nonce}' 'strict-dynamic'` : "'unsafe-inline'",
    // Google アナリティクス 4 に必要なドメインは Google の CSP ガイドに従う
    // https://developers.google.com/tag-platform/security/guides/csp
    // 'strict-dynamic' に対応したブラウザはこのホスト指定を無視し、nonce 付きのスクリプトが読み込んだものだけを許可する
    'https://*.googletagmanager.com',
    // お問い合わせフォームの Cloudflare Turnstile
    'https://challenges.cloudflare.com',
    isDev ? "'unsafe-eval'" : '',
  ]
    .filter(Boolean)
    .join(' ');

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://images.microcms-assets.io https://*.google-analytics.com https://*.googletagmanager.com",
    "font-src 'self'",
    "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
    'frame-src https://www.google.com https://challenges.cloudflare.com',
    "frame-ancestors 'none'",
  ].join('; ');
}

module.exports = { buildContentSecurityPolicy };
