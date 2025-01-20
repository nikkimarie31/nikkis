import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-neonGreen text-center">
      <h1 className="text-6xl font-bold neon-title mb-6">FULL STACK WEB DEVELOPER</h1>
      <p className="text-xl mb-8">Crafting modern, interactive, and responsive web experiences that bring ideas to life.</p>
      <button
        onClick={() => navigate('/home')}
        className="bg-neonGreen text-darkGray font-bold py-3 px-6 rounded-lg text-lg hover:bg-gray-700 hover:text-neonGreen transition-all"
      >
        Enter My Website
      </button>
    </div>
  );
};

export default LandingPage;