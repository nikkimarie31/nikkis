import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Projects from './pages/Projects';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import './styles/index.css';
const AppContent = () => {
    const location = useLocation();
    return (_jsx(AnimatePresence, { mode: "wait", children: _jsxs(Routes, { location: location, children: [_jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/home", element: _jsx(Layout, { children: _jsx(Home, {}) }) }), _jsx(Route, { path: "/about", element: _jsx(Layout, { children: _jsx(About, {}) }) }), _jsx(Route, { path: "/contact", element: _jsx(Layout, { children: _jsx(Contact, {}) }) }), _jsx(Route, { path: "/projects", element: _jsx(Layout, { children: _jsx(Projects, {}) }) }), _jsx(Route, { path: "/login", element: _jsx(Layout, { children: _jsx(Login, {}) }) }), _jsx(Route, { path: "/signup", element: _jsx(Layout, { children: _jsx(Signup, {}) }) }), _jsx(Route, { path: "/reset-password", element: _jsx(Layout, { children: _jsx(ResetPassword, {}) }) }), _jsx(Route, { path: "/blog", element: _jsx(Layout, { children: _jsx(Blog, {}) }) }), _jsx(Route, { path: "/blog/:slug", element: _jsx(Layout, { children: _jsx(BlogPost, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Layout, { children: _jsx(NotFound, {}) }) })] }, location.pathname) }));
};
const App = () => {
    return (_jsx(Router, { children: _jsx(AppContent, {}) }));
};
export default App;
