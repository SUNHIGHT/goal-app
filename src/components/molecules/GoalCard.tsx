import { useState } from "react";
import type { GoalItem } from "../../types/types";
import './GoalCard.css'
import Panel from "../atoms/Panel"
import Button from "../atoms/Button"
import TextArea from "../atoms/TextArea"

type GoalCardProps = {
    item: GoalItem;
    onDeleteGoal: (id: string) => void;
    onUpdateGoal: (updatedItem: GoalItem) => void;
    onAddLog: (goalId: string, content: string) => void;
    onDeleteLog: (goalId: string, logId: string) => void;
    onAddDailyRecord: (goalId: string, result: "done" | "not_done") => void;
    onEdit: () => void;
};

function GoalCard({
    item,
    onDeleteGoal,
    onAddLog,
    onDeleteLog,
    onAddDailyRecord,
    onEdit
}: GoalCardProps) {
    const [logInput, setLogInput] = useState("");

    const handleAddLog = () => {
        const trimmed = logInput.trim();
        if (trimmed === "") return;

        onAddLog(item.id, trimmed);
        setLogInput("");
    };

    const onRecordToday = (result: "done" | "not_done") => {
        onAddDailyRecord(item.id, result);
    }

    return (
        <Panel>
            <div className="goal-card">
                <div className="goal-title">
                    <h2>{item.title}</h2>
                </div>
                <div className="goal-body">
                    <div className="goal-row">
                        <div className="label">目標</div>
                        <div className="value">{item.goal}</div>
                    </div>

                    <div className="goal-row">
                        <div className="label">アプローチ</div>
                        <div className="value">{item.approach}</div>
                    </div>

                    <div className="goal-row">
                        <div className="label">ステータス</div>
                        <div className="value">{item.status}</div>
                    </div>

                    <div className="goal-row">
                        <div className="label">期限</div>
                        <div className="value">{item.dueDate || "未設定"}</div>
                    </div>
                </div>
                <div className="daily-record">
                    <div className="label">今日の記録</div>
                    <div className="button-group">
                        <Button onClick={() => onRecordToday("done")}>
                            出来た
                        </Button>
                        <Button onClick={() => onRecordToday("not_done")}>
                            出来なかった
                        </Button>
                    </div>
                </div>
            </div>


            <Button onClick={onEdit} style={{ marginRight: "8px" }}>
                編集
            </Button>
            <Button onClick={() => {
                const ok = window.confirm("本当にこのゴールを削除しますか？");
                if (!ok) return;
                onDeleteGoal(item.id)
            }}>削除</Button>

            <div style={{ marginTop: "16px" }}>
                <h3>進捗を追加</h3>
                <TextArea
                    value={logInput}
                    onChange={(e) => setLogInput(e.target.value)}
                    placeholder="進捗ログを入力"
                />
                <Button onClick={handleAddLog}>追加</Button>
            </div>

            {/* 進捗ログ */}
            <div style={{ marginTop: "16px" }}>
                {item.progressLogs.length === 0 ? (
                    <p>まだ進捗ログはありません。</p>
                ) : (
                    item.progressLogs.map((log) => (
                        <div
                            key={log.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                borderTop: "1px solid #eee",
                                padding: "8px 0",
                            }}
                        >
                            <span>
                                {log.date}: {log.content}
                            </span>
                            <Button onClick={() => {
                                const ok = window.confirm("本当にこの進捗ログを削除しますか？");
                                if (!ok) return;
                                onDeleteLog(item.id, log.id)
                            }}>削除</Button>
                        </div>
                    ))
                )}
            </div>
        </Panel>
    );
}

export default GoalCard;