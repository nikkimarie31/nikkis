import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub-flavored markdown (optional)
const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetch('/posts.json')
            .then((response) => {
            if (!response.ok)
                throw new Error('Failed to load posts.');
            return response.json();
        })
            .then((data) => {
            const foundPost = data.find((p) => p.slug === slug);
            if (!foundPost)
                throw new Error('Post not found.');
            setPost(foundPost);
            setError(null);
        })
            .catch((err) => setError(err.message));
    }, [slug]);
    if (error)
        return _jsx("div", { className: "text-center text-neonGreen", children: error });
    if (!post)
        return _jsx("div", { className: "text-center text-neonGreen", children: "Loading blog post..." });
    return (_jsx("main", { className: "bg-gray-900 text-neonGreen px-4 py-8", children: _jsxs("section", { className: "max-w-4xl mx-auto", children: [_jsx(Link, { to: "/blog", className: "text-gray-400 hover:text-neonGreen underline mb-4 block", children: "\u2190 Back to Blog" }), _jsx("h1", { className: "text-4xl font-bold mb-2", children: post.title }), _jsxs("p", { className: "text-sm text-gray-400 mb-4", children: [post.date, " \u2022 ", post.readTime, " \u2022 ", post.author] }), _jsx("article", { className: "prose prose-lg prose-invert", children: _jsx(ReactMarkdown, { remarkPlugins: [remarkGfm], children: post.content }) }), _jsx("div", { className: "mt-4", children: post.tags.map((tag) => (_jsxs("span", { className: "bg-gray-700 text-neonGreen px-2 py-1 rounded-full text-sm mr-2", children: ["#", tag] }, tag))) })] }) }));
};
export default BlogPost;
