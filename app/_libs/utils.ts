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

// メンバー名から「役職：名前」形式の名前部分を抽出
export const extractName = (raw: string): string => {
  const idx = raw.indexOf('：');
  if (idx !== -1) return raw.slice(idx + 1);
  const idx2 = raw.indexOf(':');
  if (idx2 !== -1) return raw.slice(idx2 + 1);
  return raw;
};
