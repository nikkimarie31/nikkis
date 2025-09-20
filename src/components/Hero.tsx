import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <motion.header
      className="hero"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Theme Toggle in top right corner */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>
      
      <div className="relative z-10">
        <motion.h1 
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-wide text-babyBlue mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          FULL STACK WEB DEVELOPER <br />
          <span className="text-babyBlue">| UX DESIGNER</span>
        </motion.h1>
        
        <motion.p 
          className="text-lg sm:text-xl md:text-2xl text-gray-300 dark:text-gray-300 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Crafting modern, interactive, and responsive web experiences that bring ideas to life.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <button
            onClick={() => navigate("/home")}
            className="btn-primary text-lg font-bold mr-4"
          >
            Enter My Website
          </button>
          
          <button
            onClick={() => navigate("/projects")}
            className="btn-secondary text-lg font-bold"
          >
            View Projects
          </button>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Hero;