import { cache } from 'react';
import { createClient } from 'microcms-js-sdk';
import type {
  MicroCMSQueries,
  MicroCMSImage,
  MicroCMSDate,
  MicroCMSContentId,
} from 'microcms-js-sdk';
import { notFound } from 'next/navigation';

// カテゴリーの型定義
export type Category = {
  name: string;
  description: string;
  thumbnail?: MicroCMSImage;
} & MicroCMSContentId &
  MicroCMSDate;

// 活動レポートの型定義
export type Report = {
  title: string;
  category: Category;
  description: string;
  thumbnail?: MicroCMSImage;
  content: string;
} & MicroCMSContentId &
  MicroCMSDate;

// メンバーの型定義
export type Member = {
  name: string;
  description: string;
  thumbnail?: MicroCMSImage;
  content: string;
} & MicroCMSContentId &
  MicroCMSDate;

// メタ情報の型定義
export type Meta = {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: MicroCMSImage;
  canonical?: string;
};

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is required');
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is required');
}

// Initialize Client SDK.
export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

// 活動レポート一覧を取得
export const getReportsList = async (queries?: MicroCMSQueries) => {
  const listData = await client
    .getList<Report>({
      endpoint: 'reports',
      queries,
    })
    .catch(notFound);
  return listData;
};

// 活動レポートの詳細を取得（React.cache で同一リクエスト内の重複排除）
export const getReportsDetail = cache(async (contentId: string, queries?: MicroCMSQueries) => {
  const detailData = await client
    .getListDetail<Report>({
      endpoint: 'reports',
      contentId,
      queries,
    })
    .catch(notFound);

  return detailData;
});

// カテゴリーの一覧を取得
export const getCategoryList = async (queries?: MicroCMSQueries) => {
  const listData = await client
    .getList<Category>({
      endpoint: 'categories',
      queries,
    })
    .catch(notFound);

  return listData;
};

// カテゴリーの詳細を取得
export const getCategoryDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  const detailData = await client
    .getListDetail<Category>({
      endpoint: 'categories',
      contentId,
      queries,
    })
    .catch(notFound);

  return detailData;
};

// メンバー一覧を取得
export const getMembersList = async (queries?: MicroCMSQueries) => {
  const listData = await client
    .getList<Member>({
      endpoint: 'members',
      queries,
    })
    .catch(notFound);
  return listData;
};

// 次の活動レポートを取得（公開日が指定日より後の最も古い記事）
export const getNextReport = async (publishedAt: string) => {
  const listData = await client
    .getList<Report>({
      endpoint: 'reports',
      queries: {
        filters: `publishedAt[greater_than]${publishedAt}`,
        orders: 'publishedAt',
        limit: 1,
        fields: ['id', 'title', 'thumbnail'],
      },
    })
    .catch(() => null);
  return listData?.contents[0] ?? null;
};

// 前の活動レポートを取得（公開日が指定日より前の最も新しい記事）
export const getPrevReport = async (publishedAt: string) => {
  const listData = await client
    .getList<Report>({
      endpoint: 'reports',
      queries: {
        filters: `publishedAt[less_than]${publishedAt}`,
        orders: '-publishedAt',
        limit: 1,
        fields: ['id', 'title', 'thumbnail'],
      },
    })
    .catch(() => null);
  return listData?.contents[0] ?? null;
};

// 同カテゴリの関連レポートを取得（自分自身を除く、最大3件）
export const getRelatedReports = async (categoryId: string, excludeId: string) => {
  const listData = await client
    .getList<Report>({
      endpoint: 'reports',
      queries: {
        filters: `category[equals]${categoryId}[and]id[not_equals]${excludeId}`,
        orders: '-publishedAt',
        limit: 3,
        fields: ['id', 'title', 'thumbnail', 'category', 'publishedAt', 'createdAt'],
      },
    })
    .catch(() => null);
  return listData?.contents ?? [];
};

// メタ情報を取得
export const getMeta = async (queries?: MicroCMSQueries) => {
  const data = await client
    .getObject<Meta>({
      endpoint: 'meta',
      queries,
    })
    .catch(() => null);

  return data;
};
