// SEO
export const SITE_NAME = '放課後こどもラボ PLDL';
export const SITE_DESCRIPTION =
  'NPO法人PLDLが運営する放課後こどもラボ。群馬県みどり市を拠点に、こどもたちのサードプレイスとして創造的な学び（Playful Learning）を提供しています。';
export const DEFAULT_OG_IMAGE = '/ogp.webp';
export const DEFAULT_OG_IMAGE_FALLBACK = '/ogp.jpg';

// 1ページの活動レポート表示件数
export const REPORTS_LIST_LIMIT = 10;

// トップページの活動レポート表示件数
export const TOP_REPORTS_LIMIT = 3;

// トップページに固定表示するカテゴリ名（表示順）
export const TOP_CATEGORY_NAMES = [
  '出張ワークショップ事業',
  '放課後こどもラボ事業',
  '空間設計事業',
] as const;

// カテゴリ名→ローカル透過画像パスのマッピング
export const CATEGORY_IMAGE_MAP: Record<string, string> = {
  '出張ワークショップ事業': '/images/assets/出張ワークショップ事業.webp',
  '放課後こどもラボ事業': '/images/assets/放課後こどもラボ事業.webp',
  '空間設計事業': '/images/assets/空間設計事業.webp',
};
