import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const skills = [
    { name: 'React', level: 95, category: 'Frontend' },
    { name: 'TypeScript', level: 90, category: 'Frontend' },
    { name: 'Node.js', level: 85, category: 'Backend' },
    { name: 'UX Design', level: 88, category: 'Design' },
    { name: 'Tailwind CSS', level: 92, category: 'Frontend' },
    { name: 'MongoDB', level: 80, category: 'Backend' },
  ];

  const recentProjects = [
    {
      title: 'Recollect',
      description: 'AI-powered life logging app with meaningful insights',
      tech: ['React', 'AI/ML', 'TypeScript'],
      link: '/projects'
    },
    {
      title: 'Day-ja Merchandising',
      description: 'Task management app for retail merchandising teams',
      tech: ['React Native', 'Firebase'],
      link: '/projects'
    },
    {
      title: 'Clarity',
      description: 'Relationship communication tool based on the Four Agreements',
      tech: ['React', 'Real-time Chat'],
      link: '/projects'
    }
  ];

  return (
    <motion.main 
      className="min-h-screen bg-white dark:bg-darkGray text-gray-900 dark:text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Welcome to My <span className="text-babyBlue">Digital Portfolio</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              I'm Nicole Eddy, a passionate Full Stack Developer and UX Designer dedicated to crafting 
              modern, interactive, and responsive web experiences that bring ideas to life.
            </p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link to="/projects" className="btn-primary text-lg font-semibold px-8 py-3">
                View My Work
              </Link>
              <Link to="/contact" className="btn-secondary text-lg font-semibold px-8 py-3">
                Get In Touch
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              Technical <span className="text-babyBlue">Expertise</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              I specialize in modern web technologies and user-centered design principles
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{skill.name}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {skill.category}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <motion.div 
                    className="h-2 rounded-full bg-gradient-to-r from-babyBlue to-blue-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{skill.level}% proficiency</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Projects Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              Recent <span className="text-babyBlue">Projects</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              Here are some of my latest projects that showcase my development skills and creativity
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {recentProjects.map((project, index) => (
              <motion.div
                key={project.title}
                className="blog-card group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-bold mb-3 group-hover:text-babyBlue transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span 
                      key={tech}
                      className="bg-babyBlue/10 text-babyBlue text-xs font-medium px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <Link 
                  to={project.link}
                  className="text-babyBlue font-medium text-sm hover:opacity-80 transition-opacity duration-300"
                >
                  Learn More →
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link to="/projects" className="btn-primary text-lg font-semibold px-8 py-3">
              View All Projects
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              Latest <span className="text-babyBlue">Thoughts</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              I share insights about web development, UX design, and technology trends on my blog
            </p>
            <Link to="/blog" className="btn-secondary text-lg font-semibold px-8 py-3">
              Read My Blog
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Build Something <span className="text-babyBlue">Amazing</span>?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              I'm always excited to work on new projects and collaborate with passionate teams. 
              Let's create something extraordinary together.
            </p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Link to="/contact" className="btn-primary text-lg font-semibold px-8 py-3">
                Start a Conversation
              </Link>
              <Link to="/about" className="btn-secondary text-lg font-semibold px-8 py-3">
                Learn About Me
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </motion.main>
  );
};

export default Home;