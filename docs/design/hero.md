# ヒーローとヘッダー

**PLDLデザインシステム - ヒーロー**

[← デザインシステムトップに戻る](../design.md)

---

## 目次

- [1. ヒーローの種類](#1-ヒーローの種類)
- [2. withBlob ヒーローの構成](#2-withblob-ヒーローの構成)
- [3. 写真の切り抜き位置とヘッダーの重なり](#3-写真の切り抜き位置とヘッダーの重なり)
- [4. ヘッダーのロゴ](#4-ヘッダーのロゴ)
- [5. ヘッダーのナビゲーション（現在地の表示）](#5-ヘッダーのナビゲーション現在地の表示)
- [6. 表示の確認方法](#6-表示の確認方法)
- [7. 変更履歴](#7-変更履歴)

---

## 1. ヒーローの種類

実装は `app/_components/Hero/`（`index.tsx` と `index.module.css`）。props の組み合わせで 4 種類に分かれる。

| 種類 | props | 使っているページ |
|---|---|---|
| showcase | `variant="showcase"` | トップ（`/`） |
| withBlob | `imageSrc`（`banner` なし） | about、recruit、activities、support、support の 4 つの子ページ（material、volunteer、donation、skill）の計 8 ページ |
| banner | `imageSrc` + `banner` | contact、privacy-policy、not-found |
| グラデーション | `imageSrc` なし | 現在は未使用 |

`compact` は、グラデーションのヒーローの高さを縮めるための指定。withBlob では効かない（[2](#2-withblob-ヒーローの構成) を参照）。

---

## 2. withBlob ヒーローの構成

**原則: タイトルを写真に重ねない。** 上段に写真（Blob）、下段にタイトルを置く 2 段のグリッドにする。タイトルは常に背景色の上に乗るので、`text-shadow` で読みやすさを補う必要はない。

```
┌──────────────────────────────────┐
│ (ヘッダーのピル)                  │  ← 写真の上に浮く
│ ╭──────────────────────────────╮ │
│ │ 写真（Blob）                  │ │  ← 1 行目: minmax(40svh, 1fr)
│ ╰──────────────────────────────╯ │
│ タイトル                          │  ← 2 行目: auto
│ ─ サブタイトル ─                  │
└──────────────────────────────────┘
          高さ 100svh（min-height）
```

| 項目 | 指定 | 理由 |
|---|---|---|
| 高さ | `min-height: 100svh`（`compact` でも同じ） | 1 画面に写真とタイトルだけを収める。`svh` はブラウザのバーが出ている小さいビューポートでも収まる。`min-height` なので文字を拡大してもタイトルが切れない |
| 行 | `grid-template-rows: minmax(40svh, 1fr) auto` | タイトルが何行になっても写真の行が縮むだけで、1 画面に収まる。写真は最低 40svh を確保 |
| 列 | `grid-template-columns: minmax(0, 1fr)` | 画面より広い Blob が列幅を押し広げないようにする |
| セレクタ | `.container.withBlob`（2 クラス） | `.container` のメディアクエリ内の `padding` / `min-height` に、記述順で負けないようにする |
| タイトルの位置 | `.content` を `width: min(100%, 1200px)` で中央寄せし、左右 32px（768px 以下は 24px、480px 以下は 16px） | タイトルの左端を、ヘッダーのロゴの左端にそろえる |
| タイトルの折り返し | `text-wrap: balance` | 2 行になったときの行の長さをそろえる |

### Blob の幅

Blob は画面より広く取り、左右の曲線を画面の外に逃がす。写真の下側だけが、有機的な曲線で切れる。

| 画面幅 | Blob の幅 |
|---|---|
| 769px 以上 | 140vw |
| 768px 以下 | 160vw |
| 480px 以下 | 180vw |

Blob の上端は `margin-top: calc(-1 * var(--spacing-8))` でヘッダーの裏に逃がす。

### reduced-motion

`prefers-reduced-motion: reduce` では、Blob の変形アニメーション（`blobMorph`）だけを止め、形は通常時の初期形状のままにする。`border-radius: 50%` にすると、横長の Blob はきつい楕円に切れてしまう。

---

## 3. 写真の切り抜き位置とヘッダーの重なり

### 写真の幅は画面幅に合わせる

`.blobImage` は Blob（140〜180vw）いっぱいではなく、画面幅（`width: 100vw`）で中央に置く。Blob いっぱいに敷くと、画面外の左右まで写真が拡大され、そのぶん上下（顔）が大きく切れる。`<Image>` の `sizes` も `100vw` にそろえる。

### ヘッダーの重なり分だけ写真を縦に伸ばす

ヘッダーのピルは写真の上に浮いていて、写真の上端を覆う。`object-fit: cover` の切り抜きの中心をそのままにすると、写真の上側がヘッダーの裏に隠れる。そこで写真を、ヘッダーが重なる高さ（`--hero-header-overlap`）だけ縦に伸ばす。

```css
.blobImage {
  height: calc(100% + var(--hero-header-overlap));
}
```

切り抜きの中心が「ヘッダーより下に見えている範囲」の中央に来る。はみ出すのは写真の下端だけで、Blob の `overflow: hidden` で切れる。写真を上へずらす方法と違い、どの縦横比でも写真の上に隙間はできない。

### `--hero-header-overlap` の値

ヘッダーの下端（ヘッダーの `padding-top` ＋ ピルの高さ）に、Blob の上のはみ出し（`--spacing-8` = 32px）を足した値。

| 画面幅 | ヘッダーの下端 | `--hero-header-overlap` |
|---|---|---|
| 1081px 以上 | 120px | `calc(120px + var(--spacing-8))` |
| 1080px 以下 | 104px | `calc(104px + var(--spacing-8))` |
| 900px 以下 | 82px | `calc(82px + var(--spacing-8))` |

**`app/_components/Header/index.module.css` の `padding`、ピルの `padding`、ロゴの高さを変えたら、この値も合わせて直すこと。**

### 写真の選び方

浮いたヘッダーの裏に入る写真の上端と、横長の帯に切り抜かれる上下は見えない。主な被写体（顔）は、写真の中央から下 2/3 に収まっているものを選ぶ。詳しくは [assets-images.md の 1.4](./assets-images.md#14-ヒーロー用の写真の選び方)。

---

## 4. ヘッダーのロゴ

実装は `app/_components/Header/HeaderLogo.tsx` と `index.module.css`。ロゴは動画（`logo-animation.webm` / `.mp4`）で、モーションを減らす設定のときと、再生に失敗したときは静止画（`logo.webp` / `.png`）に切り替わる。

### ヘッダーの動きと reduced-motion

ヘッダーのピルが上から滑り込む入場アニメーション（`slideDown`）、ロゴのホバー時の拡大、ナビのホバー時に下線が伸びる動きは、`@media (prefers-reduced-motion: no-preference)` の中でだけ付ける。モーションを減らす設定では、ピルは最初から表示し、ロゴは拡大せず、下線は伸びずにすぐ出る。ヘッダーに動きを足すときも、このメディアクエリの中に書く。

### 寸法を必ず指定する

素材はどれも 800×160（5:1）。`<video>` と `<img>` に `width={800} height={160}` を与え、CSS でも `aspect-ratio: 5 / 1` を指定する。

寸法がないと、WebKit（iOS の Safari / Brave など）はメタデータを読み込むまで `<video>` を既定の 300×150 で描画する。5:1 のロゴが 2:1 の箱に縮んで、横 80px ほどになる。

### モバイルではピルの空き幅いっぱいに広げる

素材の上下約 25% ずつは余白（文字の範囲は x 16〜780 / y 40〜118）。900px 以下では、ピルの高さ（ロゴ枠 42px）を変えずにロゴを大きく見せるため、次のようにする。

- `.logoLink` を `flex: 0 1 260px` / `height: 42px` / `overflow: clip` にする
- ロゴは `width: 100%` / `height: auto` で枠いっぱいに広げる
- 枠からはみ出すのは、素材の上下の余白だけになる

390px 幅では、ロゴは 258px 幅になる。

---

## 5. ヘッダーのナビゲーション（現在地の表示）

ナビの項目は `app/_constants/navigation.ts` の `NAV_ITEMS` / `CONTACT_NAV_ITEM` で定義し、デスクトップ（`Header/HeaderNav.tsx`）とモバイルメニュー（`Menu/index.tsx`）で共有する。項目を増やすときはこのファイルだけを直す。

### 現在地の判定

`usePathname()` で今のパスを取り、`isCurrentPath(pathname, href)` が真の項目に `aria-current="page"` を付ける。配下のページも現在地として扱う（`/activities/xxx` や `/activities/p/2` では「活動内容」）。トップページ（`/`）ではどの項目も現在地にならない。

`usePathname()` を使うのでナビはクライアントコンポーネントにしている。`Header` 本体はサーバーコンポーネントのままにして、クライアント側に送る範囲をナビだけに絞る。

### 見た目

見た目は `[aria-current='page']` セレクタで付ける。スクリーンリーダーへの伝達と見た目の根拠を 1 つにそろえるため、現在地用のクラスは作らない。

デスクトップ・モバイルとも、文字を `--color-primary-text`（`#b35c00`）の太字にする。下線や背景は付けない。

- 下線を使わない。ホバーは「コーラル（`#ff6b6b`）の文字＋下線」なので、現在地に下線を出すとホバー中と見分けがつかない。現在地の項目はホバーしても見た目を変えない
- ブランドのオレンジ（`--color-primary` `#f5a623`）は白地とのコントラストが約 2.0:1 で文字には足りないため、濃いオレンジ（4.72:1）を使う
- モバイルメニューの項目に背景色（`--color-current` `#fff8e7`）を敷くと 4.46:1 になり 4.5:1 を下回るので、背景は白のままにする
- 色に加えて太字でも区別する（WCAG 1.4.1）
- モバイルメニューの「お問い合わせ」（CTA）は、ボタンの見た目を保つため `aria-current` だけ付けて見た目は変えない。デスクトップの「お問い合わせ」ボタンはナビの外にあるため対象外

---

## 6. 表示の確認方法

ヘッドレスのブラウザでは GSAP のアニメーション（Blob の円形リビール、ページ遷移）が途中で止まる。レイアウトを確かめるときは、reduced-motion をエミュレートしてアニメーションを飛ばす。

```bash
agent-browser set device "iPhone 12"
agent-browser set viewport 390 658        # iPhone の Brave でバーが出ているときの表示領域
agent-browser set media light reduced-motion
agent-browser open http://localhost:3001/recruit
agent-browser screenshot ./recruit-390.png
```

最低限、次の画面サイズで確かめる。

- 390×658、320×568（モバイル）
- 768×1024（タブレット）
- 1000×511（高さの低いノートパソコン）、1280×800、1920×1080

確かめること:

- タイトルが写真（Blob の下端）より下にある
- ヒーローの高さが 1 画面（100svh）に収まっている
- 横スクロールが出ていない（`document.documentElement.scrollWidth` が画面幅と同じ）
- 写真の主な被写体が、ヘッダーより下に見えている

アニメーションそのものの見え方は、実際のブラウザで目で確かめる。

---

## 7. 変更履歴

| 日付 | 内容 | PR |
|---|---|---|
| 2026-11-21 | モバイルでロゴに寸法を与えて空き幅いっぱいに広げ、ヒーローを写真とタイトルの縦積みにした | #49 |
| 2026-11-21 | 縦積みを全幅に広げて 100svh に統一し、写真の幅を画面幅に合わせ、`--hero-header-overlap` で切り抜き位置を調整した | #52 |
| 2026-11-22 | ヘッダーのナビ（デスクトップ・モバイル）で現在表示中のページを示すようにした（オレンジの太字。ホバーと混同しないよう下線は使わない） | #60 |

---

## 関連ドキュメント

- **デザインシステムトップ**: [`docs/design.md`](../design.md)
- **コンポーネントスタイル**: [`docs/design/components.md`](./components.md)
- **スペーシング＆レイアウト**: [`docs/design/spacing-layout.md`](./spacing-layout.md)
- **画像＆イラスト**: [`docs/design/assets-images.md`](./assets-images.md)

---

**最終更新日**: 2026-11-21
**作成者**: Claude Code（フリーザ様）
