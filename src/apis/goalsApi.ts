import type { GoalItem } from "../types/types";

const API_URL = "https://zzl6x53gbn7vx5grg2ysl5bigy0vramv.lambda-url.ap-northeast-1.on.aws/"
const STORAGE_KEY = "goal-app-items";

export async function getGoals():Promise<GoalItem[]>{
    try{
        const res = await fetch(API_URL)
        if(!res.ok){
            throw new Error("取得失敗")
        }
        const data = res.json();
        return data;
    }catch(error){
        console.error("データ取得失敗",error);
        throw error;
    }
}

export async function saveGoal(item:GoalItem){
    try{
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
      if (!res.ok) {
      throw new Error("保存失敗");
    }
  } catch (error) {
    console.error("データ保存失敗:", error);
    throw error;
  }
}

export async function deleteGoal(id: string) {
  try {
    const res = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      throw new Error("削除失敗");
    }
  } catch (error) {
    console.error("削除失敗:", error);
    throw error;
  }
}

