# podtip-website

PodTip（ポッドキャスト応援アプリ）の紹介ページです。
GitHub Pages で公開されています: https://erk-artifacts.github.io/podtip-website/

## 中身

素の HTML + CSS + JavaScript で、ビルドツールは使いません。

```
index.html        ページ本体（アプリの紹介）
privacy.html      プライバシーポリシー
css/style.css     スタイル
js/config.js      ★ お問い合わせ先のメールアドレスなど、外部サービスの URL はここだけ書き換える
js/main.js        URL の組み込みと、ヒーローの再生デモの動き
assets/           アイコン・スクリーンショット
```

## 更新するとき

1. ファイルを書き換える（お問い合わせ先などの URL は `js/config.js`）
2. このリポジトリに push すると、1〜2 分で自動的に公開される

※ プライバシーポリシーの文面の正本は開発リポジトリ（PodTip）の `docs/legal/privacy.md` です。
変更するときはそちらを先に直し、このサイトの `privacy.html` に同じ内容を写してください。
