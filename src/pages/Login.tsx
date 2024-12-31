import { useState } from 'react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple dummy validation
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);
    alert(`Welcome, ${email}! (This is a frontend-only login page.)`);
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900 flex items-center justify-center"
    >
      <div className="bg-darkGray text-neonGreen p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
        {error && (
          <div className="bg-red-600 text-white text-sm p-2 rounded mb-4">
            {error}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full bg-gray-800 text-neonGreen border border-gray-700 rounded-md shadow-sm focus:ring-neonGreen focus:border-neonGreen"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full bg-gray-800 text-neonGreen border border-gray-700 rounded-md shadow-sm focus:ring-neonGreen focus:border-neonGreen"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-neonGreen text-darkGray py-2 px-4 rounded-md font-bold hover:bg-gray-700 hover:text-neonGreen transition-all"
          >
            Login
          </button>
        </form>

        {/* Additional Options */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            Don’t have an account?{" "}
            <a href="/signup" className="text-neonGreen underline">
              Sign Up
            </a>
          </p>
          <p className="text-sm mt-2">
            Forgot your password?{" "}
            <a href="/reset-password" className="text-neonGreen underline">
              Reset it here
            </a>
          </p>
        </div>
      </div>
    </motion.main>
  );
};

export default Login;
