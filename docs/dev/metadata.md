# メタデータ（OGP と X のカード）

ページの `<title>`・description・canonical と、SNS でシェアしたときのカード（OGP / X）の出し方をまとめる。

## 仕組み

- 各ページのメタデータは `app/_libs/metadata.ts` の `buildPageMetadata` で作る。`title`・`description`・`path` を渡すと、`<title>`・description・canonical・OGP をまとめて返す。`og:url` は canonical と同じになる
- OGP の共通の値は `SHARED_OPEN_GRAPH`（同じファイル）にまとめている

| 項目 | 値 |
|---|---|
| `og:type` | `website`（記事ページは `article`） |
| `og:locale` | `ja_JP` |
| `og:site_name` | `SITE_NAME`（`app/_constants/index.ts`） |
| `og:image` | `/ogp.webp` と `/ogp.jpg`（1200x630） |

- X のカードは、レイアウト（`app/layout.tsx`）で `card: 'summary_large_image'` だけを指定している。`twitter:title`・`twitter:description`・`twitter:image` は、Next.js が各ページの OGP から補う

## ページごとの画像

| ページ | OGP / X の画像 |
|---|---|
| トップ | microCMS の Meta の `ogImage`（`toOgImageUrl` で JPEG 1200x630 にする）。未設定なら `/ogp.webp` と `/ogp.jpg` |
| 活動レポートの記事 | サムネイル（`toOgImageUrl` で JPEG 1200x630 にする）。サムネイルが無ければ `/ogp.webp` と `/ogp.jpg` |
| そのほかのページ | `/ogp.webp` と `/ogp.jpg` |

microCMS の Meta はトップの title や canonical も持つ、トップ用の設定として扱う。Meta の `ogImage` をほかのページには使わない。

## 守ること

- **ページで `openGraph` を書くときは、`buildPageMetadata` か `SHARED_OPEN_GRAPH` を通す。** Next.js のメタデータはセグメント間で浅くマージされ、ページが `openGraph` を書くと、レイアウトの `openGraph` は丸ごと消える（同梱ドキュメント `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md` の「Merging」）。直接書くと `og:image` や `og:site_name` が出なくなる
- **レイアウトの `twitter` に `title`・`description`・`images` を足さない。** Next.js は `twitter` に無い項目だけを `openGraph` から補う（`node_modules/next/dist/lib/metadata/metadata-resolution-primitives.js` の `postProcessMetadata`）。レイアウトで指定すると、全ページの X のカードがその値に固定される
- **ファイルベースの `opengraph-image` / `twitter-image` は置かない。** ファイルベースは設定より優先されるので、記事ページのサムネイルまで上書きされる
- ページだけ値を変えたいときは、`buildPageMetadata` の `openGraph` で上書きする（例: 記事ページの `type: 'article'` とサムネイル、`/recruit` の短い説明）

## 確認のしかた

`pnpm build` と `pnpm start` のあと、各ページの HTML で `og:*`・`twitter:*`・`<link rel="canonical">` を確かめる。デプロイ後は、Facebook のシェアデバッガーなどで実際のカードを見る。
