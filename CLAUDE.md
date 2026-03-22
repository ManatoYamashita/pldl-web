# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

NPO法人 Playful Learning Design Lab.（PLDL / 放課後こどもラボ）の公式コーポレートサイト。
Next.js 16 (App Router) + TypeScript で構築され、コンテンツ管理に microCMS、お問い合わせフォームに Nodemailer（SMTP）を使用している。

**本番URL:** https://pldl.or.jp
**ホスティング:** Vercel（カスタムドメイン `pldl.or.jp` 設定済み）
**ドメイン設定詳細:** [`docs/dev/domain-setup.md`](./docs/dev/domain-setup.md)

## パッケージマネージャー

**pnpm 9.x 以上を使用**。npm/yarn は使用禁止。

```bash
# インストール
pnpm install

# 依存関係追加
pnpm add <package>
pnpm add -D <package>

# 依存関係削除
pnpm remove <package>
```

## 必須環境変数

`.env`ファイルに以下を設定する必要がある:

```bash
MICROCMS_API_KEY=xxxxxxxxxx          # microCMS 管理画面「サービス設定 > API キー」から取得
MICROCMS_SERVICE_DOMAIN=xxxxxxxxxx   # microCMS の URL (https://xxxxxx.microcms.io) の xxxxxx 部分
BASE_URL=xxxxxxxxxx                  # デプロイ先の URL (本番: https://pldl.or.jp / 開発: http://localhost:3001)
SMTP_HOST=smtp.example.com           # SMTPサーバーホスト
SMTP_PORT=587                        # SMTPポート（587 or 465）
SMTP_USER=your-email@example.com     # SMTP認証ユーザー
SMTP_PASS=your-password              # SMTP認証パスワード
SMTP_FROM=noreply@pldl.or.jp         # 送信元アドレス
CONTACT_TO=a@example.com,b@example.com  # 送信先アドレス（カンマ区切り）
```

## 開発コマンド

```bash
# パッケージインストール
pnpm install

# 開発サーバー起動 (http://localhost:3000)
pnpm dev

# プロダクションビルド
pnpm build

# プロダクションサーバー起動
pnpm start

# Prettier フォーマット
pnpm format

# ESLint（flat config: eslint.config.mjs）
pnpm lint
```

**注意**: 静的解析は `pnpm lint`（ESLint 9）と `pnpm typecheck`（TypeScript）の併用を推奨。

## アーキテクチャ

### Next.js App Router の構造

App Router を採用しており、`app/` ディレクトリ配下のファイル構成に応じて自動的にルーティングされる。

**ルーティング対象ディレクトリ:**
- `app/about/` → `/about` (法人紹介・アクセス)
- `app/activities/` → `/activities` (活動報告・ニュース一覧・詳細)
- `app/contact/` → `/contact` (お問い合わせ)
- `app/recruit/` → `/recruit` (仲間募集)
- `app/support/` → `/support` (支援案内・寄付・ボランティア)
- `app/privacy-policy/` → `/privacy-policy` (プライバシーポリシー)

**アンダースコアで始まるディレクトリはルーティングから除外:**
- `app/_components/` - 共有コンポーネント
- `app/_libs/` - microCMS クライアント、ユーティリティ関数
- `app/_constants/` - 定数定義

### microCMS データ取得パターン

`app/_libs/microcms.ts` で microCMS クライアントを初期化し、各種取得関数を提供している:

- `getReportsList()` - 活動レポート一覧
- `getReportsDetail()` - 活動レポート詳細（`React.cache` で重複排除）
- `getCategoryList()` - カテゴリー一覧
- `getCategoryDetail()` - カテゴリー詳細
- `getMembersList()` - メンバー一覧
- `getNextReport()` / `getPrevReport()` - 前後のレポート取得
- `getRelatedReports()` - 同カテゴリの関連レポート取得
- `getMeta()` - メタ情報

**型定義:**
- `Report` - 活動レポートコンテンツ
- `Category` - カテゴリー
- `Member` - メンバー
- `Meta` - SEO メタ情報

全ての関数は `notFound()` でエラーハンドリングを行っている（404 ページへ誘導）。

### キャッシュ戦略と Preview 機能

`proxy.ts` でキャッシュ制御を実装（Next.js 16では`middleware.ts`が`proxy.ts`に変更）:

```typescript
// 通常: ISR キャッシュ (60秒、stale-while-revalidate 300秒)
public, s-maxage=60, stale-while-revalidate=300

// プレビューモード: ?dk クエリパラメータ付きでキャッシュ無効化
no-store, must-revalidate
```

**対象パス:**
- `/activities/:path*`
- `/support`
- `/recruit`

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

### デザインシステム

PLDLのデザインシステムは `docs/design.md` で管理されています。

**デザインコンセプト**: 「楽しく・ポップで、保護者と子供の両方が親しめるデザイン」

**カラーパレット**:
- プライマリ: `#f5a623`（ゴールデンオレンジ）
- セカンダリ: `#4ECDC4`（ターコイズブルー）
- ターシャリ: `#FFE66D`（サニーイエロー）

**主要な変数**:
```css
/* カラー */
--color-primary: #f5a623;
--color-secondary: #4ecdc4;
--color-bg-main: #FFFEF9;
--color-text-primary: #333;

/* タイポグラフィ */
--font-sans: 'Zen Kaku Gothic New', ...;
--font-display: 'LINE Seed JP', var(--font-sans);
--font-size-md: 1.125rem; /* 18px */
--font-weight-semibold: 600;
--line-height-normal: 1.8;

/* スペーシング */
--spacing-4: 16px; /* 1rem */
--spacing-6: 24px; /* 1.5rem */
--section-gap-lg: 80px;

/* ボーダー半径 */
--border-radius: 12px;
--border-radius-sm: 8px;
--border-radius-full: 9999px;

/* シャドウ */
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
--shadow-primary-sm: 0 2px 8px rgba(245, 166, 35, 0.2);
```

**参照ドキュメント**:
- **メイン**: [`docs/design.md`](./docs/design.md)
- **カラー詳細**: [`docs/design/color-system.md`](./docs/design/color-system.md)
- **タイポグラフィ**: [`docs/design/typography.md`](./docs/design/typography.md)
- **スペーシング**: [`docs/design/spacing-layout.md`](./docs/design/spacing-layout.md)
- **コンポーネント**: [`docs/design/components.md`](./docs/design/components.md)
- **実装ガイド**: [`docs/design/implementation-guide.md`](./docs/design/implementation-guide.md)
- **画像**: [`docs/design/assets-images.md`](./docs/design/assets-images.md)

**デザイン作業時の注意**:
- 新しいコンポーネントやページを作成する際は、上記のデザインシステムを必ず参照すること
- CSS変数を活用し、固定値の使用を避けること
- カラーパレット案A（ビビッドポップ）に準拠すること
- フォントは `Zen Kaku Gothic New` を使用すること（Google Fonts）

### お問い合わせフォーム

`app/api/submit-contact/route.ts` で Nodemailer（SMTP）を使用してメール送信。

**フォームフィールド:**
- 姓・名（必須）
- 属性（必須、ドロップダウン: 高校生/大学生/正社員/フリーター/その他）
- 「その他」選択時は詳細テキスト入力（必須）
- メールアドレス（必須）
- メッセージ（必須）
- 添付ファイル（任意、PDF/JPG/PNG/GIF/WebP、10MB以下）

**バリデーション:**
- 姓、名、属性、メールアドレス、メッセージの必須チェック
- メールアドレス形式の検証
- ファイルのMIMEタイプ・サイズチェック（サーバー側）

**メール送信:**
- Nodemailer で SMTP 送信（`CONTACT_TO` 環境変数のカンマ区切りアドレスに送信）
- FormData で送信（ファイル添付対応）

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

- `REPORTS_LIST_LIMIT = 10` - 活動レポート一覧の1ページあたりの表示件数
- `TOP_REPORTS_LIMIT = 3` - トップページの活動レポート表示件数
- `TOP_CATEGORY_NAMES` - トップページに固定表示するカテゴリ名（表示順）
- `CATEGORY_IMAGE_MAP` - カテゴリ名→ローカル画像パスのマッピング

## 主要コンポーネント

- `Header` / `Footer` - 共通レイアウト
- `Hero` - トップページのヒーローセクション
- `Article` - 記事コンテンツの表示 (HTML パース)
- `ContactForm` - お問い合わせフォーム
- `ReportsList` / `ReportsListItem` - 活動レポート一覧表示
- `CategoryFilter` - カテゴリーフィルター
- `Pagination` - ページネーション
- `ArticleNavigation` / `RelatedReports` - 記事ナビゲーション・関連記事
- `VisionSection` / `MissionSection` - トップページのビジョン・ミッションセクション
- `BusinessCard` - 事業カードコンポーネント
- `MemberCarousel` - メンバーカルーセル
- `PageTransition` / `ScrollReveal` - ページトランジション・スクロールアニメーション

## ファイル命名規則

App Router の特殊ファイル:

- `page.tsx` - 実際に表示されるページコンポーネント
- `layout.tsx` - レイアウトコンポーネント (`children` として `page.tsx` を含む)
- `not-found.tsx` - 404 ページ
- `route.ts` - API ルート

## Node.js バージョン

Node.js 24 以上が必須。セキュリティアップデートのため、最新パッチバージョンの使用を推奨。

## Next.js 16 の重要な変更点

### Async Request APIs

`params` と `searchParams` は Promise として扱う必要がある（既に対応済み）:

```typescript
export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  // ...
}
```

### Proxy ファイル（旧 Middleware）

Next.js 16 では `middleware.ts` が非推奨になり、`proxy.ts` に変更された:

- ファイル名: `middleware.ts` → `proxy.ts`
- エクスポート関数: `export function middleware` → `export default function proxy`

### ESLint

- ESLint 9 + `eslint.config.mjs`（flat config）を使用。`eslint-config-next` の `core-web-vitals` / `typescript` と `eslint-config-prettier/flat` を組み合わせている。
- `pnpm lint` で実行。

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