# GitHub Pages＋成績同期の設定記録

GitHub Pages、Firebase Authentication、Cloud Firestore、セキュリティルールは設定済みです。以下は再設定時の手順です。

## 1. GitHub

1. GitHubで公開リポジトリ `it-passport-study` を作成します。
2. このフォルダのファイルを、`it-passport-assets` フォルダを含めてリポジトリ直下へ配置します。
3. リポジトリの `Settings > Pages` で、`Deploy from a branch`、`main`、`/(root)` を選択します。
4. 公開後は `https://＜GitHubユーザー名＞.github.io/it-passport-study/` から開けます。

## 2. Firebase

1. Firebase Consoleでプロジェクトを作成し、Webアプリを登録します。
2. Authenticationのログイン方法で「メール／パスワード」を有効にします。
3. Cloud Firestoreを作成します。本番環境モードを選びます。
4. Firestoreのルールへ `firestore.rules` の内容を貼り付けて公開します。
5. Authenticationの承認済みドメインに `＜GitHubユーザー名＞.github.io` を追加します。
6. Firebase Consoleに表示される `firebaseConfig` の値を `firebase-config.js` へ入力します。
7. 更新した `firebase-config.js` をGitHubへ反映します。

FirebaseのWeb用設定値は公開される前提の識別情報です。サービスアカウント秘密鍵やGitHubアクセストークンは、絶対にHTMLやJavaScriptへ記載しないでください。

## 3. iPhone／iPad

1. 公開URLをSafariで開きます。
2. 共有ボタンから「ホーム画面に追加」を選びます。
3. 問題集で同じメールアドレスとパスワードを使ってログインします。

初回表示後は問題画像が端末へ保存され、オフラインでも問題演習できます。オフライン中の成績は端末内へ保存され、次回オンライン時の回答から同期されます。
