import Hero from "../components/Hero";

const Home = () => {
    return (
        <div>
            <Hero />
            <section className="bg-gray-800 text-neon-green py-8 px-4">
                <h2 className="text-2xl font-bold text-center mb-6">Featured Projects</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                    <div className="bg-gray-700 p-4 rounded-lg shadow hover:shadow-lg">
                        <h3 className="text-xl font-bold mb-2">Project One: Website Fullstack Development</h3>
                        <p className="text-sm mb-4">I recently built a website, or started to build a website called red hot transports. During construction of the website the owner had a change of heart due to not being able to start the business in general. I barely got started with it but the basics is started and it doesn't look that bad.</p>
                        <a
                            href="/projects"
                            className="text-neon-green underline hover:text-gray-300"
                        >
                            Learn More
                        </a>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg shadow hover:shadow-lg">
                        <h3 className="text-xl font-bold mb-2">Project Two</h3>
                        <p className="text-sm mb-4">A brief description of your project.</p>
                        <a
                            href="/projects"
                            className="text-neon-green underline hover:text-gray-300"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
