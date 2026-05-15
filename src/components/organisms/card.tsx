import { useState } from 'react'
import type { GoalItem } from "../../types/types";
import GoalCard from "../molecules/GoalCard";
import GoalEditForm from "../molecules/GoalEditForm";

//()は引数無し, => ()は戻り値なしという意味
type CardProps = {
    item:GoalItem
    handleUpdateGoal:(updatedItem:GoalItem) => void
    handleDeleteGoal:(id:string) => void
    handleAddLog:(goalId:string, content:string) => void
    handleDeleteLog:(goalId:string,logId:string)=> void
    handleAddDailyRecord:(goalId:string, result:"done" | "not_done")=> void
}

export default function Card({
    item,
    handleUpdateGoal,
    handleDeleteGoal,
    handleAddLog,
    handleDeleteLog,
    handleAddDailyRecord
}:CardProps) {

    const [editingId, setEditingId] = useState<string | null>(null);

    return (
        <>
        {editingId === item.id ? (
                    <GoalEditForm
                        key={item.id}
                        item={item}
                        onSave={handleUpdateGoal}
                        onCancel={() => setEditingId(null)}
                    />
                ) : (
                    <GoalCard
                        key={item.id}
                        item={item}
                        onDeleteGoal={handleDeleteGoal}
                        onUpdateGoal={handleUpdateGoal}
                        onAddLog={handleAddLog}
                        onDeleteLog={handleDeleteLog}
                        onAddDailyRecord={handleAddDailyRecord}
                        onEdit={() => setEditingId(item.id)}
                    />
                )
        }    
        </>
     //mapによる波かっこだけも駄目なので要素を入れておく
    );
}