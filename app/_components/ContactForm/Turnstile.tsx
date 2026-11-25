'use client';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

type TurnstileApi = {
  render: (container: HTMLElement, options: { sitekey: string; language?: string }) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type Props = {
  siteKey: string;
  /** 値が変わるたびにウィジェットをリセットし、新しいトークンを取り直す */
  resetSignal: unknown;
};

/**
 * Cloudflare Turnstile のウィジェット。フォームの中に置くと、トークンが
 * `cf-turnstile-response` という hidden input に入り、FormData で送られる。
 *
 * 暗黙のレンダリングはスクリプトを読み込んだときに一度だけ要素を探すため、
 * クライアント側の遷移でフォームに戻ってくると描画されない。そのため explicit で描画する。
 */
export default function Turnstile({ siteKey, resetSignal }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready || !containerRef.current || !window.turnstile) return;
    const widgetId = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      language: 'ja',
    });
    widgetIdRef.current = widgetId;
    return () => {
      window.turnstile?.remove(widgetId);
      widgetIdRef.current = null;
    };
  }, [ready, siteKey]);

  useEffect(() => {
    if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
  }, [resetSignal]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />
      <div ref={containerRef} />
    </>
  );
}
