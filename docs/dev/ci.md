# CI とブランチ保護

GitHub Actions のワークフローと、main のブランチ保護の設定。

---

## 1. ワークフロー

| ワークフロー | ファイル | ジョブ名（チェック名） | 実行タイミング | 内容 |
|---|---|---|---|---|
| Dependency audit | `.github/workflows/audit.yml` | `audit` | PR、main への push、毎週月曜、手動 | `pnpm audit --audit-level=high` |
| Format check | `.github/workflows/format.yml` | `format` | PR、main への push、手動 | `pnpm format:check` |
| CI | `.github/workflows/ci.yml` | `typecheck` | PR、main への push、手動 | `pnpm typecheck` |
| CI | `.github/workflows/ci.yml` | `lint` | PR、main への push、手動 | `pnpm lint` |
| CI | `.github/workflows/ci.yml` | `build` | PR、main への push、手動 | `pnpm build` |

- action はコミット SHA で固定し、`permissions: contents: read` と `persist-credentials: false` を付ける。新しいワークフローもこの書き方にそろえる
- `format:check` の範囲は `pnpm format` と同じ（`js/jsx/ts/tsx/json/css`、`.gitignore` の対象を除く）。Markdown は対象外
- Next.js 16 の `next build` は ESLint を実行しないため、`lint` を別のジョブにしている
- `build` は microCMS の環境変数にダミー（`ci-dummy`）を渡す。secrets を CI に置かずに済む代わりに、ビルド時の microCMS の取得は失敗し、各ページは `notFound` で生成される。型・バンドル・プリレンダーの失敗は検出できるが、実際のコンテンツでのビルドは確かめない。それは Vercel の Preview で確認する
- `build` に必要な環境変数は `MICROCMS_SERVICE_DOMAIN`・`MICROCMS_API_KEY`（未設定だと `app/_libs/microcms.ts` が読み込み時に例外を投げる）と `BASE_URL`。ビルド時に読む環境変数を増やしたら、`ci.yml` にもダミーを足す
- audit の見方と依存の更新手順は [dependency-security.md](./dependency-security.md)

---

## 2. main のブランチ保護

2026-11-23 に設定した（Issue #65）。

| 項目 | 設定 |
|---|---|
| 必須チェック | `audit`、`format`、`typecheck`、`lint`、`build` |
| チェックを出すアプリ | GitHub Actions（app_id `15368`）だけ。他のアプリや外部から同じ名前のステータスを付けても満たされない |
| マージ前にブランチを最新にする（strict） | 求めない |
| 管理者にも適用（enforce_admins） | する（例外なし） |
| PR のレビュー | 求めない |
| force push / ブランチの削除 | 禁止 |

### 運用上の注意

- **main へ直接 push できない。** 必須チェックを通っていないコミットは拒否されるため、ドキュメントの修正も含めて必ず PR を通す
- **新しい脆弱性が公開されると、依存を変えていない PR でも `audit` が落ちてマージできなくなる。** 先に依存を更新する PR を出し、それをマージしてから元の PR を main に追従させる
- **ワークフローやジョブ名を変えるときは、必須チェックの設定も直す。** ジョブ名（`jobs.<id>`）がチェック名になる。名前を変えると、古い名前のチェックがいつまでも「Expected」のまま待たされ、すべての PR がマージできなくなる
- **新しいジョブを必須チェックに足すのは、そのワークフローが main に入ってから。** 先に足すと、そのワークフローを含まないブランチの PR ではチェックが実行されず、「Expected」のまま止まる

### 設定の確認と変更

```bash
# 現在の設定を確認する
gh api repos/ManatoYamashita/pldl-web/branches/main/protection \
  --jq '{checks: .required_status_checks.checks, strict: .required_status_checks.strict, enforce_admins: .enforce_admins.enabled}'

# チェックの名前と、出しているアプリの ID を確かめる
gh api repos/ManatoYamashita/pldl-web/commits/main/check-runs \
  --jq '.check_runs[] | {name, app_id: .app.id}'
```

設定し直すときは、次の内容を PUT する。

```bash
gh api --method PUT repos/ManatoYamashita/pldl-web/branches/main/protection --input - <<'EOF'
{
  "required_status_checks": {
    "strict": false,
    "checks": [
      { "context": "audit", "app_id": 15368 },
      { "context": "format", "app_id": 15368 },
      { "context": "typecheck", "app_id": 15368 },
      { "context": "lint", "app_id": 15368 },
      { "context": "build", "app_id": 15368 }
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": null,
  "restrictions": null
}
EOF
```

### 緊急時（CI が壊れていて本番の修正を出せないとき）

管理者の適用だけを一時的に外し、マージしたら必ず戻す。

```bash
# 外す
gh api --method DELETE repos/ManatoYamashita/pldl-web/branches/main/protection/enforce_admins
# 戻す
gh api --method POST repos/ManatoYamashita/pldl-web/branches/main/protection/enforce_admins
```

外したことと戻したことは、対応した Issue か PR に書き残す。
