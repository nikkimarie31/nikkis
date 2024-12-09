import Hero from "../components/Hero";

const Home = () => {
  return (
    <div>
      <Hero />
      <section className="text-center px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Explore My Work</h2>
        <p className="text-lg">
          Check out my projects to see what I’ve been working on!
        </p>
        <a
          href="/projects"
          className="inline-block mt-4 px-6 py-3 bg-neon-green text-gray-900 rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
          aria-label="Go to Projects Page"
        >
          View Projects
        </a>
      </section>
    </div>
  );
};

export default Home;
