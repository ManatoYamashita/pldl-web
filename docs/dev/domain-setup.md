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

| エントリー名 | タイプ | データ |
|---|---|---|
| `@` | A | `216.198.79.1`（Vercel） |
| `www` | CNAME | `068522883830336f6.vercel-dns-017.com.` |

既存の MX、TXT（SPF / DKIM）、mail、ftp などのレコードはそのまま保持している。

## リダイレクト設定

ベストプラクティスに従い、以下のリダイレクトを設定。

| リダイレクト元 | リダイレクト先 | 種別 |
|---|---|---|
| `www.pldl.or.jp` | `pldl.or.jp` | 308 Permanent Redirect |
| `pldl-web.vercel.app` | `pldl.or.jp` | 308 Permanent Redirect |
| HTTP | HTTPS | Vercel 自動対応（SSL 証明書も自動発行） |

## 注意事項

- DNS 設定変更後、Vercel のエッジネットワークへの伝播に数分〜30分程度かかる場合がある
- デプロイメント固有 URL（例: `pldl-xxxx.vercel.app`）では設定反映前でもサイトの動作確認が可能
- SSL 証明書は Vercel が自動で発行・更新するため、手動管理は不要

## 設定変更時のチェックリスト

- [ ] Vercel ダッシュボードで「Valid Configuration」を確認
- [ ] `pldl.or.jp` にアクセスしてサイトが正常表示されることを確認
- [ ] `www.pldl.or.jp` → `pldl.or.jp` へのリダイレクトを確認
- [ ] HTTPS が有効であることを確認
- [ ] メール関連の DNS レコード（MX / SPF / DKIM）が影響を受けていないことを確認

---

設定完了日: 2026-03-22
