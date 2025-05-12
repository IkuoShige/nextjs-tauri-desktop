# Next.js + Tauri デスクトップアプリケーション

このプロジェクトは、Next.jsとTauriを組み合わせて作成した現代的なデスクトップアプリケーションのサンプルです。美しいUIとネイティブ機能の融合により、Webの使いやすさとデスクトップアプリのパワーを兼ね備えています。

## 主な特徴

- **モダンなUI**: Next.jsとTailwind CSSによる美しいインターフェース
- **ネイティブ機能**: Rustで書かれたバックエンドによる強力な機能
- **クロスプラットフォーム**: Windows、macOS、Linuxでの動作をサポート
- **ダークモード対応**: システム設定に合わせて自動的に切り替わるテーマ
- **レスポンシブデザイン**: 様々な画面サイズに対応

## 技術スタック

- **フロントエンド**: Next.js 13.5.6
- **デスクトップフレームワーク**: Tauri 1.5.0
- **UIコンポーネント**: shadcn/ui
- **スタイリング**: Tailwind CSS
- **言語**: TypeScript, Rust

## 機能デモ

- シンプルなカウンター操作
- システム情報の取得
- SSH接続テスト機能
- ダークモード切替

## 始め方

### 前提条件

- Node.js 16以上
- Rust toolchain (rustc, cargo)
- プラットフォーム固有の依存関係（詳細は[Tauriの公式ドキュメント](https://tauri.app/v1/guides/getting-started/prerequisites)を参照）

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/nextjs-tauri-desktop.git
cd nextjs-tauri-desktop

# 依存関係のインストール
npm install

# 開発モードで実行
npm run desktop:dev

# アプリケーションをビルド
npm run desktop:build
```

## プロジェクト構造

```
nextjs-tauri-desktop/
├── app/                  # Next.jsアプリケーションコード
├── components/           # UIコンポーネント
├── docs/                 # プロジェクトドキュメント
├── lib/                  # ユーティリティ関数
├── public/               # 静的アセット
└── src-tauri/            # Tauriバックエンドコード（Rust）
```

## ドキュメント

詳細な実装ガイドやリファクタリングノートについては、`docs`ディレクトリを参照してください：

- [実装ガイド](docs/implementation-guide.md)
- [リファクタリングノート](docs/refactoring-notes.md)

## ライセンス

MIT

## 貢献

プルリクエストは歓迎します。大きな変更を行う前には、まずissueを開いて変更内容について議論してください。
