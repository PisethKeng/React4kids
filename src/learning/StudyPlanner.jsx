import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Link, Outlet, useParams, useSearchParams } from "react-router-dom";
import { taskReducer } from "./labs/ArchitectureLabs";
import { ResourceLab } from "./labs/AsyncLabs";
import { readStored } from "./storage";
import { useProgress } from "./Progress";

export const PLANNER_KEY = "react-workspace:planner:v1";
const PlannerContext = createContext(null);
const initialTasks = [
  { id: "first-component", title: "Build my first component", done: false },
  { id: "state-practice", title: "Practice a state update", done: false },
];
export function validTasks(value) {
  return (
    Array.isArray(value) &&
    value.every(
      (t) =>
        t &&
        typeof t.id === "string" &&
        t.id.length > 0 &&
        typeof t.title === "string" &&
        t.title.trim().length > 0 &&
        t.title.length <= 120 &&
        typeof t.done === "boolean",
    ) &&
    new Set(value.map((t) => t.id)).size === value.length
  );
}
const milestones = [
  {
    title: "Compose the interface",
    lessons: "Components, props, lists",
    check:
      "Split the list and task row into components. Render stable IDs as keys and show a useful empty state.",
    code: `function TaskRow({ task, onToggle }) {\n  return <label>\n    <input type="checkbox" checked={task.done}\n      onChange={() => onToggle(task.id)} />\n    {task.title}\n  </label>;\n}`,
  },
  {
    title: "Create and validate tasks",
    lessons: "Events, controlled forms, immutable state",
    check:
      "Reject blank titles, trim valid titles, display connected errors, and clear the input after a successful add.",
    code: `function submit(event) {\n  event.preventDefault();\n  if (!title.trim()) { setError('Enter a task title.'); return; }\n  onAdd(title.trim());\n  setTitle('');\n}`,
  },
  {
    title: "Coordinate and persist state",
    lessons: "Reducers, Context, custom hooks, Effects",
    check:
      "Add, toggle, edit, and delete with reducer actions. Share state through a provider. Reload to verify persistence and handle unavailable storage.",
    code: `const [tasks, dispatch] = useReducer(taskReducer, [], loadSavedTasks);\nuseEffect(() => {\n  try { localStorage.setItem(storageKey, JSON.stringify(tasks)); }\n  catch { setStorageError(true); }\n}, [tasks]);`,
  },
  {
    title: "Give the app a URL",
    lessons: "Nested routes, route parameters, search parameters",
    check:
      "Open a task detail URL directly. Use a URL filter for all/open/done tasks and show a missing-task message for unknown IDs.",
    code: `<Route path="tasks" element={<TaskList />} />\n<Route path="tasks/:taskId" element={<TaskDetail />} />\n// Read URL state:\nconst { taskId } = useParams();\nconst [search, setSearch] = useSearchParams();`,
  },
  {
    title: "Verify and recover",
    lessons: "Async requests, cleanup, behavior testing",
    check:
      "Exercise loading, empty, error, and retry states. Test blank submission, adding/editing a task, filtering, missing IDs, and stale-response protection.",
    code: `render(<PlannerWithProviders />);\nuserEvent.type(screen.getByLabelText('New task title'), 'Study effects');\nuserEvent.click(screen.getByRole('button', { name: 'Add task' }));\nexpect(screen.getByRole('link', { name: 'Study effects' })).toBeInTheDocument();`,
  },
];
export default function StudyPlanner() {
  const [tasks, dispatch] = useReducer(taskReducer, null, () =>
    readStored(PLANNER_KEY, initialTasks, validTasks),
  );
  const [storageError, setStorageError] = useState(false);
  const { state, dispatch: progressDispatch } = useProgress();
  useEffect(() => {
    try {
      localStorage.setItem(PLANNER_KEY, JSON.stringify(tasks));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [tasks]);
  return (
    <PlannerContext.Provider value={{ tasks, dispatch }}>
      <div className="page-container">
        <div className="project-header">
          <span className="eyebrow">THE CAPSTONE / FROM IDEAS TO AN APP</span>
          <h1>Build your Study Planner.</h1>
          <p className="lead">
            A small application with the patterns that make bigger ones work.
          </p>
          <p>
            Use the working reference below, then recreate it in your own React
            project. Follow the milestones, use the starter excerpts, and verify
            each behavior.
          </p>
          <Link to="/learn/components">Review the learning path →</Link>
        </div>
        <div className="project-grid">
          <section className="panel planner-reference">
            <span className="eyebrow">WORKING REFERENCE</span>
            <h2>My study tasks</h2>
            {storageError && (
              <p role="status">
                Storage is unavailable. Task changes last only for this visit.
              </p>
            )}
            <p>
              {tasks.filter((t) => !t.done).length} remaining ·{" "}
              {tasks.filter((t) => t.done).length} complete
            </p>
            <nav aria-label="Planner navigation" className="button-row">
              <Link to="/project/study-planner/tasks">Task list</Link>
            </nav>
            <Outlet />
          </section>
          <section className="panel milestone-panel">
            <span className="eyebrow">YOUR BUILD CHECKLIST</span>
            <h2>Five connected milestones.</h2>
            <p>
              Self-reviewed: these ticks record your review, not an automatic
              code assessment.
            </p>
            {milestones.map((milestone, i) => (
              <details key={milestone.title} open={i === 0 ? true : undefined}>
                <summary>
                  {i + 1}. {milestone.title}
                  {state.milestones.includes(i) && " ✓"}
                </summary>
                <p className="muted">{milestone.lessons}</p>
                <p>{milestone.check}</p>
                <pre>
                  <code>{milestone.code}</code>
                </pre>
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={state.milestones.includes(i)}
                    onChange={() =>
                      progressDispatch({ type: "milestone", index: i })
                    }
                  />
                  I built and reviewed this milestone
                </label>
              </details>
            ))}
            <p role="status">
              {state.milestones.length}/5 milestones self-reviewed
            </p>
          </section>
        </div>
        <section className="panel">
          <span className="eyebrow">ASYNC RESOURCE PANEL</span>
          <h2>Practice loading and recovery.</h2>
          <ResourceLab />
        </section>
      </div>
    </PlannerContext.Provider>
  );
}
export function PlannerList() {
  const { tasks, dispatch } = useContext(PlannerContext);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useSearchParams();
  const filter = ["open", "done"].includes(search.get("filter"))
    ? search.get("filter")
    : "all";
  const visible = tasks.filter(
    (t) => filter === "all" || (filter === "done" ? t.done : !t.done),
  );
  function submit(event) {
    event.preventDefault();
    if (!title.trim()) {
      setError("Enter a task title.");
      return;
    }
    const id =
      typeof window.crypto?.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    dispatch({ type: "add", task: { id, title: title.trim(), done: false } });
    setTitle("");
    setError("");
    setMessage("Task added.");
  }
  return (
    <>
      <form onSubmit={submit} noValidate>
        <label htmlFor="new-task-title">New task title</label>
        <input
          id="new-task-title"
          value={title}
          maxLength={120}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "new-task-error" : undefined}
        />
        {error && (
          <p className="error-text" role="alert" id="new-task-error">
            {error}
          </p>
        )}
        <button>Add task</button>
      </form>
      <p role="status">{message}</p>
      <label>
        Filter tasks
        <select
          value={filter}
          onChange={(e) => {
            const next = new URLSearchParams(search);
            if (e.target.value === "all") next.delete("filter");
            else next.set("filter", e.target.value);
            setSearch(next);
          }}
        >
          <option value="all">All tasks</option>
          <option value="open">Open tasks</option>
          <option value="done">Completed tasks</option>
        </select>
      </label>
      <ul className="task-list">
        {visible.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              aria-label={"Complete " + task.title}
              checked={task.done}
              onChange={() => dispatch({ type: "toggle", id: task.id })}
            />
            <Link
              className={task.done ? "task-done" : ""}
              to={"/project/study-planner/tasks/" + encodeURIComponent(task.id)}
            >
              {task.title}
            </Link>
            <span aria-hidden="true">↗</span>
          </li>
        ))}
      </ul>
      {!visible.length && (
        <p className="empty-state">
          No tasks in this view. Add a task or choose another filter.
        </p>
      )}
    </>
  );
}
export function PlannerDetail() {
  const { taskId } = useParams();
  const { tasks, dispatch } = useContext(PlannerContext);
  const task = tasks.find((t) => t.id === taskId);
  return task ? (
    <TaskEditor key={task.id} task={task} dispatch={dispatch} />
  ) : (
    <>
      <h3>Task not found</h3>
      <p>It may have been deleted or the link may be incorrect.</p>
      <Link to="/project/study-planner/tasks">Back to tasks</Link>
    </>
  );
}
function TaskEditor({ task, dispatch }) {
  const [title, setTitle] = useState(task.title);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <h3>Task details</h3>
      <p className="muted">
        Route parameter: <code>{task.id}</code>
      </p>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) {
            setError("Enter a task title.");
            return;
          }
          dispatch({ type: "edit", id: task.id, title: title.trim() });
          setTitle(title.trim());
          setError("");
          setSaved(true);
        }}
      >
        <label htmlFor="edit-task-title">Edit task title</label>
        <input
          id="edit-task-title"
          maxLength={120}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setSaved(false);
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "edit-error" : undefined}
        />
        {error && (
          <p role="alert" id="edit-error" className="error-text">
            {error}
          </p>
        )}
        <button>Save changes</button>
        {saved && <p role="status">Changes saved.</p>}
      </form>
      <label className="check-label">
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => dispatch({ type: "toggle", id: task.id })}
        />
        Task complete
      </label>
      <div className="button-row">
        {confirm ? (
          <>
            <button onClick={() => dispatch({ type: "delete", id: task.id })}>
              Confirm delete task
            </button>
            <button className="secondary" onClick={() => setConfirm(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button className="secondary" onClick={() => setConfirm(true)}>
            Delete task…
          </button>
        )}
        <Link to="/project/study-planner/tasks">Back to tasks</Link>
      </div>
    </>
  );
}
