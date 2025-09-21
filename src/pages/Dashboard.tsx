import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Check for payment success/cancel messages
    const payment = searchParams.get('payment');
    if (payment === 'success') {
      // Show success message and refresh subscription status
      setTimeout(() => fetchSubscriptionStatus(), 1000);
    }

    fetchSubscriptionStatus();

    // Fetch analytics for writers
    if (['admin', 'premium_writer', 'free_writer'].includes(user.role)) {
      fetchAnalytics();
    } else {
      setIsLoadingAnalytics(false);
    }
  }, [user, navigate, searchParams, token]);

  const fetchSubscriptionStatus = async () => {
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
        setSubscriptionStatus(result);
      }
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!token) return;

    try {
      const apiUrl = import.meta.env['VITE_API_URL'] || window.location.origin;
      const response = await fetch(`${apiUrl}/api/author/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setAnalytics(result.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'premium_writer':
        return 'Premium Writer';
      case 'free_writer':
        return 'Writer';
      case 'reader':
        return 'Reader';
      default:
        return role;
    }
  };

  const getSubscriptionDisplayName = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active Subscription';
      case 'trial':
        return 'Free Trial';
      case 'cancelled':
        return 'Cancelled';
      case 'none':
        return 'No Subscription';
      default:
        return status;
    }
  };

  const isWriter = ['admin', 'premium_writer', 'free_writer'].includes(user.role);

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen px-4 py-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {getRoleDisplayName(user.role)} • {getSubscriptionDisplayName(user.subscriptionStatus)}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Payment Success Message */}
        {searchParams.get('payment') === 'success' && (
          <motion.div
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-green-800 dark:text-green-200 font-medium">
                  Payment successful! Your subscription is now active.
                </p>
                <p className="text-green-600 dark:text-green-300 text-sm mt-1">
                  You can now start writing and publishing articles.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Subscription Status */}
        {subscriptionStatus && !subscriptionStatus.hasActiveSubscription && user.role !== 'admin' && (
          <motion.div
            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                    No active subscription
                  </p>
                  <p className="text-yellow-600 dark:text-yellow-300 text-sm mt-1">
                    Subscribe to start writing and publishing articles.
                  </p>
                </div>
              </div>
              <Link
                to="/subscription"
                className="btn-primary ml-4"
              >
                Subscribe Now
              </Link>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Write Article (Writers only) */}
          {isWriter && (
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-babyBlue mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Write Article
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create a new blog post and submit it for review.
              </p>
              <Link
                to="/write"
                className="btn-primary inline-block text-center"
              >
                Start Writing
              </Link>
            </motion.div>
          )}

          {/* My Articles (Writers only) */}
          {isWriter && (
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  My Articles
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                View your published and pending articles.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Published: {user.approvedPosts || 0}</p>
                <p>Total: {user.totalPosts || 0}</p>
              </div>
            </motion.div>
          )}

          {/* Admin Panel (Admin only) */}
          {user.role === 'admin' && (
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Admin Panel
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Manage posts, users, and platform settings.
              </p>
              <Link
                to="/admin"
                className="btn-secondary inline-block text-center"
              >
                Open Admin
              </Link>
            </motion.div>
          )}

          {/* Subscription Management */}
          {user.role !== 'admin' && (
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Subscription
                </h3>
              </div>
              {isLoadingSubscription ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              ) : subscriptionStatus?.hasActiveSubscription ? (
                <>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Manage your subscription and billing settings.
                  </p>
                  <div className="text-sm text-green-600 dark:text-green-400 mb-3">
                    ✅ Active subscription
                    {subscriptionStatus.subscription && (
                      <span className="block text-gray-500 dark:text-gray-400 mt-1">
                        Next billing: {new Date(subscriptionStatus.subscription.currentPeriodEnd).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <Link
                    to="/subscription"
                    className="btn-secondary inline-block text-center"
                  >
                    Manage Subscription
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Subscribe to unlock writer features and start publishing.
                  </p>
                  <Link
                    to="/subscription"
                    className="btn-primary inline-block text-center"
                  >
                    View Plans
                  </Link>
                </>
              )}
            </motion.div>
          )}

          {/* Browse Articles */}
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Browse Articles
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Read the latest published articles from our writers.
            </p>
            <Link
              to="/blog"
              className="btn-secondary inline-block text-center"
            >
              Read Articles
            </Link>
          </motion.div>
        </div>

        {/* Analytics Section (Writers only) */}
        {isWriter && (
          <>
            {isLoadingAnalytics ? (
              <div className="mb-8 flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-babyBlue"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading analytics...</span>
              </div>
            ) : analytics && (
              <>
                {/* Analytics Overview */}
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Your Writing Analytics
                  </h2>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analytics.totalPosts}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Posts</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{analytics.publishedPosts}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Published</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{analytics.totalViews}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Views</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{analytics.totalLikes}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Likes</div>
                    </div>
                  </div>

                  {/* Engagement Metrics */}
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{analytics.engagement.viewsPerPost}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Avg Views per Post</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{analytics.engagement.likesPerPost}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Avg Likes per Post</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{analytics.engagement.engagementRate}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</div>
                    </div>
                  </div>
                </motion.div>

                {/* Recent Posts and Top Tags */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Recent Posts */}
                  <motion.div
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Recent Posts
                    </h3>
                    <div className="space-y-3">
                      {analytics.recentPosts.slice(0, 5).map((post: any) => (
                        <div key={post.id} className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                              {post.title}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                post.status === 'published'
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                  : post.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                              }`}>
                                {post.status}
                              </span>
                              {post.status === 'published' && (
                                <>
                                  <span>{post.views} views</span>
                                  <span>{post.likes} likes</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Top Tags */}
                  <motion.div
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Most Used Tags
                    </h3>
                    <div className="space-y-3">
                      {analytics.topTags.slice(0, 5).map((tag: any) => (
                        <div key={tag.tag} className="flex justify-between items-center">
                          <span className="text-gray-900 dark:text-white font-medium">
                            {tag.tag}
                          </span>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                              <div
                                className="bg-babyBlue h-2 rounded-full"
                                style={{ width: `${(tag.count / analytics.topTags[0].count) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 w-6">
                              {tag.count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </>
        )}

        {/* Account Info */}
        <motion.div
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Account Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-gray-900 dark:text-white">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
              <p className="text-gray-900 dark:text-white">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Account Type</p>
              <p className="text-gray-900 dark:text-white">{getRoleDisplayName(user.role)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Subscription</p>
              <p className="text-gray-900 dark:text-white">{getSubscriptionDisplayName(user.subscriptionStatus)}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
};

export default Dashboard;