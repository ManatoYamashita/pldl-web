# PLDLデザインシステム

## 1. プロジェクト概要

### PLDLについて

**PLDL（Playful Learning Design Lab.）** は「放課後こどもラボ」として、子供たちが遊びを通じて学ぶ体験を提供するサービスです。

### デザインコンセプト

**「楽しく・ポップで、保護者と子供の両方が親しめるデザイン」**

- **ターゲットユーザー**: 保護者と子供の両方
- **トーン＆マナー**: 明るく元気で、遊び心のあるデザイン。カラフルで親しみやすく、安心感を与える
- **変更の背景**: 現在のモノトーン基調（#333ベース）は企業向けで堅すぎるため、子供向けサービスにふさわしいビジュアルへの全面刷新が必要

---

## 2. カラーシステム

### 案A: ビビッドポップ（推奨★★★★★）

明るく活発な印象で、子供たちのエネルギーと遊び心を表現。保護者にも安心感を与えるバランスの取れた配色。

```css
/* プライマリカラー */
--color-primary: #FF6B6B;           /* コーラルレッド - アクティブで楽しい */
--color-primary-light: #FF8E8E;     /* ライトコーラル */
--color-primary-dark: #E85555;      /* ダークコーラル */

/* セカンダリカラー */
--color-secondary: #4ECDC4;         /* ターコイズブルー - 爽やかさと信頼感 */
--color-secondary-light: #7EDAD5;   /* ライトターコイズ */
--color-secondary-dark: #3BB5AC;    /* ダークターコイズ */

/* ターシャリカラー */
--color-tertiary: #FFE66D;          /* サニーイエロー - 明るさと元気 */
--color-tertiary-light: #FFF09A;    /* ライトイエロー */
--color-tertiary-dark: #EDD75F;     /* ダークイエロー */

/* アクセントカラー */
--color-accent-purple: #A78BFA;     /* パープル */
--color-accent-green: #6EE7B7;      /* ミントグリーン */
--color-accent-orange: #FDBA74;     /* ピーチオレンジ */

/* 背景カラー */
--color-bg-main: #FFFEF9;           /* ウォームホワイト */
--color-bg-secondary: #FFF8E7;      /* クリームイエロー */
--color-bg-tertiary: #F0FDFA;       /* ライトミント */
--color-bg-code: #F9FAFB;           /* コード背景 */

/* テキストカラー */
--color-text-primary: #2D3748;      /* ダークグレー（可読性重視） */
--color-text-secondary: #718096;    /* ミディアムグレー */
--color-text-tertiary: #A0AEC0;     /* ライトグレー */
--color-text-unpainted: #FFFFFF;    /* 白テキスト */
--color-text-error: #F56565;        /* エラーテキスト */

/* ボーダーカラー */
--color-border-dark: #4A5568;       /* ダークボーダー */
--color-border: #E2E8F0;            /* 標準ボーダー */
--color-border-light: #F7FAFC;      /* ライトボーダー */

/* ボタンカラー */
--color-button-primary: #FF6B6B;    /* プライマリボタン */
--color-button-secondary: #4ECDC4;  /* セカンダリボタン */
--color-current: #FFF8E7;           /* カレント状態 */
```

### 案B: パステルフレンドリー

柔らかく落ち着いた雰囲気で、より幅広い年齢層に対応。優しい印象を重視。

```css
/* プライマリカラー */
--color-primary: #A8DADC;           /* パステルブルー */
--color-secondary: #F1A7B5;         /* パステルピンク */
--color-tertiary: #FFE5B4;          /* ピーチクリーム */

/* 背景カラー */
--color-bg-main: #FEFEFE;
--color-bg-secondary: #F8F9FA;

/* テキストカラー */
--color-text-primary: #3E4C59;
--color-text-secondary: #6B7785;
```

### 案C: カラフルエナジー

より子供向けを前面に押し出した、エネルギッシュな配色。活発さを最優先。

```css
/* プライマリカラー */
--color-primary: #FF5E78;           /* ヴィヴィッドピンク */
--color-secondary: #00D9FF;         /* シアンブルー */
--color-tertiary: #FFD93D;          /* ブライトイエロー */

/* 背景カラー */
--color-bg-main: #FFFFFE;
--color-bg-secondary: #FFF5F5;

/* テキストカラー */
--color-text-primary: #1A202C;
--color-text-secondary: #4A5568;
```

### 既存変数とのマッピング（案A適用時）

| 既存変数 | 現在の値 | 新しい値（案A） | 変更内容 |
|---------|---------|----------------|---------|
| `--color-text-main` | #333 | #2D3748 | ダークグレーに変更（可読性維持） |
| `--color-text-sub` | #999 | #718096 | ミディアムグレー |
| `--color-text-unpainted` | #fff | #FFFFFF | 変更なし |
| `--color-text-error` | #f33 | #F56565 | より柔らかい赤 |
| `--color-bg-main` | #fff | #FFFEF9 | ウォームホワイト（温かみ） |
| `--color-bg-sub` | #f3f3f3 | #FFF8E7 | クリームイエロー |
| `--color-bg-code` | #fafafa | #F9FAFB | わずかに調整 |
| `--color-bg-painted` | #333 | #FF6B6B | プライマリカラー |
| `--color-border-dark` | #333 | #4A5568 | ダークグレー |
| `--color-border` | #ddd | #E2E8F0 | ライトグレー |
| `--color-border-light` | #f3f3f3 | #F7FAFC | より明るく |
| `--color-current` | #eee | #FFF8E7 | クリーム色 |
| `--color-button-primary` | #333 | #FF6B6B | コーラルレッド |
| `--border-radius` | 4px | 12px | より丸く柔らかい印象 |

---

## 3. タイポグラフィ

### フォントファミリー

**推奨フォント**: Google Fontsの「Zen Kaku Gothic New」を採用。現代的で読みやすく、子供向けコンテンツに最適。

```css
--font-sans: 'Zen Kaku Gothic New', 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono', 'Roboto Mono', monospace;
```

**代替案（丸ゴシック）**: より柔らかい印象が必要な場合

```css
--font-sans: 'M PLUS Rounded 1c', 'Zen Maru Gothic', 'Noto Sans JP', sans-serif;
```

### フォントサイズスケール

Major Third（1.25倍）のスケールを採用。現在の単純な構成（3rem, 1rem, 0.9rem）から体系的なスケールへ。

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

### フォントウェイト

```css
--font-weight-normal: 400;    /* 通常 */
--font-weight-medium: 500;    /* 中間 */
--font-weight-semibold: 600;  /* セミボールド */
--font-weight-bold: 700;      /* ボールド */
--font-weight-extrabold: 800; /* エクストラボールド */
```

### 行高（Line Height）

```css
--line-height-tight: 1.25;    /* 見出し用 */
--line-height-normal: 1.5;    /* 標準本文 */
--line-height-relaxed: 1.75;  /* ゆったり */
--line-height-loose: 2;       /* 非常にゆったり */
```

### Before/After比較

| 要素 | Before | After | 理由 |
|------|--------|-------|------|
| body font-family | システムフォント | Zen Kaku Gothic New | 現代的で読みやすい |
| body line-height | 1.8 | 1.5 (--line-height-normal) | 標準的なバランス |
| 見出しサイズ | 固定（3rem等） | スケール化（--font-size-*） | 一貫性と拡張性 |

---

## 4. スペーシング＆レイアウト

### スペーシングスケール

4の倍数ベースで統一。現在の固定値（16px, 24px, 40px, 80px, 100px）を変数化し、拡張性を向上。

```css
/* スペーシング（4の倍数ベース） */
--spacing-1: 4px;      /* 0.25rem */
--spacing-2: 8px;      /* 0.5rem */
--spacing-3: 12px;     /* 0.75rem */
--spacing-4: 16px;     /* 1rem */
--spacing-5: 20px;     /* 1.25rem */
--spacing-6: 24px;     /* 1.5rem */
--spacing-8: 32px;     /* 2rem */
--spacing-10: 40px;    /* 2.5rem */
--spacing-12: 48px;    /* 3rem */
--spacing-16: 64px;    /* 4rem */
--spacing-20: 80px;    /* 5rem */
--spacing-24: 96px;    /* 6rem */
--spacing-32: 128px;   /* 8rem */

/* セクション間隔（現在のコードで使用されているパターン） */
--section-gap-sm: var(--spacing-10);   /* 40px - 小 */
--section-gap-md: var(--spacing-16);   /* 64px - 中 */
--section-gap-lg: var(--spacing-20);   /* 80px - 大 */
--section-gap-xl: var(--spacing-24);   /* 96px - 特大 */
```

### コンテナ幅

現在の固定値（840px, 920px）を調整し、レスポンシブデザインの標準に合わせる。

```css
/* コンテナ幅 */
--container-sm: 640px;    /* 小デバイス */
--container-md: 768px;    /* タブレット（現在の840pxから調整） */
--container-lg: 1024px;   /* デスクトップ（現在の920pxから調整） */
--container-xl: 1280px;   /* ワイドデスクトップ */
```

### レスポンシブブレークポイント

```css
/* ブレークポイント（参考値） */
/*
  - mobile: ~640px
  - tablet: 641px~920px（現在の920px基準を維持）
  - desktop: 921px~1000px
  - wide: 1001px~
*/
```

### グリッドシステム例

**2カラムグリッド**:

```css
.grid-2col {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-6); /* 24px */
}

@media (max-width: 640px) {
  .grid-2col {
    grid-template-columns: 1fr;
  }
}
```

**3カラムグリッド**:

```css
.grid-3col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-8); /* 32px */
}

@media (max-width: 920px) {
  .grid-3col {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid-3col {
    grid-template-columns: 1fr;
  }
}
```

---

## 5. コンポーネントスタイル

### ボーダー半径

より柔らかい印象を与えるため、4px → 12pxに変更。

```css
--border-radius-sm: 8px;      /* 小 - ボタン、バッジ */
--border-radius: 12px;        /* 標準 - カード、入力フィールド */
--border-radius-lg: 16px;     /* 大 - 大型カード、ヒーローセクション */
--border-radius-xl: 24px;     /* 特大 - 特別なセクション */
--border-radius-full: 9999px; /* 完全な円形 - アバター、ピル型ボタン */
```

### シャドウシステム

カラフルなシャドウを含め、立体感と遊び心を演出。

```css
/* 標準シャドウ */
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);
--shadow-xl: 0 12px 32px rgba(0, 0, 0, 0.2);

/* カラフルシャドウ（アクセント用） */
--shadow-primary-sm: 0 2px 8px rgba(255, 107, 107, 0.2);
--shadow-primary-md: 0 4px 16px rgba(255, 107, 107, 0.25);
--shadow-secondary-md: 0 4px 16px rgba(78, 205, 196, 0.25);
--shadow-tertiary-md: 0 4px 16px rgba(255, 230, 109, 0.3);
```

### トランジション

```css
--transition-fast: 150ms ease;    /* ホバー効果 */
--transition-base: 300ms ease;    /* 標準アニメーション */
--transition-slow: 500ms ease;    /* ゆっくりとした変化 */
```

### カードスタイルバリエーション

**card-default**（現在のスタイル）:

```css
.card-default {
  background: var(--color-bg-main);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-base);
}

.card-default:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

**card-accent**（カラフルアクセント付き）:

```css
.card-accent {
  background: var(--color-bg-main);
  border-left: 4px solid var(--color-primary);
  border-radius: var(--border-radius);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-primary-sm);
  transition: var(--transition-base);
}

.card-accent:hover {
  box-shadow: var(--shadow-primary-md);
}
```

**card-elevated**（浮遊感のあるカード）:

```css
.card-elevated {
  background: var(--color-bg-main);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-8);
  box-shadow: var(--shadow-lg);
  transition: var(--transition-base);
}

.card-elevated:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-4px);
}
```

---

## 6. 画像＆イラスト

### 写真スタイル

**撮影ガイドライン**:
- 明るく自然光のある写真
- 子供たちの笑顔や集中している表情を捉える
- やや高めの彩度（鮮やかに）
- 背景はシンプルに整理

**画像処理**:
- `border-radius: 12px` 以上で角丸処理
- ホバー時に軽くズームイン（`transform: scale(1.05)`）
- シャドウで立体感を演出

```css
.image-container {
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
}

.image-container:hover {
  box-shadow: var(--shadow-lg);
}

.image-container img {
  transition: var(--transition-base);
}

.image-container:hover img {
  transform: scale(1.05);
}
```

### イラストスタイル

**スタイルガイドライン**:
- フラットデザイン、シンプルで親しみやすい
- メインカラーパレット（#FF6B6B, #4ECDC4, #FFE66D）に準拠
- 太めの線（2-3px）で子供が認識しやすく
- 抽象的なキャラクターや幾何学的パターンを活用

### 推奨リソース

**イラスト素材**:
- [unDraw](https://undraw.co/) - カスタマイズ可能なフラットイラスト
- [Storyset](https://storyset.com/) - アニメーション対応のイラスト集

**アイコン**:
- [Phosphor Icons](https://phosphoricons.com/) - Roundedスタイル推奨（柔らかい印象）
- [Heroicons](https://heroicons.com/) - シンプルで汎用性が高い

**画像最適化**:
- Next.jsの `Image` コンポーネントを使用（自動最適化）
- microCMSからの画像は `remotePatterns` で許可済み

---

## 7. 実装ガイドライン

### 段階的実装（8フェーズ）

優先度と所要時間を明記した実装計画。すべてを一度に変更せず、段階的にデプロイして確認する。

---

#### フェーズ1: 基礎カラーシステムの確立（★★★★★ 最優先）

**目的**: CSS変数を全面刷新し、新しいカラーパレットを適用する。

**対象ファイル**:
- `app/globals.css`

**実装内容**:

1. **カラー変数の全面刷新**:
   - 既存の13個の変数を、案A（ビビッドポップ）の27個の変数に置き換え
   - プライマリ、セカンダリ、ターシャリカラーを追加
   - アクセントカラー（purple, green, orange）を追加

2. **border-radiusの変更**:
   - `--border-radius: 4px` → `--border-radius: 12px`
   - 追加: `--border-radius-sm`, `--border-radius-lg`, `--border-radius-xl`, `--border-radius-full`

3. **フォントファミリーの変更**:
   - body の `font-family` に `'Zen Kaku Gothic New'` を最優先に追加
   - Google Fontsのリンクを `app/layout.tsx` の `<head>` に追加

**実装チェックリスト**:
- [ ] `app/globals.css` の `:root` セクションに27個の新変数を追加
- [ ] 既存の13個の変数を新しい値に更新（マッピング表参照）
- [ ] `--border-radius-sm`, `-lg`, `-xl`, `-full` を追加
- [ ] `app/layout.tsx` に Google Fonts リンクを追加（Zen Kaku Gothic New）
- [ ] body の `font-family` を更新
- [ ] ローカル環境で確認（`npm run dev`）
- [ ] 視覚的変化を確認（特にボタン、背景、ボーダー）

**所要時間**: 1-2時間

**検証ポイント**:
- トップページのボタンがコーラルレッド（#FF6B6B）になっているか
- 背景がウォームホワイト（#FFFEF9）になっているか
- border-radiusが12pxに変更され、角が丸くなっているか

**Before/Afterコード例**:

```css
/* Before */
:root {
  --color-text-main: #333;
  --color-bg-main: #fff;
  --color-button-primary: #333;
  --border-radius: 4px;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', YuGothic, ...;
}

/* After */
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

---

#### フェーズ2: タイポグラフィシステムの導入（★★★★☆）

**目的**: フォントサイズ、ウェイト、行高を変数化し、一貫性を確保する。

**対象ファイル**:
- `app/globals.css`

**実装内容**:

1. **フォントサイズスケールの追加**:
   - `--font-size-xs` から `--font-size-5xl` まで9段階
   - Major Thirdスケール（1.25倍）を採用

2. **フォントウェイトの変数化**:
   - `--font-weight-normal` から `--font-weight-extrabold` まで5段階

3. **行高の変数化**:
   - `--line-height-tight` から `--line-height-loose` まで4段階

**実装チェックリスト**:
- [ ] フォントサイズ変数9個を `app/globals.css` に追加
- [ ] フォントウェイト変数5個を追加
- [ ] 行高変数4個を追加
- [ ] bodyの `line-height` を 1.8 → `var(--line-height-normal)` (1.5) に変更
- [ ] ローカル環境で確認

**所要時間**: 1時間

**検証ポイント**:
- bodyの行高が1.5になっているか
- 変数が正しく定義されているか（DevToolsで確認）

---

#### フェーズ3: スペーシングシステムの体系化（★★★★☆）

**目的**: スペーシング変数を追加し、固定値を変数化する。

**対象ファイル**:
- `app/globals.css`

**実装内容**:

1. **スペーシング変数の追加**:
   - `--spacing-1` (4px) から `--spacing-32` (128px) まで13段階

2. **セクション間隔変数の追加**:
   - `--section-gap-sm`, `-md`, `-lg`, `-xl`

3. **コンテナ幅変数の追加**:
   - `--container-sm`, `-md`, `-lg`, `-xl`

**実装チェックリスト**:
- [ ] スペーシング変数13個を追加
- [ ] セクション間隔変数4個を追加
- [ ] コンテナ幅変数4個を追加
- [ ] ローカル環境で確認

**所要時間**: 30分

**検証ポイント**:
- 変数が正しく定義されているか（DevToolsで確認）

---

#### フェーズ4: 主要コンポーネントのスタイル更新（★★★★★）

**目的**: Header, Hero, ButtonLink, Footerをカラフルでポップなデザインに変更する。

**対象ファイル**:
- `app/_components/Header/index.module.css`
- `app/_components/Hero/index.module.css`
- `app/_components/ButtonLink/index.module.css`
- `app/_components/Footer/index.module.css`

**実装内容**:

1. **Header**:
   - 背景を白からウォームホワイトに
   - ホバー時にプライマリカラーを表示
   - シャドウを追加して浮遊感を演出

2. **Hero**:
   - 背景にグラデーション適用（プライマリ → セカンダリ）
   - タイトルのフォントサイズを `--font-size-5xl` に
   - ボーダー半径を `--border-radius-lg` に

3. **ButtonLink**:
   - プライマリボタンにコーラルレッド
   - セカンダリボタンにターコイズブルー
   - ホバー時にシャドウとトランスフォーム効果
   - `border-radius: var(--border-radius-sm)` (8px)

4. **Footer**:
   - 背景を暗い色からプライマリカラーに
   - テキストを白に
   - リンクにホバー効果

**実装チェックリスト**:
- [ ] `Header/index.module.css` を更新
- [ ] `Hero/index.module.css` を更新（グラデーション背景）
- [ ] `ButtonLink/index.module.css` を更新（カラフルボタン）
- [ ] `Footer/index.module.css` を更新
- [ ] ローカル環境で確認
- [ ] 各コンポーネントの視覚変化を確認

**所要時間**: 3-4時間

**検証ポイント**:
- Heroセクションにグラデーション背景が表示されているか
- ボタンがカラフルになっているか
- ホバー時にアニメーション効果が発生するか

**Before/Afterコード例（ButtonLink）**:

```css
/* Before */
.button {
  background: var(--color-button-primary); /* #333 */
  color: var(--color-text-unpainted);
  border-radius: var(--border-radius); /* 4px */
  padding: 10px 24px;
}

/* After */
.button {
  background: var(--color-button-primary); /* #FF6B6B */
  color: var(--color-text-unpainted);
  border-radius: var(--border-radius-sm); /* 8px */
  padding: var(--spacing-3) var(--spacing-6); /* 12px 24px */
  box-shadow: var(--shadow-primary-sm);
  transition: var(--transition-base);
}

.button:hover {
  background: var(--color-primary-dark); /* #E85555 */
  box-shadow: var(--shadow-primary-md);
  transform: translateY(-2px);
}
```

---

#### フェーズ5: ページレイアウトの更新（★★★★☆）

**目的**: 各ページのレイアウトをカラフルで楽しいデザインに変更する。

**対象ファイル**:
- `app/page.module.css` (トップページ)
- `app/news/page.module.css`
- `app/members/page.module.css`
- `app/business/page.module.css`
- `app/contact/page.module.css`

**実装内容**:

1. **セクション背景の多様化**:
   - 交互に背景色を変更（main → secondary → tertiary）
   - グラデーション背景を部分的に適用

2. **カード型レイアウトの導入**:
   - リストアイテムをカード化
   - シャドウとホバー効果を追加

3. **画像エフェクト**:
   - `border-radius` を12pxに
   - ホバー時にズームイン効果

**実装チェックリスト**:
- [ ] `app/page.module.css` を更新（トップページ）
- [ ] `app/news/page.module.css` を更新
- [ ] `app/members/page.module.css` を更新
- [ ] `app/business/page.module.css` を更新
- [ ] `app/contact/page.module.css` を更新
- [ ] ローカル環境で各ページを確認
- [ ] レスポンシブ対応を確認（モバイル、タブレット）

**所要時間**: 4-6時間

**検証ポイント**:
- セクションごとに背景色が変化しているか
- カードにホバー効果があるか
- 画像が角丸になっているか

---

#### フェーズ6: ニュース/ブログコンポーネントの更新（★★★☆☆）

**目的**: ニュース一覧、カテゴリタグ、記事詳細をカラフルにする。

**対象ファイル**:
- `app/_components/NewsList/index.module.css`
- `app/_components/NewsListItem/index.module.css`
- `app/_components/Category/index.module.css`
- `app/news/[slug]/page.module.css`

**実装内容**:

1. **カテゴリタグのカラフル化**:
   - カテゴリごとに異なる背景色（primary, secondary, tertiary, accentカラー）
   - `border-radius: var(--border-radius-full)` でピル型に

2. **リストアイテムのホバー効果**:
   - カード型デザイン
   - ホバー時にシャドウと上方移動

3. **記事詳細ページ**:
   - 見出しにアクセントカラー
   - コードブロックのスタイル改善

**実装チェックリスト**:
- [ ] `Category/index.module.css` を更新（カテゴリタグ）
- [ ] `NewsListItem/index.module.css` を更新（ホバー効果）
- [ ] `NewsList/index.module.css` を更新
- [ ] `app/news/[slug]/page.module.css` を更新
- [ ] ローカル環境で確認
- [ ] カテゴリタグの色が適切か確認

**所要時間**: 2-3時間

**検証ポイント**:
- カテゴリタグがカラフルになっているか
- ニュース一覧のホバー効果が動作しているか

---

#### フェーズ7: 細部の調整とポリッシュ（★★★☆☆）

**目的**: フォーム、ページネーション、その他の細かいコンポーネントを調整。

**対象ファイル**:
- `app/_components/ContactForm/index.module.css`
- `app/_components/Pagination/index.module.css`
- その他のコンポーネント

**実装内容**:

1. **ContactForm**:
   - 入力フィールドのボーダーをカラフルに
   - フォーカス時にプライマリカラーを表示
   - エラーメッセージのスタイル改善

2. **Pagination**:
   - アクティブページをプライマリカラーに
   - ホバー効果を追加

3. **その他**:
   - アニメーション効果の追加（フェードイン、スライドイン）
   - ローディング状態のスタイル

**実装チェックリスト**:
- [ ] `ContactForm/index.module.css` を更新
- [ ] `Pagination/index.module.css` を更新
- [ ] その他のコンポーネントを確認・更新
- [ ] アニメーション効果を追加
- [ ] ローカル環境で全体を確認

**所要時間**: 3-4時間

**検証ポイント**:
- フォームのフォーカス状態が適切か
- ページネーションのアクティブページが目立つか

---

#### フェーズ8: 画像・アセットの更新（★★★☆☆）

**目的**: ロゴ、アイコン、OGP画像を新しいデザインに合わせて更新。

**対象ファイル**:
- `public/` ディレクトリ配下の画像ファイル
- `app/layout.tsx` (OGP設定)

**実装内容**:

1. **ロゴの作成・更新**:
   - 新しいブランドカラー（コーラルレッド、ターコイズブルー）を使用
   - SVG形式で作成（スケーラブル）

2. **OGP画像の作成**:
   - 1200x630pxのOGP画像
   - ブランドカラーとロゴを使用

3. **その他のアセット**:
   - ファビコンの更新
   - イラスト素材の追加（unDraw, Storysetから）

**実装チェックリスト**:
- [ ] 新しいロゴを `public/logo.svg` に配置
- [ ] OGP画像を `public/ogp.png` に配置
- [ ] ファビコンを更新
- [ ] `app/layout.tsx` のOGP設定を更新
- [ ] イラスト素材を `public/images/` に配置
- [ ] ローカル環境で確認
- [ ] SNSシェア時のOGP表示を確認

**所要時間**: 変動（デザイナー連携次第）

**検証ポイント**:
- ロゴが新しいデザインになっているか
- OGP画像がSNSで正しく表示されるか

---

### 段階的デプロイ戦略

**デプロイタイミング**:

1. **第1回デプロイ**: フェーズ1-3完了後
   - 目的: 基礎カラーシステムの動作確認
   - 確認項目: CSS変数が正しく適用されているか

2. **第2回デプロイ**: フェーズ4完了後
   - 目的: 視覚的変化の確認
   - 確認項目: Header, Hero, ButtonLink, Footerの見た目

3. **第3回デプロイ（最終）**: フェーズ5-7完了後
   - 目的: 全体のデザイン確認
   - 確認項目: 全ページの統一感、レスポンシブ対応

4. **第4回デプロイ（オプション）**: フェーズ8完了後
   - 目的: 画像・アセットの最終確認
   - 確認項目: ロゴ、OGP画像

**デプロイ前チェックリスト**:
- [ ] `npm run build` が成功するか
- [ ] `npm run lint` が通るか
- [ ] ローカル環境で主要ページを確認
- [ ] レスポンシブデザインを確認（モバイル、タブレット、デスクトップ）
- [ ] コンソールエラーがないか確認

---

## 8. Before/After比較表

主要な変更点の一覧。

| 要素 | Before | After | 理由 |
|------|--------|-------|------|
| **プライマリカラー** | #333（黒） | #FF6B6B（コーラルレッド） | 楽しさ・活発さを表現 |
| **セカンダリカラー** | なし | #4ECDC4（ターコイズブルー） | 爽やかさと信頼感 |
| **背景メイン** | #fff（純白） | #FFFEF9（ウォームホワイト） | 温かみのある印象 |
| **背景サブ** | #f3f3f3（グレー） | #FFF8E7（クリームイエロー） | 柔らかく優しい印象 |
| **テキストメイン** | #333（黒） | #2D3748（ダークグレー） | 可読性を維持しつつ柔らかく |
| **border-radius** | 4px | 12px | 柔らかく親しみやすい印象 |
| **フォントファミリー** | システムフォント | Zen Kaku Gothic New | 現代的で読みやすい |
| **行高** | 1.8 | 1.5 | 標準的なバランス |
| **ボタン背景** | #333（黒） | #FF6B6B（コーラルレッド） | 目立つアクション |
| **シャドウ** | なし | あり（--shadow-md等） | 立体感と遊び心 |
| **カテゴリタグ** | グレー系 | カラフル（色分け） | 視認性と楽しさ向上 |
| **ホバー効果** | 最小限 | アニメーション多用 | インタラクティブ性向上 |
| **コンテナ幅** | 840px, 920px | 768px, 1024px | 標準的なレスポンシブ対応 |

---

## 9. コードサンプル

実装時の具体的なコード例。

### グローバルCSS（app/globals.css）

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

### ButtonLink（app/_components/ButtonLink/index.module.css）

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

### Hero（app/_components/Hero/index.module.css）

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

### カテゴリタグ（app/_components/Category/index.module.css）

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

## まとめ

このデザインシステムドキュメントは、PLDLのウェブサイトを「楽しく・ポップで親しみやすい」デザインに変えるための完全なガイドラインです。

**推奨アプローチ**:
1. **案A（ビビッドポップ）** を採用（最もバランスが良い）
2. **フェーズ1から順番に実装**（一度にすべてを変更しない）
3. **各フェーズごとにデプロイして確認**（問題の早期発見）
4. **ブランドカラーが決定したら、CSS変数を更新**（容易に変更可能）

**重要なポイント**:
- すべてのカラーとスタイルは **CSS変数** で管理（一元管理）
- 段階的実装により、**リスクを最小化**
- **レスポンシブデザイン** を常に考慮
- **アクセシビリティ**（可読性、コントラスト）を維持

**次のステップ**:
1. このドキュメントを確認し、不明点があれば質問
2. フェーズ1の実装を開始（`app/globals.css` の更新）
3. ローカル環境で確認
4. 問題がなければデプロイ

---

**最終更新日**: 2026-02-21
**作成者**: Claude Code
**バージョン**: 1.0.0
