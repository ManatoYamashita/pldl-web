# 依存関係のセキュリティ更新ガイド

依存パッケージ・Node.js の脆弱性を調べて更新するときの手順と、過去の対応記録。

## 調査手順

```bash
# 既知の脆弱性一覧
pnpm audit

# パッケージ単位で集計したい場合（JSON 出力を加工する）
pnpm audit --json > /tmp/audit.json

# 新しいバージョンがあるパッケージ
pnpm outdated
```

指摘を見るときは、次の 2 点を必ず確認する。

1. **実行時依存か、開発時のみの依存か**: `Paths` が `.>next` や `.>nodemailer` のように本番コードから辿れるものは優先度が高い。`.>eslint>...` や `.>eslint-config-next>...` は本番のバンドルに入らない。
2. **該当機能を実際に使っているか**: advisory の条件（例: 「AVIF を使う Image Optimization」「`raw` オプション」「`fromURL()`」）と、`next.config.js` やアプリのコードを突き合わせる。

## Next.js の更新手順

```bash
pnpm add next@^<version> react@^<version> react-dom@^<version>
pnpm add -D eslint-config-next@^<version>
```

1. 破壊的変更を同梱ドキュメントで確認する: `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`
2. `pnpm typecheck` / `pnpm lint` / `rm -rf .next && pnpm build`
3. `pnpm start` で動作を確認する
   - 主要ページ（`/`, `/about`, `/activities`, `/activities/[slug]`, `/support`, `/recruit`, `/contact`）が 200 を返す
   - `Accept: image/avif` を付けて `/_next/image?...` を取得し、`Content-Type: image/avif` が返る（ローカル画像と microCMS 画像の両方）
   - `/activities` の `CDN-Cache-Control` が `public, s-maxage=60, stale-while-revalidate=300` で、`?dk` を付けると `no-store, must-revalidate` になる
4. PR を作ったら、Vercel Preview で 3 と同じ項目を確認する。Preview は SSO で保護されているので、ログイン済みのブラウザから確認する（手順は [vercel-cli.md](./vercel-cli.md)。`vercel curl` は使わない）
5. `pnpm dev` を起動し、AGENTS.md の `nextjs-agent-rules` ブロックに差分が出たらコミットに含める
6. Next.js の Skills を更新する: `npx skills update -g`

## 注意点

- `.pnpmrc` は pnpm に読み込まれない（pnpm が読むのは `.npmrc` / `pnpm-workspace.yaml`）。設定が効いているかは `pnpm config get <key>` で確認する。
- `next` を更新すると、同梱の `postcss` / `sharp` も一緒に更新される。この 2 つを個別に上げる必要はない。

## 対応記録

| 日付 | 内容 | Issue |
|---|---|---|
| 2026-11-19 | `pnpm audit` で 135 件（critical 5 / high 63）を検出。next 16.2.1 → 16.4.6、react 19.2.4 → 19.3.1、eslint-config-next 16.2.1 → 16.4.6 に更新し、critical は 0 件になった。残りは推移的依存（undici / ESLint 系）と nodemailer で、Issue #30 の ToDo として継続中 | #30 |
