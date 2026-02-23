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
├── INDEX.md          # 本索引ファイル
├── architecture/     # アーキテクチャ関連ドキュメント
│   ├── page-structure.md     # ページ構成設計
│   ├── api-schema.md         # microCMS API設計
│   ├── migration-plan.md     # 段階的移行計画
│   └── component-mapping.md  # コンポーネント対応表
├── dev/              # 開発関連ドキュメント
│   └── branch.md     # ブランチ戦略とCI/CDワークフロー
└── design/           # デザイン関連ドキュメント
    └── design-system.md  # デザインシステムとスタイルガイド
```

## ドキュメント一覧

### アーキテクチャ関連（architecture/）

- **[page-structure.md](./architecture/page-structure.md)** - ページ構成設計
  - 新旧ページ対応表とApp Routerディレクトリツリー
  - 削除するディレクトリ・ファイル一覧
  - 各ページの責務とセクション構成
  - SEO影響分析と301リダイレクト設計
  - メタデータとOGP設定、アクセシビリティ対応

- **[api-schema.md](./architecture/api-schema.md)** - microCMS API設計
  - 現行APIスキーマ詳細（News, Category, Member, Business, Meta）
  - 新規APIスキーマ詳細（Reports, Categories, Members）
  - TypeScript型定義の変更
  - データ移行戦略と移行手順
  - 取得関数の変更一覧（追加・削除・変更）
  - キャッシュ戦略の調整（proxy.ts）
  - 定数の変更（constants）

- **[migration-plan.md](./architecture/migration-plan.md)** - 段階的移行計画
  - 5フェーズの段階的移行戦略（期間約2-3週間）
  - フェーズ1: microCMS新API作成とデータ移行
  - フェーズ2: API型定義と取得関数実装
  - フェーズ3: 新ページ・コンポーネント実装
  - フェーズ4: 旧ページ削除とリダイレクト設定
  - フェーズ5: クリーンアップと最終検証
  - 依存関係グラフと検証手順
  - リスク分析（SEO影響、データ移行、ダウンタイム等）とロールバック戦略

- **[component-mapping.md](./architecture/component-mapping.md)** - コンポーネント対応表
  - 再利用コンポーネントリスト（9個）
  - 変更コンポーネントリスト（Header）
  - 削除コンポーネントリスト（NewsList, NewsListItem等）
  - 新規コンポーネントリスト（6個: ReportsList, ReportsListItem, ActivityCard, VisionSection, MissionSection, Hero）
  - 各新規コンポーネントのProps定義、レンダリング仕様、実装例、CSS設計
  - コンポーネント設計の原則（再利用性、レスポンシブ、アクセシビリティ、パフォーマンス、デザインシステム準拠）

### 開発関連（dev/）

- **[branch.md](./dev/branch.md)** - ブランチ運用戦略とGitHub ActionsによるCI/CDワークフローのテンプレート
  - ブランチ命名規則とライフサイクル
  - GitHub Actionsワークフローの設定例
  - コミットメッセージ規約
  - 運用フロー例とトラブルシューティング

### デザイン関連（design/）

- **[design-system.md](./design/design-system.md)** - PLDLデザインシステムとスタイルガイドの完全版
  - プロジェクト概要とデザインコンセプト
  - カラーシステム（3つの配色案と既存変数マッピング）
  - タイポグラフィ（フォント、サイズスケール、ウェイト、行高）
  - スペーシング＆レイアウト（スペーシングスケール、コンテナ幅、グリッド）
  - コンポーネントスタイル（ボーダー半径、シャドウ、トランジション、カード）
  - 画像＆イラスト（スタイルガイドライン、推奨リソース）
  - 実装ガイドライン（8フェーズの段階的実装計画）
  - Before/After比較表とコードサンプル

## 更新手順（PDCA）
1. PLAN: 既存の配置と命名を本索引で確認し、追加箇所を決める。
2. DO: 対応するサブディレクトリに Markdown を作成・更新し、本索引へ追記。
3. CHECK: リンク・命名・重複・文責の整合を確認。
4. ACTION: 改善点を洗い出し、必要ならルールやテンプレートを強化する。

---

最終更新日: 2026-02-23