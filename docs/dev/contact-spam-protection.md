# お問い合わせフォームのスパム対策

お問い合わせフォーム（`/contact` → `/api/submit-contact`）を、ボットの大量送信から守る仕組みと設定手順。

| 対策 | 仕組み | 設定場所 |
|---|---|---|
| ボット対策 | Cloudflare Turnstile。フォームにウィジェットを置き、API でトークンを検証する | コード + Cloudflare + Vercel の環境変数 |
| レート制限 | 同じ IP からの送信回数を Vercel の WAF で制限する | Vercel の管理画面（コードは無い） |

入力内容の検証（文字数・添付ファイルの形式など）は [email-setup.md](./email-setup.md) と CLAUDE.md の「お問い合わせフォーム」を参照。

---

## Cloudflare Turnstile

### 仕組み

| 場所 | ファイル | 内容 |
|---|---|---|
| フォーム | `app/_components/ContactForm/Turnstile.tsx` | 公式スクリプト（`https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit`）を `next/script` で読み込み、ウィジェットを描画する。トークンは `cf-turnstile-response` という hidden input に入り、FormData で送られる |
| API | `app/api/submit-contact/route.ts`、`app/_libs/turnstile.ts` | Cloudflare の siteverify（`https://challenges.cloudflare.com/turnstile/v0/siteverify`）でトークンを検証する。入力の検証の後、添付ファイルを読む前に行う |
| CSP | `csp.js` | `script-src` と `frame-src` に `https://challenges.cloudflare.com` を許可している |

- 暗黙のレンダリング（`class="cf-turnstile"`）は、スクリプトを読み込んだときに一度だけ要素を探す。クライアント側の遷移でフォームに戻ると描画されないため、explicit で描画し、離れるときに `turnstile.remove()` で片付ける
- トークンは 1 回しか検証できない。送信の結果が返るたびに `turnstile.reset()` で取り直す
- npm のパッケージは使っていない

### API の挙動

| 状況 | 応答 |
|---|---|
| `TURNSTILE_SECRET_KEY` が未設定 | 検証を飛ばす（ローカル開発、キー登録前） |
| トークンが無い | 400「ボット対策の確認が終わっていません…」 |
| Cloudflare が拒否した（`success: false`） | 400「ボット対策の確認に失敗しました…」 |
| Cloudflare に届かない・5xx・10 秒でタイムアウト | 503「ボット対策の確認ができませんでした…」。確認できないときはメールを送らない |

Cloudflare に障害があると、その間はフォームから送れなくなる。止めたいときは Vercel の `TURNSTILE_SECRET_KEY` を消して再デプロイすれば、検証を飛ばす状態に戻る。

### 環境変数

| 変数名 | 例 | 読む場所 |
|---|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `0x4AAAAAAA…` | フォーム（ビルド時に埋め込まれる）。未設定ならウィジェットを出さない |
| `TURNSTILE_SECRET_KEY` | `0x4AAAAAAA…` | API。未設定なら検証を飛ばす |

2 つはそろえて設定する。サイトキーだけだとウィジェットは出るが検証されず、シークレットだけだとトークンが届かず全件 400 になる。

### 初期設定（管理者の作業）

1. Cloudflare のダッシュボードで「Turnstile」を開き、サイトを追加する
   - ドメイン: `pldl.or.jp`（Preview でも動かす場合は、その URL のホスト名も足す）
   - ウィジェットのモード: マネージド（多くの人は操作不要で、怪しいときだけチェックを求める）
2. 表示されたサイトキーとシークレットキーを、Vercel の `pldl` プロジェクトの環境変数に登録する
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: Production
   - `TURNSTILE_SECRET_KEY`: Production（Sensitive にする）
3. 再デプロイする（サイトキーはビルド時に埋め込まれるため、環境変数の追加だけでは反映されない）
4. 本番の `/contact` でウィジェットが表示され、送信できることを確かめる

Preview とローカルでは設定しない（ウィジェットは出ず、検証も飛ばす）。Preview で試したいときは、Cloudflare が公開しているテスト用のキー（常に成功・常に失敗など）を Preview の環境変数に入れる。テスト用のキーの値は Cloudflare の公式ドキュメント（Turnstile の Testing）で確認する。

### プライバシーポリシー

Turnstile はボットかどうかを判定するために、ブラウザの情報を Cloudflare に送る。プライバシーポリシー（`app/privacy-policy/page.tsx`）に Cloudflare Turnstile の利用を書き足すかどうかは、法人で判断する。

---

## Vercel WAF のレート制限

コードは無く、Vercel の管理画面でルールを作る。

### 設定するルール（目安）

| 項目 | 値 |
|---|---|
| 条件 | リクエストのパスが `/api/submit-contact` と一致し、メソッドが `POST` |
| 動作 | レート制限（Rate Limit） |
| 数える単位 | IP アドレス |
| 上限 | 60 秒に 5 回（固定ウィンドウ） |
| 超えたとき | 拒否（429） |

上限は、正しく使う人が送り直しても届かない程度にしている。フォームは 429 を受けると「送信に失敗しました。もう一度お試しください。」と表示する。

### 手順（管理者の作業）

1. Vercel の `pldl` プロジェクトで「Firewall」を開き、カスタムルールを追加する
2. 上の表のとおりに条件・動作・上限を入れて保存し、公開する
3. 本番で `/api/submit-contact` に短い間に何度も POST し、上限を超えると 429 が返ることを確かめる（中身は空でよい。入力の検証で 400 になる前に 429 になる）

利用中のプランでレート制限のルールが使えるかと、設定画面の項目名は、Vercel の公式ドキュメント（Vercel WAF の Rate Limiting）で確かめる。
