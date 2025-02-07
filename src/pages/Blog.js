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
            // Sort posts by date (newest first)
            const sortedPosts = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setPosts(sortedPosts);
            setError(null);
        })
            .catch((err) => setError(err.message));
    }, []);
    const categories = Array.from(new Set(posts.map((post) => post.category)));
    // Filter posts based on selected category
    const filteredPosts = selectedCategory
        ? posts.filter((post) => post.category === selectedCategory)
        : posts;
    // Set the most recent post as featured and the rest as regular posts
    const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
    const remainingPosts = filteredPosts.slice(1);
    if (error)
        return _jsx("div", { className: "text-center text-neonGreen", children: error });
    if (!posts.length)
        return _jsx("div", { className: "text-center text-neonGreen", children: "Loading blog posts..." });
    return (_jsx("main", { className: "bg-gray-900 text-neonGreen px-4 py-8", children: _jsxs("section", { className: "max-w-5xl mx-auto", children: [_jsx("h1", { className: "text-4xl font-bold mb-6 text-center", children: "Blog" }), _jsxs("div", { className: "flex flex-wrap gap-4 mb-8 justify-center", children: [_jsx("button", { onClick: () => setSelectedCategory(null), className: `px-4 py-2 rounded-lg ${!selectedCategory ? 'bg-neonGreen text-darkGray' : 'bg-gray-800'}`, children: "All" }), categories.map((category) => (_jsx("button", { onClick: () => setSelectedCategory(category), className: `px-4 py-2 rounded-lg ${selectedCategory === category ? 'bg-neonGreen text-darkGray' : 'bg-gray-800'}`, children: category }, category)))] }), featuredPost && selectedCategory === null && (_jsxs("div", { className: "mb-10", children: [_jsx("h2", { className: "text-3xl font-bold mb-4", children: "Featured Post" }), _jsxs("div", { className: "blog-card", children: [_jsx("h3", { className: "text-xl font-semibold", children: featuredPost.title }), _jsxs("p", { className: "meta text-gray-400", children: [featuredPost.date, " \u2022 ", featuredPost.readTime, " \u2022 ", featuredPost.author] }), _jsx("p", { className: "mt-2", children: featuredPost.summary }), _jsx(Link, { to: `/blog/${featuredPost.slug}`, className: "text-neonGreen underline mt-4 block", children: "Read More" })] })] })), _jsx("div", { className: "blog-card-container", children: remainingPosts.map((post) => (_jsxs(motion.div, { whileHover: { scale: 1.05 }, className: "blog-card", children: [_jsx("h2", { className: "text-xl font-semibold", children: post.title }), _jsxs("p", { className: "meta text-gray-400", children: [post.date, " \u2022 ", post.readTime, " \u2022 ", post.author] }), _jsx("p", { className: "mt-2", children: post.summary }), _jsx(Link, { to: `/blog/${post.slug}`, className: "text-neonGreen underline", children: "Read More" })] }, post.slug))) }), filteredPosts.length === 0 && (_jsx("div", { className: "text-center text-gray-400 mt-8", children: "No posts found for this category." }))] }) }));
};
export default Blog;
