import React, { useState } from "react";
import { Link } from "react-router-dom";
import { lessons, stages } from "./curriculum";
import { isComplete, useProgress } from "./Progress";
import CoastalStudio from "./CoastalStudio";

export function ProgressBar({ value, max, label }) {
  return (
    <div className="progress-block">
      <div className="progress-label">
        <span>{label}</span>
        <strong>
          {value}/{max}
        </strong>
      </div>
      <progress value={value} max={max} aria-label={label} />
    </div>
  );
}
export default function Dashboard() {
  const { state } = useProgress();
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");
  const [status, setStatus] = useState("all");
  const complete = lessons.filter((l) =>
    isComplete(state.lessons[l.id]),
  ).length;
  const resume =
    lessons.find(
      (l) => l.id === state.lastLesson && !isComplete(state.lessons[l.id]),
    ) ||
    lessons.find((l) => !isComplete(state.lessons[l.id])) ||
    lessons[0];
  const visible = lessons.filter(
    (l) =>
      `${l.title} ${l.summary} ${stages[l.stage].title}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (level === "all" || l.level === level) &&
      (status === "all" ||
        (status === "complete"
          ? isComplete(state.lessons[l.id])
          : status === "bookmarked"
            ? state.bookmarks.includes(l.id)
            : !isComplete(state.lessons[l.id]))),
  );
  return (
    <div className="page-container dashboard-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="status-dot" /> YOUR FRONTEND ADVENTURE STARTS HERE
          </span>
          <h1>
            react as simple as it is
            <br />
            <span>
              One idea
              <br />
              at a time.
            </span>
          </h1>
          <p>
            See how it works. Try it yourself. Build something real.
            <br className="desktop-break" /> A guided path from your first
            component to a complete app.
          </p>
          <div className="button-row">
            <Link className="button-link" to={"/learn/" + resume.id}>
              {complete === lessons.length
                ? "Revisit the path"
                : state.lastLesson
                  ? "Continue learning"
                  : "Start learning"}{" "}
              <span aria-hidden="true">→</span>
            </Link>
            <a className="text-link" href="#learning-path">
              Explore the path ↓
            </a>
          </div>
          <div className="hero-facts">
            <span>
              <strong>18</strong> interactive lessons
            </span>
            <span>
              <strong>5</strong> learning stages
            </span>
            <span>
              <strong>1</strong> real-world project
            </span>
          </div>
        </div>
        <CoastalStudio />
      </section>
      <section className="resume-strip" aria-label="Your learning progress">
        <div>
          <span className="eyebrow">NOW LEARNING / YOUR NEXT STOP</span>
          <h2>{resume.title}</h2>
          <p>
            Stage {resume.stage + 1} · {stages[resume.stage].title}
          </p>
        </div>
        <ProgressBar
          value={complete}
          max={lessons.length}
          label="Your learning path"
        />
        <Link
          className="round-link"
          to={"/learn/" + resume.id}
          aria-label={"Continue to " + resume.title}
        >
          ↗
        </Link>
      </section>
      <section id="learning-path">
        <div className="section-heading">
          <div>
            <span className="eyebrow">YOUR CURRICULUM CATALOG</span>
            <h2>Small steps, connected ideas.</h2>
          </div>
          <p>
            Know some JavaScript? You’re ready.
            <br />
            Follow the path or explore any lesson.
          </p>
        </div>
        <div className="filter-bar">
          <label className="search-label">
            Find a concept
            <input
              type="search"
              placeholder="Search state, effects, routing…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <label>
            Progress
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All lessons</option>
              <option value="incomplete">Not complete</option>
              <option value="complete">Complete</option>
              <option value="bookmarked">Bookmarked</option>
            </select>
          </label>
        </div>
        <div
          className="level-filters"
          role="group"
          aria-label="Filter lessons by level"
        >
          {[
            ["all", "All levels"],
            ["Beginner", "Beginner"],
            ["Developing", "Developing"],
            ["Intermediate", "Intermediate"],
          ].map(([value, label], index) => (
            <button
              key={value}
              type="button"
              className="level-filter"
              data-color={index}
              aria-pressed={level === value}
              onClick={() => setLevel(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="result-count" role="status">
          {visible.length} lessons in your view
        </p>
        <div className="roadmap">
          {stages.map((stage, stageIndex) => {
            const group = visible.filter((l) => l.stage === stageIndex);
            if (!group.length) return null;
            const done = lessons.filter(
              (l) => l.stage === stageIndex && isComplete(state.lessons[l.id]),
            ).length;
            return (
              <section
                className="stage"
                data-stage={stageIndex}
                key={stage.title}
                aria-labelledby={"stage-" + stageIndex}
              >
                <div className="stage-number" aria-hidden="true">
                  0{stageIndex + 1}
                </div>
                <div className="stage-content">
                  <div className="stage-heading">
                    <div>
                      <span className="eyebrow">{stage.level}</span>
                      <h3 id={"stage-" + stageIndex}>{stage.title}</h3>
                      <p>{stage.description}</p>
                    </div>
                    <span className="badge">
                      {done}/
                      {lessons.filter((l) => l.stage === stageIndex).length}{" "}
                      complete
                    </span>
                  </div>
                  <div className="lesson-grid">
                    {group.map((l) => (
                      <Link
                        className="lesson-card"
                        key={l.id}
                        to={"/learn/" + l.id}
                      >
                        <div
                          className="lesson-card-art"
                          data-stage={stageIndex}
                          aria-hidden="true"
                        >
                          <span className="art-label">HANDS-ON / REACT 18</span>
                          <span className="art-symbol">
                            {["</>", "{ }", "↻", "⌘", "↗"][stageIndex]}
                          </span>
                          <span className="art-orbit" />
                          <span className="art-index">
                            {String(l.order + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <div className="card-meta">
                          <span>
                            LESSON {String(l.order + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={
                              isComplete(state.lessons[l.id])
                                ? "complete-label"
                                : ""
                            }
                          >
                            {isComplete(state.lessons[l.id])
                              ? "✓ Complete"
                              : state.lessons[l.id]
                                ? "In progress"
                                : "○ Ready to explore"}
                          </span>
                        </div>
                        <h4>{l.title}</h4>
                        <p>{l.summary}</p>
                        <div className="card-bottom">
                          <span>
                            Interactive lab{" "}
                            {state.bookmarks.includes(l.id) && "· Bookmarked"}
                          </span>
                          <span aria-hidden="true">↗</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
        {!visible.length && (
          <div className="empty-state">
            <h3>No lessons match those filters.</h3>
            <button
              onClick={() => {
                setSearch("");
                setLevel("all");
                setStatus("all");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
      <section className="capstone-banner">
        <div>
          <span className="eyebrow">PUT THE PIECES TOGETHER</span>
          <h2>Your first complete Study Planner.</h2>
          <p>
            Bring components, state, forms, and routing together in one
            practical project.
          </p>
        </div>
        <Link className="button-link" to="/project/study-planner">
          Explore the project →
        </Link>
      </section>
    </div>
  );
}
export function ProgressPage() {
  const { state, dispatch } = useProgress();
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="page-container narrow">
      <span className="eyebrow">YOUR LEARNING JOURNAL</span>
      <h1>Look how far you’ve come.</h1>
      <p>
        Completion means you explored the lab and passed both its practice
        challenge and knowledge check. Opening a page alone does not complete
        it.
      </p>
      {stages.map((stage, i) => (
        <section className="panel" key={stage.title}>
          <h2>{stage.title}</h2>
          <ProgressBar
            value={
              lessons.filter(
                (l) => l.stage === i && isComplete(state.lessons[l.id]),
              ).length
            }
            max={lessons.filter((l) => l.stage === i).length}
            label={stage.title + " progress"}
          />
          <ul className="progress-lessons">
            {lessons
              .filter((l) => l.stage === i)
              .map((l) => (
                <li key={l.id}>
                  <Link to={"/learn/" + l.id}>{l.title}</Link>
                  <span>
                    {isComplete(state.lessons[l.id])
                      ? "✓ Complete"
                      : state.lessons[l.id]
                        ? "In progress"
                        : "Not started"}{" "}
                    · {state.lessons[l.id]?.attempts || 0} attempts
                  </span>
                </li>
              ))}
          </ul>
        </section>
      ))}
      <section className="panel">
        <h2>Saved for later</h2>
        {state.bookmarks.length ? (
          <ul>
            {lessons
              .filter((l) => state.bookmarks.includes(l.id))
              .map((l) => (
                <li key={l.id}>
                  <Link to={"/learn/" + l.id}>{l.title}</Link>
                </li>
              ))}
          </ul>
        ) : (
          <p>Bookmark any lesson to return to it here.</p>
        )}
        <h3>Project milestones</h3>
        <p>
          {state.milestones.length}/5 self-reviewed milestones. This is separate
          from automatically checked lesson completion.
        </p>
        <Link to="/project/study-planner">Open Study Planner</Link>
      </section>
      <section className="panel">
        <h2>Reset learning progress</h2>
        <p>
          Clears lesson results, attempts, bookmarks, and project checklist
          ticks. Your theme, planner tasks, and practice drafts stay saved.
        </p>
        {confirm ? (
          <div className="button-row">
            <button
              onClick={() => {
                dispatch({ type: "reset" });
                setConfirm(false);
              }}
            >
              Confirm reset progress
            </button>
            <button className="secondary" onClick={() => setConfirm(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="secondary" onClick={() => setConfirm(true)}>
            Reset progress…
          </button>
        )}
      </section>
    </div>
  );
}
