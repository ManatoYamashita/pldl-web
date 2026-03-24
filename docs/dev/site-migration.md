# 旧サイト（ldl.cocotte.jp）→ 新サイト（pldl.or.jp）移行ガイド

## 概要

旧サイト `https://ldl.cocotte.jp/`（WordPress）から新サイト `https://pldl.or.jp`（Next.js / Vercel）へのドメイン移行に伴うSEO対応手順をまとめたドキュメント。

### 現状

| 項目 | 旧サイト | 新サイト |
|------|---------|---------|
| URL | `https://ldl.cocotte.jp/` | `https://pldl.or.jp` |
| CMS | WordPress + All in One SEO v4.4.4 | Next.js 16 + microCMS |
| ホスティング | さくらサーバー（推定） | Vercel |
| 状態 | **稼働中（リダイレクトなし）** | 公開済み |

### 対応が必要な理由

- 旧サイトと新サイトが同時に稼働しており、Googleが「重複コンテンツ」と判断するリスクがある
- 旧サイトへの被リンク評価が新サイトに引き継がれていない
- 旧サイトのcanonicalが自己参照（`ldl.cocotte.jp`）のままで、新サイトへの誘導がゼロ

---

## 移行手順

### Step 1: 旧サイトに301リダイレクトを設定（最重要）

旧サイトのサーバーで、全URLを新サイトに**301（恒久的）リダイレクト**する設定を行う。

#### 方法A: .htaccess による一括リダイレクト（推奨）

旧サイトのドキュメントルートにある `.htaccess` ファイルに以下を追記する。
既存の WordPress 用 RewriteRule より**上**に配置すること。

```apache
# === 新サイトへの301リダイレクト（2026年追加） ===
RewriteEngine On
RewriteCond %{HTTP_HOST} ^(www\.)?ldl\.cocotte\.jp$ [NC]
RewriteRule ^(.*)$ https://pldl.or.jp/$1 [R=301,L]
```

#### 方法B: WordPress プラグインによるリダイレクト

サーバーの `.htaccess` を直接編集できない場合は、WordPress プラグインを使用する。

1. WordPress 管理画面にログイン（`https://ldl.cocotte.jp/wordpress/wp-admin/`）
2. プラグイン「Redirection」をインストール・有効化
3. 設定画面で以下を設定:
   - **ソースURL**: `/(.*)`（正規表現チェック ON）
   - **ターゲットURL**: `https://pldl.or.jp/$1`
   - **HTTPステータス**: 301（恒久的リダイレクト）

#### 確認方法

```bash
# ターミナルで301リダイレクトの確認
curl -I https://ldl.cocotte.jp/
# → HTTP/1.1 301 Moved Permanently
# → Location: https://pldl.or.jp/

curl -I https://ldl.cocotte.jp/blog/some-post/
# → HTTP/1.1 301 Moved Permanently
# → Location: https://pldl.or.jp/blog/some-post/
```

### Step 2: 主要ページのURLマッピング（任意・推奨）

旧サイトと新サイトでURL構造が異なるページがある場合は、個別のリダイレクトルールを追加する。

Step 1 の一括リダイレクトで対応できない場合のみ、以下のように個別ルールを `.htaccess` の一括ルール**より上**に追記する。

```apache
# 個別ページのリダイレクト（一括ルールより上に配置）
RewriteRule ^blog/(.*)$ https://pldl.or.jp/activities/$1 [R=301,L]
RewriteRule ^about/?$ https://pldl.or.jp/about [R=301,L]
RewriteRule ^contact/?$ https://pldl.or.jp/contact [R=301,L]
```

### Step 3: Google Search Console でアドレス変更を申請

1. [Google Search Console](https://search.google.com/search-console/) にアクセス
2. 旧ドメイン `ldl.cocotte.jp` と新ドメイン `pldl.or.jp` の**両方**をプロパティとして登録（未登録の場合）
   - 「ドメイン」プロパティで登録するのが推奨（DNS TXTレコードで認証）
3. 旧ドメインのプロパティを選択
4. 「設定」→「アドレス変更」を選択
5. 新しいサイトとして `pldl.or.jp` を指定
6. Googleの検証項目（301リダイレクト確認等）をパスして申請完了

### Step 4: 旧サイトの robots.txt を更新（任意）

301リダイレクトが正常に動作していれば不要だが、念のため旧サイトの `robots.txt` を以下に更新してもよい。

```
User-agent: *
Disallow: /

# 新サイトへ移行しました
# https://pldl.or.jp
```

---

## 移行後の確認・監視

### 直後の確認（1週間以内）

- [ ] 旧サイトの全ページが301でリダイレクトされることを確認（`curl -I` でテスト）
- [ ] 新サイトが正常に表示されることを確認
- [ ] Google Search Console でエラーが発生していないことを確認

### 継続的な監視（1〜3ヶ月）

- [ ] Search Console の「カバレッジ」レポートで、旧URLが「リダイレクト」として処理されていることを確認
- [ ] `site:ldl.cocotte.jp` でGoogle検索し、インデックスが徐々に減少していることを確認
- [ ] `site:pldl.or.jp` でGoogle検索し、インデックスが増加していることを確認
- [ ] 主要キーワードでの検索順位を監視（「放課後こどもラボ」「PLDL」「みどり市 NPO」等）

### 注意事項

- **旧サイトの301リダイレクトは最低1年間は維持すること**。すぐにサーバーを停止するとSEO評価の引き継ぎが不完全になる
- 旧サイトのWordPressは管理画面にアクセスできる状態を維持しておくことが望ましい（緊急時の対応のため）
- 被リンクが多い特定ページがある場合は、そのページの個別リダイレクトを優先的に設定する

---

## 参考情報

- [Google公式: サイトの移転](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [Google Search Console ヘルプ: アドレス変更ツール](https://support.google.com/webmasters/answer/9370220)

---

最終更新日: 2026-03-24
