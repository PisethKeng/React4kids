import React, { useRef, useState } from "react";
import { useStoredState } from "../storage";

export function Tree({ nodes }) {
  return (
    <ol className="component-tree" aria-label="Component data flow">
      {nodes.map((node, i) => (
        <li key={i}>
          <span className="tree-index">{i + 1}</span>
          <span>{node}</span>
          {i < nodes.length - 1 && (
            <span className="tree-arrow" aria-hidden="true">
              ↓
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
export function Snapshot({ before, after }) {
  return (
    <div className="snapshot-grid">
      <div>
        <span className="eyebrow">Before event</span>
        <pre>{JSON.stringify(before, null, 2)}</pre>
      </div>
      <div>
        <span className="eyebrow">After event</span>
        <pre>{JSON.stringify(after, null, 2)}</pre>
      </div>
    </div>
  );
}
function Greeting({ name }) {
  return <h3>Hello, {name || "learner"}!</h3>;
}
function Profile({ name, onThank, children }) {
  return (
    <article className="demo-card">
      <h3>{name || "Learner"}</h3>
      {children}
      <button onClick={onThank}>Send thanks</button>
    </article>
  );
}
export function ComponentsLab({ onExplore, propsMode = false }) {
  const [name, setName] = useState("Ada");
  const [thanks, setThanks] = useState(0);
  return (
    <>
      <label>
        Learner name
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            onExplore();
          }}
        />
      </label>
      {propsMode ? (
        <Profile
          name={name}
          onThank={() => {
            setThanks((n) => n + 1);
            onExplore();
          }}
        >
          <p>Thanks received: {thanks}</p>
        </Profile>
      ) : (
        <Greeting name={name} />
      )}
      <Tree
        nodes={[
          "Parent owns name: " + (name || "(empty)"),
          "name prop flows down → " + (propsMode ? "Profile" : "Greeting"),
          propsMode
            ? "onThank callback requests a parent update"
            : "Rendered heading reflects the prop",
        ]}
      />
    </>
  );
}
export function CounterLab({ onExplore, snapshots = false }) {
  const [count, setCount] = useState(0);
  const [before, setBefore] = useState(0);
  const [event, setEvent] = useState("No event yet");
  function increment(functional) {
    setBefore(count);
    if (functional) {
      setCount((c) => c + 1);
      setCount((c) => c + 1);
      setCount((c) => c + 1);
    } else {
      setCount(count + 1);
      setCount(count + 1);
      setCount(count + 1);
    }
    setEvent(
      functional
        ? "Three queued updater functions: +3"
        : "Three replacements with the same snapshot: +1",
    );
    onExplore();
  }
  return (
    <>
      <div className="stat-number" aria-live="polite">
        {count}
      </div>
      <div className="button-row">
        {snapshots ? (
          <>
            <button onClick={() => increment(false)}>
              Three snapshot updates
            </button>
            <button onClick={() => increment(true)}>
              Three functional updates
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              setBefore(count);
              setCount((c) => c + 1);
              onExplore();
            }}
          >
            Increment
          </button>
        )}
        <button
          className="secondary"
          onClick={() => {
            setBefore(count);
            setCount(0);
            setEvent("Reset to zero");
            onExplore();
          }}
        >
          Reset count
        </button>
      </div>
      {snapshots && <p role="status">{event}</p>}
      <Snapshot before={{ count: before }} after={{ count }} />
    </>
  );
}
const seedTasks = [
  { id: 1, title: "Learn JSX", done: false },
  { id: 2, title: "Pass a prop", done: false },
];
export function ListLab({ onExplore, immutable = false }) {
  const [tasks, setTasks] = useState(seedTasks);
  const [before, setBefore] = useState(seedTasks);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const nextId = useRef(3);
  const visible = onlyOpen ? tasks.filter((t) => !t.done) : tasks;
  function update(next) {
    setBefore(tasks);
    setTasks(next);
    onExplore();
  }
  return (
    <>
      <div className="button-row">
        <button
          onClick={() => {
            const id = nextId.current++;
            update([...tasks, { id, title: "Task " + id, done: false }]);
          }}
        >
          Add sample task
        </button>
        <button
          className="secondary"
          onClick={() => update([...tasks].reverse())}
        >
          Reverse list
        </button>
      </div>
      {immutable && (
        <label className="check-label">
          <input
            type="checkbox"
            checked={onlyOpen}
            onChange={(e) => {
              setOnlyOpen(e.target.checked);
              onExplore();
            }}
          />
          Only unfinished
        </label>
      )}
      <ul className="task-list">
        {visible.map((task) => (
          <li key={task.id}>
            <label className="check-label">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() =>
                  update(
                    tasks.map((t) =>
                      t.id === task.id ? { ...t, done: !t.done } : t,
                    ),
                  )
                }
              />
              <span>{task.title}</span>
            </label>
            <code>key={task.id}</code>
          </li>
        ))}
      </ul>
      {!visible.length && (
        <p>No unfinished tasks. Add a task or show all tasks.</p>
      )}
      <p aria-live="polite">
        Remaining: {tasks.filter((t) => !t.done).length} · calculated from tasks
      </p>
      <Snapshot before={before} after={tasks} />
    </>
  );
}
export function FormLab({ onExplore }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  function submit(event) {
    event.preventDefault();
    if (!title.trim()) {
      setError("Enter a task title.");
      return;
    }
    setSaved(title.trim());
    setError("");
    onExplore();
  }
  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="form-task">Task title</label>
      <input
        id="form-task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "form-error" : undefined}
        maxLength={120}
      />
      {error && (
        <p id="form-error" role="alert" className="error-text">
          {error}
        </p>
      )}
      <button type="submit">Save task</button>
      <p role="status">{saved ? `Saved: ${saved}` : "No task saved yet."}</p>
    </form>
  );
}
function Draft() {
  const [draft, setDraft] = useState("");
  return (
    <label>
      Local draft
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="This resets when the learner changes"
      />
    </label>
  );
}
function Preview({ name }) {
  return (
    <p>
      Sibling preview: <strong>{name || "Learner"}</strong>
    </p>
  );
}
export function IdentityLab({ onExplore }) {
  const [name, setName] = useState("Ada");
  const [learnerId, setLearnerId] = useState("ada");
  return (
    <>
      <label>
        Shared name
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            onExplore();
          }}
        />
      </label>
      <Preview name={name} />
      <label>
        Learner identity
        <select
          value={learnerId}
          onChange={(e) => {
            setLearnerId(e.target.value);
            onExplore();
          }}
        >
          <option value="ada">Ada</option>
          <option value="grace">Grace</option>
        </select>
      </label>
      <Draft key={learnerId} />
      <Tree
        nodes={[
          "Parent owns shared name: " + name,
          "Input + Preview receive shared state",
          "Draft has its own state and key=" + learnerId,
        ]}
      />
    </>
  );
}
export function RefLab({ onExplore }) {
  const inputRef = useRef(null);
  return (
    <>
      <button
        onClick={() => {
          inputRef.current?.focus();
          onExplore();
        }}
      >
        Focus task input
      </button>
      <label>
        Task to focus
        <input ref={inputRef} />
      </label>
      <p>
        The ref points to the input DOM node. Focus changes without needing a
        state update.
      </p>
    </>
  );
}
export function CustomHookLab({ onExplore }) {
  const [first, setFirst, firstError] = useStoredState(
    "react-workspace:draft-a",
    "",
    (v) => typeof v === "string",
  );
  const [second, setSecond, secondError] = useStoredState(
    "react-workspace:draft-b",
    "",
    (v) => typeof v === "string",
  );
  return (
    <>
      <label>
        First independent draft
        <input
          value={first}
          onChange={(e) => {
            setFirst(e.target.value);
            onExplore();
          }}
        />
      </label>
      <label>
        Second independent draft
        <input
          value={second}
          onChange={(e) => {
            setSecond(e.target.value);
            onExplore();
          }}
        />
      </label>
      <button
        className="secondary"
        onClick={() => {
          setFirst("");
          setSecond("");
        }}
      >
        Clear saved drafts
      </button>
      <p role="status">
        {firstError || secondError
          ? "Storage is unavailable. Drafts work for this visit only."
          : "Both drafts are saved locally. Reload to check them."}
      </p>
      <Snapshot before={{ first }} after={{ second }} />
    </>
  );
}
