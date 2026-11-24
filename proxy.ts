import { NextRequest, NextResponse } from 'next/server';
import { buildContentSecurityPolicy } from './csp';

const cachePolicies = {
  noCache: 'no-store, must-revalidate',
  publicIsr: 'public, s-maxage=60, stale-while-revalidate=300',
};

export default function proxy(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/activities')) {
    const isPreview = req.nextUrl.searchParams.has('dk');
    const response = NextResponse.next();
    response.headers.set(
      'CDN-Cache-Control',
      isPreview ? cachePolicies.noCache : cachePolicies.publicIsr,
    );
    return response;
  }

  // Next.js はリクエストの CSP ヘッダーから nonce を読み取り、自前のスクリプトに付ける
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const csp = buildContentSecurityPolicy({ nonce });
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);
  // CDN にキャッシュさせてはいけない。Vercel は proxy をキャッシュより前に実行するので、キャッシュから返す HTML の
  // nonce は古いまま、CSP ヘッダーの nonce だけが毎回新しくなる。食い違うと Next.js のスクリプトがすべてブロックされる。
  response.headers.set('CDN-Cache-Control', cachePolicies.noCache);

  return response;
}

export const config = {
  matcher: ['/activities/:path*', '/support', '/recruit'],
};
