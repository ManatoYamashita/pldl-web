# 開発環境のトラブルシューティング

`pnpm dev`（http://localhost:3001）で見た表示がおかしいときに、コードの不具合か、開発環境だけの現象かを切り分ける手順。

## 表示崩れの切り分け

報告や修正の前に、次の順で確かめる。

| 順 | 確かめること | 結果と判断 |
|---|---|---|
| 1 | そのタブを再読み込みする（Cmd+Shift+R） | 消える → 開きっぱなしのタブに、開発中の差し替え（HMR / Fast Refresh）の残骸が溜まって起きた。開発環境だけの現象で、本番のビルドでは起きない。修正は要らない |
| 2 | 新しいタブで同じページを開く | 再現しない → 1 と同じく、そのタブだけの状態が原因 |
| 3 | 余白やずれが、トラックパッドから指を離すと戻るか | 戻る → macOS のブラウザのオーバースクロール（端を越えて引っ張ると弾む動き）。ページの不具合ではない |
| 4 | `pnpm build && pnpm start` の本番ビルドで再現するか | 再現しない → 開発環境だけの現象。開発時だけ読み込むもの（`app/layout.tsx` の Agentation など）も疑う |

4 まで進んでも再現するなら、コードの不具合として調べる。

### 例: フッターの下に余白が出て、そこまでスクロールできた（2026-11-21）

- `/support` で、コピーライト行の下に約 250px の灰色の余白が出て、指を離してもそこで止まった
- 新しいタブでは、直接開いても、他のページからリンクで移動しても再現しなかった（文書の高さ＝フッターの下端）
- その日はヒーローの CSS を何度も差し替え、ブラウザのウィンドウの大きさも変えていた
- 再読み込みで消えたので、HMR の残骸と判断した

## はみ出している要素を探す

ページが想定より長い、または横にスクロールできるときは、ブラウザの DevTools のコンソールで次を実行する。フッターより下にはみ出している要素を一覧にする。

```js
(() => {
  const fb = document.querySelector('footer').getBoundingClientRect().bottom + scrollY;
  const below = [...document.querySelectorAll('html *')]
    .map((e) => ({ e, r: e.getBoundingClientRect() }))
    .filter(({ r }) => (r.width || r.height) && r.bottom + scrollY > fb + 1)
    .slice(0, 10)
    .map(({ e, r }) => `${e.tagName}.${String(e.className).slice(0, 60)} bottom=${Math.round(r.bottom + scrollY)} pos=${getComputedStyle(e).position}`);
  return JSON.stringify({ size: [innerWidth, innerHeight], docH: document.documentElement.scrollHeight, footerBottom: Math.round(fb), below }, null, 1);
})()
```

- `below` に出た要素が原因
- `below` が空なのに `docH` が `footerBottom` より大きいときは、ブラウザの拡張機能が `html` の外に要素を差し込んでいることを疑う
- 横スクロールは、`document.documentElement.scrollWidth` が `innerWidth` より大きいかで確かめる

## ヘッドレスのブラウザで表示を確かめるとき

agent-browser などのヘッドレスのブラウザでは、GSAP のアニメーション（ページ遷移、ヒーローの Blob の円形リビールなど）が途中で止まる。レイアウトを確かめるときは、reduced-motion をエミュレートしてアニメーションを飛ばす（`agent-browser set media light reduced-motion`）。手順は [hero.md の 5](../design/hero.md#5-表示の確認方法)。

## 関連ドキュメント

- [vercel-cli.md](./vercel-cli.md) - Preview の確認手順
- [hero.md](../design/hero.md) - ヒーローの構成と表示の確認方法
