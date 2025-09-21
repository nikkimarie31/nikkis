import { motion } from "framer-motion";

const About = () => {
  const skills = [
    { category: "Frontend", items: ["React & TypeScript", "Next.js", "Tailwind CSS", "JavaScript ES6+", "HTML5 & CSS3", "Responsive Web Design"] },
    { category: "Backend", items: ["Node.js & Express", "Python & Django", "RESTful APIs", "Database Design", "Authentication & Security"] },
    { category: "Tools & Technologies", items: ["Git & GitHub", "Docker", "AWS/Cloud Services", "Testing (Jest, Cypress)", "CI/CD Pipelines"] }
  ];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-16 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            About <span className="text-babyBlue">Me</span>
          </h1>
          <div className="w-24 h-1 bg-babyBlue rounded-full mx-auto"></div>
        </motion.div>

        {/* Introduction */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="text-babyBlue mr-3">👋</span>
              Hello, I'm Nicole Vallencourt
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                I'm a passionate <strong className="text-babyBlue">full-stack web developer</strong> who loves bringing ideas to life through code. 
                My journey into development started with curiosity about how websites work, and it's evolved into a deep passion 
                for creating robust, scalable, and user-friendly applications.
              </p>
              <p>
                As a newly married woman, I'm excited about this new chapter in my life while continuing to grow my career in tech. I recently graduated from <strong className="text-babyBlue">Nucamp's Full Stack Web Development and Mobile App Development bootcamp</strong>, where I mastered modern technologies including the MERN stack. I also completed an intensive <strong className="text-babyBlue">UX Design course with Merit America</strong>, which has given me a unique perspective on both the technical and design aspects of web development.
              </p>
              <p>
                My husband has been an incredible source of support throughout this journey. His unwavering belief in me and encouragement have been instrumental in helping me pursue my dreams in tech. I couldn't have achieved what I have without his love, patience, and understanding, especially during those late-night coding sessions and intense study periods. Having such a strong partnership makes every milestone even more meaningful.
              </p>
              <p>
                When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, 
                or sharing knowledge with the developer community. I believe in writing clean, maintainable code and 
                following best practices to deliver high-quality software.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Technical <span className="text-babyBlue">Skills</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skills.map((skillGroup, index) => (
              <motion.div
                key={skillGroup.category}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <h3 className="text-xl font-bold text-babyBlue mb-4 flex items-center">
                  <span className="w-2 h-2 bg-babyBlue rounded-full mr-3"></span>
                  {skillGroup.category}
                </h3>
                <ul className="space-y-2">
                  {skillGroup.items.map((skill, skillIndex) => (
                    <li 
                      key={skillIndex}
                      className="text-gray-600 dark:text-gray-300 flex items-center"
                    >
                      <span className="w-1.5 h-1.5 bg-babyBlue rounded-full mr-3 opacity-60"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Let's Build Something <span className="text-babyBlue">Amazing</span> Together
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            I'm always excited to work on new projects and collaborate with fellow developers, designers, and innovators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/projects"
              className="btn-primary text-lg font-semibold px-8 py-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View My Work
            </motion.a>
            <motion.a
              href="/contact"
              className="btn-secondary text-lg font-semibold px-8 py-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.a>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
};

export default About;