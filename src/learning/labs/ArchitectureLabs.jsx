import React, {
  createContext,
  useContext,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  Link,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Snapshot, Tree } from "./BasicLabs";

export function taskReducer(state, action) {
  switch (action.type) {
    case "add":
      return [...state, action.task];
    case "toggle":
      return state.map((t) =>
        t.id === action.id ? { ...t, done: !t.done } : t,
      );
    case "edit":
      return state.map((t) =>
        t.id === action.id ? { ...t, title: action.title } : t,
      );
    case "delete":
      return state.filter((t) => t.id !== action.id);
    case "reset":
      return [];
    default:
      return state;
  }
}
export function ReducerLab({ onExplore }) {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [history, setHistory] = useState([]);
  const nextId = useRef(1);
  function send(action) {
    const next = taskReducer(tasks, action);
    setHistory((h) => [...h.slice(-4), { action, before: tasks, after: next }]);
    dispatch(action);
    onExplore();
  }
  return (
    <>
      <div className="button-row">
        <button
          onClick={() => {
            const id = nextId.current++;
            send({
              type: "add",
              task: { id, title: "Study task " + id, done: false },
            });
          }}
        >
          Dispatch add
        </button>
        <button className="secondary" onClick={() => send({ type: "reset" })}>
          Dispatch reset
        </button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id}>
            <label className="check-label">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => send({ type: "toggle", id: task.id })}
              />
              {task.title}
            </label>
          </li>
        ))}
      </ul>
      {!tasks.length && <p>No tasks. Dispatch an add action.</p>}
      <h3>Action history · last 5</h3>
      {history.map((entry, i) => (
        <details key={i} open={i === history.length - 1}>
          <summary>
            {i + 1}. {entry.action.type}
          </summary>
          <pre>{JSON.stringify(entry.action, null, 2)}</pre>
          <Snapshot before={entry.before} after={entry.after} />
        </details>
      ))}
    </>
  );
}
const TopicContext = createContext(null);
function topicReducer(topic, action) {
  return action.type === "select" ? action.topic : topic;
}
function TopicPicker({ onExplore }) {
  const { topic, dispatch } = useContext(TopicContext);
  return (
    <label>
      Topic consumer A
      <select
        value={topic}
        onChange={(e) => {
          dispatch({ type: "select", topic: e.target.value });
          onExplore();
        }}
      >
        <option>JSX</option>
        <option>State</option>
        <option>Effects</option>
      </select>
    </label>
  );
}
function TopicPreview() {
  const { topic } = useContext(TopicContext);
  return (
    <div className="demo-card">
      Consumer B is studying <strong>{topic}</strong>.
    </div>
  );
}
export function ContextLab({ onExplore }) {
  const [topic, dispatch] = useReducer(topicReducer, "JSX");
  return (
    <TopicContext.Provider value={{ topic, dispatch }}>
      <TopicPicker onExplore={onExplore} />
      <TopicPreview />
      <Tree
        nodes={[
          "TopicProvider: topic = " + topic,
          "Consumer A dispatches a select action",
          "Consumer B reads the nearest provider",
        ]}
      />
    </TopicContext.Provider>
  );
}
function ExplorerLayout() {
  const location = useLocation();
  return (
    <>
      <p>
        Current URL:{" "}
        <code>
          {location.pathname}
          {location.search}
        </code>
      </p>
      <p>
        Parent layout → <strong>Outlet below</strong>
      </p>
      <Outlet />
    </>
  );
}
function ExplorerList() {
  const [search, setSearch] = useSearchParams();
  const open = search.get("filter") === "open";
  return (
    <>
      <label>
        URL filter
        <select
          value={open ? "open" : "all"}
          onChange={(e) =>
            setSearch(e.target.value === "open" ? { filter: "open" } : {})
          }
        >
          <option value="all">All tasks</option>
          <option value="open">Open tasks</option>
        </select>
      </label>
      <ul>
        <li>
          <Link to="1">Learn JSX · open</Link>
        </li>
        {!open && (
          <li>
            <Link to="2">Read about state · complete</Link>
          </li>
        )}
      </ul>
    </>
  );
}
function ExplorerDetail() {
  const { taskId } = useParams();
  return (
    <>
      <h3>
        {taskId === "1"
          ? "Learn JSX"
          : taskId === "2"
            ? "Read about state"
            : "Task not found"}
      </h3>
      <p>
        useParams(): <code>{JSON.stringify({ taskId })}</code>
      </p>
      <Link to=".." relative="path">
        Back to explorer tasks
      </Link>
    </>
  );
}
export function RoutingLab({ onExplore }) {
  return (
    <div onClick={onExplore} onChange={onExplore}>
      <p className="badge">Real nested routes inside this lesson</p>
      <Link className="button-link" to="/learn/routing/tasks">
        Open task explorer
      </Link>
      <Routes>
        <Route path="tasks" element={<ExplorerLayout />}>
          <Route index element={<ExplorerList />} />
          <Route path=":taskId" element={<ExplorerDetail />} />
        </Route>
        <Route
          path="*"
          element={
            <p>Open the explorer to see URL state and nested screens.</p>
          }
        />
      </Routes>
    </div>
  );
}
