# コンポーネントスタイル詳細

**PLDLデザインシステム - コンポーネントスタイル**

[← デザインシステムトップに戻る](../design.md)

---

## 目次

- [1. ボーダー半径](#1-ボーダー半径)
- [2. シャドウシステム](#2-シャドウシステム)
- [3. トランジション](#3-トランジション)
- [4. カードスタイルバリエーション](#4-カードスタイルバリエーション)
- [5. ボタンスタイル](#5-ボタンスタイル)
- [6. 入力フィールドスタイル](#6-入力フィールドスタイル)

---

## 1. ボーダー半径

### 1.1 ボーダー半径の定義

より柔らかい印象を与えるため、現在の4pxから12pxに変更し、5段階のバリエーションを追加します。

```css
--border-radius-sm: 8px;      /* 小 - ボタン、バッジ */
--border-radius: 12px;        /* 標準 - カード、入力フィールド */
--border-radius-lg: 16px;     /* 大 - 大型カード、ヒーローセクション */
--border-radius-xl: 24px;     /* 特大 - 特別なセクション */
--border-radius-full: 9999px; /* 完全な円形 - アバター、ピル型ボタン */
```

**合計**: 5段階のボーダー半径

---

### 1.2 各ボーダー半径の用途

| 変数 | px値 | 用途 | 例 |
|------|------|------|-----|
| `--border-radius-sm` | 8px | 小さな要素 | ボタン、バッジ、タグ |
| `--border-radius` | 12px | 標準的な要素 | カード、入力フィールド、モーダル |
| `--border-radius-lg` | 16px | 大きな要素 | 大型カード、ヒーローセクション、画像 |
| `--border-radius-xl` | 24px | 特別な要素 | 特別なセクション、装飾的なカード |
| `--border-radius-full` | 9999px | 円形要素 | アバター、ピル型ボタン、カテゴリタグ |

---

### 1.3 使用例

**ボタン**:
```css
.button {
  border-radius: var(--border-radius-sm); /* 8px */
}
```

**カード**:
```css
.card {
  border-radius: var(--border-radius); /* 12px */
}
```

**ヒーローセクション**:
```css
.hero {
  border-radius: var(--border-radius-lg); /* 16px */
}
```

**カテゴリタグ（ピル型）**:
```css
.categoryTag {
  border-radius: var(--border-radius-full); /* 9999px */
}
```

---

## 2. シャドウシステム

### 2.1 標準シャドウ

**4段階の標準シャドウ**を定義します。

```css
/* 標準シャドウ */
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);
--shadow-xl: 0 12px 32px rgba(0, 0, 0, 0.2);
```

**用途**:
- `--shadow-sm`: 小さなホバー効果、カード
- `--shadow-md`: 通常のカード、モーダル
- `--shadow-lg`: 浮遊感のあるカード、ヒーローセクション
- `--shadow-xl`: 特別な浮遊効果、ドロップダウン

---

### 2.2 カラフルシャドウ

**アクセント用のカラフルシャドウ**を定義します。立体感と遊び心を演出します。

```css
/* カラフルシャドウ（アクセント用） */
--shadow-primary-sm: 0 2px 8px rgba(255, 107, 107, 0.2);
--shadow-primary-md: 0 4px 16px rgba(255, 107, 107, 0.25);
--shadow-secondary-md: 0 4px 16px rgba(78, 205, 196, 0.25);
--shadow-tertiary-md: 0 4px 16px rgba(255, 230, 109, 0.3);
```

**用途**:
- `--shadow-primary-sm`: プライマリボタンの通常時
- `--shadow-primary-md`: プライマリボタンのホバー時
- `--shadow-secondary-md`: セカンダリボタン、ターコイズ背景のカード
- `--shadow-tertiary-md`: イエロー背景のカード

---

### 2.3 シャドウの使い分け

**通常のカード**:
```css
.card {
  box-shadow: var(--shadow-sm); /* 通常時 */
}

.card:hover {
  box-shadow: var(--shadow-md); /* ホバー時 */
}
```

**カラフルなボタン**:
```css
.buttonPrimary {
  box-shadow: var(--shadow-primary-sm); /* 通常時 */
}

.buttonPrimary:hover {
  box-shadow: var(--shadow-primary-md); /* ホバー時 */
}
```

**浮遊感のあるカード**:
```css
.cardElevated {
  box-shadow: var(--shadow-lg); /* 通常時 */
}

.cardElevated:hover {
  box-shadow: var(--shadow-xl); /* ホバー時 */
}
```

---

## 3. トランジション

### 3.1 トランジションの定義

**3段階のトランジション速度**を定義します。

```css
--transition-fast: 150ms ease;    /* ホバー効果 */
--transition-base: 300ms ease;    /* 標準アニメーション */
--transition-slow: 500ms ease;    /* ゆっくりとした変化 */
```

---

### 3.2 各トランジションの用途

| 変数 | 時間 | 用途 | 例 |
|------|------|------|-----|
| `--transition-fast` | 150ms | 素早い反応 | ホバー効果、色変化 |
| `--transition-base` | 300ms | 標準的な変化 | シャドウ変化、トランスフォーム |
| `--transition-slow` | 500ms | ゆっくりとした変化 | モーダルの開閉、フェードイン |

---

### 3.3 使用例

**ホバー効果**:
```css
.button {
  background: var(--color-button-primary);
  transition: background-color var(--transition-fast); /* 150ms */
}

.button:hover {
  background: var(--color-primary-dark);
}
```

**トランスフォーム効果**:
```css
.card {
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-base), transform var(--transition-base); /* 300ms */
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

**モーダルのフェードイン**:
```css
.modal {
  opacity: 0;
  transition: opacity var(--transition-slow); /* 500ms */
}

.modalOpen {
  opacity: 1;
}
```

---

## 4. カードスタイルバリエーション

### 4.1 card-default（標準カード）

**現在のスタイル**を洗練させたバージョン。

```css
.cardDefault {
  background: var(--color-bg-main);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-base);
}

.cardDefault:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

**特徴**:
- 標準的な背景色とボーダー
- ホバー時に軽く上方に移動
- 控えめなシャドウ

**用途**:
- ニュース一覧のアイテム
- メンバー紹介カード
- 事業内容カード

---

### 4.2 card-accent（カラフルアクセント付き）

**左側にカラフルなアクセント**を付けたカード。

```css
.cardAccent {
  background: var(--color-bg-main);
  border-left: 4px solid var(--color-primary);
  border-radius: var(--border-radius);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-primary-sm);
  transition: var(--transition-base);
}

.cardAccent:hover {
  box-shadow: var(--shadow-primary-md);
}
```

**特徴**:
- 左側に太いカラフルなボーダー
- カラフルシャドウで立体感
- ホバー時にシャドウが強調

**バリエーション**:
```css
/* セカンダリカラーのアクセント */
.cardAccentSecondary {
  composes: cardAccent;
  border-left-color: var(--color-secondary);
  box-shadow: var(--shadow-secondary-md);
}

/* ターシャリカラーのアクセント */
.cardAccentTertiary {
  composes: cardAccent;
  border-left-color: var(--color-tertiary);
  box-shadow: var(--shadow-tertiary-md);
}
```

**用途**:
- 重要なお知らせ
- カテゴリごとに色分けされたカード
- ステータス表示（進行中、完了等）

---

### 4.3 card-elevated（浮遊感のあるカード）

**大きなシャドウで浮遊感**を演出するカード。

```css
.cardElevated {
  background: var(--color-bg-main);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-8);
  box-shadow: var(--shadow-lg);
  transition: var(--transition-base);
}

.cardElevated:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-4px);
}
```

**特徴**:
- ボーダーなし、大きなシャドウ
- 大きめのボーダー半径（16px）
- ホバー時に大きく上方に移動

**用途**:
- トップページの主要カード
- ヒーローセクション内のカード
- 特別なコンテンツ（キャンペーン等）

---

### 4.4 card-colored（カラフル背景カード）

**カラフルな背景色**を持つカード。

```css
.cardColored {
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-secondary) 100%
  );
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-8);
  box-shadow: var(--shadow-primary-md);
  color: var(--color-text-unpainted);
  transition: var(--transition-base);
}

.cardColored:hover {
  box-shadow: var(--shadow-xl);
  transform: scale(1.02);
}
```

**特徴**:
- グラデーション背景
- 白テキスト
- ホバー時に軽く拡大

**用途**:
- ヒーローセクション
- CTA（Call To Action）カード
- 特別なプロモーション

---

## 5. ボタンスタイル

### 5.1 プライマリボタン

**主要なアクション**を促すボタン。

```css
.buttonPrimary {
  display: inline-block;
  background: var(--color-button-primary);
  color: var(--color-text-unpainted);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  padding: var(--spacing-3) var(--spacing-6); /* 12px 24px */
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-primary-sm);
  transition: var(--transition-base);
  border: none;
  cursor: pointer;
  text-align: center;
}

.buttonPrimary:hover {
  background: var(--color-primary-dark);
  box-shadow: var(--shadow-primary-md);
  transform: translateY(-2px);
}

.buttonPrimary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-primary-sm);
}
```

**特徴**:
- コーラルレッド背景
- カラフルシャドウ
- ホバー時に上方に移動
- クリック時に元の位置に戻る

---

### 5.2 セカンダリボタン

**サブアクション**を促すボタン。

```css
.buttonSecondary {
  composes: buttonPrimary;
  background: var(--color-button-secondary);
  box-shadow: var(--shadow-secondary-md);
}

.buttonSecondary:hover {
  background: var(--color-secondary-dark);
  box-shadow: 0 4px 16px rgba(78, 205, 196, 0.35);
}
```

**特徴**:
- ターコイズブルー背景
- プライマリボタンと同様の挙動

---

### 5.3 アウトラインボタン

**控えめなアクション**を促すボタン。

```css
.buttonOutline {
  display: inline-block;
  background: transparent;
  color: var(--color-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  padding: var(--spacing-3) var(--spacing-6);
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius-sm);
  transition: var(--transition-fast);
  cursor: pointer;
  text-align: center;
}

.buttonOutline:hover {
  background: var(--color-primary);
  color: var(--color-text-unpainted);
}
```

**特徴**:
- 透明背景、カラフルなボーダー
- ホバー時に背景色が塗られる
- テキスト色が反転

---

### 5.4 テキストボタン

**最も控えめなボタン**。

```css
.buttonText {
  display: inline-block;
  background: transparent;
  color: var(--color-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-2) var(--spacing-4);
  border: none;
  transition: var(--transition-fast);
  cursor: pointer;
  text-decoration: underline;
}

.buttonText:hover {
  color: var(--color-primary-dark);
  text-decoration: none;
}
```

**特徴**:
- 背景なし、ボーダーなし
- 下線付き
- ホバー時に下線が消える

---

## 6. 入力フィールドスタイル

### 6.1 標準入力フィールド

**テキスト入力、メールアドレス入力等**の標準スタイル。

```css
.input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4); /* 12px 16px */
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  font-size: var(--font-size-md);
  font-family: var(--font-sans);
  color: var(--color-text-primary);
  background: var(--color-bg-main);
  transition: var(--transition-fast);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.input::placeholder {
  color: var(--color-text-tertiary);
}
```

**特徴**:
- 標準的なボーダー
- フォーカス時にプライマリカラーのボーダー
- フォーカス時に軽いシャドウ
- プレースホルダーはライトグレー

---

### 6.2 テキストエリア

**複数行の入力**に使用。

```css
.textarea {
  composes: input;
  min-height: 120px;
  resize: vertical;
}
```

**特徴**:
- 入力フィールドと同様のスタイル
- 最小高さ120px
- 縦方向にのみリサイズ可能

---

### 6.3 エラー状態の入力フィールド

**バリデーションエラー時**のスタイル。

```css
.inputError {
  composes: input;
  border-color: var(--color-text-error);
}

.inputError:focus {
  box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.1);
}

.errorMessage {
  font-size: var(--font-size-sm);
  color: var(--color-text-error);
  margin-top: var(--spacing-1);
}
```

**特徴**:
- 赤いボーダー
- フォーカス時に赤いシャドウ
- エラーメッセージは小さな赤テキスト

---

## 関連ドキュメント

- **デザインシステムトップ**: [`docs/design.md`](../design.md)
- **カラーシステム**: [`docs/design/color-system.md`](./color-system.md)
- **タイポグラフィ**: [`docs/design/typography.md`](./typography.md)
- **スペーシング＆レイアウト**: [`docs/design/spacing-layout.md`](./spacing-layout.md)
- **実装ガイドライン**: [`docs/design/implementation-guide.md`](./implementation-guide.md)

---

**最終更新日**: 2026-02-22
**作成者**: Claude Code（フリーザ様）
