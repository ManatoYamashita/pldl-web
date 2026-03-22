// SEO
// テンプレート・OG siteName・構造化データ・UI用（短縮ブランド名）
export const SITE_NAME = '放課後こどもラボ PLDL';
// ホームページ用 <title>（SERP表示幅 ~30全角文字に最適化）
export const SITE_TITLE = '放課後こどもラボ | 群馬県みどり市のNPO法人PLDL';
// meta description（英語正式名を含め、英語検索にも対応）
export const SITE_DESCRIPTION =
  'NPO法人PLDL（Playful Learning Design Lab.）が運営する放課後こどもラボ。群馬県みどり市を拠点に、こどもたちのサードプレイスとして創造的な学びを提供しています。';
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
