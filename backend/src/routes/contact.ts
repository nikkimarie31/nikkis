import express from 'express';
import { emailService, ContactFormData } from '../services/emailService.js';

const router = express.Router();

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

// POST /api/contact - Send contact form email
router.post('/', async (req, res, next) => {
  try {
    console.log('📨 Contact form submission received:', {
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Validate request body
    const validation = validateContactForm(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }

    const formData: ContactFormData = {
      name: req.body.name.trim(),
      email: req.body.email.trim().toLowerCase(),
      message: req.body.message.trim()
    };

    // Send email
    await emailService.sendContactEmail(formData);

    console.log('✅ Contact form email sent successfully for:', formData.name);

    res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. I\'ll get back to you soon!'
    });

  } catch (error) {
    console.error('❌ Contact form submission failed:', error);
    next(error);
  }
});

// GET /api/contact/test - Test email service connection
router.get('/test', async (req, res, next) => {
  try {
    console.log('🔧 Testing email service connection...');

    const isConnected = await emailService.testConnection();

    if (isConnected) {
      res.status(200).json({
        success: true,
        message: 'Email service connection successful',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Email service connection failed',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('❌ Email service test failed:', error);
    next(error);
  }
});

export default router;