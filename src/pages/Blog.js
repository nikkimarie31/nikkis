import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
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
    const categories = Array.from(new Set(posts.map((post) => post.category)));
    const filteredPosts = selectedCategory
        ? posts.filter((post) => post.category === selectedCategory)
        : posts;
    if (error)
        return _jsx("div", { className: "text-center text-neonGreen", children: error });
    if (!posts.length)
        return _jsx("div", { className: "text-center text-neonGreen", children: "Loading blog posts..." });
    return (_jsx("main", { className: "bg-gray-900 text-neonGreen px-4 py-8", children: _jsxs("section", { className: "max-w-5xl mx-auto", children: [_jsx("h1", { className: "text-4xl font-bold mb-6 text-center", children: "Blog" }), _jsxs("div", { className: "flex gap-4 mb-8 justify-center", children: [_jsx("button", { onClick: () => setSelectedCategory(null), className: `px-4 py-2 rounded-lg ${!selectedCategory ? 'bg-neonGreen text-darkGray' : 'bg-gray-800'}`, children: "All" }), categories.map((category) => (_jsx("button", { onClick: () => setSelectedCategory(category), className: `px-4 py-2 rounded-lg ${selectedCategory === category ? 'bg-neonGreen text-darkGray' : 'bg-gray-800'}`, children: category }, category)))] }), filteredPosts.length > 0 && (_jsxs("div", { className: "mb-10", children: [_jsx("h2", { className: "text-3xl font-bold mb-4", children: "Featured Post" }), _jsxs("div", { className: "bg-darkGray p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow", children: [_jsx("h3", { className: "text-2xl font-semibold", children: filteredPosts[0]?.title }), _jsxs("p", { className: "text-sm text-gray-400", children: [filteredPosts[0]?.date, " \u2022 ", filteredPosts[0]?.readTime, " \u2022 ", filteredPosts[0]?.author] }), _jsx("p", { className: "mt-4 text-base", children: filteredPosts[0]?.summary }), _jsx(Link, { to: `/blog/${filteredPosts[0]?.slug}`, className: "text-neonGreen underline mt-4 block", children: "Read More" })] })] })), _jsx("ul", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: filteredPosts.slice(1).map((post) => (_jsx(motion.li, { whileHover: { scale: 1.05 }, className: "bg-darkGray rounded-lg overflow-hidden shadow-lg", children: _jsxs("div", { className: "p-4", children: [_jsx("h2", { className: "text-2xl font-bold mb-2", children: post.title }), _jsxs("p", { className: "text-sm text-gray-400", children: [post.date, " \u2022 ", post.readTime, " \u2022 ", post.author] }), _jsx("p", { className: "text-base my-2", children: post.summary }), _jsx(Link, { to: `/blog/${post.slug}`, className: "text-neonGreen underline hover:text-gray-300", children: "Read More" })] }) }, post.slug))) })] }) }));
};
export default Blog;
