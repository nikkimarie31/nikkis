import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Projects from './pages/Projects';
import './styles/index.css';
const App = () => {
    return (_jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Layout, { children: _jsx(Home, {}) }) }), _jsx(Route, { path: "/about", element: _jsx(Layout, { children: _jsx(About, {}) }) }), _jsx(Route, { path: "/contact", element: _jsx(Layout, { children: _jsx(Contact, {}) }) }), _jsx(Route, { path: "/blog", element: _jsx(Layout, { children: _jsx(Blog, {}) }) }), _jsx(Route, { path: "/projects", element: _jsx(Layout, { children: _jsx(Projects, {}) }) })] }) }));
};
export default App;
