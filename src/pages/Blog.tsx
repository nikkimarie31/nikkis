

const Blog = () => {
    const posts = [
        {
            id: 1,
            title: "React Tips and Tricks",
            summary: "Improve your React skills with these tips 10 tips.",
            date: "Dec 10, 2024",
            link: "/blog/react-tips-and-tricks",
        },
        {
            id: 2,
            title: "Building Responsive Websites",
            summary: "Learn how to make your skills mobile-friendly in just 5 easy steps",
            date: "Dec 5, 2024",
            link: "/blog/building-responsive-websites",
        },
        {
            id: 3,
            title: "Accessing The Deep Web and The Dark Web",
            summary: "Learn how to access the Deep Web with Anonymity and Security Free",
            date: "Dec 2, 2024",
            link: "/blog/accessing-the-web",
        },
        {
            id: 4,
            title: "What I Couldn't Find Easily About Purchasing On the Dark Web",
            summary: "Hours of my research put inside one blog.",
            date: "Nov 24th, 2024",
            link: "/blog/dark-web-purchases",
        },
        {
            id: 5,
            title: "Dating A Narcissist",
            summary: "5 Reasons I know I'm with a narcissist and how you can tell if you are with one too.",
            date: "Nov 20th, 2024",
            link: "/blog/dating-a-narcissist",
        }
    ]
    return (
        <main className="bg-gray-900 text-neon-green px-4 py-8">
            <section className="max-w-5xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">Blog</h1>
                <ul>
                    {posts.map((post) => (
                        <li key={post.id} className="mb-6">
                            <h2 className="text-2xl font-bold">{post.title}</h2>
                            <p className="text-sm text-gray-400">{post.date}</p>
                            <p className="text-sm mb-4">{post.summary}</p>
                            <a
                                href={post.link}
                                className="text-neon-green underline hover:text-gray-300"
                            >
                                Read More...
                            </a>
                        </li>
                    ))}
                </ul>
            </section>

        </main>
    );
};

export default Blog;