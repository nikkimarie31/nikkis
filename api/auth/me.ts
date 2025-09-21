import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { getUserById, updateUser } from '../shared/storage';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production'
    ? 'https://www.inmyop1nion.com'
    : '*'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
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

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
      return;
    }

    // Find user in database
    const user = getUserById(decoded.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    if (req.method === 'GET') {
      // Return user profile
      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionEnd: user.subscriptionEnd,
          createdAt: user.createdAt,
          emailVerified: user.emailVerified,
          bio: user.bio,
          website: user.website,
          twitter: user.twitter,
          linkedin: user.linkedin,
          github: user.github,
          totalPosts: user.totalPosts,
          approvedPosts: user.approvedPosts
        }
      });
      return;
    }

    if (req.method === 'PUT') {
      // Update user profile
      const { name, bio, website, twitter, linkedin, github } = req.body;

      const updates: any = {};
      if (name && typeof name === 'string' && name.trim().length >= 2) {
        updates.name = name.trim();
      }
      if (bio !== undefined) updates.bio = bio?.trim() || undefined;
      if (website !== undefined) updates.website = website?.trim() || undefined;
      if (twitter !== undefined) updates.twitter = twitter?.trim() || undefined;
      if (linkedin !== undefined) updates.linkedin = linkedin?.trim() || undefined;
      if (github !== undefined) updates.github = github?.trim() || undefined;

      const updatedUser = updateUser(decoded.userId, updates);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: updatedUser?.id || user.id,
          name: updatedUser?.name || user.name,
          email: updatedUser?.email || user.email,
          role: updatedUser?.role || user.role,
          subscriptionStatus: updatedUser?.subscriptionStatus || user.subscriptionStatus,
          subscriptionEnd: updatedUser?.subscriptionEnd || user.subscriptionEnd,
          createdAt: updatedUser?.createdAt || user.createdAt,
          emailVerified: updatedUser?.emailVerified || user.emailVerified,
          bio: updatedUser?.bio || user.bio,
          website: updatedUser?.website || user.website,
          twitter: updatedUser?.twitter || user.twitter,
          linkedin: updatedUser?.linkedin || user.linkedin,
          github: updatedUser?.github || user.github,
          totalPosts: updatedUser?.totalPosts || user.totalPosts,
          approvedPosts: updatedUser?.approvedPosts || user.approvedPosts
        }
      });
      return;
    }

    res.status(405).json({ success: false, error: 'Method not allowed' });

  } catch (error) {
    console.error('❌ Profile request failed:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to process request. Please try again later.'
    });
  }
}