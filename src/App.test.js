import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "./App";
import { ProgressProvider, PROGRESS_KEY } from "./learning/Progress";
import { lessons, legacyRoutes } from "./learning/curriculum";
import { PLANNER_KEY } from "./learning/StudyPlanner";

function mount(path = "/") {
  return render(
    <ProgressProvider>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </ProgressProvider>,
  );
}
beforeEach(() => localStorage.clear());
afterEach(() => jest.restoreAllMocks());

test("dashboard filters lessons and clears an empty search", () => {
  mount();
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Understand React.",
  );
  userEvent.type(screen.getByRole("searchbox"), "request races");
  expect(screen.getByText("1 lessons in your view")).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Fetching & request races" }),
  ).toBeInTheDocument();
  userEvent.type(screen.getByRole("searchbox"), "zzzz");
  userEvent.click(screen.getByRole("button", { name: "Clear filters" }));
  expect(screen.getByText("18 lessons in your view")).toBeInTheDocument();
});

test.each(lessons.map((l) => [l.id, l.title]))(
  "lesson %s renders content, a working lab, and assessments",
  async (id, title) => {
    mount("/learn/" + id);
    expect(
      screen.getByRole("heading", { level: 1, name: title }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.queryByText("Loading interactive lab…"),
      ).not.toBeInTheDocument(),
    );
    const demo = document.getElementById("panel-demo");
    expect(demo.querySelector("button, input, a, select")).not.toBeNull();
    expect(screen.getAllByRole("group")).toHaveLength(3);
    expect(
      screen.queryByText("✓ Lesson complete. Nice work putting it together."),
    ).not.toBeInTheDocument();
  },
);

test.each(Object.entries(legacyRoutes))(
  "legacy route %s redirects to %s",
  async (path, id) => {
    mount(path);
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: lessons.find((l) => l.id === id).title,
      }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.queryByText("Loading interactive lab…"),
      ).not.toBeInTheDocument(),
    );
  },
);

test("completion requires exploration and passing both assessments, persists and can be reset", async () => {
  const view = mount("/learn/state");
  await screen.findByRole("button", { name: "Increment" });
  const practice = within(document.getElementById("practice"));
  userEvent.click(
    practice.getByRole("radio", { name: "onClick={setCount(count + 1)}" }),
  );
  userEvent.click(practice.getByRole("button", { name: "Check answer" }));
  expect(practice.getByText("Not quite. Try again.")).toBeInTheDocument();
  userEvent.click(
    practice.getByRole("radio", {
      name: "onClick={() => setCount(c => c + 1)}",
    }),
  );
  userEvent.click(practice.getByRole("button", { name: "Check answer" }));
  const check = within(document.getElementById("check"));
  userEvent.click(
    check.getByRole("radio", {
      name: "React needs a state update to request rendering",
    }),
  );
  userEvent.click(check.getByRole("button", { name: "Check answer" }));
  expect(
    screen.queryByText("✓ Lesson complete. Nice work putting it together."),
  ).not.toBeInTheDocument();
  userEvent.click(screen.getByRole("button", { name: "Increment" }));
  expect(
    screen.getByText("✓ Lesson complete. Nice work putting it together."),
  ).toBeInTheDocument();
  expect(
    JSON.parse(localStorage.getItem(PROGRESS_KEY)).lessons.state.attempts,
  ).toBe(3);
  view.unmount();
  mount("/learn/state");
  expect(
    screen.getByText("✓ Lesson complete. Nice work putting it together."),
  ).toBeInTheDocument();
  userEvent.click(
    screen.getByRole("button", { name: "Reset this lesson’s progress…" }),
  );
  userEvent.click(
    screen.getByRole("button", { name: "Confirm reset this lesson" }),
  );
  expect(
    screen.queryByText("✓ Lesson complete. Nice work putting it together."),
  ).not.toBeInTheDocument();
  await waitFor(() =>
    expect(
      screen.queryByText("Loading interactive lab…"),
    ).not.toBeInTheDocument(),
  );
});

test("bookmarks and theme persist across reloads", async () => {
  const view = mount("/learn/components");
  userEvent.click(screen.getByRole("button", { name: "☆ Bookmark" }));
  userEvent.click(screen.getByRole("button", { name: "Switch to dark theme" }));
  await waitFor(() =>
    expect(
      screen.queryByText("Loading interactive lab…"),
    ).not.toBeInTheDocument(),
  );
  view.unmount();
  mount("/progress");
  expect(
    screen.getByRole("button", { name: "Switch to light theme" }),
  ).toBeInTheDocument();
  expect(
    screen.getAllByRole("link", { name: "Components & JSX" }),
  ).toHaveLength(2);
});

test("corrupt and unavailable storage do not crash the workspace", () => {
  localStorage.setItem(PROGRESS_KEY, "{invalid");
  const storage = jest
    .spyOn(Storage.prototype, "setItem")
    .mockImplementation(() => {
      throw new Error("Storage denied");
    });
  mount();
  expect(
    screen.getByText(/Browser storage is unavailable/),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Start learning" }),
  ).toBeInTheDocument();
  storage.mockRestore();
});

test("unknown pages and lesson IDs provide a recovery link", () => {
  const view = mount("/does-not-exist");
  expect(
    screen.getByRole("link", { name: "Back to learning path" }),
  ).toBeInTheDocument();
  view.unmount();
  mount("/learn/does-not-exist");
  expect(
    screen.getByRole("heading", { name: "We couldn’t find that page." }),
  ).toBeInTheDocument();
});

test("nested route explorer follows parameters and URL filters", async () => {
  mount("/learn/routing");
  userEvent.click(
    await screen.findByRole("link", { name: "Open task explorer" }),
  );
  fireEvent.change(screen.getByLabelText("URL filter"), {
    target: { value: "open" },
  });
  expect(
    screen.queryByRole("link", { name: "Read about state · complete" }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByText("/learn/routing/tasks?filter=open"),
  ).toBeInTheDocument();
  userEvent.click(screen.getByRole("link", { name: "Learn JSX · open" }));
  expect(screen.getByText('{"taskId":"1"}')).toBeInTheDocument();
  userEvent.click(screen.getByRole("link", { name: "Back to explorer tasks" }));
  expect(screen.getByLabelText("URL filter")).toBeInTheDocument();
});

test("planner validates, adds, edits, filters, reloads, and deletes a task", async () => {
  const view = mount("/project/study-planner");
  userEvent.click(await screen.findByRole("button", { name: "Add task" }));
  expect(screen.getByRole("alert")).toHaveTextContent("Enter a task title.");
  userEvent.type(screen.getByLabelText("New task title"), "Study effects");
  userEvent.click(screen.getByRole("button", { name: "Add task" }));
  userEvent.click(screen.getByRole("link", { name: "Study effects" }));
  const input = await screen.findByLabelText("Edit task title");
  userEvent.clear(input);
  userEvent.type(input, "Review cleanup");
  userEvent.click(screen.getByRole("button", { name: "Save changes" }));
  userEvent.click(screen.getByLabelText("Task complete"));
  userEvent.click(screen.getByRole("link", { name: "Back to tasks" }));
  fireEvent.change(screen.getByLabelText("Filter tasks"), {
    target: { value: "done" },
  });
  expect(
    screen.getByRole("link", { name: "Review cleanup" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: "Build my first component" }),
  ).not.toBeInTheDocument();
  const stored = JSON.parse(localStorage.getItem(PLANNER_KEY));
  const task = stored.find((t) => t.title === "Review cleanup");
  expect(task.done).toBe(true);
  view.unmount();
  mount("/project/study-planner/tasks/" + task.id);
  expect(await screen.findByLabelText("Edit task title")).toHaveValue(
    "Review cleanup",
  );
  userEvent.click(screen.getByRole("button", { name: "Delete task…" }));
  userEvent.click(screen.getByRole("button", { name: "Confirm delete task" }));
  expect(
    screen.getByRole("heading", { name: "Task not found" }),
  ).toBeInTheDocument();
});

test("mobile demo tabs support keyboard selection without losing demo state", async () => {
  window.matchMedia = jest.fn((query) => ({
    matches: query.includes("760px"),
    media: query,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    },
  }));
  mount("/learn/state");
  userEvent.click(await screen.findByRole("button", { name: "Increment" }));
  const demoTab = screen.getByRole("tab", { name: "Live demo" });
  fireEvent.keyDown(demoTab, { key: "ArrowRight" });
  expect(screen.getByRole("tab", { name: "Code excerpt" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  expect(document.getElementById("panel-demo")).not.toBeVisible();
  fireEvent.keyDown(screen.getByRole("tab", { name: "Code excerpt" }), {
    key: "ArrowLeft",
  });
  expect(document.getElementById("panel-demo")).toBeVisible();
  expect(
    within(document.getElementById("panel-demo")).getByText("1"),
  ).toBeInTheDocument();
  cleanup();
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    },
  });
});
