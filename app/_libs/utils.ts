import { formatInTimeZone } from 'date-fns-tz';
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '@/app/_constants';

export const formatDate = (date: string) => {
  return formatInTimeZone(new Date(date), 'Asia/Tokyo', 'yyyy/MM/dd');
};

// 日付をドット区切り形式（yyyy.mm.dd）にフォーマット
export const formatDateDot = (dateStr: string): string => {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
};

// microCMS 画像URLに最適化パラメータを付与
export const optimizeImageUrl = (url: string, width: number): string => {
  const u = new URL(url);
  u.searchParams.set('w', String(width));
  u.searchParams.set('fm', 'webp');
  return u.toString();
};

// sharp（Next.js の画像最適化）は HEIC/HEIF を読めず、`/_next/image` が元ファイルをそのまま返す。
// その形式を表示できるのはおおむね Safari だけなので、microCMS 側で WebP に変換させる。
// ほかの形式にまで付けると、Next.js の変換と合わせて非可逆圧縮が二重にかかるため HEIC/HEIF に限る。
export const toDisplayImageUrl = (url: string): string => {
  const u = new URL(url);
  if (!/\.hei[cf]$/i.test(u.pathname)) return url;
  u.searchParams.set('fm', 'webp');
  return u.toString();
};

// OGP を取りに来るクローラーの WebP 対応は保証できないため、JPEG にそろえる
export const toOgImageUrl = (url: string): string => {
  const u = new URL(url);
  u.searchParams.set('fm', 'jpg');
  u.searchParams.set('w', String(OG_IMAGE_WIDTH));
  u.searchParams.set('h', String(OG_IMAGE_HEIGHT));
  u.searchParams.set('fit', 'crop');
  return u.toString();
};

// メンバー名から「役職：名前」形式の名前部分を抽出
export const extractName = (raw: string): string => {
  const idx = raw.indexOf('：');
  if (idx !== -1) return raw.slice(idx + 1);
  const idx2 = raw.indexOf(':');
  if (idx2 !== -1) return raw.slice(idx2 + 1);
  return raw;
};

// JSON.stringify は `<` をエスケープしないため、CMS の値に `</script>` が含まれると script 要素を抜け出せてしまう
export const serializeJsonLd = (data: unknown): string => {
  return JSON.stringify(data).replace(/</g, '\\u003c');
};
