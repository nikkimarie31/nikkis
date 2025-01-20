import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
const LandingPage = () => {
    const navigate = useNavigate();
    return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gray-900 text-neonGreen text-center", children: [_jsx("h1", { className: "text-6xl font-bold neon-title mb-6", children: "FULL STACK WEB DEVELOPER" }), _jsx("p", { className: "text-xl mb-8", children: "Crafting modern, interactive, and responsive web experiences that bring ideas to life." }), _jsx("button", { onClick: () => navigate('/home'), className: "bg-neonGreen text-darkGray font-bold py-3 px-6 rounded-lg text-lg hover:bg-gray-700 hover:text-neonGreen transition-all", children: "Enter My Website" })] }));
};
export default LandingPage;
