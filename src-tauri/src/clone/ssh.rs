use std::process::Command;
use std::io;
use std::net::TcpStream;
use std::time::Duration;

/// SSHクライアントを表す構造体
/// 
/// SSH接続情報を保持し、接続テストなどの機能を提供します。
pub struct SSHClient {
    host: String,
    port: u16,
    _user: String,
    _password: String,
}

impl SSHClient {
    /// 新しいSSHClient インスタンスを作成
    ///
    /// # 引数
    ///
    /// * `user` - SSH接続するユーザー名
    /// * `host` - SSH接続先のホスト名またはIPアドレス
    /// * `password` - SSH接続するパスワード
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
    ///
    /// # 引数
    ///
    /// * `timeout_secs` - 接続タイムアウト時間（秒）。指定しなければデフォルトの5秒が使用される
    ///
    /// # 戻り値
    ///
    /// * `Ok(true)` - 接続成功
    /// * `Ok(false)` - 接続失敗（接続拒否またはタイムアウト）
    /// * `Err` - エラー発生
    pub fn check_connection(&self, timeout_secs: Option<u64>) -> Result<bool, io::Error> {
        let address = format!("{}:{}", self.host, self.port);
        
        // タイムアウト設定（デフォルトは5秒）
        let timeout = Duration::from_secs(timeout_secs.unwrap_or(5));
        
        // アドレスをパース
        let socket_addr = match address.parse() {
            Ok(addr) => addr,
            Err(e) => return Err(io::Error::new(io::ErrorKind::InvalidInput, 
                                               format!("アドレス解析エラー: {}", e)))
        };
        
        // 接続を試みる（タイムアウト付き）
        match TcpStream::connect_timeout(&socket_addr, timeout) {
            Ok(_) => Ok(true),
            Err(e) if e.kind() == io::ErrorKind::ConnectionRefused => Ok(false),
            Err(e) if e.kind() == io::ErrorKind::TimedOut => {
                println!("接続タイムアウト: {}", self.host);
                Ok(false)
            },
            Err(e) => Err(e),
        }
    }
}