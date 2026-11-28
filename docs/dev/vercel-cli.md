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

## 環境変数を変更して本番に反映する

- 環境変数を変えても、今動いているデプロイには反映されない。変更後に再デプロイする
- 再デプロイは `vercel redeploy <最新の本番デプロイの URL> --target=production --scope yamashitamanato`。`--scope` を付けないと「Deployment belongs to a different team」で失敗することがある
- Sensitive の変数は `vercel env pull` で値が空になる
- パスワードやトークンは、コマンドの引数（`--value`）や AI との会話に書かない。自分のターミナルで `vercel env add <名前> production` を引数なしで実行して入力欄に貼り付けるか、ダッシュボードで編集する
- Claude Code のプロンプトで `!` を付けて実行すると入力欄が出ず、「Provide all required inputs for non-interactive mode」で失敗する。そのときは値をコピーしてから `! pbpaste | tr -d '\n' | vercel env add <名前> production --sensitive --yes` で標準入力から渡し、終わったら `! pbcopy < /dev/null` でクリップボードを空にする。上書きするときは `--force` を足す
- 入れたら、出力の「Added Environment Variable」と `vercel env ls production` の両方で確かめる
- `vercel api <パス>` で、ログイン中のアカウントの権限で Vercel の REST API を呼べる（例: Global Config のストアの作成や項目の確認）
- お問い合わせメールの設定の具体例は [email-setup.md](./email-setup.md#本番の構成) を参照

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
| 2026-11-22 | お問い合わせメールの送信を Workspace の `info@pldl.or.jp` に切り替えた。`redeploy` が `--scope` なしで失敗したこと、Sensitive の値は pull できないことを追記した |
| 2026-11-28 | Instagram 自動投稿の環境変数を入れたときに、`!` で実行した `vercel env add` が入力欄を出せずに失敗した。クリップボードから標準入力で渡す方法と、`vercel api` を追記した |
