# SNS 自動投稿（Instagram）

microCMS で活動レポート（`reports`）を公開すると、Instagram に自動で投稿する。SNS の運用者がいないため、投稿だけを自動化している。コメントや DM への返信は自動化していない。

関連 Issue: #67

## X を対象にしていない理由

最初は X にも投稿する実装だった（PR #68）が、次の理由で消した。

- PLDL は X を運用していない（運営者に確認済み）
- X の API には、新規で使える無料プランが無い（2026-02 から従量課金のみ。URL 付きの投稿は 1 件 $0.20）

X の公式の changelog には「Public Utility Apps continue to receive free scaled access」とあるが、対象と申請方法は公式ページで確かめられなかった。X に投稿したくなったら、消した実装（PR #68 の `app/_libs/sns/x.ts`。OAuth 1.0a の署名と、日本語を 2 文字と数える文字数の切り詰め）を git の履歴から戻せる。

---

## 仕組み

```
microCMS（reports を公開 / 公開中の記事を更新）
  → Webhook（カスタム通知。x-microcms-signature で署名）
  → /api/webhooks/microcms（app/api/webhooks/microcms/route.ts）
      1. 署名を検証する
      2. reports で、公開中（status に PUBLISH を含む）のときだけ進む
      3. コンテンツ API から公開中の記事を取り直し、「Instagramに投稿する」（snsPost）がオンか確かめる
      4. Instagram に投稿する
      5. 失敗したら CONTACT_TO にメールする

Vercel Cron（毎日 18:00 UTC = 03:00 JST）
  → /api/cron/refresh-instagram-token
      Instagram の長期トークン（60 日で失効）を更新して保存する
```

| ファイル | 役割 |
|---|---|
| `app/_libs/sns/microcms-webhook.ts` | 署名検証、ペイロードの型 |
| `app/_libs/sns/autopost.ts` | 投稿の判定と、二重投稿を防ぐ記録 |
| `app/_libs/sns/instagram.ts` | Instagram への投稿、トークンの更新 |
| `app/_libs/sns/global-config.ts` | Vercel Global Config の読み書き |
| `app/_libs/sns/notify.ts` | 失敗の通知メール |
| `app/_constants/sns.ts` | キャプションの上限、画像の変換パラメータ、API のバージョンなど |
| `vercel.json` | Cron の設定 |

### 投稿する条件

**公開中** かつ **「Instagramに投稿する」がオン** かつ **まだ投稿していない** とき。

- 新規公開に限らない。公開済みの記事で後からチェックを入れて公開し直しても投稿する
- 投稿済みかどうかは Global Config に記録する（キー: `sns_instagram_<コンテンツID>`）
- 誤字を直して公開し直しても、二度は投稿しない

### 投稿の中身

| | 内容 |
|---|---|
| 文面 | Instagram用の文面（`snsCaption`）。空なら `タイトル + 説明文` |
| 長さ | 2,200 文字。超えたら切る |
| リンク | キャプションのリンクは押せないので、「活動レポートの全文は、プロフィールのリンクからご覧ください。」を末尾に付ける |
| 画像 | サムネイルを microCMS の画像 API で 1080x1080 の JPEG に変換して使う（Instagram は JPEG しか受け付けない）。**サムネイルが無い記事は投稿できない**（失敗として通知する） |

### 失敗したとき

microCMS の Webhook は**リトライしない**。失敗すると `CONTACT_TO` にメールが届くので、原因を直してから **microCMS で記事をもう一度「公開」する**。まだ投稿できていなければ投稿し直す。

二重投稿を防ぐ流れ:

1. 投稿する前に `pending` を記録する。記録が無いときは `create` で書く。Global Config は既にあるキーへの `create` を **409 で拒否し、値も変えない**（2026-11-23 に確認）ので、同時に来た別のリクエストとかち合っても片方しか進まない
2. 成功したら `posted`（投稿 ID 付き）に書き換える
3. 失敗したら記録を消す（次に公開したときに投稿し直せる）
4. `pending` のまま 10 分たった記録は、処理が途中で止まったとみなして投稿し直す

---

## 始める前に（アカウントの持ち主と確認すること）

Instagram のアカウントの持ち主は PLDL の運営者。設定する前に、次のことを確認して許可をもらう。

- **プロアカウント（ビジネスかクリエイター）への切り替え。** API で投稿するのに必要。**プロアカウントは非公開にできない**
- **子どもが写っている写真の掲載。** 記事のサムネイルがそのまま Instagram に載る。サイトへの掲載許可が SNS まで含んでいるかを確かめる
- **ログインの方法。** パスワードを受け取る場合は、パスワード管理ツールの共有機能を使い、LINE やメールでは受け取らない。トークンの発行に要るのは「持ち主が一度ログインしてアプリを許可すること」なので、一緒に画面を見ながらログインだけしてもらえば、パスワードを受け取らずに済む

---

## 初期設定

### 1. microCMS

**reports にフィールドを追加する**（API 設定 > API スキーマ）

| フィールド ID | 表示名 | 種類 | 必須 | 備考 |
|---|---|---|---|---|
| `snsPost` | Instagramに投稿する | 真偽値 | いいえ | 初期値はオフ |
| `snsCaption` | Instagram用の文面 | テキストエリア | いいえ | 空なら タイトル + 説明文 |

**Webhook を設定する**（API 設定 > Webhook > カスタム通知）

- URL: `https://pldl.or.jp/api/webhooks/microcms`
- シークレット: Vercel の `MICROCMS_WEBHOOK_SECRET` と同じ値。Sensitive なので Vercel からは読み出せない。分からなくなったら、新しく作って両方に入れ直す（`openssl rand -hex 32`）
- 通知のタイミング: コンテンツの公開（予約公開を含む）と、公開中のコンテンツの更新

`microcms-template.json` は現在のスキーマと合っていない（reports が無い）ため、更新していない。

### 2. Instagram（Instagram ログイン）

1. Instagram のアカウントをプロアカウントにする
2. Meta for Developers でアプリを作り、「Instagram ログインによる API 設定」を追加する
3. アプリのダッシュボードで PLDL の Instagram アカウントを追加し、アクセストークンを生成する（長期トークン）
4. ダッシュボードに出るアカウント ID を `INSTAGRAM_USER_ID` に入れる。分からなければ `GET https://graph.instagram.com/v27.0/me?fields=user_id,username` の `user_id`
5. トークンを Global Config の `instagram_token` に保存する（下の 3.）

自分が管理するアカウントにだけ投稿するので、公式ドキュメント上は Standard Access で足りる。App Review が要るかどうかは、最初の投稿で確かめる。

### 3. Vercel

**Global Config（旧 Edge Config）のストア:** `pldl-sns`（`ecfg_hkiuiqivdzeomnfdmgfmkk0qnyjg`）を作成済み。REST API で読み書きするので、プロジェクトへの接続は要らない。

ダッシュボードの Storage > `pldl-sns` > Items に、次の項目を追加する。

```json
{
  "instagram_token": {
    "accessToken": "<2. で生成した長期トークン>",
    "refreshedAt": "<保存した日時。例: 2026-11-24T00:00:00.000Z>"
  }
}
```

**API トークンを作る**（Account Settings > Tokens）。名前は `pldl-sns-global-config`、スコープはチーム `yamashitamanato`。このトークンはチームのリソースを広く操作できるので、Sensitive にし、他の用途に使い回さない。期限を付けると切れたときに投稿が止まるので、付けるなら更新日を予定に入れる。CLI のログイン用トークンは流用しない。

**環境変数**（Production）

| 変数 | 値 | 状態 |
|---|---|---|
| `MICROCMS_WEBHOOK_SECRET` | microCMS の Webhook のシークレット | 設定済み（Sensitive） |
| `CRON_SECRET` | 推測できない長い文字列。Vercel Cron が自動で `Authorization: Bearer` に付けて送る | 設定済み（Sensitive） |
| `GLOBAL_CONFIG_ID` | `ecfg_hkiuiqivdzeomnfdmgfmkk0qnyjg` | 設定済み |
| `VERCEL_TEAM_ID` | `team_n5MynGPv2rVqxM6sHVAWCB7I` | 設定済み |
| `VERCEL_API_TOKEN` | 上で作った API トークン | 未設定 |
| `INSTAGRAM_USER_ID` | Instagram のユーザー ID | 未設定 |

- 秘密の値は `vercel env add <名前> production --sensitive` を自分のターミナルで実行し、入力欄に貼り付ける（引数や AI との会話に書かない）
- `INSTAGRAM_USER_ID` が無いあいだは、Webhook が来ても投稿せずにスキップする
- 環境変数は再デプロイするまで反映されない（[vercel-cli.md](./vercel-cli.md)）

### 4. 動作確認

1. テスト用の記事を、「Instagramに投稿する」をオンにして公開する
2. Instagram に 1 件投稿されたことを確かめる
3. 記事を少し直して公開し直し、**投稿が増えない**ことを確かめる
4. Vercel の Logs で `[sns] 自動投稿の結果` を確かめる
5. 確かめたら、テスト投稿を Instagram 側で消す

---

## 運用

- **Instagram のトークン:** Cron が毎日更新する。更新に失敗すると毎日メールが届く。最後の更新から 60 日たつと失効して更新できなくなるので、その前に直す。失効したら初期設定の 2. と 3. のトークン保存をやり直す
- **Global Config の容量:** 1 ストア 1MB。投稿の記録は 1 件 100 バイト程度なので、数千件までは問題ない

## 未確認の点（最初に本番で動かしたときに確かめる）

- Instagram の投稿に App Review が要らないこと
- Vercel の Cron Jobs は Schedules に移行する予定と案内されている。移行されたら `vercel.json` を見直す

## 検討中: Instagram → Web

運営者から「Instagram → Web の逆方向はできるか」と聞かれ、次の 2 つを提案した（運営者の返事待ち）。

- **A. サイトに Instagram の最新投稿を並べる。** `GET /<IG_ID>/media` で読める。いまのトークンで足りる
- **B. Instagram の投稿から活動レポートの下書きを作る。** microCMS の `POST /api/v1/reports?status=draft` と画像のアップロード API（`POST https://<サービス>.microcms-management.io/api/v1/media`、5MB まで）を使う。どちらも Hobby プランで使える

作るときの注意:

- Instagram には「新しい投稿」の Webhook が無い。Cron で見に行く（Hobby プランでは 1 日 1 回まで）
- 公式ドキュメントで、Instagram ログインで `caption` を読めるかの記述が食い違っている。実際に呼んで確かめてから設計する
- 両方向を同時に動かすときは、Web から投稿したものを Web の下書きに戻さないようにする
- microCMS の Hobby プランは API キーが 2 つまで。書き込み用のキーを作ると上限に達する

## 確認した仕様（2026-11 時点）

- microCMS: 署名は `x-microcms-signature`（シークレットと生のボディの HMAC-SHA256、16 進）。予約公開でも通知される。リトライしない。PATCH API で公開中の記事を更新しても通知される
- Instagram: 画像は JPEG のみ。投稿は 24 時間で 100 件まで（ページ内に 50 件の記述もある）。コンテナの `status_code` は `FINISHED` / `IN_PROGRESS` / `ERROR` / `EXPIRED` / `PUBLISHED`。長期トークンは作成から 24 時間以上たってから更新でき、更新すると 60 日延びる
- Vercel: 環境変数の変更は新しいデプロイにだけ反映される。Hobby プランの Cron は 1 日 1 回まで。Global Config の既にあるキーへの `create` は 409（`The key "..." already exists`）
