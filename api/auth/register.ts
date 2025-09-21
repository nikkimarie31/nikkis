import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, getUserByEmail, addUser } from '../shared/storage';

// Rate limiting storage
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Rate limiting function
const isRateLimited = (ip: string, maxRequests: number = 3, windowMs: number = 15 * 60 * 1000): boolean => {
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
const validateRegistration = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required');
  } else if (data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  } else if (data.name.trim().length > 50) {
    errors.push('Name must be no more than 50 characters long');
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email must be a valid email address');
  }

  if (!data.password || typeof data.password !== 'string') {
    errors.push('Password is required');
  } else if (data.password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
    errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
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
        error: 'Too many registration attempts, please try again later.'
      });
      return;
    }

    console.log('👤 User registration attempt:', {
      timestamp: new Date().toISOString(),
      ip: clientIP,
      email: req.body.email
    });

    // Validate request body
    const validation = validateRegistration(req.body);
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
      return;
    }

    const { name, email, password, writerType = 'reader' } = req.body;

    // Check if user already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({
        success: false,
        error: 'An account with this email already exists'
      });
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Determine role and subscription
    let role: User['role'] = 'reader';
    let subscriptionStatus: User['subscriptionStatus'] = 'none';
    let subscriptionEnd: string | undefined;

    // Check if this is the admin (your email)
    if (email.toLowerCase() === 'nicole.eddy@inmyop1nion.com') {
      role = 'admin';
      subscriptionStatus = 'active';
    } else if (writerType === 'writer') {
      // New writers get 14-day free trial
      role = 'free_writer';
      subscriptionStatus = 'trial';
      subscriptionEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(); // 14 days from now
    }

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      subscriptionStatus,
      subscriptionEnd,
      createdAt: new Date().toISOString(),
      emailVerified: true, // Auto-verify for now
      totalPosts: 0,
      approvedPosts: 0
    };

    addUser(newUser);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ User registered successfully:', newUser.email, 'Role:', newUser.role);

    // Return user data (without password)
    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      subscriptionStatus: newUser.subscriptionStatus,
      subscriptionEnd: newUser.subscriptionEnd,
      createdAt: newUser.createdAt,
      emailVerified: newUser.emailVerified,
      totalPosts: newUser.totalPosts,
      approvedPosts: newUser.approvedPosts
    };

    let welcomeMessage = 'Welcome to InMyOpinion!';
    if (role === 'admin') {
      welcomeMessage = 'Welcome back, Nicole! Your admin account is ready.';
    } else if (role === 'free_writer') {
      welcomeMessage = 'Welcome to InMyOpinion Writers! Your 14-day free trial has started.';
    }

    res.status(201).json({
      success: true,
      message: welcomeMessage,
      user: userData,
      token
    });

  } catch (error) {
    console.error('❌ Registration failed:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to create account. Please try again later.'
    });
  }
}