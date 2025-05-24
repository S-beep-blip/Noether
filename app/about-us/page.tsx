// app/about/page.tsx
"use client"

import { ArrowLeft, Mountain, Users, BookOpen, Globe, Rocket, Code, ChevronRight, Sparkles } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState, useRef } from "react"

// Star component with different shapes and colors
type StarProps = {
  style: React.CSSProperties;
  variant: 'dot' | 'star' | 'diamond';
};

const Star = ({ style, variant }: StarProps) => {
  const renderStar = () => {
    switch (variant) {
      case 'dot':
        return <div className="absolute rounded-full" style={style} />;
      case 'star':
        return (
          <div className="absolute" style={style}>
            <Sparkles className="text-yellow-300 w-full h-full" />
          </div>
        );
      case 'diamond':
        return <div className="absolute rotate-45" style={style} />;
      default:
        return <div className="absolute rounded-full" style={style} />;
    }
  };

  return renderStar();
};

export default function AboutPage() {
  interface Star {
    id: number;
    variant: 'dot' | 'star' | 'diamond';
    size: number;
    x: number;
    y: number;
    style: React.CSSProperties;
  }
  
  const [stars, setStars] = useState<Star[]>([]);
  const heroRef = useRef<HTMLDivElement | null>(null);

  // Generate stars on component mount with enhanced effects
  useEffect(() => {
    const generateStars = () => {

      const newStars: Star[] = [];
      const heroSection = heroRef.current;
      
      if (!heroSection) return;
      
      const { width, height } = heroSection.getBoundingClientRect();
      
      // Create an array of color options
      const colors = [
        'rgba(255, 189, 89, 0.9)', // Main theme color
        'rgba(255, 215, 0, 0.8)',  // Gold
        'rgba(255, 255, 255, 0.9)', // White
        'rgba(255, 223, 186, 0.85)', // Light peach
      ];
      
      // Create star variants

      const variants: Array<'dot' | 'star' | 'diamond'> = ['dot', 'star', 'diamond'];
      
      // Create 75 stars - more stars for a denser effect
      for (let i = 0; i < 75; i++) {
        // Random properties for each star

        const variant = variants[Math.floor(Math.random() * variants.length)] as 'dot' | 'star' | 'diamond';
        const size = variant === 'star' ? 
                    (Math.random() * 10 + 5) : // Larger for star icons
                    (Math.random() * 5 + 1);   // Smaller for dots/diamonds
                    
        const x = Math.random() * width;
        const y = Math.random() * (height * 0.7) + (height * 0.15); // Cover more of the hero area
        const duration = Math.random() * 4 + 2; // 2-6s animation
        const delay = Math.random() * 7; // More varied delays
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Different movement patterns
        const moveX = (Math.random() - 0.5) * 10; // Random horizontal movement
        const moveY = (Math.random() - 0.5) * 10; // Random vertical movement
        
        newStars.push({
          id: i,
          variant,
          size,
          x,
          y,
          style: {
            width: `${size}px`,
            height: `${size}px`,
            left: `${x}px`,
            top: `${y}px`,
            backgroundColor: variant !== 'star' ? color : 'transparent',
            opacity: 0,
            transform: 'scale(0.2)',
            animation: `sparkle${i % 3} ${duration}s ease-in-out ${delay}s infinite`,
            boxShadow: variant !== 'star' ? `0 0 ${Math.floor(size)}px ${color}` : 'none',
            zIndex: 5
          }
        });
      }
      
      setStars(newStars);
    };    
    generateStars();
    
    // Handle resize with debounce for performance
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(generateStars, 200);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const team = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "AI enthusiast with 10+ years in NLP research",
      funFact: "Speaks 4 languages fluently"
    },
    {
      name: "Sam Lee",
      role: "Lead Developer",
      bio: "Full-stack wizard focused on seamless UX",
      funFact: "Former competitive programmer"
    },
    {
      name: "Taylor Smith",
      role: "Linguistics Expert",
      bio: "PhD in Computational Linguistics",
      funFact: "Collects rare dictionaries"
    }
  ]

  const milestones = [
    { year: "2023", event: "Concept Born", detail: "Initial idea for context-aware dictionary" },
    { year: "2024", event: "Alpha Launch", detail: "First working prototype released" },
    { year: "2025", event: "Active Dictionary", detail: "Public beta with AI enhancements" }
  ]

  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-[#ffbd59]" />,
      title: "Context-Aware",
      desc: "Understands words based on how they're actually used"
    },
    {
      icon: <Globe className="h-6 w-6 text-[#ffbd59]" />,
      title: "Multi-Language",
      desc: "Works across 20+ languages and counting"
    },
    {
      icon: <Rocket className="h-6 w-6 text-[#ffbd59]" />,
      title: "Always Improving",
      desc: "Learns from user interactions to get smarter"
    }
  ]

  return (
    <div className="bg-white">
      {/* Back Button - Fixed at top left */}
      <div className="fixed top-4 left-4 z-50">
        <Button asChild variant="ghost" className="rounded-full p-2">
          <Link href="/" className="flex items-center">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only md:not-sr-only md:ml-2">Go Back</span>
          </Link>
        </Button>
      </div>

      {/* Hero Section with Enhanced Sparkling Animation */}
      <section 
        ref={heroRef}
        id="hero-section" 
        className="relative bg-gradient-to-r from-[#ffbd59]/10 via-white to-[#ffbd59]/10 pt-16 overflow-hidden"
      >
        {/* Enhanced Stars animation with different variants */}
        <div className="absolute inset-0 z-0">
          {stars.map((star) => (
            <Star key={star.id} style={star.style} variant={star.variant} />
          ))}
        </div>
        
        {/* CSS for the animations with multiple variations */}
        <style jsx>{`
          @keyframes sparkle0 {
            0% { opacity: 0; transform: scale(0.2); }
            25% { opacity: 0.3; }
            50% { opacity: 1; transform: scale(1); }
            75% { opacity: 0.3; }
            100% { opacity: 0; transform: scale(0.2); }
          }
          
          @keyframes sparkle1 {
            0% { opacity: 0; transform: scale(0.2) translate(0, 0); }
            25% { opacity: 0.5; }
            50% { opacity: 1; transform: scale(1) translate(5px, -5px); }
            75% { opacity: 0.5; }
            100% { opacity: 0; transform: scale(0.2) translate(0, 0); }
          }
          
          @keyframes sparkle2 {
            0% { opacity: 0; transform: scale(0.2) rotate(0deg); }
            30% { opacity: 0.7; }
            50% { opacity: 1; transform: scale(1) rotate(180deg); }
            70% { opacity: 0.7; }
            100% { opacity: 0; transform: scale(0.2) rotate(360deg); }
          }
        `}</style>
        
        {/* Content with added subtle parallax effect */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24 text-center relative z-10">
          <div className="relative transform transition-all duration-1000 hover:translate-y-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Revolutionizing How You <span className="text-[#ffbd59] relative">
                Understand
                <span className="absolute -inset-1 -z-10 opacity-20 blur-sm bg-[#ffbd59]/30 rounded-lg"></span>
              </span> Words
            </h1>
            <p className="mt-4 text-lg sm:text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
              We're building the world's most intuitive dictionary that adapts to your context and learning style.
            </p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="default" size="lg" className="w-full sm:w-auto bg-black hover:bg-[#ffbd59] text-white px-6 py-2">
              <Link href="/documentation">
                See How It Works
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="#team">
                Meet Our Team
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-base font-semibold leading-7 text-[#ffbd59]">Our Mission</h2>
            <p className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Making language understanding effortless
            </p>
            <p className="mt-4 text-base sm:text-lg leading-7 text-gray-600">
              We believe dictionaries should be active tools that understand context, not passive references.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="group relative p-6 bg-white rounded-xl border border-gray-200 hover:border-[#ffbd59]/50 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="absolute -top-5 left-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#ffbd59]/10 group-hover:bg-[#ffbd59]/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="mt-8 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.desc}</p>
                <div className="mt-4 flex items-center text-[#ffbd59] text-sm font-medium group-hover:translate-x-1 transition-transform">
                  Learn more <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-12 sm:py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-base font-semibold leading-7 text-[#ffbd59]">Our Team</h2>
            <p className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              The minds behind Active Dictionary
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((person, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className="relative h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden group">
                  <Users className="h-16 w-16 text-gray-400" />
                  <div className="absolute inset-0 bg-[#ffbd59]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">{person.name}</h3>
                <p className="text-[#ffbd59] font-medium">{person.role}</p>
                <p className="mt-3 text-gray-600">{person.bio}</p>
                <div className="mt-4 w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <p className="text-xs font-medium text-gray-500">Fun fact</p>
                  <p className="text-sm text-gray-700">{person.funFact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-base font-semibold leading-7 text-[#ffbd59]">Our Journey</h2>
            <p className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Building the future of dictionaries
            </p>
          </div>
          
          <div className="mt-12 flow-root">
            <ul className="-mb-8">
              {milestones.map((milestone, index) => (
                <li key={index}>
                  <div className="relative pb-8">
                    {index !== milestones.length - 1 ? (
                      <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffbd59] ring-8 ring-[#ffbd59]/10">
                          <Code className="h-4 w-4 text-white" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between pt-1.5">
                        <div>
                          <p className="text-sm text-gray-500">
                            {milestone.year}{' '}
                            <span className="font-medium text-gray-900">{milestone.event}</span>
                          </p>
                          <p className="text-sm text-gray-600">{milestone.detail}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#ffbd59]/10 py-12 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Ready to experience the future of dictionaries?
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-7 text-gray-600">
            Join thousands of users who learn languages faster with context-aware definitions.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="default" size="lg" className="w-full sm:w-auto bg-black hover:bg-[#ffbd59] text-white px-6 py-2">
              <Link href="/">
                Try Active Dictionary
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/documentation">
                Read Documentation
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}