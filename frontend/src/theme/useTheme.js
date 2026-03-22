import { useEffect, useState } from "react";
import {
  THEME_CHANGED_EVENT,
  getCurrentTheme,
  toggleTheme,
} from "./theme";

export default function useTheme() {
  const [theme, setTheme] = useState(getCurrentTheme());

  useEffect(() => {
    const onThemeChanged = (e) => {
      const next = e?.detail?.theme;
      if (next === "dark" || next === "light") setTheme(next);
      else setTheme(getCurrentTheme());
    };

    window.addEventListener(THEME_CHANGED_EVENT, onThemeChanged);
    return () => window.removeEventListener(THEME_CHANGED_EVENT, onThemeChanged);
  }, []);

  return { theme, toggleTheme };
}

