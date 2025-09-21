import type { VercelRequest, VercelResponse } from '@vercel/node';

// Rate limiting storage
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Rate limiting function
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
const validateContactForm = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required and must be a string');
  } else if (data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  } else if (data.name.trim().length > 100) {
    errors.push('Name must be no more than 100 characters long');
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required and must be a string');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email must be a valid email address');
  }

  if (!data.message || typeof data.message !== 'string') {
    errors.push('Message is required and must be a string');
  } else if (data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long');
  } else if (data.message.trim().length > 2000) {
    errors.push('Message must be no more than 2000 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Main handler function
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production'
    ? 'https://www.inmyop1nion.com'
    : '*'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get client IP for rate limiting
  const clientIP = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
                   (req.headers['x-real-ip'] as string) ||
                   'unknown';

  try {
    if (req.method === 'GET') {
      // Health check endpoint
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
      return;
    }

    if (req.method === 'POST') {
      // Check rate limiting
      if (isRateLimited(clientIP)) {
        res.status(429).json({
          success: false,
          error: 'Too many contact form submissions, please try again later.'
        });
        return;
      }

      console.log('📨 Contact form submission received:', {
        timestamp: new Date().toISOString(),
        ip: clientIP,
        userAgent: req.headers['user-agent'],
        body: req.body
      });

      // Validate request body
      const validation = validateContactForm(req.body);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validation.errors
        });
        return;
      }

      const formData = {
        name: req.body.name.trim(),
        email: req.body.email.trim().toLowerCase(),
        message: req.body.message.trim()
      };

      // For now, just log the submission (no email sending)
      console.log('✅ Contact form submission successful:', formData);

      res.status(200).json({
        success: true,
        message: 'Thank you! Your message has been received successfully. I\'ll get back to you soon! (Email functionality coming soon)'
      });
      return;
    }

    // Method not allowed
    res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });

  } catch (error) {
    console.error('❌ Contact form submission failed:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to process your request. Please try again later.'
    });
  }
}