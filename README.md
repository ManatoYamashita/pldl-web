<p align="center">
  <img src="./public/ogp.jpg" alt="PLDL - こどものワクワクの場をデザイン" width="100%" />
</p>

<h1 align="center">PLDL（放課後こどもラボ）コーポレートサイト</h1>

<p align="center">
  NPO法人 Playful Learning Design Lab. の公式コーポレートサイト<br />
  「想像する学から、ワクワクする学びへ」
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-%3E%3D24-339933?logo=node.js&logoColor=white" alt="Node.js >=24" />
  <img src="https://img.shields.io/badge/pnpm-9.x-f69220?logo=pnpm&logoColor=white" alt="pnpm" />
  <img src="https://img.shields.io/badge/microCMS-API-2B2D42?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyIDJMNCAxNGg4bC0yIDhMOCA2SDR6Ii8+PC9zdmc+" alt="microCMS" />
</p>

---

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| **フレームワーク** | Next.js 16（App Router） |
| **言語** | TypeScript 5.8 |
| **スタイリング** | CSS Modules + CSS Custom Properties |
| **CMS** | microCMS（ヘッドレス CMS） |
| **メール送信** | Nodemailer（SMTP） |
| **アニメーション** | GSAP |
| **アイコン** | Lucide React |
| **パッケージマネージャー** | pnpm 9.x |

## microCMS によるコンテンツ管理

本サイトのコンテンツは [microCMS](https://microcms.io/) で一元管理しています。microCMS はヘッドレス CMS で、管理画面からコンテンツの作成・編集・公開を行い、API 経由でフロントエンドにデータを配信します。

### 管理対象コンテンツ

| API エンドポイント | コンテンツ種別 | 説明 |
|---|---|---|
| `reports` | 活動レポート | 活動報告の記事（カテゴリー分類あり） |
| `categories` | カテゴリー | 活動レポートの分類用カテゴリー |
| `members` | メンバー | チームメンバーの紹介情報 |
| `meta` | メタ情報 | サイト全体の SEO メタデータ |

### コンテンツの編集方法

1. [microCMS 管理画面](https://microcms.io/) にログイン
2. 対象の API（例: 活動レポート）を選択
3. コンテンツを作成・編集し「公開」をクリック
4. サイトに自動反映（ISR: 60秒キャッシュ + stale-while-revalidate 300秒）

### プレビュー機能

microCMS の下書きプレビュー機能に対応しています。管理画面で「画面プレビュー」を利用すると、公開前のコンテンツを確認できます（`?dk` クエリパラメータによるキャッシュ無効化で最新の下書きを表示）。

## セットアップ

### 動作環境

- **Node.js 24 以上**（最新パッチバージョン推奨）
- **pnpm 9.x 以上**（npm / yarn は使用不可）

### 1. pnpm のインストール

```bash
npm install -g pnpm@latest
```

### 2. 環境変数の設定

ルート直下に `.env` ファイルを作成し、以下を設定してください。

```env
# microCMS
MICROCMS_API_KEY=xxxxxxxxxx
MICROCMS_SERVICE_DOMAIN=xxxxxxxxxx
BASE_URL=xxxxxxxxxx

# SMTP（お問い合わせフォーム）
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM=noreply@example.com
CONTACT_TO=a@example.com,b@example.com
```

<details>
<summary>環境変数の詳細</summary>

| 変数名 | 説明 |
|---|---|
| `MICROCMS_API_KEY` | microCMS 管理画面「サービス設定 > API キー」から取得 |
| `MICROCMS_SERVICE_DOMAIN` | microCMS の URL（`https://xxxxxx.microcms.io`）の `xxxxxx` 部分 |
| `BASE_URL` | デプロイ先の URL（開発: `http://localhost:3001` / 本番: `https://example.com`） |
| `SMTP_HOST` | SMTP サーバーホスト |
| `SMTP_PORT` | SMTP ポート（587 or 465） |
| `SMTP_USER` | SMTP 認証ユーザー |
| `SMTP_PASS` | SMTP 認証パスワード |
| `SMTP_FROM` | 送信元メールアドレス |
| `CONTACT_TO` | 送信先メールアドレス（カンマ区切りで複数指定可） |

</details>

### 3. 開発サーバーの起動

```bash
pnpm install
pnpm dev
```

[http://localhost:3001](http://localhost:3001) にアクセスしてください。

## コマンド一覧

| コマンド | 説明 |
|---|---|
| `pnpm dev` | 開発サーバー起動（port 3001） |
| `pnpm build` | プロダクションビルド |
| `pnpm start` | プロダクションサーバー起動 |
| `pnpm lint` | ESLint（flat config）実行 |
| `pnpm typecheck` | TypeScript 型チェック |
| `pnpm format` | Prettier フォーマット |

## ディレクトリ構成

```
app/
├── _components/     # 共有コンポーネント
├── _constants/      # 定数定義
├── _libs/           # microCMS クライアント、ユーティリティ
├── about/           # 私たちについて
├── activities/      # 活動内容
├── api/             # API ルート（お問い合わせ送信）
├── contact/         # お問い合わせ
├── privacy-policy/  # プライバシーポリシー
├── recruit/         # 採用情報
└── support/         # サポート

docs/
├── INDEX.md         # ドキュメントインデックス
├── business/        # 事業関連ドキュメント
├── design/          # デザインシステム
└── dev/             # 開発ドキュメント

public/
└── images/brand/    # ブランドアセット（ロゴ・ファビコン）
```

## デザインシステム

**コンセプト**: 楽しく・ポップで、保護者と子供の両方が親しめるデザイン

カラーパレットは **ビビッドポップ** を採用しています。

| 用途 | カラー | コード |
|---|---|---|
| プライマリ | コーラルレッド | `#FF6B6B` |
| セカンダリ | ターコイズブルー | `#4ECDC4` |
| ターシャリ | サニーイエロー | `#FFE66D` |
| 背景 | ウォームホワイト | `#FFFEF9` |

詳細は [`docs/design.md`](./docs/design.md) を参照してください。

## セキュリティ

Node.js のセキュリティアップデートについては、利用中のメジャーバージョンの最新パッチバージョンを使用してください。

最新のセキュリティ情報: https://nodejs.org/ja/blog/vulnerability/

## ライセンス

[MIT License](./LICENSE)
