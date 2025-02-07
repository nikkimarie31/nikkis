import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Navbar from "./Navbar";
const Layout = ({ children }) => {
    return (_jsxs("div", { className: "flex flex-col min-h-screen", children: [_jsx("a", { href: "#main-content", className: "absolute top-2 left-2 bg-neonGreen text-gray-900 px-4 py-2 rounded opacity-0 focus:opacity-100", children: "Skip to Main Content" }), _jsx(Navbar, {}), _jsx("main", { id: "main-content", className: "flex-grow", children: children }), _jsx("footer", { className: "bg-gray-800 text-center py-4 text-gray-400", children: _jsx("p", { children: "\u00A9 2024 In My Opinion. All rights reserved." }) })] }));
};
export default Layout;
