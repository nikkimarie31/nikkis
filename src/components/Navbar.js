import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (_jsxs("nav", { className: "bg-gray-900 text-neonGreen p-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Nikki's Portfolio" }), _jsx("button", { className: "block lg:hidden", onClick: () => setIsOpen(!isOpen), children: _jsx("span", { className: "text-3xl", children: "\u2630" }) })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("ul", { className: `lg:flex space-x-4 mt-4 lg:mt-0 ${isOpen ? 'block' : 'hidden'}`, children: [_jsx("li", { children: _jsx(NavLink, { to: "/", className: ({ isActive }) => `px-4 py-2 hover:text-gray-300 ${isActive ? 'font-bold' : ''}`, children: "Home" }) }), _jsx("li", { children: _jsx(NavLink, { to: "/about", className: ({ isActive }) => `px-4 py-2 hover:text-gray-300 ${isActive ? 'font-bold' : ''}`, children: "About" }) }), _jsx("li", { children: _jsx(NavLink, { to: "/contact", className: ({ isActive }) => `px-4 py-2 hover:text-gray-300 ${isActive ? 'font-bold' : ''}`, children: "Contact" }) }), _jsx("li", { children: _jsx(NavLink, { to: "/blog", className: ({ isActive }) => `px-4 py-2 hover:text-gray-300 ${isActive ? 'font-bold' : ''}`, children: "Blog" }) }), _jsx("li", { children: _jsx(NavLink, { to: "/projects", className: ({ isActive }) => `px-4 py-2 hover:text-gray-300 ${isActive ? 'font-bold' : ''}`, children: "Projects" }) })] }), _jsx(ThemeToggle, {})] })] }));
};
export default Navbar;
