import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Projects = () => {
    const projects = [
        {
            id: 1,
            title: "Portfolio Website",
            description: "A personal portfolio showcasing my skills and projects.",
            link: "/projects/1",
        },
        {
            id: 2,
            title: "E-Commerce App",
            description: "An online store built with React and Tailwind CSS.",
            link: "/projects/2",
        },
    ];
    return (_jsx("main", { className: "bg-gray-900 text-neon-green px-4 py-8", children: _jsxs("section", { className: "max-w-5xl mx-auto", children: [_jsx("h1", { className: "text-3xl sm:text-4xl font-bold mb-6 text-center", children: "My Projects" }), _jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: projects.map((project) => (_jsxs("div", { className: "bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg", children: [_jsx("h2", { className: "text-xl font-bold mb-2", children: project.title }), _jsx("p", { className: "text-sm mb-4", children: project.description }), _jsx("a", { href: project.link, className: "text-neon-green underline hover:text-gray-300", children: "Learn More" })] }, project.id))) })] }) }));
};
export default Projects;
