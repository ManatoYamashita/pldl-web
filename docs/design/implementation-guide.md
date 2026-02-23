# 実装ガイドライン

**PLDLデザインシステム - 実装ガイドライン**

[← デザインシステムトップに戻る](../design.md)

---

## 目次

- [1. 段階的実装の概要](#1-段階的実装の概要)
- [2. フェーズ1: 基礎カラーシステム](#2-フェーズ1-基礎カラーシステム)
- [3. フェーズ2: タイポグラフィシステム](#3-フェーズ2-タイポグラフィシステム)
- [4. フェーズ3: スペーシングシステム](#4-フェーズ3-スペーシングシステム)
- [5. フェーズ4: 主要コンポーネント](#5-フェーズ4-主要コンポーネント)
- [6. フェーズ5-8: その他の実装](#6-フェーズ5-8-その他の実装)
- [7. 段階的デプロイ戦略](#7-段階的デプロイ戦略)
- [8. Before/Afterコード例](#8-beforeafterコード例)

---

## 1. 段階的実装の概要

### 1.1 基本方針

すべてを一度に変更せず、**段階的にデプロイして確認**します。これにより:

- 問題の早期発見
- 影響範囲の限定
- ユーザーフィードバックの取得
- 安全なロールバック

---

### 1.2 実装フェーズ一覧

| フェーズ | 内容 | 優先度 | 所要時間 | デプロイ |
|---------|------|--------|----------|---------|
| **フェーズ1** | 基礎カラーシステム | ★★★★★ | 1-2時間 | 第1回 |
| **フェーズ2** | タイポグラフィシステム | ★★★★☆ | 1時間 | 第1回 |
| **フェーズ3** | スペーシングシステム | ★★★★☆ | 30分 | 第1回 |
| **フェーズ4** | 主要コンポーネント | ★★★★★ | 3-4時間 | 第2回 |
| **フェーズ5** | ページレイアウト | ★★★★☆ | 4-6時間 | 第3回 |
| **フェーズ6** | ニュース/ブログ | ★★★☆☆ | 2-3時間 | 第3回 |
| **フェーズ7** | 細部の調整 | ★★★☆☆ | 3-4時間 | 第3回 |
| **フェーズ8** | 画像・アセット | ★★★☆☆ | 変動 | 第4回 |

**合計**: 約15-23時間（フェーズ1-7）

---

### 1.3 推奨の実装順序

1. **フェーズ1-3**: 基礎システム（2.5-3.5時間）→ **第1回デプロイ**
2. **フェーズ4**: 主要コンポーネント（3-4時間）→ **第2回デプロイ**
3. **フェーズ5-7**: ページ・詳細（9-13時間）→ **第3回デプロイ（最終）**
4. **フェーズ8**: 画像・アセット（変動）→ **第4回デプロイ（オプション）**

---

## 2. フェーズ1: 基礎カラーシステム

### 2.1 目的

CSS変数を全面刷新し、新しいカラーパレット（案A: ビビッドポップ）を適用する。

---

### 2.2 対象ファイル

- `app/globals.css`

---

### 2.3 実装内容

#### 1. カラー変数の全面刷新

既存の13個の変数を、案A（ビビッドポップ）の27個の変数に置き換える。

**追加する変数**:
- プライマリカラー（3個）
- セカンダリカラー（3個）
- ターシャリカラー（3個）
- アクセントカラー（3個）
- 背景カラー（4個）
- テキストカラー（5個）
- ボーダーカラー（3個）
- ボタンカラー（2個）
- その他（1個）

#### 2. border-radiusの変更

`--border-radius: 4px` → `--border-radius: 12px`

追加:
- `--border-radius-sm: 8px`
- `--border-radius-lg: 16px`
- `--border-radius-xl: 24px`
- `--border-radius-full: 9999px`

#### 3. フォントファミリーの変更

**Google Fontsのリンクを追加**（`app/layout.tsx`）:

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

**globals.cssのbodyを更新**:

```css
body {
  font-family: 'Zen Kaku Gothic New', 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

---

### 2.4 実装チェックリスト

- [ ] `app/globals.css` の `:root` セクションに27個の新変数を追加
- [ ] 既存の13個の変数を新しい値に更新（マッピング表参照: [`color-system.md`](./color-system.md#2-既存変数とのマッピング)）
- [ ] `--border-radius-sm`, `-lg`, `-xl`, `-full` を追加
- [ ] `app/layout.tsx` に Google Fonts リンクを追加（Zen Kaku Gothic New）
- [ ] body の `font-family` を更新
- [ ] ローカル環境で確認（`pnpm dev`）
- [ ] 視覚的変化を確認（特にボタン、背景、ボーダー）

---

### 2.5 所要時間

**1-2時間**

---

### 2.6 検証ポイント

- トップページのボタンがコーラルレッド（#FF6B6B）になっているか
- 背景がウォームホワイト（#FFFEF9）になっているか
- border-radiusが12pxに変更され、角が丸くなっているか
- フォントが「Zen Kaku Gothic New」に変更されているか（DevToolsで確認）

---

### 2.7 Before/Afterコード例

**Before**:
```css
:root {
  --color-text-main: #333;
  --color-bg-main: #fff;
  --color-button-primary: #333;
  --border-radius: 4px;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', YuGothic, ...;
}
```

**After**:
```css
:root {
  /* プライマリカラー */
  --color-primary: #FF6B6B;
  --color-primary-light: #FF8E8E;
  --color-primary-dark: #E85555;

  /* セカンダリカラー */
  --color-secondary: #4ECDC4;
  --color-secondary-light: #7EDAD5;
  --color-secondary-dark: #3BB5AC;

  /* 背景カラー */
  --color-bg-main: #FFFEF9;
  --color-bg-secondary: #FFF8E7;

  /* テキストカラー */
  --color-text-primary: #2D3748;
  --color-text-secondary: #718096;

  /* ボタンカラー */
  --color-button-primary: #FF6B6B;

  /* ボーダー半径 */
  --border-radius: 12px;
  --border-radius-sm: 8px;
  --border-radius-lg: 16px;
  /* ...その他の変数 */
}

body {
  font-family: 'Zen Kaku Gothic New', 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

**完全なコード**: [`color-system.md`](./color-system.md#3-css変数の完全定義)

---

## 3. フェーズ2: タイポグラフィシステム

### 3.1 目的

フォントサイズ、ウェイト、行高を変数化し、一貫性を確保する。

---

### 3.2 対象ファイル

- `app/globals.css`

---

### 3.3 実装内容

#### 1. フォントサイズスケールの追加

`--font-size-xs` から `--font-size-5xl` まで9段階。

```css
/* フォントサイズ */
--font-size-xs: 0.75rem;      /* 12px */
--font-size-sm: 0.875rem;     /* 14px */
--font-size-md: 1rem;         /* 16px */
--font-size-lg: 1.125rem;     /* 18px */
--font-size-xl: 1.25rem;      /* 20px */
--font-size-2xl: 1.5rem;      /* 24px */
--font-size-3xl: 2rem;        /* 32px */
--font-size-4xl: 2.5rem;      /* 40px */
--font-size-5xl: 3rem;        /* 48px */
```

#### 2. フォントウェイトの変数化

`--font-weight-normal` から `--font-weight-extrabold` まで5段階。

```css
/* フォントウェイト */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
```

#### 3. 行高の変数化

`--line-height-tight` から `--line-height-loose` まで4段階。

```css
/* 行高 */
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
--line-height-loose: 2;
```

#### 4. bodyの行高を変更

```css
body {
  line-height: var(--line-height-normal); /* 1.5（従来は1.8） */
}
```

---

### 3.4 実装チェックリスト

- [ ] フォントサイズ変数9個を `app/globals.css` に追加
- [ ] フォントウェイト変数5個を追加
- [ ] 行高変数4個を追加
- [ ] bodyの `line-height` を 1.8 → `var(--line-height-normal)` (1.5) に変更
- [ ] ローカル環境で確認

---

### 3.5 所要時間

**1時間**

---

### 3.6 検証ポイント

- bodyの行高が1.5になっているか
- 変数が正しく定義されているか（DevToolsで確認）

---

## 4. フェーズ3: スペーシングシステム

### 4.1 目的

スペーシング変数を追加し、固定値を変数化する。

---

### 4.2 対象ファイル

- `app/globals.css`

---

### 4.3 実装内容

#### 1. スペーシング変数の追加

`--spacing-1` (4px) から `--spacing-32` (128px) まで13段階。

```css
/* スペーシング */
--spacing-1: 4px;
--spacing-2: 8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-5: 20px;
--spacing-6: 24px;
--spacing-8: 32px;
--spacing-10: 40px;
--spacing-12: 48px;
--spacing-16: 64px;
--spacing-20: 80px;
--spacing-24: 96px;
--spacing-32: 128px;
```

#### 2. セクション間隔変数の追加

```css
/* セクション間隔 */
--section-gap-sm: var(--spacing-10);   /* 40px */
--section-gap-md: var(--spacing-16);   /* 64px */
--section-gap-lg: var(--spacing-20);   /* 80px */
--section-gap-xl: var(--spacing-24);   /* 96px */
```

#### 3. コンテナ幅変数の追加

```css
/* コンテナ幅 */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
```

---

### 4.4 実装チェックリスト

- [ ] スペーシング変数13個を追加
- [ ] セクション間隔変数4個を追加
- [ ] コンテナ幅変数4個を追加
- [ ] ローカル環境で確認

---

### 4.5 所要時間

**30分**

---

### 4.6 検証ポイント

- 変数が正しく定義されているか（DevToolsで確認）

---

## 5. フェーズ4: 主要コンポーネント

### 5.1 目的

Header, Hero, ButtonLink, Footerをカラフルでポップなデザインに変更する。

---

### 5.2 対象ファイル

- `app/_components/Header/index.module.css`
- `app/_components/Hero/index.module.css`
- `app/_components/ButtonLink/index.module.css`
- `app/_components/Footer/index.module.css`

---

### 5.3 実装内容

#### 1. Header

- 背景を白からウォームホワイトに
- ホバー時にプライマリカラーを表示
- シャドウを追加して浮遊感を演出

#### 2. Hero

- 背景にグラデーション適用（プライマリ → セカンダリ）
- タイトルのフォントサイズを `--font-size-5xl` に
- ボーダー半径を `--border-radius-lg` に

#### 3. ButtonLink

- プライマリボタンにコーラルレッド
- セカンダリボタンにターコイズブルー
- ホバー時にシャドウとトランスフォーム効果
- `border-radius: var(--border-radius-sm)` (8px)

#### 4. Footer

- 背景を暗い色からプライマリカラーに
- テキストを白に
- リンクにホバー効果

---

### 5.4 実装チェックリスト

- [ ] `Header/index.module.css` を更新
- [ ] `Hero/index.module.css` を更新（グラデーション背景）
- [ ] `ButtonLink/index.module.css` を更新（カラフルボタン）
- [ ] `Footer/index.module.css` を更新
- [ ] ローカル環境で確認
- [ ] 各コンポーネントの視覚変化を確認

---

### 5.5 所要時間

**3-4時間**

---

### 5.6 検証ポイント

- Heroセクションにグラデーション背景が表示されているか
- ボタンがカラフルになっているか
- ホバー時にアニメーション効果が発生するか

---

### 5.7 Before/Afterコード例

詳細は「[8. Before/Afterコード例](#8-beforeafterコード例)」を参照。

---

## 6. フェーズ5-8: その他の実装

### 6.1 フェーズ5: ページレイアウトの更新

**目的**: 各ページのレイアウトをカラフルで楽しいデザインに変更する。

**対象ファイル**:
- `app/page.module.css` (トップページ)
- `app/news/page.module.css`
- `app/members/page.module.css`
- `app/business/page.module.css`
- `app/contact/page.module.css`

**実装内容**:
1. セクション背景の多様化（交互に背景色を変更）
2. カード型レイアウトの導入
3. 画像エフェクト（border-radius, ホバー時のズームイン）

**所要時間**: 4-6時間

---

### 6.2 フェーズ6: ニュース/ブログコンポーネントの更新

**目的**: ニュース一覧、カテゴリタグ、記事詳細をカラフルにする。

**対象ファイル**:
- `app/_components/NewsList/index.module.css`
- `app/_components/NewsListItem/index.module.css`
- `app/_components/Category/index.module.css`
- `app/news/[slug]/page.module.css`

**実装内容**:
1. カテゴリタグのカラフル化
2. リストアイテムのホバー効果
3. 記事詳細ページのスタイル改善

**所要時間**: 2-3時間

---

### 6.3 フェーズ7: 細部の調整とポリッシュ

**目的**: フォーム、ページネーション、その他の細かいコンポーネントを調整。

**対象ファイル**:
- `app/_components/ContactForm/index.module.css`
- `app/_components/Pagination/index.module.css`
- その他のコンポーネント

**実装内容**:
1. ContactForm（入力フィールドのボーダー、フォーカス時のスタイル）
2. Pagination（アクティブページをプライマリカラーに）
3. アニメーション効果の追加

**所要時間**: 3-4時間

---

### 6.4 フェーズ8: 画像・アセットの更新

**目的**: ロゴ、アイコン、OGP画像を新しいデザインに合わせて更新。

**対象ファイル**:
- `public/` ディレクトリ配下の画像ファイル
- `app/layout.tsx` (OGP設定)

**実装内容**:
1. ロゴの作成・更新
2. OGP画像の作成
3. その他のアセット（ファビコン、イラスト素材）

**所要時間**: 変動（デザイナー連携次第）

**詳細**: [`assets-images.md`](./assets-images.md)

---

## 7. 段階的デプロイ戦略

### 7.1 デプロイタイミング

#### 第1回デプロイ: フェーズ1-3完了後

**目的**: 基礎カラーシステムの動作確認

**確認項目**:
- CSS変数が正しく適用されているか
- 背景色、テキスト色が変更されているか
- ボーダー半径が変更されているか
- フォントが変更されているか

---

#### 第2回デプロイ: フェーズ4完了後

**目的**: 視覚的変化の確認

**確認項目**:
- Header, Hero, ButtonLink, Footerの見た目
- グラデーション背景が表示されているか
- ボタンのホバー効果が動作しているか

---

#### 第3回デプロイ（最終）: フェーズ5-7完了後

**目的**: 全体のデザイン確認

**確認項目**:
- 全ページの統一感
- レスポンシブ対応（モバイル、タブレット、デスクトップ）
- カテゴリタグのカラフル化
- フォームのスタイル

---

#### 第4回デプロイ（オプション）: フェーズ8完了後

**目的**: 画像・アセットの最終確認

**確認項目**:
- ロゴ、OGP画像
- SNSシェア時の表示

---

### 7.2 デプロイ前チェックリスト

- [ ] `pnpm build` が成功するか
- [ ] `pnpm tsc --noEmit` が通るか（ESLintは無効化中）
- [ ] ローカル環境で主要ページを確認
- [ ] レスポンシブデザインを確認（モバイル、タブレット、デスクトップ）
- [ ] コンソールエラーがないか確認
- [ ] パフォーマンスチェック（Lighthouse等）

---

## 8. Before/Afterコード例

### 8.1 グローバルCSS（app/globals.css）

**Before**:
```css
:root {
  --font-mono: ui-monospace, Menlo, Monaco, ...;
  --color-text-main: #333;
  --color-text-sub: #999;
  --color-text-unpainted: #fff;
  --color-text-error: #f33;
  --color-bg-main: #fff;
  --color-bg-sub: #f3f3f3;
  --color-bg-code: #fafafa;
  --color-bg-painted: #333;
  --color-border-dark: #333;
  --color-border: #ddd;
  --color-border-light: #f3f3f3;
  --color-current: #eee;
  --color-button-primary: #333;
  --border-radius: 4px;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', YuGothic, ...;
  color: var(--color-text-main);
  line-height: 1.8;
}
```

**After（フェーズ1-3完了時）**:
```css
:root {
  /* フォント */
  --font-sans: 'Zen Kaku Gothic New', 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono', 'Roboto Mono', monospace;

  /* プライマリカラー */
  --color-primary: #FF6B6B;
  --color-primary-light: #FF8E8E;
  --color-primary-dark: #E85555;

  /* セカンダリカラー */
  --color-secondary: #4ECDC4;
  --color-secondary-light: #7EDAD5;
  --color-secondary-dark: #3BB5AC;

  /* ターシャリカラー */
  --color-tertiary: #FFE66D;
  --color-tertiary-light: #FFF09A;
  --color-tertiary-dark: #EDD75F;

  /* アクセントカラー */
  --color-accent-purple: #A78BFA;
  --color-accent-green: #6EE7B7;
  --color-accent-orange: #FDBA74;

  /* 背景カラー */
  --color-bg-main: #FFFEF9;
  --color-bg-secondary: #FFF8E7;
  --color-bg-tertiary: #F0FDFA;
  --color-bg-code: #F9FAFB;

  /* テキストカラー */
  --color-text-primary: #2D3748;
  --color-text-secondary: #718096;
  --color-text-tertiary: #A0AEC0;
  --color-text-unpainted: #FFFFFF;
  --color-text-error: #F56565;

  /* ボーダーカラー */
  --color-border-dark: #4A5568;
  --color-border: #E2E8F0;
  --color-border-light: #F7FAFC;

  /* ボタンカラー */
  --color-button-primary: #FF6B6B;
  --color-button-secondary: #4ECDC4;
  --color-current: #FFF8E7;

  /* ボーダー半径 */
  --border-radius-sm: 8px;
  --border-radius: 12px;
  --border-radius-lg: 16px;
  --border-radius-xl: 24px;
  --border-radius-full: 9999px;

  /* フォントサイズ */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 2rem;
  --font-size-4xl: 2.5rem;
  --font-size-5xl: 3rem;

  /* フォントウェイト */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* 行高 */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  --line-height-loose: 2;

  /* スペーシング */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-20: 80px;
  --spacing-24: 96px;
  --spacing-32: 128px;

  /* セクション間隔 */
  --section-gap-sm: var(--spacing-10);
  --section-gap-md: var(--spacing-16);
  --section-gap-lg: var(--spacing-20);
  --section-gap-xl: var(--spacing-24);

  /* コンテナ幅 */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;

  /* シャドウ */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 12px 32px rgba(0, 0, 0, 0.2);
  --shadow-primary-sm: 0 2px 8px rgba(255, 107, 107, 0.2);
  --shadow-primary-md: 0 4px 16px rgba(255, 107, 107, 0.25);
  --shadow-secondary-md: 0 4px 16px rgba(78, 205, 196, 0.25);
  --shadow-tertiary-md: 0 4px 16px rgba(255, 230, 109, 0.3);

  /* トランジション */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 500ms ease;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}

body {
  font-family: var(--font-sans);
  color: var(--color-text-primary);
  line-height: var(--line-height-normal);
}

code {
  font-family: var(--font-mono);
}

a {
  color: inherit;
  text-decoration: none;
}

ol,
ul {
  list-style: none;
}
```

---

### 8.2 ButtonLink（app/_components/ButtonLink/index.module.css）

**Before**:
```css
.button {
  display: inline-block;
  background: var(--color-button-primary);
  color: var(--color-text-unpainted);
  text-align: center;
  font-size: 1rem;
  padding: 10px 24px;
  border-radius: var(--border-radius);
}

.button:hover {
  opacity: 0.8;
}
```

**After**:
```css
.button {
  display: inline-block;
  background: var(--color-button-primary);
  color: var(--color-text-unpainted);
  text-align: center;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-primary-sm);
  transition: var(--transition-base);
  border: none;
  cursor: pointer;
}

.button:hover {
  background: var(--color-primary-dark);
  box-shadow: var(--shadow-primary-md);
  transform: translateY(-2px);
}

.button:active {
  transform: translateY(0);
  box-shadow: var(--shadow-primary-sm);
}

/* セカンダリボタン（追加） */
.buttonSecondary {
  composes: button;
  background: var(--color-button-secondary);
  box-shadow: var(--shadow-secondary-md);
}

.buttonSecondary:hover {
  background: var(--color-secondary-dark);
  box-shadow: 0 4px 16px rgba(78, 205, 196, 0.35);
}
```

---

### 8.3 Hero（app/_components/Hero/index.module.css）

**Before**:
```css
.hero {
  padding: 80px 16px;
  background: var(--color-bg-sub);
}

.title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 24px;
}
```

**After**:
```css
.hero {
  padding: var(--spacing-20) var(--spacing-4);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  margin: var(--spacing-6);
  position: relative;
  overflow: hidden;
}

/* 装飾的なグラデーションオーバーレイ */
.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 50%, rgba(255, 230, 109, 0.3) 0%, transparent 50%);
  pointer-events: none;
}

.title {
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-extrabold);
  line-height: var(--line-height-tight);
  margin-bottom: var(--spacing-6);
  color: var(--color-text-unpainted);
  position: relative;
  z-index: 1;
}

.description {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-unpainted);
  margin-bottom: var(--spacing-8);
  position: relative;
  z-index: 1;
}
```

---

### 8.4 カテゴリタグ（app/_components/Category/index.module.css）

**Before**:
```css
.category {
  display: inline-block;
  padding: 4px 12px;
  background: var(--color-bg-sub);
  color: var(--color-text-main);
  font-size: 0.9rem;
  border-radius: var(--border-radius);
}
```

**After**:
```css
.category {
  display: inline-block;
  padding: var(--spacing-1) var(--spacing-4);
  background: var(--color-primary);
  color: var(--color-text-unpainted);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--border-radius-full);
  box-shadow: var(--shadow-primary-sm);
  transition: var(--transition-fast);
}

.category:hover {
  box-shadow: var(--shadow-primary-md);
  transform: scale(1.05);
}

/* カテゴリごとの色分け（例） */
.categoryNews {
  composes: category;
  background: var(--color-primary);
}

.categoryEvent {
  composes: category;
  background: var(--color-secondary);
}

.categoryBlog {
  composes: category;
  background: var(--color-tertiary);
  color: var(--color-text-primary); /* 黄色背景の場合はテキストを暗く */
}

.categoryOther {
  composes: category;
  background: var(--color-accent-purple);
}
```

---

## 関連ドキュメント

- **デザインシステムトップ**: [`docs/design.md`](../design.md)
- **カラーシステム**: [`docs/design/color-system.md`](./color-system.md)
- **タイポグラフィ**: [`docs/design/typography.md`](./typography.md)
- **スペーシング＆レイアウト**: [`docs/design/spacing-layout.md`](./spacing-layout.md)
- **コンポーネントスタイル**: [`docs/design/components.md`](./components.md)
- **画像＆イラスト**: [`docs/design/assets-images.md`](./assets-images.md)

---

**最終更新日**: 2026-02-22
**作成者**: Claude Code（フリーザ様）
