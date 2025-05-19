import React, { useState } from 'react';
import { CreditCard, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Subscription {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  nextBilling: string;
  status: 'active' | 'expiring' | 'cancelled';
}

const SubscriptionManager = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: '1',
      name: 'ChatGPT Plus',
      price: 20,
      billingCycle: 'monthly',
      nextBilling: '2025-02-19',
      status: 'active'
    },
    {
      id: '2',
      name: 'Midjourney',
      price: 10,
      billingCycle: 'monthly',
      nextBilling: '2025-02-15',
      status: 'active'
    }
  ]);

  const totalMonthly = subscriptions.reduce((acc, sub) => acc + sub.price, 0);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            AI Subscriptions
          </h2>
          <div className="flex items-center bg-blue-100 dark:bg-blue-900/20 px-4 py-2 rounded-full">
            <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="font-medium text-blue-600 dark:text-blue-400">
              ${totalMonthly}/month
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {subscriptions.map((sub) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {sub.name}
                </h3>
                <div className="flex items-center mt-1">
                  <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-1" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Next billing: {new Date(sub.nextBilling).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-900 dark:text-white">
                  ${sub.price}/{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}
                </span>
                {sub.status === 'active' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Spending Insights
          </h3>
          {/* Add spending charts/graphs here */}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recommendations
          </h3>
          {/* Add cost-saving recommendations here */}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManager;