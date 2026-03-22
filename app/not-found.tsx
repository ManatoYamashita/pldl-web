import Image from 'next/image';
import Hero from '@/app/_components/Hero';
import Sheet from '@/app/_components/Sheet';
import ButtonLink from '@/app/_components/ButtonLink';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <>
      <Hero
        title="404"
        sub="Not Found"
        banner
        imageSrc="/photos/children-outdoor-field-walk.webp"
      />
      <Sheet>
        <div className={styles.content}>
          <Image
            src="/images/assets/404.webp"
            alt="ページが見つかりません"
            width={200}
            height={200}
            className={styles.illustration}
          />
          <h2 className={styles.title}>ページが見つかりませんでした</h2>
          <p className={styles.text}>
            あなたがアクセスしようとしたページは存在しません。
            <br />
            URLを再度ご確認ください。
          </p>
          <div className={styles.cta}>
            <ButtonLink href="/activities">活動レポートを見る</ButtonLink>
          </div>
        </div>
      </Sheet>
    </>
  );
}
