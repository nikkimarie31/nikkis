import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SubscriptionPlan {
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
}

interface SubscriptionPlans {
  [key: string]: SubscriptionPlan;
}

interface UserSubscription {
  status: string;
  planId: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  isActive: boolean;
}

const Subscription = () => {
  const [plans, setPlans] = useState<SubscriptionPlans>({});
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchPlans();
    fetchSubscriptionStatus();
  }, [user, navigate]);

  const fetchPlans = async () => {
    try {
      const apiUrl = import.meta.env['VITE_API_URL'] || window.location.origin;
      const response = await fetch(`${apiUrl}/api/payments/stripe`);

      if (response.ok) {
        const result = await response.json();
        setPlans(result.plans);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    }
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const apiUrl = import.meta.env['VITE_API_URL'] || window.location.origin;
      const response = await fetch(`${apiUrl}/api/payments/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setUserSubscription(result.subscription);
      }
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    setProcessingPlan(planId);

    try {
      const apiUrl = import.meta.env['VITE_API_URL'] || window.location.origin;
      const response = await fetch(`${apiUrl}/api/payments/stripe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'create-checkout-session',
          planId,
          successUrl: `${window.location.origin}/dashboard?payment=success`,
          cancelUrl: `${window.location.origin}/subscription?payment=cancelled`
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Redirect to Stripe Checkout
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
    } finally {
      setProcessingPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    setProcessingPlan('manage');

    try {
      const apiUrl = import.meta.env['VITE_API_URL'] || window.location.origin;
      const response = await fetch(`${apiUrl}/api/payments/stripe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'create-portal-session'
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Redirect to Stripe Customer Portal
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Failed to create portal session:', error);
    } finally {
      setProcessingPlan(null);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price / 100);
  };

  if (isLoading) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-babyBlue"></div>
      </motion.main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen px-4 py-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Start writing and sharing your opinions with the world
          </p>
        </div>

        {/* Current Subscription Status */}
        {userSubscription && (
          <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Current Subscription
            </h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-700 dark:text-blue-200">
                  Plan: {plans[userSubscription.planId]?.name || userSubscription.planId}
                </p>
                <p className="text-blue-600 dark:text-blue-300 text-sm">
                  Status: {userSubscription.status}
                  {userSubscription.cancelAtPeriodEnd && ' (Will cancel at period end)'}
                </p>
                <p className="text-blue-600 dark:text-blue-300 text-sm">
                  Next billing: {new Date(userSubscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={handleManageSubscription}
                disabled={processingPlan === 'manage'}
                className="btn-secondary"
              >
                {processingPlan === 'manage' ? 'Loading...' : 'Manage Subscription'}
              </button>
            </div>
          </div>
        )}

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {Object.entries(plans).map(([planId, plan]) => {
            const isCurrentPlan = userSubscription?.planId === planId && userSubscription?.isActive;
            const isYearly = plan.interval === 'year';

            return (
              <motion.div
                key={planId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`relative p-8 rounded-xl border-2 ${
                  isYearly
                    ? 'border-babyBlue bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                {isYearly && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-babyBlue text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {formatPrice(plan.price, plan.currency)}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      /{plan.interval}
                    </span>
                  </div>
                  {isYearly && (
                    <p className="text-green-600 dark:text-green-400 font-medium">
                      Save 17% vs monthly
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(planId)}
                  disabled={processingPlan === planId || isCurrentPlan}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    isCurrentPlan
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 cursor-not-allowed'
                      : isYearly
                      ? 'bg-babyBlue text-white hover:bg-blue-600'
                      : 'bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500'
                  }`}
                >
                  {processingPlan === planId
                    ? 'Processing...'
                    : isCurrentPlan
                    ? 'Current Plan'
                    : 'Get Started'
                  }
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Can I cancel anytime?
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                What happens to my posts if I cancel?
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Your published posts will remain live. You just won't be able to create new posts until you resubscribe.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Do you offer refunds?
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                We offer a 30-day money-back guarantee for your first subscription payment.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Can I change plans?
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time through your subscription management page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
};

export default Subscription;