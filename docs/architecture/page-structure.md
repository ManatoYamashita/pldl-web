# ページ構成設計

## 新旧ページ対応表

| 現在のページ | 新しいページ | 備考 |
|-------------|-------------|------|
| `/` | `/` | 大幅リニューアル（Hero, VISION, MISSION, Member, 活動内容, SNS） |
| `/news` | `/activities` | URLリダイレクト必須（301） |
| `/news/:slug` | `/activities/:slug` | URLリダイレクト必須（301） |
| `/news/p/:current` | `/activities/p/:current` | ページネーションURLリダイレクト（301） |
| `/business` | `/activities` | 削除、リダイレクト（301） |
| `/members` | `/` | ホームにメンバーセクション統合、リダイレクト（301） |
| `/contact` | `/contact` | 変更なし |
| - | `/support` | 新規作成（スキル、材料、ボランティア、寄付） |
| - | `/recruit` | 新規作成（採用情報） |

---

## App Routerディレクトリツリー（新規構成）

```
app/
├── page.tsx                      # ホーム（Hero, VISION, MISSION, Member, 活動内容, SNS）
├── page.module.css
├── layout.tsx                    # ルートレイアウト（変更なし）
├── globals.css                   # グローバルスタイル（変更なし）
├── not-found.tsx                 # 404ページ（変更なし）
│
├── activities/                   # 活動内容（新規）★
│   ├── page.tsx                  # 活動内容一覧（カテゴリー紹介 + 全活動レポート）
│   ├── page.module.css
│   ├── [slug]/
│   │   ├── page.tsx              # 活動レポート詳細
│   │   └── page.module.css
│   └── p/
│       └── [current]/
│           └── page.tsx          # ページネーション
│
├── support/                      # サポート（新規）★
│   ├── page.tsx
│   └── page.module.css
│
├── recruit/                      # 採用（新規）★
│   ├── page.tsx
│   └── page.module.css
│
├── contact/                      # お問い合わせ（既存、変更なし）
│   ├── page.tsx
│   └── page.module.css
│
├── api/
│   └── submit-contact/
│       └── route.ts              # お問い合わせAPI（変更なし）
│
└── _components/
    ├── Header/                   # ヘッダー（ナビゲーションリンク変更必要）★
    ├── Footer/                   # フッター（変更なし）
    ├── ButtonLink/               # ボタンリンク（変更なし）
    ├── Date/                     # 日付表示（変更なし）
    ├── Category/                 # カテゴリータグ（変更なし）
    ├── Pagination/               # ページネーション（変更なし）
    ├── Article/                  # 記事本文表示（変更なし）
    ├── ContactForm/              # お問い合わせフォーム（変更なし）
    ├── Menu/                     # メニュー（変更なし）
    ├── Sheet/                    # ドロアー（変更なし）
    │
    ├── ReportsList/              # 新規★
    ├── ReportsListItem/          # 新規★
    ├── ActivityCard/             # 新規★
    ├── VisionSection/            # 新規★
    ├── MissionSection/           # 新規★
    └── Hero/                     # 新規★

※ ★マークは新規作成または変更が必要なファイル
```

---

## 削除するディレクトリ・ファイル

以下のディレクトリ・ファイルは削除対象：

```
app/
├── news/                         # 削除（/activitiesに置き換え）
│   ├── page.tsx
│   ├── page.module.css
│   ├── [slug]/
│   │   └── page.tsx
│   └── p/
│       └── [current]/
│           └── page.tsx
│
├── business/                     # 削除
│   ├── page.tsx
│   └── page.module.css
│
├── members/                      # 削除（ホームに統合）
│   ├── page.tsx
│   └── page.module.css
│
└── _components/
    ├── NewsList/                 # 削除（ReportsListに置き換え）
    ├── NewsListItem/             # 削除（ReportsListItemに置き換え）
    └── Hero/                     # 削除（新しいHeroで置き換え、存在する場合）
```

---

## 各ページの責務とセクション構成

### ホーム（`/`）

**ページの目的**: PLDLの理念、活動内容、メンバーを紹介し、サポート・採用への導線を提供する

**セクション構成**:

1. **Hero**（ヒーローセクション）
   - キャッチコピー: 「子どもたちの『やりたい！』を引き出す」
   - メインビジュアル: 子どもたちが活動している写真
   - CTAボタン: 「活動内容を見る」「サポートする」

2. **Post（活動レポート）**
   - 最新の活動レポート2-3件をカード形式で表示
   - 「すべて見る」リンク → `/activities`

3. **VISION**（ビジョンステートメント）
   - PLDLのビジョンを大きなタイポグラフィで表示
   - センター寄せレイアウト

4. **MISSION**（ミッション説明）
   - 3-4つのミッションをアイコン付きリストで表示
   - 各ミッションの説明文

5. **Member**（メンバー紹介）
   - メンバーカードをグリッド表示（写真、名前、役割）
   - クリックで詳細モーダルまたはメンバー詳細セクションへスクロール

6. **活動内容**（4つのカテゴリー紹介）
   - 放課後こどもラボ
   - 出張ワークショップ
   - 研修
   - 空間設計
   - 各カードをクリック → `/activities?category=xxx`

7. **SNS**（SNSリンク）
   - Instagram, Facebook, Twitter等のリンク
   - SNSアイコンをホバー時にアニメーション

**使用コンポーネント**:
- `Hero`（新規作成）
- `ReportsList`（新規作成、TOP_REPORTS_LIMIT=2-3件表示）
- `VisionSection`（新規作成）
- `MissionSection`（新規作成）
- `MemberCard`（Member再利用または新規作成）
- `ActivityCard`（新規作成）
- `ButtonLink`（既存）

**データ取得**:
```typescript
const reports = await getReportsList({ limit: TOP_REPORTS_LIMIT });
const members = await getMembersList();
```

---

### 活動内容（`/activities`）

**ページの目的**: PLDLの4つの活動カテゴリーと全活動レポートを一覧表示

**セクション構成**:

1. **ページタイトル**
   - 「活動内容」
   - サブタイトル: 「PLDLの様々な活動をご紹介します」

2. **4つの活動カテゴリー紹介カード**
   - 放課後こどもラボ: 放課後の子どもたちの居場所づくり
   - 出張ワークショップ: 学校や施設へ出張してワークショップを実施
   - 研修: 教員や支援者向けの研修プログラム
   - 空間設計: 子どもたちが創造的に過ごせる空間の設計
   - 各カードをクリック → カテゴリーでフィルタリング

3. **全活動レポート一覧**
   - グリッドレイアウト（2-3カラム）
   - カテゴリーフィルター機能（オプション）
   - ページネーション（10件/ページ）

**使用コンポーネント**:
- `ActivityCard`（新規作成）
- `ReportsList`（新規作成）
- `ReportsListItem`（新規作成）
- `Pagination`（既存）
- `Category`（既存）

**データ取得**:
```typescript
const page = searchParams?.page ? parseInt(searchParams.page) : 1;
const offset = (page - 1) * REPORTS_LIST_LIMIT;
const reports = await getReportsList({ limit: REPORTS_LIST_LIMIT, offset });
```

**URL例**:
- `/activities` - 全活動レポート
- `/activities?category=afterschool` - カテゴリーフィルター
- `/activities/p/2` - 2ページ目

---

### 活動レポート詳細（`/activities/:slug`）

**ページの目的**: 個別の活動レポートの詳細を表示

**セクション構成**:

1. **ヘッダー情報**
   - タイトル
   - カテゴリータグ
   - 公開日

2. **サムネイル画像**

3. **記事本文**
   - リッチエディタまたはマークダウンで記述されたコンテンツ
   - 画像、見出し、リスト等を含む

4. **関連レポート**（オプション）
   - 同じカテゴリーの他のレポート2-3件

**使用コンポーネント**:
- `Article`（既存、リッチエディタコンテンツのパース）
- `Category`（既存）
- `Date`（既存）
- `Image`（Next.js）

**データ取得**:
```typescript
const { slug } = await params;
const report = await getReportsDetail(slug);
```

---

### サポート（`/support`）

**ページの目的**: PLDLをサポートする4つの方法を紹介

**セクション構成**:

1. **ページタイトル**
   - 「サポート」
   - サブタイトル: 「PLDLの活動を支えてください」

2. **4つのサポート方法紹介**
   - **スキル提供**: デザイン、プログラミング、ワークショップ企画等のスキルを提供
   - **材料提供**: 工作材料、本、楽器等の物品提供
   - **ボランティア参加**: イベント運営、子どもたちのサポート
   - **寄付**: 活動資金の寄付

3. **お問い合わせフォームへのリンク**
   - 「サポートに興味がある方はこちら」 → `/contact`

**使用コンポーネント**:
- `SupportCard`（新規作成）
- `ButtonLink`（既存）

**データ取得**: なし（静的コンテンツ）

---

### 採用（`/recruit`）

**ページの目的**: 採用情報と募集要項を掲載

**セクション構成**:

1. **ページタイトル**
   - 「採用情報」
   - サブタイトル: 「一緒にPLDLで働きませんか？」

2. **募集要項**
   - 職種: プログラムコーディネーター、ワークショップファシリテーター等
   - 仕事内容
   - 求める人物像
   - 勤務条件

3. **応募フォームへのリンク**
   - 「応募する」 → `/contact?subject=recruitment`

**使用コンポーネント**:
- `ButtonLink`（既存）

**データ取得**: なし（静的コンテンツ）

---

### お問い合わせ（`/contact`）

**ページの目的**: お問い合わせフォームを提供

**変更内容**: なし（既存のまま）

**使用コンポーネント**:
- `ContactForm`（既存）

---

## SEO影響分析とリダイレクト設計

### URL変更による影響

| 変更内容 | SEO影響度 | 影響範囲 | 対策 |
|---------|-----------|---------|------|
| `/news` → `/activities` | **高** | ニュース一覧ページの検索順位、被リンク | 301リダイレクト、Google Search Console通知 |
| `/news/:slug` → `/activities/:slug` | **高** | 個別記事ページの検索順位、被リンク | 301リダイレクト、URLパターン維持 |
| `/business` → `/activities` | **中** | 事業内容ページの検索順位 | 301リダイレクト |
| `/members` → `/` | **中** | メンバーページの検索順位 | 301リダイレクト、アンカーリンク（/#members） |
| `/contact` | **影響なし** | 変更なし | - |

### 301リダイレクト設定（`next.config.js`）

`next.config.js` の `async redirects()` に以下を追加：

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

### SEO対策チェックリスト

#### 移行前

- [ ] Google Search Consoleで現在のインデックス状況を確認
- [ ] 主要ページのオーガニック検索トラフィックをGoogle Analyticsで記録
- [ ] 主要バックリンクをGoogle Search Consoleで確認
- [ ] XMLサイトマップをエクスポート

#### 移行時

- [ ] 301リダイレクトを `next.config.js` に設定
- [ ] リダイレクトが正しく動作することを確認（ステータスコード301）
- [ ] XMLサイトマップを更新（新しいURL構造に対応）
- [ ] `robots.txt` を確認（必要に応じて更新）

#### 移行後

- [ ] Google Search Consoleでアドレス変更通知を送信
- [ ] 新しいXMLサイトマップを送信
- [ ] Google Search Consoleでインデックス状況を監視（1-2週間）
- [ ] Google Analyticsでオーガニック検索トラフィックを監視
- [ ] 主要バックリンク元に連絡（可能であれば）
- [ ] 404エラーが発生していないか確認

### SEOリスク軽減策

1. **301リダイレクトの永続性**
   - 少なくとも6ヶ月間は301リダイレクトを維持
   - Google等の検索エンジンがインデックスを完全に更新するまで保持

2. **URLパターンの一貫性**
   - スラッグ（`:slug`）は変更せず、パスのみ変更
   - これにより、既存のバックリンクが可能な限り機能し続ける

3. **段階的な監視**
   - 移行後1週間、2週間、1ヶ月、3ヶ月のタイミングでSEO指標を確認
   - トラフィック低下が顕著な場合は原因を特定し対策

4. **コンテンツの品質維持**
   - 既存のコンテンツ（タイトル、メタディスクリプション、本文）は可能な限り維持
   - 新しいページでもSEOベストプラクティス（適切な見出し構造、alt属性等）を遵守

---

## メタデータとOGP設定

### 各ページのメタデータ

Next.js App Routerの `metadata` エクスポートを使用してSEO対策を実施：

#### ホーム（`/`）

```typescript
export const metadata: Metadata = {
  title: 'PLDL - 子どもたちの「やりたい！」を引き出す',
  description: 'PLDLは放課後こどもラボ、出張ワークショップ、研修、空間設計を通じて、子どもたちの創造性と自主性を育む活動を行っています。',
  openGraph: {
    title: 'PLDL - 子どもたちの「やりたい！」を引き出す',
    description: 'PLDLは放課後こどもラボ、出張ワークショップ、研修、空間設計を通じて、子どもたちの創造性と自主性を育む活動を行っています。',
    images: ['/og-image.jpg'],
  },
};
```

#### 活動内容（`/activities`）

```typescript
export const metadata: Metadata = {
  title: '活動内容 | PLDL',
  description: 'PLDLの活動内容をご紹介します。放課後こどもラボ、出張ワークショップ、研修、空間設計など、様々な活動を行っています。',
  openGraph: {
    title: '活動内容 | PLDL',
    description: 'PLDLの活動内容をご紹介します。放課後こどもラボ、出張ワークショップ、研修、空間設計など、様々な活動を行っています。',
  },
};
```

#### 活動レポート詳細（`/activities/:slug`）

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const report = await getReportsDetail(slug);

  return {
    title: `${report.title} | PLDL`,
    description: report.description,
    openGraph: {
      title: `${report.title} | PLDL`,
      description: report.description,
      images: report.thumbnail ? [report.thumbnail.url] : [],
    },
  };
}
```

---

## アクセシビリティ対応

### 各ページで実装すべきアクセシビリティ対応

1. **セマンティックHTML**
   - `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` 等を適切に使用

2. **見出し構造**
   - `<h1>` は1ページに1つのみ
   - `<h2>`, `<h3>` 等を階層的に使用

3. **画像のalt属性**
   - 全ての画像に適切な `alt` 属性を設定
   - 装飾的な画像は `alt=""` で空にする

4. **リンクとボタン**
   - リンクテキストは意味のあるテキストにする（「こちら」は避ける）
   - ボタンは `<button>` または `role="button"` を使用

5. **キーボード操作**
   - 全てのインタラクティブ要素がキーボードで操作可能
   - フォーカスインジケーターを適切に表示

6. **ARIA属性**
   - `aria-label`, `aria-labelledby`, `aria-describedby` 等を必要に応じて使用

---

## パフォーマンス対策

### 画像最適化

- Next.js の `Image` コンポーネントを使用
- `loading="lazy"` でスクロール外の画像を遅延ロード
- 適切なサイズ（width/height）を指定

### コード分割

- 各ページは自動的にコード分割される（App Router）
- 大きなコンポーネントは `dynamic` でクライアント側ロード

### キャッシング

- `proxy.ts` でISRキャッシュを設定（60秒、stale-while-revalidate 300秒）
- プレビュー機能（`?dk`）使用時はキャッシュ無効化

---

## まとめ

### 新規作成ページ

- `/activities` - 活動内容一覧
- `/activities/:slug` - 活動レポート詳細
- `/activities/p/:current` - ページネーション
- `/support` - サポート
- `/recruit` - 採用

### 変更ページ

- `/` - トップページ（大幅リニューアル）

### 削除ページ

- `/news` → 301リダイレクト
- `/news/:slug` → 301リダイレクト
- `/news/p/:current` → 301リダイレクト
- `/business` → 301リダイレクト
- `/members` → 301リダイレクト

### 継続ページ

- `/contact` - お問い合わせ（変更なし）

---

最終更新日: 2026-02-23
