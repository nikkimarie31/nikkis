import { useState } from 'react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    setMessage(`If an account exists for ${email}, you'll receive a password reset link.`);
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900 flex items-center justify-center"
    >
      <div className="bg-darkGray text-neonGreen p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Reset Password</h1>
        {message && (
          <div className="bg-blue-600 text-white text-sm p-2 rounded mb-4">
            {message}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleReset}>
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
          <button
            type="submit"
            className="w-full bg-neonGreen text-darkGray py-2 px-4 rounded-md font-bold hover:bg-gray-700 hover:text-neonGreen transition-all"
          >
            Reset Password
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm">
            Remembered your password?{" "}
            <a href="/login" className="text-neonGreen underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </motion.main>
  );
};

export default ResetPassword;
