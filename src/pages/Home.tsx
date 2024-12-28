import { motion } from "framer-motion";
import Hero from "../components/Hero";

const Home = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen flex flex-col items-center justify-center bg-darkGray text-white"
        >
            {/* Hero Section */}
            <Hero />

            {/* Featured Projects Section */}
            <section className="bg-darkGray text-neonGreen py-12 px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Featured Projects</h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                    {/* Project One */}
                    <div className="bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                        <h3 className="text-xl font-bold mb-2 text-neonGreen">Project One: Website Fullstack Development</h3>
                        <p className="text-sm text-gray-300 mb-4">
                            I recently built a website, or started to build a website called Red Hot Transports. During
                            construction of the website, the owner had a change of heart due to not being able to start the
                            business in general. I barely got started with it, but the basics are started, and it doesn't
                            look that bad.
                        </p>
                        <a
                            href="/projects"
                            className="inline-block px-6 py-3 bg-neonGreen text-darkGray font-bold rounded-lg hover:bg-darkGray hover:text-neonGreen border border-neonGreen transition-all duration-300"
                        >
                            Learn More
                        </a>
                    </div>

                    {/* Project Two */}
                    <div className="bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                        <h3 className="text-2xl font-bold mb-3 text-white">Project Two</h3>
                        <p className="text-sm text-gray-300 mb-4">
                            A brief description of your project.
                        </p>
                        <a
                            href="/projects"
                            className="inline-block px-6 py-3 bg-neonGreen text-darkGray font-bold rounded-lg hover:bg-darkGray hover:text-neonGreen border border-neonGreen transition-all duration-300"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default Home;
