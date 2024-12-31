import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
const NotFound = () => {
    return (_jsxs("div", { className: 'h-screen flex flex-col items-center justify-center bg-darkGray text-white', children: [_jsx("h1", { className: 'text-5xl font-bold text-neonGreen mb-4', children: "404" }), _jsx("p", { className: 'text-lg', children: "Oops! The Page you're looking for doesn't exist." }), _jsx(Link, { to: '/', className: 'mt-6 px-6 py-3 bg-neonGreen text-darkGray rounded-full font-bold', children: "Go Back Home" })] }));
};
export default NotFound;
