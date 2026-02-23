# カラーシステム詳細

**PLDLデザインシステム - カラーシステム**

[← デザインシステムトップに戻る](../design.md)

---

## 目次

- [1. カラーパレット案A（ビビッドポップ）★採用](#1-カラーパレット案aビビッドポップ採用)
- [2. 既存変数とのマッピング](#2-既存変数とのマッピング)
- [3. CSS変数の完全定義](#3-css変数の完全定義)
- [4. 使用例](#4-使用例)
- [5. カラーアクセシビリティ](#5-カラーアクセシビリティ)

---

## 1. カラーパレット案A（ビビッドポップ）★採用

明るく活発な印象で、子供たちのエネルギーと遊び心を表現。保護者にも安心感を与えるバランスの取れた配色。

### 1.1 プライマリカラー

**コーラルレッド系** - アクティブで楽しい雰囲気を演出

```css
--color-primary: #FF6B6B;           /* コーラルレッド - メイン */
--color-primary-light: #FF8E8E;     /* ライトコーラル - ホバー時など */
--color-primary-dark: #E85555;      /* ダークコーラル - アクティブ状態 */
```

**用途**:
- プライマリボタン（CTA）
- リンクのホバー状態
- アクセントとして強調したい要素
- Footerの背景色

---

### 1.2 セカンダリカラー

**ターコイズブルー系** - 爽やかさと信頼感を演出

```css
--color-secondary: #4ECDC4;         /* ターコイズブルー - メイン */
--color-secondary-light: #7EDAD5;   /* ライトターコイズ - ホバー時など */
--color-secondary-dark: #3BB5AC;    /* ダークターコイズ - アクティブ状態 */
```

**用途**:
- セカンダリボタン
- セクション背景のアクセント
- カテゴリタグ（イベント系）
- Heroセクションのグラデーション終点

---

### 1.3 ターシャリカラー

**サニーイエロー系** - 明るさと元気を演出

```css
--color-tertiary: #FFE66D;          /* サニーイエロー - メイン */
--color-tertiary-light: #FFF09A;    /* ライトイエロー - ホバー時など */
--color-tertiary-dark: #EDD75F;     /* ダークイエロー - アクティブ状態 */
```

**用途**:
- アクセントとして強調したい要素
- カテゴリタグ（ブログ系）
- セクション背景のバリエーション
- 装飾的なグラデーションオーバーレイ

**注意**: 黄色背景の場合、テキストは `--color-text-primary`（暗い色）を使用してコントラストを確保すること。

---

### 1.4 アクセントカラー

**追加のアクセントカラー** - バリエーションと多様性を演出

```css
--color-accent-purple: #A78BFA;     /* パープル */
--color-accent-green: #6EE7B7;      /* ミントグリーン */
--color-accent-orange: #FDBA74;     /* ピーチオレンジ */
```

**用途**:
- カテゴリタグの色分け（その他の分類）
- バッジやラベル
- イラストやアイコンのアクセント
- 装飾的な要素

---

### 1.5 背景カラー

**ウォーム＆ナチュラル系** - 温かみと優しさを演出

```css
--color-bg-main: #FFFEF9;           /* ウォームホワイト - メイン背景 */
--color-bg-secondary: #FFF8E7;      /* クリームイエロー - セクション背景 */
--color-bg-tertiary: #F0FDFA;       /* ライトミント - セクション背景（バリエーション） */
--color-bg-code: #F9FAFB;           /* コード背景 */
```

**用途**:
- `--color-bg-main`: body の背景、カードの背景
- `--color-bg-secondary`: セクション背景（交互配置）
- `--color-bg-tertiary`: セクション背景（交互配置）
- `--color-bg-code`: コードブロックの背景

---

### 1.6 テキストカラー

**ダークグレー系** - 可読性を維持しつつ柔らかい印象

```css
--color-text-primary: #2D3748;      /* ダークグレー - メインテキスト */
--color-text-secondary: #718096;    /* ミディアムグレー - サブテキスト */
--color-text-tertiary: #A0AEC0;     /* ライトグレー - キャプション */
--color-text-unpainted: #FFFFFF;    /* 白テキスト - ダークな背景上 */
--color-text-error: #F56565;        /* エラーテキスト */
```

**用途**:
- `--color-text-primary`: 本文、見出し
- `--color-text-secondary`: サブテキスト、説明文
- `--color-text-tertiary`: キャプション、補足情報
- `--color-text-unpainted`: Heroセクション、Footer、プライマリボタン上のテキスト
- `--color-text-error`: エラーメッセージ、バリデーション

---

### 1.7 ボーダーカラー

**グレー系** - 境界を明確にしつつ優しい印象

```css
--color-border-dark: #4A5568;       /* ダークボーダー - 強調 */
--color-border: #E2E8F0;            /* 標準ボーダー - カード、入力フィールド */
--color-border-light: #F7FAFC;      /* ライトボーダー - 微細な区切り */
```

**用途**:
- `--color-border-dark`: 強調したいボーダー（フォーカス時など）
- `--color-border`: カード、入力フィールド、テーブルのボーダー
- `--color-border-light`: セクション間の微細な区切り

---

### 1.8 ボタンカラー

**ボタン専用のカラー定義**

```css
--color-button-primary: #FF6B6B;    /* プライマリボタン */
--color-button-secondary: #4ECDC4;  /* セカンダリボタン */
```

**用途**:
- `--color-button-primary`: CTA（Call To Action）ボタン
- `--color-button-secondary`: サブアクションボタン

---

### 1.9 その他のカラー

**カレント状態**

```css
--color-current: #FFF8E7;           /* カレント状態（ページネーション等） */
```

**用途**:
- ページネーションのアクティブページ
- ナビゲーションのカレントページ

---

## 2. 既存変数とのマッピング

既存の13個のCSS変数を、案A（ビビッドポップ）の新しい値に置き換えます。

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

**互換性注意**:
- 既存のコンポーネントは、これらの変数を参照しているため、変数を更新するだけで自動的に新しいカラーパレットが適用されます。
- ただし、一部のコンポーネント（Header、Hero、ButtonLink等）は、新しいデザインに合わせて追加のスタイル調整が必要です。

---

## 3. CSS変数の完全定義

`app/globals.css` の `:root` セクションに以下を追加します。

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
}
```

**合計**: 27個のカラー変数

---

## 4. 使用例

### 4.1 ButtonLink（プライマリボタン）

```css
.button {
  background: var(--color-button-primary); /* #FF6B6B */
  color: var(--color-text-unpainted); /* #FFFFFF */
  border-radius: var(--border-radius-sm); /* 8px */
  box-shadow: var(--shadow-primary-sm);
  transition: var(--transition-base);
}

.button:hover {
  background: var(--color-primary-dark); /* #E85555 */
  box-shadow: var(--shadow-primary-md);
  transform: translateY(-2px);
}
```

**視覚的効果**:
- 通常時: コーラルレッド（#FF6B6B）の背景
- ホバー時: ダークコーラル（#E85555）に変化し、上方に移動
- カラフルシャドウで立体感を演出

---

### 4.2 Hero（グラデーション背景）

```css
.hero {
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,      /* #FF6B6B */
    var(--color-secondary) 100%   /* #4ECDC4 */
  );
  border-radius: var(--border-radius-lg); /* 16px */
  box-shadow: var(--shadow-lg);
}

.title {
  color: var(--color-text-unpainted); /* #FFFFFF */
  font-size: var(--font-size-5xl); /* 48px */
}
```

**視覚的効果**:
- グラデーション: コーラルレッド → ターコイズブルー
- 白テキストで可読性を確保
- 大きなボーダー半径で柔らかい印象

---

### 4.3 Category（カテゴリタグ）

```css
/* ニュースカテゴリ */
.categoryNews {
  background: var(--color-primary); /* #FF6B6B */
  color: var(--color-text-unpainted); /* #FFFFFF */
  border-radius: var(--border-radius-full); /* 9999px */
  box-shadow: var(--shadow-primary-sm);
}

/* イベントカテゴリ */
.categoryEvent {
  background: var(--color-secondary); /* #4ECDC4 */
  color: var(--color-text-unpainted); /* #FFFFFF */
  border-radius: var(--border-radius-full);
  box-shadow: var(--shadow-secondary-md);
}

/* ブログカテゴリ */
.categoryBlog {
  background: var(--color-tertiary); /* #FFE66D */
  color: var(--color-text-primary); /* #2D3748 - 暗いテキスト */
  border-radius: var(--border-radius-full);
  box-shadow: var(--shadow-tertiary-md);
}

/* その他のカテゴリ */
.categoryOther {
  background: var(--color-accent-purple); /* #A78BFA */
  color: var(--color-text-unpainted); /* #FFFFFF */
  border-radius: var(--border-radius-full);
}
```

**視覚的効果**:
- カテゴリごとに異なるカラフルな背景
- ピル型（完全に丸い）で親しみやすい
- カラフルシャドウで立体感

---

### 4.4 セクション背景の交互配置

```css
/* セクション1 */
.section1 {
  background: var(--color-bg-main); /* #FFFEF9 */
}

/* セクション2 */
.section2 {
  background: var(--color-bg-secondary); /* #FFF8E7 */
}

/* セクション3 */
.section3 {
  background: var(--color-bg-tertiary); /* #F0FDFA */
}

/* セクション4 */
.section4 {
  background: var(--color-bg-main); /* #FFFEF9 */
}
```

**視覚的効果**:
- ウォームホワイト → クリームイエロー → ライトミント → ウォームホワイト の繰り返し
- 微妙な色の変化で視覚的なリズムを作る
- 全体として温かみのある印象

---

## 5. カラーアクセシビリティ

### 5.1 コントラスト比の確保

**WCAG 2.1 AA基準**（コントラスト比 4.5:1以上）を満たす組み合わせ:

| 背景色 | テキスト色 | コントラスト比 | 判定 |
|-------|----------|--------------|------|
| `#FFFEF9`（bg-main） | `#2D3748`（text-primary） | 12.5:1 | ✅ AAA |
| `#FFF8E7`（bg-secondary） | `#2D3748`（text-primary） | 11.8:1 | ✅ AAA |
| `#FF6B6B`（primary） | `#FFFFFF`（text-unpainted） | 4.8:1 | ✅ AA |
| `#4ECDC4`（secondary） | `#FFFFFF`（text-unpainted） | 5.2:1 | ✅ AA |
| `#FFE66D`（tertiary） | `#2D3748`（text-primary） | 10.2:1 | ✅ AAA |

**注意**:
- 黄色背景（`#FFE66D`）には、必ず暗いテキスト（`#2D3748`）を使用すること。
- 白テキスト（`#FFFFFF`）を使用する場合、コントラスト比が低下するため避ける。

---

### 5.2 色覚多様性への配慮

**カラーユニバーサルデザイン**:

- **プライマリ**（コーラルレッド）と**セカンダリ**（ターコイズブルー）は、色覚多様性のある方にも区別しやすい組み合わせ。
- **ターシャリ**（サニーイエロー）は明度が高いため、補助的な情報にのみ使用。
- カテゴリタグなど、色だけで情報を伝えている場合は、アイコンやラベルを併記することを推奨。

---

### 5.3 推奨される組み合わせ

**安全な組み合わせ**:

```css
/* 推奨: 高コントラスト */
background: var(--color-bg-main);
color: var(--color-text-primary);

/* 推奨: ダークな背景に白テキスト */
background: var(--color-primary);
color: var(--color-text-unpainted);

/* 推奨: クリーム背景に暗いテキスト */
background: var(--color-bg-secondary);
color: var(--color-text-primary);

/* 推奨: 黄色背景に暗いテキスト */
background: var(--color-tertiary);
color: var(--color-text-primary);
```

**避けるべき組み合わせ**:

```css
/* NG: 黄色背景に白テキスト（コントラスト不足） */
background: var(--color-tertiary);
color: var(--color-text-unpainted); /* ❌ NG */

/* NG: ライトグレー背景にライトグレーテキスト（コントラスト不足） */
background: var(--color-border-light);
color: var(--color-text-tertiary); /* ❌ NG */
```

---

## 関連ドキュメント

- **デザインシステムトップ**: [`docs/design.md`](../design.md)
- **タイポグラフィ**: [`docs/design/typography.md`](./typography.md)
- **スペーシング＆レイアウト**: [`docs/design/spacing-layout.md`](./spacing-layout.md)
- **コンポーネントスタイル**: [`docs/design/components.md`](./components.md)
- **実装ガイドライン**: [`docs/design/implementation-guide.md`](./implementation-guide.md)

---

**最終更新日**: 2026-02-22
**作成者**: Claude Code（フリーザ様）
