"use client"

import React, { useState } from "react"
import { ArrowLeft, BookOpen, FileText, Info, ChevronRight, Menu, Shield, Lock, Cookie } from 'lucide-react'
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("introduction")

  const mainSections = [
    { id: "introduction", title: "Introduction", icon: BookOpen },
    { id: "description", title: "Description", icon: FileText },
    { id: "rights", title: "IP Rights", icon: FileText },
    { id: "legal", title: "Legal Status", icon: FileText },
    { id: "signatory", title: "Signatory", icon: Info },
  ]

  const legalPages = [
    { id: "terms", title: "Terms & Conditions", icon: Shield, path: "/terms" },
    { id: "privacy", title: "Privacy Policy", icon: Lock, path: "/privacy" },
    { id: "cookies", title: "Cookie Policy", icon: Cookie, path: "/cookies" },
  ]

  const handleScroll = () => {
    const scrollPosition = window.scrollY + 100

    mainSections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        const { offsetTop, offsetHeight } = element
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(id)
        }
      }
    })
  }

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const NavLinks = () => (
    <>
      <Link href="/" className="flex items-center text-sm text-gray-700 hover:text-gray-900 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Documentation</h2>

      <nav className="space-y-2">
        {mainSections.map((section) => {
          const Icon = section.icon
          return (
            <Link
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                activeSection === section.id
                  ? "text-gray-900 bg-gray-100"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
              )}
              onClick={() => setActiveSection(section.id)}
            >
              <Icon
                className={cn(
                  "flex-shrink-0 mr-3 h-5 w-5",
                  activeSection === section.id ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500",
                )}
              />
              {section.title}
            </Link>
          )
        })}
      </nav>

      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-8 mb-4">Legal</h2>
      <nav className="space-y-2">
        {legalPages.map((page) => {
          const Icon = page.icon
          return (
            <Link
              key={page.id}
              href={page.path}
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              <Icon className="flex-shrink-0 mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              {page.title}
            </Link>
          )
        })}
      </nav>
    </>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 lg:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center text-gray-900">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span className="font-medium">Back</span>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">adoread</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
              <div className="py-6 px-2">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Documentation Header */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Navigation - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8 space-y-1">
              <NavLinks />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
              {/* Title Section */}
              <div className="border-b border-gray-200 pb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">adoread</h1>
                <p className="mt-2 text-base sm:text-lg text-gray-600">Declaration of Original Work</p>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-500">Creator</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">[Your Full Name]</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-500">Creation Date</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">April 27, 2025</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-500">Version</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">Alpha</p>
                  </div>
                </div>
              </div>

              {/* Content Sections */}
              <div className="divide-y divide-gray-200">
                {/* Introduction */}
                <section id="introduction" className="py-8">
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold text-gray-900">1. Introduction</h2>
                    <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                  </div>
                  <div className="mt-4 prose prose-sm sm:prose max-w-none text-gray-700">
                    <p>
                      I, [Your Full Name], hereby declare that I am the original creator, inventor, and author of the
                      work titled "Active Dictionary", an AI-powered tool providing context-aware meanings through hover
                      or selection interactions while reading text.
                    </p>
                    <p className="mt-4">
                      This document serves as formal evidence of my ownership of the invention and the underlying
                      intellectual property as of the date and time listed above.
                    </p>
                  </div>
                </section>

                {/* Description */}
                <section id="description" className="py-8">
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold text-gray-900">2. Description of the Work</h2>
                    <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                  </div>
                  <div className="mt-4 prose prose-sm sm:prose max-w-none text-gray-700">
                    <p>
                      adoread is a digital tool that allows users to obtain contextually relevant meanings of
                      words or sentences by simply hovering over or selecting text. The primary innovation lies in
                      delivering context-specific definitions instantly within the reading environment without
                      disrupting the user's workflow.
                    </p>

                    <h3 className="mt-6 text-lg font-medium text-gray-900">Key Features:</h3>
                    <ul className="mt-2 space-y-3">
                      <li className="flex items-start bg-gray-50 p-3 rounded-md">
                        <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                        <span>Hover or select any word/sentence to instantly retrieve meaning</span>
                      </li>
                      <li className="flex items-start bg-gray-50 p-3 rounded-md">
                        <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                        <span>Context-aware responses tailored to surrounding text</span>
                      </li>
                      <li className="flex items-start bg-gray-50 p-3 rounded-md">
                        <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                        <span>Seamless and user-friendly interaction without switching tabs/windows</span>
                      </li>
                    </ul>
                  </div>
                </section>

                {/* IP Rights */}
                <section id="rights" className="py-8">
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold text-gray-900">3. Intellectual Property Rights Claimed</h2>
                    <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                  </div>
                  <div className="mt-4 prose prose-sm sm:prose max-w-none text-gray-700">
                    <p className="font-medium">Pursuant to:</p>
                    <ul className="mt-2 space-y-3">
                      <li className="flex items-start bg-gray-50 p-3 rounded-md">
                        <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                        <span>Article 27 of the Universal Declaration of Human Rights (UDHR)</span>
                      </li>
                      <li className="flex items-start bg-gray-50 p-3 rounded-md">
                        <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                        <span>
                          The Berne Convention for the Protection of Literary and Artistic Works (1886, as amended)
                        </span>
                      </li>
                      <li className="flex items-start bg-gray-50 p-3 rounded-md">
                        <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                        <span>The Agreement on Trade-Related Aspects of Intellectual Property Rights (TRIPS)</span>
                      </li>
                    </ul>

                    <h3 className="mt-6 text-lg font-medium text-gray-900">
                      I hereby claim all intellectual property rights, including:
                    </h3>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-gray-50 p-4 rounded-md flex flex-col items-center text-center">
                        <span className="text-amber-500 text-xl mb-2">•</span>
                        <span className="font-medium">The conceptual design</span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md flex flex-col items-center text-center">
                        <span className="text-amber-500 text-xl mb-2">•</span>
                        <span className="font-medium">Functional methodology</span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md flex flex-col items-center text-center">
                        <span className="text-amber-500 text-xl mb-2">•</span>
                        <span className="font-medium">User interaction model</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Legal Status */}
                <section id="legal" className="py-8">
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold text-gray-900">4. Legal Status of Ownership</h2>
                    <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                  </div>
                  <div className="mt-4 prose prose-sm sm:prose max-w-none text-gray-700">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p>
                        By virtue of the principles of first-to-create under international intellectual property law,
                        including common law rights and applicable copyright statutes, I assert exclusive ownership
                        rights over adoread from the moment of its creation (April 27, 2025) irrespective of
                        registration status.
                      </p>
                      <p className="mt-4">
                        This document shall serve as admissible evidence of authorship, originality, and date of
                        creation, and may be produced in legal proceedings if necessary.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Signatory */}
                <section id="signatory" className="py-8">
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold text-gray-900">5. Signatory</h2>
                    <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                  </div>
                  <div className="mt-4 prose prose-sm sm:prose max-w-none text-gray-700">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">[Your Full Name]</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm font-medium text-gray-500">Date</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">April 27, 2025</p>
                      </div>
                    </div>
                    <div className="mt-6 border-t border-gray-200 pt-6">
                      <p className="text-sm font-medium text-gray-500">Signature</p>
                      <div className="mt-2 h-16 w-48 border-b-2 border-gray-400"></div>
                    </div>
                  </div>
                </section>

                {/* Legal Documents Footer */}
                <div className="pt-8 pb-4">
                  <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-500">
                    <Link href="/terms" className="hover:text-gray-900 hover:underline">Terms & Conditions</Link>
                    <span>•</span>
                    <Link href="/privacy" className="hover:text-gray-900 hover:underline">Privacy Policy</Link>
                    <span>•</span>
                    <Link href="/cookies" className="hover:text-gray-900 hover:underline">Cookie Policy</Link>
                  </div>
                  <p className="mt-4 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} adoread. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}