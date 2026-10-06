const { test, expect } = require("@playwright/test");

test("learning flow, keyboard access, themes, and persisted completion", async ({
  page,
}, testInfo) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Understand React.",
  );
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.getByRole("heading", { level: 1 }).click();
  await page.evaluate(() => document.fonts.ready);
  const skyControls = page.getByRole("group", { name: "Studio sky" });
  await skyControls.getByRole("button", { name: "dusk", exact: true }).click();
  await expect(
    page.getByRole("img", { name: /^dusk at a coastal/ }),
  ).toBeVisible();
  await skyControls.getByRole("button", { name: "night", exact: true }).click();
  await expect(
    skyControls.getByRole("button", { name: "night", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("button", { name: "Switch to dark theme" }),
  ).toBeVisible();
  await skyControls.getByRole("button", { name: "day", exact: true }).click();
  await page.screenshot({
    path: testInfo.outputPath("dashboard-viewport.png"),
  });
  await page.screenshot({
    path: testInfo.outputPath("dashboard-light.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.screenshot({
    path: testInfo.outputPath("dashboard-dark.png"),
    fullPage: true,
  });
  const levels = page.getByRole("group", { name: "Filter lessons by level" });
  await levels
    .getByRole("button", { name: "Intermediate", exact: true })
    .click();
  await expect(page.getByText("6 lessons in your view")).toBeVisible();
  await levels.getByRole("button", { name: "All levels", exact: true }).click();
  await page.getByRole("searchbox").fill("Events & state");
  await page
    .getByRole("link")
    .filter({ has: page.getByRole("heading", { name: "Events & state" }) })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Events & state",
  );
  await page.getByRole("button", { name: "Increment", exact: true }).click();
  await page
    .locator("#practice")
    .getByRole("radio", {
      name: "onClick={() => setCount(c => c + 1)}",
      exact: true,
    })
    .check();
  await page
    .locator("#practice")
    .getByRole("button", { name: "Check answer" })
    .click();
  await page
    .locator("#check")
    .getByRole("radio", {
      name: "React needs a state update to request rendering",
    })
    .check();
  await page
    .locator("#check")
    .getByRole("button", { name: "Check answer" })
    .click();
  await expect(
    page.getByText("✓ Lesson complete. Nice work putting it together."),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("✓ Lesson complete. Nice work putting it together."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Switch to light theme" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "☆ Bookmark" }).click();
  if (testInfo.project.name === "mobile") {
    await page.getByRole("tab", { name: "Code excerpt" }).click();
    await expect(page.locator("#panel-code")).toBeVisible();
    await expect(page.locator("#panel-demo")).toBeHidden();
    await page.getByRole("tab", { name: "Live demo" }).click();
  }
  await page.screenshot({
    path: testInfo.outputPath("lesson.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page.evaluate(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
  ).toBe(true);
  await page.getByRole("link", { name: "My progress", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Look how far you’ve come." }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("capstone validates, saves, deep-links, filters, and recovers requests", async ({
  page,
}, testInfo) => {
  await page.goto("/project/study-planner");
  await page.getByRole("button", { name: "Add task", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveText("Enter a task title.");
  await page.getByLabel("New task title").fill("Build a useful app");
  await page.getByRole("button", { name: "Add task", exact: true }).click();
  await page
    .getByRole("link", { name: "Build a useful app", exact: true })
    .click();
  const detailURL = page.url();
  await page.getByLabel("Edit task title").fill("Understand cleanup");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByLabel("Task complete", { exact: true }).check();
  await page.reload();
  await expect(page.getByLabel("Edit task title")).toHaveValue(
    "Understand cleanup",
  );
  expect(page.url()).toBe(detailURL);
  await page.getByRole("link", { name: "Back to tasks", exact: true }).click();
  await page.getByLabel("Filter tasks").selectOption("done");
  await expect(page).toHaveURL(/filter=done/);
  await expect(
    page.getByRole("link", { name: "Understand cleanup", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Response scenario").selectOption("error");
  await expect(
    page.getByText("Could not load resources. The service simulated an error."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Retry successful request" }).click();
  await expect(
    page.getByRole("link", { name: /Writing markup with JSX/ }),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("planner.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("Effect lifecycle and lazy error boundary are usable", async ({
  page,
}) => {
  await page.goto("/learn/effects");
  await page.getByRole("button", { name: "Mount subscription" }).click();
  await page.getByRole("button", { name: "Send room message" }).click();
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "Hello from the event system!" }),
  ).toBeVisible();
  await page.getByLabel("Subscribed room").selectOption("Effects");
  await page.getByRole("button", { name: "Unmount subscription" }).click();
  await expect(
    page.getByRole("list", { name: "Effect lifecycle" }),
  ).toContainText("cleanup");
  await page.goto("/learn/reliability");
  await page.getByRole("button", { name: "Load lazy panel" }).click();
  await expect(
    page.getByRole("heading", { name: "Panel loaded" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Simulate render error" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "This panel could not render.",
  );
  await page.getByRole("button", { name: "Recover panel" }).click();
  await expect(
    page.getByRole("heading", { name: "Panel loaded" }),
  ).toBeVisible();
});

test("narrow and tablet layouts fit and lesson navigation returns to the top", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({
    width: testInfo.project.name === "mobile" ? 320 : 768,
    height: 900,
  });
  for (const route of [
    "/",
    "/learn/context",
    "/learn/effects",
    "/learn/memoization",
    "/project/study-planner/tasks",
  ]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Loading interactive lab…")).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      route,
    ).toBe(true);
  }
  await page.goto("/learn/state");
  await page
    .locator(".lesson-pagination")
    .getByRole("link", { name: "Conditions, lists & keys →" })
    .click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Conditions, lists & keys" }),
  ).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});
