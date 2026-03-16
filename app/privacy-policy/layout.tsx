import { Metadata } from 'next';
import Hero from '@/app/_components/Hero';
import Sheet from '@/app/_components/Sheet';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description:
    'NPO法人PLDLのプライバシーポリシー。個人情報の取り扱いについてご説明いたします。',
  alternates: {
    canonical: '/privacy-policy',
  },
};

type Props = {
  children: React.ReactNode;
};

export default function PrivacyPolicyLayout({ children }: Props) {
  return (
    <>
      <Hero
        title="Privacy Policy"
        sub="プライバシーポリシー"
        banner
        imageSrc="/photos/children-sitting-class-gathering.webp"
      />
      <Sheet>{children}</Sheet>
    </>
  );
}
