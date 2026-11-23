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

### アカウントを追加するとき

1. Search Console で「プロパティを追加 > ドメイン」に `pldl.or.jp` を入れる
2. 表示された TXT レコードを、さくらのドメインコントロールパネル（ゾーン編集）で `@` に**新しいレコードとして**追加して保存する
3. `dig +short TXT pldl.or.jp @8.8.8.8` で反映を確かめてから、Search Console で「確認」を押す

さくらの DNS は保存後すぐに反映された（2026-11-23 の作業では数十秒）。

## Google アナリティクス（GA4）

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

`next.config.js` の Content-Security-Policy で、Google の [CSP ガイド](https://developers.google.com/tag-platform/security/guides/csp) にあるドメインを許可している。

| ディレクティブ | 追加したドメイン |
|---|---|
| `script-src` | `https://*.googletagmanager.com` |
| `img-src` | `https://*.google-analytics.com` `https://*.googletagmanager.com` |
| `connect-src` | `https://*.google-analytics.com` `https://*.analytics.google.com` `https://*.googletagmanager.com` |

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

- analytics.google.com では、Chrome の拡張機能が iframe を差し込み、ブラウザ自動操作（Claude in Chrome）のクリック・入力・スクリーンショットがすべて失敗することがある（`Cannot access a chrome-extension:// URL of different extension`）。その拡張機能を止めるか、手で操作する
