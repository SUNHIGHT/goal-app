import { useEffect, useState } from "react";
import type { GoalItem, ProgressLog, GoalStatus } from "./components/types";
import GoalCard from "./components/GoalCard";

const API_URL = "https://zzl6x53gbn7vx5grg2ysl5bigy0vramv.lambda-url.ap-northeast-1.on.aws/"

const STORAGE_KEY = "goal-app-items";

function App() {
    const [items, setItems] = useState<GoalItem[]>(() => {
        const savedItems = localStorage.getItem(STORAGE_KEY);

        if (savedItems) {
            return JSON.parse(savedItems);
        }

        return [
            {
                id: 1,
                title: "案件までの準備",
                goal: "小規模なReactアプリに対して、意図を持って変更し、その結果を説明できる",
                approach: "1週目は小さい画面を作る。2週目以降で変更と確認を繰り返す",
                status: "進行中",
                progressLogs: [],
            },
        ];
    });

    const [titleInput, setTitleInput] = useState("");
    const [goalInput, setGoalInput] = useState("");
    const [approachInput, setApproachInput] = useState("");
    const [statusInput, setStatusInput] = useState<GoalStatus>("未着手");

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch(API_URL);
                const data = await res.json();
                setItems(data);
            } catch (error) {
                console.error("データの取得に失敗しました:", error);
            }
        }
        fetchItems();
    }, []);

    const saveItemToAws = async (item: GoalItem) => {
        try {
            await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(item),
            });
        } catch (error) {
            console.error("データの保存に失敗しました:", error);
        }
    };

    const handleAddGoal = async () => {
        const trimmedTitle = titleInput.trim();
        const trimmedGoal = goalInput.trim();
        const trimmedApproach = approachInput.trim();

        if (trimmedTitle === "") return;
        if (trimmedGoal === "") return;
        if (trimmedApproach === "") return;

        const newItem: GoalItem = {
            id: Date.now().toString(),
            title: trimmedTitle,
            goal: trimmedGoal,
            approach: trimmedApproach,
            status: statusInput,
            progressLogs: [],
        };

        setItems([...items, newItem]);
        await saveItemToAws(newItem);

        setTitleInput("");
        setGoalInput("");
        setApproachInput("");
        setStatusInput("未着手");
    };


    const deleteItemFromAws = async (id: string) => {
        try {
            await fetch(API_URL, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });
        } catch (error) {
            console.error("データの削除に失敗しました:", error);
        }
    };
    const handleDeleteGoal = async (id: string) => {
        setItems(items.filter((item) => item.id !== id));
        await deleteItemFromAws(id);
    };

    const handleUpdateGoal = async (updatedItem: GoalItem) => {
        setItems(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
        await saveItemToAws(updatedItem);
    };

    const handleAddLog = (goalId: string, content: string) => {
        const newLog: ProgressLog = {
            id: Date.now().toString(),
            date: new Date().toISOString().split("T")[0],
            content,
        };

        setItems(
            items.map((item) =>
                item.id === goalId
                    ? {
                        ...item,
                        progressLogs: [...item.progressLogs, newLog],
                    }
                    : item
            )
        );
    };

    const handleDeleteLog = (goalId: string, logId: string) => {
        setItems(
            items.map((item) =>
                item.id === goalId
                    ? {
                        ...item,
                        progressLogs: item.progressLogs.filter((log) => log.id !== logId),
                    }
                    : item
            )
        );
    };

    return (
        <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
            <h1>ゴールと進め方アプリ</h1>

            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "16px",
                    marginBottom: "24px",
                }}
            >
                <h2>新しいゴールを追加</h2>

                <div style={{ marginBottom: "8px" }}>
                    <input
                        type="text"
                        placeholder="タイトル"
                        value={titleInput}
                        onChange={(e) => setTitleInput(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </div>

                <div style={{ marginBottom: "8px" }}>
                    <input
                        type="text"
                        placeholder="目標"
                        value={goalInput}
                        onChange={(e) => setGoalInput(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </div>

                <div style={{ marginBottom: "8px" }}>
                    <textarea
                        placeholder="アプローチそのに"
                        value={approachInput}
                        onChange={(e) => setApproachInput(e.target.value)}
                        style={{ width: "100%" }}
                     />
                </div>

                <div style={{ marginBottom: "8px" }}>
                    <select
                        value={statusInput}
                        onChange={(e) => setStatusInput(e.target.value as GoalStatus)}
                    >
                        <option value="未着手">未着手</option>
                        <option value="進行中">進行中</option>
                        <option value="完了">完了</option>
                    </select>
                </div>

                <button onClick={handleAddGoal}>追加</button>
            </div>

            {items.map((item) => (
                <GoalCard
                    key={item.id}
                    item={item}
                    onDeleteGoal={handleDeleteGoal}
                    onUpdateGoal={handleUpdateGoal}
                    onAddLog={handleAddLog}
                    onDeleteLog={handleDeleteLog}
                />
            ))}
        </div>
    );
}

export default App;

//子は親のデータを直接変えることが出来ないのでpropsで関数を渡して、子から親のデータを更新する必要がある