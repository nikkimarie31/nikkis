import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Mock analytics data (in production, this would come from a database)
let authorAnalytics: Record<string, {
  totalPosts: number;
  publishedPosts: number;
  pendingPosts: number;
  rejectedPosts: number;
  totalViews: number;
  totalLikes: number;
  avgReadTime: number;
  topTags: { tag: string; count: number }[];
  recentPosts: Array<{
    id: string;
    title: string;
    status: string;
    views: number;
    likes: number;
    publishedAt?: string;
    createdAt: string;
  }>;
  viewsOverTime: Array<{
    date: string;
    views: number;
  }>;
  engagement: {
    likesPerPost: number;
    viewsPerPost: number;
    engagementRate: number;
  };
}> = {};

// Verify user token
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

// Generate mock analytics data for a user
const generateMockAnalytics = (userId: string) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Generate sample data
  const totalPosts = Math.floor(Math.random() * 20) + 5;
  const publishedPosts = Math.floor(totalPosts * 0.7);
  const pendingPosts = Math.floor(totalPosts * 0.2);
  const rejectedPosts = totalPosts - publishedPosts - pendingPosts;

  const totalViews = Math.floor(Math.random() * 5000) + 500;
  const totalLikes = Math.floor(totalViews * 0.1);

  // Generate views over time (last 30 days)
  const viewsOverTime = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    viewsOverTime.push({
      date: date.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 50) + 10
    });
  }

  // Generate recent posts
  const recentPosts = [];
  for (let i = 0; i < Math.min(totalPosts, 5); i++) {
    const postDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const status = ['published', 'pending', 'rejected'][Math.floor(Math.random() * 3)];

    recentPosts.push({
      id: `post_${userId}_${i}`,
      title: [
        'Understanding Modern Web Development',
        'The Future of AI in Content Creation',
        'Building Scalable Applications',
        'Design Principles for Better UX',
        'My Journey in Tech'
      ][i] || `Article ${i + 1}`,
      status,
      views: status === 'published' ? Math.floor(Math.random() * 500) + 50 : 0,
      likes: status === 'published' ? Math.floor(Math.random() * 50) + 5 : 0,
      publishedAt: status === 'published' ? postDate.toISOString() : undefined,
      createdAt: postDate.toISOString()
    });
  }

  return {
    totalPosts,
    publishedPosts,
    pendingPosts,
    rejectedPosts,
    totalViews,
    totalLikes,
    avgReadTime: Math.floor(Math.random() * 3) + 3, // 3-6 minutes
    topTags: [
      { tag: 'Technology', count: Math.floor(Math.random() * 5) + 2 },
      { tag: 'Programming', count: Math.floor(Math.random() * 4) + 1 },
      { tag: 'Design', count: Math.floor(Math.random() * 3) + 1 },
      { tag: 'Tutorial', count: Math.floor(Math.random() * 3) + 1 },
      { tag: 'Opinion', count: Math.floor(Math.random() * 2) + 1 }
    ].sort((a, b) => b.count - a.count),
    recentPosts: recentPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    viewsOverTime,
    engagement: {
      likesPerPost: publishedPosts > 0 ? Math.round((totalLikes / publishedPosts) * 10) / 10 : 0,
      viewsPerPost: publishedPosts > 0 ? Math.round((totalViews / publishedPosts) * 10) / 10 : 0,
      engagementRate: totalViews > 0 ? Math.round((totalLikes / totalViews * 100) * 10) / 10 : 0
    }
  };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production'
    ? 'https://www.inmyop1nion.com'
    : '*'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
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
        error: 'Invalid token'
      });
      return;
    }

    // Check if user is a writer
    if (!['admin', 'premium_writer', 'free_writer'].includes(decoded.role)) {
      res.status(403).json({
        success: false,
        error: 'Writer access required'
      });
      return;
    }

    // Get or generate analytics for the user
    if (!authorAnalytics[decoded.userId]) {
      authorAnalytics[decoded.userId] = generateMockAnalytics(decoded.userId);
    }

    const analytics = authorAnalytics[decoded.userId];

    res.status(200).json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error('❌ Analytics fetch failed:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics. Please try again later.'
    });
  }
}