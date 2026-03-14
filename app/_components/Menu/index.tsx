'use client';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu as MenuIcon, X, ArrowRight } from 'lucide-react';
import cx from 'classnames';
import styles from './index.module.css';

export default function Menu() {
  const [isOpen, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  const toggle = () => setOpen((prev) => !prev);

  // Escape キーで閉じる
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, close]);

  // クリック外で閉じる
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, close]);

  return (
    <div ref={wrapperRef}>
      <button
        ref={menuButtonRef}
        className={styles.button}
        onClick={toggle}
        aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-haspopup="true"
      >
        {isOpen ? (
          <X size={24} aria-hidden="true" />
        ) : (
          <MenuIcon size={24} aria-hidden="true" />
        )}
      </button>
      <nav
        id="mobile-navigation"
        className={cx(styles.nav, isOpen && styles.open)}
        aria-label="モバイルナビゲーション"
        aria-hidden={!isOpen}
      >
        <ul className={styles.items} role="list">
          <li>
            <Link href="/about" onClick={close}>私たちについて</Link>
          </li>
          <li>
            <Link href="/activities" onClick={close}>活動内容</Link>
          </li>
          <li>
            <Link href="/support" onClick={close}>サポート</Link>
          </li>
          <li>
            <Link href="/recruit" onClick={close}>採用</Link>
          </li>
          <li className={styles.ctaItem}>
            <Link href="/contact" onClick={close}>
              お問い合わせ
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
