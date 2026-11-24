import { NextRequest, NextResponse } from 'next/server';
import { buildContentSecurityPolicy } from './csp';

const cachePolicies = {
  noCache: 'no-store, must-revalidate',
  publicIsr: 'public, s-maxage=60, stale-while-revalidate=300',
};

export default function proxy(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const cachePolicy = searchParams.has('dk') ? cachePolicies.noCache : cachePolicies.publicIsr;

  if (!req.nextUrl.pathname.startsWith('/activities')) {
    const response = NextResponse.next();
    response.headers.set('CDN-Cache-Control', cachePolicy);
    return response;
  }

  // Next.js はリクエストの CSP ヘッダーから nonce を読み取り、自前のスクリプトに付ける
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const csp = buildContentSecurityPolicy({ nonce });
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('CDN-Cache-Control', cachePolicy);

  return response;
}

export const config = {
  matcher: ['/activities/:path*', '/support', '/recruit'],
};
