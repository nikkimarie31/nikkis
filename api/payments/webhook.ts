import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Simple in-memory storage for user subscriptions (in production, use a database)
let userSubscriptions: Record<string, {
  userId: string;
  email: string;
  subscriptionId: string;
  customerId: string;
  status: string;
  planId: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}> = {};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const sig = req.headers['stripe-signature'];

  let event: Stripe.Event;

  try {
    const body = JSON.stringify(req.body);
    event = stripe.webhooks.constructEvent(body, sig as string, endpointSecret);
  } catch (err: any) {
    console.log(`❌ Webhook signature verification failed:`, err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

          // Store subscription data
          const userId = session.metadata?.userId;
          const userEmail = session.metadata?.userEmail;
          const planId = session.metadata?.planId;

          if (userId && userEmail && planId) {
            userSubscriptions[userId] = {
              userId,
              email: userEmail,
              subscriptionId: subscription.id,
              customerId: subscription.customer as string,
              status: subscription.status,
              planId,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
              cancelAtPeriodEnd: subscription.cancel_at_period_end
            };

            console.log('✅ New subscription created:', {
              userId,
              email: userEmail,
              planId,
              subscriptionId: subscription.id
            });
          }
        }
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription;

        // Find user by customer ID
        const userByCustomer = Object.values(userSubscriptions).find(
          sub => sub.customerId === updatedSubscription.customer
        );

        if (userByCustomer) {
          userSubscriptions[userByCustomer.userId] = {
            ...userByCustomer,
            status: updatedSubscription.status,
            currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
            cancelAtPeriodEnd: updatedSubscription.cancel_at_period_end
          };

          console.log('🔄 Subscription updated:', {
            userId: userByCustomer.userId,
            status: updatedSubscription.status,
            cancelAtPeriodEnd: updatedSubscription.cancel_at_period_end
          });
        }
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;

        // Find and remove user subscription
        const userByDeletedCustomer = Object.values(userSubscriptions).find(
          sub => sub.customerId === deletedSubscription.customer
        );

        if (userByDeletedCustomer) {
          delete userSubscriptions[userByDeletedCustomer.userId];

          console.log('❌ Subscription cancelled:', {
            userId: userByDeletedCustomer.userId,
            subscriptionId: deletedSubscription.id
          });
        }
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.subscription) {
          // Find user by customer ID and update subscription
          const userByInvoiceCustomer = Object.values(userSubscriptions).find(
            sub => sub.customerId === invoice.customer
          );

          if (userByInvoiceCustomer) {
            console.log('💰 Payment succeeded:', {
              userId: userByInvoiceCustomer.userId,
              amount: invoice.amount_paid / 100,
              currency: invoice.currency
            });
          }
        }
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;

        if (failedInvoice.subscription) {
          const userByFailedCustomer = Object.values(userSubscriptions).find(
            sub => sub.customerId === failedInvoice.customer
          );

          if (userByFailedCustomer) {
            console.log('💳 Payment failed:', {
              userId: userByFailedCustomer.userId,
              subscriptionId: failedInvoice.subscription
            });
          }
        }
        break;

      default:
        console.log(`🔔 Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

// Export function to get user subscription (for other API endpoints)
export const getUserSubscription = (userId: string) => {
  return userSubscriptions[userId] || null;
};

// Export function to check if user has active subscription
export const hasActiveSubscription = (userId: string): boolean => {
  const subscription = userSubscriptions[userId];
  return subscription &&
         subscription.status === 'active' &&
         new Date(subscription.currentPeriodEnd) > new Date();
};