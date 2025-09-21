import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByEmail } from '../shared/storage';

// Rate limiting storage
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Rate limiting function (stricter for login attempts)
const isRateLimited = (ip: string, maxRequests: number = 5, windowMs: number = 15 * 60 * 1000): boolean => {
  const now = Date.now();
  const userRequests = requestCounts.get(ip);

  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (userRequests.count >= maxRequests) {
    return true;
  }

  userRequests.count++;
  return false;
};

// Validation function
const validateLogin = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Please enter a valid email address');
  }

  if (!data.password || typeof data.password !== 'string') {
    errors.push('Password is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production'
    ? 'https://www.inmyop1nion.com'
    : '*'
  );
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  // Get client IP for rate limiting
  const clientIP = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
                   (req.headers['x-real-ip'] as string) ||
                   'unknown';

  try {
    // Check rate limiting
    if (isRateLimited(clientIP)) {
      res.status(429).json({
        success: false,
        error: 'Too many login attempts, please try again later.'
      });
      return;
    }

    console.log('🔐 User login attempt:', {
      timestamp: new Date().toISOString(),
      ip: clientIP,
      email: req.body.email
    });

    // Validate request body
    const validation = validateLogin(req.body);
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
      return;
    }

    const { email, password } = req.body;

    // Find user by email
    const user = getUserByEmail(email.trim());
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
      return;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ User logged in successfully:', user.email, 'Role:', user.role);

    // Return user data (without password)
    const userData = {
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
    };

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: userData,
      token
    });

  } catch (error) {
    console.error('❌ Login failed:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to sign in. Please try again later.'
    });
  }
}