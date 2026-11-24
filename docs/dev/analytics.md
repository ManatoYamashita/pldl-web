# Google Search Console と Google アナリティクス

`pldl.or.jp` の検索流入とアクセスを計測するための設定をまとめる。

## Google Search Console

| 項目 | 値 |
|---|---|
| プロパティ | ドメインプロパティ `pldl.or.jp`（サブドメイン・http/https をすべて含む） |
| 所有権の確認方法 | DNS の TXT レコード（さくらドメインの `@`） |
| サイトマップ | `https://pldl.or.jp/sitemap.xml`（`app/sitemap.ts` が生成） |

### 所有権の確認用 TXT レコード

`@` に `google-site-verification=...` の TXT が 3 件ある（2026-11-23 時点）。それぞれ別の Google アカウントの所有権確認に使われている。

- **消さない。** 消すと、そのアカウントの所有権が外れる
- SPF の TXT とは別のレコードにする（同じレコードに並べると SPF が壊れる。[`domain-setup.md`](./domain-setup.md) 参照）
- どのアカウントのものか分からなくなったら、Search Console の「設定 > ユーザーと権限 > 所有権の確認」で確かめる

### 法人アカウントの権限

法人の Google アカウント `info@pldl.or.jp` を、Search Console と GA の両方に最上位の権限で入れてある（2026-11-23）。担当者が替わっても、このアカウントから管理を引き継げる。

| サービス | 権限 |
|---|---|
| Search Console（`pldl.or.jp`） | オーナー（確認済み） |
| GA（アカウント「Playful Learning Design Lab.」） | 管理者（アカウント単位なので、配下のプロパティにも及ぶ） |

Search Console では、追加した直後から「確認済み」のオーナーになった。`@` の TXT にあった確認用トークンのうち、それまで「未使用の所有権トークン」だった 1 件が `info@pldl.or.jp` のものだったため。

### アカウントを追加するとき

1. Search Console で「プロパティを追加 > ドメイン」に `pldl.or.jp` を入れる
2. 表示された TXT レコードを、さくらのドメインコントロールパネル（ゾーン編集）で `@` に**新しいレコードとして**追加して保存する
3. `dig +short TXT pldl.or.jp @8.8.8.8` で反映を確かめてから、Search Console で「確認」を押す

さくらの DNS は保存後すぐに反映された（2026-11-23 の作業では数十秒）。

## Google アナリティクス（GA4）

### 本番の設定（2026-11-23 作成）

| 項目 | 値 |
|---|---|
| アカウント | Playful Learning Design Lab.（ID `417272411`） |
| プロパティ | pldl.or.jp（ID `565580193`、日本時間・日本円） |
| ウェブストリーム | `https://pldl.or.jp`（ストリーム ID `16397386651`） |
| 測定 ID | `G-JN6WFKYJ1J`（Vercel Production の `NEXT_PUBLIC_GA_ID`） |
| データ共有設定 | すべてオフ |
| 拡張計測機能 | オン（クライアント側の遷移の計測に必要） |

Search Console と同じ Google アカウントで作成した。測定 ID はページの HTML に出る公開値なので、ここに書いてよい。

### Search Console との連携

GA の「管理 > サービス間のリンク設定 > Search Console のリンク」で、Search Console のドメインプロパティ `pldl.or.jp` とウェブストリーム `pldl.or.jp` をリンクした（2026-11-23）。

- 連携すると、GA のレポートの左メニューに「Search Console」（クエリ、Google オーガニック検索レポート）が自動で出る。ライブラリでの公開作業は要らなかった
- 連携した直後から、Search Console の過去のデータ（過去 28 日分など）も見られた
- リンクを作るには、Search Console プロパティの確認済み所有者で、かつ GA プロパティの編集権限が要る

### 仕組み

- `app/_components/GoogleAnalytics/index.tsx` が `next/script` で gtag.js を読み込む。外部ライブラリ（`@next/third-parties` など）は使わない
- `app/layout.tsx` は、環境変数 `NEXT_PUBLIC_GA_ID` があるときだけ読み込む
- App Router のクライアント側の遷移は、GA4 の拡張計測機能「ブラウザの履歴イベントに基づくページの変更」でページビューになる。この設定をオフにすると、トップ以外のページビューが記録されなくなる

### 環境変数

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX   # GA4 の測定 ID
```

- **Vercel の Production にだけ設定する。** Preview と開発環境では計測しない
- `NEXT_PUBLIC_` の値はビルド時に埋め込まれる。設定・変更したら再デプロイする（手順: [`vercel-cli.md`](./vercel-cli.md)）

### CSP

`csp.js`（`next.config.js` と `proxy.ts` が共有する）の Content-Security-Policy で、Google の [CSP ガイド](https://developers.google.com/tag-platform/security/guides/csp) にあるドメインを許可している。

| ディレクティブ | 追加したドメイン |
|---|---|
| `script-src` | `https://*.googletagmanager.com` |
| `img-src` | `https://*.google-analytics.com` `https://*.googletagmanager.com` |
| `connect-src` | `https://*.google-analytics.com` `https://*.analytics.google.com` `https://*.googletagmanager.com` |

`/activities` 配下は `script-src` が nonce と `'strict-dynamic'` になり、`https://*.googletagmanager.com` の指定は無視される。gtag.js は `next/script` が（nonce の付いた Next.js のランタイムから）挿入するので、この場合も読み込まれる。

許可しないと、タグは読み込まれても計測データの送信がブロックされる。CSP を変えたら、本番でブラウザの開発者ツールを開き、`collect` へのリクエストが成功しているか確かめる。

### プライバシーポリシー

GA の利用規約に従い、`/privacy-policy` の第 8 条で Google アナリティクスの利用と、オプトアウトの方法を示している。

### 動作確認

```bash
# ローカルで、タグと CSP が出ているか確かめる
NEXT_PUBLIC_GA_ID=G-TEST123456 pnpm build
NEXT_PUBLIC_GA_ID=G-TEST123456 pnpm start -p 3017
curl -s http://localhost:3017/ | grep -o 'gtag/js?id=[A-Z0-9-]*'
curl -sI http://localhost:3017/ | grep -i content-security
```

本番では、GA の「レポート > リアルタイム」に自分のアクセスが出ることを確かめる。

## 作業時の注意

- analytics.google.com では、入力欄にフォーカスすると、自動入力系の Chrome 拡張機能が iframe を差し込むことがある。そうなると、ブラウザ自動操作（Claude in Chrome）のクリック・入力・スクリーンショットがすべて `Cannot access a chrome-extension:// URL of different extension` で失敗する。回避するには、入力欄をクリックせずに `form_input` で値を入れ、チェックボックスやプルダウンを先に操作する。一度出たら、ページを読み込み直すと消える
- 本番で計測を確かめるときは、ブラウザで `https://pldl.or.jp/` を開き、`g/collect` へのリクエストが 204 で返るかを見る。ページ内の遷移でも、`dl` が遷移先の URL の page_view が送られる（2026-11-23 に `/about` で確認）
