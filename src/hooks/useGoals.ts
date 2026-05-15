//カスタムフックとはstateを扱う方法の共有。
//簡単な例で言うと、二つのテーブルがあってそれぞれにStateが設定されていたとき、そのCRUD操作だけ共通化できる
//今回はitemsしかないので、stateもカスタムフック内に入れているが、これでも責務の分離になっている。
//もっと小さくまとめるとADDだけだったり、updateだけだったり、そこだけ共通化も可能に。

import { useEffect, useState } from 'react'
import type { GoalItem, GoalStatus, ProgressLog } from "./../types/types";
import { getGoals, saveGoal, deleteGoal } from './../apis/goalsApi'
import { validateGoalForm } from '../utils/validateGoalForm';

export function useGoals() {
    const [items, setItems] = useState<GoalItem[]>([])
    const [titleInput, setTitleInput] = useState("");
    const [goalInput, setGoalInput] = useState("");
    const [approachInput, setApproachInput] = useState("");
    const [statusInput, setStatusInput] = useState<GoalStatus>("未着手");
    const [duDateInput, setDueDateInput] = useState("");

    useEffect(() => {
        const fetchDatas = async () => {
            const fetchItems = await getGoals();
            setItems(fetchItems);
        }
        fetchDatas();
    }, []);
    //非同期で取得する値、つまりfetchで取得する値はPromiseという型で帰ってくる。
    //その場合はawaitで受け取る必要があるが、このawaitを利用するためにはasyncをつける必要がある。
    //awaitで受け取る場合、一回でもawaitで受け取れればそれでよいわけではなく、上記のようにapi部分、実際に値を入れる場所でもawaitしておく必要がある。
    //一回awaitすればよいってわけでもない。

    //追加処理に関して、入力値、stateともに親で管理している。子コンポーネントからは何もいらない（発火させる要因のみ）
    //そのため引数無し。
    //AddGoal以外のコンポーネントは故コンポーネント側でstate定義などを行っているため、
    //こいつも子コンポーネントで定義したほうがまとまりはよい（中小開発では子供側に持たせるのがデフォルト）
    //ただ今回は学習目的のため、addだけ親側に持たせる
    const handleAddGoal = async () => {
        const validatedInput = validateGoalForm({
            title: titleInput,
            goal: goalInput,
            approach: approachInput,
            status: statusInput,
            dueDate: duDateInput
        })

        if (!validatedInput) return;

        const newItem: GoalItem = {
            id: Date.now().toString(),
            ...validatedInput,
            progressLogs: [],
        };

        //画面上の一覧を更新するために「目標リスト」を更新
        setItems([...items, newItem]);
        //AWSのDynamoに「一件」新たに保存するため「目標」を追加。リストで追加する必要はなし。なぜならDynamoDBはNoSQLで、リスト全体を保存するのではなく、個々のアイテムを保存するから。
        await saveGoal(newItem)
        setTitleInput("");
        setGoalInput("");
        setApproachInput("");
        setDueDateInput("");
        setStatusInput("未着手");
    }

    //子コンポーネントに編集値やstateがある場合
    //親側で定義しているこれらの関数処理には、引数（updatedItem）が定義されているため、その考慮を子供側でも行う必要がある
    const handleUpdateGoal = async (updatedItem: GoalItem) => {
        setItems(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
        await saveGoal(updatedItem)
    }

    const handleDeleteGoal = async (id: string) => {
        setItems(items.filter((item) => item.id !== id));
        await deleteGoal(id)
    }

    //logだけ入力値が子コンポーネントで管理されている。（stateも）
    //よって子供からの返り値を期待して、そのあとの後続処理をここに記載する。
    const handleAddLog = async (goalId: string, content: string) => {
        const newLog: ProgressLog = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            content,
        };

        let updatedGoal: GoalItem | undefined;

        const updatedItems = items.map((item) => {
            if (item.id !== goalId) {
                return item;
            }

            updatedGoal = {
                ...item,
                progressLogs: [...item.progressLogs, newLog],
            };

            return updatedGoal;
        });

        setItems(updatedItems);

        if (updatedGoal) {
            await saveGoal(updatedGoal);
        }
    };

    const handleDeleteLog = async (goalId: string, logId: string) => {
        const targetItem = items.find((item) => (item.id === goalId))
        if (!targetItem) return;
        const updatedItem: GoalItem = {
            ...targetItem,
            progressLogs: targetItem.progressLogs.filter((log) => log.id !== logId)
        }
        setItems(items.map((item) => (item.id === goalId ? updatedItem : item)))
        await saveGoal(updatedItem);

    }

    const handleAddDailyRecord = async (goalId: string, result: "done" | "not_done") => {
        const targetItem = items.find((item) => item.id === goalId);
        const today = new Date().toISOString().split("T")[0];
        const newRecord = {
            id: Date.now().toString(),
            date: today,
            result,
        };

        if (!targetItem) return;

        const updatedItem: GoalItem = {
            ...targetItem,
            dailyRecords: [
                ...(targetItem.dailyRecords || []).filter(
                    (record) => record.date !== today
                ),
                newRecord,
            ]
        }
        setItems(items.map((item) => item.id === goalId ? updatedItem : item))
        await saveGoal(updatedItem)
    }

    const completedGoals = items.filter((item) => item.status === "完了")
    const activeGoals = items.filter((item) => item.status !== "完了")
    const overdueGoals = items.filter((item) => {

        //上記のfiler配列を見てわかる通り、{}の中は真偽値によって、配列に含めるかどうかを考える。
        const dueDate:(string | undefined) = item.dueDate
        if (!dueDate) return;
        const today = new Date();
        const due = new Date(dueDate);
        return due < today && item.status !== "完了";
    })

    return {
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
        completedGoals,
        activeGoals,
        overdueGoals
    };
}

//カスタムフックを作成する契機、粒度、仕様書の作り方あたりを知りたいな。
//富士通の案件では共通部分のロジックの仕様書は無かったと思う。
//テスト周りもキャッチアップしたいなあ。