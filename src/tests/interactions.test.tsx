import { it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { StoreProvider, STORAGE_KEY } from "../storage/store";
function mount(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <StoreProvider>
        <App />
      </StoreProvider>
    </MemoryRouter>,
  );
}
it("records a skill and lab, and keeps mastered at zero after remount", () => {
  const view = mount("/learn/python-core-l1");
  const select = screen.getAllByRole("combobox", { name: /Status for/ })[0];
  fireEvent.change(select, { target: { value: "learning" } });
  const step = screen.getAllByRole("checkbox")[0];
  fireEvent.click(step);
  const note = screen.getByRole("textbox", {
    name: "Your notes & evidence notes",
  });
  fireEvent.change(note, {
    target: { value: "Built a CLI and tested file loading." },
  });
  fireEvent.blur(note);
  const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
  expect(Object.values(persisted.skills)).toEqual([
    expect.objectContaining({ status: "learning" }),
  ]);
  expect(Object.values(persisted.labSteps)).toEqual([
    expect.objectContaining({ done: true }),
  ]);
  expect(persisted.evidence["python-core-l1"].notes).toContain("Built a CLI");
  view.unmount();
  mount("/learn/python-core-l1");
  expect(
    screen.getAllByRole("combobox", { name: /Status for/ })[0],
  ).toHaveValue("learning");
  expect(screen.getAllByRole("checkbox")[0]).toBeChecked();
  expect(screen.getByText(/0\/5 skills mastered/)).toBeInTheDocument();
});
it("searches deep skill text and exposes deferred AI", () => {
  const v = mount("/learn?q=transactions");
  expect(
    screen.getByRole("heading", { name: "Databases and Data Correctness" }),
  ).toBeInTheDocument();
  expect(
    screen
      .getAllByRole("link")
      .some((a) => a.getAttribute("href")?.includes("/learn/db-")),
  ).toBe(true);
  v.unmount();
  mount("/learn?q=agents&level=L3");
  expect(
    screen
      .getAllByText("Later specialization")
      .find((x) => x.tagName === "SPAN"),
  ).toBeInTheDocument();
  expect(
    screen
      .getAllByRole("link")
      .some((a) => a.getAttribute("href")?.includes("ai-agents-l3")),
  ).toBe(true);
});
it("updates project p3 without completing p2 or skills", () => {
  mount("/projects/p3");
  fireEvent.click(screen.getAllByRole("checkbox")[0]);
  const s = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
  expect(s.projectTasks["p3-task01"].done).toBe(true);
  expect(s.projectTasks["p2-task01"]).toBeUndefined();
  expect(s.skills).toEqual({});
});
