"use client"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import Navbar from "@/components/navbar"
import AnimatedBeamDemo from "@/components/animated-beam-multiple-inputs"
import AnimatedButton from "@/components/animated-button"

export default function Homepage() {
  const [isVisible, setIsVisible] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    
    let animationId: number
    let speed = 2 // pixels per frame - adjust for speed
    
    const animate = () => {
      setScrollPosition(prev => {
        if (!scrollRef.current) return prev
        const containerWidth = scrollRef.current.scrollWidth / 2 // Since we duplicated the items
        const newPos = (prev + speed) % containerWidth
        return newPos
      })
      animationId = requestAnimationFrame(animate)
    }
    
    animationId = requestAnimationFrame(animate)
    
    return () => cancelAnimationFrame(animationId)
  }, [])

  const companies = [
    {
      name: "Google Gemini AI",
      logo: "/company-wordmark/gemini_wordmark.svg",
      alt: "Google Gemini AI"
    },
    {
      name: "Tavily AI",
      logo: "/company-wordmark/tavily_wordmark.svg",
      alt: "Tavily AI"
    },
    {
      name: "Hume AI",
      logo: "/company-wordmark/hume_wordmark.svg",
      alt: "Hume AI"
    },
    {
      name: "Supabase",
      logo: "/company-wordmark/supabase_wordmark.svg",
      alt: "Supabase"
    },
    {
      name: "NextJS",
      logo: "/company-wordmark/nextjs_wordmark.svg",
      alt: "NextJS"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>

      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-20 py-10 relative z-10">
        {/* Background image for desktop */}
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-80 z-0 pointer-events-none hidden lg:flex">
          <Image
            src="/Files.svg"
            alt="Background"
            width={600}
            height={600}
            className="opacity-25 object-contain"
            priority
          />
        </div>

        {/* Centered Hero Content */}
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center text-center relative z-10 min-h-[55vh] -mt-4">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black mb-0 hero-regular select-none leading-tight">
            <span className="text-[#ffbd59]">Read</span>y,
            <span className="text-black"> Set,</span>
            <br />
            <span className="text-black">Understand.</span>
          </h1>

          <p className="text-sm sm:text-xl text-gray-600 mb-16 max-w-3xl select-none hero-regular leading-relaxed">
            <span className="sm:whitespace-nowrap">
              Noether is your context-aware reading companion
              <span className="hidden sm:inline">&nbsp;</span>
              <br className="sm:hidden" />
              where every word makes sense.
            </span>
          </p>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl select-none hero-regular leading-relaxed">
            Don't just read it, Understand it.<span className="hidden sm:inline">&nbsp;</span><br className="sm:hidden" />using Noether, you can.
          </p>
      
          <AnimatedButton 
            href="/Noether"
            initialText="Try Noether"
            hoverText="Let's Go!"
            className="hero-regular"
          />
        </div>

        {/* Powered By Section */}
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center mt-16 mb-10 relative z-10">
          {/* Powered By Heading */}
          <div className="relative w-full mx-auto">
            <div className="w-full h-px bg-gray-300 mb-4"></div>
            <div className="bg-[#f8f1dc] py-6 px-8 relative">
              <h2 className="text-4xl sm:text-5xl font-semibold text-gray-700 text-center hero-regular select-none">
                🔥 Powered by
              </h2>
            </div>
            <div className="w-full h-px bg-gray-300 mt-4 mb-8"></div>
          </div>

          <AnimatedBeamDemo />

          {/* Auto-scrolling Company Wordmarks with Fade-in */}
          <div className="w-full overflow-hidden mt-6 relative">
            {/* Gradient overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            {/* Scrolling content with fade-in */}
            <div className={`scroll-container ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <div 
                className="scroll-content"
                ref={scrollRef}
                style={{ transform: `translateX(-${scrollPosition}px)` }}
              >
                {[...companies, ...companies].map((company, index) => (
                  <div key={`${company.name}-${index}`} className="scroll-item">
                    <Image
                      src={company.logo}
                      alt={company.alt}
                      width={120}
                      height={40}
                      className="wordmark-logo"
                      priority={index < companies.length}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* CSS for animations */}
      <style jsx>{`
        .scroll-container {
          width: 100%;
          overflow: hidden;
          min-height: 70px;
          transition: opacity 0.5s ease-out;
        }
        
        .scroll-content {
          display: flex;
          align-items: center;
          width: max-content;
          will-change: transform;
        }
        
        .scroll-item {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin: 0 3rem;
          transition: all 0.3s ease;
          user-select: none;
          flex-shrink: 0;
          height: 60px;
        }
        
        .wordmark-logo {
          max-width: 120px;
          max-height: 40px;
          width: auto;
          height: auto;
          object-fit: contain;
          filter: grayscale(100%) opacity(0.7);
          transition: all 0.3s ease;
        }
        
        .scroll-item:hover .wordmark-logo {
          filter: grayscale(0%) opacity(1);
          transform: scale(1.05);
        }
        
        @media (min-width: 640px) {
          .scroll-item {
            margin: 0 3.5rem;
          }
        }
      `}</style>
    </div>
  )
}