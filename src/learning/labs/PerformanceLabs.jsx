import React, {
  Component,
  Profiler,
  Suspense,
  lazy,
  memo,
  useCallback,
  useDeferredValue,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

function Card({ title, onSelect, summary, commits }) {
  useLayoutEffect(() => {
    commits.current += 1;
  });
  return (
    <article className="demo-card">
      <h3>{title}</h3>
      <p>{summary}</p>
      <button onClick={onSelect}>Select card</button>
    </article>
  );
}
const StableCard = memo(Card);
const topics = ["Components", "Props", "State"];
export function MemoLab({ onExplore }) {
  const [optimized, setOptimized] = useState(false);
  const [unrelated, setUnrelated] = useState(0);
  const [title, setTitle] = useState("Learning card");
  const [selected, setSelected] = useState(false);
  const commits = useRef(0);
  const samples = useRef([]);
  const [report, setReport] = useState(null);
  const onSelect = useCallback(() => setSelected((s) => !s), []);
  const summary = useMemo(() => topics.join(" · "), []);
  const recordCommit = useCallback((id, phase, actualDuration) => {
    samples.current = [
      ...samples.current.slice(-9),
      { phase, milliseconds: actualDuration.toFixed(2) },
    ];
  }, []);
  return (
    <>
      <label className="check-label">
        <input
          type="checkbox"
          checked={optimized}
          onChange={(e) => {
            setOptimized(e.target.checked);
            onExplore();
          }}
        />
        Use memo + stable callback
      </label>
      <label>
        Real child prop
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            onExplore();
          }}
        />
      </label>
      <button
        onClick={() => {
          setUnrelated((n) => n + 1);
          onExplore();
        }}
      >
        Update unrelated parent state ({unrelated})
      </button>
      <Profiler id="card" onRender={recordCommit}>
        {optimized ? (
          <StableCard
            title={title}
            onSelect={onSelect}
            summary={summary}
            commits={commits}
          />
        ) : (
          <Card
            title={title}
            onSelect={() => setSelected((s) => !s)}
            summary={summary}
            commits={commits}
          />
        )}
      </Profiler>
      <p>Selected: {selected ? "yes" : "no"}</p>
      <button
        className="secondary"
        onClick={() =>
          setReport({ commits: commits.current, samples: [...samples.current] })
        }
      >
        Capture measurements
      </button>
      {report && (
        <>
          <p>Observed child layout-effect runs: {report.commits}</p>
          <table>
            <caption>Recent Profiler commits · actual duration</caption>
            <thead>
              <tr>
                <th>Phase</th>
                <th>Milliseconds</th>
              </tr>
            </thead>
            <tbody>
              {report.samples.map((sample, i) => (
                <tr key={i}>
                  <td>{sample.phase}</td>
                  <td>{sample.milliseconds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <p className="muted">
        Captured before the capture-button update. Layout-effect runs include
        Strict Mode’s development check; they are not render-attempt counts.
        Profiler measures the wrapped subtree, including commits where the child
        can skip work. Timings vary; production builds normally disable
        profiling.
      </p>
    </>
  );
}
const searchItems = Array.from(
  { length: 2500 },
  (_, i) =>
    [
      "React components",
      "State design",
      "Effects and cleanup",
      "Routing patterns",
    ][i % 4] +
    " practice " +
    (i + 1),
);
const Results = memo(function Results({ query }) {
  const items = searchItems.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <p>{items.length} matches · showing first 100</p>
      <ul className="results-list">
        {items.slice(0, 100).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  );
});
export function TransitionLab({ onExplore }) {
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("transition");
  const [isPending, startTransition] = useTransition();
  const deferredText = useDeferredValue(text);
  const visibleQuery = mode === "deferred" ? deferredText : query;
  return (
    <>
      <label>
        Rendering strategy
        <select
          value={mode}
          onChange={(e) => {
            setMode(e.target.value);
            onExplore();
          }}
        >
          <option value="transition">useTransition</option>
          <option value="deferred">useDeferredValue</option>
        </select>
      </label>
      <label>
        Urgent search input
        <input
          value={text}
          onChange={(e) => {
            const nextText = e.target.value;
            setText(nextText);
            startTransition(() => setQuery(nextText));
            onExplore();
          }}
        />
      </label>
      <div className="snapshot-grid">
        <p>
          Input: <strong>{text || "(empty)"}</strong>
        </p>
        <p>
          Results query: <strong>{visibleQuery || "(empty)"}</strong>
        </p>
      </div>
      <p role="status">
        {(mode === "transition" ? isPending : text !== deferredText)
          ? "Results are catching up…"
          : "Results are current."}
      </p>
      <Results query={visibleQuery} />
      <p className="muted">
        Pending states can be too brief to see on a fast device. This is real
        React scheduling, with no artificial loading timer.
      </p>
    </>
  );
}
export class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div role="alert" className="error-panel">
        <h3>This panel could not render.</h3>
        <p>The rest of the workspace is still available.</p>
        <button
          onClick={() => {
            this.props.onReset?.();
            this.setState({ failed: false });
          }}
        >
          Recover panel
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
const LazyPanel = lazy(() => import("./LazyPanel"));
function BreakablePanel({ broken }) {
  if (broken) throw new Error("Intentional teaching example: render failure");
  return <LazyPanel />;
}
export function ReliabilityLab({ onExplore }) {
  const [loaded, setLoaded] = useState(false);
  const [broken, setBroken] = useState(false);
  return (
    <>
      <div className="button-row">
        <button
          onClick={() => {
            setLoaded(true);
            onExplore();
          }}
        >
          Load lazy panel
        </button>
        <button
          className="secondary"
          disabled={!loaded}
          onClick={() => {
            setBroken(true);
            onExplore();
          }}
        >
          Simulate render error
        </button>
      </div>
      {loaded && (
        <ErrorBoundary onReset={() => setBroken(false)}>
          <Suspense fallback={<p role="status">Loading panel…</p>}>
            <BreakablePanel broken={broken} />
          </Suspense>
        </ErrorBoundary>
      )}
      <p className="muted">
        Loading can be brief or cached. The deliberate render error is expected
        to appear in development diagnostics. The boundary contains it and
        provides recovery.
      </p>
    </>
  );
}
