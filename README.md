# podtip-website

PodTip（ポッドキャスト投げ銭アプリ）のテスター募集ページです。
GitHub Pages で公開されています: https://erk-artifacts.github.io/podtip-website/

## 中身

素の HTML + CSS + JavaScript で、ビルドツールは使いません。

```
index.html        ページ本体
css/style.css     スタイル
js/config.js      ★ 参加に必要な URL（Google グループ / オプトインURL / フォーム）はここだけ書き換える
js/main.js        URL の組み込みと、ヒーローの再生デモの動き
assets/           アイコン・スクリーンショット
```

## 更新するとき

1. `js/config.js` の URL を書き換える（おもにこれだけ）
2. このリポジトリに push すると、1〜2 分で自動的に公開される

手順の詳しい説明は、開発リポジトリ側の `docs/tester-recruiting.md` にあります。
