import type { Metadata } from 'next';
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_FALLBACK,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_NAME,
} from '@/app/_constants';

type OpenGraph = NonNullable<Metadata['openGraph']>;

export const DEFAULT_OG_IMAGES = [
  { url: DEFAULT_OG_IMAGE, type: 'image/webp', width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT },
  {
    url: DEFAULT_OG_IMAGE_FALLBACK,
    type: 'image/jpeg',
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
  },
];

// Next.js はメタデータをセグメント間で浅くマージするため、ページが openGraph を書くと
// レイアウトの openGraph は丸ごと消える。共通の値はページごとに展開し直す必要がある。
export const SHARED_OPEN_GRAPH: OpenGraph = {
  type: 'website',
  locale: 'ja_JP',
  siteName: SITE_NAME,
  images: DEFAULT_OG_IMAGES,
};

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  openGraph?: OpenGraph;
};

// twitter は書かない。レイアウトが card だけを指定しておけば、Next.js が title・description・images を
// このページの openGraph から補う（レイアウトでそれらを指定すると、補われずにサイトの値が残る）。
export const buildPageMetadata = ({
  title,
  description,
  path,
  openGraph,
}: PageMetadataInput): Metadata => ({
  title,
  description,
  alternates: { canonical: path },
  openGraph: { ...SHARED_OPEN_GRAPH, title, description, url: path, ...openGraph },
});
