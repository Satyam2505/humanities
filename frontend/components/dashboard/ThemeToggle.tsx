"use client";

/**
 * The label is driven by CSS off the data-theme attribute rather than React
 * state, so it is correct at first paint. Deriving it from state made the
 * server render "Dark" and then flip to "Light" after hydration whenever a
 * stored dark preference was in play.
 */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("atlas-theme", next);
    } catch {
      // Private mode or blocked storage: the choice just will not persist.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className="shrink-0 whitespace-nowrap rounded-sm border border-border px-3 py-1.5 text-fluid-sm font-medium text-ink-soft outline-none transition-colors hover:border-border-strong hover:text-ink focus-visible:ring-2 focus-visible:ring-accent"
    >
      <span data-theme-label="to-dark">Dark</span>
      <span data-theme-label="to-light">Light</span>
    </button>
  );
}
