import type { GoalStatus } from "../../types/types";
import Panel from "../atoms/Panel"
import Button from "../atoms/Button"
import TextArea from "../atoms/TextArea"
import Input from "../atoms/Input"
import SelectBox from "../atoms/SelectBox"

type AddGoalProps = {
  titleInput: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  goalInput: string;
  onGoalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  approachInput: string;
  onApproachChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  statusInput: GoalStatus;
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  duDateInput: string;
  onDueDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddGoal: () => void;
  //子コンポーネントに処理（複数）を渡す場合、propsオブジェクトと言って、({,,,})のような形で渡す。
  //親側でも型推論する必要があるし、受け取る側でもどういう型でやってくるのかを明示する必要あり。
  //handleGoalについては、今回state,入力内容すべて親で管理しているため、子供側は「発火した」という情報だけを伝える。
  //よって引数必要なし。
}

export default function AddGoal({
    titleInput,
    onTitleChange,
    goalInput,
    onGoalChange,
    approachInput,
    onApproachChange,
    statusInput,
    onStatusChange,
    duDateInput,
    onDueDateChange,
    handleAddGoal,
}:AddGoalProps) {

    return (
        <Panel>
            <h2>新しいゴールを追加</h2>

            <div style={{ marginBottom: "8px" }}>
                <Input
                    type="text"
                    placeholder="タイトル"
                    value={titleInput}
                    onChange={onTitleChange}
                    style={{ width: "100%" }}
                />
            </div>

            <div style={{ marginBottom: "8px" }}>
                <Input
                    type="text"
                    placeholder="目標"
                    value={goalInput}
                    onChange={onGoalChange}
                    style={{ width: "100%" }}
                />
            </div>

            <div style={{ marginBottom: "8px" }}>
                <TextArea
                    className="approach-textarea"
                    placeholder="アプローチ"
                    value={approachInput}
                    onChange={onApproachChange}
                />
            </div>

            <div style={{ marginBottom: "8px" }}>
                <SelectBox
                    value={statusInput}
                    onChange={onStatusChange}
                >
                    <option value="未着手">未着手</option>
                    <option value="進行中">進行中</option>
                    <option value="完了">完了</option>
                </SelectBox>
            </div>

            <div style={{ marginBottom: "8px" }}>
                <Input type="date"
                    value={duDateInput}
                    onChange={onDueDateChange}
                >
                </Input>
            </div>

            <Button onClick={handleAddGoal}>追加</Button>
        </Panel>
    );
}