import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetch('/posts.json')
            .then((response) => {
            if (!response.ok)
                throw new Error('Failed to load posts.');
            return response.json();
        })
            .then((data) => {
            setPosts(data);
            setError(null);
        })
            .catch((err) => setError(err.message));
    }, []);
    if (error)
        return _jsx("div", { className: "text-center text-neonGreen", children: error });
    if (!posts.length)
        return _jsx("div", { className: "text-center text-neonGreen", children: "Loading blog posts..." });
    return (_jsx("main", { className: "bg-gray-900 text-neonGreen px-4 py-8", children: _jsxs("section", { className: "max-w-5xl mx-auto", children: [_jsx("h1", { className: "text-4xl font-bold mb-6 text-center", children: "Blog" }), _jsx("ul", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: posts.map((post) => (_jsx("li", { className: "bg-darkGray rounded-lg overflow-hidden shadow-lg", children: _jsxs("div", { className: "p-4", children: [_jsx("h2", { className: "text-2xl font-bold mb-2", children: post.title }), _jsxs("p", { className: "text-sm text-gray-400", children: [post.date, " \u2022 ", post.readTime, " \u2022 ", post.author] }), _jsx("p", { className: "text-base my-2", children: post.summary }), _jsx(Link, { to: `/blog/${post.slug}`, className: "text-neonGreen underline hover:text-gray-300", children: "Read More" })] }) }, post.slug))) })] }) }));
};
export default Blog;
