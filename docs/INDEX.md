# INDEX.md ドキュメント索引と運用ルール

## 運用原則
- `docs/` は知見とルールの唯一のソース・オブ・トゥルースです。
- `/docs/` 直下に置けるファイルは本索引 `docs/INDEX.md` のみ。他のドキュメントは必ずサブディレクトリに配置します。
- サブディレクトリは必要最小限に留め、命名は `kebab-case` に統一します。
- 追加・更新時は本索引を必ず更新し、重複やリンク切れ、プロジェクトの実情との生合成を定期的にチェックします。
- 機密情報（PII 等）は書き込み禁止。コミット時は `DOC:` プレフィックスを推奨します。

## ディレクトリ構成（最小セット）

```
docs/
├── INDEX.md                  # 本索引ファイル
├── design.md                 # デザインシステム（メインドキュメント）
├── business/                 # 事業関連ドキュメント
│   └── business-plan.md      # 放課後こどもラボ事業計画書
├── dev/                      # 開発関連ドキュメント
│   ├── analytics.md          # Search Console と Google アナリティクス
│   ├── ci.md                 # CI とブランチ保護
│   ├── contact-spam-protection.md # お問い合わせフォームのスパム対策
│   ├── domain-setup.md       # カスタムドメイン設定ガイド
│   ├── dependency-security.md # 依存関係のセキュリティ更新ガイド
│   ├── email-setup.md        # メール送信設定ガイド
│   ├── metadata.md           # メタデータ（OGP と X のカード）
│   ├── site-migration.md     # 旧サイト移行ガイド
│   ├── sns-autopost.md       # SNS 自動投稿（Instagram）
│   ├── troubleshooting.md    # 開発環境のトラブルシューティング
│   └── vercel-cli.md         # Vercel CLI 利用ガイド
└── design/                   # デザイン関連ドキュメント
    ├── design-system.md      # デザインシステム（元の詳細プラン、参考用）
    ├── color-system.md       # カラーシステム詳細
    ├── typography.md         # タイポグラフィ詳細
    ├── spacing-layout.md     # スペーシング＆レイアウト詳細
    ├── components.md         # コンポーネントスタイル詳細
    ├── hero.md               # ヒーローとヘッダー（ロゴ・ナビ）
    ├── implementation-guide.md  # 実装ガイドライン
    └── assets-images.md      # 画像＆イラストガイドライン
```

## ドキュメント一覧

### 事業関連（business/）

- **[business-plan.md](./business/business-plan.md)** - 放課後こどもラボ事業計画書
  - 応募理由・Vision・Mission
  - 4つの事業（放課後こどもラボ、出張ワークショップ、研修、空間設計）
  - 活動内容・空間紹介・月謝・行事
  - 地域連携（岩宿ワークショップ、映画制作）
  - 5か年事業計画・組織図・活動実績

### 開発関連（dev/）

- **[analytics.md](./dev/analytics.md)** - Google Search Console と Google アナリティクス
  - Search Console のドメインプロパティと、所有権確認用 TXT レコードの扱い（消さない、SPF と分ける）
  - GA4 の読み込み方（`next/script`、`NEXT_PUBLIC_GA_ID` を Production だけに設定）
  - CSP に追加した Google のドメインと、プライバシーポリシーの記載
  - 動作確認の手順

- **[ci.md](./dev/ci.md)** - CI とブランチ保護
  - ワークフロー一覧（`audit` / `format` / `typecheck` / `lint` / `build`）と、`build` に渡すダミーの環境変数
  - main のブランチ保護（必須チェック、管理者にも適用、直接 push 不可）
  - 新しい脆弱性で `audit` が落ちたとき、ジョブ名を変えるときの注意
  - 設定の確認・変更コマンドと緊急時の手順

- **[contact-spam-protection.md](./dev/contact-spam-protection.md)** - お問い合わせフォームのスパム対策
  - Cloudflare Turnstile の仕組み、API の挙動、環境変数、初期設定の手順
  - Vercel WAF のレート制限ルールの設定手順

- **[domain-setup.md](./dev/domain-setup.md)** - カスタムドメイン設定ガイド
  - Vercel × さくらドメインの設定構成
  - DNS レコード一覧（A / CNAME / MX / SPF / DKIM / DMARC）と、SPF の TXT に別の文字列を並べない注意
  - リダイレクト設定（www → apex、Vercel デフォルト → apex）
  - SSL / HTTPS 設定
  - 設定変更時のチェックリスト

- **[site-migration.md](./dev/site-migration.md)** - 旧サイト（ldl.cocotte.jp）→ 新サイト（pldl.or.jp）移行ガイド
  - 301リダイレクト設定手順（.htaccess / WordPressプラグイン）
  - Google Search Console アドレス変更申請
  - 主要ページのURLマッピング
  - 移行後の確認・監視チェックリスト

- **[email-setup.md](./dev/email-setup.md)** - お問い合わせフォーム メール送信設定ガイド
  - 本番の構成（Workspace の `info@pldl.or.jp` から直接送信）と、値の確認・変更・認証情報の切り替え手順
  - SMTP環境変数一覧と設定手順
  - SMTPサービス別設定例（Gmail / さくら / Xserver / Amazon SES）
  - 動作確認チェックリスト
  - トラブルシューティング
  - 本番環境デプロイ時の設定

- **[metadata.md](./dev/metadata.md)** - メタデータ（OGP と X のカード）
  - `buildPageMetadata` と OGP の共通の値（`SHARED_OPEN_GRAPH`）、`og:url` を canonical にそろえること
  - ページごとの OGP / X の画像（トップは Meta の `ogImage`、記事はサムネイル、ほかは `/ogp.webp`）
  - 守ること（`openGraph` は浅くマージされる、レイアウトの `twitter` は `card` だけ、ファイルベースの OG 画像は置かない）

- **[sns-autopost.md](./dev/sns-autopost.md)** - SNS 自動投稿（Instagram）
  - microCMS の Webhook → Instagram に投稿する仕組みと、投稿する条件（X を対象にしていない理由も）
  - 二重投稿を防ぐ記録（Vercel Global Config。既にあるキーへの `create` は 409）と、失敗したときの投稿し直し方
  - 始める前にアカウントの持ち主と確認すること（プロアカウントは公開になる、子どもの写真、パスワードの受け渡し）
  - 初期設定（microCMS のフィールドと Webhook、Meta の統合ログイン、ビジネスポートフォリオ、Global Config、環境変数の設定状況）
  - Meta の設定でつまずいた点、未確認の点、検討中の Instagram → Web

- **[dependency-security.md](./dev/dependency-security.md)** - 依存関係のセキュリティ更新ガイド
  - `pnpm audit` の見方（実行時依存か開発時のみか、該当機能を使っているか）
  - CI での監査（`.github/workflows/audit.yml`）
  - Next.js の更新手順と動作確認チェックリスト
  - Node.js の更新手順（`engines.node` と `.node-version`。メジャー更新では `@types/node` と Vercel の Project Settings も合わせる）
  - nodemailer の更新手順（破壊的変更の確認、`streamTransport` での検証）
  - 推移的依存の更新方針（`pnpm update` → 親の範囲内更新 → `pnpm.overrides`）
  - 対応記録

- **[troubleshooting.md](./dev/troubleshooting.md)** - 開発環境のトラブルシューティング
  - 表示崩れの切り分け（再読み込み → 新しいタブ → オーバースクロール → 本番ビルド）
  - はみ出している要素を探すコンソール用スニペット
  - ヘッドレスのブラウザで確かめるときの注意（GSAP が止まる）

- **[vercel-cli.md](./dev/vercel-cli.md)** - Vercel CLI 利用ガイド
  - プロジェクト情報（プロジェクト名は `pldl`、リポジトリ名とは違う）
  - link 手順と、やってはいけないこと（link 前の `--yes`、`vercel curl`）
  - SSO で保護された Preview をブラウザで確認する手順
  - 環境変数を変更して本番に反映する手順（`redeploy --scope`、Sensitive の扱い、秘密情報を引数に書かない）
  - 誤ってプロジェクトを作ったときの復旧手順

### デザイン関連

#### メインドキュメント

- **[design.md](./design.md)** - PLDLデザインシステムの概要と目次（★必読）
  - プロジェクト概要とデザインコンセプト
  - クイックリファレンス（よく使う変数）
  - 各詳細ドキュメントへのリンク
  - 実装の進め方（8フェーズの概要）
  - Before/After比較表

#### 詳細ドキュメント（design/）

- **[design-system.md](./design/design-system.md)** - 元の詳細プラン（参考用、1,299行）
  - すべての情報の元ソース
  - 必要に応じて参照

- **[color-system.md](./design/color-system.md)** - カラーシステム詳細
  - カラーパレット案A（ビビッドポップ）の全変数定義
  - 既存変数とのマッピング表
  - カラーアクセシビリティ
  - 使用例（ButtonLink、Hero、Category）

- **[typography.md](./design/typography.md)** - タイポグラフィ詳細
  - フォントファミリー（Zen Kaku Gothic New）
  - フォントサイズスケール（9段階、Major Thirdスケール）
  - フォントウェイト（5段階）
  - 行高（4段階）
  - レスポンシブ対応例

- **[spacing-layout.md](./design/spacing-layout.md)** - スペーシング＆レイアウト詳細
  - スペーシングスケール（13段階、4の倍数ベース）
  - セクション間隔変数（4段階）
  - コンテナ幅（4段階）
  - レスポンシブブレークポイント
  - グリッドシステム（2カラム、3カラム、4カラム、非対称）

- **[components.md](./design/components.md)** - コンポーネントスタイル詳細
  - ボーダー半径（5段階）
  - シャドウシステム（標準シャドウ、カラフルシャドウ）
  - トランジション（3段階）
  - カードスタイルバリエーション（default, accent, elevated, colored）
  - ボタンスタイル（primary, secondary, outline, text）
  - 入力フィールドスタイル

- **[hero.md](./design/hero.md)** - ヒーローとヘッダー（ロゴ・ナビの現在地表示）
  - ヒーローの種類（showcase / withBlob / banner / グラデーション）と使っているページ
  - withBlob の構成（写真とタイトルの縦積み、100svh、Blob の幅）
  - 写真の切り抜き位置と `--hero-header-overlap`（ヘッダーの寸法を変えたら合わせて直す）
  - ヘッダーのロゴ（`<video>` の寸法指定、モバイルでの広げ方）
  - ヘッダーのナビ（項目の一元管理、`aria-current` による現在地の表示）
  - 表示の確認方法（agent-browser + reduced-motion）

- **[implementation-guide.md](./design/implementation-guide.md)** - 実装ガイドライン
  - 段階的実装の概要（8フェーズ）
  - フェーズ1-4の詳細手順とチェックリスト
  - フェーズ5-8の概要
  - Before/Afterコード例（globals.css、ButtonLink、Hero、Category）
  - 段階的デプロイ戦略（4回に分けてデプロイ）
  - デプロイ前チェックリスト

- **[assets-images.md](./design/assets-images.md)** - 画像＆イラストガイドライン
  - 写真スタイルガイドライン（撮影、画像処理、ホバー効果、ヒーロー用の写真の選び方）
  - イラストスタイルガイドライン（基本スタイル、カラーパレット適用）
  - 推奨リソース（unDraw、Storyset、Phosphor Icons、Heroicons）
  - 画像最適化ガイドライン（Next.js Image、microCMS の入稿形式と URL の変換関数、圧縮ツール）
  - 実装例（ヒーロー、カード、背景、アイコン）

## 更新手順（PDCA）
1. PLAN: 既存の配置と命名を本索引で確認し、追加箇所を決める。
2. DO: 対応するサブディレクトリに Markdown を作成・更新し、本索引へ追記。
3. CHECK: リンク・命名・重複・文責の整合を確認。
4. ACTION: 改善点を洗い出し、必要ならルールやテンプレートを強化する。

---

最終更新日: 2026-11-24