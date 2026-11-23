# SNS 自動投稿（X / Instagram）

microCMS で活動レポート（`reports`）を公開すると、X と Instagram に自動で投稿する。SNS の運用者がいないため、投稿だけを自動化している。コメントや DM への返信は自動化していない。

関連 Issue: #67

---

## 仕組み

```
microCMS（reports を公開 / 公開中の記事を更新）
  → Webhook（カスタム通知。x-microcms-signature で署名）
  → /api/webhooks/microcms（app/api/webhooks/microcms/route.ts）
      1. 署名を検証する
      2. reports で、公開中（status に PUBLISH を含む）のときだけ進む
      3. コンテンツ API から公開中の記事を取り直し、「SNSに投稿する」（snsPost）がオンか確かめる
      4. X と Instagram に別々に投稿する（片方が失敗しても、もう片方は投稿する）
      5. 失敗があれば CONTACT_TO にメールする

Vercel Cron（毎日 18:00 UTC = 03:00 JST）
  → /api/cron/refresh-instagram-token
      Instagram の長期トークン（60 日で失効）を更新して保存する
```

| ファイル | 役割 |
|---|---|
| `app/_libs/sns/microcms-webhook.ts` | 署名検証、ペイロードの型 |
| `app/_libs/sns/autopost.ts` | 投稿の判定と、二重投稿を防ぐ記録 |
| `app/_libs/sns/x.ts` | X への投稿（OAuth 1.0a の署名、文字数の数え方） |
| `app/_libs/sns/instagram.ts` | Instagram への投稿、トークンの更新 |
| `app/_libs/sns/global-config.ts` | Vercel Global Config の読み書き |
| `app/_libs/sns/notify.ts` | 失敗の通知メール |
| `app/_constants/sns.ts` | 文字数の上限、画像の変換パラメータ、API のバージョンなど |
| `vercel.json` | Cron の設定 |

### 投稿する条件

**公開中** かつ **「SNSに投稿する」がオン** かつ **そのサービスにまだ投稿していない** とき。

- 新規公開に限らない。公開済みの記事で後からチェックを入れて公開し直しても投稿する
- 投稿済みかどうかは、サービスごとに Global Config へ記録する（キー: `sns_x_<コンテンツID>` / `sns_instagram_<コンテンツID>`）
- 誤字を直して公開し直しても、投稿済みのサービスには投稿しない

### 投稿の中身

| | X | Instagram |
|---|---|---|
| 文面 | SNS用の文面（`snsCaption`）。空なら `タイトル + 説明文` | X と同じ |
| 長さ | 280（重み付き。日本語は 1 文字 2、URL は 23）。超えたら「…」で切る | 2,200 文字。超えたら切る |
| リンク | 末尾に記事の URL | 押せないので「プロフィールのリンクからご覧ください」を末尾に付ける |
| 画像 | 付けない（記事の OGP 画像がカードで出る） | サムネイルを microCMS の画像 API で 1080x1080 の JPEG に変換して使う。**サムネイルが無い記事は投稿できない**（失敗として通知する） |

### 失敗したとき

microCMS の Webhook は**リトライしない**。失敗すると `CONTACT_TO` にメールが届くので、原因を直してから **microCMS で記事をもう一度「公開」する**。投稿できていないサービスだけ投稿し直す。

二重投稿を防ぐ流れ:

1. 投稿する前に `pending` を記録する。記録が無いときは `create` で書くので、同時に来た別のリクエストとかち合うと片方が止まる
2. 成功したら `posted`（投稿 ID 付き）に書き換える
3. 失敗したら記録を消す（次に公開したときに投稿し直せる）
4. `pending` のまま 10 分たった記録は、処理が途中で止まったとみなして投稿し直す

---

## 初期設定（手作業）

### 1. microCMS

**reports にフィールドを追加する**（API 設定 > API スキーマ）

| フィールド ID | 表示名 | 種類 | 必須 | 備考 |
|---|---|---|---|---|
| `snsPost` | SNSに投稿する | 真偽値 | いいえ | 初期値はオフ |
| `snsCaption` | SNS用の文面 | テキストエリア | いいえ | 空なら タイトル + 説明文 |

**Webhook を設定する**（API 設定 > Webhook > カスタム通知）

- URL: `https://pldl.or.jp/api/webhooks/microcms`
- シークレット: 推測できない長い文字列（`openssl rand -hex 32` など）。同じ値を Vercel の `MICROCMS_WEBHOOK_SECRET` に入れる
- 通知のタイミング: コンテンツの公開（予約公開を含む）と、公開中のコンテンツの更新

`microcms-template.json` は現在のスキーマと合っていない（reports が無い）ため、更新していない。

### 2. X

1. X の開発者ポータルでアプリを作り、権限を **Read and write** にする
2. 権限を変えた**あとで** Access Token と Secret を発行する（先に発行したトークンは読み取り専用のまま）
3. API Key / API Key Secret / Access Token / Access Token Secret を Vercel の環境変数に入れる
4. 従量課金のクレジットを購入する。URL 付きの投稿は 1 件 $0.20（2026-11 時点。公式の料金ページで確かめる）

### 3. Instagram（Instagram ログイン）

1. Instagram のアカウントをプロアカウント（ビジネスかクリエイター）にする
2. Meta for Developers でアプリを作り、「Instagram ログインによる API 設定」を追加する
3. アプリのダッシュボードで PLDL の Instagram アカウントを追加し、アクセストークンを生成する（長期トークン）
4. ユーザー ID を確かめる: `GET https://graph.instagram.com/v27.0/me?fields=user_id,username` → `user_id` を `INSTAGRAM_USER_ID` に入れる
5. トークンを Global Config の `instagram_token` に保存する（下の 4.）

自分が管理するアカウントにだけ投稿するので、公式ドキュメント上は Standard Access で足りる。App Review が要るかどうかは、最初の投稿で確かめる。

### 4. Vercel

**Global Config（旧 Edge Config）のストアを作る**（Storage > Create > Global Config）。プロジェクト `pldl` に接続し、次の項目を追加する。

```json
{
  "instagram_token": {
    "accessToken": "<3. で生成した長期トークン>",
    "refreshedAt": "<保存した日時。例: 2026-11-23T00:00:00.000Z>"
  }
}
```

**API トークンを作る**（Account Settings > Tokens）。スコープはチーム `yamashitamanato`。このトークンはチームのリソースを広く操作できるので、必ず Sensitive にし、他の用途に使い回さない。

**環境変数**（Production。すべて Sensitive 推奨）

| 変数 | 値 |
|---|---|
| `MICROCMS_WEBHOOK_SECRET` | microCMS の Webhook に設定したシークレット |
| `X_API_KEY` / `X_API_SECRET` | X の API Key / API Key Secret |
| `X_ACCESS_TOKEN` / `X_ACCESS_TOKEN_SECRET` | X の Access Token / Secret |
| `INSTAGRAM_USER_ID` | Instagram のユーザー ID |
| `GLOBAL_CONFIG_ID` | Global Config のストア ID（`ecfg_...`） |
| `VERCEL_API_TOKEN` | 上で作った API トークン |
| `VERCEL_TEAM_ID` | チーム ID（`team_...`） |
| `CRON_SECRET` | 推測できない長い文字列。Vercel Cron が自動で `Authorization: Bearer` に付けて送る |

- X か Instagram の変数が無いと、そのサービスはスキップする（片方だけ先に始められる）
- 環境変数は再デプロイするまで反映されない（[vercel-cli.md](./vercel-cli.md)）

### 5. 動作確認

1. テスト用の記事を、「SNSに投稿する」をオンにして公開する
2. X と Instagram に 1 件ずつ投稿されたことを確かめる
3. 記事を少し直して公開し直し、**投稿が増えない**ことを確かめる
4. Vercel の Logs で `[sns] 自動投稿の結果` を確かめる
5. 確かめたら、テスト投稿を SNS 側で消す

---

## 運用

- **Instagram のトークン:** Cron が毎日更新する。更新に失敗すると毎日メールが届く。最後の更新から 60 日たつと失効して更新できなくなるので、その前に直す。失効したら初期設定の 3. と 4. のトークン保存をやり直す
- **Global Config の容量:** 1 ストア 1MB。投稿の記録は 1 件 100 バイト程度なので、数千件までは問題ない

## 未確認の点（最初に本番で動かしたときに確かめる）

- X の `POST /2/tweets` が OAuth 1.0a のユーザーコンテキストを受け付けること（公式の仕様に `UserToken`（`scheme: OAuth`）があるが、名前は書かれていない）
- Global Config の `create` が、キーが既にあるときに失敗すること（失敗しない場合、同時に来たリクエストで二重投稿する可能性が残る）
- Instagram の投稿に App Review が要らないこと
- Vercel の Cron Jobs は Schedules に移行する予定と案内されている。移行されたら `vercel.json` を見直す

## 確認した仕様（2026-11 時点）

- microCMS: 署名は `x-microcms-signature`（シークレットと生のボディの HMAC-SHA256、16 進）。予約公開でも通知される。リトライしない。PATCH API で公開中の記事を更新しても通知される
- Instagram: 画像は JPEG のみ。投稿は 24 時間で 100 件まで（ページ内に 50 件の記述もある）。コンテナの `status_code` は `FINISHED` / `IN_PROGRESS` / `ERROR` / `EXPIRED` / `PUBLISHED`。長期トークンは作成から 24 時間以上たってから更新でき、更新すると 60 日延びる
- X: 投稿は従量課金。URL は長さに関係なく 23 文字、日本語は 1 文字 2 として数える
- Vercel: 環境変数の変更は新しいデプロイにだけ反映される。Hobby プランの Cron は 1 日 1 回まで
