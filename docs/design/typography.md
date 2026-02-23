# タイポグラフィ詳細

**PLDLデザインシステム - タイポグラフィ**

[← デザインシステムトップに戻る](../design.md)

---

## 目次

- [1. フォントファミリー](#1-フォントファミリー)
- [2. フォントサイズスケール](#2-フォントサイズスケール)
- [3. フォントウェイト](#3-フォントウェイト)
- [4. 行高（Line Height）](#4-行高line-height)
- [5. Before/After比較](#5-beforeafter比較)
- [6. 使用例](#6-使用例)

---

## 1. フォントファミリー

### 1.1 推奨フォント: Zen Kaku Gothic New

**Google Fonts**の「**Zen Kaku Gothic New**」を採用します。現代的で読みやすく、子供向けコンテンツに最適なフォントです。

```css
--font-sans: 'Zen Kaku Gothic New', 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', -apple-system, BlinkMacSystemFont, sans-serif;
```

**特徴**:
- **現代的なデザイン**: 丸みを帯びた柔らかい印象
- **読みやすさ**: 本文にも見出しにも適用可能
- **Web最適化**: Google Fontsで提供されているため、ロードが速い
- **多言語対応**: 日本語、英語、数字をカバー

**フォントウェイト**:
- 400（Regular）
- 500（Medium）
- 700（Bold）

**Google Fontsリンク**:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap" rel="stylesheet">
```

**`app/layout.tsx` への追加**:
```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

### 1.2 代替案: 丸ゴシック（より柔らかい印象）

より柔らかく親しみやすい印象が必要な場合は、以下のフォントを検討できます。

```css
--font-sans: 'M PLUS Rounded 1c', 'Zen Maru Gothic', 'Noto Sans JP', sans-serif;
```

**特徴**:
- **丸ゴシック**: 角が丸く、より柔らかい印象
- **親しみやすさ**: 子供向けコンテンツに特に適している

**注意**: この代替案は現時点では採用していません。必要に応じて検討してください。

---

### 1.3 等幅フォント（コード表示用）

```css
--font-mono: ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono', 'Roboto Mono', monospace;
```

**用途**:
- コードブロック（`<code>`, `<pre>`）
- 技術的な情報の表示

---

## 2. フォントサイズスケール

### 2.1 Major Third スケール（1.25倍）

現在の単純な構成（3rem, 1rem, 0.9rem）から、**体系的なスケール**に変更します。

**Major Third スケール**（1.25倍）を採用し、一貫性のあるサイズ階層を構築します。

```css
/* フォントサイズ */
--font-size-xs: 0.75rem;      /* 12px - キャプション、ラベル */
--font-size-sm: 0.875rem;     /* 14px - 小さな本文 */
--font-size-md: 1rem;         /* 16px - 標準本文 */
--font-size-lg: 1.125rem;     /* 18px - リード文 */
--font-size-xl: 1.25rem;      /* 20px - 小見出し */
--font-size-2xl: 1.5rem;      /* 24px - 中見出し */
--font-size-3xl: 2rem;        /* 32px - 大見出し */
--font-size-4xl: 2.5rem;      /* 40px - 特大見出し */
--font-size-5xl: 3rem;        /* 48px - ヒーロー見出し */
```

**合計**: 9段階のフォントサイズ

---

### 2.2 各サイズの用途

| サイズ | 変数 | px値 | 用途 | 例 |
|-------|------|------|------|-----|
| XS | `--font-size-xs` | 12px | キャプション、ラベル | フォームのヒント、画像キャプション |
| SM | `--font-size-sm` | 14px | 小さな本文 | サブテキスト、日付表示 |
| MD | `--font-size-md` | 16px | 標準本文 | 本文、リスト項目 |
| LG | `--font-size-lg` | 18px | リード文 | 記事の冒頭文、強調本文 |
| XL | `--font-size-xl` | 20px | 小見出し | セクション小見出し、カード見出し |
| 2XL | `--font-size-2xl` | 24px | 中見出し | `<h3>` |
| 3XL | `--font-size-3xl` | 32px | 大見出し | `<h2>` |
| 4XL | `--font-size-4xl` | 40px | 特大見出し | `<h1>`（通常ページ） |
| 5XL | `--font-size-5xl` | 48px | ヒーロー見出し | `<h1>`（トップページ、Heroセクション） |

---

### 2.3 レスポンシブ対応

**モバイル**（640px以下）では、大きな見出しサイズを調整します。

```css
/* モバイル向けの調整例 */
@media (max-width: 640px) {
  h1 {
    font-size: var(--font-size-4xl); /* 48px → 40px */
  }

  h2 {
    font-size: var(--font-size-2xl); /* 32px → 24px */
  }

  h3 {
    font-size: var(--font-size-xl); /* 24px → 20px */
  }
}
```

---

## 3. フォントウェイト

### 3.1 フォントウェイトの定義

```css
--font-weight-normal: 400;    /* 通常 - 本文 */
--font-weight-medium: 500;    /* 中間 - 強調本文、ボタン */
--font-weight-semibold: 600;  /* セミボールド - 小見出し、リンク */
--font-weight-bold: 700;      /* ボールド - 見出し */
--font-weight-extrabold: 800; /* エクストラボールド - ヒーロー見出し */
```

**合計**: 5段階のフォントウェイト

---

### 3.2 各ウェイトの用途

| ウェイト | 変数 | 数値 | 用途 | 例 |
|---------|------|------|------|-----|
| Normal | `--font-weight-normal` | 400 | 通常の本文 | `<p>`, `<li>` |
| Medium | `--font-weight-medium` | 500 | 強調本文、ボタン | `<strong>`, `<button>` |
| Semibold | `--font-weight-semibold` | 600 | 小見出し、リンク | `<h4>`, `<a>` |
| Bold | `--font-weight-bold` | 700 | 見出し | `<h1>`, `<h2>`, `<h3>` |
| Extrabold | `--font-weight-extrabold` | 800 | ヒーロー見出し | Heroセクションの `<h1>` |

---

### 3.3 フォントウェイトの組み合わせ例

**見出し**:
```css
h1 {
  font-size: var(--font-size-4xl); /* 40px */
  font-weight: var(--font-weight-bold); /* 700 */
  line-height: var(--line-height-tight); /* 1.25 */
}

h2 {
  font-size: var(--font-size-3xl); /* 32px */
  font-weight: var(--font-weight-bold); /* 700 */
  line-height: var(--line-height-tight); /* 1.25 */
}

h3 {
  font-size: var(--font-size-2xl); /* 24px */
  font-weight: var(--font-weight-bold); /* 700 */
  line-height: var(--line-height-tight); /* 1.25 */
}
```

**本文**:
```css
p {
  font-size: var(--font-size-md); /* 16px */
  font-weight: var(--font-weight-normal); /* 400 */
  line-height: var(--line-height-normal); /* 1.5 */
}

strong {
  font-weight: var(--font-weight-medium); /* 500 */
}
```

**ボタン**:
```css
button {
  font-size: var(--font-size-md); /* 16px */
  font-weight: var(--font-weight-semibold); /* 600 */
}
```

---

## 4. 行高（Line Height）

### 4.1 行高の定義

```css
--line-height-tight: 1.25;    /* 見出し用 - コンパクト */
--line-height-normal: 1.5;    /* 標準本文 - バランス重視 */
--line-height-relaxed: 1.75;  /* ゆったり - 読みやすさ重視 */
--line-height-loose: 2;       /* 非常にゆったり - 特別な用途 */
```

**合計**: 4段階の行高

---

### 4.2 各行高の用途

| 行高 | 変数 | 数値 | 用途 | 例 |
|-----|------|------|------|-----|
| Tight | `--line-height-tight` | 1.25 | 見出し | `<h1>`, `<h2>`, `<h3>` |
| Normal | `--line-height-normal` | 1.5 | 標準本文 | `<p>`, `<li>` |
| Relaxed | `--line-height-relaxed` | 1.75 | ゆったり本文 | リード文、強調段落 |
| Loose | `--line-height-loose` | 2 | 特別な用途 | 詩、引用文 |

---

### 4.3 行高の選び方

**見出しには tight（1.25）**:
- 見出しは複数行にまたがることが少ないため、コンパクトな行高でOK
- 視覚的な密度を高め、インパクトを与える

**本文には normal（1.5）**:
- 読みやすさとコンパクトさのバランスが取れた標準的な行高
- Web標準（多くのブラウザのデフォルト）に準拠

**リード文には relaxed（1.75）**:
- 長文を読む際の疲労を軽減
- 視線の移動がスムーズになる

---

## 5. Before/After比較

主要な変更点の一覧です。

| 要素 | Before | After | 理由 |
|------|--------|-------|------|
| **body font-family** | システムフォント | Zen Kaku Gothic New | 現代的で読みやすい |
| **body line-height** | 1.8 | 1.5 (--line-height-normal) | 標準的なバランス、より引き締まった印象 |
| **見出しサイズ** | 固定（3rem等） | スケール化（--font-size-*） | 一貫性と拡張性 |
| **見出しウェイト** | bold（暗黙的） | --font-weight-bold（700） | 明示的な定義 |
| **本文サイズ** | 1rem | --font-size-md（1rem） | 変数化で一元管理 |
| **小さな本文** | 0.9rem | --font-size-sm（0.875rem） | より体系的なスケール |

---

## 6. 使用例

### 6.1 見出しスタイル

```css
/* h1 - ヒーロー見出し（トップページ） */
.heroTitle {
  font-size: var(--font-size-5xl); /* 48px */
  font-weight: var(--font-weight-extrabold); /* 800 */
  line-height: var(--line-height-tight); /* 1.25 */
  color: var(--color-text-unpainted); /* 白テキスト */
}

/* h1 - 通常ページ */
h1 {
  font-size: var(--font-size-4xl); /* 40px */
  font-weight: var(--font-weight-bold); /* 700 */
  line-height: var(--line-height-tight); /* 1.25 */
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-6); /* 24px */
}

/* h2 */
h2 {
  font-size: var(--font-size-3xl); /* 32px */
  font-weight: var(--font-weight-bold); /* 700 */
  line-height: var(--line-height-tight); /* 1.25 */
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-4); /* 16px */
}

/* h3 */
h3 {
  font-size: var(--font-size-2xl); /* 24px */
  font-weight: var(--font-weight-bold); /* 700 */
  line-height: var(--line-height-tight); /* 1.25 */
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-3); /* 12px */
}

/* h4 */
h4 {
  font-size: var(--font-size-xl); /* 20px */
  font-weight: var(--font-weight-semibold); /* 600 */
  line-height: var(--line-height-normal); /* 1.5 */
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-2); /* 8px */
}
```

---

### 6.2 本文スタイル

```css
/* 標準本文 */
p {
  font-size: var(--font-size-md); /* 16px */
  font-weight: var(--font-weight-normal); /* 400 */
  line-height: var(--line-height-normal); /* 1.5 */
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-4); /* 16px */
}

/* リード文 */
.lead {
  font-size: var(--font-size-lg); /* 18px */
  font-weight: var(--font-weight-normal); /* 400 */
  line-height: var(--line-height-relaxed); /* 1.75 */
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-6); /* 24px */
}

/* 小さな本文 */
.small {
  font-size: var(--font-size-sm); /* 14px */
  font-weight: var(--font-weight-normal); /* 400 */
  line-height: var(--line-height-normal); /* 1.5 */
  color: var(--color-text-secondary);
}

/* キャプション */
.caption {
  font-size: var(--font-size-xs); /* 12px */
  font-weight: var(--font-weight-normal); /* 400 */
  line-height: var(--line-height-normal); /* 1.5 */
  color: var(--color-text-tertiary);
}
```

---

### 6.3 強調テキスト

```css
/* 強調 */
strong {
  font-weight: var(--font-weight-medium); /* 500 */
  color: var(--color-text-primary);
}

/* より強い強調 */
.emphasis {
  font-weight: var(--font-weight-semibold); /* 600 */
  color: var(--color-primary);
}
```

---

### 6.4 リンクスタイル

```css
a {
  color: var(--color-primary); /* #FF6B6B */
  font-weight: var(--font-weight-medium); /* 500 */
  text-decoration: underline;
  transition: var(--transition-fast);
}

a:hover {
  color: var(--color-primary-dark); /* #E85555 */
  text-decoration: none;
}
```

---

### 6.5 ボタンテキスト

```css
.button {
  font-size: var(--font-size-md); /* 16px */
  font-weight: var(--font-weight-semibold); /* 600 */
  line-height: var(--line-height-normal); /* 1.5 */
  color: var(--color-text-unpainted); /* 白テキスト */
}

/* 大きなボタン */
.buttonLarge {
  font-size: var(--font-size-lg); /* 18px */
  font-weight: var(--font-weight-semibold); /* 600 */
}

/* 小さなボタン */
.buttonSmall {
  font-size: var(--font-size-sm); /* 14px */
  font-weight: var(--font-weight-medium); /* 500 */
}
```

---

### 6.6 レスポンシブ対応例

```css
/* デスクトップ */
.title {
  font-size: var(--font-size-5xl); /* 48px */
}

/* タブレット */
@media (max-width: 920px) {
  .title {
    font-size: var(--font-size-4xl); /* 40px */
  }
}

/* モバイル */
@media (max-width: 640px) {
  .title {
    font-size: var(--font-size-3xl); /* 32px */
  }
}
```

---

## 関連ドキュメント

- **デザインシステムトップ**: [`docs/design.md`](../design.md)
- **カラーシステム**: [`docs/design/color-system.md`](./color-system.md)
- **スペーシング＆レイアウト**: [`docs/design/spacing-layout.md`](./spacing-layout.md)
- **コンポーネントスタイル**: [`docs/design/components.md`](./components.md)
- **実装ガイドライン**: [`docs/design/implementation-guide.md`](./implementation-guide.md)

---

**最終更新日**: 2026-02-22
**作成者**: Claude Code（フリーザ様）
