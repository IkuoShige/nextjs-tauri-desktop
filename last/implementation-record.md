# Jetson Image Manager 実装記録

## 開発環境セットアップ

### 1. Next.jsプロジェクトの作成

```bash
# プロジェクトの初期化
cd /home/ikuo/ui_play/jetson-image-manager
npm init -y

# Next.jsプロジェクトの作成
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

### 2. Tauriのセットアップ

```bash
# Tauri CLIのインストール
npm install --save-dev @tauri-apps/cli

# Tauriの初期化
npx @tauri-apps/cli init
```

Tauriの初期化時に以下の設定を行いました：
- アプリ名: Jetson Image Manager
- ウィンドウタイトル: Jetson Image Manager
- ウェブアセットの場所: ../out
- 開発サーバーURL: http://localhost:3000
- フロントエンド開発コマンド: npm run dev
- フロントエンドビルドコマンド: npm run build

### 3. package.jsonの更新

`package.json`ファイルを更新して、アプリケーション名とTauriコマンドを追加しました。

```diff
- "name": "temp-next",
+ "name": "jetson-image-manager",
  "scripts": {
-   "dev": "next dev --turbopack",
+   "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
+   "tauri": "tauri",
+   "desktop:dev": "tauri dev",
+   "desktop:build": "tauri build"
  },
```

### 4. 必要なライブラリのインストール

```bash
npm install zustand react-hook-form zod @hookform/resolvers class-variance-authority clsx tailwind-merge lucide-react @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-avatar @radix-ui/react-slot @tauri-apps/api
```

## コンポーネントの実装

### 1. ユーティリティ関数

`/lib/utils.ts`にTailwind CSSのユーティリティ関数を実装しました。

### 2. UIコンポーネント

以下のUIコンポーネントを実装しました：
- `/components/ui/button.tsx`: ボタンコンポーネント
- `/components/ui/card.tsx`: カードコンポーネント

### 3. APIユーティリティ

`/lib/api.ts`にTauriバックエンドとの通信を行うためのユーティリティ関数を実装しました。主な機能は以下の通りです：
- `listImages()`: イメージのリストを取得
- `deployImage()`: イメージを展開
- `getImageDetails()`: イメージの詳細情報を取得

### 4. カスタムフック

`/hooks/use-images.ts`にイメージのリストを取得するためのカスタムフックを実装しました。

## Tauriバックエンドの実装

### 1. データモデル

```rust
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ImageInfo {
    name: String,
    jetpack_version: String,
    last_updated: String,
    disk_usage: DiskUsage,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DiskUsage {
    used: f64,
    total: f64,
}
```

### 2. コマンド

以下のTauriコマンドを実装しました：
- `list_images`: イメージのリストを取得
- `deploy_image`: イメージを展開
- `get_image_details`: イメージの詳細情報を取得

### 3. アプリケーション状態

アプリケーションの状態を管理するために`AppState`構造体を実装し、サンプルデータを追加しました。

## フロントエンドの実装

### 1. メインページ

`/app/page.tsx`にメインページを実装しました。主な機能は以下の通りです：
- イメージリストの表示
- イメージの展開機能
- ローディング状態とエラー処理

## 実装済み機能

### 1. メインページ
- イメージリストの表示
- サムネイル、タイトル、バージョン情報の表示
- カード形式でのUI実装

### 2. 操作ページ
- デバイス接続コンポーネント
  - デバイスIP/ポート入力フォーム
  - 接続状態の表示
- 操作選択コンポーネント
  - クローン/リストア操作の選択UI
- クローン操作コンポーネント
  - イメージ名入力フォーム
  - クローン処理の実行
- リストア操作コンポーネント
  - リストア対象のイメージ選択
  - リストア処理の実行
- 操作結果コンポーネント
  - 処理結果の表示
  - エラーメッセージの表示

### 3. 設定ページ
- アプリケーション設定の表示と更新
  - イメージ保存ディレクトリの設定
  - デフォルトイメージサイズの設定
- UIテーマ設定
  - ダークモード切り替え
  - アクセントカラー選択
- Jetsonデバイス管理
  - 保存済みデバイスの一覧表示
  - 新規デバイスの追加
  - 登録済みデバイスの削除

### 4. バックエンド（Tauri）
- Jetson操作モジュール（jetson.rs）
- 設定管理モジュール（config.rs）
- 既存Rustコードの統合
- Tauriコマンドのエクスポート
- ファイルシステムアクセス権の設定

## 今後の実装予定

1. **詳細ページ**: イメージの詳細情報を表示するページの実装
2. **新規イメージ作成**: 新しいイメージを作成するための機能
3. **設定ページ**: アプリケーションの設定を行うページの実装
4. **リアルタイム進捗表示**: 長時間実行される操作（クローン/リストア）の進捗状況をリアルタイム表示
5. **エラー処理の強化**: より詳細なエラーメッセージと対応策の表示

## 起動方法

### 開発モード

```bash
# フロントエンドのみ起動
npm run dev

# デスクトップアプリとして起動
npm run desktop:dev
```

### ビルド

```bash
# デスクトップアプリのビルド
npm run desktop:build
```

## 動作確認結果

2025年5月8日に動作確認を実施し、以下の結果を得ました：

1. **フロントエンド（Next.js）**: 
   - 開発サーバーは正常に起動し、http://localhost:3001 でアクセス可能
   - UI要素は正常に表示され、レスポンシブデザインが機能

2. **デスクトップアプリケーション（Tauri）**:
   - 必要なシステム依存関係をインストール後、正常に起動
   - フロントエンドUIがデスクトップウィンドウ内で正しく表示され操作可能
   - 初回ビルドは時間がかかったが、2回目以降は高速に起動

テスト結果の詳細は `test-results.md` を参照してください。

## 技術的なポイント

1. **Next.jsとTauriの連携**: フロントエンドとバックエンドの連携を`@tauri-apps/api`を使って実現
2. **TypeScriptによる型安全性**: フロントエンドとバックエンド間のデータ構造を一貫して型付けして安全性を確保
3. **コンポーネント指向設計**: UIを再利用可能なコンポーネントに分割して開発効率を向上
4. **Rustによる安全なバックエンド**: メモリ安全なRustを使ったバックエンドの実装
5. **モダンなUI**: TailwindCSSとshadcn/uiコンポーネントを使用した美しいUIの実現
