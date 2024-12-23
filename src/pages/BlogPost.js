import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
const BlogPost = () => {
    const { slug } = useParams(); // Get the slug from the URL.
    const posts = [
        {
            slug: "react-tips-and-tricks",
            title: "React Tips and Tricks",
            content: "Here is the full content of the React Tips and Tricks post...",
        },
        {
            slug: "building-responsive-websites",
            title: "Building Responsive Websites",
            content: "Here is the full content of the Building Responsive Websites post...",
        },
        {
            slug: "accessing-the-web",
            title: "Accessing The Web",
            content: "",
        },
        {
            slug: "dark-web-purchases",
            title: "Dark Web Purchases",
            content: "",
        },
        {
            slug: "dating-a-narcissist",
            title: "Dating A Narcissist",
            content: "",
        },
    ];
    const post = posts.find((p) => p.slug === slug);
    if (!post) {
        return _jsx("div", { className: "text-center mt-10 text-neon-green", children: "Post Not Found" });
    }
    return (_jsx("main", { className: "bg-gray-900 text-neon-green px-4 py-8", children: _jsxs("section", { className: "max-w-4xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold mb-4", children: post.title }), _jsx("p", { children: post.content })] }) }));
};
export default BlogPost;
