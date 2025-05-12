# SSH接続テストの非同期処理改善

## 1. 課題

SSH接続テスト機能において、ホストに接続できない場合、UIがフリーズしてしまい、タイムアウトするまで他の操作ができなくなる問題がありました。
これは、Next.js + Tauriアプリケーションにおいて、Rustの処理がJavaScriptのUIスレッドをブロックしていたことが原因でした。

## 2. 改善策

この問題を解決するために、以下の改善を実装しました：

1. **Tauriの非同期コマンド機能の活用**
   - `#[tauri::command(async)]` アノテーションを使用して、コマンドを非同期で実行
   - 別スレッドで接続処理を行い、UIスレッドのブロッキングを回避

2. **イベントベースの通信**
   - 処理の進捗状況と結果をイベントを使って通知
   - フロントエンドはイベントリスナーを介して状態を更新
   - 3種類のイベント（`ssh-test-progress`, `ssh-test-completed`, `ssh-test-failed`）を実装

3. **視覚的フィードバックの強化**
   - プログレスドットアニメーションの実装
   - 接続状態の視覚的表示（色別表示）

## 3. 実装詳細

### 3.1 バックエンド (Rust) の変更

#### main.rs

```rust
// 非同期コマンドの定義
#[tauri::command(async)]
async fn test_ssh_connection(window: Window, host: String, user: String, password: String) {
    // 処理を別スレッドに移動して、UIスレッドをブロックしないようにする
    std::thread::spawn(move || {
        // イベントを使って進捗状況を通知
        window.emit("ssh-test-progress", "開始").unwrap();
        
        // SSH接続テストを実行
        let result = match ssh_client.check_connection(timeout_secs) {
            // 結果に応じてイベントを送信
            // ...
        };
    });
}
```

#### ssh.rs

```rust
// タイムアウト機能付きの接続テスト
pub fn check_connection(&self, timeout_secs: Option<u64>) -> Result<bool, io::Error> {
    // タイムアウト設定（デフォルトは5秒）
    let timeout = Duration::from_secs(timeout_secs.unwrap_or(5));
    
    // 接続試行（タイムアウト付き）
    match TcpStream::connect_timeout(&socket_addr, timeout) {
        // 結果処理
        // ...
    }
}
```

### 3.2 フロントエンド (TypeScript/React) の変更

#### TauriCommands.tsx

```tsx
// イベントリスナーの登録
useEffect(() => {
    // SSH接続テストの進捗イベントをリッスン
    const progressUnlisten = listen("ssh-test-progress", (event) => {
        // 進捗メッセージを表示
    });

    // SSH接続テスト成功イベントをリッスン
    const completedUnlisten = listen("ssh-test-completed", (event) => {
        // 成功メッセージを表示
    });

    // SSH接続テスト失敗イベントをリッスン
    const failedUnlisten = listen("ssh-test-failed", (event) => {
        // エラーメッセージを表示
    });

    // クリーンアップ
    return () => {
        // リスナーの解除
    };
}, []);

// 接続テスト関数
async function testSSHConnection() {
    // 状態の初期設定
    setIsTestingSSH(true);
    
    // 非同期コマンドの呼び出し
    await invoke("test_ssh_connection", {
        host: hostname,
        user: username,
        password: password
    });
    // 結果はイベントで受け取る
}
```

## 4. 効果

1. **UIのレスポンシブ性向上**
   - 接続テスト中でもスクロールや他のボタンクリックなどの操作が可能に
   - フリーズなしで5秒のタイムアウトを確実に機能させることが可能に

2. **ユーザー体験の向上**
   - 視覚的フィードバックによりアプリケーションの状態がより分かりやすく
   - 接続テスト中の状態が明確に表示される

3. **コードの改善**
   - Tauriの機能をより適切に活用し、Next.js + Tauriアプリケーションの構成に合わせた実装
   - イベントベースの非同期処理により、コードの保守性が向上

## 5. 今後の展望

1. **進捗表示のさらなる改善**
   - より詳細な進捗状況（％表示など）の実装
   - 接続試行の段階別表示

2. **タイムアウト設定の柔軟化**
   - 接続環境に応じて自動的にタイムアウト時間を調整する機能
   - 接続の重要度に応じたタイムアウト戦略の実装

3. **エラーハンドリングの強化**
   - より詳細なエラー情報の提供
   - ネットワーク環境に基づいた推奨アクションの提案
