# 段階的移行計画

## 移行の全体像

PLDLコーポレートサイトを「News中心のB2Bサイト」から「活動レポート中心の子供向けサービスサイト」へ全面リニューアルする。段階的に5つのフェーズに分けて実施し、各フェーズで検証とロールバック準備を行う。

### 移行期間

**総期間**: 約2-3週間

| フェーズ | 期間 | 主な作業 |
|---------|------|---------|
| フェーズ1 | 1日 | microCMS新API作成とデータ移行 |
| フェーズ2 | 2日 | API型定義と取得関数実装 |
| フェーズ3 | 5-7日 | 新ページ・コンポーネント実装 |
| フェーズ4 | 1日 | 旧ページ削除とリダイレクト設定 |
| フェーズ5 | 1日 | クリーンアップと最終検証 |

---

## フェーズ1: microCMS新API作成とデータ移行

### 目的

- microCMS管理画面で新しいAPI（`reports`, `categories`, `members`）を作成
- 既存データを新APIに移行
- 並行運用体制を確立

### 作業内容

#### 1.1 新API作成

**Reports API**:
1. microCMS管理画面にログイン
2. 「APIを作成」→「リスト形式」を選択
3. エンドポイント: `reports`
4. フィールド設定:
   - `title`: テキストフィールド（必須）
   - `category`: 参照フィールド（必須、参照先: `categories`）
   - `description`: テキストエリア（必須）
   - `thumbnail`: 画像（オプション）
   - `content`: リッチエディタ（必須）
5. API設定:
   - APIプレビュー: 有効化
   - 並び順: 公開日時（降順）

**Categories API**:
1. 「APIを作成」→「リスト形式」を選択
2. エンドポイント: `categories`
3. フィールド設定:
   - `name`: テキストフィールド（必須）
   - `description`: テキストエリア（必須）
   - `slug`: テキストフィールド（オプション）
4. 4つのカテゴリーを作成:
   - 放課後こどもラボ（afterschool）
   - 出張ワークショップ（workshop）
   - 研修（training）
   - 空間設計（space-design）

**Members API**:
1. 「APIを作成」→「リスト形式」を選択
2. エンドポイント: `members`
3. フィールド設定:
   - `name`: テキストフィールド（必須）
   - `description`: テキストフィールド（必須、旧position）
   - `thumbnail`: 画像（オプション、旧image）
   - `content`: リッチエディタまたはマークダウン（必須）

---

#### 1.2 既存データのエクスポート

1. 既存API（`news`, `category`, `member`）のデータをエクスポート
   - microCMS管理画面 → 各API → 「コンテンツをエクスポート」
   - JSON形式で保存
2. バックアップをローカルに保存（`backups/` ディレクトリ）

---

#### 1.3 データ移行

**カテゴリーの移行**:
1. 既存の `category` APIのカテゴリーを確認
2. `categories` APIに手動で作成
3. 各カテゴリーに `description` を追加
4. カテゴリーIDのマッピング表を作成（例: 旧ID → 新ID）

**ニュース → レポートの移行**:
1. 既存の `news` APIのコンテンツを1件ずつ `reports` APIにコピー
2. カテゴリー参照を新しい `categories` APIのIDに変更
3. スラッグ（`:slug`）は変更しない（URLの一貫性のため）
4. 画像URLが正しく引き継がれているか確認

**メンバーの移行**:
1. 既存の `member` APIのメンバーを1件ずつ `members` APIにコピー
2. `position` → `description`、`image` → `thumbnail` へフィールド変更
3. `content` フィールドに詳細プロフィールを追加（既存の `profile` をベースに拡張）

---

### 成果物

- [ ] `reports` API作成完了
- [ ] `categories` API作成完了（4つのカテゴリー登録済み）
- [ ] `members` API作成完了
- [ ] 全既存データのバックアップ（JSON）
- [ ] カテゴリーIDマッピング表
- [ ] データ移行完了（全コンテンツが新APIに存在）

### 検証手順

- [ ] microCMS管理画面で新APIにアクセスできる
- [ ] 各APIのコンテンツ数が旧APIと一致する
- [ ] プレビュー機能（下書き確認）が動作する
- [ ] 画像URLが正しく表示される

### ロールバック手順

- 新APIを削除するだけ（旧APIはそのまま残す）
- コードベースは未変更のため、ロールバック不要

---

## フェーズ2: API型定義と取得関数実装

### 目的

- TypeScript型定義を新APIに対応させる
- データ取得関数を実装・変更する
- 既存の動作に影響を与えず、新APIにアクセス可能にする

### 作業内容

#### 2.1 ブランチ作成

```bash
git checkout main
git pull origin main
git checkout -b feature/api-migration
```

---

#### 2.2 型定義の変更（`app/_libs/microcms.ts`）

**変更ファイル**: `app/_libs/microcms.ts`

**作業内容**:

1. **新しい型定義を追加**:
```typescript
// 追加
export type Report = {
  title: string;
  category: Category;
  description: string;
  thumbnail?: {
    url: string;
    height: number;
    width: number;
  };
  content: string;
} & MicroCMSListContent;
```

2. **Category型を変更**:
```typescript
// 変更前
export type Category = {
  name: string;
} & MicroCMSListContent;

// 変更後
export type Category = {
  name: string;
  description: string;
  slug?: string;
} & MicroCMSListContent;
```

3. **Member型を変更**:
```typescript
// 変更前
export type Member = {
  name: string;
  position: string;
  profile: string;
  image?: {
    url: string;
    height: number;
    width: number;
  };
} & MicroCMSListContent;

// 変更後
export type Member = {
  name: string;
  description: string;
  thumbnail?: {
    url: string;
    height: number;
    width: number;
  };
  content: string;
} & MicroCMSListContent;
```

4. **旧型定義にコメントを追加**（削除は後のフェーズで実施）:
```typescript
// @deprecated - フェーズ4で削除予定
export type News = {
  title: string;
  description: string;
  content: string;
  thumbnail?: {
    url: string;
    height: number;
    width: number;
  };
  category: Category;
} & MicroCMSListContent;

// @deprecated - フェーズ4で削除予定
export type Business = {
  logo?: {
    url: string;
    height: number;
    width: number;
  };
  description: string;
  image?: {
    url: string;
    height: number;
    width: number;
  };
  link: string;
} & MicroCMSListContent;
```

---

#### 2.3 取得関数の追加（`app/_libs/microcms.ts`）

**新規関数を追加**:

```typescript
// Reports取得
export async function getReportsList(options?: {
  limit?: number;
  offset?: number;
  orders?: string;
  filters?: string;
}) {
  const data = await client.getList<Report>({
    endpoint: 'reports',
    queries: {
      limit: options?.limit || 10,
      offset: options?.offset,
      orders: options?.orders,
      filters: options?.filters
    },
  });
  return data;
}

export async function getReportsDetail(
  slug: string,
  options?: {
    draftKey?: string;
  },
) {
  try {
    const data = await client.get<Report>({
      endpoint: 'reports',
      contentId: slug,
      queries: {
        draftKey: options?.draftKey,
      },
    });
    return data;
  } catch (e) {
    notFound();
  }
}
```

**既存関数を変更**:

```typescript
// getMembersListをmembersエンドポイントに変更
export async function getMembersList() {
  const data = await client.getList<Member>({
    endpoint: 'members', // 変更: member → members
  });
  return data;
}

// getCategoryListをcategoriesエンドポイントに変更
export async function getCategoryList() {
  const data = await client.getList<Category>({
    endpoint: 'categories', // 変更: category → categories
  });
  return data;
}
```

**旧関数にコメントを追加**（削除は後のフェーズで実施）:

```typescript
// @deprecated - フェーズ4で削除予定
export async function getNewsList(options?: {...}) {...}

// @deprecated - フェーズ4で削除予定
export async function getNewsDetail(slug: string, options?: {...}) {...}

// @deprecated - フェーズ4で削除予定
export async function getBusinessList() {...}
```

---

#### 2.4 定数の追加（`app/_constants/index.ts`）

**変更ファイル**: `app/_constants/index.ts`

**作業内容**:

```typescript
// 新規定数を追加
export const REPORTS_LIST_LIMIT = 10;
export const TOP_REPORTS_LIMIT = 3;

// 旧定数にコメントを追加（削除は後のフェーズで実施）
// @deprecated - フェーズ4で削除予定
export const NEWS_LIST_LIMIT = 10;
// @deprecated - フェーズ4で削除予定
export const TOP_NEWS_LIMIT = 2;
```

---

### 成果物

- [ ] `app/_libs/microcms.ts` に `Report` 型定義追加
- [ ] `Category`, `Member` 型定義変更
- [ ] `getReportsList()`, `getReportsDetail()` 関数追加
- [ ] `getMembersList()`, `getCategoryList()` 関数変更
- [ ] `app/_constants/index.ts` に新定数追加

### 検証手順

#### TypeScriptコンパイルチェック

```bash
pnpm tsc --noEmit
```

- [ ] TypeScriptエラーがない

#### ローカル環境で新API関数をテスト

`app/page.tsx` を一時的に変更してテスト:

```typescript
// app/page.tsx（一時的な変更）
export default async function Home() {
  const reports = await getReportsList({ limit: 3 });
  const members = await getMembersList();
  const categories = await getCategoryList();

  return (
    <div>
      <h1>API Test</h1>
      <h2>Reports: {reports.contents.length}</h2>
      <h2>Members: {members.contents.length}</h2>
      <h2>Categories: {categories.contents.length}</h2>
    </div>
  );
}
```

```bash
pnpm dev
```

- [ ] `http://localhost:3000` にアクセスして、データが正しく取得できる
- [ ] Reportsの件数が表示される
- [ ] Membersの件数が表示される
- [ ] Categoriesの件数が表示される

テスト完了後、`app/page.tsx` を元に戻す。

---

### ロールバック手順

```bash
git checkout main
git branch -D feature/api-migration
```

---

### コミット

```bash
git add app/_libs/microcms.ts app/_constants/index.ts
git commit -m "FEATURE: Add new API types and fetching functions for reports, categories, members

- Add Report type definition
- Update Category type with description and slug fields
- Update Member type (position→description, image→thumbnail, add content)
- Add getReportsList() and getReportsDetail() functions
- Update getMembersList() and getCategoryList() to use new endpoints
- Add REPORTS_LIST_LIMIT and TOP_REPORTS_LIMIT constants
- Mark old types and functions as deprecated

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## フェーズ3: 新ページ・コンポーネント実装

### 目的

- 新しいページ（`/activities`, `/support`, `/recruit`）を実装
- 新しいコンポーネント（`ReportsList`, `ActivityCard`等）を実装
- ホームページ（`/`）を大幅リニューアル
- Headerのナビゲーションリンクを更新

### 作業内容

このフェーズは最も大きく、以下のサブフェーズに分けて実施:

#### 3.1 新規コンポーネント作成

**作成するコンポーネント**:

1. **ReportsList** (`app/_components/ReportsList/`)
   - Props: `{ reports: Report[] }`
   - レンダリング: グリッドレイアウトでReportsListItemを表示

2. **ReportsListItem** (`app/_components/ReportsListItem/`)
   - Props: `{ report: Report }`
   - レンダリング: サムネイル、タイトル、カテゴリー、日付

3. **ActivityCard** (`app/_components/ActivityCard/`)
   - Props: `{ title: string; description: string; imageUrl?: string; link: string; }`
   - レンダリング: 活動カテゴリー紹介カード

4. **VisionSection** (`app/_components/VisionSection/`)
   - Props: `{ title: string; content: string; }`
   - レンダリング: ビジョンステートメント

5. **MissionSection** (`app/_components/MissionSection/`)
   - Props: `{ missions: Array<{ title: string; description: string; }>; }`
   - レンダリング: ミッション説明リスト

6. **Hero** (`app/_components/Hero/`)
   - Props: `{ title: string; subtitle: string; imageUrl: string; ctaText?: string; ctaLink?: string; }`
   - レンダリング: ヒーローセクション

**各コンポーネントのファイル構成**:
```
_components/
└── ComponentName/
    ├── index.tsx
    └── index.module.css
```

**検証**:
- [ ] 各コンポーネントが作成されている
- [ ] TypeScriptコンパイルエラーがない
- [ ] CSS Modulesが正しく適用されている
- [ ] デザインシステム（`docs/design.md`）に準拠している

---

#### 3.2 活動内容ページ実装（`/activities`）

**作成ファイル**:

```
app/activities/
├── page.tsx
├── page.module.css
├── [slug]/
│   ├── page.tsx
│   └── page.module.css
└── p/
    └── [current]/
        └── page.tsx
```

**`app/activities/page.tsx`**（活動内容一覧）:

```typescript
import { getReportsList, getCategoryList } from '@/app/_libs/microcms';
import { REPORTS_LIST_LIMIT } from '@/app/_constants';
import ActivityCard from '@/app/_components/ActivityCard';
import ReportsList from '@/app/_components/ReportsList';
import Pagination from '@/app/_components/Pagination';
import styles from './page.module.css';

type Props = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function ActivitiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = params?.page ? parseInt(params.page) : 1;
  const offset = (page - 1) * REPORTS_LIST_LIMIT;

  const [reportsData, categoriesData] = await Promise.all([
    getReportsList({ limit: REPORTS_LIST_LIMIT, offset }),
    getCategoryList(),
  ]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>活動内容</h1>
      <p className={styles.subtitle}>PLDLの様々な活動をご紹介します</p>

      <section className={styles.categoriesSection}>
        <h2 className={styles.sectionTitle}>4つの活動</h2>
        <div className={styles.categoriesGrid}>
          {categoriesData.contents.map((category) => (
            <ActivityCard
              key={category.id}
              title={category.name}
              description={category.description}
              link={`/activities?category=${category.id}`}
            />
          ))}
        </div>
      </section>

      <section className={styles.reportsSection}>
        <h2 className={styles.sectionTitle}>活動レポート</h2>
        <ReportsList reports={reportsData.contents} />
        <Pagination
          totalCount={reportsData.totalCount}
          current={page}
          basePath="/activities"
        />
      </section>
    </div>
  );
}
```

**`app/activities/[slug]/page.tsx`**（活動レポート詳細）:

```typescript
import { getReportsDetail } from '@/app/_libs/microcms';
import Article from '@/app/_components/Article';
import Category from '@/app/_components/Category';
import Date from '@/app/_components/Date';
import Image from 'next/image';
import styles from './page.module.css';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ dk?: string }>;
};

export default async function ReportDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const report = await getReportsDetail(slug, { draftKey: query?.dk });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Category category={report.category} />
        <h1 className={styles.title}>{report.title}</h1>
        <Date date={report.publishedAt || report.createdAt} />
      </div>

      {report.thumbnail && (
        <Image
          src={report.thumbnail.url}
          alt={report.title}
          width={report.thumbnail.width}
          height={report.thumbnail.height}
          className={styles.thumbnail}
        />
      )}

      <Article data={report} />
    </div>
  );
}
```

**検証**:
- [ ] `/activities` にアクセスできる
- [ ] 4つのカテゴリーカードが表示される
- [ ] 活動レポート一覧が表示される
- [ ] ページネーションが動作する
- [ ] `/activities/:slug` にアクセスできる
- [ ] レポート詳細が正しく表示される
- [ ] プレビュー機能（`?dk`）が動作する

---

#### 3.3 サポートページ実装（`/support`）

**作成ファイル**:

```
app/support/
├── page.tsx
└── page.module.css
```

**`app/support/page.tsx`**:

```typescript
import ButtonLink from '@/app/_components/ButtonLink';
import styles from './page.module.css';

const supportMethods = [
  {
    title: 'スキル提供',
    description: 'デザイン、プログラミング、ワークショップ企画等のスキルを提供してください。',
  },
  {
    title: '材料提供',
    description: '工作材料、本、楽器等の物品を提供してください。',
  },
  {
    title: 'ボランティア参加',
    description: 'イベント運営や子どもたちのサポートにご参加ください。',
  },
  {
    title: '寄付',
    description: '活動資金のご寄付をお願いいたします。',
  },
];

export default function SupportPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>サポート</h1>
      <p className={styles.subtitle}>PLDLの活動を支えてください</p>

      <div className={styles.methodsGrid}>
        {supportMethods.map((method) => (
          <div key={method.title} className={styles.methodCard}>
            <h2 className={styles.methodTitle}>{method.title}</h2>
            <p className={styles.methodDescription}>{method.description}</p>
          </div>
        ))}
      </div>

      <div className={styles.ctaSection}>
        <p className={styles.ctaText}>サポートに興味がある方はこちら</p>
        <ButtonLink href="/contact">お問い合わせ</ButtonLink>
      </div>
    </div>
  );
}
```

**検証**:
- [ ] `/support` にアクセスできる
- [ ] 4つのサポート方法が表示される
- [ ] お問い合わせリンクが動作する

---

#### 3.4 採用ページ実装（`/recruit`）

**作成ファイル**:

```
app/recruit/
├── page.tsx
└── page.module.css
```

**`app/recruit/page.tsx`**:

```typescript
import ButtonLink from '@/app/_components/ButtonLink';
import styles from './page.module.css';

export default function RecruitPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>採用情報</h1>
      <p className={styles.subtitle}>一緒にPLDLで働きませんか？</p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>募集要項</h2>
        <div className={styles.content}>
          <h3>職種</h3>
          <p>プログラムコーディネーター、ワークショップファシリテーター</p>

          <h3>仕事内容</h3>
          <p>子どもたちの創造性を引き出すワークショップの企画・運営、放課後こどもラボの運営サポート</p>

          <h3>求める人物像</h3>
          <ul>
            <li>子どもたちと関わることが好きな方</li>
            <li>創造的な活動に興味がある方</li>
            <li>チームで協力して働ける方</li>
          </ul>

          <h3>勤務条件</h3>
          <p>詳細はお問い合わせください。</p>
        </div>
      </section>

      <div className={styles.ctaSection}>
        <ButtonLink href="/contact?subject=recruitment">応募する</ButtonLink>
      </div>
    </div>
  );
}
```

**検証**:
- [ ] `/recruit` にアクセスできる
- [ ] 募集要項が表示される
- [ ] 応募リンクが動作する

---

#### 3.5 ホームページリニューアル（`/`）

**変更ファイル**: `app/page.tsx`, `app/page.module.css`

**`app/page.tsx`**:

```typescript
import { getReportsList, getMembersList } from '@/app/_libs/microcms';
import { TOP_REPORTS_LIMIT } from '@/app/_constants';
import Hero from '@/app/_components/Hero';
import ReportsList from '@/app/_components/ReportsList';
import VisionSection from '@/app/_components/VisionSection';
import MissionSection from '@/app/_components/MissionSection';
import ActivityCard from '@/app/_components/ActivityCard';
import ButtonLink from '@/app/_components/ButtonLink';
import styles from './page.module.css';

const activities = [
  {
    title: '放課後こどもラボ',
    description: '放課後の子どもたちの居場所づくり',
    link: '/activities?category=afterschool',
  },
  {
    title: '出張ワークショップ',
    description: '学校や施設へ出張してワークショップを実施',
    link: '/activities?category=workshop',
  },
  {
    title: '研修',
    description: '教員や支援者向けの研修プログラム',
    link: '/activities?category=training',
  },
  {
    title: '空間設計',
    description: '子どもたちが創造的に過ごせる空間の設計',
    link: '/activities?category=space-design',
  },
];

const missions = [
  {
    title: '子どもの主体性を尊重',
    description: '子ども自身の「やりたい！」を大切にします',
  },
  {
    title: '創造的な学びの場',
    description: 'アート、プログラミング、工作等、多様な活動を提供',
  },
  {
    title: '地域とのつながり',
    description: '地域の方々と協力し、子どもたちを支えます',
  },
];

export default async function Home() {
  const [reportsData, membersData] = await Promise.all([
    getReportsList({ limit: TOP_REPORTS_LIMIT }),
    getMembersList(),
  ]);

  return (
    <>
      <Hero
        title="子どもたちの「やりたい！」を引き出す"
        subtitle="PLDLは放課後こどもラボ、出張ワークショップ等を通じて、子どもたちの創造性と自主性を育みます。"
        imageUrl="/hero-image.jpg"
        ctaText="活動内容を見る"
        ctaLink="/activities"
      />

      <section className={styles.reportsSection}>
        <h2 className={styles.sectionTitle}>活動レポート</h2>
        <ReportsList reports={reportsData.contents} />
        <ButtonLink href="/activities">すべて見る</ButtonLink>
      </section>

      <VisionSection
        title="ビジョン"
        content="すべての子どもたちが、自分の「やりたい！」を見つけ、創造的に学べる社会を目指します。"
      />

      <MissionSection missions={missions} />

      <section className={styles.activitiesSection} id="activities">
        <h2 className={styles.sectionTitle}>活動内容</h2>
        <div className={styles.activitiesGrid}>
          {activities.map((activity) => (
            <ActivityCard key={activity.title} {...activity} />
          ))}
        </div>
      </section>

      <section className={styles.membersSection} id="members">
        <h2 className={styles.sectionTitle}>メンバー</h2>
        <div className={styles.membersGrid}>
          {membersData.contents.map((member) => (
            <div key={member.id} className={styles.memberCard}>
              {member.thumbnail && (
                <img
                  src={member.thumbnail.url}
                  alt={member.name}
                  className={styles.memberImage}
                />
              )}
              <h3 className={styles.memberName}>{member.name}</h3>
              <p className={styles.memberDescription}>{member.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.snsSection}>
        <h2 className={styles.sectionTitle}>SNS</h2>
        <div className={styles.snsLinks}>
          <a href="https://instagram.com/pldl" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://facebook.com/pldl" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com/pldl" target="_blank" rel="noopener noreferrer">Twitter</a>
        </div>
      </section>
    </>
  );
}
```

**検証**:
- [ ] `/` にアクセスできる
- [ ] Heroセクションが表示される
- [ ] 活動レポートが表示される
- [ ] VISIONセクションが表示される
- [ ] MISSIONセクションが表示される
- [ ] 4つの活動カテゴリーが表示される
- [ ] メンバーセクションが表示される
- [ ] SNSリンクが表示される

---

#### 3.6 Headerナビゲーション更新

**変更ファイル**: `app/_components/Header/index.tsx`

**変更内容**:

```typescript
// 変更前
<Link href="/news">ニュース</Link>
<Link href="/business">事業内容</Link>
<Link href="/members">メンバー</Link>
<Link href="#">採用情報</Link>

// 変更後
<Link href="/activities">活動内容</Link>
<Link href="/support">サポート</Link>
<Link href="/recruit">採用情報</Link>
<Link href="/#members">メンバー</Link>
```

**検証**:
- [ ] ナビゲーションリンクが正しく更新されている
- [ ] 各リンクをクリックして正しいページに遷移する
- [ ] アンカーリンク（`/#members`）が正しく動作する

---

### 成果物

- [ ] 6つの新規コンポーネント作成完了
- [ ] `/activities` ページ実装完了
- [ ] `/activities/:slug` ページ実装完了
- [ ] `/support` ページ実装完了
- [ ] `/recruit` ページ実装完了
- [ ] `/` ホームページリニューアル完了
- [ ] Headerナビゲーション更新完了

### 検証手順

#### TypeScriptコンパイルチェック

```bash
pnpm tsc --noEmit
```

- [ ] TypeScriptエラーがない

#### ローカル環境でページ確認

```bash
pnpm dev
```

- [ ] `/` - ホームページが正しく表示される
- [ ] `/activities` - 活動内容一覧が正しく表示される
- [ ] `/activities/:slug` - 活動レポート詳細が正しく表示される
- [ ] `/support` - サポートページが正しく表示される
- [ ] `/recruit` - 採用ページが正しく表示される
- [ ] Headerのナビゲーションが正しく動作する

#### デザイン確認

- [ ] デザインシステム（`docs/design.md`）に準拠している
- [ ] カラーパレット案A（ビビッドポップ）が使用されている
- [ ] レスポンシブデザインが適用されている
- [ ] アクセシビリティが確保されている

---

### ロールバック手順

```bash
git checkout main
git branch -D feature/api-migration
```

---

### コミット

```bash
git add app/_components/ app/activities/ app/support/ app/recruit/ app/page.tsx app/page.module.css
git commit -m "FEATURE: Implement new pages and components for PLDL restructuring

- Add ReportsList, ReportsListItem, ActivityCard, VisionSection, MissionSection, Hero components
- Implement /activities page (activity list and report details)
- Implement /support page
- Implement /recruit page
- Redesign home page (/, Hero, VISION, MISSION, Member, Activities, SNS sections)
- Update Header navigation links

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## フェーズ4: 旧ページ削除とリダイレクト設定

### 目的

- 旧ページ（`/news`, `/business`, `/members`）を削除
- 301リダイレクトを設定
- 旧コンポーネント（`NewsList`, `NewsListItem`）を削除
- 旧型定義・関数を削除

### 作業内容

#### 4.1 旧ページディレクトリ削除

```bash
rm -rf app/news
rm -rf app/business
rm -rf app/members
```

**検証**:
- [ ] `app/news/` ディレクトリが削除されている
- [ ] `app/business/` ディレクトリが削除されている
- [ ] `app/members/` ディレクトリが削除されている

---

#### 4.2 旧コンポーネント削除

```bash
rm -rf app/_components/NewsList
rm -rf app/_components/NewsListItem
```

**検証**:
- [ ] `app/_components/NewsList/` ディレクトリが削除されている
- [ ] `app/_components/NewsListItem/` ディレクトリが削除されている

---

#### 4.3 旧型定義・関数削除（`app/_libs/microcms.ts`）

**削除内容**:

```typescript
// 削除
export type News = {...}
export type Business = {...}

export async function getNewsList(options?: {...}) {...}
export async function getNewsDetail(slug: string, options?: {...}) {...}
export async function getBusinessList() {...}
```

**検証**:
- [ ] TypeScriptコンパイルエラーがない
- [ ] 削除した型・関数を参照しているコードがない

---

#### 4.4 旧定数削除（`app/_constants/index.ts`）

**削除内容**:

```typescript
// 削除
export const NEWS_LIST_LIMIT = 10;
export const TOP_NEWS_LIMIT = 2;
```

**検証**:
- [ ] TypeScriptコンパイルエラーがない

---

#### 4.5 301リダイレクト設定（`next.config.js`）

**変更ファイル**: `next.config.js`

**追加内容**:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... 既存の設定 ...

  async redirects() {
    return [
      // ニュース一覧 → 活動内容一覧
      {
        source: '/news',
        destination: '/activities',
        permanent: true, // 301リダイレクト
      },
      // ニュース詳細 → 活動レポート詳細
      {
        source: '/news/:slug',
        destination: '/activities/:slug',
        permanent: true,
      },
      // ニュースページネーション → 活動内容ページネーション
      {
        source: '/news/p/:current',
        destination: '/activities/p/:current',
        permanent: true,
      },
      // 事業内容 → 活動内容一覧
      {
        source: '/business',
        destination: '/activities',
        permanent: true,
      },
      // メンバー → ホーム（メンバーセクション）
      {
        source: '/members',
        destination: '/#members',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

**検証**:
- [ ] リダイレクト設定が追加されている
- [ ] ローカル環境で各リダイレクトが動作する

---

#### 4.6 キャッシュ戦略調整（`proxy.ts`）

**変更ファイル**: `proxy.ts`

**変更内容**:

```typescript
// 変更前
export const config = {
  matcher: ['/news/:path*', '/business', '/members'],
};

// 変更後
export const config = {
  matcher: ['/activities/:path*', '/support', '/recruit'],
};
```

**検証**:
- [ ] matcher が更新されている
- [ ] `/activities/:path*` でキャッシュが動作する
- [ ] プレビュー機能（`?dk`）でキャッシュが無効化される

---

### 成果物

- [ ] 旧ページディレクトリ削除完了
- [ ] 旧コンポーネント削除完了
- [ ] 旧型定義・関数削除完了
- [ ] 旧定数削除完了
- [ ] 301リダイレクト設定完了
- [ ] キャッシュ戦略調整完了

### 検証手順

#### TypeScriptコンパイルチェック

```bash
pnpm tsc --noEmit
```

- [ ] TypeScriptエラーがない

#### ローカル環境でリダイレクト確認

```bash
pnpm dev
```

- [ ] `/news` → `/activities` （301リダイレクト）
- [ ] `/news/:slug` → `/activities/:slug` （301リダイレクト）
- [ ] `/news/p/:current` → `/activities/p/:current` （301リダイレクト）
- [ ] `/business` → `/activities` （301リダイレクト）
- [ ] `/members` → `/#members` （301リダイレクト）

ブラウザのDevToolsでステータスコード301を確認。

---

### ロールバック手順

```bash
git checkout main
git branch -D feature/api-migration
```

microCMS管理画面で旧API（`news`, `category`, `member`, `business`）は削除していないため、コードベースをロールバックすれば元の状態に戻る。

---

### コミット

```bash
git add .
git commit -m "FEATURE: Remove old pages and set up 301 redirects

- Remove /news, /business, /members pages
- Remove NewsList and NewsListItem components
- Remove News and Business types and functions
- Remove old constants (NEWS_LIST_LIMIT, TOP_NEWS_LIMIT)
- Add 301 redirects in next.config.js
- Update proxy.ts matcher for new pages

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## フェーズ5: クリーンアップと最終検証

### 目的

- コードベースの整合性を確認
- SEO設定を最終確認
- パフォーマンステスト
- microCMS旧API削除（オプション）

### 作業内容

#### 5.1 コードベース整合性チェック

**TypeScriptコンパイルチェック**:

```bash
pnpm tsc --noEmit
```

- [ ] TypeScriptエラーがない

**未使用import検出**（eslint無効化のため手動確認）:

- [ ] 全ファイルで未使用のimportがない
- [ ] 未使用の型定義がない

**リンク切れチェック**:

- [ ] 全ページのリンクをクリックして動作確認
- [ ] 内部リンクが正しく動作する
- [ ] 外部リンクが正しく動作する

---

#### 5.2 SEO設定確認

**メタデータ確認**:

- [ ] 各ページに `metadata` が設定されている
- [ ] OGP画像が設定されている
- [ ] ページタイトルが適切である
- [ ] メタディスクリプションが適切である

**XMLサイトマップ更新**:

- [ ] XMLサイトマップを更新（新しいURL構造に対応）
- [ ] `sitemap.xml` に新しいページが含まれている
- [ ] 旧URLが削除されている

**robots.txt確認**:

- [ ] `robots.txt` に問題がない

---

#### 5.3 パフォーマンステスト

**Lighthouseスコア確認**:

```bash
pnpm build
pnpm start
```

Chromeブラウザで各ページを開き、Lighthouse監査を実行:

- [ ] Performance: 90以上
- [ ] Accessibility: 90以上
- [ ] Best Practices: 90以上
- [ ] SEO: 90以上

**バンドルサイズ確認**:

```bash
pnpm build
```

ビルドログでバンドルサイズを確認:

- [ ] 主要ページのバンドルサイズが適切（目安: 200KB以下）
- [ ] 画像が最適化されている

---

#### 5.4 プレビューデプロイとテスト

**Vercelプレビューデプロイ**:

```bash
git push origin feature/api-migration
```

- [ ] Vercelで自動的にプレビューデプロイが作成される
- [ ] プレビューURLにアクセスできる

**プレビュー環境でテスト**:

- [ ] 全ページが正しく表示される
- [ ] リダイレクトが正しく動作する（ステータスコード301確認）
- [ ] microCMS新APIからデータが取得できる
- [ ] プレビュー機能（`?dk`）が動作する

---

#### 5.5 本番デプロイ

**mainブランチへのマージ**:

```bash
git checkout main
git pull origin main
git merge feature/api-migration
git push origin main
```

- [ ] mainブランチへのマージ完了
- [ ] Vercelで本番デプロイが開始される

**本番環境でテスト**:

- [ ] 全ページが正しく表示される
- [ ] リダイレクトが正しく動作する
- [ ] microCMS新APIからデータが取得できる
- [ ] SEO設定が正しく反映されている

---

#### 5.6 SEO対策実施

**Google Search Console**:

- [ ] アドレス変更通知を送信
- [ ] 新しいXMLサイトマップを送信
- [ ] インデックス状況を確認

**Google Analytics**:

- [ ] オーガニック検索トラフィックを監視開始
- [ ] 1週間、2週間、1ヶ月後に確認予定

---

#### 5.7 microCMS旧API削除（オプション、1ヶ月後）

**並行運用期間終了後**:

- [ ] 1ヶ月間の並行運用期間が終了
- [ ] SEO指標に大きな影響がないことを確認
- [ ] Google Search Consoleでインデックスが正常に更新されている

**旧API削除**:

microCMS管理画面で以下のAPIを削除:

- [ ] `news` API削除
- [ ] `category` API削除
- [ ] `member` API削除
- [ ] `business` API削除

**削除前のバックアップ確認**:

- [ ] フェーズ1で作成したバックアップ（JSON）が保存されている

---

### 成果物

- [ ] TypeScriptコンパイルエラー0
- [ ] Lighthouseスコア全90以上
- [ ] プレビューデプロイ成功
- [ ] 本番デプロイ成功
- [ ] Google Search Console設定完了
- [ ] 旧API削除完了（1ヶ月後）

### 検証手順

#### 全体的な動作確認

- [ ] `/` - ホームページが正しく表示される
- [ ] `/activities` - 活動内容一覧が正しく表示される
- [ ] `/activities/:slug` - 活動レポート詳細が正しく表示される
- [ ] `/support` - サポートページが正しく表示される
- [ ] `/recruit` - 採用ページが正しく表示される
- [ ] `/contact` - お問い合わせページが正しく表示される
- [ ] リダイレクトが正しく動作する
- [ ] プレビュー機能（`?dk`）が動作する

---

### ロールバック手順

万が一、本番環境で重大な問題が発生した場合:

1. **Vercelでロールバック**:
   - Vercel管理画面 → Deployments → 前回のデプロイを「Promote to Production」

2. **コードベースをロールバック**:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

3. **microCMS旧APIの再有効化**:
   - 削除していなければ、そのまま使用可能
   - 削除済みの場合は、バックアップから復元

---

### コミット

```bash
git add .
git commit -m "DOC: Update documentation and finalize PLDL restructuring

- Update INDEX.md with architecture documentation
- Verify SEO settings and metadata
- Confirm Lighthouse scores
- Update sitemap.xml with new URL structure

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## 依存関係グラフ

各フェーズの依存関係を以下に示す:

```
フェーズ1: microCMS新API作成とデータ移行
   ↓
フェーズ2: API型定義と取得関数実装
   ↓
フェーズ3: 新ページ・コンポーネント実装
   ├─ 3.1 新規コンポーネント作成
   ├─ 3.2 活動内容ページ実装
   ├─ 3.3 サポートページ実装
   ├─ 3.4 採用ページ実装
   ├─ 3.5 ホームページリニューアル
   └─ 3.6 Headerナビゲーション更新
   ↓
フェーズ4: 旧ページ削除とリダイレクト設定
   ↓
フェーズ5: クリーンアップと最終検証
```

---

## リスク分析と軽減策

### 高リスク

#### 1. SEO影響（検索順位低下）

**リスク内容**:
- URL変更により、既存ページの検索順位が低下する可能性
- オーガニック検索トラフィックが減少する可能性

**影響度**: 高（ビジネスへの影響大）

**軽減策**:
- 301リダイレクトを適切に設定
- Google Search Consoleでアドレス変更通知を送信
- XMLサイトマップを更新し、新しいURLを登録
- スラッグ（`:slug`）は変更せず、パスのみ変更（URLの一貫性確保）
- 少なくとも6ヶ月間は301リダイレクトを維持

**監視方法**:
- Google Search Consoleでインデックス状況を毎週確認
- Google Analyticsでオーガニック検索トラフィックを毎日確認
- 1週間、2週間、1ヶ月、3ヶ月後に詳細分析

---

#### 2. データ移行ミス（データ損失）

**リスク内容**:
- News → Reports 移行時にコンテンツが欠落する可能性
- カテゴリーマッピングが正しく行われない可能性
- 画像URLが正しく引き継がれない可能性

**影響度**: 高（コンテンツ損失は致命的）

**軽減策**:
- フェーズ1で既存データを必ずバックアップ（JSON形式）
- 移行後、全コンテンツ件数を確認（旧API件数と一致するか）
- ランダムサンプリングで10-20件のコンテンツを詳細確認
- 並行運用期間（1ヶ月）を設け、旧APIを保持

**復旧方法**:
- バックアップから復元
- 旧APIから再度手動移行

---

### 中リスク

#### 3. コンポーネント依存関係の破壊

**リスク内容**:
- 旧コンポーネント削除時に、意図しない影響が発生する可能性
- TypeScriptエラーが見逃される可能性

**影響度**: 中（サイトの一部が動作しなくなる）

**軽減策**:
- 各フェーズでTypeScriptコンパイルチェック（`pnpm tsc --noEmit`）
- 旧コンポーネント削除前に、参照箇所を検索（`grep -r "NewsList" app/`）
- 段階的削除（一度に全て削除しない）

**復旧方法**:
- Gitでロールバック
- TypeScriptエラーを修正

---

#### 4. ダウンタイム

**リスク内容**:
- デプロイ中にサイトが一時的に停止する可能性

**影響度**: 中（ユーザー体験への影響）

**軽減策**:
- Vercelのゼロダウンタイムデプロイを活用
- プレビューデプロイで事前検証
- オフピーク時間にデプロイ（深夜等）

**復旧方法**:
- Vercelで前回のデプロイをPromote to Production

---

### 低リスク

#### 5. パフォーマンス低下

**リスク内容**:
- 新コンポーネント追加によりバンドルサイズが増加する可能性
- Lighthouseスコアが低下する可能性

**影響度**: 低（ユーザー体験への軽微な影響）

**軽減策**:
- Next.js `Image` コンポーネントで画像最適化
- コード分割（App Routerで自動実装）
- フェーズ5でLighthouseスコア確認

**復旧方法**:
- パフォーマンスボトルネックを特定し、最適化
- 必要に応じて遅延ロード（dynamic import）を実装

---

## まとめ

### 移行の成功基準

- [ ] 全新規ページが正しく動作する
- [ ] 301リダイレクトが正しく機能する
- [ ] TypeScriptコンパイルエラーが0
- [ ] Lighthouseスコアが全90以上
- [ ] SEO指標（検索順位、トラフィック）に大きな影響がない
- [ ] データ損失が0
- [ ] ダウンタイムが0

### 次のステップ（移行完了後）

1. **SEO監視継続**（1-3ヶ月）
   - Google Search ConsoleとGoogle Analyticsで継続的に監視

2. **旧API削除**（1ヶ月後）
   - SEO影響がないことを確認後、microCMS旧APIを削除

3. **ユーザーフィードバック収集**
   - 新しいサイトに対するユーザーの反応を収集
   - 改善点を特定

4. **継続的な改善**
   - 新しいコンテンツ追加
   - デザインの微調整
   - パフォーマンス最適化

---

最終更新日: 2026-02-23
