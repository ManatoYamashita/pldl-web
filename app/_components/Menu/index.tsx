'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import cx from 'classnames';
import styles from './index.module.css';

export default function Menu() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const open = () => setOpen(true);
  const close = () => {
    setOpen(false);
    // メニューを閉じたら、開くボタンにフォーカスを戻す
    menuButtonRef.current?.focus();
  };

  // Escape キーでメニューを閉じる
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // メニューが開いたら、閉じるボタンにフォーカスを移動
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div>
      <nav
        id="mobile-navigation"
        className={cx(styles.nav, isOpen && styles.open)}
        aria-label="モバイルナビゲーション"
        aria-hidden={!isOpen}
        role="dialog"
        aria-modal="true"
      >
        <ul className={styles.items} role="list">
          <li>
            <Link href="/news" onClick={close}>
              ニュース
            </Link>
          </li>
          <li>
            <Link href="/business" onClick={close}>
              事業内容
            </Link>
          </li>
          <li>
            <Link href="/members" onClick={close}>
              メンバー
            </Link>
          </li>
          <li>
            <Link href="" onClick={close}>
              採用情報
            </Link>
          </li>
          <li>
            <Link href="/contact" onClick={close}>
              お問い合わせ
            </Link>
          </li>
        </ul>
        <button
          ref={closeButtonRef}
          className={cx(styles.button, styles.close)}
          onClick={close}
          aria-label="メニューを閉じる"
        >
          <Image src="/close.svg" alt="" width={24} height={24} priority />
        </button>
      </nav>
      <button
        ref={menuButtonRef}
        className={styles.button}
        onClick={open}
        aria-label="メニューを開く"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-haspopup="true"
      >
        <Image src="/menu.svg" alt="" width={24} height={24} priority />
      </button>
    </div>
  );
}
