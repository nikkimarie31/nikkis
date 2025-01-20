import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <main className="bg-gray-900 text-neonGreen min-h-screen flex items-center justify-center">
      <section className="text-center">
        <h1 className="text-6xl font-bold neon-title mb-6">
          FULL STACK WEB DEVELOPER
        </h1>
        <p className="text-xl mb-8">
          Crafting modern, interactive, and responsive web experiences that bring ideas to life.
        </p>
        <Link
          to="/blog"
          className="bg-neonGreen text-darkGray py-3 px-6 rounded-lg text-lg font-bold hover:bg-gray-700 hover:text-neonGreen transition-all"
        >
          View My Blog
        </Link>
      </section>
    </main>
  );
};

export default Home;
