# microCMS API設計

## 現行APIスキーマ

### News API

- **エンドポイント**: `news`
- **API型**: リスト形式
- **フィールド**:
  - `title`: テキストフィールド - ニュースタイトル
  - `description`: テキストエリア - ニュース概要
  - `content`: リッチエディタ - ニュース本文
  - `thumbnail`: 画像 - サムネイル画像
  - `category`: 参照（categories） - カテゴリー

**型定義**:
```typescript
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
```

**使用箇所**:
- `/news` - ニュース一覧
- `/news/:slug` - ニュース詳細
- `/` - トップページ（最新2件表示）

---

### Category API

- **エンドポイント**: `category`
- **API型**: リスト形式
- **フィールド**:
  - `name`: テキストフィールド - カテゴリー名

**型定義**:
```typescript
export type Category = {
  name: string;
} & MicroCMSListContent;
```

**使用箇所**:
- カテゴリータグ表示
- カテゴリーフィルター

---

### Member API

- **エンドポイント**: `member`
- **API型**: リスト形式
- **フィールド**:
  - `name`: テキストフィールド - メンバー名
  - `position`: テキストフィールド - 役職
  - `profile`: テキストエリア - プロフィール
  - `image`: 画像 - プロフィール画像

**型定義**:
```typescript
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
```

**使用箇所**:
- `/members` - メンバー一覧

---

### Business API

- **エンドポイント**: `business`
- **API型**: リスト形式
- **フィールド**:
  - `logo`: 画像 - ロゴ画像
  - `description`: テキストエリア - 事業説明
  - `image`: 画像 - 事業イメージ画像
  - `link`: テキストフィールド - 外部リンク

**型定義**:
```typescript
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

**使用箇所**:
- `/business` - 事業内容一覧

---

### Meta API

- **エンドポイント**: `meta`
- **API型**: オブジェクト形式
- **フィールド**:
  - `title`: テキストフィールド - サイトタイトル
  - `description`: テキストエリア - サイト説明
  - `ogImage`: 画像 - OGP画像

**型定義**:
```typescript
export type Meta = {
  title: string;
  description: string;
  ogImage?: {
    url: string;
    height: number;
    width: number;
  };
} & MicroCMSObjectContent;
```

**使用箇所**:
- 全ページのメタ情報（SEO）

---

## 新規APIスキーマ

### Reports API（活動レポート）

- **エンドポイント**: `reports`
- **API型**: リスト形式
- **フィールド**:
  - `title`: テキストフィールド - レポートタイトル
  - `category`: 参照（categories） - カテゴリー（放課後こどもラボ、出張ワークショップ等）
  - `description`: テキストエリア - レポート概要
  - `thumbnail`: 画像 - サムネイル画像
  - `content`: リッチエディタまたはマークダウン - レポート本文

**型定義**:
```typescript
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

**使用箇所**:
- `/activities` - 活動レポート一覧
- `/activities/:slug` - 活動レポート詳細
- `/` - トップページ（最新2-3件表示）

**News APIとの違い**:
- フィールド構造は同一
- エンドポイント名のみ変更（`news` → `reports`）
- セマンティクスが変更（ニュース → 活動レポート）

---

### Categories API（カテゴリー）

- **エンドポイント**: `categories`
- **API型**: リスト形式
- **フィールド**:
  - `name`: テキストフィールド - カテゴリー名
  - `description`: テキストエリア - カテゴリー説明 **★新規追加**
  - `slug`: テキストフィールド - URLスラッグ（例: `afterschool`, `workshop`） **★新規追加（オプション）**

**型定義**:
```typescript
export type Category = {
  name: string;
  description: string; // ★新規追加
  slug?: string; // ★新規追加（オプション）
} & MicroCMSListContent;
```

**使用箇所**:
- カテゴリータグ表示
- カテゴリーフィルター
- `/activities` - カテゴリー紹介カード

**Category APIとの違い**:
- `description` フィールド追加（カテゴリー紹介カードで使用）
- `slug` フィールド追加（URLフィルタリング用、オプション）

**カテゴリー例**:
```json
[
  {
    "id": "afterschool",
    "name": "放課後こどもラボ",
    "description": "放課後の子どもたちの居場所づくり",
    "slug": "afterschool"
  },
  {
    "id": "workshop",
    "name": "出張ワークショップ",
    "description": "学校や施設へ出張してワークショップを実施",
    "slug": "workshop"
  },
  {
    "id": "training",
    "name": "研修",
    "description": "教員や支援者向けの研修プログラム",
    "slug": "training"
  },
  {
    "id": "space-design",
    "name": "空間設計",
    "description": "子どもたちが創造的に過ごせる空間の設計",
    "slug": "space-design"
  }
]
```

---

### Members API（メンバー）

- **エンドポイント**: `members`
- **API型**: リスト形式
- **フィールド**:
  - `name`: テキストフィールド - メンバー名
  - `description`: テキストフィールド - 役割・肩書き（旧 `position`）
  - `thumbnail`: 画像 - プロフィール画像（旧 `image`）
  - `content`: リッチエディタまたはマークダウン - 詳細プロフィール **★新規追加**

**型定義**:
```typescript
export type Member = {
  name: string;
  description: string; // 旧position（役割・肩書き）
  thumbnail?: {       // 旧image
    url: string;
    height: number;
    width: number;
  };
  content: string; // ★新規追加（詳細プロフィール）
} & MicroCMSListContent;
```

**使用箇所**:
- `/` - ホームのメンバーセクション（カード表示）
- メンバー詳細モーダルまたは展開セクション

**Member APIとの違い**:
- `position` → `description`（フィールド名変更、意味は同じ）
- `image` → `thumbnail`（フィールド名変更、意味は同じ）
- `profile` → `content`（フィールド名変更、詳細プロフィールとして拡張）
- `content` フィールドでリッチコンテンツ（画像、リンク等）を含む詳細プロフィールを記述可能

---

### Meta API

**変更なし**。既存のMeta APIをそのまま使用。

---

## TypeScript型定義の変更（`app/_libs/microcms.ts`）

### 削除する型定義

```typescript
// 削除
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

// 削除
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

### 追加する型定義

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

---

### 変更する型定義

```typescript
// 変更前
export type Category = {
  name: string;
} & MicroCMSListContent;

// 変更後
export type Category = {
  name: string;
  description: string; // ★追加
  slug?: string; // ★追加（オプション）
} & MicroCMSListContent;
```

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
  description: string; // 旧position
  thumbnail?: {       // 旧image
    url: string;
    height: number;
    width: number;
  };
  content: string; // ★追加（詳細プロフィール）
} & MicroCMSListContent;
```

---

## データ移行戦略

### 移行手順

#### ステップ1: microCMS管理画面で新API作成

1. **Reports API作成**
   - エンドポイント: `reports`
   - API型: リスト形式
   - フィールド:
     - `title`: テキストフィールド
     - `category`: 参照（categories）
     - `description`: テキストエリア
     - `thumbnail`: 画像
     - `content`: リッチエディタ

2. **Categories API作成**
   - エンドポイント: `categories`
   - API型: リスト形式
   - フィールド:
     - `name`: テキストフィールド
     - `description`: テキストエリア **★追加**
     - `slug`: テキストフィールド **★追加（オプション）**

3. **Members API作成**
   - エンドポイント: `members`
   - API型: リスト形式
   - フィールド:
     - `name`: テキストフィールド
     - `description`: テキストフィールド（旧position）
     - `thumbnail`: 画像（旧image）
     - `content`: リッチエディタまたはマークダウン **★追加**

---

#### ステップ2: 既存データの手動移行

**カテゴリーの移行**:
1. 既存の `category` APIの全カテゴリーを確認
2. `categories` APIに同じカテゴリーを作成
3. `description` フィールドに適切な説明文を追加
   - 例: 「放課後こどもラボ」→「放課後の子どもたちの居場所づくり」
4. `slug` フィールドを追加（オプション）

**ニュースの移行**:
1. 既存の `news` APIの全コンテンツをエクスポート（CSV等）
2. `reports` APIに同じコンテンツをインポート
3. カテゴリー参照を新しい `categories` APIに変更
4. 画像URLが正しく引き継がれているか確認

**メンバーの移行**:
1. 既存の `member` APIの全メンバーを確認
2. `members` APIに同じメンバーを作成
3. `position` → `description`、`image` → `thumbnail`、`profile` → `content` へフィールド名変更
4. `content` フィールドに詳細プロフィールを追加（既存の `profile` をベースに拡張）

---

#### ステップ3: 並行運用期間

**期間**: 1ヶ月間

**目的**:
- 新APIで全機能が正しく動作することを確認
- 問題が発生した場合のロールバック準備

**運用方法**:
- 旧API（`news`, `category`, `member`, `business`）は削除せず保持
- 新API（`reports`, `categories`, `members`）を先行テスト
- コードベースは新APIを参照するように変更
- microCMS管理画面で旧APIのコンテンツ更新を停止し、新APIのみ更新

---

#### ステップ4: 旧APIの削除

**タイミング**: 並行運用期間終了後（1ヶ月後）

**削除対象**:
- `news` API
- `category` API
- `member` API
- `business` API

**削除前の確認**:
- [ ] 新APIで全機能が正常に動作している
- [ ] SEO指標に大きな影響がない
- [ ] Google Search Consoleでインデックスが正常に更新されている
- [ ] 旧APIを参照しているコードがコードベース内に存在しない

---

### データ移行チェックリスト

#### カテゴリー移行

- [ ] 全カテゴリーが `categories` APIに作成されている
- [ ] 各カテゴリーに `description` が追加されている
- [ ] `slug` が設定されている（オプション）
- [ ] カテゴリーIDが正しくマッピングされている

#### ニュース → レポート移行

- [ ] 全Newsコンテンツが `reports` APIに移行されている
- [ ] タイトル、説明文、本文が正しく移行されている
- [ ] サムネイル画像URLが正しく引き継がれている
- [ ] カテゴリー参照が新しい `categories` APIに正しくマッピングされている
- [ ] 公開日時が正しく保持されている
- [ ] スラッグ（`:slug`）が変更されていない（URLの一貫性のため）

#### メンバー移行

- [ ] 全メンバーが `members` APIに移行されている
- [ ] `position` → `description` への変更が正しく行われている
- [ ] `image` → `thumbnail` への変更が正しく行われている
- [ ] `content` フィールドに詳細プロフィールが追加されている
- [ ] 画像URLが正しく引き継がれている

#### プレビュー機能

- [ ] プレビュー機能（`?dk`）が `reports` APIで動作する
- [ ] プレビュー機能（`?dk`）が `members` APIで動作する
- [ ] キャッシュが正しく無効化される

---

## 取得関数の変更（`app/_libs/microcms.ts`）

### 削除する関数

```typescript
// 削除
export async function getNewsList(options?: {
  limit?: number;
  offset?: number;
  orders?: string;
  filters?: string;
}) {
  const data = await client.getList<News>({
    endpoint: 'news',
    queries: { limit: options?.limit || 10, offset: options?.offset, orders: options?.orders, filters: options?.filters },
  });
  return data;
}

// 削除
export async function getNewsDetail(
  slug: string,
  options?: {
    draftKey?: string;
  },
) {
  try {
    const data = await client.get<News>({
      endpoint: 'news',
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

// 削除
export async function getBusinessList() {
  const data = await client.getList<Business>({
    endpoint: 'business',
  });
  return data;
}

// 削除（categoryからcategoriesへの変更に伴う）
export async function getCategoryList() {
  const data = await client.getList<Category>({
    endpoint: 'category',
  });
  return data;
}
```

---

### 追加する関数

```typescript
// 追加
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

// 追加
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

// 追加（categoriesエンドポイントへの変更）
export async function getCategoryList() {
  const data = await client.getList<Category>({
    endpoint: 'categories',
  });
  return data;
}

// 追加（オプション: カテゴリー詳細取得）
export async function getCategoryDetail(categoryId: string) {
  try {
    const data = await client.get<Category>({
      endpoint: 'categories',
      contentId: categoryId,
    });
    return data;
  } catch (e) {
    notFound();
  }
}
```

---

### 変更する関数

```typescript
// 変更前
export async function getMembersList() {
  const data = await client.getList<Member>({
    endpoint: 'member',
  });
  return data;
}

// 変更後
export async function getMembersList() {
  const data = await client.getList<Member>({
    endpoint: 'members', // ★エンドポイント変更
  });
  return data;
}
```

---

### 変更なしの関数

```typescript
// 変更なし
export async function getMeta() {
  const data = await client.get<Meta>({
    endpoint: 'meta',
  });
  return data;
}
```

---

## キャッシュ戦略の調整（`proxy.ts`）

### 現行設定

```typescript
// proxy.ts
export default function proxy(request: NextRequest) {
  const url = request.nextUrl;

  if (url.searchParams.has('dk')) {
    return NextResponse.next({
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    });
  }

  return NextResponse.next({
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}

export const config = {
  matcher: ['/news/:path*', '/business', '/members'],
};
```

---

### 新規設定

```typescript
// proxy.ts
export default function proxy(request: NextRequest) {
  const url = request.nextUrl;

  // プレビューモード（draftKey付き）の場合はキャッシュ無効化
  if (url.searchParams.has('dk')) {
    return NextResponse.next({
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    });
  }

  // 通常時はISRキャッシュを設定
  return NextResponse.next({
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}

export const config = {
  matcher: [
    '/activities/:path*', // ★ /news/:path* から変更
    '/support',           // ★ 新規追加
    '/recruit',           // ★ 新規追加
    // /business と /members は削除
  ],
};
```

**変更内容**:
- `/news/:path*` → `/activities/:path*`
- `/business` を削除（ページ自体が削除されるため）
- `/members` を削除（ホームに統合されるため、ホームは別途キャッシュ設定済み）
- `/support` を追加（新規ページ）
- `/recruit` を追加（新規ページ）

---

## 定数の変更（`app/_constants/index.ts`）

### 現行定数

```typescript
export const NEWS_LIST_LIMIT = 10;
export const TOP_NEWS_LIMIT = 2;
```

---

### 新規定数

```typescript
export const REPORTS_LIST_LIMIT = 10; // ★ NEWS_LIST_LIMIT から変更
export const TOP_REPORTS_LIMIT = 3;   // ★ TOP_NEWS_LIMIT から変更（2 → 3に増加）
```

**変更理由**:
- セマンティクスの変更（ニュース → レポート）
- トップページの表示件数を2件から3件に増加（デザイン上の理由）

---

## 移行時の注意事項

### 1. 既存APIの保持

- 移行完了まで旧API（`news`, `category`, `member`, `business`）を削除しない
- ロールバック可能な状態を維持

### 2. 並行テスト

- 新APIで全機能が動作することを確認してから切り替え
- ローカル環境、ステージング環境で十分にテスト

### 3. バックアップ

- microCMSエクスポート機能で全データをバックアップ
- JSON形式でローカルに保存

### 4. 段階的移行

- 一度に全て変更せず、フェーズごとに検証
- 各フェーズで動作確認とロールバック準備

### 5. プレビュー機能の継続性

- `?dk` クエリパラメータでのプレビュー機能を継続
- `reports` APIでも同様に `draftKey` 対応

### 6. SEO影響の監視

- Google Search Consoleでインデックス状況を監視
- オーガニック検索トラフィックの変化を追跡

### 7. 画像URLの検証

- microCMS画像ホスト（`images.microcms-assets.io`）が変更されないことを確認
- Next.js `Image` コンポーネントで正しく最適化されることを確認

---

## API設計のベストプラクティス

### 1. 命名規則

- エンドポイント名は複数形を使用（`reports`, `categories`, `members`）
- フィールド名は明確で一貫性のある名前を使用
- 画像フィールドは `image` または `thumbnail` で統一

### 2. フィールドの拡張性

- 将来的に追加フィールドが必要になる可能性を考慮
- オプショナルフィールド（`?`）を活用

### 3. 参照フィールドの使用

- カテゴリーは参照フィールドで管理（正規化）
- カテゴリー情報の一元管理と一貫性確保

### 4. リッチコンテンツの扱い

- 長文コンテンツはリッチエディタまたはマークダウンを使用
- HTMLタグ、画像、リンクを含む柔軟なコンテンツ作成が可能

### 5. プレビュー機能の活用

- 下書きコンテンツのプレビュー機能（`draftKey`）を活用
- 公開前の確認フローを確立

---

## まとめ

### 新規API

- `reports` - 活動レポート（旧 `news` を置き換え）
- `categories` - カテゴリー（旧 `category` を拡張）
- `members` - メンバー（旧 `member` を拡張）

### 削除API

- `news` - 活動レポート（`reports`に置き換え）
- `category` - カテゴリー（`categories`に置き換え）
- `member` - メンバー（`members`に置き換え）
- `business` - 事業内容（削除、活動レポートに統合）

### 継続API

- `meta` - SEOメタ情報（変更なし）

### 主な変更点

1. **エンドポイント名の変更**: `news` → `reports`, `category` → `categories`, `member` → `members`
2. **フィールドの追加**: `categories.description`, `members.content`
3. **フィールド名の変更**: `member.position` → `members.description`, `member.image` → `members.thumbnail`
4. **APIの削除**: `business` API削除

---

最終更新日: 2026-02-23
