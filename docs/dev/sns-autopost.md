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
```

Instagram の API は **Instagram API with Unified Login**（`graph.facebook.com`）を使う。トークンはビジネスポートフォリオに属するシステムユーザーのアクセストークンで、**期限が無い**。作った人がポートフォリオを離れても有効なので、更新の仕組みは持たない。

> 最初は Instagram ログイン（`graph.instagram.com`、60 日で切れるトークンを Vercel Cron で毎日更新）で作ったが、2026-11 時点で「Instagram ログインによる API 設定は、新しいアプリでは利用できません」となっていたため、統合ログインに切り替えた（Issue #67）。

| ファイル | 役割 |
|---|---|
| `app/_libs/sns/microcms-webhook.ts` | 署名検証、ペイロードの型 |
| `app/_libs/sns/autopost.ts` | 投稿の判定と、二重投稿を防ぐ記録 |
| `app/_libs/sns/instagram.ts` | Instagram への投稿 |
| `app/_libs/sns/global-config.ts` | Vercel Global Config の読み書き |
| `app/_libs/sns/notify.ts` | 失敗の通知メール |
| `app/_constants/sns.ts` | キャプションの上限、画像の変換パラメータ、API のバージョンなど |

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

1. 投稿する前に `pending` を記録する。記録が無いときは `create` で書く。Global Config は既にあるキーへの `create` を **409 で拒否し、値も変えない**（2026-11-23 に確認）ので、同時に来た別のリクエストとかち合っても片方しか進まない。**409 以外の書き込みの失敗（権限など）は、スキップせず理由つきの失敗として知らせる**
2. 成功したら `posted`（投稿 ID 付き）に書き換える
3. 失敗したら記録を消す（次に公開したときに投稿し直せる）
4. `pending` のまま 10 分たった記録は、処理が途中で止まったとみなして投稿し直す

Global Config の応答の意味（API トークンで読み書きしたとき。2026-11-28 に本番で確認）:

| 操作 | 応答 | 扱い |
|---|---|---|
| 項目を読む | 200 | 記録あり |
| 項目を読む | **404**（`Edge Config Item not found.`） | 記録なし。CLI（`vercel api`）では 204 が返るので、CLI の結果を当てにしない |
| `create` | 409 | 同時に来た別のリクエストが先に記録した → スキップ |
| 書き込み | 403（`You don't have permission to create the edge config item.`） | `VERCEL_API_TOKEN` のスコープがチームになっていない（下の 3. を参照） |

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

### 2. Meta（Instagram API with Unified Login）

PLDL の Instagram（`playful_learning_design_lab`）は、すでにプロアカウント（ビジネス、カテゴリ「Education」、公開）。2026-11-25 に確認した。

作成済みのもの（2026-11-26）:

| もの | 値 |
|---|---|
| Meta の開発者アカウント | 山下の個人の Facebook アカウント |
| ビジネスポートフォリオ | Playful Learning Design Lab.（ID `1172826228733436`） |
| アプリ | PLDL Site Autopost（ID `2860862957641149`、開発モード、ポートフォリオの持ち物） |

つまずいた点:

- **Meta for Developers は、開発者登録をした個人の Facebook アカウントで操作する。** ポートフォリオへの招待メールから入ると「仕事用のアカウント」でログインした状態になり、アプリの画面が開けない（「WWWに移動」→ Not Found）。facebook.com で個人アカウントにログインしてから developers.facebook.com を開く
- **ポートフォリオを作るときの「名」「姓」には、作る人本人の名前を入れる。** 運営者は別に招待する
- **アプリの作成は、最後にパスワードを再入力して送信するまで完了しない**
- **統合ログインの設定では、`instagram_basic` と `instagram_manage_messages` は必須で外せない。** トークンは公開の Instagram アカウントにしか発行できない
- **PLDL の Instagram を追加するときは、役割の一覧の下にある「Instagramテスター」を選ぶ。** 上の 4 つ（管理者・開発者・テスター・Analytics ユーザー）は Facebook の人向けで、Instagram のユーザー名を入れると「does not resolve to a valid user ID」になる。ユーザー名は @ を付けずに `playful_learning_design_lab`
- 設定画面（ユースケース > Instagram でメッセージとコンテンツを管理 > カスタマイズ > API setup with Unified login）は、ブラウザの自動操作では真っ白になることがある。直接開く URL: `https://developers.facebook.com/apps/2860862957641149/use_cases/customize/Unified-Login-API-Setup/?use_case_enum=INSTAGRAM_BUSINESS&business_id=1172826228733436&selected_tab=Unified-Login-API-Setup&product_route=instagram-business`

手順（公式: [Unified Login を使って Instagram API の利用を開始する](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-unified-login/get-started)）:

1. **設定を作る。** 「新しい設定を作成」→「テンプレートから作成」。テンプレートは広告（`ads_management` / `ads_read`）とコメント管理まで要求するので、作ったあとに「アクセス許可を編集」で `instagram_basic`（投稿の読み取り。Instagram → Web でも使う）、`instagram_content_publish`（投稿）、必須の `instagram_manage_messages` だけに絞る。作成済みの設定: 設定 ID `1156455066881296`（2026-11-27）。アセットの「広告アカウント（任意）」は設定画面では外せないが、許可のときに選ばずに飛ばせばよい
2. **PLDL の Instagram をテスターにする。** 「アクセストークンを生成する」の「アカウントを追加」で招待し、PLDL の Instagram でログインしたウェブ版の Instagram で、設定 > ウェブサイトのアクセス許可 > アプリとウェブサイト > テスターの招待 から承認する
3. **トークンを生成する。** 「トークンを生成」でログインを済ませる。**トークンは一度しか表示されない。** 会話やチャットに貼らず、そのまま Vercel の `INSTAGRAM_ACCESS_TOKEN` に入れる
4. **Instagram のアカウント ID を調べる。** 自分のターミナルで次を実行し、`id` を `INSTAGRAM_USER_ID` に入れる（`/me` はシステムユーザーを指すので使わない）

```bash
read -rs TOKEN   # トークンを貼り付けて Enter（画面に表示されない）
curl -sG -d 'fields=id,username' -d "access_token=$TOKEN" \
  https://graph.facebook.com/v27.0/me/assigned_instagram_accounts
unset TOKEN
```

開発モードのまま、アプリに役割のある人（テスター）のアカウントで使う。公式ドキュメント上、他のアカウントをつながないなら App Review とライブモードは要らない。

動作確認が済んだら、運営者もポートフォリオとアプリの管理者に加える（管理者を 2 人以上にする）。

### 3. Vercel

**Global Config（旧 Edge Config）のストア:** `pldl-sns`（`ecfg_hkiuiqivdzeomnfdmgfmkk0qnyjg`）を作成済み。投稿済みの記録だけを置く。REST API で読み書きするので、プロジェクトへの接続は要らない。

**API トークンを作る。** [Account Settings > Tokens](https://vercel.com/account/settings/tokens) の「Create Token」で、次のとおり作る（作成済み: `pldl-sns-global-config-team`、2026-11-28）。

| 項目 | 値 |
|---|---|
| Token Name | `pldl-sns-global-config-team` |
| Scope | **「yamashitamanato」の名前そのものをクリックする。** 右の `>` を押すとチームの中のプロジェクト（`pldl`）を選べてしまい、そのトークンでは Global Config に書き込めない（403） |
| Expiration | No Expiration（期限を付けると、切れた日から投稿がすべて失敗する。付けるなら更新日を予定に入れる） |

- 作ったら、トークンの一覧の Scope 列が「yamashitamanato」になっていることを確かめる（「pldl」なら作り直す）
- トークンは一度しか表示されない。このトークンはチームのリソースを広く操作できるので、Sensitive にし、他の用途に使い回さない。CLI のログイン用トークンは流用しない

**環境変数**（Production）

| 変数 | 値 | 状態 |
|---|---|---|
| `MICROCMS_WEBHOOK_SECRET` | microCMS の Webhook のシークレット | 設定済み（Sensitive） |
| `GLOBAL_CONFIG_ID` | `ecfg_hkiuiqivdzeomnfdmgfmkk0qnyjg` | 設定済み |
| `VERCEL_TEAM_ID` | `team_n5MynGPv2rVqxM6sHVAWCB7I` | 設定済み |
| `VERCEL_API_TOKEN` | 上で作った API トークン | 設定済み（Sensitive） |
| `INSTAGRAM_ACCESS_TOKEN` | 統合ログインのシステムユーザーアクセストークン | 設定済み（Sensitive） |
| `INSTAGRAM_USER_ID` | Instagram のアカウント ID | 設定済み |

- 秘密の値は、引数や AI との会話に書かない。値をコピーしてから、Claude Code のプロンプトで次を実行し、終わったらクリップボードを空にする（`!` で実行するコマンドには入力欄が出ないので、標準入力から渡す。上書きするときは `--force` を足す）

```bash
! pbpaste | tr -d '\n' | vercel env add <名前> production --sensitive --yes
! pbcopy < /dev/null
```

- 入れたら、出力の「Added Environment Variable」と `vercel env ls production` の両方で確かめる
- `INSTAGRAM_USER_ID` か `INSTAGRAM_ACCESS_TOKEN` が無いあいだは、Webhook が来ても投稿せずにスキップする
- 環境変数は再デプロイするまで反映されない（[vercel-cli.md](./vercel-cli.md)）
- 以前の方式（トークンの更新）で使っていた `CRON_SECRET` は、Instagram の投稿の取り込み（[instagram-import.md](./instagram-import.md)）で使う

### 4. 動作確認

1. テスト用の記事を、「Instagramに投稿する」をオンにして公開する
2. Instagram に 1 件投稿されたことを確かめる
3. 記事を少し直して公開し直し、**投稿が増えない**ことを確かめる
4. Vercel の Logs で `[sns] 自動投稿の結果` を確かめる
5. 確かめたら、テスト投稿を Instagram 側で消し、テスト記事は公開終了にしてから削除する。Global Config の記録（`sns_instagram_<コンテンツID>`）も消す

**2026-11-28 に本番で確認した。** テスト記事を公開すると Instagram に 1 件投稿され（画像は正方形、文面と末尾の一文も設計どおり）、公開し直すと「投稿済み」でスキップされた。失敗したときのメールも届いた。そこに至るまでの失敗:

1. 「別の処理が投稿中」でスキップ: 書き込みの失敗をコードが隠していた → PR #92
2. 読み取りの 404 で失敗: API トークンでは記録なしが 404 になる → PR #93
3. 書き込みの 403 で失敗: `VERCEL_API_TOKEN` のスコープがプロジェクトだった → トークンを作り直した

テスト記事は、試すたびにすぐ公開終了にした（公開中はサイトの活動レポートの一覧にも出るため）。

---

## 運用

- **Instagram のトークン:** 期限は無い。ただし、ポートフォリオから Instagram のアカウントやアプリを外したり、パスワードの変更などで Meta がトークンを無効にしたりすると使えなくなる。投稿に失敗してメールが届き、理由がトークンのエラーなら、初期設定の 2. の 3〜4 をやり直す
- **トークンを取り消したいとき（漏れたときなど）:** 統合ログインのトークンは、Business Suite の「システムユーザー」の一覧には出てこない（2026-11-28 に確認したら空だった）。アプリの ユースケース > カスタマイズ > API setup with Unified login > 「2. アクセストークンを生成する」の行に、Instagram アカウントの「削除」ボタンがある。削除すると古いトークンが無効になる見込みだが、まだ試していない。削除したら「アカウントを追加」からやり直し、新しいトークンを Vercel に入れて再デプロイする。それまで自動投稿と取り込みは止まる
- **Global Config の容量:** 1 ストア 1MB。投稿の記録は 1 件 100 バイト程度なので、数千件までは問題ない
- **コンテンツ ID を変えない。** 投稿済みの記録はコンテンツ ID で持つので、投稿したあとに ID を変えると、もう一度投稿される
- **Instagram のプロフィールのリンク。** 投稿の末尾で「プロフィールのリンクからご覧ください」と案内するので、リンク先を新サイト（`https://pldl.or.jp/activities`）にしておく（2026-11-28 時点では旧サイト `ldl.cocotte.jp` のままだった）

## 確認済みになった点（2026-11-28）

- 開発モードのまま、テスターにした PLDL の Instagram に投稿できる（App Review もライブモードも要らなかった）
- `instagram_manage_messages` は外せない（設定画面で必須になっている）

## Instagram → Web

運営者の希望で、Instagram の投稿から活動レポートの下書きを作る仕組みを足した（Issue #96）。詳細は [instagram-import.md](./instagram-import.md)。

- 自動投稿したもの（キャプションの末尾に `INSTAGRAM_CAPTION_FOOTER` がある）は取り込まない。**この文言を変えると、行き来が起きうる**
- Graph API の一覧の応答の `paging.next` にはアクセストークンが入る。応答をそのままログや画面に出さない

## 確認した仕様（2026-11 時点）

- microCMS: 署名は `x-microcms-signature`（シークレットと生のボディの HMAC-SHA256、16 進）。予約公開でも通知される。リトライしない。PATCH API で公開中の記事を更新しても通知される
- Instagram: 画像は JPEG のみ。投稿は 24 時間で 100 件まで（ページ内に 50 件の記述もある）。コンテナの `status_code` は `FINISHED` / `IN_PROGRESS` / `ERROR` / `EXPIRED` / `PUBLISHED`。Instagram ログインによる API 設定は新しいアプリでは使えない。統合ログインはビジネスポートフォリオが必須で、トークンは期限の無いシステムユーザーアクセストークン、API は `graph.facebook.com`
- Vercel: 環境変数の変更は新しいデプロイにだけ反映される。Hobby プランの Cron は 1 日 1 回まで。Global Config の既にあるキーへの `create` は 409（`The key "..." already exists`）
