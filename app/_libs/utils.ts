import { formatInTimeZone } from 'date-fns-tz';
import { load } from 'cheerio';
import hljs from 'highlight.js';
import 'highlight.js/styles/hybrid.css';

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

export const formatRichText = (richText: string) => {
  const $ = load(richText, null, false);
  $('pre code').each((_, elm) => {
    const lang = $(elm).attr('class');
    const res = lang
      ? hljs.highlight($(elm).text(), { language: lang?.replace(/^language-/, '') || '' })
      : hljs.highlightAuto($(elm).text());
    $(elm).html(res.value);
  });
  return $.html();
};
