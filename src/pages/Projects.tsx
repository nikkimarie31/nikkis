import { motion } from "framer-motion";
import { useState } from "react";

const Projects = () => {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const projects = [
    {
      id: 1,
      title: "Recollect (Merit America)",
      description: "Capture life's most meaningful moments effortlessly. Log important events, track valuable lessons, and let AI uncover the connections between your experiences and the decisions you've made.",
      technologies: ["UX Research", "Persona Development", "Interactive Prototypes", "User Flow Analysis"],
      link: "https://docs.google.com/presentation/d/1_VKeFOd879A8nra16OeIVVWzZRjtgU0q0CxKwg4UZ3M/edit?usp=sharing",
      linkText: "View Case Study"
    },
    {
      id: 2,
      title: "Day-ja Merchandising",
      description: "A app that helps leads at apollo retail stores manage their merchandising tasks efficiently. It allows users to communicate with other leads at Fred Meyers and Kroger stores, ensuring that merchandising tasks are completed on time and to the highest standards.",
      technologies: ["React", "Team Communication", "Task Management", "Retail Operations"],
      link: "https://docs.google.com/presentation/d/1wLS33HV4SJ-X_94mjDLgFGIDgbwFnL2osDm6xmvhyPY/edit?usp=sharing",
      linkText: "Learn More"
    },
    {
      id: 3,
      title: "Clarity",
      description: "An app based off of the four agreements, specifically 'do not assume'. It walks you through a series of questions to help you clarify your thoughts and feelings about a situation, allowing you to gain a better understanding of yourself and your relationships.",
      technologies: ["Psychology", "Relationship Building", "Self-Reflection", "Communication"],
      link: "https://docs.google.com/presentation/d/1UN0ACHRm-WQk5LZ5Gxbg2k9YOG0v4OPPjpEDzw0l4mc/edit?usp=sharing",
      linkText: "Learn More"
    },
  ];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-16 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            My Projects
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A collection of projects showcasing my skills in web development, UX design, and problem-solving.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                {/* Project Title */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-babyBlue transition-colors duration-300">
                    {project.title}
                  </h3>
                  <div className="w-12 h-1 bg-babyBlue rounded-full"></div>
                </div>

                {/* Project Description */}
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Learn More Button */}
                <motion.a
                  href={project.link}
                  target={project.link.startsWith('http') ? "_blank" : "_self"}
                  rel={project.link.startsWith('http') ? "noopener noreferrer" : ""}
                  className="btn-primary text-center inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {project.linkText}
                  {project.link.startsWith('http') && (
                    <svg className="inline w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                </motion.a>
              </div>

              {/* Hover Overlay Effect */}
              {hoveredProject === project.id && (
                <motion.div
                  className="absolute inset-0 bg-babyBlue/5 rounded-xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Interested in working together?
          </p>
          <motion.a
            href="/contact"
            className="btn-primary text-lg font-semibold px-8 py-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get In Touch
          </motion.a>
        </motion.div>
      </div>
    </motion.main>
  );
};

export default Projects;