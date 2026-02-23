# 画像＆イラストガイドライン

**PLDLデザインシステム - 画像＆イラスト**

[← デザインシステムトップに戻る](../design.md)

---

## 目次

- [1. 写真スタイルガイドライン](#1-写真スタイルガイドライン)
- [2. イラストスタイルガイドライン](#2-イラストスタイルガイドライン)
- [3. 推奨リソース](#3-推奨リソース)
- [4. 画像最適化ガイドライン](#4-画像最適化ガイドライン)
- [5. 実装例](#5-実装例)

---

## 1. 写真スタイルガイドライン

### 1.1 撮影ガイドライン

**雰囲気**:
- 明るく自然光のある写真
- 子供たちの笑顔や集中している表情を捉える
- やや高めの彩度（鮮やかに）
- 背景はシンプルに整理

**構図**:
- 被写体を中心に配置
- 余白を意識した構図
- 視線誘導を意識

**色調**:
- 温かみのある色調（ウォームトーン）
- 高い彩度（鮮やかさ）
- コントラストを適度に上げる

---

### 1.2 画像処理ガイドライン

**角丸処理**:
```css
.imageContainer img {
  border-radius: var(--border-radius); /* 12px */
}

/* 大きな画像 */
.imageLarge img {
  border-radius: var(--border-radius-lg); /* 16px */
}
```

**シャドウ**:
```css
.imageContainer {
  box-shadow: var(--shadow-md);
  overflow: hidden;
}
```

**ホバー効果**:
```css
.imageContainer {
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
}

.imageContainer:hover {
  box-shadow: var(--shadow-lg);
}

.imageContainer img {
  transition: var(--transition-base);
}

.imageContainer:hover img {
  transform: scale(1.05); /* 軽くズームイン */
}
```

---

### 1.3 推奨する写真の種類

**子供たちの活動写真**:
- 遊んでいる様子
- 学んでいる様子
- 協力している様子
- 笑顔の表情

**環境写真**:
- 教室や施設の様子
- 教材や道具
- 明るく清潔な空間

**避けるべき写真**:
- 暗い写真
- ぼやけた写真
- 過度に加工された写真
- 被写体が小さすぎる写真

---

## 2. イラストスタイルガイドライン

### 2.1 スタイルガイドライン

**基本スタイル**:
- フラットデザイン、シンプルで親しみやすい
- メインカラーパレット（#FF6B6B, #4ECDC4, #FFE66D）に準拠
- 太めの線（2-3px）で子供が認識しやすく
- 抽象的なキャラクターや幾何学的パターンを活用

**推奨スタイル**:
- ミニマルでシンプル
- カラフルで楽しい
- 丸みを帯びた形状
- 明るい配色

**避けるべきスタイル**:
- リアルすぎるイラスト
- 複雑すぎる細部
- 暗い色調
- 攻撃的な表現

---

### 2.2 カラーパレットの適用

**プライマリカラー**（コーラルレッド: #FF6B6B）:
- 重要な要素、アクセント

**セカンダリカラー**（ターコイズブルー: #4ECDC4）:
- 補助的な要素、背景

**ターシャリカラー**（サニーイエロー: #FFE66D）:
- 明るさ、楽しさの表現

**アクセントカラー**（パープル、ミントグリーン、ピーチオレンジ）:
- バリエーション、多様性の表現

---

### 2.3 推奨する用途

**ヒーローセクション**:
- 楽しさや活動を象徴するイラスト
- 子供たちのシルエット
- 遊び道具や教材のイラスト

**セクション装飾**:
- 幾何学的パターン
- ドットやストライプ
- 抽象的な背景

**アイコン**:
- シンプルで認識しやすいアイコン
- 統一されたスタイル
- 適度な太さの線

---

## 3. 推奨リソース

### 3.1 イラスト素材

#### unDraw

**URL**: [https://undraw.co/](https://undraw.co/)

**特徴**:
- カスタマイズ可能なフラットイラスト
- 無料で商用利用可能
- カラーパレットを変更可能（#FF6B6Bに変更して使用）

**推奨カテゴリ**:
- Education
- Kids
- Fun
- Collaboration

---

#### Storyset

**URL**: [https://storyset.com/](https://storyset.com/)

**特徴**:
- アニメーション対応のイラスト集
- 無料で商用利用可能（要クレジット表記）
- カスタマイズ可能なカラー

**推奨カテゴリ**:
- Education
- People
- Business

---

### 3.2 アイコン

#### Phosphor Icons

**URL**: [https://phosphoricons.com/](https://phosphoricons.com/)

**特徴**:
- Roundedスタイル推奨（柔らかい印象）
- 無料で商用利用可能
- React, Vue等のコンポーネントも提供

**使用例**:
```tsx
import { Play, Users, BookOpen } from '@phosphor-icons/react';

<Play size={32} weight="bold" color="#FF6B6B" />
<Users size={24} weight="regular" color="#4ECDC4" />
<BookOpen size={20} weight="light" color="#FFE66D" />
```

---

#### Heroicons

**URL**: [https://heroicons.com/](https://heroicons.com/)

**特徴**:
- シンプルで汎用性が高い
- 無料でMIT ライセンス
- Tailwind CSSの開発元が提供

**使用例**:
```tsx
import { PlayIcon, UsersIcon, BookOpenIcon } from '@heroicons/react/24/outline';

<PlayIcon className="w-8 h-8 text-primary" />
<UsersIcon className="w-6 h-6 text-secondary" />
<BookOpenIcon className="w-5 h-5 text-tertiary" />
```

---

### 3.3 その他のリソース

#### Freepik

**URL**: [https://www.freepik.com/](https://www.freepik.com/)

**特徴**:
- 豊富なイラスト素材
- 無料プランあり（要クレジット表記）
- 高品質な素材

**注意**:
- ライセンスを確認すること
- 必要に応じてクレジット表記

---

## 4. 画像最適化ガイドライン

### 4.1 Next.jsの `Image` コンポーネント

**必ず使用**:

```tsx
import Image from 'next/image';

<Image
  src="/images/hero.jpg"
  alt="子供たちが遊んでいる様子"
  width={800}
  height={600}
  priority={true} // ヒーロー画像の場合
/>
```

**メリット**:
- 自動的に最適なフォーマットに変換（WebP等）
- レスポンシブ対応
- 遅延読み込み（Lazy Loading）
- パフォーマンス向上

---

### 4.2 microCMSからの画像

**自動最適化**:

microCMSからの画像は、`next.config.js` の `remotePatterns` で許可済み:

```javascript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.microcms-assets.io' }
  ]
}
```

**使用例**:

```tsx
<Image
  src={article.thumbnail.url}
  alt={article.title}
  width={800}
  height={600}
/>
```

---

### 4.3 画像サイズの推奨

**ヒーロー画像**:
- 幅: 1200px以上
- 高さ: 600-800px
- フォーマット: JPG or PNG
- ファイルサイズ: 200KB以下（圧縮後）

**カード画像**:
- 幅: 600-800px
- 高さ: 400-600px
- フォーマット: JPG or PNG
- ファイルサイズ: 100KB以下（圧縮後）

**アイコン・イラスト**:
- フォーマット: SVG（推奨）
- 代替: PNG（透過背景が必要な場合）

---

### 4.4 圧縮ツール

**TinyPNG**:
- URL: [https://tinypng.com/](https://tinypng.com/)
- JPG, PNGの圧縮

**SVGOMG**:
- URL: [https://jakearchibald.github.io/svgomg/](https://jakearchibald.github.io/svgomg/)
- SVGの最適化

---

## 5. 実装例

### 5.1 ヒーローセクションの画像

```tsx
import Image from 'next/image';

export default function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.imageContainer}>
        <Image
          src="/images/hero.jpg"
          alt="子供たちが楽しく学んでいる様子"
          width={1200}
          height={600}
          priority={true}
          className={styles.heroImage}
        />
      </div>
      <div className={styles.content}>
        <h1>放課後こどもラボ</h1>
        <p>遊びを通じて学ぶ体験を提供</p>
      </div>
    </div>
  );
}
```

```css
.imageContainer {
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.heroImage {
  width: 100%;
  height: auto;
  object-fit: cover;
}
```

---

### 5.2 カード型レイアウトの画像

```tsx
<div className={styles.card}>
  <div className={styles.cardImage}>
    <Image
      src={member.image.url}
      alt={member.name}
      width={400}
      height={400}
      className={styles.image}
    />
  </div>
  <div className={styles.cardContent}>
    <h3>{member.name}</h3>
    <p>{member.description}</p>
  </div>
</div>
```

```css
.cardImage {
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
}

.cardImage:hover {
  box-shadow: var(--shadow-lg);
}

.image {
  transition: var(--transition-base);
}

.cardImage:hover .image {
  transform: scale(1.05);
}
```

---

### 5.3 背景イラストの配置

```css
.section {
  position: relative;
  padding: var(--section-gap-lg);
  overflow: hidden;
}

.section::before {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 300px;
  height: 300px;
  background-image: url('/images/illustration-dots.svg');
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 0.1;
  pointer-events: none;
}
```

---

### 5.4 アイコンの使用

```tsx
import { Play, Users, BookOpen } from '@phosphor-icons/react';

<div className={styles.features}>
  <div className={styles.feature}>
    <Play size={48} weight="bold" color="var(--color-primary)" />
    <h3>遊びながら学ぶ</h3>
  </div>
  <div className={styles.feature}>
    <Users size={48} weight="bold" color="var(--color-secondary)" />
    <h3>チームで協力</h3>
  </div>
  <div className={styles.feature}>
    <BookOpen size={48} weight="bold" color="var(--color-tertiary)" />
    <h3>知識を深める</h3>
  </div>
</div>
```

---

## 関連ドキュメント

- **デザインシステムトップ**: [`docs/design.md`](../design.md)
- **カラーシステム**: [`docs/design/color-system.md`](./color-system.md)
- **コンポーネントスタイル**: [`docs/design/components.md`](./components.md)
- **実装ガイドライン**: [`docs/design/implementation-guide.md`](./implementation-guide.md)

---

**最終更新日**: 2026-02-22
**作成者**: Claude Code（フリーザ様）
