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

## CI での監査

`.github/workflows/audit.yml` が `pnpm audit --audit-level=high` を実行する。high 以上が 1 件でもあれば失敗する（moderate / low では失敗しない）。

- 実行タイミング: main への push、すべての PR、毎週月曜 09:17（JST）、手動実行（Actions タブの「Run workflow」）
- 依存を変えていなくても新しい advisory は公開されるので、定期実行が失敗したら本ガイドの調査手順で対応する
- `pnpm audit` は lockfile だけで判定するため、`pnpm install` はしていない
- 使う Action は commit SHA で固定している（タグの付け替えによるサプライチェーン攻撃を避けるため）。更新するときは新しいタグの SHA を `git ls-remote https://github.com/actions/<name> refs/tags/<tag>` で確かめ、末尾のコメントのバージョンも書き換える

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
   - `/activities` 配下の `CDN-Cache-Control` が `no-store, must-revalidate`（CSP の nonce を使うため CDN にキャッシュさせない）。`/support` は `public, s-maxage=60, stale-while-revalidate=300` で、`?dk` を付けると `no-store, must-revalidate` になる
4. PR を作ったら、Vercel Preview で 3 と同じ項目を確認する。Preview は SSO で保護されているので、ログイン済みのブラウザから確認する（手順は [vercel-cli.md](./vercel-cli.md)。`vercel curl` は使わない）
5. `pnpm dev` を起動し、AGENTS.md の `nextjs-agent-rules` ブロックに差分が出たらコミットに含める
6. Next.js の Skills を更新する: `npx skills update -g`

## nodemailer の更新手順

1. `node_modules/nodemailer/CHANGELOG.md` の `BREAKING CHANGES` を読み、`app/api/submit-contact/route.ts` が使っている機能（`createTransport({ host, port, secure, auth })`、`sendMail({ from, to, subject, text, attachments })`、カンマ区切りの `to`、`Buffer` の添付）に関係するかを確かめる
2. 型は nodemailer 本体に同梱されている（`dist/esm/nodemailer.d.ts`）。`@types/nodemailer` は入れない
3. 実 SMTP を使わずに、`streamTransport`（`{ streamTransport: true, buffer: true }`）か `jsonTransport` で route.ts と同じ形のメッセージを組み立て、`info.envelope.to` に全宛先が入ること、添付の `Content-Type` / ファイル名 / 中身が正しいことを確かめる。確認用のスクリプトはコミットしない
4. `pnpm start` で `/api/submit-contact` に不正な入力を POST し、バリデーションのエラーが返る（route のモジュールが読み込める）ことを確かめる
5. Vercel Preview でお問い合わせを実際に送信する（送信先は社内の宛先）

## Node.js の更新手順

1. `package.json` の `engines.node` は `"26.x"` に固定している。パッチ更新では変更しない。メジャー更新（LTS の切り替え）では `engines.node` と `.node-version` を一緒に上げる
2. Node.js 26 系のセキュリティリリースが出たら、`.node-version` をそのバージョンに書き換え、ローカルの Node.js を上げる。nvm は Node.js のバージョンごとに別のディレクトリを持つので、新しいバージョンを入れたら `corepack enable` を実行し直す（忘れると `pnpm: command not found` になる）
3. `pnpm install` / `pnpm typecheck` / `pnpm lint` / `pnpm build` を確認する。`pnpm-workspace.yaml` の `engineStrict: true` により、Node.js が 26.x でなければ `pnpm install` が失敗する
4. Vercel のランタイムのパッチ更新は Vercel が自動で行う。Vercel は `engines.node` を見て 26.x を選ぶ

メジャー更新では、上に加えて次の 2 つも行う。

5. `@types/node` を同じメジャーに上げる。`@types/node` は `dependencies` に置いているので、`-D` を付けずに `pnpm add @types/node@^<メジャー>` とする（`-D` を付けると `devDependencies` に移ってしまう）
6. Vercel のプロジェクト設定（Project Settings の Node.js Version）を合わせる。`engines.node` が優先されるので動作は変わらないが、設定が古いとビルドログに `will not apply` という警告が出る。CLI からは次のように変えられる（ID は `vercel link` で作られる `.vercel/project.json` にある。git の管理外）

   ```bash
   vercel link --project pldl --team yamashitamanato --yes
   vercel api "/v9/projects/<projectId>?teamId=<orgId>" -X PATCH -F nodeVersion=<メジャー>.x
   ```

   PR の Preview のビルドログで、警告が消えたことを確かめる。ログは `vercel inspect dpl_<ID> --logs --scope yamashitamanato` で読める（`<ID>` は `gh pr checks` に出る Vercel の URL の末尾）

## 注意点

- pnpm の設定は `pnpm-workspace.yaml` に書く。`.pnpmrc` は読まれない。pnpm 12 はプロジェクトの `.npmrc` からも registry や認証などしか読まず、`engine-strict` などは無視される。設定が効いているかは `pnpm config get <key>` で確認する。
- `next` を更新すると、同梱の `postcss` / `sharp` も一緒に更新される。この 2 つを個別に上げる必要はない。
- 推移的依存は、まず `pnpm update <pkg...>` で親の指定範囲内に上げる。修正版が親の範囲外にしかない場合は、先に親パッケージ（例: minimatch なら typescript-eslint）の範囲内の新しい版が修正版を使っていないか `pnpm view <親> dependencies.<pkg>` で確かめる。それでも無理な場合に限り `pnpm.overrides` を使う。

## 対応記録

| 日付 | 内容 | Issue |
|---|---|---|
| 2026-11-19 | `pnpm audit` で 135 件（critical 5 / high 63）を検出。next 16.2.1 → 16.4.6、react 19.2.4 → 19.3.1、eslint-config-next 16.2.1 → 16.4.6 に更新し、critical は 0 件になった。残りは推移的依存（undici / ESLint 系）と nodemailer で、Issue #30 の ToDo として継続中 | #30 |
| 2026-11-19 | 推移的依存を範囲内で更新（`pnpm update`）。undici 7.22.0 → 7.30.2、source-map-js 1.2.1 → 1.2.2、ESLint 系（minimatch / brace-expansion / picomatch / flatted / js-yaml / browserslist / zod / @babel/core / @humanfs/node / baseline-browser-mapping）を更新。minimatch 9 系の advisory（GHSA-g3hv-75wg-m249）は修正版が 11 系のみのため、typescript-eslint を範囲内で 8.56.0 → 8.73.0 に上げて minimatch 11 系に移した。`pnpm.overrides` は不要。`pnpm audit` は 87 件（high 38）→ 20 件（high 4、すべて nodemailer） | #30 |
| 2026-11-19 | nodemailer 8.0.3 → 10.6.0 に更新し、`@types/nodemailer`（7.0.11）を削除（10.x は型を同梱）。9.0 / 10.0 の破壊的変更（リモート取得時の TLS 証明書検証、Node.js 20 以上）は route.ts の使い方に影響しないことを確認。route.ts は変更なし。`pnpm audit` は 0 件 | #30 |
| 2026-11-19 | `engines.node` を `">=24.x"` → `"24.x"` に固定し、`.node-version`（24.22.3）を追加。読まれていなかった `.pnpmrc` を削除し、`engineStrict` / `enablePrePostScripts` を `pnpm-workspace.yaml` に移した（pnpm 12 はプロジェクトの `.npmrc` からもこれらを読まないため）。`engines.node` を `25.x` にすると `pnpm install` が失敗することで、効いていることを確認 | #30 |
| 2026-11-20 | `pnpm audit --audit-level=high` を GitHub Actions で実行するワークフロー（`.github/workflows/audit.yml`）を追加。push / PR / 毎週の定期実行 | #30 |
| 2026-11-21 | Node.js の LTS が 26 系になったため、`engines.node` を `"24.x"` → `"26.x"`、`.node-version` を 24.22.3 → 26.13.1 に上げた。Vercel は Node.js 26 を正式にサポートしている | #50 |
| 2026-11-21 | #50 の残作業として、`@types/node` を ^24.1.0 → ^26.6.6 に上げ、Vercel の Project Settings の Node.js Version を 24.x → 26.x に変えた。Preview のビルドログから `will not apply` の警告が消えたことを確認。あわせて未使用の `ParallaxSection` を削除した（PR #53） | #50 |
