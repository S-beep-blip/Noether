"use client"

import { Menu, X } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.height = '100%'
      document.body.style.top = `-${window.scrollY}px`
    } else {
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
      document.body.style.top = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1)
      }
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
      document.body.style.top = ''
    }
  }, [isMobileMenuOpen])

  const closeMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const preventTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
  }

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4 px-4 sm:px-8 md:py-6 sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Left section - Logo only visible on all devices, company name only on desktop */}
        <div className="flex items-center">
          {/* Replace Mountain icon with your SVG logo */}
          <div className="relative w-12 h-12">
            <Image 
              src="/Sollem - Logo.svg" 
              alt="Sollem logo" 
              width={48} 
              height={48} 
              className="object-contain"
              priority
            />
          </div>
          <div className="relative inline-block hidden lg:inline-block top-2">
            <h1 className="text-3xl font-semibold select-none hero-regular">
              <span className="text-black">Noe</span><span className="text-[#ffbd59]">ther</span>
            </h1>
            <span className="absolute -top-3 -right-8 bg-black text-white text-[9px] px-1 py-0.5 rounded font-medium select-none"
              style={{
                pointerEvents: 'none'
              }}
            >
              Alpha
            </span>
          </div>
        </div>

        {/* Center section on mobile - Premium Button */}
        <div className="lg:hidden flex items-center justify-center">
          <Link 
            href="/subscriptions"
            className="flex items-center justify-center hero-regular select-none px-4 py-2 bg-black text-white font-medium rounded-md hover:bg-[#ffbd59] transition-colors text-sm"
          >
            Try Pro
          </Link>
        </div>

        {/* Right section - Nav Items (Desktop) */}
        <div className="hidden lg:flex items-center space-x-6">
          <Link 
            href="documentation"
            className="text-sm font-medium transition-colors hover:text-gray-600"
          >
            Documentation
          </Link>
          
          <Link 
            href="/subscriptions"
            className="flex items-center justify-center px-4 py-2 bg-black hero-regular text-white font-medium rounded-md hover:bg-[#ffbd59] transition-colors text-sm"
          >
            Try Pro
          </Link>
          
          <Link 
            href="about-us"
            className="text-sm font-medium transition-colors hover:text-gray-600"
          >
            About Us
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden rounded-md border border-gray-200 p-2 focus:outline-none active:bg-gray-100"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-white lg:hidden"
          onTouchMove={preventTouchMove}
          style={{
            touchAction: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="flex flex-col h-screen">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <div className="flex items-center">
                {/* Use the same logo in mobile menu */}
                <div className="relative w-12 h-12">
                  <Image 
                    src="/Sollem - Logo.svg" 
                    alt="Sollem logo" 
                    width={48} 
                    height={48} 
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="relative inline-block top-2">
                  <h1 className="text-3xl font-semibold select-none hero-regular">
                    <span className="text-black">Noe</span><span className="text-[#ffbd59]">ther</span>
                  </h1>
                  <span className="absolute -top-3 -right-8 bg-black text-white text-[9px] px-1 py-0.5 rounded font-medium select-none"
                    style={{
                      pointerEvents: 'none'
                    }}
                  >
                    Alpha
                  </span>
                </div>
              </div>
              <button
                onClick={closeMenu}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Menu Items */}
            <div 
              className="flex flex-col space-y-4 p-4 overflow-y-auto"
              style={{ touchAction: 'pan-y' }}
            >
              <div className="border-b border-gray-100 pb-4">
                <Link
                  href="documentation"
                  className="block rounded-md px-2 py-2 text-base font-medium transition-colors hover:bg-gray-100 active:bg-gray-200"
                  onClick={closeMenu}
                >
                  Documentation
                </Link>
              </div>

              <div className="border-b border-gray-100 pb-4">
                <Link
                  href="about-us"
                  className="block rounded-md px-2 py-2 text-base font-medium transition-colors hover:bg-gray-100 active:bg-gray-200"
                  onClick={closeMenu}
                >
                  About Us
                </Link>
              </div>
              
              {/* Add Premium link in mobile menu too */}
              <div className="pt-4">
                <Link
                  href="/subscriptions"
                  className="block w-full rounded-md bg-black py-2 px-4 text-center text-base font-medium text-white hover:bg-[#ffbd59] transition-colors"
                  onClick={closeMenu}
                >
                  Try Pro
                </Link>
              </div>
              
              {/* Add spacer to ensure content fills the screen */}
              <div className="flex-grow min-h-[200px]"></div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
