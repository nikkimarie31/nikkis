import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setMessage('Please enter a valid email address.');
      setIsSubmitted(false);
      return;
    }

    setMessage(`If an account exists for ${email}, you'll receive a password reset link.`);
    setIsSubmitted(true);
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center px-4 py-8"
    >
      <motion.div
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        {message && (
          <motion.div
            className={`text-sm p-3 rounded-lg mb-4 border ${
              isSubmitted 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700'
                : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 border-red-200 dark:border-red-700'
            }`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {message}
          </motion.div>
        )}
        
        {!isSubmitted ? (
          <form className="space-y-5" onSubmit={handleReset}>
            <div>
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <motion.button
              type="submit"
              className="btn-primary w-full text-lg font-semibold py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              Send Reset Link
            </motion.button>
          </form>
        ) : (
          <div className="text-center">
            <motion.div
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <svg 
                className="w-8 h-8 text-blue-600 dark:text-blue-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
            </motion.div>
            <motion.button
              onClick={() => {
                setIsSubmitted(false);
                setMessage(null);
                setEmail('');
              }}
              className="btn-secondary text-sm font-medium py-2 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Send Another Reset Link
            </motion.button>
          </div>
        )}

        {/* Navigation Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Remembered your password?{' '}
            <Link 
              to="/login" 
              className="font-medium text-babyBlue hover:opacity-80 transition-opacity duration-300"
            >
              Sign in here
            </Link>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="font-medium text-babyBlue hover:opacity-80 transition-opacity duration-300"
            >
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.main>
  );
};

export default ResetPassword;