import { Metadata } from 'next';
import { Zen_Kaku_Gothic_New } from 'next/font/google';
import { getMeta } from '@/app/_libs/microcms';
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_FALLBACK,
} from '@/app/_constants';
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
  const ogImages = data?.ogImage?.url
    ? [{ url: data.ogImage.url }]
    : [
        { url: DEFAULT_OG_IMAGE, type: 'image/webp', width: 1200, height: 630 },
        { url: DEFAULT_OG_IMAGE_FALLBACK, type: 'image/jpeg', width: 1200, height: 630 },
      ];

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
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: data?.ogTitle || title,
      description: data?.ogDescription || description,
      images: [ogImages[0].url],
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
        name: 'NPO法人 Playful Learning Design Lab.',
        alternateName: ['PLDL', '放課後こどもラボ'],
        url: baseUrl,
        logo: `${baseUrl}/images/brand/favicon.webp`,
        description: SITE_DESCRIPTION,
        foundingDate: '2022-10',
        founder: {
          '@type': 'Person',
          name: '尾池咲季子',
          jobTitle: '代表理事',
        },
        member: [
          {
            '@type': 'OrganizationRole',
            member: { '@type': 'Person', name: '近藤隼人' },
            roleName: '理事',
          },
          {
            '@type': 'OrganizationRole',
            member: { '@type': 'Person', name: '浦田充起' },
            roleName: '理事',
          },
          {
            '@type': 'OrganizationRole',
            member: { '@type': 'Person', name: '新井雄一' },
            roleName: '監事',
          },
        ],
        address: {
          '@type': 'PostalAddress',
          postalCode: '379-2313',
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
        <main className={styles.main}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
