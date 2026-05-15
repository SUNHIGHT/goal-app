//編集フォーム内部ロジック・・・入力・保存処理

import { useState } from 'react';
import type { GoalItem } from '../types/types';
import { validateGoalForm } from '../utils/validateGoalForm';

type useGoalEditProps = {
    item: GoalItem;
    onSave: (updatedItem: GoalItem) => void;
};

export function useGoalEdit({ item, onSave }: useGoalEditProps) {
    const [titleInput, setTitleInput] = useState(item.title);
    const [goalInput, setGoalInput] = useState(item.goal);
    const [approachInput, setApproachInput] = useState(item.approach);
    const [statusInput, setStatusInput] = useState(item.status);
    const [dueDateInput, setDueDateInput] = useState(item.dueDate || "");

    const handleSave = () => {

        const validatedInput = validateGoalForm({
            title: titleInput,
            goal: goalInput,
            approach: approachInput,
            status: statusInput,
            dueDate: dueDateInput
        })

        if(!validatedInput) return;

        onSave({
            //既存itemの上書き
            ...item,
            ...validatedInput
        });
    };
    return {

        titleInput,
        setTitleInput,

        goalInput,
        setGoalInput,

        approachInput,
        setApproachInput,

        statusInput,
        setStatusInput,

        dueDateInput,
        setDueDateInput,

        handleSave
    };
}