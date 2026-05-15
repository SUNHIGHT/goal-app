import { useState } from 'react'
import './Calendar.css'
import Button from '../atoms/Button'

type CalendarProps = {
    dueDate: string;
}

export default function Calendar({ dueDate }: CalendarProps) {
   // ========================================
  // 1. 今日の日付情報
  // ========================================
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  // ========================================
  // 2. 表示中のカレンダー年月
  // ========================================
  // useStateを利用してカレンダー月変更処理を作る
  // hasNext,hasPrevなど公式ドキュメントで勉強した内容が出る
  const [displayYear, setDisplayYear] = useState(currentYear);
  const [displayMonth, setDisplayMonth] = useState(currentMonth);

  const hasNext = displayMonth < 12;
  const hasPrev = displayMonth > 1;

  function nextMonth() {
    if (hasNext) {
      setDisplayMonth(displayMonth + 1);
      return;
    }

    setDisplayMonth(1);
    setDisplayYear(displayYear + 1);
  }

  function prevMonth() {
    if (hasPrev) {
      setDisplayMonth(displayMonth - 1);
      return;
    }

    setDisplayMonth(12);
    setDisplayYear(displayYear - 1);
  }

  //これに応じてカレンダー日付の表示も変えたい。

  // ========================================
  // 3. 表示中の月の日付セルを作成
  // ========================================

  //セットしたその月の全日数を取得する
  const lastDayOfMonth = new Date(displayYear, displayMonth, 0);
  const days = lastDayOfMonth.getDate();

  //セットしたその月の初日の曜日を取得する
  const firstDay = new Date(displayYear, displayMonth - 1, 1); //日にち
  const firstWeekdayCount = firstDay.getDay(); //曜日※数値で帰ってくる

  //空白と全日分の配列をつなげて表示用セルを作る
  // null: 月初前の空白セル
  // number: 実際の日付
  const calendarCells: (number | null)[] = [];

  for (let i = 0; i < firstWeekdayCount; i++) {
    calendarCells.push(null);
  }

  for (let i = 0; i < days; i++) {
    calendarCells.push(i + 1);
  }

  // ========================================
  // 4. 今日・締切日の判定準備
  // ========================================

  //本日の判定処理
  //今日を指示するにはyear,monthの今日であるという判定処理も追加必要
  const isToday = displayYear === currentYear && displayMonth === currentMonth;

  //締め切り日の関係計算
  const [dueYear, dueMonth, dueDay] = dueDate.split("-").map(Number);

  const isOverDue =
    dueYear < currentYear ||
    (dueYear === currentYear && dueMonth < currentMonth) ||
    (dueYear === currentYear &&
      dueMonth === currentMonth &&
      dueDay < currentDay);

  // 締切日が表示中の月にあるか
  const isDueDay = displayYear === dueYear && displayMonth === dueMonth;

  // Date型は比較可能なので、今日と締切日をDateとして用意する
  const todayOnly = new Date(currentYear, currentMonth - 1, currentDay);
  const dueOnly = new Date(dueYear, dueMonth - 1, dueDay);

  // 残り日数の表示
  let remainingDays = 0;

  if (!isOverDue) {
    //締切日から今日までの差分の日数を算出する計算式
    const diffMs = dueOnly.getTime() - todayOnly.getTime();
    remainingDays = diffMs / (1000 * 60 * 60 * 24);
  }

  return (
    <div className="calendar">
      <h3>カレンダー</h3>

      {displayYear}年{displayMonth}月

      <Button onClick={prevMonth}>Previous</Button>
      <Button onClick={nextMonth}>Next</Button>

      残り{remainingDays}日

      <br />

      <div className="calendar-grid">
        {["日", "月", "火", "水", "木", "金", "土"].map((week) => (
          <div className="calendar-week" key={week}>
            {week}
          </div>
        ))}

        {calendarCells.map((day, index) => {
          // 分解したdayの条件分けは、mapの中でさらに定義することで可能になる。

          const isTodayCell =
            day !== null &&
            isToday &&
            day === currentDay;

          const isDueDayCell =
            day !== null &&
            isDueDay &&
            day === dueDay;

          //そのセルが表す日付のDate化(Date型は比較可能)
          const cellDate =
            day !== null
              ? new Date(displayYear, displayMonth - 1, day)
              : null;

          // 残り日数の表示にはDate型で比較可能なので、
          // それをセルごとに判定処理し、当てはまったら色を変える
          const isRange =
            cellDate !== null &&
            cellDate >= todayOnly &&
            cellDate <= dueOnly;

          // cssのclassNameも条件分けが可能
          // 本日の判定、締切日の判定処理はほぼ共通
          // セルごとの日付を、本日か、締め切りか、その間か、
          // のように判定すればもっと分かりやすくなる。リファクタリング可能。
          return (
            <div
              className={
                isTodayCell
                  ? "calendar-cell today"
                  : isDueDayCell
                    ? "calendar-cell dueDay"
                    : isRange
                      ? "calendar-cell range"
                      : "calendar-cell"
              }
              key={index}
            >
              {/* {day ?? ""}はdayがnullなら空文字、入ってたらそれ。day !== null ? day : "" */}
              {day ?? ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}


/*
カレンダー作成の手順
1. 今日の日付から、現在の年・月・日を取得する
2. new Date(year, month, 0) で、その月の最終日を取得する
   - getDate() すると、その月の日数になる
3. new Date(year, month - 1, 1) で、その月の1日を取得する
4. getDay() で、その月の1日が何曜日かを取得する
   - 0: 日曜, 1: 月曜, ..., 6: 土曜
5. 1日の曜日の数だけ、先頭に null を入れる
   - 例: 金曜始まりなら null を5個入れる
6. その後ろに 1〜月末日までの日付を入れる
7. CSS Gridで7列表示にする
8.Gridの中に曜日と日付を入れる
8. 今日の日付だけ表示を変える
*/

//月変更、今日日付の色変更、ボタン押下可能、ホバー操作、とかかなできること

//useStateを利用してカレンダー月変更処理を作る
//hasNext,hasPrevなど公式ドキュメントで勉強した内容が出る
//今日を指示するにはyear,monthの今日であるという判定処理も追加必要
//{day ?? ""}はdayがnullなら空文字、入ってたらそれ。day !== null ? day : ""
//cssのclassNameも条件分けが可能
//分解したdayの条件分けは、mapの中でさらに定義することで可能になる。
//本日の判定、締切日の判定処理はほぼ共通
//残り日数の表示にはDate型で比較可能なので、それをセルごとに判定処理し、当てはまったら色を変える
//セルごとの日付を、本日か、締め切りか、その間か、のように判定すればもっと分かりやすくなる。リファクタリング可能。