# PLDLデザインシステム

**最終更新日**: 2026-11-28

---

## 目次

- [1. プロジェクト概要](#1-プロジェクト概要)
- [2. デザインコンセプト](#2-デザインコンセプト)
- [3. クイックリファレンス](#3-クイックリファレンス)
- [4. 詳細ドキュメント](#4-詳細ドキュメント)
- [5. 実装のルール](#5-実装のルール)

---

## 1. プロジェクト概要

### PLDLについて

**PLDL（Playful Learning Design Lab.）** は「放課後こどもラボ」として、子供たちが遊びを通じて学ぶ体験を提供するサービスです。

### このドキュメントについて

デザインシステムの入口として、コンセプト、よく使う変数、詳細ドキュメントへのリンクをまとめる。

変数はすべて `app/globals.css` の `:root` で定義している。値が食い違ったときは `app/globals.css` が正しい。

---

## 2. デザインコンセプト

**「楽しく・ポップで、保護者と子供の両方が親しめるデザイン」**

### ターゲットユーザー

- **保護者**: 信頼感と安心感を求める
- **子供**: 明るく楽しい体験を求める

### トーン＆マナー

- 明るく元気で、遊び心のあるデザイン
- カラフルで親しみやすく、安心感を与える
- 現代的で読みやすいタイポグラフィ
- インタラクティブで楽しいアニメーション

### カラーパレット: 案A（ビビッドポップ）★★★★★ 採用

明るく活発な印象で、子供たちのエネルギーと遊び心を表現。保護者にも安心感を与えるバランスの取れた配色。

#### メインカラー

- **プライマリ**: `#F5A623`（ウォームアンバーオレンジ）- 温かみと活力
- **セカンダリ**: `#4ECDC4`（ターコイズブルー）- 爽やかさと信頼感
- **ターシャリ**: `#FFE66D`（サニーイエロー）- 明るさと元気

#### アクセントカラー

- **パープル**: `#A78BFA`
- **ミントグリーン**: `#6EE7B7`
- **ピーチオレンジ**: `#FDBA74`

---

## 3. クイックリファレンス

デザイン作業で頻繁に使用する変数の一覧です。すべての変数は `app/globals.css` の `:root` を見る。

### 基本カラー（よく使う）

```css
/* メインカラー */
--color-primary: #F5A623;           /* ウォームアンバーオレンジ */
--color-secondary: #4ECDC4;         /* ターコイズブルー */
--color-tertiary: #FFE66D;          /* サニーイエロー */

/* 背景 */
--color-bg-main: #FFFEF9;           /* ウォームホワイト */
--color-bg-secondary: #f3f3f3;      /* ライトグレー */

/* テキスト */
--color-text-primary: #333;         /* ダークグレー */
--color-text-secondary: #666;       /* ミディアムグレー（#f3f3f3 の上でも 4.5:1 を満たす） */
--color-text-unpainted: #FFFFFF;    /* 白テキスト */

/* ボタン */
--color-button-primary: #F5A623;    /* プライマリボタン */
--color-button-secondary: #4ECDC4;  /* セカンダリボタン */
```

### フォント

```css
--font-sans: 'Zen Kaku Gothic New', 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', -apple-system,
  BlinkMacSystemFont, sans-serif;                                /* 本文・UI */
--font-display: var(--font-display-loaded, 'LINE Seed JP'), var(--font-sans); /* 見出し */
```

### フォントサイズ

```css
--font-size-xs: 0.875rem;     /* 14px - キャプション、ラベル、日付 */
--font-size-sm: 1rem;         /* 16px - 標準本文、ナビ、ボタン */
--font-size-md: 1.125rem;     /* 18px - リード文、説明文 */
--font-size-lg: 1.25rem;      /* 20px - 小見出し、強めの説明文 */
--font-size-xl: 1.5rem;       /* 24px - カードや小さなセクションの見出し */
--font-size-2xl: 1.75rem;     /* 28px - セクション見出し */
--font-size-3xl: 2rem;        /* 32px - 大見出し */
--font-size-4xl: 2.5rem;      /* 40px - バナーのページ見出し */
--font-size-5xl: 3rem;        /* 48px - ヒーロー見出し、記事タイトル */
```

標準本文は `--font-size-sm`（16px）。`--font-size-md` は 18px なので、本文のつもりで使うと一回り大きくなる。

### フォントウェイト・行高

```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;

--line-height-tight: 1.25;    /* 見出し */
--line-height-normal: 1.8;    /* 標準本文（body と同じ） */
--line-height-relaxed: 1.75;  /* 説明文・リード文 */
--line-height-loose: 2;       /* 特別にゆったりさせる箇所 */
```

`--line-height-normal`（1.8）は `--line-height-relaxed`（1.75）より大きい。名前の順と値の順が逆になっている。

### ボーダー半径

```css
--border-radius-sm: 8px;      /* 小 - ボタン、バッジ */
--border-radius: 12px;        /* 標準 - カード、入力フィールド */
--border-radius-lg: 16px;     /* 大 - 大型カード */
--border-radius-xl: 24px;     /* 特大 - 特別なセクション */
--border-radius-full: 9999px; /* 円形 - アバター、ピル型 */
```

### スペーシング（よく使う）

```css
--spacing-2: 8px;      /* 0.5rem */
--spacing-3: 12px;     /* 0.75rem */
--spacing-4: 16px;     /* 1rem */
--spacing-6: 24px;     /* 1.5rem */
--spacing-8: 32px;     /* 2rem */
--spacing-10: 40px;    /* 2.5rem */
--spacing-16: 64px;    /* 4rem */
--spacing-20: 80px;    /* 5rem */

/* セクション間隔 */
--section-gap-sm: var(--spacing-10);   /* 40px */
--section-gap-md: var(--spacing-16);   /* 64px */
--section-gap-lg: var(--spacing-20);   /* 80px */
--section-gap-xl: var(--spacing-24);   /* 96px */
```

### シャドウ（よく使う）

```css
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);

/* カラフルシャドウ */
--shadow-primary-sm: 0 2px 8px rgba(245, 166, 35, 0.2);
--shadow-primary-md: 0 4px 16px rgba(245, 166, 35, 0.25);
```

### トランジション

```css
--transition-fast: 150ms ease;                            /* ホバー効果 */
--transition-base: 300ms ease;                            /* 標準アニメーション */
--transition-slow: 500ms ease;                            /* ゆっくりとした変化 */
--transition-page: 350ms cubic-bezier(0.22, 1, 0.36, 1);  /* ページ遷移（app/template.module.css） */
```

---

## 4. 詳細ドキュメント

デザインシステムの各要素について、詳細は以下のドキュメントを参照してください。

### 4.1 カラーシステム

**ファイル**: [`docs/design/color-system.md`](./design/color-system.md)

**内容**:
- カラーパレット案A（ビビッドポップ）の全変数定義
- プライマリ、セカンダリ、ターシャリ、アクセントカラー
- 背景カラー、テキストカラー、ボーダーカラー
- 既存変数とのマッピング表
- 使用例（ButtonLink、Hero、Category）

**こんなときに参照**:
- 新しいカラー変数を追加する
- 既存の色を変更する
- カテゴリタグやボタンの色分けをする

---

### 4.2 タイポグラフィ

**ファイル**: [`docs/design/typography.md`](./design/typography.md)

**内容**:
- フォントファミリー（Zen Kaku Gothic New、見出しの LINE Seed JP、`next/font` での読み込み）
- フォントサイズスケール（9段階）と各サイズの用途
- フォントウェイト（5段階）
- 行高（4段階）

**こんなときに参照**:
- 見出しのサイズを決める
- 本文のフォントを調整する
- フォントウェイトを選ぶ

---

### 4.3 スペーシング＆レイアウト

**ファイル**: [`docs/design/spacing-layout.md`](./design/spacing-layout.md)

**内容**:
- スペーシングスケール（13段階、4の倍数ベース）
- セクション間隔変数
- コンテナ幅
- レスポンシブブレークポイント
- グリッドシステム例（2カラム、3カラム）

**こんなときに参照**:
- 要素間の余白を決める
- コンテナ幅を設定する
- グリッドレイアウトを作成する

---

### 4.4 コンポーネントスタイル

**ファイル**: [`docs/design/components.md`](./design/components.md)

**内容**:
- ボーダー半径（5段階）
- シャドウシステム（標準シャドウ、カラフルシャドウ）
- トランジション（4種類）
- カードスタイルバリエーション（default, accent, elevated）
- ボタンスタイル、入力フィールドスタイル
- フォーカスリング

**こんなときに参照**:
- カードデザインを作成する
- ホバー効果を追加する
- シャドウを適用する
- フォーカスの表示を付ける

---

### 4.5 ヒーローとヘッダーロゴ

**ファイル**: [`docs/design/hero.md`](./design/hero.md)

**内容**:
- ヒーローの種類と使っているページ
- withBlob の構成（写真とタイトルの縦積み、100svh）
- 写真の切り抜き位置とヘッダーの重なり（`--hero-header-overlap`）
- ヘッダーのロゴの寸法指定

**こんなときに参照**:
- ヒーローやヘッダーの見た目を変える
- ヒーローの写真を差し替える

---

### 4.6 画像＆イラスト

**ファイル**: [`docs/design/assets-images.md`](./design/assets-images.md)

**内容**:
- 写真スタイルガイドライン
- イラストスタイルガイドライン
- 推奨リソース（unDraw、Storyset、Phosphor Icons等）
- 画像最適化ガイドライン

**こんなときに参照**:
- 新しい画像を追加する
- イラスト素材を探す
- 画像スタイルを統一する

---

## 5. 実装のルール

### CSS変数を使う

色・文字サイズ・余白・角丸・シャドウ・トランジションは、固定値を書かずに `app/globals.css` の変数を使う。新しい値が要るときは `:root` に変数を足し、本ドキュメントと該当する詳細ドキュメントも更新する。

### レスポンシブ

すべてのコンポーネントを、モバイル・タブレット・デスクトップで確かめる。ブレークポイントは [`docs/design/spacing-layout.md`](./design/spacing-layout.md) を見る。

### アクセシビリティ

- **文字のコントラスト**: 本文は背景に対して 4.5:1 以上（[`docs/design/color-system.md`](./design/color-system.md)）
- **フォーカスの表示**: キーボード操作で、フォーカスしている要素が見えること（[`docs/design/components.md`](./design/components.md#7-フォーカスリング)）
- **キーボード操作**: すべての操作をキーボードで実行できること
- **スクリーンリーダー**: 適切な HTML セマンティクスを使うこと

---

## 関連ドキュメント

- **プロジェクトルール**: [`CLAUDE.md`](../CLAUDE.md)
- **ドキュメント一覧**: [`docs/INDEX.md`](./INDEX.md)
- **元の詳細プラン**: [`docs/design/design-system.md`](./design/design-system.md)（参考用）
- **導入時の段階的実装の計画**: [`docs/design/implementation-guide.md`](./design/implementation-guide.md)（参考用。値は導入前の計画のもので、現在の実装とは異なる）

---

**最終更新日**: 2026-11-28
**作成者**: Claude Code（フリーザ様）
