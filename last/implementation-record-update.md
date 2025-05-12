## Jetsonイメージ操作機能の実装

### 1. バックエンドRustコードの統合

既存の`cite`ディレクトリにあるRustコードをTauriバックエンドに統合しました。

```bash
# Tauriのクライアントライブラリをインストール
cd /home/ikuo/ui_play/jetson-image-manager
npm install @tauri-apps/api
```

### 2. ファイル構造

```
src-tauri/src/jetson.rs  # Jetson操作用の関数を実装
lib/api.ts               # フロントエンド用APIインターフェース
components/
  device-connection.tsx  # Jetsonデバイス接続UI
  operation-selector.tsx # 操作選択UI
  clone-operation.tsx    # クローン操作UI
  restore-operation.tsx  # リストア操作UI
  operation-result.tsx   # 操作結果表示UI
app/operations/page.tsx  # 操作ページコンポーネント
```

### 3. クローン/リストア機能

citeディレクトリのRustコードを参考に、以下の機能を実装しました：

1. **SSH接続**: Jetsonデバイスへの接続確認
2. **イメージクローン**: 
   - イメージファイルの作成
   - ファイルの同期（JetsonからPC）
3. **イメージリストア**:
   - イメージの検証
   - ディスクへの書き込み
   - ファイルシステムのリサイズ

### 4. UIの改良

ページ間の遷移と操作フローを実装し、直感的なUIを構築しました：

- ホームページにクローン/リストア操作へのリンクを追加
- ステップバイステップの操作フロー（接続 → 操作選択 → 実行 → 結果表示）
- 進捗表示と詳細なエラーメッセージ

### 5. モバイルレスポンシブ対応

スマートフォンやタブレットでも使いやすいように、レスポンシブデザインを採用しています。
