import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { getBlogPosts, updateBlogPost, deleteBlogPost, getBlogPostsByStatus } from '../shared/storage';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Middleware to verify admin token
const verifyAdminToken = (token: string): { userId: string; email: string; name: string; role: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'admin') {
      return null;
    }
    return {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role
    };
  } catch (error) {
    return null;
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production'
    ? 'https://www.inmyop1nion.com'
    : '*'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'No token provided'
      });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyAdminToken(token);

    if (!decoded) {
      res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
      return;
    }

    if (req.method === 'GET') {
      // Get admin dashboard data
      const { action } = req.query;

      if (action === 'stats') {
        // Return dashboard statistics
        const allPosts = getBlogPosts();
        const stats = {
          totalPosts: allPosts.length,
          pendingReview: allPosts.filter(p => p.status === 'pending').length,
          approved: allPosts.filter(p => p.status === 'approved').length,
          rejected: allPosts.filter(p => p.status === 'rejected').length,
          drafts: allPosts.filter(p => p.status === 'draft').length,
          totalViews: allPosts.reduce((sum, post) => sum + post.views, 0),
          totalLikes: allPosts.reduce((sum, post) => sum + post.likes, 0),
          recentActivity: allPosts
            .filter(p => p.status === 'pending')
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
        };

        res.status(200).json({
          success: true,
          stats
        });
        return;
      }

      // Get posts for admin review
      const { status = 'pending', limit = 20, offset = 0 } = req.query;

      let filteredPosts = [...getBlogPosts()];

      if (status && typeof status === 'string') {
        filteredPosts = filteredPosts.filter(post => post.status === status);
      }

      // Sort by creation date (newest first)
      filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Pagination
      const startIndex = parseInt(offset as string);
      const limitNum = parseInt(limit as string);
      const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limitNum);

      res.status(200).json({
        success: true,
        posts: paginatedPosts,
        total: filteredPosts.length,
        offset: startIndex,
        limit: limitNum
      });
      return;
    }

    if (req.method === 'PUT') {
      // Approve, reject, or update post
      const { postId } = req.query;
      const { action, rejectionReason, featured } = req.body;

      if (!postId || typeof postId !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Post ID is required'
        });
        return;
      }

      if (action === 'approve') {
        const updatedPost = updateBlogPost(postId, {
          status: 'approved',
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        if (!updatedPost) {
          res.status(404).json({
            success: false,
            error: 'Post not found'
          });
          return;
        }

        console.log('✅ Post approved by admin:', updatedPost.id, updatedPost.title);

        res.status(200).json({
          success: true,
          message: 'Post approved and published successfully!',
          post: updatedPost
        });
        return;
      }

      if (action === 'reject') {
        if (!rejectionReason || typeof rejectionReason !== 'string') {
          res.status(400).json({
            success: false,
            error: 'Rejection reason is required'
          });
          return;
        }

        const updatedPost = updateBlogPost(postId, {
          status: 'rejected',
          rejectionReason: rejectionReason.trim(),
          updatedAt: new Date().toISOString()
        });

        if (!updatedPost) {
          res.status(404).json({
            success: false,
            error: 'Post not found'
          });
          return;
        }

        console.log('❌ Post rejected by admin:', updatedPost.id, updatedPost.title, 'Reason:', rejectionReason);

        res.status(200).json({
          success: true,
          message: 'Post rejected with feedback',
          post: updatedPost
        });
        return;
      }

      if (action === 'feature') {
        // Feature/unfeature post (for future homepage featuring)
        const updatedPost = updateBlogPost(postId, {
          updatedAt: new Date().toISOString()
          // You can add a featured flag here in the future
        });

        if (!updatedPost) {
          res.status(404).json({
            success: false,
            error: 'Post not found'
          });
          return;
        }

        res.status(200).json({
          success: true,
          message: featured ? 'Post featured successfully!' : 'Post unfeatured',
          post: updatedPost
        });
        return;
      }

      res.status(400).json({
        success: false,
        error: 'Invalid action. Use: approve, reject, or feature'
      });
      return;
    }

    if (req.method === 'DELETE') {
      // Delete post
      const { postId } = req.query;

      if (!postId || typeof postId !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Post ID is required'
        });
        return;
      }

      const success = deleteBlogPost(postId);
      if (!success) {
        res.status(404).json({
          success: false,
          error: 'Post not found'
        });
        return;
      }

      console.log('🗑️ Post deleted by admin:', postId);

      res.status(200).json({
        success: true,
        message: 'Post deleted successfully'
      });
      return;
    }

    res.status(405).json({ success: false, error: 'Method not allowed' });

  } catch (error) {
    console.error('❌ Admin operation failed:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to process admin request. Please try again later.'
    });
  }
}