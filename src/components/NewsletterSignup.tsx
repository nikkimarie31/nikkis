import { useState } from 'react';
import { motion } from 'framer-motion';

interface FormData {
  email: string;
  name?: string;
}

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

interface NewsletterSignupProps {
  variant?: 'inline' | 'modal' | 'sidebar';
  title?: string;
  description?: string;
  showName?: boolean;
}

const NewsletterSignup = ({
  variant = 'inline',
  title = "Stay Updated!",
  description = "Get notified about new blog posts, projects, and tech insights.",
  showName = false
}: NewsletterSignupProps) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: ''
  });

  const [status, setStatus] = useState<FormStatus>({
    type: 'idle',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset status
    setStatus({ type: 'loading', message: 'Subscribing...' });

    try {
      const apiUrl = import.meta.env['VITE_API_URL'] || window.location.origin;

      const response = await fetch(`${apiUrl}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: result.message || 'Thank you for subscribing! Check your email for confirmation.'
        });
        // Reset form
        setFormData({ email: '', name: '' });
      } else {
        setStatus({
          type: 'error',
          message: result.error || 'Something went wrong. Please try again.'
        });
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    }
  };

  const isEmailValid = formData.email.includes('@') && formData.email.length > 5;
  const isFormValid = isEmailValid && (!showName || formData.name?.trim().length || 0 >= 2);

  // Inline variant (for homepage, blog posts)
  if (variant === 'inline') {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-babyBlue/10 to-blue-100/50 dark:from-babyBlue/5 dark:to-blue-900/20 rounded-xl p-8 border border-babyBlue/20"
      >
        <div className="max-w-md mx-auto text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
            {description}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {showName && (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your first name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-babyBlue focus:border-transparent
                         transition-colors duration-200 text-sm"
              />
            )}

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-babyBlue focus:border-transparent
                       transition-colors duration-200 text-sm"
            />

            {/* Status Message */}
            {status.type !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg text-sm ${
                  status.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                    : status.type === 'error'
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                    : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                }`}
              >
                {status.message}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={!isFormValid || status.type === 'loading'}
              className="w-full bg-babyBlue hover:bg-blue-400 disabled:bg-gray-300 dark:disabled:bg-gray-600
                       text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200
                       disabled:cursor-not-allowed disabled:opacity-50
                       focus:ring-2 focus:ring-babyBlue focus:ring-offset-2 text-sm"
              whileHover={{ scale: isFormValid && status.type !== 'loading' ? 1.02 : 1 }}
              whileTap={{ scale: isFormValid && status.type !== 'loading' ? 0.98 : 1 }}
            >
              {status.type === 'loading' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Subscribing...
                </span>
              ) : (
                'Subscribe to Updates'
              )}
            </motion.button>
          </form>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            No spam, unsubscribe at any time. I respect your privacy! 🔒
          </p>
        </div>
      </motion.section>
    );
  }

  // Sidebar variant (for blog sidebar)
  if (variant === 'sidebar') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h4>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
          {description}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-babyBlue focus:border-transparent
                     transition-colors duration-200 text-sm"
          />

          {status.type !== 'idle' && (
            <div className={`p-2 rounded text-xs ${
              status.type === 'success' ? 'bg-green-100 text-green-800' :
              status.type === 'error' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={!isEmailValid || status.type === 'loading'}
            className="w-full bg-babyBlue hover:bg-blue-400 disabled:bg-gray-300
                     text-white font-medium py-2 px-4 rounded-lg transition-all duration-200
                     disabled:cursor-not-allowed disabled:opacity-50 text-sm"
          >
            {status.type === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      </div>
    );
  }

  return null;
};

export default NewsletterSignup;