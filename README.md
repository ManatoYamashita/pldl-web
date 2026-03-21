# PLDL（放課後こどもラボ）コーポレートサイト

PLDL（Playful Learning Design Lab.）のコーポレートサイトです。
Next.js 16（App Router）+ TypeScript で構築され、コンテンツ管理に [microCMS](https://microcms.io/)、お問い合わせフォームに [HubSpot](https://www.hubspot.jp/) を使用しています。

## 技術スタック

- **フレームワーク**: Next.js 16（App Router）
- **言語**: TypeScript
- **スタイリング**: CSS Modules
- **CMS**: microCMS
- **フォーム**: HubSpot Forms API
- **パッケージマネージャー**: pnpm
- **アイコン**: Lucide React

## 動作環境

Node.js 24 以上

## 環境変数の設定

ルート直下に `.env` ファイルを作成し、下記の情報を入力してください。

```
MICROCMS_API_KEY=xxxxxxxxxx
MICROCMS_SERVICE_DOMAIN=xxxxxxxxxx
BASE_URL=xxxxxxxxxx
HUBSPOT_PORTAL_ID=xxxxxxxx
HUBSPOT_FORM_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

| 変数名 | 説明 |
|---|---|
| `MICROCMS_API_KEY` | microCMS 管理画面の「サービス設定 > API キー」から取得 |
| `MICROCMS_SERVICE_DOMAIN` | microCMS の URL（`https://xxxxxxxx.microcms.io`）の `xxxxxxxx` 部分 |
| `BASE_URL` | デプロイ先の URL（開発: `http://localhost:3000` / 本番: `https://example.com`） |
| `HUBSPOT_PORTAL_ID` | HubSpot のアカウント ID |
| `HUBSPOT_FORM_ID` | HubSpot のフォームに割り当てられる ID |

## 開発の仕方

> **Note**
> このプロジェクトは **pnpm** を使用しています。npm や yarn は使用しないでください。

1. pnpm のインストール（未インストールの場合）

```bash
npm install -g pnpm@latest
```

2. パッケージのインストール

```bash
pnpm install
```

3. 開発環境の起動

```bash
pnpm dev
```

4. 開発環境へのアクセス

   [http://localhost:3001](http://localhost:3001) にアクセス

## その他のコマンド

```bash
# プロダクションビルド
pnpm build

# プロダクションサーバー起動
pnpm start

# TypeScript 型チェック
pnpm typecheck

# コードフォーマット
pnpm format
```

> **Note**
> 静的解析は `pnpm lint`（ESLint 9 / flat config）と `pnpm typecheck` を使用してください。

## ディレクトリ構成

```
app/
├── _components/    # 共有コンポーネント
├── _libs/          # microCMS クライアント、ユーティリティ
├── _constants/     # 定数定義
├── about/          # 私たちについて
├── activities/     # 活動内容
├── business/       # 事業内容
├── contact/        # お問い合わせ
├── members/        # メンバー紹介
├── news/           # ニュース一覧・詳細
├── recruit/        # 採用
└── support/        # サポート
docs/
├── INDEX.md        # ドキュメントインデックス
└── design/         # デザインシステム
public/
└── images/brand/   # ブランドアセット（ロゴ・ファビコン）
```

## デザインシステム

デザインコンセプトは「楽しく・ポップで、保護者と子供の両方が親しめるデザイン」です。
詳細は [`docs/design.md`](./docs/design.md) を参照してください。

## Node.js のバージョンについて

このプロジェクトは **Node.js 24 以上**を前提としています。

Node.js では定期的にセキュリティアップデートが提供されています。
安全にご利用いただくため、**利用中のメジャーバージョン（例: 24.x）の最新パッチバージョンを使用することを推奨します。**

最新のセキュリティ情報については、以下をご参照ください。
https://nodejs.org/ja/blog/vulnerability/
