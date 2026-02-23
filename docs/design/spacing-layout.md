# スペーシング＆レイアウト詳細

**PLDLデザインシステム - スペーシング＆レイアウト**

[← デザインシステムトップに戻る](../design.md)

---

## 目次

- [1. スペーシングスケール](#1-スペーシングスケール)
- [2. セクション間隔](#2-セクション間隔)
- [3. コンテナ幅](#3-コンテナ幅)
- [4. レスポンシブブレークポイント](#4-レスポンシブブレークポイント)
- [5. グリッドシステム](#5-グリッドシステム)
- [6. 使用例](#6-使用例)

---

## 1. スペーシングスケール

### 1.1 4の倍数ベース

**4pxを基本単位**として、体系的なスペーシングスケールを構築します。現在の固定値（16px, 24px, 40px, 80px, 100px）を変数化し、拡張性を向上させます。

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
```

**合計**: 13段階のスペーシング

**命名規則**:
- 数字はpx値を4で割った値（例: `--spacing-6` = 24px = 6 * 4px）
- Tailwind CSSと同様の命名規則で、直感的に理解しやすい

---

### 1.2 各スペーシングの用途

| 変数 | px値 | rem値 | 用途 | 例 |
|------|------|-------|------|-----|
| `--spacing-1` | 4px | 0.25rem | 最小の余白 | アイコンとテキストの間隔 |
| `--spacing-2` | 8px | 0.5rem | 小さな余白 | ボタン内の余白 |
| `--spacing-3` | 12px | 0.75rem | やや小さな余白 | カードの内側パディング |
| `--spacing-4` | 16px | 1rem | 標準的な余白 | 段落間の余白 |
| `--spacing-5` | 20px | 1.25rem | やや大きな余白 | セクション内の要素間隔 |
| `--spacing-6` | 24px | 1.5rem | 大きな余白 | カードの内側パディング（標準） |
| `--spacing-8` | 32px | 2rem | さらに大きな余白 | セクション内の大きな要素間隔 |
| `--spacing-10` | 40px | 2.5rem | セクション間隔（小） | 小さなセクション間 |
| `--spacing-12` | 48px | 3rem | セクション間隔（中） | 中程度のセクション間 |
| `--spacing-16` | 64px | 4rem | セクション間隔（大） | 大きなセクション間 |
| `--spacing-20` | 80px | 5rem | セクション間隔（特大） | 主要セクション間 |
| `--spacing-24` | 96px | 6rem | ページ間隔 | ページ上下の余白 |
| `--spacing-32` | 128px | 8rem | 特別な間隔 | ヒーローセクションの上下余白 |

---

### 1.3 スペーシングの選び方

**要素内の余白（padding）**:
- 小さな要素（ボタン、バッジ）: `--spacing-2` ~ `--spacing-3`
- 標準的な要素（カード）: `--spacing-6` ~ `--spacing-8`
- 大きな要素（セクション）: `--spacing-10` ~ `--spacing-16`

**要素間の余白（margin）**:
- 同じグループ内の要素: `--spacing-2` ~ `--spacing-4`
- 異なるグループ間: `--spacing-6` ~ `--spacing-8`
- セクション間: `--spacing-10` ~ `--spacing-20`

---

## 2. セクション間隔

### 2.1 セクション間隔変数

現在のコードで使用されているパターンを変数化します。

```css
/* セクション間隔（現在のコードで使用されているパターン） */
--section-gap-sm: var(--spacing-10);   /* 40px - 小 */
--section-gap-md: var(--spacing-16);   /* 64px - 中 */
--section-gap-lg: var(--spacing-20);   /* 80px - 大 */
--section-gap-xl: var(--spacing-24);   /* 96px - 特大 */
```

**合計**: 4段階のセクション間隔

---

### 2.2 各セクション間隔の用途

| 変数 | px値 | 用途 | 例 |
|------|------|------|-----|
| `--section-gap-sm` | 40px | 小さなセクション間隔 | ニュース一覧内のセクション間 |
| `--section-gap-md` | 64px | 中程度のセクション間隔 | 通常のセクション間 |
| `--section-gap-lg` | 80px | 大きなセクション間隔 | 主要セクション間 |
| `--section-gap-xl` | 96px | 特大のセクション間隔 | ページ上下の余白 |

---

### 2.3 レスポンシブ対応

**デスクトップ**:
```css
.section {
  padding-top: var(--section-gap-lg); /* 80px */
  padding-bottom: var(--section-gap-lg); /* 80px */
}
```

**タブレット**:
```css
@media (max-width: 920px) {
  .section {
    padding-top: var(--section-gap-md); /* 64px */
    padding-bottom: var(--section-gap-md); /* 64px */
  }
}
```

**モバイル**:
```css
@media (max-width: 640px) {
  .section {
    padding-top: var(--section-gap-sm); /* 40px */
    padding-bottom: var(--section-gap-sm); /* 40px */
  }
}
```

---

## 3. コンテナ幅

### 3.1 コンテナ幅変数

現在の固定値（840px, 920px）を調整し、レスポンシブデザインの標準に合わせます。

```css
/* コンテナ幅 */
--container-sm: 640px;    /* 小デバイス */
--container-md: 768px;    /* タブレット（現在の840pxから調整） */
--container-lg: 1024px;   /* デスクトップ（現在の920pxから調整） */
--container-xl: 1280px;   /* ワイドデスクトップ */
```

**合計**: 4段階のコンテナ幅

---

### 3.2 各コンテナ幅の用途

| 変数 | px値 | 用途 | 例 |
|------|------|------|-----|
| `--container-sm` | 640px | モバイルレイアウト | モバイル専用セクション |
| `--container-md` | 768px | タブレットレイアウト | 通常のコンテンツ幅 |
| `--container-lg` | 1024px | デスクトップレイアウト | ワイドコンテンツ |
| `--container-xl` | 1280px | ワイドデスクトップ | 特別なワイドコンテンツ |

---

### 3.3 コンテナの使用例

**標準的なコンテナ**:
```css
.container {
  max-width: var(--container-md); /* 768px */
  margin: 0 auto;
  padding: 0 var(--spacing-4); /* 16px */
}
```

**ワイドコンテナ**:
```css
.containerWide {
  max-width: var(--container-lg); /* 1024px */
  margin: 0 auto;
  padding: 0 var(--spacing-6); /* 24px */
}
```

**レスポンシブコンテナ**:
```css
.containerResponsive {
  max-width: var(--container-md); /* 768px */
  margin: 0 auto;
  padding: 0 var(--spacing-4); /* 16px */
}

@media (max-width: 920px) {
  .containerResponsive {
    max-width: var(--container-sm); /* 640px */
    padding: 0 var(--spacing-3); /* 12px */
  }
}

@media (max-width: 640px) {
  .containerResponsive {
    padding: 0 var(--spacing-2); /* 8px */
  }
}
```

---

## 4. レスポンシブブレークポイント

### 4.1 ブレークポイントの定義

```css
/* ブレークポイント（参考値） */
/*
  - mobile: ~640px
  - tablet: 641px~920px（現在の920px基準を維持）
  - desktop: 921px~1000px
  - wide: 1001px~
*/
```

**注意**: CSS変数として定義はできないため、メディアクエリで直接指定します。

---

### 4.2 各ブレークポイントの用途

| ブレークポイント | 範囲 | 用途 | デバイス例 |
|----------------|------|------|-----------|
| Mobile | ~640px | モバイルレイアウト | iPhone, Android（縦持ち） |
| Tablet | 641px~920px | タブレットレイアウト | iPad（縦持ち）, Android Tablet |
| Desktop | 921px~1000px | デスクトップレイアウト | ノートPC, デスクトップ |
| Wide | 1001px~ | ワイドデスクトップレイアウト | ワイドモニター |

---

### 4.3 メディアクエリの使用例

**モバイルファースト**（推奨）:
```css
/* ベース（モバイル） */
.element {
  font-size: var(--font-size-md); /* 16px */
}

/* タブレット以上 */
@media (min-width: 641px) {
  .element {
    font-size: var(--font-size-lg); /* 18px */
  }
}

/* デスクトップ以上 */
@media (min-width: 921px) {
  .element {
    font-size: var(--font-size-xl); /* 20px */
  }
}
```

**デスクトップファースト**:
```css
/* ベース（デスクトップ） */
.element {
  font-size: var(--font-size-xl); /* 20px */
}

/* タブレット以下 */
@media (max-width: 920px) {
  .element {
    font-size: var(--font-size-lg); /* 18px */
  }
}

/* モバイル以下 */
@media (max-width: 640px) {
  .element {
    font-size: var(--font-size-md); /* 16px */
  }
}
```

---

## 5. グリッドシステム

### 5.1 2カラムグリッド

**デスクトップ**: 2列
**モバイル**: 1列

```css
.grid2col {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-6); /* 24px */
}

@media (max-width: 640px) {
  .grid2col {
    grid-template-columns: 1fr;
  }
}
```

**用途**:
- メンバー紹介（2列）
- 事業内容（2列）
- カード型レイアウト

---

### 5.2 3カラムグリッド

**デスクトップ**: 3列
**タブレット**: 2列
**モバイル**: 1列

```css
.grid3col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-8); /* 32px */
}

@media (max-width: 920px) {
  .grid3col {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid3col {
    grid-template-columns: 1fr;
  }
}
```

**用途**:
- ニュース一覧（3列）
- カテゴリタグ一覧（3列）
- 画像ギャラリー（3列）

---

### 5.3 4カラムグリッド

**デスクトップ**: 4列
**タブレット**: 2列
**モバイル**: 1列

```css
.grid4col {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-6); /* 24px */
}

@media (max-width: 920px) {
  .grid4col {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid4col {
    grid-template-columns: 1fr;
  }
}
```

**用途**:
- アイコン一覧（4列）
- 小さなカード型レイアウト（4列）

---

### 5.4 非対称グリッド

**デスクトップ**: 2:1の比率
**モバイル**: 1列

```css
.gridAsymmetric {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-8); /* 32px */
}

@media (max-width: 920px) {
  .gridAsymmetric {
    grid-template-columns: 1fr;
  }
}
```

**用途**:
- メインコンテンツ + サイドバー
- 記事詳細 + 関連記事

---

## 6. 使用例

### 6.1 カードレイアウト

```css
.card {
  background: var(--color-bg-main);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--spacing-6); /* 24px */
  box-shadow: var(--shadow-sm);
}

.cardTitle {
  font-size: var(--font-size-xl); /* 20px */
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-3); /* 12px */
}

.cardContent {
  font-size: var(--font-size-md); /* 16px */
  line-height: var(--line-height-normal); /* 1.5 */
  margin-bottom: var(--spacing-4); /* 16px */
}

.cardFooter {
  display: flex;
  gap: var(--spacing-2); /* 8px */
  align-items: center;
}
```

---

### 6.2 セクションレイアウト

```css
.section {
  padding-top: var(--section-gap-lg); /* 80px */
  padding-bottom: var(--section-gap-lg); /* 80px */
}

.sectionTitle {
  font-size: var(--font-size-3xl); /* 32px */
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-8); /* 32px */
  text-align: center;
}

.sectionContent {
  max-width: var(--container-md); /* 768px */
  margin: 0 auto;
  padding: 0 var(--spacing-4); /* 16px */
}
```

---

### 6.3 フォームレイアウト

```css
.form {
  max-width: var(--container-sm); /* 640px */
  margin: 0 auto;
  padding: var(--spacing-8); /* 32px */
  background: var(--color-bg-main);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
}

.formGroup {
  margin-bottom: var(--spacing-6); /* 24px */
}

.formLabel {
  display: block;
  font-size: var(--font-size-sm); /* 14px */
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-2); /* 8px */
  color: var(--color-text-primary);
}

.formInput {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4); /* 12px 16px */
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  font-size: var(--font-size-md); /* 16px */
}

.formButton {
  margin-top: var(--spacing-8); /* 32px */
}
```

---

### 6.4 ナビゲーションレイアウト

```css
.nav {
  display: flex;
  gap: var(--spacing-6); /* 24px */
  align-items: center;
  padding: var(--spacing-4); /* 16px */
}

.navLink {
  padding: var(--spacing-2) var(--spacing-4); /* 8px 16px */
  border-radius: var(--border-radius-sm);
  transition: var(--transition-fast);
}

.navLink:hover {
  background: var(--color-bg-secondary);
}
```

---

### 6.5 ヒーローセクション

```css
.hero {
  padding: var(--spacing-20) var(--spacing-4); /* 80px 16px */
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-secondary) 100%
  );
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  margin: var(--spacing-6); /* 24px */
  text-align: center;
}

.heroTitle {
  font-size: var(--font-size-5xl); /* 48px */
  font-weight: var(--font-weight-extrabold);
  line-height: var(--line-height-tight);
  margin-bottom: var(--spacing-6); /* 24px */
  color: var(--color-text-unpainted);
}

.heroDescription {
  font-size: var(--font-size-lg); /* 18px */
  line-height: var(--line-height-relaxed);
  color: var(--color-text-unpainted);
  margin-bottom: var(--spacing-8); /* 32px */
  max-width: var(--container-md); /* 768px */
  margin-left: auto;
  margin-right: auto;
}
```

---

## 関連ドキュメント

- **デザインシステムトップ**: [`docs/design.md`](../design.md)
- **カラーシステム**: [`docs/design/color-system.md`](./color-system.md)
- **タイポグラフィ**: [`docs/design/typography.md`](./typography.md)
- **コンポーネントスタイル**: [`docs/design/components.md`](./components.md)
- **実装ガイドライン**: [`docs/design/implementation-guide.md`](./implementation-guide.md)

---

**最終更新日**: 2026-02-22
**作成者**: Claude Code（フリーザ様）
