import { motion } from "framer-motion";


const Hero = () => {
  return (
    <motion.header
      className="bg-gray-900 text-neon-green min-h-screen flex flex-col items-center justify-center text-center px-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold glow">
        FULL STACK WEB DEVELOPER
      </h1>
      <p className="mt-4 text-sm sm:text-lg md:text-xl max-w-lg">
        Crafting modern, interactive, and responsive web experiences that bring ideas to life.
      </p>
      <div className="mt-6">
        <a
          href="/projects"
          className="px-6 py-3 bg-neon-green text-gray-900 rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
        >
          View My Projects
        </a>
      </div>
    </motion.header>
  );
};

export default Hero;
