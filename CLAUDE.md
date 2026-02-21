# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

microCMS 公式のシンプルなコーポレートサイトテンプレート。
Next.js 15 (App Router) + TypeScript で構築され、コンテンツ管理に microCMS、お問い合わせフォームに HubSpot を使用している。

## 必須環境変数

`.env`ファイルに以下を設定する必要がある:

```bash
MICROCMS_API_KEY=xxxxxxxxxx          # microCMS 管理画面「サービス設定 > API キー」から取得
MICROCMS_SERVICE_DOMAIN=xxxxxxxxxx   # microCMS の URL (https://xxxxxx.microcms.io) の xxxxxx 部分
BASE_URL=xxxxxxxxxx                  # デプロイ先の URL (例: http://localhost:3000)
HUBSPOT_PORTAL_ID=xxxxxxxx           # HubSpot のアカウント ID
HUBSPOT_FORM_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  # HubSpot のフォーム ID
```

## 開発コマンド

```bash
# パッケージインストール
npm install

# 開発サーバー起動 (http://localhost:3000)
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm start

# ESLint 実行
npm run lint

# Prettier フォーマット
npm run format
```

## アーキテクチャ

### Next.js App Router の構造

App Router を採用しており、`app/` ディレクトリ配下のファイル構成に応じて自動的にルーティングされる。

**ルーティング対象ディレクトリ:**
- `app/business/` → `/business` (事業内容)
- `app/contact/` → `/contact` (お問い合わせ)
- `app/members/` → `/members` (メンバー紹介)
- `app/news/` → `/news` (ニュース一覧・詳細)

**アンダースコアで始まるディレクトリはルーティングから除外:**
- `app/_components/` - 共有コンポーネント
- `app/_libs/` - microCMS クライアント、ユーティリティ関数
- `app/_constants/` - 定数定義

### microCMS データ取得パターン

`app/_libs/microcms.ts` で microCMS クライアントを初期化し、各種取得関数を提供している:

- `getNewsList()` - ニュース一覧
- `getNewsDetail()` - ニュース詳細
- `getCategoryList()` - カテゴリー一覧
- `getCategoryDetail()` - カテゴリー詳細
- `getMembersList()` - メンバー一覧
- `getBusinessList()` - 事業内容一覧
- `getMeta()` - メタ情報

**型定義:**
- `News` - ニュースコンテンツ
- `Category` - カテゴリー
- `Member` - メンバー
- `Business` - 事業内容
- `Meta` - SEO メタ情報

全ての関数は `notFound()` でエラーハンドリングを行っている（404 ページへ誘導）。

### キャッシュ戦略と Preview 機能

`middleware.ts` でキャッシュ制御を実装:

```typescript
// 通常: ISR キャッシュ (60秒、stale-while-revalidate 300秒)
public, s-maxage=60, stale-while-revalidate=300

// プレビューモード: ?dk クエリパラメータ付きでキャッシュ無効化
no-store, must-revalidate
```

**対象パス:**
- `/news/:path*`
- `/business`
- `/members`

microCMS 管理画面のプレビュー機能と連携し、下書きコンテンツの確認が可能。

### スタイリング

CSS Modules を採用。各コンポーネント・ページに対応する `.module.css` ファイルを同階層に配置。

```typescript
import styles from './page.module.css';
<div className={styles.container}>...</div>
```

**グローバル変数:** `app/globals.css` で色やボーダー半径などを CSS カスタムプロパティとして定義。

```css
var(--color-text-main)
var(--color-bg-main)
var(--border-radius)
```

### お問い合わせフォーム

`app/api/submit-contact/route.ts` で HubSpot Forms API に POST リクエストを送信。

**バリデーション:**
- 姓、名、会社名、メールアドレス、メッセージの必須チェック
- メールアドレス形式の検証

**HubSpot 連携:**
- `hubspotutk` Cookie を送信してトラッキング
- フォーム送信元ページの URL を `context.pageUri` に含める

### 画像最適化

`next.config.js` で microCMS の画像ホストを許可:

```javascript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.microcms-assets.io' }
  ]
}
```

Next.js の `Image` コンポーネントで自動最適化される。

## 重要な定数

`app/_constants/index.ts`:

- `NEWS_LIST_LIMIT = 10` - ニュース一覧の1ページあたりの表示件数
- `TOP_NEWS_LIMIT = 2` - トップページのニュース表示件数

## 主要コンポーネント

- `Article` - 記事コンテンツの表示 (HTML パース、コードハイライト)
- `ContactForm` - お問い合わせフォーム
- `NewsList` / `NewsListItem` - ニュース一覧表示
- `Pagination` - ページネーション
- `Header` / `Footer` - 共通レイアウト
- `Hero` - トップページのヒーローセクション

## ファイル命名規則

App Router の特殊ファイル:

- `page.tsx` - 実際に表示されるページコンポーネント
- `layout.tsx` - レイアウトコンポーネント (`children` として `page.tsx` を含む)
- `not-found.tsx` - 404 ページ
- `route.ts` - API ルート

## Node.js バージョン

Node.js 24 以上が必須。セキュリティアップデートのため、最新パッチバージョンの使用を推奨。

## 参照優先順位
1. 本ファイル（運用ルール）
2. `.claude/CLAUDE.md`（docs運用・命名規約）
3. `docs/INDEX.md`（最新の知見と配置）

## ドキュメント運用
- `docs/` は唯一のSoT。直下に置けるのは `docs/INDEX.md` のみ。その他はサブディレクトリへ。
- サブディレクトリは必要最小限にし、`kebab-case` 命名を徹底。追加・更新時は必ず `docs/INDEX.md` を改訂。
- 機密情報は保存禁止。ドキュメント関連コミットは `DOC:` プレフィックスを推奨。

## 作業フロー（PDCA）
- **PLAN**: ルール確認とToDo化から開始することを厳守。
- **DO**: 小さな単位で実装し、対応ドキュメントを即時更新。
- **CHECK**: リンク切れ、命名不整合、重複を確認。
- **ACTION**: 改善点と知見を `docs/` に蓄積し、必要ならルール更新提案を行う。

## コミュニケーション
- 回答は日本語、絵文字は最小限。意図・影響・テスト結果を簡潔に共有。
- 外部ライブラリ追加時は目的・代替・影響範囲を説明し、承認を得ること。

## コミット方針
- ドキュメント更新: `DOC: ...`
- コード変更: 目的がわかる短いメッセージ。不要な改行・空白調整のみのコミットは避ける。