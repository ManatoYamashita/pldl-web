'use client';

import { useRef, useEffect, useState } from 'react';
import styles from './index.module.css';

export default function FooterLogo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      queueMicrotask(() => setShowFallback(true));
      return;
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        setShowFallback(true);
      });
    }
  }, []);

  if (showFallback) {
    return (
      <picture>
        <source srcSet="/images/brand/logo.webp" type="image/webp" />
        <img
          src="/images/brand/logo.png"
          alt="放課後こどもラボ PLDL"
          className={styles.logoFallback}
        />
      </picture>
    );
  }

  return (
    <video
      ref={videoRef}
      className={styles.logo}
      muted
      playsInline
      preload="metadata"
      poster="/images/brand/logo.webp"
      aria-label="放課後こどもラボ PLDL"
      role="img"
    >
      <source src="/images/brand/logo-animation.webm" type="video/webm" />
      <source src="/images/brand/logo-animation.mp4" type="video/mp4" />
    </video>
  );
}
