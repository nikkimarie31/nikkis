const About = () => {
  return (
    <main className="px-4 py-8 bg-gray-900 text-neon-green">
      <section className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">About Me</h1>
        <p className="text-lg leading-relaxed mb-6">
          Hi, I'm Nikki a full-stack web developer with a passion for building modern,
          responsive, and interactive applications. My favorite tools include React, TypeScript,
          and Tailwind CSS, and I love tackling complex problems with creative solutions.
        </p>
        <h2 className="text-2xl font-bold mb-4">Skills</h2>
        <ul className="list-disc pl-6">
          <li>React & TypeScript</li>
          <li>Responsive Web Design</li>
          <li>Node.js & Express</li>
          <li>Version Control with Git</li>
        </ul>
      </section>
    </main>
  );
};

export default About;
