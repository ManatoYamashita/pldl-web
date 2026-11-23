import Script from 'next/script';

type Props = {
  /** GA4 の測定 ID（G-XXXXXXXXXX） */
  measurementId: string;
};

/**
 * Google アナリティクス 4（gtag.js）を読み込む。
 *
 * App Router のクライアント側遷移は、GA4 の拡張計測機能
 * 「ブラウザの履歴イベントに基づくページの変更」で自動的にページビューとして記録される。
 * そのため、ここでは遷移ごとの page_view 送信は行わない。
 */
export default function GoogleAnalytics({ measurementId }: Props) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', ${JSON.stringify(measurementId)});
        `}
      </Script>
    </>
  );
}
