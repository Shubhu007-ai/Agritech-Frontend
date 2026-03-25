import { createContext, useState, useEffect } from "react";
import "../theme/index.css";

import lightTheme from "../theme/light.css?inline";
import darkTheme from "../theme/dark.css?inline";

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const css = theme === "light" ? lightTheme : darkTheme;

    // Remove previous theme if exists
    const oldStyle = document.getElementById("dynamic-theme");
    if (oldStyle) oldStyle.remove();

    // Inject new theme
    const style = document.createElement("style");
    style.id = "dynamic-theme";
    style.textContent = css;
    document.head.appendChild(style);

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}