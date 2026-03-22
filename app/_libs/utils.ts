import { formatInTimeZone } from 'date-fns-tz';

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

// メンバー名から「役職：名前」形式の名前部分を抽出
export const extractName = (raw: string): string => {
  const idx = raw.indexOf('：');
  if (idx !== -1) return raw.slice(idx + 1);
  const idx2 = raw.indexOf(':');
  if (idx2 !== -1) return raw.slice(idx2 + 1);
  return raw;
};
