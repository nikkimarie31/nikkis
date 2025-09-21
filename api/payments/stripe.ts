import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

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

// Subscription plans
const SUBSCRIPTION_PLANS = {
  'writer_monthly': {
    name: 'Writer Monthly',
    price: 999, // $9.99 in cents
    currency: 'usd',
    interval: 'month',
    features: ['Write unlimited posts', 'Analytics dashboard', 'Priority support']
  },
  'writer_yearly': {
    name: 'Writer Yearly',
    price: 9999, // $99.99 in cents (2 months free)
    currency: 'usd',
    interval: 'year',
    features: ['Write unlimited posts', 'Analytics dashboard', 'Priority support', '2 months free']
  }
};

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

  try {
    if (req.method === 'GET') {
      // Get subscription plans
      res.status(200).json({
        success: true,
        plans: SUBSCRIPTION_PLANS
      });
      return;
    }

    if (req.method === 'POST') {
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

      const { action, planId, successUrl, cancelUrl } = req.body;

      if (action === 'create-checkout-session') {
        // Create Stripe checkout session
        if (!planId || !SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS]) {
          res.status(400).json({
            success: false,
            error: 'Invalid plan selected'
          });
          return;
        }

        const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS];

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: plan.currency,
                product_data: {
                  name: plan.name,
                  description: `Access to writer features: ${plan.features.join(', ')}`,
                },
                unit_amount: plan.price,
                recurring: {
                  interval: plan.interval as 'month' | 'year',
                },
              },
              quantity: 1,
            },
          ],
          mode: 'subscription',
          success_url: successUrl || `${process.env.NODE_ENV === 'production' ? 'https://www.inmyop1nion.com' : 'http://localhost:5173'}/dashboard?payment=success`,
          cancel_url: cancelUrl || `${process.env.NODE_ENV === 'production' ? 'https://www.inmyop1nion.com' : 'http://localhost:5173'}/dashboard?payment=cancelled`,
          customer_email: decoded.email,
          metadata: {
            userId: decoded.userId,
            planId: planId,
            userEmail: decoded.email,
            userName: decoded.name
          },
        });

        res.status(200).json({
          success: true,
          sessionId: session.id,
          url: session.url
        });
        return;
      }

      if (action === 'create-portal-session') {
        // Create customer portal session for managing subscription
        try {
          // First, find the customer by email
          const customers = await stripe.customers.list({
            email: decoded.email,
            limit: 1
          });

          if (customers.data.length === 0) {
            res.status(404).json({
              success: false,
              error: 'No subscription found for this user'
            });
            return;
          }

          const portalSession = await stripe.billingPortal.sessions.create({
            customer: customers.data[0].id,
            return_url: `${process.env.NODE_ENV === 'production' ? 'https://www.inmyop1nion.com' : 'http://localhost:5173'}/dashboard`,
          });

          res.status(200).json({
            success: true,
            url: portalSession.url
          });
          return;
        } catch (error) {
          console.error('Portal session error:', error);
          res.status(400).json({
            success: false,
            error: 'Unable to create portal session'
          });
          return;
        }
      }

      res.status(400).json({
        success: false,
        error: 'Invalid action'
      });
      return;
    }

    res.status(405).json({ success: false, error: 'Method not allowed' });

  } catch (error) {
    console.error('❌ Stripe operation failed:', error);

    res.status(500).json({
      success: false,
      error: 'Payment processing failed. Please try again later.'
    });
  }
}