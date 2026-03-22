const THEME_STORAGE_KEY = "e4fun.theme";
const THEME_CHANGED_EVENT = "e4fun-theme-change";

function getSystemTheme() {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme() {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

function setDarkClass(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function updateThemeColorMeta(theme) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;

  // Choose a light/dark compatible browser chrome color.
  meta.setAttribute("content", theme === "dark" ? "#0f172a" : "#ffffff");
}

function dispatchThemeChanged(theme) {
  window.dispatchEvent(new CustomEvent(THEME_CHANGED_EVENT, { detail: { theme } }));
}

export function getCurrentTheme() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function getResolvedTheme() {
  const stored = getStoredTheme();
  if (stored === "dark" || stored === "light") return stored;
  return getSystemTheme();
}

export function setThemeOverride(theme) {
  if (theme !== "dark" && theme !== "light") return;
  setDarkClass(theme);
  updateThemeColorMeta(theme);

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage errors (private mode, blocked storage, etc.)
  }

  dispatchThemeChanged(theme);
}

export function clearThemeOverride() {
  try {
    window.localStorage.removeItem(THEME_STORAGE_KEY);
  } catch {
    // Ignore
  }

  const nextTheme = getSystemTheme();
  setDarkClass(nextTheme);
  updateThemeColorMeta(nextTheme);
  dispatchThemeChanged(nextTheme);
}

export function toggleTheme() {
  const current = getCurrentTheme();
  const next = current === "dark" ? "light" : "dark";
  setThemeOverride(next);
  return next;
}

export function initTheme() {
  const stored = getStoredTheme();

  if (stored === "dark" || stored === "light") {
    setDarkClass(stored);
    updateThemeColorMeta(stored);
    dispatchThemeChanged(stored);
    return;
  }

  // No override: follow system preference and keep it updated.
  const systemTheme = getSystemTheme();
  setDarkClass(systemTheme);
  updateThemeColorMeta(systemTheme);
  dispatchThemeChanged(systemTheme);

  if (typeof window === "undefined" || !window.matchMedia) return;
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const onChange = () => {
    // If user later overrides, don't auto-update.
    const currentStored = getStoredTheme();
    if (currentStored === "dark" || currentStored === "light") return;

    const next = getSystemTheme();
    setDarkClass(next);
    updateThemeColorMeta(next);
    dispatchThemeChanged(next);
  };

  // Back-compat for older browsers.
  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", onChange);
  } else if (typeof media.addListener === "function") {
    media.addListener(onChange);
  }
}

export { THEME_CHANGED_EVENT, THEME_STORAGE_KEY };

