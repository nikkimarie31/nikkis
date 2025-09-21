import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  rejectionReason?: string;
  featuredImage?: string;
  readTime: number;
  views: number;
  likes: number;
}

interface Stats {
  totalPosts: number;
  pendingReview: number;
  approved: number;
  rejected: number;
  drafts: number;
  totalViews: number;
  totalLikes: number;
  recentActivity: BlogPost[];
}

const AdminDashboard = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState<string | null>(null);

  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchStats();
    fetchPosts();
  }, [user, navigate, selectedStatus]);

  const fetchStats = async () => {
    try {
      const apiUrl = import.meta.env['VITE_API_URL'] || window.location.origin;
      const response = await fetch(`${apiUrl}/api/admin/posts?action=stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const apiUrl = import.meta.env['VITE_API_URL'] || window.location.origin;
      const response = await fetch(`${apiUrl}/api/admin/posts?status=${selectedStatus}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setPosts(result.posts);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (postId: string) => {
    setActionLoading(postId);
    try {
      const apiUrl = import.meta.env['VITE_API_URL'] || window.location.origin;
      const response = await fetch(`${apiUrl}/api/admin/posts?postId=${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'approve' })
      });

      if (response.ok) {
        fetchStats();
        fetchPosts();
      }
    } catch (error) {
      console.error('Failed to approve post:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (postId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setActionLoading(postId);
    try {
      const apiUrl = import.meta.env['VITE_API_URL'] || window.location.origin;
      const response = await fetch(`${apiUrl}/api/admin/posts?postId=${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'reject',
          rejectionReason: rejectionReason.trim()
        })
      });

      if (response.ok) {
        fetchStats();
        fetchPosts();
        setShowRejectionModal(null);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Failed to reject post:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setActionLoading(postId);
    try {
      const apiUrl = import.meta.env['VITE_API_URL'] || window.location.origin;
      const response = await fetch(`${apiUrl}/api/admin/posts?postId=${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchStats();
        fetchPosts();
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen px-4 py-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage posts, review submissions, and oversee the platform
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalPosts}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Posts</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendingReview}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending Review</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.approved}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Approved</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Rejected</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.drafts}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Drafts</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalViews}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Views</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{stats.totalLikes}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Likes</div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'pending', label: 'Pending Review', count: stats?.pendingReview },
                { key: 'approved', label: 'Approved', count: stats?.approved },
                { key: 'rejected', label: 'Rejected', count: stats?.rejected },
                { key: 'draft', label: 'Drafts', count: stats?.drafts }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedStatus(tab.key)}
                  className={`${
                    selectedStatus === tab.key
                      ? 'border-babyBlue text-babyBlue'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300 py-0.5 px-2.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-babyBlue mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">No posts found for this status.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {posts.map((post) => (
                <div key={post.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 mr-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>By {post.authorName}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span>{post.readTime} min read</span>
                        {post.tags.length > 0 && (
                          <div className="flex gap-1">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
                            )}
                          </div>
                        )}
                      </div>
                      {post.rejectionReason && (
                        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded">
                          <p className="text-sm text-red-700 dark:text-red-200">
                            <strong>Rejection reason:</strong> {post.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      {selectedStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(post.id)}
                            disabled={actionLoading === post.id}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
                          >
                            {actionLoading === post.id ? 'Approving...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => setShowRejectionModal(post.id)}
                            disabled={actionLoading === post.id}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={actionLoading === post.id}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 text-sm"
                      >
                        {actionLoading === post.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rejection Modal */}
        {showRejectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Reject Post</h3>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                className="form-input w-full h-24 mb-4"
                required
              />
              <div className="flex gap-3">
                <button
                  onClick={() => handleReject(showRejectionModal)}
                  disabled={!rejectionReason.trim() || actionLoading === showRejectionModal}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {actionLoading === showRejectionModal ? 'Rejecting...' : 'Reject Post'}
                </button>
                <button
                  onClick={() => {
                    setShowRejectionModal(null);
                    setRejectionReason('');
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.main>
  );
};

export default AdminDashboard;