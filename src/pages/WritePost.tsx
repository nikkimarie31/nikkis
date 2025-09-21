import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const WritePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    featuredImage: '',
    isDraft: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [canWritePosts, setCanWritePosts] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!['admin', 'premium_writer', 'free_writer'].includes(user.role)) {
      navigate('/dashboard');
      return;
    }

    checkWritePermissions();
  }, [user, navigate, token]);

  const checkWritePermissions = async () => {
    if (!token) return;

    try {
      const apiUrl = import.meta.env['VITE_API_URL'] || window.location.origin;
      const response = await fetch(`${apiUrl}/api/payments/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setCanWritePosts(result.canWritePosts);
      }
    } catch (error) {
      console.error('Failed to check write permissions:', error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  if (!user || !['admin', 'premium_writer', 'free_writer'].includes(user.role)) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      tags: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const apiUrl = import.meta.env['VITE_API_URL'] || window.location.origin;

      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const requestBody = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags: tagsArray,
        featuredImage: formData.featuredImage.trim() || undefined,
        isDraft: formData.isDraft
      };

      const response = await fetch(`${apiUrl}/api/posts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(result.message);

        // Reset form after successful submission
        setFormData({
          title: '',
          content: '',
          tags: '',
          featuredImage: '',
          isDraft: false
        });

        // Redirect after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(result.error || 'Failed to create post');
      }
    } catch (err) {
      console.error('Create post error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const wordCount = formData.content.split(/\s+/).filter(word => word.length > 0).length;
  const estimatedReadTime = Math.ceil(wordCount / 200);

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen px-4 py-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Write a New Article
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your thoughts and insights with the InMyOpinion community
          </p>
        </div>

        {/* Subscription Check */}
        {subscriptionLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-babyBlue"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Checking permissions...</span>
          </div>
        ) : !canWritePosts ? (
          <motion.div
            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Subscription Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              You need an active subscription to write and publish articles. Choose a plan to unlock writer features and start sharing your insights with the community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/subscription"
                className="btn-primary"
              >
                View Subscription Plans
              </Link>
              <Link
                to="/dashboard"
                className="btn-secondary"
              >
                Back to Dashboard
              </Link>
            </div>
          </motion.div>
        ) : (
        <>
        {/* Success Message */}
        {success && (
          <motion.div
            className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 text-sm p-4 rounded-lg mb-6 border border-green-200 dark:border-green-700"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 text-sm p-4 rounded-lg mb-6 border border-red-200 dark:border-red-700"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            {/* Title */}
            <div className="mb-6">
              <label htmlFor="title" className="form-label">
                Article Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-input text-xl"
                placeholder="Enter your article title"
                value={formData.title}
                onChange={handleInputChange}
                required
                maxLength={100}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.title.length}/100 characters
              </p>
            </div>

            {/* Featured Image */}
            <div className="mb-6">
              <label htmlFor="featuredImage" className="form-label">
                Featured Image URL (optional)
              </label>
              <input
                type="url"
                id="featuredImage"
                name="featuredImage"
                className="form-input"
                placeholder="https://example.com/image.jpg"
                value={formData.featuredImage}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Add a URL to an image that represents your article
              </p>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label htmlFor="tags" className="form-label">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                className="form-input"
                placeholder="technology, opinion, lifestyle (comma-separated)"
                value={formData.tags}
                onChange={handleTagsChange}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Separate tags with commas. Maximum 10 tags.
              </p>
            </div>

            {/* Content */}
            <div className="mb-6">
              <label htmlFor="content" className="form-label">
                Article Content *
              </label>
              <textarea
                id="content"
                name="content"
                rows={20}
                className="form-input font-mono"
                placeholder="Write your article content here. You can use Markdown formatting."
                value={formData.content}
                onChange={handleInputChange}
                required
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {wordCount} words • ~{estimatedReadTime} min read
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Minimum 100 characters required
                </p>
              </div>
            </div>

            {/* Draft/Publish Toggle */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isDraft"
                  checked={formData.isDraft}
                  onChange={handleInputChange}
                  className="checkbox-baby-blue focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Save as draft
                </span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.isDraft
                  ? "Your article will be saved as a draft and won't be submitted for review."
                  : user.role === 'admin'
                    ? "Your article will be published immediately."
                    : "Your article will be submitted for review and published after approval."
                }
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              type="submit"
              disabled={isLoading || formData.content.trim().length < 100}
              className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? 'Publishing...' : (
                formData.isDraft ? 'Save Draft' : (
                  user.role === 'admin' ? 'Publish Article' : 'Submit for Review'
                )
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary flex-1 py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
          </div>
        </form>

        {/* Guidelines */}
        <motion.div
          className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Writing Guidelines
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <li>• Articles must be at least 100 characters long</li>
            <li>• Use clear, engaging titles that describe your content</li>
            <li>• Write original content that provides value to readers</li>
            <li>• Use appropriate tags to help readers find your content</li>
            <li>• Be respectful and constructive in your writing</li>
            <li>• {user.role === 'admin' ? 'As an admin, your posts are published immediately' : 'All submissions are reviewed before publication'}</li>
          </ul>
        </motion.div>
        </>
        )}
      </div>
    </motion.main>
  );
};

export default WritePost;