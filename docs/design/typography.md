# タイポグラフィ詳細

**PLDLデザインシステム - タイポグラフィ**

[← デザインシステムトップに戻る](../design.md)

---

## 目次

- [1. フォントファミリー](#1-フォントファミリー)
- [2. フォントサイズスケール](#2-フォントサイズスケール)
- [3. フォントウェイト](#3-フォントウェイト)
- [4. 行高（Line Height）](#4-行高line-height)
- [5. 使用例](#5-使用例)

変数はすべて `app/globals.css` の `:root` で定義している。値が食い違ったときは `app/globals.css` が正しい。

---

## 1. フォントファミリー

### 1.1 本文: Zen Kaku Gothic New

本文と UI には **Google Fonts** の「**Zen Kaku Gothic New**」を使う。

```css
--font-sans:
  'Zen Kaku Gothic New', 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', -apple-system,
  BlinkMacSystemFont, sans-serif;
```

**読み込み**: `app/layout.tsx` で `next/font/google` の `Zen_Kaku_Gothic_New` を読み込み（ウェイト 400 / 500 / 700、`display: 'swap'`）、`variable: '--font-sans'` で割り当てる。Google Fonts の `<link>` は書かない。

---

### 1.2 見出し: LINE Seed JP

見出し、英字の小見出し（`subEn` など）、番号には「**LINE Seed JP**」を使う。

```css
--font-display: var(--font-display-loaded, 'LINE Seed JP'), var(--font-sans);
```

**読み込み**: `app/layout.tsx` で `next/font/google` の `LINE_Seed_JP` を読み込み（ウェイト 400 / 700）、`--font-display-loaded` に割り当てる。next/font に LINE Seed JP のフォントメトリクスが無く、フォールバックを自動で作れないため、`fallback: []` と `adjustFontFallback: false` を指定し、フォールバックは `--font-display` の `var(--font-sans)` に任せる。

---

### 1.3 等幅フォント（コード表示用）

```css
--font-mono:
  ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono', 'Roboto Mono', 'Oxygen Mono',
  'Ubuntu Monospace', 'Source Code Pro', 'Fira Mono', 'Droid Sans Mono', 'Courier New', monospace;
```

**用途**: コードブロック（`<code>`, `<pre>`）

---

## 2. フォントサイズスケール

### 2.1 フォントサイズの定義

```css
--font-size-xs: 0.875rem;     /* 14px */
--font-size-sm: 1rem;         /* 16px */
--font-size-md: 1.125rem;     /* 18px */
--font-size-lg: 1.25rem;      /* 20px */
--font-size-xl: 1.5rem;       /* 24px */
--font-size-2xl: 1.75rem;     /* 28px */
--font-size-3xl: 2rem;        /* 32px */
--font-size-4xl: 2.5rem;      /* 40px */
--font-size-5xl: 3rem;        /* 48px */
```

**合計**: 9段階のフォントサイズ

標準本文は `--font-size-sm`（16px）。`--font-size-md` は 18px なので、本文のつもりで使うと一回り大きくなる。14px より小さい変数は無い。

---

### 2.2 各サイズの用途

| サイズ | 変数 | px値 | 用途 | 使っている箇所の例 |
|-------|------|------|------|-----|
| XS | `--font-size-xs` | 14px | キャプション、ラベル、日付 | 記事の画像キャプション、カテゴリのチップ、関連記事の日付 |
| SM | `--font-size-sm` | 16px | 標準本文、ナビ、ボタン | ヘッダー・フッターのナビ、`ButtonLink` |
| MD | `--font-size-md` | 18px | リード文、説明文 | Vision / Mission の説明、活動カードの説明、記事一覧のタイトル |
| LG | `--font-size-lg` | 20px | 小見出し、強めの説明文 | 記事本文の `<h4>`、プライバシーポリシーの見出し、活動レポートの説明 |
| XL | `--font-size-xl` | 24px | カードや小さなセクションの見出し | 記事本文の `<h3>`、関連記事の見出し、ヒーローのサブタイトル |
| 2XL | `--font-size-2xl` | 28px | セクション見出し | 記事本文の `<h2>`、各ページの `sectionTitle` |
| 3XL | `--font-size-3xl` | 32px | 大見出し | 記事本文の `<h1>`、768px 以下のヒーロー見出し |
| 4XL | `--font-size-4xl` | 40px | バナーのページ見出し | ヒーロー（banner）の見出し |
| 5XL | `--font-size-5xl` | 48px | ヒーロー見出し、記事タイトル | ヒーロー（withBlob・グラデーション）の見出し、記事のタイトル、Vision / Mission の英字見出し |

---

### 2.3 レスポンシブ対応

大きな見出しは、768px 以下で1〜2段小さくする。

```css
/* app/_components/Hero/index.module.css */
.title {
  font-size: var(--font-size-5xl); /* 48px */
}

@media (max-width: 768px) {
  .title {
    font-size: var(--font-size-3xl); /* 32px */
  }
}
```

画面幅に合わせて連続的に変えたいときは `clamp()` で変数を上下限に使う。

```css
/* app/about/page.module.css などのセクション見出し */
.recruitHeading {
  font-size: clamp(var(--font-size-2xl), 3vw, var(--font-size-4xl)); /* 28px〜40px */
}
```

---

## 3. フォントウェイト

### 3.1 フォントウェイトの定義

```css
--font-weight-normal: 400;    /* 通常 - 本文 */
--font-weight-medium: 500;    /* 中間 - 強調本文、サブタイトル */
--font-weight-semibold: 600;  /* セミボールド - 小見出し、ラベル */
--font-weight-bold: 700;      /* ボールド - 見出し */
--font-weight-extrabold: 800; /* エクストラボールド - 特に目立たせる見出し、番号 */
```

**合計**: 5段階のフォントウェイト

**注意**: 読み込んでいるウェイトは、Zen Kaku Gothic New が 400 / 500 / 700、LINE Seed JP が 400 / 700 だけ。600 と 800 を指定すると、ブラウザは読み込み済みのうち近い 700 で表示する。600 と 700 の差、700 と 800 の差は画面に出ない。

---

### 3.2 各ウェイトの用途

| ウェイト | 変数 | 数値 | 用途 |
|---------|------|------|------|
| Normal | `--font-weight-normal` | 400 | 本文 |
| Medium | `--font-weight-medium` | 500 | 強調本文、ヒーローのサブタイトル |
| Semibold | `--font-weight-semibold` | 600 | 小見出し、ナビのグループ名、英字の小見出し |
| Bold | `--font-weight-bold` | 700 | 見出し |
| Extrabold | `--font-weight-extrabold` | 800 | 特に目立たせる見出し、番号（ショーケースのヒーロー見出し、支援ページの番号） |

---

## 4. 行高（Line Height）

### 4.1 行高の定義

```css
--line-height-tight: 1.25;    /* 見出し */
--line-height-normal: 1.8;    /* 標準本文 */
--line-height-relaxed: 1.75;  /* 説明文、リード文 */
--line-height-loose: 2;       /* 特別にゆったりさせる箇所 */
```

**合計**: 4段階の行高

`body` の行高は `app/globals.css` で `1.8`（`--line-height-normal` と同じ値）。`--line-height-normal`（1.8）は `--line-height-relaxed`（1.75）より大きく、名前の順と値の順が逆になっている。

---

### 4.2 各行高の用途

| 行高 | 変数 | 数値 | 用途 | 使っている箇所の例 |
|-----|------|------|------|-----|
| Tight | `--line-height-tight` | 1.25 | 見出し | ヒーローの見出し、各ページのセクション見出し |
| Normal | `--line-height-normal` | 1.8 | 標準本文 | プライバシーポリシーの本文、メンバー紹介の説明 |
| Relaxed | `--line-height-relaxed` | 1.75 | 説明文、リード文 | ヒーローのサブタイトル、事業カードの説明 |
| Loose | `--line-height-loose` | 2 | 特別にゆったりさせる箇所 | 法人紹介の代表メッセージ |

---

## 5. 使用例

### 5.1 記事本文の見出し

microCMS のリッチテキストで書いた記事本文の見出しは、`app/_components/Article/index.module.css` で次のサイズにしている（640px より広い画面）。

| 要素 | 変数 | px値 |
|------|------|------|
| 記事のタイトル（`.title`） | `--font-size-5xl` | 48px |
| `<h1>` | `--font-size-3xl` | 32px |
| `<h2>` | `--font-size-2xl` | 28px |
| `<h3>` | `--font-size-xl` | 24px |
| `<h4>` | `--font-size-lg` | 20px |
| `<h5>` | `--font-size-md` | 18px |

---

### 5.2 ヒーローの見出しとサブタイトル

```css
/* app/_components/Hero/index.module.css */
.title {
  font-size: var(--font-size-5xl); /* 48px */
  font-weight: var(--font-weight-bold); /* 700 */
  line-height: var(--line-height-tight); /* 1.25 */
  margin-bottom: var(--spacing-4);
}

.sub {
  font-size: var(--font-size-xl); /* 24px */
  font-weight: var(--font-weight-medium); /* 500 */
  line-height: var(--line-height-relaxed); /* 1.75 */
  margin-bottom: var(--spacing-8);
}
```

---

### 5.3 本文と説明文

```css
/* 標準本文 */
.text {
  font-size: var(--font-size-sm); /* 16px */
  line-height: var(--line-height-normal); /* 1.8 */
  color: var(--color-text-primary);
}

/* リード文・説明文 */
.description {
  font-size: var(--font-size-md); /* 18px */
  line-height: var(--line-height-relaxed); /* 1.75 */
  color: var(--color-text-secondary);
}

/* キャプション */
.caption {
  font-size: var(--font-size-xs); /* 14px */
  color: var(--color-text-tertiary);
}
```

---

## 関連ドキュメント

- **デザインシステムトップ**: [`docs/design.md`](../design.md)
- **カラーシステム**: [`docs/design/color-system.md`](./color-system.md)
- **スペーシング＆レイアウト**: [`docs/design/spacing-layout.md`](./spacing-layout.md)
- **コンポーネントスタイル**: [`docs/design/components.md`](./components.md)

---

**最終更新日**: 2026-11-28
**作成者**: Claude Code（フリーザ様）
