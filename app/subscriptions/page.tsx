"use client"

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Check, Zap, Sparkles, ChevronLeft, Clock } from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionPlans() {
  const [hoveredPlan, setHoveredPlan] = useState<'basic' | 'premium' | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [greeting, setGreeting] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Set greeting based on time of day
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      let newGreeting = '';
      
      if (hour >= 5 && hour < 12) {
        newGreeting = 'Good morning';
      } else if (hour >= 12 && hour < 18) {
        newGreeting = 'Good afternoon';
      } else {
        newGreeting = 'Good evening';
      }
      
      setGreeting(newGreeting);
    };
    
    updateGreeting();
    // Update greeting every minute in case user is on the page during time change
    const intervalId = setInterval(updateGreeting, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Handle scroll events for mobile
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isMobile) return;

    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        const scrollPosition = container.scrollLeft;
        const scrollWidth = container.scrollWidth;
        const planCount = Object.keys(plans).length;
        const scrollPerPlan = scrollWidth / planCount;
        
        const newIndex = Math.round(scrollPosition / scrollPerPlan * (planCount - 1));
        setActiveIndex(newIndex);
        setHoveredPlan(Object.keys(plans)[newIndex] as 'basic' | 'premium');
      }, 100);
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  const plans = {
    basic: {
      name: "Basic",
      price: "$9.99",
      period: "per month",
      features: [
        "Access to core features",
        "Basic analytics",
        "Email support",
        "5 projects limit"
      ],
      image: "/Godfather-loveit.svg",
      cta: "Get Started"
    },
    premium: {
      name: "Premium",
      price: "$29.99",
      period: "per month",
      features: [
        "All Basic features plus",
        "Advanced analytics",
        "Priority support",
        "Unlimited projects",
        "Early access to new features"
      ],
      image: "/Godfather-realdeal.svg",
      cta: "Go Premium"
    }
  };

  // Smooth scroll to plan on mobile
  const scrollToPlan = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container || !isMobile) return;

    const scrollWidth = container.scrollWidth;
    const planCount = Object.keys(plans).length;
    const scrollPosition = (scrollWidth / planCount) * index;
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-black hover:text-gray-600 transition-colors">
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>Back</span>
          </Link>
        </div>

        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          {/* Dynamic Greeting */}
          <div className="flex items-center justify-center mb-3 text-black font-medium">
            <Clock className="w-4 h-4 mr-2" />
            <span>{greeting}, Welcome to our plans</span>
          </div>
          
          {/* Improved Responsive Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 sm:mb-4 tracking-tight leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              <span className="text-black">Choose</span> <span className="text-black">Y</span><span className="text-[#ffbd59]">our</span> Perfect Plan
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Select the plan which suits your needs and budget.
          </p>
        </div>

        {/* Mobile Image - Shows between plans on small screens */}
        <div className="block lg:hidden mb-8">
          <div className="relative aspect-square w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-lg">
            <Image
              src={hoveredPlan ? plans[hoveredPlan].image : "/Godfather-offer.svg"}
              alt={hoveredPlan ? `${plans[hoveredPlan].name} Plan` : "Subscription Plans"}
              fill
              className="object-cover transition-opacity duration-500"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <div>
                <h3 className="text-white text-xl font-bold mb-2">
                  {hoveredPlan ? plans[hoveredPlan].name : "Our Plans"}
                </h3>
                <p className="text-gray-200 text-sm">
                  {hoveredPlan 
                    ? `Everything included in the ${plans[hoveredPlan].name} plan`
                    : "Swipe to explore plans"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Plans Section - Scrollable on mobile */}
          <div className="lg:space-y-8">
            {/* Mobile Scrollable Container */}
            <div 
              ref={scrollContainerRef}
              className="lg:hidden flex overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                scrollSnapType: 'x mandatory'
              }}
            >
              {Object.entries(plans).map(([key, plan], index) => (
                <div
                  key={key}
                  className="flex-shrink-0 w-[calc(100%-2rem)] snap-center px-2"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div 
                    className={`relative p-8 rounded-xl border-2 transition-all duration-300 h-full ${
                      activeIndex === index ? 'border-indigo-500 shadow-xl' : 'border-gray-200 shadow-md'
                    }`}
                    onClick={() => {
                      setHoveredPlan(key as 'basic' | 'premium');
                      scrollToPlan(index);
                    }}
                  >
                    {key === "premium" && (
                      <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium flex items-center">
                        <Sparkles className="w-4 h-4 mr-1" />
                        Recommended
                      </div>
                    )}
                    
                    <div className="flex items-center mb-6">
                      <div className={`p-3 rounded-lg mr-4 ${
                        key === "basic" ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'
                      }`}>
                        {key === "basic" ? <Zap className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                        <p className="text-gray-600">{plan.price} <span className="text-sm">{plan.period}</span></p>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                        key === "basic" ? 'bg-blue-600 hover:bg-blue-700 text-white' : 
                        'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Normal Layout */}
            <div className="hidden lg:block lg:space-y-8">
              {Object.entries(plans).map(([key, plan]) => (
                <div
                  key={key}
                  className={`relative p-8 rounded-xl border-2 transition-all duration-300 ${
                    hoveredPlan === key ? 'border-indigo-500 shadow-xl' : 'border-gray-200 shadow-md'
                  }`}
                  onMouseEnter={() => setHoveredPlan(key as 'basic' | 'premium')}
                  onMouseLeave={() => setHoveredPlan(null)}
                >
                  {key === "premium" && (
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium flex items-center">
                      <Sparkles className="w-4 h-4 mr-1" />
                      Recommended
                    </div>
                  )}
                  
                  <div className="flex items-center mb-6">
                    <div className={`p-3 rounded-lg mr-4 ${
                      key === "basic" ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      {key === "basic" ? <Zap className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                      <p className="text-gray-600">{plan.price} <span className="text-sm">{plan.period}</span></p>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                      key === "basic" ? 'bg-blue-600 hover:bg-blue-700 text-white' : 
                      'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Image Section */}
          <div className="hidden lg:block sticky top-24 self-start">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-xl">
              <Image
                src={hoveredPlan ? plans[hoveredPlan].image : "/Godfather-offer.svg"}
                alt={hoveredPlan ? `${plans[hoveredPlan].name} Plan` : "Subscription Plans"}
                fill
                className="object-cover transition-opacity duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div>
                  <h3 className="text-white text-2xl font-bold mb-2">
                    {hoveredPlan ? plans[hoveredPlan].name : "Our Plans"}
                  </h3>
                  <p className="text-gray-200">
                    {hoveredPlan 
                      ? `Everything included in the ${plans[hoveredPlan].name} plan`
                      : "Hover over a plan to see what's included"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Scroll Indicator */}
        <div className="flex justify-center mt-6 lg:hidden">
          <div className="flex space-x-2">
            {Object.keys(plans).map((key, index) => (
              <button 
                key={key}
                onClick={() => scrollToPlan(index)}
                className={`h-2 rounded-full transition-all ${
                  activeIndex === index ? 'w-6 bg-indigo-600' : 'w-2 bg-gray-300'
                }`}
                aria-label={`Go to ${key} plan`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}