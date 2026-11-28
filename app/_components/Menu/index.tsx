'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu as MenuIcon, X, ArrowRight } from 'lucide-react';
import cx from 'classnames';
import { CONTACT_NAV_ITEM, NAV_ITEMS, isCurrentPath } from '@/app/_constants/navigation';
import styles from './index.module.css';

export default function Menu() {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();
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
      >
        {isOpen ? <X size={24} aria-hidden="true" /> : <MenuIcon size={24} aria-hidden="true" />}
      </button>
      <nav
        id="mobile-navigation"
        className={cx(styles.nav, isOpen && styles.open)}
        aria-label="モバイルナビゲーション"
        aria-hidden={!isOpen}
      >
        <ul className={styles.items} role="list">
          {NAV_ITEMS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={close}
                aria-current={isCurrentPath(pathname, href) ? 'page' : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
          <li className={styles.ctaItem}>
            <Link
              href={CONTACT_NAV_ITEM.href}
              onClick={close}
              aria-current={isCurrentPath(pathname, CONTACT_NAV_ITEM.href) ? 'page' : undefined}
            >
              {CONTACT_NAV_ITEM.label}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
