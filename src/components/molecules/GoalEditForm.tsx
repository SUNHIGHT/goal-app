import Panel from "../atoms/Panel"
import Button from "../atoms/Button"
import TextArea from "../atoms/TextArea"
import Input from "../atoms/Input"
import SelectBox from "../atoms/SelectBox"
import Calendar from './Calendar';
import { useGoalEdit } from '../../hooks/useGoalsEdit';
import type { GoalItem } from "../../types/types";

type GoalEditFormProps = {
    item:GoalItem
    onSave:(updatedItem:GoalItem) => void,
    onCancel:() => void;
}

function GoalEditForm({ item,onCancel,onSave }:GoalEditFormProps ) {
    
   const {
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
   } = useGoalEdit({item,onSave});

    return (
        <Panel>
            <h2>ゴールを編集</h2>
            <div style={{ marginBottom: "8px" }}>
                <Input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    placeholder="タイトル"
                    style={{ width: "100%" }}
                />
            </div>

            <div style={{ marginBottom: "8px" }}>
                <Input
                    type="text"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    placeholder="目標"
                    style={{ width: "100%" }}
                />
            </div>

            <div style={{ marginBottom: "8px" }}>
                <TextArea
                    value={approachInput}
                    onChange={(e) => setApproachInput(e.target.value)}
                    placeholder="アプローチ"
                />
            </div>

            <div style={{ marginBottom: "8px" }}>
                <SelectBox value={statusInput} onChange={(e) => setStatusInput(e.target.value as "未着手" | "進行中" | "完了")}>
                    <option value="未着手">未着手</option>
                    <option value="進行中">進行中</option>
                    <option value="完了">完了</option>
                </SelectBox>
            </div>

            <Input
                type="date"
                value={dueDateInput}
                onChange={(e) => setDueDateInput(e.target.value)}
            />
            <Calendar dueDate={dueDateInput}/>
            <Button onClick={handleSave}>保存</Button>
            <Button onClick={onCancel}>キャンセル</Button>
        </Panel>
    );
}

export default GoalEditForm;