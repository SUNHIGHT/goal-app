import type { GoalStatus } from "../types/types";

type GoalFormInput = {
  title: string;
  goal: string;
  approach: string;
  status: GoalStatus;
  dueDate: string;
};

export function validateGoalForm(input: GoalFormInput) {
  const trimmedTitle = input.title.trim();
  const trimmedGoal = input.goal.trim();
  const trimmedApproach = input.approach.trim();
  const trimmedDueDate = input.dueDate.trim();

  if (trimmedTitle === "" || trimmedGoal === "" || trimmedApproach === "") {
    alert("タイトル、目標、アプローチは必須です。");
    return null;
  }

  if (trimmedDueDate !== "" && isNaN(Date.parse(trimmedDueDate))) {
    alert("期限は有効な日付形式で入力してください。");
    return null;
  }

  return {
    title: trimmedTitle,
    goal: trimmedGoal,
    approach: trimmedApproach,
    status: input.status,
    dueDate: trimmedDueDate || undefined,
  };
}