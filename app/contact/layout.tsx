import { Metadata } from 'next';
import Hero from '@/app/_components/Hero';
import Sheet from '@/app/_components/Sheet';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description:
    'NPO法人PLDLへのお問い合わせ。ご質問・ご相談は下記フォームよりお気軽にお問い合わせください。',
  alternates: {
    canonical: '/contact',
  },
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <>
      <Hero
        title="Contact"
        sub="お問い合わせ"
        banner
        imageSrc="/photos/kids-collage-craft-room.webp"
      />
      <Sheet>{children}</Sheet>
    </>
  );
}
