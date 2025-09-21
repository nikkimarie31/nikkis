import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from '@microsoft/microsoft-graph-client';
import { ClientCredentialRequest, ConfidentialClientApplication } from '@azure/msal-node';
import 'isomorphic-fetch';

// Simple in-memory storage for subscribers (you can upgrade to a database later)
// In a real app, you'd use a database like PostgreSQL, MongoDB, or Supabase
let subscribers: Array<{
  email: string;
  name?: string;
  subscribedAt: string;
  confirmed: boolean;
}> = [];

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
const validateSubscriptionForm = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required and must be a string');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email must be a valid email address');
  }

  if (data.name && typeof data.name !== 'string') {
    errors.push('Name must be a string');
  } else if (data.name && data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Email service for welcome emails
class EmailService {
  private msalInstance: ConfidentialClientApplication;

  constructor() {
    this.msalInstance = new ConfidentialClientApplication({
      auth: {
        clientId: process.env.AZURE_CLIENT_ID!,
        clientSecret: process.env.AZURE_CLIENT_SECRET!,
        authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
      },
    });
  }

  private async getAccessToken(): Promise<string> {
    const clientCredentialRequest: ClientCredentialRequest = {
      scopes: ['https://graph.microsoft.com/.default'],
    };

    try {
      const response = await this.msalInstance.acquireTokenByClientCredential(clientCredentialRequest);
      return response?.accessToken || '';
    } catch (error) {
      console.error('Failed to acquire access token:', error);
      throw new Error('Failed to authenticate with Microsoft Graph');
    }
  }

  private async getGraphClient(): Promise<Client> {
    const accessToken = await this.getAccessToken();

    return Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });
  }

  async sendWelcomeEmail(subscriber: { name?: string; email: string }): Promise<void> {
    const { name, email } = subscriber;
    const firstName = name || 'there';

    try {
      const graphClient = await this.getGraphClient();

      const mailMessage = {
        subject: `Welcome to Nicole's Newsletter! 🎉`,
        body: {
          contentType: 'HTML' as const,
          content: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #89CFF0 0%, #0284c7 100%); padding: 40px 30px; border-radius: 15px 15px 0 0; color: white; text-align: center;">
                <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Welcome to the Community! 🎉</h1>
                <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.9;">Thanks for subscribing, ${firstName}!</p>
              </div>

              <div style="background: #f9fafb; padding: 40px 30px; border-radius: 0 0 15px 15px; border: 1px solid #e5e7eb;">
                <div style="background: white; padding: 25px; border-radius: 10px; margin-bottom: 25px; border-left: 4px solid #89CFF0;">
                  <h2 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 20px;">What to expect:</h2>
                  <ul style="color: #4b5563; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li><strong style="color: #89CFF0;">New Blog Posts</strong> - Latest insights on web development and UX design</li>
                    <li><strong style="color: #89CFF0;">Project Updates</strong> - Behind-the-scenes looks at my latest work</li>
                    <li><strong style="color: #89CFF0;">Tech Tips</strong> - Practical advice and tutorials</li>
                    <li><strong style="color: #89CFF0;">Career Journey</strong> - Updates on my growth as a developer</li>
                  </ul>
                </div>

                <div style="background: white; padding: 25px; border-radius: 10px; border-left: 4px solid #89CFF0;">
                  <h2 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 20px;">Get started:</h2>
                  <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
                    While you're here, why not check out my latest blog posts or explore my portfolio?
                    I'd love to hear what projects you're working on too!
                  </p>
                  <div style="text-align: center;">
                    <a href="https://www.inmyop1nion.com"
                       style="display: inline-block; background: #89CFF0; color: white; padding: 12px 24px;
                              text-decoration: none; border-radius: 8px; font-weight: bold; margin: 0 10px 10px 0;">
                      Visit Portfolio
                    </a>
                    <a href="https://www.inmyop1nion.com/blog"
                       style="display: inline-block; background: transparent; color: #89CFF0; padding: 12px 24px;
                              text-decoration: none; border: 2px solid #89CFF0; border-radius: 8px; font-weight: bold;">
                      Read Blog
                    </a>
                  </div>
                </div>

                <div style="margin-top: 30px; padding: 20px; background: #e0f2fe; border-radius: 10px; border-left: 4px solid #89CFF0;">
                  <p style="margin: 0; font-size: 14px; color: #0369a1; text-align: center;">
                    💡 <strong>Have questions or want to collaborate?</strong><br>
                    Just reply to this email - I read and respond to every message!
                  </p>
                </div>

                <div style="margin-top: 25px; text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; font-size: 12px; color: #6b7280;">
                    You're receiving this because you subscribed to updates from inmyop1nion.com<br>
                    <a href="mailto:${process.env.CONTACT_EMAIL}?subject=Unsubscribe" style="color: #89CFF0;">Unsubscribe</a> |
                    <a href="https://www.inmyop1nion.com" style="color: #89CFF0;">Visit Website</a>
                  </p>
                </div>
              </div>
            </div>
          `,
        },
        toRecipients: [
          {
            emailAddress: {
              address: email,
              name: name || email,
            },
          },
        ],
        replyTo: [
          {
            emailAddress: {
              address: process.env.CONTACT_EMAIL!,
              name: 'Nicole Vallencourt',
            },
          },
        ],
      };

      const fromEmail = process.env.CONTACT_EMAIL!;

      await graphClient
        .api(`/users/${fromEmail}/sendMail`)
        .post({
          message: mailMessage,
        });

      console.log('✅ Welcome email sent successfully to:', email);
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      // Don't throw error - subscription should still succeed even if email fails
    }
  }
}

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
      // Get subscriber stats (for admin purposes)
      res.status(200).json({
        success: true,
        stats: {
          total: subscribers.length,
          confirmed: subscribers.filter(s => s.confirmed).length,
          recent: subscribers.filter(s =>
            new Date(s.subscribedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length
        },
        message: 'Subscription stats retrieved successfully'
      });
      return;
    }

    if (req.method === 'POST') {
      // Check rate limiting
      if (isRateLimited(clientIP)) {
        res.status(429).json({
          success: false,
          error: 'Too many subscription attempts, please try again later.'
        });
        return;
      }

      console.log('📧 Newsletter subscription received:', {
        timestamp: new Date().toISOString(),
        ip: clientIP,
        userAgent: req.headers['user-agent']
      });

      // Validate environment variables
      const requiredEnvVars = ['AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET', 'AZURE_TENANT_ID', 'CONTACT_EMAIL'];
      const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

      if (missingEnvVars.length > 0) {
        console.error('❌ Missing required environment variables:', missingEnvVars);
        res.status(500).json({
          success: false,
          error: 'Server configuration error'
        });
        return;
      }

      // Validate request body
      const validation = validateSubscriptionForm(req.body);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validation.errors
        });
        return;
      }

      const subscriberData = {
        email: req.body.email.trim().toLowerCase(),
        name: req.body.name?.trim() || undefined,
        subscribedAt: new Date().toISOString(),
        confirmed: true // For simplicity, auto-confirm. You could add email confirmation later.
      };

      // Check if already subscribed
      const existingSubscriber = subscribers.find(s => s.email === subscriberData.email);
      if (existingSubscriber) {
        res.status(409).json({
          success: false,
          error: 'This email is already subscribed to our newsletter.'
        });
        return;
      }

      // Add subscriber
      subscribers.push(subscriberData);

      // Send welcome email
      try {
        const emailService = new EmailService();
        await emailService.sendWelcomeEmail(subscriberData);
      } catch (error) {
        console.error('❌ Failed to send welcome email, but subscription succeeded:', error);
      }

      console.log('✅ Newsletter subscription successful for:', subscriberData.email);

      res.status(200).json({
        success: true,
        message: `Welcome${subscriberData.name ? `, ${subscriberData.name}` : ''}! Thank you for subscribing. Check your email for a welcome message!`
      });
      return;
    }

    // Method not allowed
    res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });

  } catch (error) {
    console.error('❌ Newsletter subscription failed:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to process your subscription. Please try again later.'
    });
  }
}