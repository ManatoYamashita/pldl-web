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
  // Instagram → 活動レポートの下書き。この日時より後の投稿だけを取り込む（初回の実行時に記録する）
  instagramImportSince: 'ig_import_since',
  instagramImported: (mediaId: string) => `ig_import_${mediaId}`,
} as const;

// ---- Instagram の投稿 → 活動レポートの下書き ----

// 1 回の取得で見る件数（新しい順）。Cron は 1 日 1 回なので、1 日の投稿数より十分に多くする
export const INSTAGRAM_IMPORT_FETCH_LIMIT = 25;

// 1 回の実行で取り込む投稿の上限。残りは次の実行で取り込む
export const INSTAGRAM_IMPORT_MAX_PER_RUN = 5;

// 実行開始からこの時間を過ぎたら、新しい投稿の取り込みを始めない（maxDuration は 300 秒）
export const INSTAGRAM_IMPORT_TIME_BUDGET_MS = 200 * 1000;

// カルーセルから取り込む画像の上限
export const INSTAGRAM_IMPORT_MAX_IMAGES = 10;

// 失敗した投稿を取り込み直す回数の上限（1 日 1 回なので、最大でこの日数だけ試す）
export const INSTAGRAM_IMPORT_MAX_ATTEMPTS = 3;

// 下書きに付けるカテゴリ（microCMS の「活動レポート」）。運営者が公開前に直す
export const INSTAGRAM_IMPORT_CATEGORY_ID = 'reports';

// 下書きの説明文（description）の長さ（文字数）
export const INSTAGRAM_IMPORT_DESCRIPTION_LENGTH = 120;

// キャプションに【】が無いとき、1 行目から作るタイトルの長さ（文字数）
export const INSTAGRAM_IMPORT_TITLE_LENGTH = 60;

// キャプションの末尾の定型（「・」だけの行と団体名）。下書きの本文からは取り除く
export const INSTAGRAM_CAPTION_SIGNATURE = /^NPO法人\s*Playful Learning Design Lab\.?$/;

// microCMS のメディアのアップロード API の上限
export const MICROCMS_MEDIA_MAX_BYTES = 5 * 1024 * 1024;
