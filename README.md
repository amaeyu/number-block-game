# すうじブロックならべ

5歳くらいの子ども向けの、数字の規則を見つけるタップ式パズルです。9ステージ×5問を収録し、クリア状況はブラウザに保存されます。

## 起動方法

Node.js 20以上を用意し、次を実行します。

```bash
npm install
npm run dev
```

表示されたURLをブラウザで開いてください。本番用ファイルの確認は次のコマンドです。

```bash
npm run build
npm run preview
```

## ファイル構成

```text
├── .github/workflows/deploy.yml  # GitHub Pagesへの自動公開
├── src/
│   ├── App.tsx                  # 画面とゲーム進行、保存処理
│   ├── data.ts                  # 9ステージ×5問の問題データ
│   ├── main.tsx                 # アプリの入口
│   └── styles.css               # レスポンシブ表示と演出
├── index.html
├── vite.config.ts               # 公開先のbase設定
└── package.json
```

## GitHub Pagesで公開する

1. GitHubで `number-block-game` というリポジトリを作成します。
2. このフォルダの内容を `main` ブランチへpushします。
3. リポジトリの **Settings → Pages → Build and deployment** で、Sourceを **GitHub Actions** にします。
4. Actionsの `Deploy to GitHub Pages` が完了すると、`https://ユーザー名.github.io/number-block-game/` で公開されます。

`vite.config.ts` の `base` は `/number-block-game/` に設定済みです。別のリポジトリ名で公開する場合は、この値も合わせて変更してください。

## 保存について

クリア済みステージIDは `localStorage` の `number-block-game-cleared` に保存します。再読み込み後も色付き表示が残り、クリア済みステージも何度でも遊べます。
