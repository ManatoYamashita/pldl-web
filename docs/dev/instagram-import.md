# Instagram の投稿から活動レポートの下書きを作る

1 日 1 回 Instagram を見に行き、新しい投稿から microCMS の活動レポート（`reports`）の**下書き**を作る。公開はしない。運営者が下書きを確かめて公開する。

逆向き（サイト → Instagram）の自動投稿は [sns-autopost.md](./sns-autopost.md)。Meta のアプリ、トークン、Global Config はそちらと共有している。

関連 Issue: #96

## なぜこの形か

運営者に「Instagram → Web」の方法を 2 つ示した（2026-11-25）。

- A. サイトに Instagram の最新投稿を並べる
- **B. Instagram の投稿から活動レポートの下書きを作る** ← 運営者の希望

決めたこと（2026-11-28）:

| 項目 | 決めたこと | 理由 |
|---|---|---|
| カテゴリ | 「活動レポート」（`reports`）に固定 | Instagram の投稿にはカテゴリが無い。違えば運営者が下書きで直す |
| 画像 | 1 枚目をサムネイル、2 枚目以降は本文の末尾 | 投稿と同じ内容を残す |
| 取り込む範囲 | 動かし始めた後の新しい投稿だけ | 過去の投稿で下書きが大量にできるのを防ぐ |
| 動画・リール | 取り込まない | microCMS の画像のアップロード API は Hobby プランでは画像だけ。カルーセルの中の動画も飛ばす |
| microCMS の API キー | 表示用の `MICROCMS_API_KEY` に書き込み権限を足す | Hobby プランはキーが 2 つまで。キーはサーバーでしか使わない |

## 仕組み

```
Vercel Cron（毎日 01:00 UTC = 10:00 JST ごろ。vercel.json）
  → GET /api/cron/instagram-import（Authorization: Bearer CRON_SECRET）
      1. 初回は「この日時より後を取り込む」目印（ig_import_since）を置いて終わる
      2. Instagram の最新 25 件を取得し、目印より後の投稿だけを古い順に見る
      3. サイトから自動投稿したもの（末尾に「活動レポートの全文は…」がある）と、画像の無い投稿（動画）は飛ばす
      4. 投稿ごとに Global Config の記録（ig_import_<投稿 ID>）を確かめ、取り込んでいなければ
         画像を microCMS にアップロード → 下書きを作る（「Instagramに投稿する」はオフ）
      5. 作った下書きと失敗を CONTACT_TO にメールする
```

| ファイル | 役割 |
|---|---|
| `app/api/cron/instagram-import/route.ts` | Cron の入口、認証、通知メールの文面 |
| `app/_libs/sns/instagram-import.ts` | 取り込む投稿の判定と、二重取り込みを防ぐ記録 |
| `app/_libs/sns/instagram-caption.ts` | キャプション → タイトル・説明文・本文（HTML） |
| `app/_libs/sns/microcms-write.ts` | microCMS への画像のアップロードと下書きの作成 |
| `app/_libs/sns/instagram.ts` | `fetchInstagramMedia`（投稿の取得） |

### キャプションから下書きを作る規則

PLDL の投稿は「`【タイトル】絵文字`」で始まり、「`・`」だけの行と「`NPO法人 Playful Learning Design Lab.`」で終わる形がそろっている。

- **タイトル:** 1 行目の `【】` の中。`【】` が無ければ 1 行目（60 文字まで）。キャプションが空なら「Instagram の投稿（2026年8月16日）」
- **本文:** 2 行目以降。末尾の「`・`」だけの行・団体名・ハッシュタグだけの行は取り除く。空行で段落に分け、段落の中の改行は `<br>` にする。HTML の特殊文字はエスケープする
- **説明文（description）:** 本文の先頭 120 文字
- **公開日:** 下書きを公開した日時になる（Instagram の投稿日にはならない）。通知メールに元の投稿のリンクを載せる

### 二重取り込みを防ぐ記録

Global Config に投稿ごとの記録を置く。自動投稿と同じく、`create` が 409 になれば別の実行が先に進めたとみなす。

| 記録 | 意味 | 次の実行 |
|---|---|---|
| なし | まだ取り込んでいない | 取り込む |
| `pending` | 取り込み中 | 10 分より古ければ取り込み直す |
| `imported`（`contentId` 付き） | 下書きを作った | 何もしない |
| `failed`（`attempts` 付き） | 失敗した | 3 回失敗するまで、翌日以降に取り込み直す |

- 1 回の実行で取り込むのは 5 件まで。残りは翌日に回す。実行開始から 200 秒を過ぎたら新しい投稿に手を付けない（`maxDuration` は Hobby の上限の 300 秒）
- 下書きを作ったあとで記録の書き込みに失敗すると `pending` が残り、翌日にもう一度下書きができる。重複した下書きは運営者が消す
- 画像をアップロードしたあとで下書きの作成に失敗すると、画像だけが microCMS のメディアに残る

### 行き来しないための約束

- **サイト → Instagram の投稿は取り込まない。** 自動投稿のキャプションの末尾には必ず `INSTAGRAM_CAPTION_FOOTER`（「活動レポートの全文は、プロフィールのリンクからご覧ください。」）が付くので、それで見分ける。この文言を変えるときは、変える前の投稿が取り込まれないかを考える
- **取り込んだ下書きは Instagram に投稿しない。** 下書きは `snsPost: false` で作る。運営者が「Instagramに投稿する」をオンにしない限り、公開しても投稿されない

## 初期設定

### 1. microCMS の API キーに権限を足す

管理画面の「権限管理 > API キー」（`https://pldl.microcms.io/api-keys`）で、`MICROCMS_API_KEY` のキー（名前は `default`。キーは 1 つだけ）に次を足す。**設定済み（2026-11-28）。**

- **コンテンツ API の個別権限:** 対象 API「活動レポート」に `GET` と `POST`。**個別権限はデフォルト権限を上書きする**ので、`GET` を外すとサイトの活動レポートが表示できなくなる
- **マネジメント API:** 「メディアのアップロード」だけ

変えたあとは、reports・categories・members の GET が 200 を返すことと、本番の `/activities` が表示されることを確かめる。

このキーはサーバーでしか使わない（`NEXT_PUBLIC_` ではない）。漏れると記事を作れてしまうので、他の用途に使い回さない。

### 2. Vercel の環境変数

| 変数 | 値 | 状態 |
|---|---|---|
| `CRON_SECRET` | 16 文字以上のランダムな文字列 | 設定済み（Sensitive、2026-11-28） |

Instagram と Global Config の環境変数は自動投稿と共有している（[sns-autopost.md](./sns-autopost.md)）。

```bash
# 値を作って、そのまま Production に入れる（値は画面にもクリップボードにも出ない。人が知る必要も無い）
openssl rand -hex 32 | tr -d '\n' | vercel env add CRON_SECRET production --sensitive --yes
```

`CRON_SECRET` が無いと、ルートは 500 を返して何もしない。

### 3. 動かし始める

マージして本番にデプロイすると、翌日の 10:00（JST）ごろの Cron で `ig_import_since` が置かれる。取り込みはその後の投稿から。

すぐに目印を置きたいときは、Vercel の Project > Settings > Cron Jobs から「Run」で手動実行する。

### 4. 動作確認

1. 目印が置かれたあと、Global Config の `ig_import_since` を、最新の投稿の少し前の日時に書き換える
2. Cron を手動で実行する
3. 最新の投稿の下書きが 1 件でき、メールが届くことを確かめる（タイトル・本文・サムネイル・本文の画像・カテゴリ・「Instagramに投稿する」がオフ）
4. もう一度実行して、下書きが増えないことを確かめる
5. 確かめたら、下書きと、アップロードされた画像（メディア管理）と、`ig_import_<投稿 ID>` の記録を消し、`ig_import_since` を今の日時に戻す

## 守ること

- **Graph API の応答をそのままログや画面に出さない。** 一覧の応答の `paging.next` には、アクセストークンが入った URL が入る。`fetchInstagramMedia` は `data` だけを返す（2026-11-28、確認用のスクリプトが応答をそのまま表示し、トークンが作業ログに出た）
- エラー文には、API の応答の `message` だけを入れる

## 確かめたこと（2026-11-28）

- 統合ログインのシステムユーザーのトークンで、`/<IG_ID>/media` の `caption`・`media_type`・`media_url`・`permalink`・`timestamp`・カルーセルの `children` が読める
- `media_url` は `scontent-*.cdninstagram.com` の署名付き URL で、期限（`oe=`）がある
- Global Config（Edge Config から改名）のストアの上限は 1MB（Hobby も同じ）。記録は 1 件 100 バイト程度
- Vercel Functions の `maxDuration` は Hobby で最大 300 秒（Fluid compute）
- microCMS の `POST /api/v1/{endpoint}?status=draft` で下書きを作れる。画像のフィールドには、同じサービスにアップロード済みの画像の URL を渡す。省いたフィールドにはスキーマの初期値が入らない

まだ確かめていないこと:

- 本番での取り込み（初期設定の 4.）
- microCMS の Hobby プランで、マネジメント API の画像のアップロードが使えること（公式の説明では、画像以外のファイルだけが上位プラン限定）
