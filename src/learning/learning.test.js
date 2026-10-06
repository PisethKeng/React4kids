import React, { StrictMode, act } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { lessons, lessonById, legacyRoutes } from "./curriculum";
import {
  initialProgress,
  isComplete,
  normalizeProgress,
  progressReducer,
} from "./Progress";
import { labComponents } from "./labs";
import { taskReducer, ContextLab } from "./labs/ArchitectureLabs";
import {
  CounterLab,
  IdentityLab,
  RefLab,
  CustomHookLab,
} from "./labs/BasicLabs";
import { EffectLab, ResourceLab } from "./labs/AsyncLabs";
import { ReliabilityLab } from "./labs/PerformanceLabs";
import { validTasks } from "./StudyPlanner";

beforeEach(() => localStorage.clear());
afterEach(() => jest.restoreAllMocks());

test("curriculum has unique IDs, valid preceding prerequisites, assessments, and implemented labs", () => {
  expect(new Set(lessons.map((l) => l.id)).size).toBe(18);
  lessons.forEach((lesson) => {
    expect(labComponents[lesson.id]).toBeDefined();
    expect(
      lesson.prerequisites.every((id) => lessonById[id].order < lesson.order),
    ).toBe(true);
    expect(lesson.objectives).toHaveLength(2);
    for (const question of [lesson.practice, lesson.check, lesson.prediction]) {
      expect(question.options[question.answer]).toBeDefined();
      expect(question.explanation.length).toBeGreaterThan(30);
    }
  });
  Object.values(legacyRoutes).forEach((id) =>
    expect(lessonById[id]).toBeDefined(),
  );
});

test("progress normalization rejects unknown versions and invalid records", () => {
  expect(normalizeProgress({ version: 2 })).toEqual(initialProgress);
  const value = normalizeProgress({
    version: 1,
    lessons: {
      state: { explored: "true", check: true, attempts: -1 },
      bogus: {},
    },
    bookmarks: ["state", "state", "bogus"],
    theme: "bogus",
    lastLesson: "bogus",
    milestones: [0, 0, 9],
  });
  expect(value.bookmarks).toEqual(["state"]);
  expect(value.milestones).toEqual([0]);
  expect(value.lessons.state.explored).toBe(false);
  expect(value.lessons.state.attempts).toBe(0);
  expect(value.lastLesson).toBeNull();
  expect(value.theme).toBe("light");
});

test("visiting alone cannot complete a lesson and wrong retries preserve earned passes", () => {
  let state = progressReducer(initialProgress, { type: "visit", id: "state" });
  expect(isComplete(state.lessons.state)).toBe(false);
  state = progressReducer(state, {
    type: "answer",
    kind: "practice",
    id: "state",
    correct: true,
  });
  state = progressReducer(state, {
    type: "answer",
    kind: "practice",
    id: "state",
    correct: false,
  });
  expect(state.lessons.state.practice).toBe(true);
  expect(state.lessons.state.attempts).toBe(2);
});

test("task reducer keeps previous state immutable across edit, toggle, and delete", () => {
  const task = Object.freeze({ id: "1", title: "Study", done: false });
  const tasks = Object.freeze([task]);
  const edited = taskReducer(tasks, { type: "edit", id: "1", title: "Read" });
  const done = taskReducer(edited, { type: "toggle", id: "1" });
  expect(tasks[0]).toEqual({ id: "1", title: "Study", done: false });
  expect(done[0]).toEqual({ id: "1", title: "Read", done: true });
  expect(taskReducer(done, { type: "delete", id: "1" })).toEqual([]);
  expect(validTasks([{ ...task }, { ...task }])).toBe(false);
  expect(validTasks([{ ...task, title: " " }])).toBe(false);
});

test("state snapshot lab demonstrates +1 versus +3", () => {
  render(<CounterLab snapshots onExplore={() => {}} />);
  userEvent.click(
    screen.getByRole("button", { name: "Three snapshot updates" }),
  );
  expect(screen.getByText("1")).toBeInTheDocument();
  userEvent.click(
    screen.getByRole("button", { name: "Three functional updates" }),
  );
  expect(screen.getByText("4")).toBeInTheDocument();
});

test("component identity resets draft and shared state reaches the sibling", () => {
  render(<IdentityLab onExplore={() => {}} />);
  userEvent.type(screen.getByLabelText("Local draft"), "my draft");
  fireEvent.change(screen.getByLabelText("Learner identity"), {
    target: { value: "grace" },
  });
  expect(screen.getByLabelText("Local draft")).toHaveValue("");
  fireEvent.change(screen.getByLabelText("Shared name"), {
    target: { value: "Grace" },
  });
  expect(screen.getByText("Grace", { selector: "strong" })).toBeInTheDocument();
});

test("ref lab moves keyboard focus into the input", () => {
  render(<RefLab onExplore={() => {}} />);
  userEvent.click(screen.getByRole("button", { name: "Focus task input" }));
  expect(screen.getByLabelText("Task to focus")).toHaveFocus();
});

test("Effect lab removes the old subscription on dependency changes and on unmount", () => {
  const added = jest.spyOn(window, "addEventListener");
  const removed = jest.spyOn(window, "removeEventListener");
  render(
    <StrictMode>
      <EffectLab onExplore={() => {}} />
    </StrictMode>,
  );
  userEvent.click(screen.getByRole("button", { name: "Mount subscription" }));
  const oldHandler = added.mock.calls
    .filter(([type]) => type === "room:JSX")
    .slice(-1)[0][1];
  fireEvent.change(screen.getByLabelText("Subscribed room"), {
    target: { value: "Effects" },
  });
  expect(removed).toHaveBeenCalledWith("room:JSX", oldHandler);
  act(() =>
    window.dispatchEvent(
      new CustomEvent("room:JSX", { detail: "stale message" }),
    ),
  );
  expect(screen.getByRole("status")).not.toHaveTextContent("stale message");
  userEvent.click(screen.getByRole("button", { name: "Send room message" }));
  expect(screen.getByRole("status")).toHaveTextContent(
    "Hello from the event system!",
  );
  const currentHandler = added.mock.calls
    .filter(([type]) => type === "room:Effects")
    .slice(-1)[0][1];
  userEvent.click(screen.getByRole("button", { name: "Unmount subscription" }));
  expect(removed).toHaveBeenCalledWith("room:Effects", currentHandler);
});

test("resource requests support empty, error, retry, and latest-selection wins", async () => {
  jest.useFakeTimers();
  const view = render(<ResourceLab />);
  expect(screen.getByRole("status")).toHaveTextContent("Loading resources");
  fireEvent.change(screen.getByLabelText("Resource topic"), {
    target: { value: "effects" },
  });
  await act(async () => {
    jest.advanceTimersByTime(750);
  });
  expect(
    screen.getByRole("link", { name: /Synchronizing with Effects/ }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: /Writing markup/ }),
  ).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Response scenario"), {
    target: { value: "empty" },
  });
  await act(async () => {
    jest.advanceTimersByTime(300);
  });
  expect(screen.getByRole("status")).toHaveTextContent("No resources");
  fireEvent.change(screen.getByLabelText("Response scenario"), {
    target: { value: "error" },
  });
  await act(async () => {
    jest.advanceTimersByTime(300);
  });
  expect(screen.getByRole("status")).toHaveTextContent("Could not load");
  userEvent.click(
    screen.getByRole("button", { name: "Retry successful request" }),
  );
  await act(async () => {
    jest.advanceTimersByTime(300);
  });
  expect(
    screen.getByRole("link", { name: /Synchronizing with Effects/ }),
  ).toBeInTheDocument();
  view.unmount();
  expect(jest.getTimerCount()).toBe(0);
  jest.useRealTimers();
});

test("custom hook calls keep drafts independent and restore saved values", () => {
  const view = render(<CustomHookLab onExplore={() => {}} />);
  userEvent.type(screen.getByLabelText("First independent draft"), "First");
  expect(screen.getByLabelText("Second independent draft")).toHaveValue("");
  view.unmount();
  render(<CustomHookLab onExplore={() => {}} />);
  expect(screen.getByLabelText("First independent draft")).toHaveValue("First");
});

test("context distributes the reducer state to a distant consumer", () => {
  render(<ContextLab onExplore={() => {}} />);
  fireEvent.change(screen.getByLabelText("Topic consumer A"), {
    target: { value: "Effects" },
  });
  expect(
    screen.getByText("Effects", { selector: "strong" }),
  ).toBeInTheDocument();
});

test("lazy panel loads, contains an intentional render error, and recovers", async () => {
  const error = jest.spyOn(console, "error").mockImplementation(() => {});
  render(<ReliabilityLab onExplore={() => {}} />);
  userEvent.click(screen.getByRole("button", { name: "Load lazy panel" }));
  expect(
    await screen.findByRole("heading", { name: "Panel loaded" }),
  ).toBeInTheDocument();
  userEvent.click(
    screen.getByRole("button", { name: "Simulate render error" }),
  );
  expect(screen.getByRole("alert")).toHaveTextContent(
    "This panel could not render.",
  );
  userEvent.click(screen.getByRole("button", { name: "Recover panel" }));
  await waitFor(() =>
    expect(
      screen.getByRole("heading", { name: "Panel loaded" }),
    ).toBeInTheDocument(),
  );
  expect(error).toHaveBeenCalled();
});
