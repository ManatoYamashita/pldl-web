import { Metadata } from 'next';
import styles from './page.module.css';
import ContactForm from '@/app/_components/ContactForm';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description:
    'NPO法人PLDL（放課後こどもラボ）へのお問い合わせフォーム。活動に関するご質問やご相談を受け付けています。',
  openGraph: {
    title: 'お問い合わせ',
    description:
      'NPO法人PLDL（放課後こどもラボ）へのお問い合わせフォーム。活動に関するご質問やご相談を受け付けています。',
  },
  alternates: { canonical: '/contact' },
};

export default function Page() {
  return (
    <div className={styles.container}>
      <p className={styles.text}>
        ご質問、ご相談は下記フォームよりお問い合わせください。
        <br />
        内容確認後、担当者より通常3営業日以内にご連絡いたします。
      </p>
      <ContactForm />
    </div>
  );
}
