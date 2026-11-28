// Instagram のキャプションから、活動レポートの下書きのタイトル・説明文・本文を作る。
// PLDL の投稿は「【タイトル】絵文字」で始まり、「・」だけの行と団体名で終わる形がそろっている。
import {
  INSTAGRAM_CAPTION_FOOTER,
  INSTAGRAM_CAPTION_SIGNATURE,
  INSTAGRAM_IMPORT_DESCRIPTION_LENGTH,
  INSTAGRAM_IMPORT_TITLE_LENGTH,
} from '@/app/_constants/sns';

export type ParsedCaption = {
  title: string;
  description: string;
  // 空行で区切った段落。段落の中の改行はそのまま残す
  paragraphs: string[];
};

const TITLE_PATTERN = /^【(.+?)】/;
// 「・」「･」と空白だけの行
const DOT_LINE_PATTERN = /^[・･\s]*$/;
// ハッシュタグだけの行
const HASHTAG_LINE_PATTERN = /^(#\S+\s*)+$/;

// 絵文字などのサロゲートペアを途中で切らないよう、文字単位で数える
function truncate(text: string, length: number) {
  const chars = Array.from(text);
  return chars.length > length ? `${chars.slice(0, length - 1).join('')}…` : text;
}

function formatDate(timestamp: string) {
  const date = new Date(Date.parse(timestamp));
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// Web の活動レポートから自動投稿したもの。下書きに戻すと、Web → Instagram → Web と行き来してしまう
export function isPostedFromWeb(caption: string | undefined) {
  return !!caption?.includes(INSTAGRAM_CAPTION_FOOTER);
}

// 末尾の定型（「・」だけの行、団体名、ハッシュタグだけの行、空行）を取り除く
function stripSignature(lines: string[]) {
  const result = [...lines];
  while (result.length > 0) {
    const last = result[result.length - 1].trim();
    if (
      DOT_LINE_PATTERN.test(last) ||
      INSTAGRAM_CAPTION_SIGNATURE.test(last) ||
      HASHTAG_LINE_PATTERN.test(last)
    ) {
      result.pop();
    } else {
      break;
    }
  }
  return result;
}

function toParagraphs(lines: string[]) {
  return lines
    .join('\n')
    .split(/\n\s*\n/)
    .map((paragraph) =>
      paragraph
        .split('\n')
        .map((line) => line.trim())
        .join('\n')
        .trim(),
    )
    .filter(Boolean);
}

export function parseInstagramCaption(
  caption: string | undefined,
  timestamp: string,
): ParsedCaption {
  const lines = stripSignature((caption ?? '').replace(/\r\n?/g, '\n').split('\n'));
  const firstIndex = lines.findIndex((line) => line.trim() !== '');
  const fallbackTitle = `Instagram の投稿（${formatDate(timestamp)}）`;

  if (firstIndex === -1) {
    return { title: fallbackTitle, description: fallbackTitle, paragraphs: [] };
  }

  const firstLine = lines[firstIndex].trim();
  const match = firstLine.match(TITLE_PATTERN);
  let title: string;
  let bodyLines: string[];
  if (match) {
    // 【】の後ろの絵文字は捨てる
    title = match[1].trim();
    bodyLines = lines.slice(firstIndex + 1);
  } else {
    title = truncate(firstLine, INSTAGRAM_IMPORT_TITLE_LENGTH);
    // 1 行目しか無い投稿は、それを本文にも使う
    const rest = lines.slice(firstIndex + 1);
    bodyLines = rest.some((line) => line.trim() !== '') ? rest : [firstLine];
  }

  const paragraphs = toParagraphs(bodyLines);
  // 日本語の文なので、改行はつなげて消す。英単語の間の空白は 1 つにまとめて残す
  const plain = paragraphs.join('').replace(/\n/g, '').replace(/\s+/g, ' ').trim();
  return {
    title: title || fallbackTitle,
    description: plain ? truncate(plain, INSTAGRAM_IMPORT_DESCRIPTION_LENGTH) : title,
    paragraphs,
  };
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// microCMS のリッチエディタ（HTML）に入れる本文。2 枚目以降の画像は本文の末尾に並べる
export function buildReportContent(parsed: ParsedCaption, imageUrls: string[]) {
  const paragraphs = parsed.paragraphs.length > 0 ? parsed.paragraphs : [parsed.title];
  const text = paragraphs.map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`);
  const images = imageUrls.map((url) => `<figure><img src="${escapeHtml(url)}" alt=""></figure>`);
  return [...text, ...images].join('');
}
