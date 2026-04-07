//受け取るものは三つ item,onSave,onCancel
import { useState } from 'react';
import type {GoalItem} from './types';

type GoalEditFormProps = {
    item: GoalItem;
    onSave: (updatedItem: GoalItem) => void;
    onCancel: () => void;
};

function GoalEditForm({ item, onSave, onCancel }: GoalEditFormProps) {
    const [title, setTitle] = useState(item.title);
    const [goal, setGoal] = useState(item.goal);
    const [approach, setApproach] = useState(item.approach);
    const [status, setStatus] = useState(item.status);
    const [dueDate, setDueDate] = useState(item.dueDate || "");

    const handleSave = () => {
        const trimmedTitle = title.trim();
        const trimmedGoal = goal.trim();
        const trimmedApproach = approach.trim();
        if (trimmedTitle === "" || trimmedGoal === "" || trimmedApproach === "") {
            alert("タイトル、目標、アプローチは必須です。");
            return;
        }

        onSave({
            ...item,
            title: trimmedTitle,
            goal: trimmedGoal,
            approach: trimmedApproach,
            status,
        });
    };

    return (
        <div>
            <h2>ゴールを編集</h2>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="タイトル"
            />
            <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="目標"
            />
            <textarea
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
                placeholder="アプローチ"
            />
            <select value={status} onChange={(e) => setStatus(e.target.value as "未着手" | "進行中" | "完了")}>
                <option value="未着手">未着手</option>
                <option value="進行中">進行中</option>
                <option value="完了">完了</option>
            </select>
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
            />
            <button onClick={handleSave}>保存</button>
            <button onClick={onCancel}>キャンセル</button>
        </div>
    );
}

export default GoalEditForm;