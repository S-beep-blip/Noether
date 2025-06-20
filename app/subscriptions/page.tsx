'use client';
import React, { useState } from 'react';
import { Check, Star, Zap, Crown, ChevronDown } from 'lucide-react';

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Can I change my plan at any time?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
    },
    {
      question: "Is there a free trial available?",
      answer: "Absolutely! Our Free plan gives you full access to core features with generous limits. No credit card required to get started."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise customers. All payments are processed securely through Stripe."
    },
    {
      question: "Do you offer discounts for students or nonprofits?",
      answer: "Yes! We offer 50% discounts for verified students and qualifying nonprofit organizations. Contact our support team to apply."
    },
    {
      question: "What happens if I exceed my plan limits?",
      answer: "We'll notify you before you reach your limits. You can either upgrade your plan or purchase additional resources as needed."
    },
    {
      question: "Is my data secure and backed up?",
      answer: "Your data is encrypted at rest and in transit. We perform daily backups and maintain 99.9% uptime with enterprise-grade security measures."
    }
  ];

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      description: 'Perfect for getting started',
      features: [
        'Up to 3 projects',
        '5GB storage',
        'Basic templates',
        'Community support',
        'Standard integrations',
        'Basic analytics'
      ],
      icon: <Star className="w-5 h-5" />,
      buttonText: 'Get Started Free',
      buttonStyle: 'border-2 border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50'
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 29,
      description: 'Best for professionals and teams',
      features: [
        'Unlimited projects',
        '100GB storage',
        'Premium templates',
        'Priority support',
        'Advanced analytics',
        'Team collaboration',
        'Custom integrations',
        'API access'
      ],
      icon: <Zap className="w-5 h-5" />,
      buttonText: 'Start Pro Plan',
      buttonStyle: 'bg-yellow-400 text-black hover:bg-yellow-500 border-2 border-yellow-400',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      description: 'For large teams and organizations',
      features: [
        'Everything in Pro',
        'Unlimited storage',
        'White-label solution',
        'Dedicated support manager',
        'Custom development',
        'SLA guarantee',
        'Advanced security',
        'Multi-region hosting'
      ],
      icon: <Crown className="w-5 h-5" />,
      buttonText: 'Get Enterprise',
      buttonStyle: 'border-2 border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <div className="relative flex items-center justify-center px-4 pt-20 pb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-black">
            Choose Your
            <br />
            <span className="text-yellow-500">Perfect Plan</span>
          </h1>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-black">
              Simple Pricing
            </h2>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  plan.popular ? 'md:-translate-y-4' : ''
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className={`relative h-full bg-white border-2 border-t-2 border-l-2 border-r-2 border-b-0 rounded-t-2xl p-8 transition-all duration-300 overflow-hidden ${
                  plan.popular 
                    ? 'border-yellow-400' 
                    : selectedPlan === plan.id 
                      ? 'border-yellow-400' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}>
                  {/* Faded bottom overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-gray-50/30 to-transparent pointer-events-none"></div>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-xl ${
                      plan.popular ? 'bg-yellow-400 text-black' : 'bg-gray-100 text-gray-900'
                    }`}>
                      {plan.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-black">{plan.name}</h3>
                      <p className="text-gray-600 text-sm">{plan.description}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-bold text-black">${plan.price}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${plan.buttonStyle}`}>
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about our plans and pricing</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg bg-white">
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold text-black">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${
                    openFaq === index ? 'rotate-180' : ''
                  }`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;