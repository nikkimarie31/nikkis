import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from '@microsoft/microsoft-graph-client';
import { ClientCredentialRequest, ConfidentialClientApplication } from '@azure/msal-node';
import 'isomorphic-fetch';

// Rate limiting storage (in-memory for simplicity)
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

// Email service
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

  async sendContactEmail(formData: { name: string; email: string; message: string }): Promise<void> {
    const { name, email, message } = formData;

    try {
      const graphClient = await this.getGraphClient();

      const mailMessage = {
        subject: `New Contact Form Message from ${name}`,
        body: {
          contentType: 'HTML' as const,
          content: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #89CFF0 0%, #0284c7 100%); padding: 30px; border-radius: 10px 10px 0 0; color: white;">
                <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">From your portfolio website</p>
              </div>

              <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #89CFF0;">
                  <h2 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 18px;">Contact Information</h2>
                  <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
                  <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #89CFF0;">${email}</a></p>
                </div>

                <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #89CFF0;">
                  <h2 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 18px;">Message</h2>
                  <p style="line-height: 1.6; color: #4b5563; white-space: pre-wrap;">${message}</p>
                </div>

                <div style="margin-top: 30px; padding: 15px; background: #e0f2fe; border-radius: 8px; border-left: 4px solid #89CFF0;">
                  <p style="margin: 0; font-size: 14px; color: #0369a1;">
                    💡 <strong>Quick Reply:</strong> You can reply directly to this email to respond to ${name}.
                  </p>
                </div>

                <div style="margin-top: 20px; text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; font-size: 12px; color: #6b7280;">
                    This message was sent from the contact form on inmyop1nion.com<br>
                    Sent on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          `,
        },
        toRecipients: [
          {
            emailAddress: {
              address: process.env.CONTACT_EMAIL!,
            },
          },
        ],
        replyTo: [
          {
            emailAddress: {
              address: email,
              name: name,
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

      console.log('✅ Email sent successfully via Microsoft Graph');
    } catch (error) {
      console.error('❌ Failed to send email via Microsoft Graph:', error);
      // Don't throw error - form submission should succeed even if email fails
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

      // Send email (but don't fail if email sending fails)
      try {
        const emailService = new EmailService();
        await emailService.sendContactEmail(formData);
        console.log('✅ Contact form email sent successfully for:', formData.name);
      } catch (emailError) {
        console.error('❌ Failed to send email, but form submission succeeded:', emailError);
      }

      res.status(200).json({
        success: true,
        message: 'Thank you! Your message has been sent successfully. I\'ll get back to you soon!'
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