import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button style={{ padding: "12px", borderRadius: "30px", width: "3em", background: "#f9912f" }} onClick={toggleTheme}>
     {theme === "light" ? <FaMoon /> : <FaSun />}
    </button>
  );
}