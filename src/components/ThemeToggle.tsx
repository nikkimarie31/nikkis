import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    // Remove any existing theme class before applying the new one
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);

    // Save to localStorage so it persists
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 bg-gray-700 text-neonGreen rounded-full hover:bg-gray-500 transition-all"
    >
      {theme === "light" ? <FaMoon /> : <FaSun />}
    </button>
  );
};

export default ThemeToggle;
