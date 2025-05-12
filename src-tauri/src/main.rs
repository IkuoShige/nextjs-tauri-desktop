// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// SSHモジュールをインポート
mod clone {
    pub mod ssh;
}
use clone::ssh::SSHClient;

/// 挨拶を返すコマンド
/// 
/// # 引数
/// 
/// * `name` - 挨拶する相手の名前
#[tauri::command]
fn greet(name: &str) -> String {
    format!("こんにちは、{}さん！", name)
}

/// システム情報を取得するコマンド
/// 
/// OSとアーキテクチャ情報を取得して返します
#[tauri::command]
fn get_system_info() -> String {
    let os_info = std::env::consts::OS;
    let arch_info = std::env::consts::ARCH;
    format!("OS: {}, アーキテクチャ: {}", os_info, arch_info)
}

/// 現在の日時を取得するコマンド
/// 
/// UNIXタイムスタンプを取得して返します
#[tauri::command]
fn get_current_datetime() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    
    let now = SystemTime::now();
    let since_epoch = now.duration_since(UNIX_EPOCH)
        .expect("システム時間がUNIXエポックより前に設定されています");
    
    // UNIXタイムスタンプ（秒）
    let timestamp = since_epoch.as_secs();
    
    format!("現在のUNIXタイムスタンプ: {}", timestamp)
}

/// SSHの接続をテストするコマンド
/// 
/// # 引数
/// 
/// * `host` - 接続先ホスト名
/// * `user` - ユーザー名
/// * `password` - パスワード
/// 
/// # 戻り値
/// 
/// * `Ok(String)` - 接続成功メッセージ
/// * `Err(String)` - 接続失敗またはエラーメッセージ
#[tauri::command]
fn test_ssh_connection(host: &str, user: &str, password: &str) -> Result<String, String> {
    let ssh_client = SSHClient::new(user, host, password);
    
    match ssh_client.check_connection() {
        Ok(true) => Ok(format!("SSH接続テスト成功: {}@{} に接続できます", user, host)),
        Ok(false) => Err(format!("SSH接続テスト失敗: {}@{} に接続できません", user, host)),
        Err(e) => Err(format!("SSH接続テストエラー: {}", e)),
    }
}

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
