import { useGoals } from '../../hooks/useGoals';
import Header from '../organisms/header'
import AddGoal from '../organisms/addgoal'
import Card from '../organisms/card'
import { Dashboard } from '../organisms/dashboard';
import type { GoalStatus } from "../../types/types";
import Panel from "../atoms/Panel"

export default function App() {

    const {
        items,
        titleInput,
        setTitleInput,
        goalInput,
        setGoalInput,
        approachInput,
        setApproachInput,
        statusInput,
        setStatusInput,
        duDateInput,
        setDueDateInput,
        handleAddGoal,
        handleUpdateGoal,
        handleDeleteGoal,
        handleAddLog,
        handleDeleteLog,
        handleAddDailyRecord,
    } = useGoals();

    return (
        <>
            <Header>
                アイコン、検索バー、別タブ、お知らせボタン、アカウント情報、ゴール追加ボタン
                ※Qiitaを参考にしてるa
            </Header>
            <main className="page-layout">
                <div className="page-main">
                    <Dashboard />
                      //これも「追加する」みたいなボタン押してからが良い。モーダルにしてもよいかも
                    <AddGoal
                        titleInput={titleInput}
                        onTitleChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitleInput(e.target.value)}
                        goalInput={goalInput}
                        onGoalChange={(e: React.ChangeEvent<HTMLInputElement>) => setGoalInput(e.target.value)}
                        approachInput={approachInput}
                        onApproachChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setApproachInput(e.target.value)}
                        statusInput={statusInput}
                        onStatusChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusInput(e.target.value as GoalStatus)}
                        duDateInput={duDateInput}
                        onDueDateChange={(e: React.ChangeEvent<HTMLInputElement>) => setDueDateInput(e.target.value)}
                        handleAddGoal={handleAddGoal}
                    />
                    {items.map(item => (
                        <Card
                            key={item.id}
                            item={item}
                            handleUpdateGoal={handleUpdateGoal}
                            handleDeleteGoal={handleDeleteGoal}
                            handleAddLog={handleAddLog}
                            handleDeleteLog={handleDeleteLog}
                            handleAddDailyRecord={handleAddDailyRecord}
                        />
                    ))}
                </div>
                <aside className="page-side">
                    <Panel>
                        <div className="summary-card">
                            <h2>進捗サマリー</h2>
                            <p>期限超過: 2</p>
                            <p>今週締切: 4</p>
                            <p>完了率: 62%</p>
                        </div>
                    </Panel>
                </aside>
            </main>
        </>
    );
}