'use client';

import Image from 'next/image';
import Sheet from '@/app/_components/Sheet';
import ButtonLink from '@/app/_components/ButtonLink';
import styles from './error.module.css';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <Sheet>
      <div className={styles.content}>
        <Image
          src="/images/assets/404.webp"
          alt="エラーが発生しました"
          width={200}
          height={200}
          className={styles.illustration}
        />
        <h2 className={styles.title}>エラーが発生しました</h2>
        <p className={styles.text}>
          ページの読み込み中に問題が発生しました。
          <br />
          時間をおいて再度お試しください。
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.retryButton} onClick={reset}>
            再試行する
          </button>
          <ButtonLink href="/">トップページへ戻る</ButtonLink>
        </div>
      </div>
    </Sheet>
  );
}
