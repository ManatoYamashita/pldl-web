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
│   ├── branch.md             # ブランチ戦略とCI/CDワークフロー
│   └── email-setup.md        # メール送信設定ガイド
└── design/                   # デザイン関連ドキュメント
    ├── design-system.md      # デザインシステム（元の詳細プラン、参考用）
    ├── color-system.md       # カラーシステム詳細
    ├── typography.md         # タイポグラフィ詳細
    ├── spacing-layout.md     # スペーシング＆レイアウト詳細
    ├── components.md         # コンポーネントスタイル詳細
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

- **[branch.md](./dev/branch.md)** - ブランチ運用戦略とGitHub ActionsによるCI/CDワークフローのテンプレート
  - ブランチ命名規則とライフサイクル
  - GitHub Actionsワークフローの設定例
  - コミットメッセージ規約
  - 運用フロー例とトラブルシューティング

- **[email-setup.md](./dev/email-setup.md)** - お問い合わせフォーム メール送信設定ガイド
  - SMTP環境変数一覧と設定手順
  - SMTPサービス別設定例（Gmail / さくら / Xserver / Amazon SES）
  - 動作確認チェックリスト
  - トラブルシューティング
  - 本番環境デプロイ時の設定

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

- **[implementation-guide.md](./design/implementation-guide.md)** - 実装ガイドライン
  - 段階的実装の概要（8フェーズ）
  - フェーズ1-4の詳細手順とチェックリスト
  - フェーズ5-8の概要
  - Before/Afterコード例（globals.css、ButtonLink、Hero、Category）
  - 段階的デプロイ戦略（4回に分けてデプロイ）
  - デプロイ前チェックリスト

- **[assets-images.md](./design/assets-images.md)** - 画像＆イラストガイドライン
  - 写真スタイルガイドライン（撮影、画像処理、ホバー効果）
  - イラストスタイルガイドライン（基本スタイル、カラーパレット適用）
  - 推奨リソース（unDraw、Storyset、Phosphor Icons、Heroicons）
  - 画像最適化ガイドライン（Next.js Image、microCMS、圧縮ツール）
  - 実装例（ヒーロー、カード、背景、アイコン）

## 更新手順（PDCA）
1. PLAN: 既存の配置と命名を本索引で確認し、追加箇所を決める。
2. DO: 対応するサブディレクトリに Markdown を作成・更新し、本索引へ追記。
3. CHECK: リンク・命名・重複・文責の整合を確認。
4. ACTION: 改善点を洗い出し、必要ならルールやテンプレートを強化する。

---

最終更新日: 2026-03-21