export type ProgressLog = {
  id: string;
  date: string;
  content: string;
};

export type GoalStatus = "未着手" | "進行中" | "完了";

export type GoalItem = {
  id: string;
  title: string;
  goal: string;
  approach: string;
  status: GoalStatus;
  progressLogs: ProgressLog[];
  dueDate?: string;
  dailyRecords?: DailyRecord[];
};

export type DailyRecord = {
    id: string;
    date: string;
    result:"done"| "not_done";
    note?: string;
}

