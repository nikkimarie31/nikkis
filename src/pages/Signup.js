import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const handleSignup = (e) => {
        e.preventDefault();
        // Dummy validation
        if (!username || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        setError(null);
        alert(`Account created for ${username}! (This is a frontend-only page.)`);
    };
    return (_jsx(motion.main, { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "min-h-screen bg-gray-900 flex items-center justify-center", children: _jsxs("div", { className: "bg-darkGray text-neonGreen p-8 rounded-lg shadow-lg max-w-md w-full", children: [_jsx("h1", { className: "text-3xl font-bold text-center mb-6", children: "Sign Up" }), error && (_jsx("div", { className: "bg-red-600 text-white text-sm p-2 rounded mb-4", children: error })), _jsxs("form", { className: "space-y-4", onSubmit: handleSignup, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "username", className: "block text-sm font-medium", children: "Username" }), _jsx("input", { type: "text", id: "username", name: "username", className: "mt-1 block w-full bg-gray-800 text-neonGreen border border-gray-700 rounded-md shadow-sm focus:ring-neonGreen focus:border-neonGreen", placeholder: "Enter your username", value: username, onChange: (e) => setUsername(e.target.value), required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium", children: "Email Address" }), _jsx("input", { type: "email", id: "email", name: "email", className: "mt-1 block w-full bg-gray-800 text-neonGreen border border-gray-700 rounded-md shadow-sm focus:ring-neonGreen focus:border-neonGreen", placeholder: "Enter your email", value: email, onChange: (e) => setEmail(e.target.value), required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium", children: "Password" }), _jsx("input", { type: "password", id: "password", name: "password", className: "mt-1 block w-full bg-gray-800 text-neonGreen border border-gray-700 rounded-md shadow-sm focus:ring-neonGreen focus:border-neonGreen", placeholder: "Enter your password", value: password, onChange: (e) => setPassword(e.target.value), required: true })] }), _jsx("button", { type: "submit", className: "w-full bg-neonGreen text-darkGray py-2 px-4 rounded-md font-bold hover:bg-gray-700 hover:text-neonGreen transition-all", children: "Sign Up" })] })] }) }));
};
export default Signup;
