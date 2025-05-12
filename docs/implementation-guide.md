# Next.js + Tauri デスクトップアプリケーション 実装ガイド

## プロジェクト概要

このプロジェクトでは、Next.jsとTauriを使用して美しいUIを持つデスクトップアプリケーションを実装しました。UIコンポーネントにはshadcn/uiを使用しています。フロントエンドとRustバックエンドの連携により、Webの使いやすさとネイティブアプリのパワーを兼ね備えたアプリケーションが実現できます。ダークモードを含むモダンなデザインを採用しています。

## 技術スタック

- **フロントエンド**: Next.js 13.5.6
- **デスクトップフレームワーク**: Tauri 1.5.0
- **UIコンポーネント**: shadcn/ui
- **スタイリング**: Tailwind CSS
- **言語**: TypeScript, Rust

## セットアップ手順

### 1. プロジェクト初期化

```bash
# package.jsonの作成
npm init -y

# 必要なパッケージのインストール
npm install next react react-dom
npm install --save-dev typescript @types/react @types/node @types/react-dom
npm install tailwindcss postcss autoprefixer
npm install @tauri-apps/api
npm install --save-dev @tauri-apps/cli
```

### 2. Next.js設定

- `next.config.js`に静的エクスポート設定を追加
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
```

### 3. Tauriの初期化

```bash
# Tauriプロジェクトの初期化
npx @tauri-apps/cli init
```

初期化時の質問に適切に回答します：
- アプリ名
- ウィンドウタイトル
- Webアセットのパス: `../out`
- 開発サーバーURL: `http://localhost:3000`
- フロントエンド開発コマンド: `npm run dev`
- フロントエンドビルドコマンド: `npm run build`

### 4. システム依存関係のインストール

Linuxの場合、以下のシステムライブラリが必要です：

```bash
sudo apt-get install -y libwebkit2gtk-4.0-dev libsoup2.4-dev libjavascriptcoregtk-4.0-dev
```

macOSの場合：

```bash
brew install webkit2gtk-4.0
```

Windowsの場合は基本的に追加の依存関係は不要です。

### 5. shadcn/uiのセットアップ

```bash
# ユーティリティ関数の実装
mkdir -p lib
```

`lib/utils.ts`を作成：

```tsx
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

コンポーネントの実装：
- Button
- Card
- Input など

### 6. ダークモードとカラーテーマの設定

Tailwind CSSのダークモード設定を有効にし、カラーテーマを設定します。

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      // その他の設定
    },
  },
}
```

`globals.css`にカラー変数を設定：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ライトモードのカラー変数 */
    --background: 0 0% 100%;
    --foreground: 222.2 47.4% 11.2%;
    /* その他のカラー変数 */
  }

  .dark {
    /* ダークモードのカラー変数 */
    --background: 224 71% 4%;
    --foreground: 213 31% 91%;
    /* より暗くシックなカラーパレット */
  }
}
```

## プロジェクト構造

```
nextjs-tauri-desktop/
├── app/                   # Next.js App Router
│   ├── globals.css        # グローバルCSS
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # ホームページ
├── components/            # UIコンポーネント
│   ├── Counter.tsx        # カウンターコンポーネント
│   ├── TauriCommands.tsx  # Tauriコマンド呼び出しコンポーネント
│   ├── theme/             # テーマ関連コンポーネント
│   │   └── ThemeProvider.tsx  # テーマプロバイダー
│   │   └── ThemeToggle.tsx    # テーマ切り替えボタン 
│   └── ui/                # shadcn/uiコンポーネント
│       ├── button.tsx     # ボタンコンポーネント
│       ├── card.tsx       # カードコンポーネント
│       └── input.tsx      # 入力コンポーネント
├── lib/                   # ユーティリティ
│   └── utils.ts           # 共通ユーティリティ関数
├── public/                # 静的ファイル
├── src-tauri/             # Tauriバックエンド
│   ├── src/               # Rustソースファイル
│   │   └── main.rs        # メインRustファイル
│   ├── Cargo.toml         # Rust依存関係
│   └── tauri.conf.json    # Tauri設定
├── docs/                  # ドキュメント
├── next.config.js         # Next.js設定
├── package.json           # npm設定
├── postcss.config.js      # PostCSS設定
├── tailwind.config.js     # Tailwind設定
└── tsconfig.json          # TypeScript設定
```

## 開発のポイント

### 1. Next.jsの静的エクスポート対応

Tauriは静的ファイルを使用してデスクトップアプリを構築するため、Next.jsの設定で`output: 'export'`を有効にする必要があります。これにより、ビルド時に`out`ディレクトリに静的ファイルが生成されます。

```js
// next.config.js
module.exports = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
};
```

### 2. Next.jsのクライアントコンポーネント対応

Next.jsのApp Routerでは、デフォルトでサーバーコンポーネントが使用されますが、イベントハンドラーを使用するコンポーネントやブラウザAPIを使用するコンポーネントはクライアントコンポーネントとして指定する必要があります。

```tsx
// クライアントコンポーネントとして指定
"use client";

// その後、通常のReactコンポーネントとして実装
import { useState } from "react";
```

特に注意が必要なのは、App Routerモデルではイベントハンドラー（onClick, onChangeなど）を含むコンポーネントは必ずクライアントコンポーネントとして指定する必要があります。

### 3. モダンなUI設計とダークモード対応

#### 3.1. ダークモードの実装

ダークモードを実装するには、テーマプロバイダーとテーマ切り替えコンポーネントを作成します。

```tsx
// components/theme/ThemeProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
```

テーマ切り替えボタンの例：

```tsx
// components/theme/ThemeToggle.tsx
"use client";

import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">テーマ切り替え</span>
    </Button>
  );
}
```

ルートレイアウトにテーマプロバイダーを追加：

```tsx
// app/layout.tsx
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### 3.2. モダンなカラースキームの設定

ダークでモダンな配色を実現するため、HSL値を使用します。以下は`globals.css`の例です：

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;

    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
```

#### 3.3. モダンなグリッドレイアウト

レスポンシブで美しいグリッドレイアウトの例：

```tsx
// app/page.tsx
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24 bg-background text-foreground">
      <div className="z-10 max-w-5xl w-full items-center justify-between">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Next.js + Tauri デスクトップアプリ
        </h1>
        
        {/* モダンなグリッドレイアウト */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {/* カード1 */}
          <Card className="border-0 bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-primary">Tauri</CardTitle>
              <CardDescription>高パフォーマンスなデスクトップアプリ</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Rustをバックエンド、Web技術をフロントエンドとして使用</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">詳細を見る</Button>
            </CardFooter>
          </Card>
          
          {/* カード2〜4も同様のスタイルで */}
        </div>

        {/* 機能コンポーネントを配置 */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Counter />
          <TauriCommands />
        </div>
      </div>
    </main>
  );
}
```

#### 3.4. モダンな視覚効果

Tailwind CSSを使用して、モダンな視覚効果を追加できます：

- **グラデーション**:
  ```
  bg-gradient-to-r from-purple-600 to-blue-500
  ```

- **ガラスモーフィズム**:
  ```
  bg-white/10 backdrop-blur-lg border border-white/20
  ```

- **アニメーション**:
  ```
  hover:scale-105 transition-transform duration-300
  ```

- **影効果**:
  ```
  shadow-lg shadow-purple-500/20
  ```

### 4. カウンターコンポーネント（ダークモード対応）

モダンなスタイルを適用したカウンターコンポーネント：

```tsx
// components/Counter.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <Card className="w-full border-0 bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-primary">カウンター</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          {count}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          onClick={() => setCount(count - 1)}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
        >
          減らす
        </Button>
        <Button 
          onClick={() => setCount(0)} 
          variant="secondary"
          className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900"
        >
          リセット
        </Button>
        <Button 
          onClick={() => setCount(count + 1)}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          増やす
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### 5. Tauriとの連携（ダークモード対応）

```tsx
// components/TauriCommands.tsx
"use client";

import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function TauriCommands() {
  const [name, setName] = useState("");
  const [greetMsg, setGreetMsg] = useState("");
  const [systemInfo, setSystemInfo] = useState("");
  const [dateTime, setDateTime] = useState("");

  async function handleGreet() {
    try {
      const result = await invoke("greet", { name });
      setGreetMsg(result as string);
    } catch (error) {
      console.error(error);
      setGreetMsg(`エラー: ${error}`);
    }
  }

  // 他の関数も同様に実装...

  return (
    <Card className="w-full border-0 bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-primary">Tauriコマンド呼び出し</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <Input
              placeholder="名前を入力"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
            <Button 
              onClick={handleGreet}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              挨拶
            </Button>
          </div>
          {greetMsg && (
            <p className="text-sm p-2 rounded bg-gray-800/50 border border-gray-700/50">
              {greetMsg}
            </p>
          )}
        </div>
        
        {/* 他のコマンドボタンとレスポンス表示 */}
      </CardContent>
    </Card>
  );
}
```

### 6. Rustバックエンドの実装

Tauriは、Rustを使用してデスクトップアプリのバックエンド機能を提供します。主な設定は`src-tauri/src/main.rs`で行います。

```rust
// src-tauri/src/main.rs
// コマンド定義
#[tauri::command]
fn greet(name: &str) -> String {
    format!("こんにちは、{}さん！", name)
}

#[tauri::command]
fn get_system_info() -> String {
    let os_info = std::env::consts::OS;
    let arch_info = std::env::consts::ARCH;
    format!("OS: {}, アーキテクチャ: {}", os_info, arch_info)
}

#[tauri::command]
fn get_current_datetime() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    
    let now = SystemTime::now();
    let since_epoch = now.duration_since(UNIX_EPOCH)
        .expect("システム時間がUNIXエポックより前に設定されています");
    
    let timestamp = since_epoch.as_secs();
    format!("現在のUNIXタイムスタンプ: {}", timestamp)
}

// 他のコマンド関数も同様に実装...

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            get_system_info,
            get_current_datetime,
            test_ssh_connection
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 7. SSHクライアント機能の実装

このアプリケーションにはSSH接続をテストする機能も実装されています。Rustによるバックエンド機能とTypeScriptによるフロントエンドUIを組み合わせて構築されています。

#### 7.1 SSHクライアントのRustモジュール

```rust
// src-tauri/src/clone/ssh.rs
use std::process::Command;
use std::io;
use std::net::TcpStream;

/// SSHクライアントを表す構造体
pub struct SSHClient {
    host: String,
    port: u16,
    _user: String,
    _password: String,
}

impl SSHClient {
    /// 新しいSSHClient インスタンスを作成
    pub fn new(user: &str, host: &str, password: &str) -> Self {
        SSHClient {
            _user: user.to_string(),
            host: host.to_string(),
            _password: password.to_string(),
            port: 22,  // デフォルトのSSHポート
        }
    }

    pub fn execute_command(&self, command: &str) -> Result<String, io::Error> {
        let ssh_command = format!("sshpass -p '{}' ssh {}@{} '{}'", 
                                  self._password, self._user, self.host, command);
        let output = Command::new("sh")
            .arg("-c")
            .arg(ssh_command)
            .output()?;

        if output.status.success() {
            Ok(String::from_utf8_lossy(&output.stdout).to_string())
        } else {
            Err(io::Error::new(io::ErrorKind::Other, 
                              String::from_utf8_lossy(&output.stderr).to_string()))
        }
    }

    /// SSH接続が可能かをテスト
    pub fn check_connection(&self) -> Result<bool, io::Error> {
        let address = format!("{}:{}", self.host, self.port);
        match TcpStream::connect(address) {
            Ok(_) => Ok(true),
            Err(e) if e.kind() == io::ErrorKind::ConnectionRefused => Ok(false),
            Err(e) => Err(e),
        }
    }
}
```

#### 7.2 Tauriコマンドの実装

main.rsにSSHテスト用のコマンドを追加します：

```rust
// src-tauri/src/main.rs
#[tauri::command]
fn test_ssh_connection(host: &str, user: &str, password: &str) -> Result<String, String> {
    let ssh_client = SSHClient::new(user, host, password);
    
    match ssh_client.check_connection() {
        Ok(true) => Ok(format!("SSH接続テスト成功: {}@{} に接続できます", user, host)),
        Ok(false) => Err(format!("SSH接続テスト失敗: {}@{} に接続できません", user, host)),
        Err(e) => Err(format!("SSH接続テストエラー: {}", e)),
    }
}
```

#### 7.3 フロントエンドとの連携

SSHクライアント機能をフロントエンドと連携させるためのUIコンポーネントを実装します：

```tsx
// components/TauriCommands.tsx（抜粋）
"use client";

import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TauriCommands() {
  // 他の状態変数...

  // SSH接続テスト用のステート
  const [hostname, setHostname] = useState("localhost");
  const [username, setUsername] = useState("user");
  const [password, setPassword] = useState("");
  const [sshResult, setSSHResult] = useState("");
  const [isTestingSSH, setIsTestingSSH] = useState(false);
  const [sshError, setSSHError] = useState(false);

  /**
   * SSH接続をテストする関数
   */
  async function testSSHConnection() {
    setIsTestingSSH(true);
    setSSHResult("テスト中...");
    setSSHError(false);

    try {
      const result = await invoke("test_ssh_connection", {
        host: hostname,
        user: username,
        password: password,
      });
      setSSHResult(result as string);
      setSSHError(false);
    } catch (error) {
      setSSHResult(error as string);
      setSSHError(true);
    } finally {
      setIsTestingSSH(false);
    }
  }

  return (
    <div className="flex flex-col space-y-6 bg-card p-6 rounded-lg shadow-sm">
      {/* 他のセクション... */}

      {/* SSH接続テストセクション */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">SSH接続テスト</h3>
        <div className="grid grid-cols-1 gap-2">
          <div className="space-y-1">
            <Label htmlFor="hostname">ホスト名</Label>
            <Input
              id="hostname"
              placeholder="例: example.com"
              value={hostname}
              onChange={(e) => setHostname(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="username">ユーザー名</Label>
            <Input
              id="username"
              placeholder="例: user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              type="password"
              placeholder="パスワードを入力"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <Button
          onClick={testSSHConnection}
          disabled={isTestingSSH}
          className="mt-2"
        >
          {isTestingSSH ? "テスト中..." : "接続テスト"}
        </Button>
        {sshResult && (
          <div 
            className={`p-2 rounded text-sm ${sshError ? 'bg-destructive/20 text-destructive' : 'bg-muted'}`}
          >
            {sshResult}
          </div>
        )}
      </div>
    </div>
  );
}
```

## 実行方法

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

ビルドが成功すると、`src-tauri/target/release`ディレクトリにバイナリが生成されます。また、インストーラーは`src-tauri/target/release/bundle`ディレクトリに生成されます。

## ビルドと配布

### 1. アプリケーションのカスタマイズ

`src-tauri/tauri.conf.json`ファイルでアプリケーションの設定を変更できます：

- アプリ名
- ウィンドウサイズ
- アイコン
- 起動時のメニュー
- バージョン情報

```json
{
  "window": {
    "width": 900,
    "height": 700,
    "theme": "Dark",
    "decorations": true,
    "resizable": true
  }
}
```

### 2. ウィンドウのデザインカスタマイズ

Tauriでは、`tauri.conf.json`でウィンドウのデザインをカスタマイズできます：

```json
"windows": [
  {
    "title": "モダンなデスクトップアプリ",
    "width": 900,
    "height": 700,
    "minWidth": 400,
    "minHeight": 400,
    "resizable": true,
    "fullscreen": false,
    "decorations": true,
    "transparent": false,
    "theme": "Dark"
  }
]
```

### 3. 各プラットフォーム向けビルド

```bash
# すべてのプラットフォーム向けにビルド
npm run desktop:build

# 特定のプラットフォーム向けにビルド
npx tauri build --target win32
npx tauri build --target darwin
npx tauri build --target linux
```

## トラブルシューティング

### 1. ビルドエラー

Rustの依存関係の問題でビルドエラーが発生した場合：

```bash
# Cargoキャッシュをクリーン
cargo clean

# 再度ビルド
npm run desktop:build
```

### 2. システム依存関係のエラー

Linuxでシステム依存関係が不足している場合：

```bash
sudo apt-get install -y libwebkit2gtk-4.0-dev libsoup2.4-dev libjavascriptcoregtk-4.0-dev
```

### 3. Next.jsのエラー

クライアントコンポーネントに関するエラーが発生した場合：

```
Error: Event handlers cannot be passed to Client Component props
```

該当コンポーネントの先頭に`"use client";`を追加してクライアントコンポーネントとして指定します。

## 参考リソース

- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Tauri公式ドキュメント](https://tauri.app/v1/guides)
- [shadcn/ui公式ドキュメント](https://ui.shadcn.com)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)
- [Tailwind CSSカラーパレットジェネレーター](https://uicolors.app)
- [Tauri ウィンドウAPI](https://tauri.app/v1/api/js/window) 