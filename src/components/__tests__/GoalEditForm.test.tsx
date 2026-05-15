import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GoalEditForm from "../GoalEditForm";

const sampleItem = {
  id: "1",
  title: "案件までの準備",
  goal: "小規模なReactアプリに対して、意図を持って変更し、その結果を説明できる",
  approach: "1週目は小さい画面を作る。2週目以降で変更と確認を繰り返す",
  status: "未着手",
  progressLogs: [],
  dueDate: "2026-05-11",
};

test("初期値がフォームに表示される", () => {
  render(<GoalEditForm item={sampleItem} onSave={vi.fn()} onCancel={vi.fn()} />);

  expect(screen.getByPlaceholderText("タイトル")).toHaveValue(sampleItem.title);
  expect(screen.getByPlaceholderText("目標")).toHaveValue(sampleItem.goal);
  expect(screen.getByPlaceholderText("アプローチ")).toHaveValue(sampleItem.approach);
  expect(screen.getByDisplayValue("未着手")).toBeInTheDocument();
  expect(screen.getByDisplayValue("2026-05-11")).toBeInTheDocument();
});

test("保存ボタンで onSave が呼ばれる", async () => {
  const onSave = vi.fn();
  const user = userEvent.setup();

  render(<GoalEditForm item={sampleItem} onSave={onSave} onCancel={vi.fn()} />);

  await user.clear(screen.getByPlaceholderText("タイトル"));
  await user.type(screen.getByPlaceholderText("タイトル"), "更新後タイトル");
  await user.click(screen.getByText("保存"));

  expect(onSave).toHaveBeenCalledTimes(1);
  expect(onSave.mock.calls[0][0].title).toBe("更新後タイトル");
});
