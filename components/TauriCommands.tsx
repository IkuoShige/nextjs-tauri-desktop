"use client";

import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Tauriコマンドを実行するためのコンポーネント
 * システム情報の取得、現在時刻の取得、および挨拶文の表示機能を提供する
 */
export function TauriCommands() {
  // 挨拶機能のステート
  const [name, setName] = useState("");
  const [greetMsg, setGreetMsg] = useState("");

  // システム情報と時刻のステート
  const [systemInfo, setSystemInfo] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  // SSH接続テスト用のステート
  const [hostname, setHostname] = useState("localhost");
  const [username, setUsername] = useState("user");
  const [password, setPassword] = useState("");
  const [sshResult, setSSHResult] = useState("");
  const [isTestingSSH, setIsTestingSSH] = useState(false);
  const [sshError, setSSHError] = useState(false);

  /**
   * 挨拶機能を実行する関数
   */
  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  /**
   * システム情報を取得する関数
   */
  async function getSystemInfo() {
    setSystemInfo(await invoke("get_system_info"));
  }

  /**
   * 現在時刻を取得する関数
   */
  async function getCurrentTime() {
    setCurrentTime(await invoke("get_current_datetime"));
  }

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
      <h2 className="text-2xl font-bold mb-4">Tauriコマンド</h2>

      {/* システム情報セクション */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">システム情報</h3>
        <Button 
          variant="outline" 
          onClick={getSystemInfo} 
          className="mr-2"
        >
          システム情報を取得
        </Button>
        <Button 
          variant="outline" 
          onClick={getCurrentTime}
        >
          現在時刻を取得
        </Button>
        <div className="mt-2 text-sm">
          {systemInfo && (
            <div className="p-2 bg-muted rounded">{systemInfo}</div>
          )}
          {currentTime && (
            <div className="p-2 bg-muted rounded mt-2">{currentTime}</div>
          )}
        </div>
      </div>

      {/* 挨拶機能セクション */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">挨拶機能</h3>
        <div className="flex items-end gap-2">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">名前</Label>
            <Input
              id="name"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="名前を入力してください"
            />
          </div>
          <Button onClick={greet}>挨拶する</Button>
        </div>
        {greetMsg && <p className="p-2 bg-muted rounded mt-2">{greetMsg}</p>}
      </div>

      {/* SSH接続テストセクション */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">SSH接続テスト</h3>
        <div className="grid gap-2">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="hostname">ホスト名</Label>
            <Input
              id="hostname"
              value={hostname}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHostname(e.target.value)}
              placeholder="example.com"
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="username">ユーザー名</Label>
            <Input
              id="username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              placeholder="username"
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="パスワード"
            />
          </div>
          
          <Button 
            onClick={testSSHConnection}
            disabled={isTestingSSH}
            className="mt-2"
          >
            {isTestingSSH ? "テスト中..." : "SSH接続をテスト"}
          </Button>
          
          {sshResult && (
            <div className={`p-2 rounded mt-2 ${sshError ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"}`}>
              {sshResult}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 