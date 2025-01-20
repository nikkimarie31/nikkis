import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
const Home = () => {
    return (_jsx("main", { className: "bg-gray-900 text-neonGreen min-h-screen flex items-center justify-center", children: _jsxs("section", { className: "text-center", children: [_jsx("h1", { className: "text-6xl font-bold neon-title mb-6", children: "FULL STACK WEB DEVELOPER" }), _jsx("p", { className: "text-xl mb-8", children: "Crafting modern, interactive, and responsive web experiences that bring ideas to life." }), _jsx(Link, { to: "/blog", className: "bg-neonGreen text-darkGray py-3 px-6 rounded-lg text-lg font-bold hover:bg-gray-700 hover:text-neonGreen transition-all", children: "View My Blog" })] }) }));
};
export default Home;
