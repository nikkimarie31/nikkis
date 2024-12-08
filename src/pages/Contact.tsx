

const Contact = () => {
  return (
    <div className="bg-gray-900 text-neon-green min-h-screen flex items-center justify-center px-4">
      <form className="bg-gray-800 p-6 rounded-lg w-full max-w-md mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Get In Touch</h1>
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-3 mb-4 bg-gray-700 text-neon-green rounded text-sm sm:text-base"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-3 mb-4 bg-gray-700 text-neon-green rounded text-sm sm:text-base"
        />
        <textarea placeholder="Your Message" className="w-full p-3 mb-4 bg-gray-700 text-neon-green rounded text-sm sm:text-base" />
        <button type="submit" className="w-full bg-neon-green text-gray-900 py-2 rounded hover:shadow-lg max-w-sm mx-auto">
          Send Message

        </button>
      </form>
    </div>
  );
};

export default Contact;