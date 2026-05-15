import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GoalCard from "../GoalCard";

const sampleItem = {
  id: "1",
  title: "案件までの準備",
  goal: "小規模なReactアプリに対して、意図を持って変更し、その結果を説明できる",
  approach: "1週目は小さい画面を作る。2週目以降で変更と確認を繰り返す",
  status: "未着手",
  progressLogs: [],
  dueDate: "2026-05-11",
};

test("ゴールカードの基本情報が表示される", () => {
  render(
    <GoalCard
      item={sampleItem}
      onDeleteGoal={vi.fn()}
      onUpdateGoal={vi.fn()}
      onAddLog={vi.fn()}
      onDeleteLog={vi.fn()}
      onAddDailyRecord={vi.fn()}
      onEdit={vi.fn()}
    />
  );

  expect(screen.getByText("案件までの準備")).toBeInTheDocument();
  expect(screen.getByText("未着手")).toBeInTheDocument();
  expect(screen.getByText("2026-05-11")).toBeInTheDocument();
});

test("編集ボタンで onEdit が呼ばれる", async () => {
  const onEdit = vi.fn();
  const user = userEvent.setup();

  render(
    <GoalCard
      item={sampleItem}
      onDeleteGoal={vi.fn()}
      onUpdateGoal={vi.fn()}
      onAddLog={vi.fn()}
      onDeleteLog={vi.fn()}
      onAddDailyRecord={vi.fn()}
      onEdit={onEdit}
    />
  );

  await user.click(screen.getByText("編集"));
  expect(onEdit).toHaveBeenCalledTimes(1);
});
