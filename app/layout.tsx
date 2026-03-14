import { Metadata } from 'next';
import { Zen_Kaku_Gothic_New } from 'next/font/google';
import { getMeta } from '@/app/_libs/microcms';
import { SITE_NAME, SITE_DESCRIPTION, DEFAULT_OG_IMAGE } from '@/app/_constants';
import Footer from '@/app/_components/Footer';
import Header from '@/app/_components/Header';
import './globals.css';
import styles from './layout.module.css';

// Zen Kaku Gothic New フォントの読み込み
const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const data = await getMeta();

  const title = data?.title || SITE_NAME;
  const description = data?.description || SITE_DESCRIPTION;
  const ogImage = data?.ogImage?.url || DEFAULT_OG_IMAGE;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: `%s | ${SITE_NAME}`,
      default: title,
    },
    description,
    openGraph: {
      type: 'website',
      locale: 'ja_JP',
      siteName: SITE_NAME,
      url: baseUrl,
      title: data?.ogTitle || title,
      description: data?.ogDescription || description,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: data?.ogTitle || title,
      description: data?.ogDescription || description,
      images: [ogImage],
    },
    alternates: {
      canonical: data?.canonical || '/',
    },
  };
}

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'NPO法人 Playful Learning Design Lab',
        alternateName: ['PLDL', '放課後こどもラボ'],
        url: baseUrl,
        logo: `${baseUrl}/images/brand/favicon.webp`,
        description: SITE_DESCRIPTION,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'みどり市',
          addressRegion: '群馬県',
          addressCountry: 'JP',
          streetAddress: '笠懸町鹿3616-1',
        },
        nonprofitStatus: 'NonprofitNPOC',
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: SITE_NAME,
        publisher: { '@id': `${baseUrl}/#organization` },
        inLanguage: 'ja',
      },
    ],
  };

  return (
    <html lang="ja" className={zenKakuGothicNew.variable}>
      <body className={styles.body}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
