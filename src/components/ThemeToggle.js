import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
const ThemeToggle = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    useEffect(() => {
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);
    return (_jsx("button", { onClick: () => setTheme(theme === 'light' ? 'dark' : 'light'), className: "p-2 bg-gray-700 text-neonGreen rounded-full hover:bg-gray-500 transition-all", children: theme === 'light' ? _jsx(FaMoon, {}) : _jsx(FaSun, {}) }));
};
export default ThemeToggle;
