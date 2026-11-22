# カスタムドメイン設定ガイド

本番環境のカスタムドメイン `pldl.or.jp` の設定についてまとめたドキュメント。

## 概要

| 項目 | 値 |
|---|---|
| 本番ドメイン | `pldl.or.jp` |
| ホスティング | Vercel |
| ドメインレジストラ / DNS | さくらドメイン |
| SSL | Vercel 自動発行（Let's Encrypt） |

## Vercel 側の設定

| ドメイン | 状態 | 備考 |
|---|---|---|
| `pldl.or.jp` | Production 環境に接続（プライマリドメイン） | Valid Configuration |
| `www.pldl.or.jp` | 308 Permanent Redirect → `pldl.or.jp` | Valid Configuration |
| `pldl-web.vercel.app` | 308 Permanent Redirect → `pldl.or.jp` | Valid Configuration |

## さくらドメイン DNS 設定

| エントリー名 | タイプ | データ | 備考 |
|---|---|---|---|
| `@` | A | `76.76.21.21` | Vercel |
| `www` | CNAME | `068522883830336f6.vercel-dns-017.com.` | Vercel |
| `app` | CNAME | `pldl.sakura.ne.jp.` | さくらサーバー（業務アプリ） |
| `ftp` | CNAME | `pldl.sakura.ne.jp.` | さくらサーバー |
| `mail` | CNAME | `pldl.sakura.ne.jp.` | さくらサーバー |
| `@` | MX | `1 SMTP.GOOGLE.COM.` | Google Workspace |
| `@` | TXT | `"v=spf1 a:www543b.sakura.ne.jp include:_spf.google.com ~all"` | SPF |
| `@` | TXT | `"google-site-verification=..."`（2件） | Google のサイト確認。SPF とは別のレコードにする |
| `google._domainkey` | TXT | *(DKIM 公開鍵)* | Google Workspace（管理コンソールで認証中） |
| `_dmarc` | TXT | `"v=DMARC1; p=none; rua=mailto:info@pldl.or.jp"` | DMARC（監視のみ） |
| *(NS)* | — | — | そのまま保持 |

> **注意:** SPF の TXT に別の文字列を並べない。1つの TXT レコード内の文字列は連結して解釈されるため、`"v=spf1 ... ~all" "google-site-verification=..."` のようにすると SPF が permerror になる（2026-11-22 に修正。[Issue #56](https://github.com/ManatoYamashita/pldl-web/issues/56)）。

> **DMARC:** 現在は `p=none`（監視のみ）。集計レポートは `info@pldl.or.jp` に届く。レポートで正規の送信元がすべて SPF / DKIM を通っていることを確かめてから、`p=quarantine` への引き上げを検討する。

> **注意:** `@` の A レコードは必ず `76.76.21.21`（Vercel）を指すこと。さくらサーバーの IP（`112.78.125.43` 等）を設定すると、コーポレートサイトではなく Laravel 業務アプリの 404 ページが表示される。

## リダイレクト設定

ベストプラクティスに従い、以下のリダイレクトを設定。

| リダイレクト元 | リダイレクト先 | 種別 |
|---|---|---|
| `www.pldl.or.jp` | `pldl.or.jp` | 308 Permanent Redirect |
| `pldl-web.vercel.app` | `pldl.or.jp` | 308 Permanent Redirect |
| HTTP | HTTPS | Vercel 自動対応（SSL 証明書も自動発行） |

## サブドメイン構成

| ドメイン | 用途 | ホスティング |
|---|---|---|
| `pldl.or.jp` | コーポレートサイト（Next.js） | Vercel |
| `app.pldl.or.jp` | 業務アプリ（Laravel） | さくらサーバー |

### 経緯

1. 2026-03-22: `pldl.or.jp` の DNS を Vercel に向けた
2. 2026-03-23: さくらサーバー上の業務アプリにアクセス不能になったため、`vercel.json` の rewrite 設定で応急復旧
3. 2026-03-24: 業務アプリを `app.pldl.or.jp` に移行完了。rewrite 設定（`vercel.json`）を削除

## 注意事項

- DNS 設定変更後、Vercel のエッジネットワークへの伝播に数分〜30分程度かかる場合がある
- デプロイメント固有 URL（例: `pldl-xxxx.vercel.app`）では設定反映前でもサイトの動作確認が可能
- SSL 証明書は Vercel が自動で発行・更新するため、手動管理は不要
- `app.pldl.or.jp` のDNS設定（CNAME）は `pldl.sakura.ne.jp.` を参照すること
- `ftp.pldl.or.jp` / `mail.pldl.or.jp` の CNAME は `pldl.sakura.ne.jp.` を直接指すこと（`@` を参照するとVercelのIPに解決されてしまう）

## 設定変更時のチェックリスト

- [ ] Vercel ダッシュボードで「Valid Configuration」を確認
- [ ] `pldl.or.jp` にアクセスしてサイトが正常表示されることを確認
- [ ] `www.pldl.or.jp` → `pldl.or.jp` へのリダイレクトを確認
- [ ] HTTPS が有効であることを確認
- [ ] メール関連の DNS レコード（MX / SPF / DKIM / DMARC）が影響を受けていないことを確認
- [ ] `dig TXT pldl.or.jp @ns1.dns.ne.jp` で、SPF が他の文字列と混ざらず単独のレコードになっていることを確認

---

## トラブルシューティング履歴

### 2026-04-05: Google Search Console 404 エラー

**症状:** トップページ（`/`）がGSCで404を返し、インデックス登録に失敗。

**原因:** `@` の A レコードがさくらサーバーの IP（`216.198.79.1`, `112.78.125.43`）を指しており、Vercel（`76.76.21.21`）に到達していなかった。さくらサーバー上の nginx は `pldl.or.jp` へのアクセスを Laravel 業務アプリ（`~/www/lab/public`）にルーティングしていたが、Laravel に `/` ルートが存在しないため 404 を返していた。

**対処:** A レコードを `76.76.21.21`（Vercel）に修正。`ftp` / `mail` の CNAME を `@` から `pldl.sakura.ne.jp.` に変更。

### 2026-11-22: SPF が permerror になっていた / DMARC が未設定だった

**症状:** お問い合わせメールの送信元を `info@pldl.or.jp` に切り替える際に DNS を確認したところ、SPF とサイト確認の文字列が1つの TXT レコードに入っていた。

**原因:** 1つの TXT レコード内の文字列は連結して解釈される（RFC 7208 3.3）。SPF が `... ~allgoogle-site-verification=...` となり、構文エラーになっていた。

**対処:** さくらのゾーン編集で、SPF とサイト確認を別々の TXT レコードに分けた。あわせて `_dmarc` に `p=none` の DMARC を追加した（[Issue #56](https://github.com/ManatoYamashita/pldl-web/issues/56)）。

---

設定完了日: 2026-03-22
最終更新日: 2026-11-22
