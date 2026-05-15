# ゴール管理アプリ設計書

## 概要
このアプリは、ユーザーがゴールを追加・管理し、進捗を記録するためのReactベースのWebアプリケーションです。データはAWS Lambda APIで保存・取得します。保守向けに、コードの理解と改修を容易にすることを目的としています。

## 要件定義
- **ゴール追加**: タイトル、目標、アプローチ、ステータス、期限を入力して新しいゴールを追加。
- **ゴール編集/削除**: 既存ゴールを更新または削除。
- **進捗ログ**: 各ゴールに日付と内容のログを追加・削除。
- **日次記録**: ゴールの完了/未完了を日次で記録。

## データモデル
TypeScriptの型定義は以下の通りです。これにより、データの構造が明確になります。

```typescript
export type GoalStatus = "未着手" | "進行中" | "完了";

export interface ProgressLog {
  id: string;
  date: string; // YYYY-MM-DD形式
  content: string;
}

export interface DailyRecord {
  id: string;
  date: string; // YYYY-MM-DD形式
  result: "done" | "not_done";
}

export interface GoalItem {
  id: string;
  title: string;
  goal: string;
  approach: string;
  status: GoalStatus;
  progressLogs: ProgressLog[];
  dailyRecords?: DailyRecord[]; // オプション
  dueDate?: string; // YYYY-MM-DD形式、オプション
}
```

## アーキテクチャ/コンポーネント構造
- **App.tsx**: メインコンポーネント。state管理とAPI連携を担当。
- **GoalCard.tsx**: 個別ゴールの表示・編集コンポーネント。
- **types.tsx**: 型定義ファイル（上記参照）。

## API仕様
- **GET /**: 全ゴールを取得。レスポンス: `GoalItem[]`
- **POST /**: ゴールを保存。リクエスト: `GoalItem`、レスポンス: なし
- **DELETE /**: ゴールを削除。リクエスト: `{ id: string }`、レスポンス: なし

## State管理

### 状態の分類
- **グローバル状態**: アプリ全体で共有される状態（例: `items`）
- **ローカル状態**: コンポーネント固有の状態（例: `editingId`）
- **フォーム状態**: ユーザー入力の一時保存（例: `titleInput`）

### 各状態の詳細

#### items (グローバル状態)
- **型**: `GoalItem[]`
- **初期値**: localStorageから取得、またはデフォルト配列
- **更新トリガー**: API取得成功時、追加/編集/削除操作時
- **影響範囲**: GoalCardの表示、API同期
- **同期**: localStorageとの双方向同期

#### editingId (ローカル状態)
- **型**: `string | null`
- **初期値**: `null`
- **更新トリガー**: 編集ボタンクリック、保存/キャンセル時
- **影響範囲**: GoalCardとGoalEditFormの表示切り替え
- **目的**: 編集中のゴールを特定

#### フォーム入力状態 (ローカル状態)
- **titleInput, goalInput, approachInput, statusInput, duDateInput**
- **型**: `string` または `GoalStatus`
- **初期値**: 空文字列またはデフォルト値
- **更新トリガー**: 入力フィールドのonChange
- **影響範囲**: 新規ゴール追加フォーム
- **目的**: ユーザー入力の一時保存

### 更新パターン
- **同期更新**: フォーム入力、UI操作
- **非同期更新**: API呼び出し後の状態反映
- **条件付き更新**: バリデーション通過時のみ

### 依存関係
- **外部依存**: localStorage, AWS Lambda API
- **内部依存**: types.tsxの型定義

## UI/UX設計
- メイン画面: ゴール追加フォーム + ゴール一覧（GoalCard）。
- スタイル: インラインCSSでシンプル。レスポンシブ対応推奨。

## テスト計画
- ユニットテスト: 各関数（handleAddGoalなど）の動作確認（Jest使用）。
- 統合テスト: API連携のテスト。

## 依存関係と環境
- React, TypeScript, Vite。
- 環境: Node.js, AWS Lambda（API_URL: https://...）。