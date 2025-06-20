"use client"

import Link from "next/link"
import Image from "next/image"
import AnimatedButton from "./animated-button"
import { useEffect, useState } from "react"

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      <style jsx>{`
        .shimmer-text {
          position: relative;
          background: linear-gradient(
            110deg,
            #1a1a1a 0%,
            #1a1a1a 45%,
            #888888 48%,
            #f8f8f8 50%,
            #888888 52%,
            #1a1a1a 55%,
            #1a1a1a 100%
          );
          background-size: 600% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: premiumShimmer 50s linear infinite;
        }

        .shimmer-text::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            110deg,
            transparent 0%,
            transparent 48%,
            rgba(255, 255, 255, 0.15) 50%,
            transparent 52%,
            transparent 100%
          );
          background-size: 600% 100%;
          animation: shimmerOverlay 8s linear infinite;
          border-radius: 4px;
          pointer-events: none;
        }

        @keyframes premiumShimmer {
          0% {
            background-position: -600% 0;
          }
          100% {
            background-position: 600% 0;
          }
        }

        @keyframes shimmerOverlay {
          0% {
            background-position: -600% 0;
          }
          100% {
            background-position: 600% 0;
          }
        }
    `}</style>
    <footer className="w-full bg-white border-t z-20 border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand Column */}
          <div className="space-y-6 sm:col-span-2 lg:col-span-1">
            <div className="space-y-4">
              <div className="flex items-center">
                {/* Logo */}
                <div className="relative w-12 h-12">
                  <Image
                    src="/Sollem - Logo.svg"
                    alt="Sollem logo"
                    width={40}
                    height={40}
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="relative inline-block top-1 -ml-2">
                  <h1 className="text-2xl font-semibold select-none hero-regular">
                    <span className="text-black">Noe</span>
                    <span className="text-[#ffbd59]">ther</span>
                  </h1>
                  <span
                    className="absolute -top-3 -right-8 bg-black text-white text-[9px] px-1 py-0.5 rounded font-medium select-none"
                    style={{ pointerEvents: "none" }}
                  >
                    Alpha
                  </span>
                </div>
              </div>
              <p className="text-black text-sm hero-regular">
                Where every word makes sense.
              </p>
            </div>
            <div className="w-full">
              <AnimatedButton 
                href="/Noether" 
                initialText="Try Noether" 
                hoverText="Let's Go!"
                className="text-lg hero-regular w-full"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wider">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-slate-600 hover:text-black transition-colors text-sm">Features</Link></li>
              <li><Link href="/pricing" className="text-slate-600 hover:text-black transition-colors text-sm">Pricing</Link></li>
              <li><Link href="/integrations" className="text-slate-600 hover:text-black transition-colors text-sm">Integrations</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/docs" className="text-slate-600 hover:text-black transition-colors text-sm">Documentation</Link></li>
              <li><Link href="/blog" className="text-slate-600 hover:text-black transition-colors text-sm">Blog</Link></li>
              <li><Link href="/support" className="text-slate-600 hover:text-black transition-colors text-sm">Support</Link></li>
            </ul>
          </div>

          {/* Noether Premium card - Fixed height */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="bg-white border-2 border-black rounded-lg p-5 h-full">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-black text-lg hero-regular font-semibold mb-3 leading-tight">
                     Explore <span className="shimmer-text">Noether Pro</span>
                  </h3>
                    <p className="mb-4 leading-relaxed">
                    <span className="text-slate-700 text-sm hero-regular">
                      Experience limitless features with Noether Pro.
                    </span>
                    <br />
                    <span className="block hero-regular text-sm text-black font-bold text-center mt-7 tracking-wide">
                      ENJOY A 7-DAYS FREE TRIAL<br />
                      <span className="text-xs font-normal">(NO CREDIT CARD REQUIRED)</span>
                    </span>
                    </p>
                </div>
                <Link 
                  href="/subscriptions" 
                  className="inline-block bg-black text-white hover:bg-[#ffbd59] transition-colors text-sm font-medium px-4 py-2 rounded-md text-center w-full"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Centered back-to-top arrow */}
        <div className="w-full flex justify-center mt-8 pt-8 border-t border-slate-100 relative">
          <button
            onClick={scrollToTop}
            className={`absolute -top-7 w-12 h-12 rounded-full bg-white border-2 border-black text-black flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-slate-50 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
            aria-label="Back to top"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col space-y-6">
          {/* Copyright and Legal Links */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-slate-500 text-center sm:text-left">
              © {new Date().getFullYear()} Noether. All rights reserved.
            </div>
            
            <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6">
              <Link href="/privacy" className="text-sm text-slate-500 hover:text-black transition-colors">Privacy</Link>
              <Link href="/terms" className="text-sm text-slate-500 hover:text-black transition-colors">Terms</Link>
              <Link href="/cookies" className="text-sm text-slate-500 hover:text-black transition-colors">Cookies</Link>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex justify-center items-center">
            <div className="flex space-x-6">
              {/* Twitter */}
              <Link 
                href="https://twitter.com/noether" 
                className="group flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 border border-slate-200 hover:bg-black transition-all duration-300"
                aria-label="Follow us on Twitter"
              >
                <svg className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </Link>

              {/* YouTube */}
              <Link 
                href="https://youtube.com/@adonetcompany" 
                className="group flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 border border-slate-200 hover:bg-[#FF0000] hover:border-[#FF0000] transition-all duration-300"
                aria-label="Subscribe to our YouTube channel"
              >
                <svg className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </Link>

              {/* Discord */}
              <Link 
                href="https://discord.gg/noether" 
                className="group flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 border border-slate-200 hover:bg-[#5865F2] hover:border-[#5865F2] transition-all duration-300"
                aria-label="Join our Discord community"
              >
                <svg className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
                </svg>
              </Link>

              {/* Email */}
              <Link 
                href="mailto:adonetcompany@gmail.com" 
                className="group flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 border border-slate-200 hover:bg-black hover:border-black transition-all duration-300"
                aria-label="Send us an email"
              >
                <svg className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </>
  )
}