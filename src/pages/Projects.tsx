

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "Portfolio Website",
      description: "A personal portfolio showcasing my skills and projects.",
      link: "/projects/1",
    },
    {
      id: 2,
      title: "E-Commerce App",
      description: "An online store built with React and Tailwind CSS.",
      link: "/projects/2",
    },
  ];

  return (
    <main className="bg-gray-900 text-neon-green px-4 py-8">
      <section className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">My Projects</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg">
              <h2 className="text-xl font-bold mb-2">{project.title}</h2>
              <p className="text-sm mb-4">{project.description}</p>
              <a
                href={project.link}
                className="text-neon-green underline hover:text-gray-300"
              >
                Learn More
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Projects;
