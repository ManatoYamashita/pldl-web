import { load, type CheerioAPI } from 'cheerio';
import hljs from 'highlight.js';
import 'highlight.js/styles/hybrid.css';
import { sanitizeRichText } from './sanitize';
import { optimizeImageUrl } from './utils';

// Article の CSS（.content img）で、本文の画像は本文幅（最大 912px）の 50%、640px 以下では 80% で表示される
const BODY_IMAGE_SIZES = '(max-width: 640px) 80vw, (max-width: 960px) 50vw, 456px';
const BODY_IMAGE_WIDTHS = [480, 960, 1440];
const BODY_IMAGE_DEFAULT_WIDTH = 960;

// 元の幅を超える w を指定すると microCMS の画像 API は拡大して返すため、候補は元の幅までにする
const getCandidateWidths = (intrinsicWidth: number) => {
  const widths = BODY_IMAGE_WIDTHS.filter((w) => w < intrinsicWidth);
  const largest = BODY_IMAGE_WIDTHS[BODY_IMAGE_WIDTHS.length - 1];
  return intrinsicWidth <= largest ? [...widths, intrinsicWidth] : widths;
};

// 本文の画像は next/image を通らず、microCMS の元画像（HEIC や 3000px 超の写真）がそのまま届く。
// microCMS 側で縮小して WebP にし、画面幅に合ったものをブラウザに選ばせる。
const optimizeBodyImages = ($: CheerioAPI) => {
  $('img').each((_, elm) => {
    const img = $(elm);
    img.attr('loading', 'lazy');
    img.attr('decoding', 'async');

    const src = img.attr('src');
    if (!src) return;
    const url = URL.canParse(src) ? new URL(src) : null;
    if (url?.hostname !== 'images.microcms-assets.io') return;
    // 変換するのはカメラの元画像に多い形式だけ。WebP などは入稿時点で Web 向けに圧縮されていて、
    // microCMS で変換し直すとかえって大きくなる（実測で 89KB → 120KB）。GIF はアニメーションが保たれるか未確認。
    if (!/\.(jpe?g|png|hei[cf])$/i.test(url.pathname)) return;

    const widths = getCandidateWidths(Number(img.attr('width')) || Infinity);
    const srcWidth = widths.filter((w) => w <= BODY_IMAGE_DEFAULT_WIDTH).at(-1) ?? widths[0];
    img.attr('src', optimizeImageUrl(src, srcWidth));
    img.attr('srcset', widths.map((w) => `${optimizeImageUrl(src, w)} ${w}w`).join(', '));
    img.attr('sizes', BODY_IMAGE_SIZES);
  });
};

export const formatRichText = (richText: string) => {
  const $ = load(sanitizeRichText(richText), null, false);
  optimizeBodyImages($);
  $('pre code').each((_, elm) => {
    const lang = $(elm).attr('class');
    const res = lang
      ? hljs.highlight($(elm).text(), { language: lang?.replace(/^language-/, '') || '' })
      : hljs.highlightAuto($(elm).text());
    $(elm).html(res.value);
  });
  return $.html();
};
