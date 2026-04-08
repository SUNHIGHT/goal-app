import { useState } from "react";
import type { GoalItem } from "./types";
import GoalEditForm from "./GoalEditForm";
import "../App.css";

type GoalCardProps = {
    item: GoalItem;
    onDeleteGoal: (id: string) => void;
    onUpdateGoal: (updatedItem: GoalItem) => void;
    onAddLog: (goalId: string, content: string) => void;
    onDeleteLog: (goalId: string, logId: string) => void;
};

function GoalCard({
    item,
    onDeleteGoal,
    onUpdateGoal,
    onAddLog,
    onDeleteLog,
}: GoalCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [logInput, setLogInput] = useState("");

    const handleAddLog = () => {
        const trimmed = logInput.trim();
        if (trimmed === "") return;

        onAddLog(item.id, trimmed);
        setLogInput("");
    };

    const handleSave = (updatedItem: GoalItem) => {
        onUpdateGoal(updatedItem);
        setIsEditing(false);
    };

    return (
        <div
            style={{
                border: "1px solid #ccc",
                padding: "16px",
                marginBottom: "16px",
            }}
        >
            {isEditing ? (
                <GoalEditForm
                    item={item}
                    onSave={handleSave}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <>
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

                    </div>


                    <button onClick={() => setIsEditing(true)} style={{ marginRight: "8px" }}>
                        編集
                    </button>
                    <button onClick={() => {
                        const ok = window.confirm("本当にこのゴールを削除しますか？");
                        if (!ok) return;
                        onDeleteGoal(item.id)
                    }}>削除</button>

                    <div style={{ marginTop: "16px" }}>
                        <h3>進捗を追加</h3>
                        <textarea
                            value={logInput}
                            onChange={(e) => setLogInput(e.target.value)}
                            placeholder="進捗ログを入力"
                            style={{ marginRight: "8px" }}
                        />
                        <button onClick={handleAddLog}>追加</button>
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
                                    <button onClick={() => {
                                        const ok = window.confirm("本当にこの進捗ログを削除しますか？");
                                        if (!ok) return;
                                        onDeleteLog(item.id, log.id)
                                    }}>削除</button>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default GoalCard;