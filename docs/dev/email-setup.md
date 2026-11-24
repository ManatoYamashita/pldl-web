# お問い合わせフォーム メール送信設定ガイド

お問い合わせフォームは Nodemailer（SMTP）でメールを送信します。
本ドキュメントでは、`.env` に設定する SMTP 環境変数の取得・設定手順をまとめます。

---

## 本番の構成

本番（Vercel `pldl` の Production）は、Google Workspace の `info@pldl.or.jp` アカウントから直接 SMTP 送信している。

| 変数名 | 値 |
|---|---|
| `SMTP_HOST` / `SMTP_PORT` | `smtp.gmail.com` / `587` |
| `SMTP_USER` | `info@pldl.or.jp` |
| `SMTP_PASS` | `info@pldl.or.jp` のアプリパスワード（Vercel で Sensitive） |
| `SMTP_FROM` | `info@pldl.or.jp` |
| `CONTACT_TO` | Vercel で管理。現在の値は下の手順で確認する |

- `SMTP_USER` と `SMTP_FROM` を同じ Workspace アカウントにしているので、From が書き換えられない
- DKIM は Google 管理コンソールの「アプリ > Google Workspace > Gmail > メールの認証」で有効になっている
- SPF / DKIM / DMARC の DNS レコードは [domain-setup.md](./domain-setup.md#さくらドメイン-dns-設定) を参照
- 認証の結果（SPF / DKIM / DMARC が PASS か）は、**外部の受信箱**で「メッセージのソースを表示」して確かめる。送信者自身（`info@pldl.or.jp`）の受信箱にあるメールには DKIM 署名や認証結果が付かないため、確認に使えない

### 現在の値を確認する

```bash
vercel link --project pldl --team yamashitamanato --yes
vercel env pull /tmp/pldl-prod.env --environment=production --yes
grep -E '^(SMTP_HOST|SMTP_PORT|SMTP_USER|SMTP_FROM|CONTACT_TO)=' /tmp/pldl-prod.env
rm /tmp/pldl-prod.env
```

- Sensitive の変数（`SMTP_PASS`）は pull しても値が空になる。正しいかどうかはテスト送信で確かめる
- pull したファイルには秘密情報が入るので、確認したらすぐに消す

### 値を変更する

環境変数を変えても、今動いているデプロイには反映されない。変更したら再デプロイする。

```bash
# 秘密情報でない変数
vercel env rm SMTP_FROM production --yes
printf '%s' 'info@pldl.or.jp' | vercel env add SMTP_FROM production

# 再デプロイ（最新の本番デプロイを作り直す）
vercel ls pldl --prod --scope yamashitamanato
vercel redeploy <最新の本番デプロイの URL> --target=production --scope yamashitamanato
```

- `--scope yamashitamanato` を付けないと「Deployment belongs to a different team」で失敗することがある
- 再デプロイ後、本番のフォームから1通送り、From と宛先を受信箱で確かめる（実在の宛先に届く）

### 認証情報（アプリパスワード）を切り替える

1. 新しいアプリパスワードを発行する（`https://myaccount.google.com/apppasswords`。複数アカウントでログインしている場合は `u/<番号>` を付ける）
2. `SMTP_PASS` を新しい値に置き換える。**値はコマンドの引数や AI との会話に書かない。** 引数を付けずに `vercel env add SMTP_PASS production` を実行し、入力欄に貼り付けるか、Vercel のダッシュボードで編集する
3. `SMTP_USER` も変わる場合は、`SMTP_PASS` と同時に切り替える（食い違ったままデプロイが走るとフォームが送信できなくなる）
4. 再デプロイしてテスト送信する
5. 送信できたら古いアプリパスワードを失効させる

アプリパスワードを会話やコマンドに書いてしまったら、漏れたものとして扱い、失効させて作り直す。

---

## 環境変数一覧

| 変数名 | 説明 | 例 |
|---|---|---|
| `SMTP_HOST` | SMTPサーバーのホスト名 | `smtp.gmail.com` |
| `SMTP_PORT` | SMTPポート番号 | `587`（STARTTLS）または `465`（SSL） |
| `SMTP_USER` | SMTP認証ユーザー（メールアドレス） | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP認証パスワードまたはアプリパスワード | `xxxx xxxx xxxx xxxx` |
| `SMTP_FROM` | 送信元として表示されるアドレス | `noreply@pldl.or.jp` |
| `CONTACT_TO` | 送信先アドレス（カンマ区切りで複数指定可） | `a@example.com,b@example.com` |

---

## 設定手順

### 1. `.env` ファイルを編集

プロジェクトルートの `.env` に以下を追加します（既に HubSpot の変数がある場合は削除してください）。

```bash
# --- メール送信設定 ---
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM=noreply@pldl.or.jp
CONTACT_TO=a@example.com,b@example.com

# --- 以下は不要になったため削除 ---
# HUBSPOT_PORTAL_ID=（削除）
# HUBSPOT_FORM_ID=（削除）
```

### 2. SMTPサービスごとの設定例

利用するメールサービスに合わせて `SMTP_HOST` / `SMTP_PORT` / `SMTP_PASS` を設定してください。

---

#### Gmail

Google アカウントで SMTP 送信する場合。

| 変数 | 値 |
|---|---|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | 自分の Gmail アドレス |
| `SMTP_PASS` | **アプリパスワード**（通常のパスワードではない） |

**アプリパスワードの取得手順:**

1. [Google アカウント](https://myaccount.google.com/) にログイン
2. **セキュリティ** → **2段階認証プロセス** を有効化（未設定の場合）
3. 2段階認証の設定ページ最下部の **アプリパスワード** をクリック
4. アプリ名（例: `PLDL Contact Form`）を入力して **作成**
5. 表示された16文字のパスワードを `SMTP_PASS` に設定

> 注意: アプリパスワードは一度しか表示されません。メモを取ってから閉じてください。

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-name@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
```

---

#### さくらインターネット

さくらのメールボックスまたはレンタルサーバーを利用する場合。

| 変数 | 値 |
|---|---|
| `SMTP_HOST` | 初期ドメインの SMTP サーバー（例: `xxx.sakura.ne.jp`） |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | メールアドレス全体（例: `info@pldl.or.jp`） |
| `SMTP_PASS` | メールパスワード |

```bash
SMTP_HOST=xxx.sakura.ne.jp
SMTP_PORT=587
SMTP_USER=info@pldl.or.jp
SMTP_PASS=your-mail-password
```

> さくらのコントロールパネル → **メール** → **メールアドレス一覧** でパスワードの再設定が可能です。

---

#### Xserver

Xserver のメール機能を利用する場合。

| 変数 | 値 |
|---|---|
| `SMTP_HOST` | サーバーパネルに記載の SMTP サーバー名（例: `svXXXX.xserver.jp`） |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | メールアドレス全体 |
| `SMTP_PASS` | メールアカウントのパスワード |

```bash
SMTP_HOST=svXXXX.xserver.jp
SMTP_PORT=587
SMTP_USER=info@pldl.or.jp
SMTP_PASS=your-mail-password
```

---

#### Amazon SES

大量送信や本番環境向け。

| 変数 | 値 |
|---|---|
| `SMTP_HOST` | `email-smtp.ap-northeast-1.amazonaws.com`（東京リージョン） |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | SES SMTP認証情報のユーザー名 |
| `SMTP_PASS` | SES SMTP認証情報のパスワード |

**セットアップ手順:**

1. AWS コンソール → **Amazon SES** → **SMTP settings**
2. **Create SMTP credentials** でIAMユーザーを作成
3. 表示される SMTP ユーザー名・パスワードを設定
4. **Verified identities** で送信元ドメインまたはアドレスを認証

```bash
SMTP_HOST=email-smtp.ap-northeast-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=AKIAXXXXXXXXXXXXXXXX
SMTP_PASS=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

> 注意: SES はデフォルトでサンドボックスモードです。本番利用にはサンドボックス解除申請が必要です。

---

## 動作確認

### 開発環境での確認手順

1. `.env` に SMTP 情報を設定
2. 開発サーバーを起動

   ```bash
   pnpm dev
   ```

3. ブラウザで `http://localhost:3001/contact` にアクセス
4. フォームに入力して送信
5. `CONTACT_TO` に指定したアドレスでメールが届くことを確認

### チェック項目

- [ ] 全必須フィールドの入力で正常送信できる
- [ ] 属性ドロップダウンの全選択肢が正しく動作する
- [ ] 「その他」選択時に詳細入力欄が表示される
- [ ] ファイル添付なしで送信できる
- [ ] PDF/画像ファイルを添付して送信できる（メールに添付されている）
- [ ] 4MB超のファイルがエラーになる（送信前にフォームで止まる）
- [ ] 文字数の上限を超える入力ができない（姓・名 50、属性の詳細 100、メールアドレス 254、メッセージ 5000）
- [ ] 不正なファイル形式（.exe等）がエラーになる
- [ ] 拡張子だけ変えたファイル（例: .exe を .png に改名）がエラーになる
- [ ] Turnstile のキーを設定した環境では、ウィジェットが表示され、送信できる（[contact-spam-protection.md](./contact-spam-protection.md)）
- [ ] `CONTACT_TO` に指定したアドレス全てにメールが届く
- [ ] From が `SMTP_FROM` のアドレスになっている
- [ ] メール本文に全フィールドの内容が正しく記載されている

---

## トラブルシューティング

### 「送信に失敗しました」エラーが出る

**原因の切り分け:**

1. 開発サーバーのコンソールログを確認（`メール送信エラー:` のメッセージ）
2. よくある原因:
   - `SMTP_HOST` / `SMTP_PORT` の設定ミス
   - `SMTP_PASS` が間違っている（Gmail の場合、通常のパスワードではなくアプリパスワードが必要）
   - ファイアウォールやネットワーク制限でポート 587/465 がブロックされている

### Gmail で「安全性の低いアプリ」エラー

- Google は通常のパスワードによる SMTP 認証を廃止しています
- 必ず **2段階認証 + アプリパスワード** を使用してください

### From が `SMTP_FROM` ではなく Gmail のアドレスになる

- Gmail の SMTP は、`SMTP_USER` のアカウントで「他のアドレスから送信」に登録されていないアドレスを From に指定すると、`SMTP_USER` のアドレスに書き換える
- `SMTP_FROM` のアドレスが Google Workspace のアカウントなら、そのアカウント自身を `SMTP_USER` にする（本番はこの構成）
- そうでない場合は、`SMTP_USER` のアカウントで `SMTP_FROM` を送信エイリアスに登録して確認を済ませる

### メールが迷惑メールフォルダに入る

- `SMTP_FROM` のドメインに SPF / DKIM / DMARC レコードを設定する
- 送信元と認証アカウントのドメインを一致させる
- 本番環境では Amazon SES 等の専用サービスの利用を推奨

### 添付ファイル付きメールが届かない

- 一部の SMTP サーバーには添付ファイルサイズの制限がある（Gmail: 25MB、一般的なサーバー: 10-20MB）
- 本アプリケーションでは 4MB に制限しているため通常は問題ない（Vercel Functions のリクエストボディ上限 4.5MB に合わせた値。上限は `app/_constants/contact.ts`）

---

## 本番環境へのデプロイ

Vercel 等のホスティングサービスにデプロイする場合、環境変数はホスティング側の設定画面から追加します。

### Vercel の場合

1. Vercel ダッシュボード → プロジェクト → **Settings** → **Environment Variables**
2. 上記6つの環境変数を全て追加（`SMTP_PASS` は Sensitive にする）
3. **Production** / **Preview** / **Development** の適用範囲を選択
4. 再デプロイ

CLI での確認・変更手順は、上の「[本番の構成](#本番の構成)」を参照。

> `.env` ファイルはリポジトリにコミットしないでください。`.gitignore` に含まれていることを確認してください。
