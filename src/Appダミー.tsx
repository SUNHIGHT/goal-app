import { useState } from 'react';

type GoalItem = {
  id: number;
  title: string;
  goal: string;
  approach: string;
  status: "未着手" | "進行中" | "完了";
  progressLogs: ProgressLog[];
};

type ProgressLog = {
  id: number;
  date:string;
  content:string;
}

//typeは、TypeScriptで新しい型を定義するためのキーワードです。上記のコードでは、GoalItemという新しい型を定義しています。この型は、id、title、goal、approach、statusというプロパティを持ちます。idは数値型、titleは文字列型、goalは文字列型、approachは文字列型、statusは"未着手"、"進行中"、"完了"のいずれかの文字列型です。

// const sampleItems: GoalItem[] = [
//   {
//     id: 1,
//     title: "案件までの準備",
//     goal: "小規模なReactアプリに対して、意図を持って変更し、その結果を説明できる",
//     approach: "1週目は小さい画面を作る。2週目以降で変更と確認を繰り返す",
//     status: "進行中",
//   },
// ];
//(),{},[]はそれぞれなんの意味？
//()は関数の呼び出し、{}はオブジェクトの定義、[]は配列の定義
//return()は関数の戻り値の定義＝htmlは関数？
//オブジェクトとは、複数の値をまとめて管理するためのデータ構造で、キーと値のペアで構成されます。例えば、{ name: "Alice", age: 30 }はnameというキーに"Alice"という値、ageというキーに30という値が対応するオブジェクトです。
//sampleItemsは定数の為関数外でも問題ない。

function App() {
  const [items, setItems] = useState<GoalItem[]>([
  {
    id:1,
    title: "案件までの準備",
    goal: "小規模なReactアプリに対して、意図を持って変更し、その結果を説明できる",
    approach: "1週目は小さい画面を作る。2週目以降で変更と確認を繰り返す",
    status: "進行中",
    progressLogs: [
      {
        id:1,
        date:"2024-06-01",
        content:"画面のレイアウトを作成"
      },
      {
        id:2,
        date:"2024-06-02",
        content:"状態管理の実装"
      }
    ]
  }
])
//useStateは、Reactのフックの1つで、関数コンポーネント内で状態を管理するためのものです。useStateは、現在の状態の値と、その状態を更新するための関数を返します。上記のコードでは、itemsという状態変数とsetItemsという状態更新関数を定義しています。初期値として、GoalItem型の配列が渡されています。
//useStateのような状態管理を扱う場合は関数内で定義しなければならない。関数コンポーネントは、状態を持つことができるため、ユーザーの入力やAPIからのデータなど、動的なデータを扱うことができます。useStateを使用することで、状態の変更に応じてコンポーネントが再レンダリングされるため、UIが最新の状態を反映するようになります。
//const [状態, 更新関数] = useState<型>(初期値) itemsは読み取り専用の状態変数で、setItemsはその状態を更新するための関数です。初期値として、GoalItem型の配列が渡されています。これにより、itemsはGoalItem型の配列として扱われます。

const [titleInput, setTitleInput] = useState("");
const [goalInput,setGoalInput] = useState("");
const [approachInput, setApproachInput] = useState("");
const [statusInput, setStatusInput] = useState<"未着手" | "進行中" | "完了">("未着手");
const [logInputs, setLogInputs] = useState<{ [key: number]: string }>({});

return (
    <div>
      <h1>ゴールと進め方アプリ</h1>

      <input type="text"
        placeholder="タイトル"
        value={titleInput}
        onChange={(e) => setTitleInput(e.target.value)}
      />
      <input type="text"
        placeholder="目標"
        value={goalInput}
        onChange={(e) => setGoalInput(e.target.value)}
      />
      <textarea
        placeholder="アプローチ"
        value={approachInput}
        onChange={(e) => setApproachInput(e.target.value)}
      />
      <select
        value={statusInput}
        onChange={(e) => setStatusInput(e.target.value as "未着手" | "進行中" | "完了")}
      >
        <option value="未着手">未着手</option>
        <option value="進行中">進行中</option>
        <option value="完了">完了</option>
      </select>

      <button
        onClick={() => {
          if (titleInput.trim() === "") return;
          if (goalInput.trim() === "") return;
          if (approachInput.trim() === "") return;  
          if (statusInput.trim() === "") return;

          const newItem: GoalItem = {
            id: Date.now(),
            title: titleInput,
            goal: goalInput,
            approach: approachInput,
            status: statusInput,
            progressLogs: [],
          };

          setItems([...items, newItem]);
          setTitleInput("");
          setGoalInput("");
          setApproachInput("");
          setStatusInput("未着手");
        }}
      >
        追加
      </button>
      {items.map((item) => (
        <div key={item.id}>
          <h2>{item.title}</h2>
          <p>目標: {item.goal}</p>
          <p>アプローチ: {item.approach}</p>
          <p>ステータス: {item.status}</p>
          <button onClick={()=> setItems(items.filter((i)=> i.id !== item.id))}>
            削除
          </button>
          <div>
            <input type="text"
            placeholder="進捗ログを入力"
            value={logInputs[item.id]||""}
            onChange={(e)=> setLogInputs({...logInputs, [item.id]: e.target.value})}
          />
          <button onClick={()=>{
            if(!logInputs[item.id] || logInputs[item.id].trim() === "") return;
            
            const newLog: ProgressLog = {
              id: Date.now(),
              date: new Date().toISOString().split("T")[0],
              content: logInputs[item.id],
            };
            
            setItems(items.map((i)=> i.id === item.id ? {...i, progressLogs: [...i.progressLogs, newLog]} : i));
            setLogInputs({...logInputs, [item.id]: ""});
          }}>
            追加
          </button>
          </div>
          <h3>進捗ログ</h3>
          {item.progressLogs.map((log) => (
            <div key={log.id}>
              <p>{log.date}: {log.content}</p>
            </div>
          ))} 
        </div>
      ))}
    </div>
  );
}

//htmlの書き方がjsxというもの。jsxはjavascriptの中にhtmlを埋め込むことができる。jsxはjavascriptの拡張子で、jsxファイルはjavascriptファイルとして扱われる。jsxはjavascriptの中にhtmlを埋め込むことができるため、javascriptの変数や関数をhtmlの中で使用することができる。
//{sampleItem.map((item) => ( ... ))}は、sampleItemという配列の各要素に対して、指定された関数を実行し、その結果を新しい配列として返すための構文です。上記のコードでは、sampleItemの各要素をitemという変数に代入し、そのitemのプロパティを使用してHTMLを生成しています。key={item.id}は、Reactがリストを効率的に更新するために必要なキーを指定しています。キーは、リスト内の各要素が一意であることを保証するために使用されます。
//VSCodeの場合、Shift + Alt + Fでインデントを自動的に修正できます。また、右クリックして「フォーマット」を選択することもできます。


export default App;

//export defaultは、モジュールから1つの値をエクスポートするための構文です。上記のコードでは、Appという関数コンポーネントをエクスポートしています。これにより、他のファイルでAppをインポートして使用することができます。例えば、import App from './App';とすることで、Appコンポーネントを使用できるようになります。
