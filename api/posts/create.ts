import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { addBlogPost, getUserById } from '../shared/storage';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Middleware to verify JWT token
const verifyToken = (token: string): { userId: string; email: string; name: string; role: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
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

// Calculate reading time (words per minute)
const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Create excerpt from content
const createExcerpt = (content: string, maxLength: number = 160): string => {
  const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  if (textContent.length <= maxLength) return textContent;
  return textContent.substring(0, maxLength).trim() + '...';
};

// Validation function
const validatePost = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.title || typeof data.title !== 'string') {
    errors.push('Title is required');
  } else if (data.title.trim().length < 5) {
    errors.push('Title must be at least 5 characters long');
  } else if (data.title.trim().length > 100) {
    errors.push('Title must be no more than 100 characters long');
  }

  if (!data.content || typeof data.content !== 'string') {
    errors.push('Content is required');
  } else if (data.content.trim().length < 100) {
    errors.push('Content must be at least 100 characters long');
  }

  if (data.tags && !Array.isArray(data.tags)) {
    errors.push('Tags must be an array');
  } else if (data.tags && data.tags.length > 10) {
    errors.push('Maximum 10 tags allowed');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production'
    ? 'https://www.inmyop1nion.com'
    : '*'
  );
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
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
    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
      return;
    }

    if (req.method === 'POST') {
      // Create new blog post
      console.log('📝 Blog post creation attempt:', {
        timestamp: new Date().toISOString(),
        authorId: decoded.userId,
        authorName: decoded.name
      });

      // Check if user can create posts
      if (!['admin', 'premium_writer', 'free_writer'].includes(decoded.role)) {
        res.status(403).json({
          success: false,
          error: 'You need a writer account to create posts'
        });
        return;
      }

      // Validate request body
      const validation = validatePost(req.body);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validation.errors
        });
        return;
      }

      const { title, content, tags = [], featuredImage, isDraft = false } = req.body;

      // Create new blog post
      const newPost: BlogPost = {
        id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: title.trim(),
        content: content.trim(),
        excerpt: createExcerpt(content),
        authorId: decoded.userId,
        authorName: decoded.name,
        status: isDraft ? 'draft' : (decoded.role === 'admin' ? 'approved' : 'pending'),
        tags: tags.filter((tag: string) => tag && typeof tag === 'string').map((tag: string) => tag.trim()),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: decoded.role === 'admin' && !isDraft ? new Date().toISOString() : undefined,
        featuredImage,
        readTime: calculateReadTime(content),
        views: 0,
        likes: 0
      };

      addBlogPost(newPost);

      console.log('✅ Blog post created successfully:', newPost.id, 'Status:', newPost.status);

      let message = 'Blog post created successfully!';
      if (newPost.status === 'pending') {
        message = 'Blog post submitted for review! Nicole will review it soon.';
      } else if (newPost.status === 'draft') {
        message = 'Blog post saved as draft.';
      } else if (newPost.status === 'approved') {
        message = 'Blog post published successfully!';
      }

      res.status(201).json({
        success: true,
        message,
        post: newPost
      });
      return;
    }

    if (req.method === 'GET') {
      // Get posts with filtering
      const { status, authorId, limit = 10, offset = 0 } = req.query;

      let filteredPosts = [...blogPosts];

      // Filter by status
      if (status && typeof status === 'string') {
        filteredPosts = filteredPosts.filter(post => post.status === status);
      }

      // Filter by author
      if (authorId && typeof authorId === 'string') {
        filteredPosts = filteredPosts.filter(post => post.authorId === authorId);
      }

      // For non-admin users, only show their own posts + approved posts
      if (decoded.role !== 'admin') {
        filteredPosts = filteredPosts.filter(post =>
          post.authorId === decoded.userId || post.status === 'approved'
        );
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

    res.status(405).json({ success: false, error: 'Method not allowed' });

  } catch (error) {
    console.error('❌ Blog post operation failed:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to process request. Please try again later.'
    });
  }
}