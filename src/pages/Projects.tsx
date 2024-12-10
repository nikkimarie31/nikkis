import { motion } from "framer-motion";

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "Portfolio Website",
      description: "A personal portfolio showcasing my skills.",
    },
    {
      id: 2,
      title: "E-Commerce App",
      description: "An online store built with React and Tailwind CSS.",
    },
  ];

  return (
    <main className="bg-gray-900 text-neon-green px-4 py-8">
      <section className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
          My Projects
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <h2 className="text-xl font-bold mb-2">{project.title}</h2>
              <p className="text-sm mb-4">{project.description}</p>
              <a
                href="#"
                className="text-neon-green underline hover:text-gray-300"
              >
                Learn More
              </a>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Projects;
