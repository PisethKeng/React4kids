import React, { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { lessons, lessonById, stages } from "./curriculum";
import { isComplete, useProgress } from "./Progress";
const Lab = lazy(() => import("./labs"));

export function Assessment({ question, name, onAnswer, passed = false }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  return (
    <form
      className="assessment"
      onSubmit={(e) => {
        e.preventDefault();
        if (selected === null) return;
        const correct = selected === question.answer;
        setResult(correct);
        onAnswer?.(correct);
      }}
    >
      <fieldset>
        <legend>{question.prompt}</legend>
        {question.options.map((option, i) => (
          <label
            className={"answer-option" + (selected === i ? " selected" : "")}
            key={option}
          >
            <input
              type="radio"
              name={name}
              checked={selected === i}
              onChange={() => {
                setSelected(i);
                setResult(null);
              }}
            />
            <span>{option}</span>
          </label>
        ))}
      </fieldset>
      <div className="button-row">
        <button disabled={selected === null} type="submit">
          {result === false ? "Check again" : "Check answer"}
        </button>
        {passed && <span className="complete-label">✓ Passed</span>}
      </div>
      {result !== null && (
        <div
          className={"answer-feedback " + (result ? "correct" : "incorrect")}
          role="status"
        >
          <strong>{result ? "That’s right." : "Not quite. Try again."}</strong>
          <p>{question.explanation}</p>
        </div>
      )}
    </form>
  );
}
export function NotFound() {
  return (
    <div className="page-container narrow empty-state">
      <span className="eyebrow">A DIFFERENT PATH</span>
      <h1>We couldn’t find that page.</h1>
      <p>Choose a lesson from the learning path to keep going.</p>
      <Link className="button-link" to="/">
        Back to learning path
      </Link>
    </div>
  );
}
export default function LessonPage() {
  const { lessonId } = useParams();
  return lessonById[lessonId] ? (
    <Lesson key={lessonId} lesson={lessonById[lessonId]} />
  ) : (
    <NotFound />
  );
}
function Lesson({ lesson }) {
  const { state, dispatch } = useProgress();
  const [hint, setHint] = useState(0);
  const [pane, setPane] = useState("demo");
  const [reset, setReset] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const mobile = useMediaQuery("(max-width: 760px)");
  useEffect(() => {
    dispatch({ type: "visit", id: lesson.id });
    document.title = `${lesson.title} · React Path`;
    return () => {
      document.title = "React Path · Learn by understanding";
    };
  }, [dispatch, lesson.id, lesson.title]);
  const onExplore = useCallback(
    () => dispatch({ type: "explore", id: lesson.id }),
    [dispatch, lesson.id],
  );
  const record = state.lessons[lesson.id];
  const previous = lessons[lesson.order - 1];
  const next = lessons[lesson.order + 1];
  return (
    <div className="lesson-layout">
      <aside className="lesson-sidebar">
        <Link to="/" className="text-link">
          ← Learning path
        </Link>
        <p className="eyebrow">YOUR NEXT SMALL STEP</p>
        <nav aria-label="Lesson navigation">
          {stages.map((stage, i) => (
            <div key={stage.title}>
              <h2>
                {i + 1}. {stage.title}
              </h2>
              {lessons
                .filter((l) => l.stage === i)
                .map((l) => (
                  <Link
                    key={l.id}
                    to={"/learn/" + l.id}
                    aria-current={l.id === lesson.id ? "page" : undefined}
                  >
                    <span>
                      {isComplete(state.lessons[l.id])
                        ? "✓"
                        : String(l.order + 1).padStart(2, "0")}
                    </span>
                    {l.title}
                  </Link>
                ))}
            </div>
          ))}
        </nav>
      </aside>
      <article className="lesson-main">
        <div className="lesson-topline">
          <span className="eyebrow">
            STAGE {lesson.stage + 1} / {stages[lesson.stage].title} · LESSON{" "}
            {lesson.order + 1}
          </span>
          <button
            className="secondary small"
            aria-pressed={state.bookmarks.includes(lesson.id)}
            onClick={() => dispatch({ type: "bookmark", id: lesson.id })}
          >
            {state.bookmarks.includes(lesson.id)
              ? "★ Bookmarked"
              : "☆ Bookmark"}
          </button>
        </div>
        <h1>{lesson.title}</h1>
        <p className="lead">{lesson.summary}</p>
        {previous && (
          <p className="prerequisite">
            Builds on <Link to={"/learn/" + previous.id}>{previous.title}</Link>
            {!isComplete(state.lessons[previous.id]) &&
              " · Recommended first, but you can explore freely."}
          </p>
        )}
        <ol className="lesson-steps" aria-label="Lesson sequence">
          {[
            "Understand",
            "Predict",
            "Explore",
            "Practice",
            "Check",
            "Reflect",
          ].map((label, i) => (
            <li key={label}>
              <a href={"#" + label.toLowerCase()}>
                {i + 1}. {label}
              </a>
            </li>
          ))}
        </ol>
        <section id="understand" className="lesson-section">
          <span className="eyebrow">01 / UNDERSTAND</span>
          <h2>The idea</h2>
          <p>{lesson.understand}</p>
          <h3>By the end, you can…</h3>
          <ul>
            {lesson.objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
          <a href={lesson.docs} target="_blank" rel="noreferrer">
            {lesson.id === "routing"
              ? "Read the React Router guide ↗"
              : "Read the React 18 guide ↗"}
          </a>
        </section>
        <section id="predict" className="lesson-section">
          <span className="eyebrow">02 / PREDICT</span>
          <h2>Think before you click.</h2>
          <p>
            This prediction is ungraded. Notice whether the demo changes your
            reasoning.
          </p>
          <Assessment
            key={"predict-" + reset}
            question={lesson.prediction}
            name="prediction"
          />
        </section>
        <section id="explore" className="lesson-section">
          <span className="eyebrow">03 / EXPLORE</span>
          <h2>Make the concept visible.</h2>
          <p>{lesson.action}</p>
          <div className="button-row">
            <button
              className="secondary small"
              onClick={() => setReset((n) => n + 1)}
            >
              Reset demo
            </button>
            <span className="muted">
              {record?.explored
                ? "✓ Lab explored"
                : "Interact with the lab to record exploration."}
            </span>
          </div>
          {mobile && (
            <div className="demo-tabs" role="tablist" aria-label="Example view">
              {["demo", "code"].map((view) => (
                <button
                  key={view}
                  role="tab"
                  id={"tab-" + view}
                  aria-controls={"panel-" + view}
                  aria-selected={pane === view}
                  tabIndex={pane === view ? 0 : -1}
                  onKeyDown={(e) => {
                    if (
                      ["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
                    ) {
                      e.preventDefault();
                      const nextView =
                        e.key === "Home"
                          ? "demo"
                          : e.key === "End"
                            ? "code"
                            : pane === "demo"
                              ? "code"
                              : "demo";
                      setPane(nextView);
                      document.getElementById("tab-" + nextView)?.focus();
                    }
                  }}
                  onClick={() => setPane(view)}
                >
                  {view === "demo" ? "Live demo" : "Code excerpt"}
                </button>
              ))}
            </div>
          )}
          <div className="lab-grid">
            <div
              id="panel-demo"
              className="lab-panel"
              role={mobile ? "tabpanel" : undefined}
              aria-labelledby={mobile ? "tab-demo" : undefined}
              hidden={mobile && pane !== "demo"}
            >
              <span className="panel-label">LIVE REACT DEMO</span>
              <Suspense
                fallback={<p role="status">Loading interactive lab…</p>}
              >
                <Lab key={reset} id={lesson.id} onExplore={onExplore} />
              </Suspense>
            </div>
            <div
              id="panel-code"
              className="code-panel"
              role={mobile ? "tabpanel" : undefined}
              aria-labelledby={mobile ? "tab-code" : undefined}
              hidden={mobile && pane !== "code"}
            >
              <span className="panel-label">CONCEPT EXCERPT · JSX</span>
              <pre tabIndex={0} aria-label="Scrollable code excerpt">
                <code>{lesson.code}</code>
              </pre>
              <p>
                Focused excerpt of this pattern. Supporting UI and
                instrumentation are omitted.
              </p>
            </div>
          </div>
        </section>
        <section id="practice" className="lesson-section">
          <span className="eyebrow">04 / PRACTICE</span>
          <h2>Choose the working approach.</h2>
          <Assessment
            key={"practice-" + reset}
            question={lesson.practice}
            name="practice"
            passed={record?.practice}
            onAnswer={(correct) =>
              dispatch({
                type: "answer",
                id: lesson.id,
                kind: "practice",
                correct,
              })
            }
          />
          <button
            className="text-button"
            disabled={hint === lesson.hints.length}
            onClick={() => setHint((n) => n + 1)}
          >
            {hint === lesson.hints.length
              ? "All hints shown"
              : "Show a hint (" + (hint + 1) + "/" + lesson.hints.length + ")"}
          </button>
          {lesson.hints.slice(0, hint).map((text, i) => (
            <p key={i} className="hint">
              Hint {i + 1}: {text}
            </p>
          ))}
        </section>
        <section id="check" className="lesson-section">
          <span className="eyebrow">05 / CHECK</span>
          <h2>Explain what you learned.</h2>
          <Assessment
            key={"check-" + reset}
            question={lesson.check}
            name="check"
            passed={record?.check}
            onAnswer={(correct) =>
              dispatch({
                type: "answer",
                id: lesson.id,
                kind: "check",
                correct,
              })
            }
          />
        </section>
        <section id="reflect" className="lesson-section reflection">
          <span className="eyebrow">06 / REFLECT</span>
          <h2>Take the idea with you.</h2>
          <p>{lesson.reflection}</p>
          <p className="muted">
            Explain it aloud or jot it in your own notes. Reflection is
            self-guided and ungraded.
          </p>
        </section>
        <div className="completion-panel" role="status">
          <strong>
            {isComplete(record)
              ? "✓ Lesson complete. Nice work putting it together."
              : "Your lesson checklist"}
          </strong>
          <p>
            {record?.explored ? "✓" : "○"} Explore the lab ·{" "}
            {record?.practice ? "✓" : "○"} Pass practice ·{" "}
            {record?.check ? "✓" : "○"} Pass knowledge check
          </p>
        </div>
        <div className="lesson-pagination">
          {previous ? (
            <Link to={"/learn/" + previous.id}>← {previous.title}</Link>
          ) : (
            <Link to="/">← Learning path</Link>
          )}
          {next ? (
            <Link className="button-link" to={"/learn/" + next.id}>
              {next.title} →
            </Link>
          ) : (
            <Link className="button-link" to="/project/study-planner">
              Build the Study Planner →
            </Link>
          )}
        </div>
        <div className="lesson-reset">
          {confirm ? (
            <div className="button-row">
              <button
                className="secondary small"
                onClick={() => {
                  dispatch({ type: "reset-lesson", id: lesson.id });
                  setReset((n) => n + 1);
                  setHint(0);
                  setConfirm(false);
                }}
              >
                Confirm reset this lesson
              </button>
              <button
                className="secondary small"
                onClick={() => setConfirm(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button className="text-button" onClick={() => setConfirm(true)}>
              Reset this lesson’s progress…
            </button>
          )}
        </div>
      </article>
    </div>
  );
}
