import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
const Hero = () => {
    return (_jsxs(motion.header, { className: "bg-gray-900 text-neon-green min-h-screen flex flex-col items-center justify-center text-center px-4", initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1 }, children: [_jsx("h1", { className: "text-3xl sm:text-5xl md:text-6xl font-bold glow", children: "FULL STACK WEB DEVELOPER" }), _jsx("p", { className: "mt-4 text-sm sm:text-lg md:text-xl max-w-lg", children: "Crafting modern, interactive, and responsive web experiences that bring ideas to life." }), _jsx("div", { className: "mt-6", children: _jsx("a", { href: "/projects", className: "px-6 py-3 bg-neon-green text-gray-900 rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300", children: "View My Projects" }) })] }));
};
export default Hero;
