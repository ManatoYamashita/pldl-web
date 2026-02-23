# コンポーネント対応表

## 再利用コンポーネント（変更なし）

以下のコンポーネントはそのまま使用可能（内部実装の変更なし）:

| コンポーネント | パス | 用途 | 備考 |
|---------------|------|------|------|
| Footer | `app/_components/Footer/` | フッター | 変更なし |
| ButtonLink | `app/_components/ButtonLink/` | ボタンリンク | 変更なし |
| Date | `app/_components/Date/` | 日付表示 | 変更なし |
| Category | `app/_components/Category/` | カテゴリータグ | 変更なし |
| Pagination | `app/_components/Pagination/` | ページネーション | 変更なし |
| Article | `app/_components/Article/` | 記事本文表示 | 変更なし |
| ContactForm | `app/_components/ContactForm/` | お問い合わせフォーム | 変更なし |
| Menu | `app/_components/Menu/` | メニュー | 変更なし |
| Sheet | `app/_components/Sheet/` | ドロアー | 変更なし |

---

## 変更コンポーネント

### Header（`app/_components/Header/index.tsx`）

**変更箇所**: ナビゲーションリンクの更新

**変更前**:
```tsx
<Link href="/news">ニュース</Link>
<Link href="/business">事業内容</Link>
<Link href="/members">メンバー</Link>
<Link href="#">採用情報</Link>
```

**変更後**:
```tsx
<Link href="/activities">活動内容</Link>
<Link href="/support">サポート</Link>
<Link href="/recruit">採用情報</Link>
<Link href="/#members">メンバー</Link>
```

**影響範囲**:
- 全ページのヘッダーナビゲーション

**検証項目**:
- [ ] 各リンクをクリックして正しいページに遷移する
- [ ] アンカーリンク（`/#members`）が正しく動作する
- [ ] モバイルメニューでも正しく動作する

---

## 削除コンポーネント

以下のコンポーネントは不要になるため削除:

| コンポーネント | パス | 削除理由 | 代替コンポーネント |
|---------------|------|---------|------------------|
| NewsList | `app/_components/NewsList/` | ニュース一覧表示用（不要） | ReportsList |
| NewsListItem | `app/_components/NewsListItem/` | ニュース一覧アイテム表示用（不要） | ReportsListItem |
| Hero（既存の場合） | `app/_components/Hero/` | 既存のHeroがある場合は削除 | Hero（新規作成） |

**削除コマンド**:
```bash
rm -rf app/_components/NewsList
rm -rf app/_components/NewsListItem
# 既存のHeroがある場合のみ
rm -rf app/_components/Hero
```

---

## 新規コンポーネント

### 1. ReportsList

**パス**: `app/_components/ReportsList/index.tsx`

**目的**: 活動レポートのリストを表示

**Props定義**:
```typescript
type Props = {
  reports: Report[];
};
```

**レンダリング仕様**:
- `reports` 配列を受け取り、ReportsListItemのリストを表示
- グリッドレイアウト（2-3カラム、レスポンシブ）
- 空配列の場合は「レポートがありません」を表示

**使用箇所**:
- `/activities` - 活動レポート一覧
- `/` - トップページ（最新2-3件表示）

**実装例**:
```tsx
import ReportsListItem from '@/app/_components/ReportsListItem';
import styles from './index.module.css';
import type { Report } from '@/app/_libs/microcms';

type Props = {
  reports: Report[];
};

export default function ReportsList({ reports }: Props) {
  if (reports.length === 0) {
    return <p className={styles.empty}>レポートがありません。</p>;
  }

  return (
    <div className={styles.container}>
      {reports.map((report) => (
        <ReportsListItem key={report.id} report={report} />
      ))}
    </div>
  );
}
```

**CSS設計**:
```css
/* index.module.css */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-6);
}

.empty {
  text-align: center;
  color: var(--color-text-secondary);
  padding: var(--spacing-8);
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }
}
```

---

### 2. ReportsListItem

**パス**: `app/_components/ReportsListItem/index.tsx`

**目的**: 個別の活動レポートカードを表示

**Props定義**:
```typescript
type Props = {
  report: Report;
};
```

**レンダリング仕様**:
- サムネイル画像（`next/image` で最適化）
- タイトル
- カテゴリータグ（`Category` コンポーネント再利用）
- 日付（`Date` コンポーネント再利用）
- 説明文（概要）
- 詳細ページへのリンク（`/activities/:slug`）
- ホバー時のアニメーション効果

**使用箇所**:
- `ReportsList` コンポーネント内

**実装例**:
```tsx
import Link from 'next/link';
import Image from 'next/image';
import Category from '@/app/_components/Category';
import Date from '@/app/_components/Date';
import styles from './index.module.css';
import type { Report } from '@/app/_libs/microcms';

type Props = {
  report: Report;
};

export default function ReportsListItem({ report }: Props) {
  return (
    <Link href={`/activities/${report.id}`} className={styles.link}>
      <article className={styles.card}>
        {report.thumbnail && (
          <div className={styles.imageWrapper}>
            <Image
              src={report.thumbnail.url}
              alt={report.title}
              width={report.thumbnail.width}
              height={report.thumbnail.height}
              className={styles.image}
            />
          </div>
        )}
        <div className={styles.content}>
          <Category category={report.category} />
          <h3 className={styles.title}>{report.title}</h3>
          <Date date={report.publishedAt || report.createdAt} />
          <p className={styles.description}>{report.description}</p>
        </div>
      </article>
    </Link>
  );
}
```

**CSS設計**:
```css
/* index.module.css */
.link {
  text-decoration: none;
  color: inherit;
}

.card {
  background: var(--color-bg-card);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.imageWrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  padding: var(--spacing-4);
}

.title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: var(--spacing-2) 0;
  line-height: var(--line-height-tight);
}

.description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin-top: var(--spacing-2);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

### 3. ActivityCard

**パス**: `app/_components/ActivityCard/index.tsx`

**目的**: 活動カテゴリー紹介カードを表示

**Props定義**:
```typescript
type Props = {
  title: string;
  description: string;
  imageUrl?: string;
  link: string;
};
```

**レンダリング仕様**:
- 活動カテゴリー紹介カード
- 画像、タイトル、説明文
- ホバー時のアニメーション
- リンク（例: `/activities?category=afterschool`）

**使用箇所**:
- `/activities` - 4つの活動カテゴリー紹介
- `/` - ホームページの活動内容セクション

**実装例**:
```tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './index.module.css';

type Props = {
  title: string;
  description: string;
  imageUrl?: string;
  link: string;
};

export default function ActivityCard({ title, description, imageUrl, link }: Props) {
  return (
    <Link href={link} className={styles.link}>
      <article className={styles.card}>
        {imageUrl && (
          <div className={styles.imageWrapper}>
            <Image
              src={imageUrl}
              alt={title}
              width={400}
              height={300}
              className={styles.image}
            />
          </div>
        )}
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
      </article>
    </Link>
  );
}
```

**CSS設計**:
```css
/* index.module.css */
.link {
  text-decoration: none;
  color: inherit;
}

.card {
  background: var(--color-bg-card);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-primary-md);
}

.imageWrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--color-bg-secondary);
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  padding: var(--spacing-4);
  flex: 1;
}

.title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--spacing-2);
}

.description {
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
}
```

---

### 4. VisionSection

**パス**: `app/_components/VisionSection/index.tsx`

**目的**: ビジョンステートメントを表示

**Props定義**:
```typescript
type Props = {
  title: string;
  content: string;
};
```

**レンダリング仕様**:
- ビジョンステートメント表示
- 大きなタイポグラフィ
- センター寄せレイアウト
- 背景色またはグラデーション

**使用箇所**:
- `/` - ホームページのVISIONセクション

**実装例**:
```tsx
import styles from './index.module.css';

type Props = {
  title: string;
  content: string;
};

export default function VisionSection({ title, content }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.content}>{content}</p>
      </div>
    </section>
  );
}
```

**CSS設計**:
```css
/* index.module.css */
.section {
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-secondary-light) 100%);
  padding: var(--section-gap-lg) var(--spacing-4);
}

.container {
  max-width: var(--container-md);
  margin: 0 auto;
  text-align: center;
}

.title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-6);
}

.content {
  font-size: var(--font-size-xl);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-secondary);
  max-width: 800px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .title {
    font-size: var(--font-size-2xl);
  }

  .content {
    font-size: var(--font-size-lg);
  }
}
```

---

### 5. MissionSection

**パス**: `app/_components/MissionSection/index.tsx`

**目的**: ミッション説明を表示

**Props定義**:
```typescript
type Props = {
  missions: Array<{
    title: string;
    description: string;
  }>;
};
```

**レンダリング仕様**:
- ミッション説明表示
- リスト形式（3-4個のミッション）
- アイコン付き（オプション）
- グリッドレイアウト

**使用箇所**:
- `/` - ホームページのMISSIONセクション

**実装例**:
```tsx
import styles from './index.module.css';

type Props = {
  missions: Array<{
    title: string;
    description: string;
  }>;
};

export default function MissionSection({ missions }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>ミッション</h2>
        <div className={styles.grid}>
          {missions.map((mission) => (
            <div key={mission.title} className={styles.card}>
              <div className={styles.iconWrapper}>
                {/* オプション: アイコンを追加 */}
                <span className={styles.icon}>✓</span>
              </div>
              <h3 className={styles.title}>{mission.title}</h3>
              <p className={styles.description}>{mission.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**CSS設計**:
```css
/* index.module.css */
.section {
  padding: var(--section-gap-lg) var(--spacing-4);
  background: var(--color-bg-main);
}

.container {
  max-width: var(--container-lg);
  margin: 0 auto;
}

.sectionTitle {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  text-align: center;
  margin-bottom: var(--spacing-8);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-6);
}

.card {
  background: var(--color-bg-card);
  border-radius: var(--border-radius);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
  text-align: center;
}

.iconWrapper {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-4);
}

.icon {
  font-size: var(--font-size-4xl);
  color: var(--color-primary);
}

.title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-2);
  color: var(--color-text-primary);
}

.description {
  font-size: var(--font-size-md);
  line-height: var(--line-height-normal);
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

---

### 6. Hero（新規）

**パス**: `app/_components/Hero/index.tsx`

**目的**: ヒーローセクションを表示

**Props定義**:
```typescript
type Props = {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
};
```

**レンダリング仕様**:
- フルスクリーンまたは大型ヒーロー
- メインビジュアル（背景画像）
- キャッチコピー（タイトル、サブタイトル）
- CTA ボタン（オプション）
- アニメーション効果（フェードイン等）

**使用箇所**:
- `/` - ホームページのヒーローセクション

**実装例**:
```tsx
import Image from 'next/image';
import ButtonLink from '@/app/_components/ButtonLink';
import styles from './index.module.css';

type Props = {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
};

export default function Hero({ title, subtitle, imageUrl, ctaText, ctaLink }: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.imageWrapper}>
        <Image
          src={imageUrl}
          alt={title}
          fill
          priority
          className={styles.image}
        />
        <div className={styles.overlay} />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        {ctaText && ctaLink && (
          <div className={styles.ctaWrapper}>
            <ButtonLink href={ctaLink}>{ctaText}</ButtonLink>
          </div>
        )}
      </div>
    </section>
  );
}
```

**CSS設計**:
```css
/* index.module.css */
.hero {
  position: relative;
  width: 100%;
  height: 80vh;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.imageWrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.image {
  object-fit: cover;
  object-position: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255, 107, 107, 0.7) 0%,
    rgba(78, 205, 196, 0.7) 100%
  );
  z-index: 1;
}

.content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: var(--color-bg-main);
  max-width: 800px;
  padding: var(--spacing-4);
}

.title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-4);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 1s ease;
}

.subtitle {
  font-size: var(--font-size-xl);
  line-height: var(--line-height-normal);
  margin-bottom: var(--spacing-6);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 1s ease 0.2s both;
}

.ctaWrapper {
  animation: fadeInUp 1s ease 0.4s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .hero {
    height: 60vh;
    min-height: 400px;
  }

  .title {
    font-size: var(--font-size-2xl);
  }

  .subtitle {
    font-size: var(--font-size-lg);
  }
}
```

---

## コンポーネント設計の原則

### 1. 再利用性

- 汎用的なPropsで設計
- 特定のページに依存しない実装
- スタイルはCSS Modulesで独立管理

### 2. レスポンシブデザイン

- モバイルファーストで設計
- ブレークポイント: 768px, 1024px
- グリッドレイアウトは `auto-fill` または `auto-fit` を使用

### 3. アクセシビリティ

- セマンティックHTML（`<article>`, `<section>`, `<nav>`等）
- ARIA属性（`aria-label`, `aria-labelledby`等）
- キーボード操作対応
- フォーカスインジケーター

### 4. パフォーマンス

- Next.js `Image` コンポーネント使用（自動最適化）
- 遅延ロード（`loading="lazy"`）
- 適切なサイズ指定（width/height）

### 5. デザインシステム準拠

- `docs/design.md` のカラーパレットとタイポグラフィ使用
- CSS変数を活用（`var(--color-primary)`, `var(--spacing-4)`等）
- 固定値の使用を避ける

---

## コンポーネント作成チェックリスト

新規コンポーネント作成時の確認事項:

- [ ] Props定義が明確で型安全である
- [ ] CSS Modulesでスタイルが分離されている
- [ ] デザインシステムのCSS変数を使用している
- [ ] レスポンシブデザインが実装されている
- [ ] セマンティックHTMLを使用している
- [ ] アクセシビリティが確保されている
- [ ] Next.js `Image` コンポーネントで画像を最適化している
- [ ] TypeScriptコンパイルエラーがない
- [ ] ホバー時のアニメーションが実装されている（カード系コンポーネント）
- [ ] 空配列・null値のハンドリングが適切である

---

## コンポーネントディレクトリ構成

全コンポーネントは以下の構成に統一:

```
app/_components/
└── ComponentName/
    ├── index.tsx         # コンポーネント本体
    └── index.module.css  # CSS Modules
```

**命名規則**:
- コンポーネント名: PascalCase（例: `ReportsList`）
- ファイル名: `index.tsx`, `index.module.css`
- CSS クラス名: camelCase（例: `.container`, `.imageWrapper`）

---

## まとめ

### 新規作成コンポーネント（6個）

1. ReportsList
2. ReportsListItem
3. ActivityCard
4. VisionSection
5. MissionSection
6. Hero

### 変更コンポーネント（1個）

1. Header（ナビゲーションリンク変更）

### 削除コンポーネント（2-3個）

1. NewsList
2. NewsListItem
3. Hero（既存の場合のみ）

### 再利用コンポーネント（9個）

1. Footer
2. ButtonLink
3. Date
4. Category
5. Pagination
6. Article
7. ContactForm
8. Menu
9. Sheet

---

最終更新日: 2026-02-23
