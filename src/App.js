import React, { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProgressProvider } from "./learning/Progress";
import Workspace from "./learning/Workspace";
import Dashboard, { ProgressPage } from "./learning/Dashboard";
import LessonPage, { NotFound } from "./learning/Lesson";
import { legacyRoutes } from "./learning/curriculum";
const StudyPlanner = lazy(() => import("./learning/StudyPlanner"));
const PlannerList = lazy(() =>
  import("./learning/StudyPlanner").then((module) => ({
    default: module.PlannerList,
  })),
);
const PlannerDetail = lazy(() =>
  import("./learning/StudyPlanner").then((module) => ({
    default: module.PlannerDetail,
  })),
);

// Export the route tree so behavior tests can use MemoryRouter without nesting routers.
export function AppRoutes() {
  return (
    <Suspense
      fallback={
        <p className="page-container" role="status">
          Loading workspace…
        </p>
      }
    >
      <Routes>
        <Route element={<Workspace />}>
          <Route index element={<Dashboard />} />
          <Route path="learn/:lessonId/*" element={<LessonPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="project/study-planner" element={<StudyPlanner />}>
            <Route index element={<Navigate to="tasks" replace />} />
            <Route path="tasks" element={<PlannerList />} />
            <Route path="tasks/:taskId" element={<PlannerDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          {Object.entries(legacyRoutes).map(([path, id]) => (
            <Route
              key={path}
              path={path}
              element={<Navigate to={"/learn/" + id} replace />}
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
export default function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ProgressProvider>
  );
}
