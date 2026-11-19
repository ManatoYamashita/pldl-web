# Vercel CLI 利用ガイド

Vercel CLI でこのリポジトリを操作するときの手順と注意点。

## プロジェクト情報

| 項目 | 値 |
|---|---|
| チーム（scope） | `yamashitamanato` |
| プロジェクト名 | **`pldl`**（リポジトリ名の `pldl-web` とは違う） |
| プロジェクト ID | `prj_gW8ApDx3YKZ739o48QJ2saGA4jwV` |
| 本番 URL | https://pldl.or.jp |
| Preview | Vercel Authentication（SSO）で保護されている |

## link 手順（CLI を使う前に必ず行う）

`vercel curl` / `vercel env` / `vercel deploy` などのプロジェクトを対象にするコマンドは、**先に link してから**実行する。

```bash
# 1. ログイン状態を確認する
vercel whoami

# 2. 既存の pldl プロジェクトに link する
vercel link --project pldl --team yamashitamanato --yes

# 3. 正しいプロジェクトに link されたか確認する
cat .vercel/project.json
# => "projectName":"pldl" で、projectId が上の表と一致すること
```

- `.vercel/` は `.gitignore` に入っているので、コミットされない
- `--project` を付けずに `vercel link --yes` を実行しない。ディレクトリ名から推測した別のプロジェクトにつながったり、新しいプロジェクトが作られたりする

## やってはいけないこと

### link していない状態で `--yes` を付けて実行しない

link していないディレクトリで `vercel curl ... --yes` などを実行すると、CLI は確認なしに次のことを行う。

1. ディレクトリ名（`pldl-web`）で **新しい Vercel プロジェクトを作る**
2. そのプロジェクトに **GitHub リポジトリを接続する**

放置すると、push のたびに新しいプロジェクトでもビルドが走る。環境変数が無いのでビルドは失敗し、PR に不要なチェックが付く。

### Preview の確認に `vercel curl` を使わない

`vercel curl` は、保護された Preview にアクセスするため、プロジェクトに **Protection Bypass for Automation のシークレットを自動で作る**。本番プロジェクトの設定にシークレットが残るため、使わない。Preview は下の手順でブラウザから確認する。

## Preview の確認手順

1. Preview の URL を調べる。PR に付く Vercel のコメントから開くか、次のコマンドで取得する

   ```bash
   SHA=$(git rev-parse <ブランチ名>)
   ID=$(gh api "repos/ManatoYamashita/pldl-web/deployments?sha=$SHA" --jq '.[0].id')
   gh api "repos/ManatoYamashita/pldl-web/deployments/$ID/statuses" --jq '.[0] | {state, environment_url}'
   ```

2. Vercel にログイン済みのブラウザで URL を開く。curl では SSO の画面へ 302 でリダイレクトされる
3. 開発者ツールのコンソールで、同じオリジンから `fetch` して確認する（確認項目は [dependency-security.md](./dependency-security.md) のチェックリストを参照）

   ```js
   const r = await fetch('/_next/image?url=...&w=640&q=75', {
     headers: { Accept: 'image/avif,image/webp,*/*' },
   });
   [r.status, r.headers.get('content-type')];
   ```

- `proxy.ts` が付ける `CDN-Cache-Control` は Vercel のエッジが受け取って消すため、ブラウザには届かない。キャッシュが効いているかは `x-vercel-cache` ヘッダーで確認する
- お問い合わせフォームの送信テストでは、実在の宛先（`CONTACT_TO`）にメールが届く。送信するのは送信まわりを変更したときだけにする

## 誤ってプロジェクトを作ってしまったとき

```bash
# 中身を確認する（作成日時・デプロイが無いこと）
vercel project inspect <誤って作ったプロジェクト名> --scope yamashitamanato
vercel ls <誤って作ったプロジェクト名> --scope yamashitamanato

# 削除する（中のデプロイもすべて消える。元に戻せない）
vercel project rm <誤って作ったプロジェクト名> --scope yamashitamanato

# 正しいプロジェクトに link し直す
rm -rf .vercel
vercel link --project pldl --team yamashitamanato --yes
```

**`pldl` 自体を削除しないこと。** 削除する前に、プロジェクト名とプロジェクト ID を必ず確認する。

## 対応記録

| 日付 | 内容 |
|---|---|
| 2026-11-19 | PR #32 の Preview を確認しようとして、link していない状態で `vercel curl --yes` を実行した。その結果 `pldl-web` プロジェクトが作られ、GitHub まで接続された。デプロイは 0 件の状態ですぐに削除し、`pldl` に link し直した。この経験からこのドキュメントを作成した |
