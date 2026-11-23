import sanitizeHtml from 'sanitize-html';

// microCMS のリッチエディタが出力するタグと属性だけを許可する。
// CMS のアカウントが乗っ取られた場合でも、記事本文からスクリプトを実行させないため。
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'p',
    'br',
    'hr',
    'span',
    'div',
    'strong',
    'em',
    'u',
    's',
    'code',
    'pre',
    'blockquote',
    'ul',
    'ol',
    'li',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'a',
    'img',
    'figure',
    'figcaption',
  ],
  allowedAttributes: {
    h1: ['id', 'style'],
    h2: ['id', 'style'],
    h3: ['id', 'style'],
    h4: ['id', 'style'],
    h5: ['id', 'style'],
    p: ['style'],
    span: ['style'],
    th: ['colspan', 'rowspan'],
    td: ['colspan', 'rowspan'],
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height'],
    code: ['class'],
  },
  allowedClasses: {
    code: [/^language-[\w-]+$/],
  },
  allowedStyles: {
    '*': {
      color: [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i],
      'background-color': [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i],
      'text-align': [/^(left|right|center|justify)$/],
    },
  },
  allowedSchemes: ['https', 'http', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['https'] },
  allowProtocolRelative: false,
  transformTags: {
    a: (tagName, attribs) =>
      attribs.target === '_blank'
        ? { tagName, attribs: { ...attribs, rel: 'noopener noreferrer' } }
        : { tagName, attribs },
  },
};

export const sanitizeRichText = (richText: string) => sanitizeHtml(richText, SANITIZE_OPTIONS);
