# カラーシステム詳細

**PLDLデザインシステム - カラーシステム**

[← デザインシステムトップに戻る](../design.md)

色の値の正は `app/globals.css` の `:root`。この文書の値はそれと一致させる。色を変えたら、この文書と [`docs/design.md`](../design.md) のクイックリファレンスも直す。

---

## 目次

- [1. カラーパレット案A（ビビッドポップ）](#1-カラーパレット案aビビッドポップ)
- [2. 互換用の旧変数名](#2-互換用の旧変数名)
- [3. CSS変数の完全定義](#3-css変数の完全定義)
- [4. 使用例](#4-使用例)
- [5. カラーアクセシビリティ](#5-カラーアクセシビリティ)

---

## 1. カラーパレット案A（ビビッドポップ）

明るく活発な印象で、子供たちのエネルギーと遊び心を表現。保護者にも安心感を与えるバランスの取れた配色。

### 1.1 プライマリカラー

**ウォームアンバーオレンジ系** - 温かみと活力のある雰囲気を演出

```css
--color-primary: #f5a623;           /* ウォームアンバーオレンジ - メイン */
--color-primary-light: #f7b84d;     /* ライトアンバー - ホバー時など */
--color-primary-dark: #d48b1a;      /* ダークアンバー - ホバー・アクティブ状態 */
--color-primary-text: #b35c00;      /* バーントオレンジ - 白地の文字用（4.72:1） */
```

`--color-primary` / `-light` / `-dark` は白とのコントラストが 1.76〜2.80:1 で、白地の文字色にも、白い文字の背景にも使えない（[5.1](#51-コントラスト比) を参照）。オレンジの文字が必要なときは `--color-primary-text` を使う。`--color-primary-text` が 4.5:1 を満たすのは、白（`#fff`）と `--color-bg-main`（`#fffef9`）の上だけ。

**用途**:
- `--color-primary`: 帯状のセクションやバッジの背景（フッターの CTA、トップの MissionSection、カテゴリーフィルターの選択中のチップなど）、リンクのホバー時の文字色、ページ遷移のオーバーレイ
- `--color-primary-light`: カテゴリーフィルターのチップのホバー時の枠、事業紹介のフローの矢印
- `--color-primary-dark`: 背景にプライマリを使った要素のホバー時の背景
- `--color-primary-text`: ヘッダーとモバイルメニューの現在地の文字

---

### 1.2 セカンダリカラー

**ターコイズブルー系** - 爽やかさと信頼感を演出

```css
--color-secondary: #4ecdc4;         /* ターコイズブルー - メイン */
--color-secondary-light: #7edad5;   /* ライトターコイズ（現在は未使用） */
--color-secondary-dark: #3bb5ac;    /* ダークターコイズ */
```

**用途**:
- `--color-secondary`: `/support` の支援方法カードの色分け、`/support/material` の見出しの上の飾りの線、ページ遷移のオーバーレイ、グラデーションのヒーローの終点（このヒーローは現在未使用）
- `--color-secondary-dark`: 事業紹介の英語の小見出し

---

### 1.3 ターシャリカラー

**サニーイエロー系** - 明るさと元気を演出

```css
--color-tertiary: #ffe66d;          /* サニーイエロー - メイン */
--color-tertiary-light: #fff09a;    /* ライトイエロー（現在は未使用） */
--color-tertiary-dark: #edd75f;     /* ダークイエロー */
```

**用途**:
- `--color-tertiary`: `/support` の支援方法カードの色分け、`/support/volunteer` の見出しの上の飾りの線と体験談の左の線、ページ遷移のオーバーレイ
- `--color-tertiary-dark`: 事業紹介の見出しの下線、支援方法カードの番号、ボランティアのステップ番号

**注意**: 黄色の背景の上の文字は `--color-text-primary`（`#333`、10.10:1）にする。白い文字は 1.25:1 しかない。

---

### 1.4 アクセントカラー

**追加のアクセントカラー** - バリエーションと多様性を演出

```css
--color-accent-purple: #a78bfa;     /* パープル */
--color-accent-green: #6ee7b7;      /* ミントグリーン（現在は未使用） */
--color-accent-orange: #fdba74;     /* ピーチオレンジ（現在は未使用） */
```

**用途**:
- `--color-accent-purple`: `/support` の支援方法カードの色分け、`/support/donation` の見出しの上の飾りの線、ページ遷移のオーバーレイ

---

### 1.5 背景カラー

**ニュートラル系** - 写真とブランド色を引き立てる、白に近い背景

```css
--color-bg-main: #fffef9;           /* ウォームホワイト - カード */
--color-bg-secondary: #f3f3f3;      /* ライトグレー - セクション背景 */
--color-bg-tertiary: #f9f9f9;       /* オフホワイト - ページの地の色と同じ値 */
--color-bg-code: #fafafa;           /* コード背景 */
```

**ページの地の色**: body の背景は `app/layout.module.css` で `#f9f9f9` を直接指定している。`--color-bg-tertiary` と同じ値だが、変数は参照していない。

**用途**:
- `--color-bg-main`: カード（トップの SNS カード、仲間募集のステップカード、支援方法の詳細ページのカードなど）、withBlob ヒーローの背景
- `--color-bg-secondary`: 交互に並べるセクションの背景（`.sectionAlt`）、メンバー紹介のセクション、フッターの SNS アイコンの背景、記事の前後ナビのホバー時の背景。互換用の `--color-bg-sub` 経由で、カテゴリーのタグ、記事本文の表の見出し、お問い合わせの完了メッセージの背景
- `--color-bg-tertiary`: 記事の前後ナビ、メンバーカードの画像の枠、プライバシーポリシーの問い合わせ先
- `--color-bg-code`: 記事本文のコードブロック

---

### 1.6 テキストカラー

**ダークグレー系** - 可読性を維持しつつ柔らかい印象（実際の値は `app/globals.css`）

```css
--color-text-primary: #333;         /* ダークグレー - メインテキスト */
--color-text-secondary: #666;       /* ミディアムグレー - サブテキスト */
--color-text-tertiary: #6e6e6e;     /* グレー - キャプション */
--color-text-unpainted: #fff;       /* 白テキスト - ダークな背景上 */
--color-text-error: #d32f2f;        /* エラーテキスト */
```

**コントラスト**: 灰色の文字は、サイトでいちばん濃い背景の `--color-bg-secondary`（`#f3f3f3`）の上でも、本文の基準（WCAG 1.4.3 の 4.5:1）を満たす値にしている。

| 変数 | 白（`#fff`） | `#f9f9f9` | `#f3f3f3` |
|---|---|---|---|
| `--color-text-secondary`（`#666`） | 5.74:1 | 5.45:1 | 5.17:1 |
| `--color-text-tertiary`（`#6e6e6e`） | 5.10:1 | 4.84:1 | 4.60:1 |
| `--color-text-error`（`#d32f2f`） | 4.98:1 | 4.73:1 | 4.49:1 |

`#6e6e6e` は、`#f3f3f3` の上で余裕を持って 4.5:1 を超えるグレーのうちいちばん明るい値。これより明るい灰色は、本文の文字には使わない。

`--color-text-error` は `#f3f3f3` の上では 4.5:1 にわずかに届かない。エラー文は白か `#f9f9f9` の上に出す。

**用途**:
- `--color-text-primary`: 本文、見出し
- `--color-text-secondary`: サブテキスト、説明文
- `--color-text-tertiary`: キャプション、補足情報
- `--color-text-unpainted`: 色の付いた背景の上の白い文字。ブランド色の上では基準を満たさない（[5.1](#51-コントラスト比) を参照）
- `--color-text-error`: エラーメッセージ、バリデーション

---

### 1.7 ボーダーカラー

**グレー系** - 境界を明確にしつつ優しい印象

```css
--color-border-dark: #333;          /* ダークボーダー（現在は未使用） */
--color-border: #ddd;               /* 標準ボーダー - 入力欄、チップ、区切り線 */
--color-border-light: #f3f3f3;      /* ライトボーダー - 微細な区切り */
```

**用途**:
- `--color-border`: お問い合わせの入力欄、カテゴリーフィルターのチップ、記事本文の見出しの下線・引用・区切り線、記事の前後ナビと関連記事の上の線
- `--color-border-light`: 活動レポート一覧の区切り、フッターのコピーライトの上の線

**コントラスト**: `--color-border` は白の上で 1.36:1、`#f9f9f9` の上で 1.29:1。入力欄のように、線で部品の範囲を示す用途では WCAG 1.4.11 の 3:1 に届かない（[5.1](#51-コントラスト比) を参照）。

---

### 1.8 ボタンカラー

**ボタン専用のカラー定義**

```css
--color-button-primary: #f5a623;    /* プライマリボタン */
--color-button-secondary: #4ecdc4;  /* セカンダリボタン（現在は未使用） */
```

**用途**:
- `--color-button-primary`: お問い合わせの送信ボタン、ページネーションの現在のページ。どちらも白い文字を載せていて、2.03:1 で基準を満たさない

**`ButtonLink` の色**: `ButtonLink` は色の変数を使わず、値を CSS に直接書いている（primary は `#ff9a56` → `#ffd9a0` のグラデーション、secondary は `#4ecdc4`、outline と text は `#ff6b6b`。dark だけは `--color-text-primary`）。パレットの変数を変えても `ButtonLink` の色は変わらない。

---

### 1.9 その他のカラー

**カレント状態**

```css
--color-current: #fff8e7;           /* カレント状態（現在は未使用） */
```

`#fff8e7` の上の `--color-primary-text` は 4.46:1 で、4.5:1 に届かない。モバイルメニューの現在地に背景色を敷かない理由は [`hero.md`](./hero.md) を参照。

---

## 2. 互換用の旧変数名

古い名前の変数は、新しい変数を参照する別名として残している。新しく書くコードでは参照先の変数を使う。

| 旧変数名 | 参照先 | 値 | 使っている箇所 |
|---|---|---|---|
| `--color-text-main` | `--color-text-primary` | `#333` | なし |
| `--color-text-sub` | `--color-text-secondary` | `#666` | `Article`、`ContactForm` |
| `--color-bg-sub` | `--color-bg-secondary` | `#f3f3f3` | `Article`、`Category`、`ContactForm` |
| `--color-bg-painted` | `--color-primary-dark` | `#d48b1a` | なし |

---

## 3. CSS変数の完全定義

`app/globals.css` の `:root` のうち、色の部分をそのまま抜き出したもの。色の変数が 28 個、互換用の旧変数名が 4 個。

```css
:root {
  /* プライマリカラー */
  --color-primary: #f5a623;
  --color-primary-light: #f7b84d;
  --color-primary-dark: #d48b1a;
  /* 白地の文字に使うオレンジ（コントラスト 4.72:1、WCAG AA） */
  --color-primary-text: #b35c00;

  /* セカンダリカラー（ターコイズブルー） */
  --color-secondary: #4ecdc4;
  --color-secondary-light: #7edad5;
  --color-secondary-dark: #3bb5ac;

  /* ターシャリカラー（サニーイエロー） */
  --color-tertiary: #ffe66d;
  --color-tertiary-light: #fff09a;
  --color-tertiary-dark: #edd75f;

  /* アクセントカラー */
  --color-accent-purple: #a78bfa;
  --color-accent-green: #6ee7b7;
  --color-accent-orange: #fdba74;

  /* 背景カラー（VisionSectionのオレンジ以外と同色） */
  --color-bg-main: #fffef9;
  --color-bg-secondary: #f3f3f3;
  --color-bg-tertiary: #f9f9f9;
  --color-bg-code: #fafafa;

  /* テキストカラー */
  --color-text-primary: #333;
  /* secondary と tertiary は、いちばん濃い背景の --color-bg-secondary（#f3f3f3）の上でも
     本文のコントラスト比 4.5:1 を満たす値にする（#666 は 5.17:1、#6e6e6e は 4.60:1） */
  --color-text-secondary: #666;
  --color-text-tertiary: #6e6e6e;
  --color-text-unpainted: #fff;
  --color-text-error: #d32f2f;

  /* ボーダーカラー */
  --color-border-dark: #333;
  --color-border: #ddd;
  --color-border-light: #f3f3f3;

  /* ボタンカラー */
  --color-button-primary: #f5a623;
  --color-button-secondary: #4ecdc4;
  --color-current: #fff8e7;

  /* 互換性のための旧変数名（既存コンポーネントで使用されている場合のフォールバック） */
  --color-text-main: var(--color-text-primary);
  --color-text-sub: var(--color-text-secondary);
  --color-bg-sub: var(--color-bg-secondary);
  --color-bg-painted: var(--color-primary-dark);
}
```

---

## 4. 使用例

実際のコードから、基準を満たしている使い方を抜き出している。

### 4.1 白地のオレンジの文字（Header の現在地）

```css
/* app/_components/Header/index.module.css */
.navLink[aria-current='page'],
.navLink[aria-current='page']:hover {
  color: var(--color-primary-text); /* #b35c00、白地で 4.72:1 */
  font-weight: 700;
}
```

ヘッダーの背景は白（`#fff`）。オレンジの文字には `--color-primary` ではなく `--color-primary-text` を使う。

---

### 4.2 セクション背景の交互配置（仲間募集ページ）

```css
/* app/recruit/page.module.css */
.section {
  padding: var(--section-gap-lg) 0;
}

.sectionAlt {
  background: var(--color-bg-secondary); /* #f3f3f3 */
}
```

地の色（`#f9f9f9`）のセクションと `#f3f3f3` のセクションを交互に並べる。`/support` の各詳細ページ（skill / material / donation / volunteer）も同じ組み方。`#f3f3f3` の上の文字は、灰色を含めてすべて 4.5:1 を満たす（[1.6](#16-テキストカラー) を参照）。

---

### 4.3 ブランド色での色分け（支援方法カード）

```css
/* app/support/page.module.css */
.secondary .cardTitle::before {
  background: var(--color-secondary); /* #4ecdc4 */
}
```

`/support` の支援方法カードは、primary / secondary / tertiary / accent の 4 色で色分けしている。見出しの前の飾りの線のような文字以外の装飾は、白地との比に関係なくブランド色を使える（WCAG 1.4.3 の対象外。部品の範囲や状態を示す線でなければ 1.4.11 の対象外）。

---

### 4.4 エラー文（ContactForm）

```css
/* app/_components/ContactForm/index.module.css */
.fieldError {
  color: var(--color-text-error); /* #d32f2f */
  font-size: var(--font-size-sm);
  margin-top: 4px;
}
```

エラー文の比は白の上で 4.98:1、`#f9f9f9` の上で 4.73:1。

---

## 5. カラーアクセシビリティ

### 5.1 コントラスト比

基準は WCAG 2.2 AA。文字は 1.4.3（本文 4.5:1、大きい文字 3:1。大きい文字は 24px 以上、または 18.66px 以上の太字）、UI 部品と図形は 1.4.11（3:1）。

**文字（1.4.3）**:

| 背景 | 文字 | コントラスト比 | 本文（4.5:1） | 大きい文字（3:1） |
|---|---|---|---|---|
| `--color-bg-main`（`#fffef9`） | `--color-text-primary`（`#333`） | 12.51:1 | 満たす | 満たす |
| ページの地の色（`#f9f9f9`） | `--color-text-primary`（`#333`） | 12.00:1 | 満たす | 満たす |
| `--color-bg-secondary`（`#f3f3f3`） | `--color-text-primary`（`#333`） | 11.39:1 | 満たす | 満たす |
| 白（`#fff`） | `--color-primary-text`（`#b35c00`） | 4.72:1 | 満たす | 満たす |
| `--color-bg-main`（`#fffef9`） | `--color-primary-text`（`#b35c00`） | 4.68:1 | 満たす | 満たす |
| ページの地の色（`#f9f9f9`） | `--color-primary-text`（`#b35c00`） | 4.48:1 | 満たさない | 満たす |
| `--color-current`（`#fff8e7`） | `--color-primary-text`（`#b35c00`） | 4.46:1 | 満たさない | 満たす |
| `--color-bg-secondary`（`#f3f3f3`） | `--color-primary-text`（`#b35c00`） | 4.26:1 | 満たさない | 満たす |
| `--color-primary`（`#f5a623`） | `--color-text-primary`（`#333`） | 6.23:1 | 満たす | 満たす |
| `--color-primary-dark`（`#d48b1a`） | `--color-text-primary`（`#333`） | 4.52:1 | 満たす | 満たす |
| `--color-secondary`（`#4ecdc4`） | `--color-text-primary`（`#333`） | 6.53:1 | 満たす | 満たす |
| `--color-tertiary`（`#ffe66d`） | `--color-text-primary`（`#333`） | 10.10:1 | 満たす | 満たす |
| `--color-accent-purple`（`#a78bfa`） | `--color-text-primary`（`#333`） | 4.64:1 | 満たす | 満たす |
| `--color-primary`（`#f5a623`） | `--color-text-unpainted`（`#fff`） | 2.03:1 | 満たさない | 満たさない |
| `--color-primary-dark`（`#d48b1a`） | `--color-text-unpainted`（`#fff`） | 2.80:1 | 満たさない | 満たさない |
| `--color-secondary`（`#4ecdc4`） | `--color-text-unpainted`（`#fff`） | 1.93:1 | 満たさない | 満たさない |
| `--color-tertiary`（`#ffe66d`） | `--color-text-unpainted`（`#fff`） | 1.25:1 | 満たさない | 満たさない |
| `--color-accent-purple`（`#a78bfa`） | `--color-text-unpainted`（`#fff`） | 2.72:1 | 満たさない | 満たさない |

灰色の文字とエラー文の比は [1.6](#16-テキストカラー) の表を参照。

ブランド色（primary / secondary / tertiary / accent の各色と、その light / dark）は、どれも白との比が 1.15〜2.80:1 で、大きい文字の 3:1 にも届かない。白い文字をブランド色の上に載せる組み合わせも、ブランド色の文字を白地に置く組み合わせも、文字の大きさにかかわらず基準を満たさない。ブランド色の上の文字は `--color-text-primary` にすると、どの色でも 4.5:1 以上になる。

現在のコードには、ブランド色の上の白い文字（フッターの CTA、カテゴリーフィルターの選択中のチップ、ページネーションの現在のページ、お問い合わせの送信ボタンなど）と、白地のブランド色の文字（支援方法カードの番号など）が残っている。新しく作るときはこの組み合わせを使わない。

**UI 部品・図形（1.4.11）**:

| 背景 | 線・部品の色 | コントラスト比 | 3:1 |
|---|---|---|---|
| 白（`#fff`） | `--color-border`（`#ddd`） | 1.36:1 | 満たさない |
| ページの地の色（`#f9f9f9`） | `--color-border`（`#ddd`） | 1.29:1 | 満たさない |
| 白（`#fff`） | `--color-primary`（`#f5a623`） | 2.03:1 | 満たさない |
| 白（`#fff`） | `--color-primary-text`（`#b35c00`） | 4.72:1 | 満たす |
| 白（`#fff`） | `--color-text-primary`（`#333`） | 12.63:1 | 満たす |

1.4.11 が 3:1 を求めるのは、入力欄の枠やフォーカスリングのように、部品の範囲や状態を見分けるのに必要な線。区切り線のような装飾には求めない。お問い合わせの入力欄の枠（`--color-border`）と、モバイルメニューのフォーカスリング（`--color-primary`）は、現在この基準に届いていない。

---

### 5.2 色覚多様性への配慮

**カラーユニバーサルデザイン**:

- **プライマリ**（ウォームアンバーオレンジ）と**セカンダリ**（ターコイズブルー）は、色覚多様性のある方にも区別しやすい組み合わせ。
- **ターシャリ**（サニーイエロー）は明度が高いため、補助的な情報にのみ使用。
- カテゴリタグなど、色だけで情報を伝えている場合は、アイコンやラベルを併記することを推奨。

---

### 5.3 基準を満たす組み合わせ・満たさない組み合わせ

**満たす組み合わせ**:

```css
/* 淡い背景に濃い文字（11.39〜12.51:1） */
background: var(--color-bg-secondary);
color: var(--color-text-primary);

/* 白地にオレンジの文字（4.72:1） */
background: #fff;
color: var(--color-primary-text);

/* ブランド色の背景に濃い文字（4.52〜10.10:1） */
background: var(--color-tertiary);
color: var(--color-text-primary);
```

**満たさない組み合わせ**:

```css
/* NG: ブランド色の背景に白い文字（1.25〜2.80:1） */
background: var(--color-primary);
color: var(--color-text-unpainted);

/* NG: 白地にブランド色の文字（1.15〜2.80:1） */
background: #fff;
color: var(--color-secondary);

/* NG: 灰色や地の色の背景にオレンジの文字（4.26〜4.48:1） */
background: var(--color-bg-secondary);
color: var(--color-primary-text);

/* NG: 入力欄を --color-border の枠だけで示す（1.36:1） */
border: 1px solid var(--color-border);
```

---

## 関連ドキュメント

- **デザインシステムトップ**: [`docs/design.md`](../design.md)
- **タイポグラフィ**: [`docs/design/typography.md`](./typography.md)
- **スペーシング＆レイアウト**: [`docs/design/spacing-layout.md`](./spacing-layout.md)
- **コンポーネントスタイル**: [`docs/design/components.md`](./components.md)
- **ヒーローとヘッダー**: [`docs/design/hero.md`](./hero.md)
- **実装ガイドライン**: [`docs/design/implementation-guide.md`](./implementation-guide.md)

---

**最終更新日**: 2026-11-28
**作成者**: Claude Code（フリーザ様）
