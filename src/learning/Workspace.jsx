import React, { useEffect, useMemo, useRef } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { isComplete, useProgress } from "./Progress";
import { lessons } from "./curriculum";
import "@fontsource-variable/outfit";
import "@fontsource-variable/space-grotesk";
import "./workspace.css";

export default function Workspace() {
  const { state, dispatch, storageError } = useProgress();
  const location = useLocation();
  const main = useRef(null);
  // Preserve position inside an embedded lab; start a different lesson at its heading.
  const pageKey = location.pathname.startsWith("/learn/")
    ? location.pathname.split("/").slice(0, 3).join("/")
    : location.pathname.startsWith("/project/study-planner")
      ? "/project/study-planner"
      : location.pathname;
  const previousPage = useRef(pageKey);
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: state.theme,
          primary: { main: state.theme === "dark" ? "#77dff3" : "#0047ab" },
          background: {
            default: state.theme === "dark" ? "#0d1b2a" : "#fff9f2",
          },
        },
        typography: {
          fontFamily: '"Outfit Variable", system-ui, sans-serif',
        },
      }),
    [state.theme],
  );
  useEffect(() => {
    if (previousPage.current !== pageKey) {
      previousPage.current = pageKey;
      main.current?.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
  }, [pageKey]);
  const completed = lessons.filter((l) =>
    isComplete(state.lessons[l.id]),
  ).length;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="workspace" data-theme={state.theme}>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <header className="site-header">
          <Link to="/" className="brand" aria-label="React Path home">
            <span className="brand-symbol" aria-hidden="true">
              <span className="brand-sun">✳</span>
            </span>
            <span>
              REACTJS-4Kids<span className="brand-light"></span>
              <small></small>
            </span>
          </Link>
          <nav aria-label="Main navigation">
            <NavLink to="/" end>
              Learning path
            </NavLink>
            <NavLink to="/progress">My progress</NavLink>
            <NavLink to="/project/study-planner">
              Build a project <span aria-hidden="true">↗</span>
            </NavLink>
          </nav>
          <button
            className="theme-button secondary"
            onClick={() => dispatch({ type: "theme" })}
            aria-label={`Switch to ${state.theme === "light" ? "dark" : "light"} theme`}
          >
            {state.theme === "light" ? "◐" : "☀"}
            <span>{state.theme === "light" ? "Dark" : "Light"}</span>
          </button>
        </header>
        {storageError && (
          <div className="storage-warning" role="status">
            Browser storage is unavailable. You can keep learning, but progress
            will last only for this visit.
          </div>
        )}
        <main id="main-content" ref={main} tabIndex={-1}>
          <Outlet />
        </main>
        <footer className="site-footer">
          <span>
            <strong>Small steps. Real understanding.</strong>
            <br />
            React 18 · JavaScript · Guided practice
          </span>
          <span>
            {completed} of {lessons.length} lessons complete
            <br />
            Progress stays in this browser.
          </span>
        </footer>
      </div>
    </ThemeProvider>
  );
}
