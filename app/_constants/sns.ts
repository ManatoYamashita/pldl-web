// SNS 自動投稿（Instagram）で使う定数

// Instagram のキャプションの上限（文字数）
export const INSTAGRAM_MAX_CAPTION_LENGTH = 2200;

// Instagram ではキャプションのリンクを押せないため、プロフィールのリンクへ誘導する
export const INSTAGRAM_CAPTION_FOOTER =
  '活動レポートの全文は、プロフィールのリンクからご覧ください。';

// Instagram API with Unified Login は graph.facebook.com を使う。バージョンは公式ドキュメントの例に合わせる
export const INSTAGRAM_GRAPH_BASE_URL = 'https://graph.facebook.com/v27.0';

// Instagram に渡す画像。JPEG しか受け付けないため、microCMS の画像 API で正方形の JPEG に変換する
export const INSTAGRAM_IMAGE_PARAMS = {
  fm: 'jpg',
  w: '1080',
  h: '1080',
  fit: 'crop',
  q: '85',
} as const;

// コンテナが公開できる状態（FINISHED）になるまで待つ間隔と回数
export const INSTAGRAM_CONTAINER_POLL_INTERVAL_MS = 3000;
export const INSTAGRAM_CONTAINER_POLL_MAX_ATTEMPTS = 10;

// 投稿中（pending）の記録がこれより古ければ、処理が途中で止まったとみなして投稿し直す
export const SNS_PENDING_TIMEOUT_MS = 10 * 60 * 1000;

// Global Config のキー
export const GLOBAL_CONFIG_KEYS = {
  instagramPosted: (contentId: string) => `sns_instagram_${contentId}`,
} as const;
