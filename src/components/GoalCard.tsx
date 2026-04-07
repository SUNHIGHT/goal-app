import { useState } from "react";
import type { GoalItem } from "./types";
import GoalEditForm from "./GoalEditForm";

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
                    <h2>{item.title}</h2>
                    <p>目標: {item.goal}</p>
                    <p>アプローチ: {item.approach}</p>
                    <p>ステータス: {item.status}</p>
                    <p>期限：{item.dueDate || "未設定" }</p>
                    
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

                    <div style={{ marginTop: "16px" }}>
                        <h3>進捗ログ</h3>
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