"use client"

import React from "react"
import { ArrowLeft, ChevronRight } from 'lucide-react'
import Link from "next/link"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
            <div className="border-b border-gray-200 pb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="mt-2 text-base sm:text-lg text-gray-600">Last updated: April 27, 2025</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              <section className="py-8">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-gray-900">1. Introduction</h2>
                  <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-4 prose prose-sm sm:prose max-w-none text-gray-700">
                  <p>
                    At Active Dictionary, we respect your privacy and are committed to protecting your personal data. 
                    This privacy policy will inform you about how we look after your personal data when you visit our website 
                    or use our application and tell you about your privacy rights and how the law protects you.
                  </p>
                </div>
              </section>
              
              <section className="py-8">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-gray-900">2. The Data We Collect</h2>
                  <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-4 prose prose-sm sm:prose max-w-none text-gray-700">
                  <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                  <ul className="mt-2 space-y-3">
                    <li className="flex items-start bg-gray-50 p-3 rounded-md">
                      <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                      <div>
                        <span className="font-medium">Identity Data</span>
                        <p className="mt-1">Includes first name, last name, username or similar identifier.</p>
                      </div>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-md">
                      <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                      <div>
                        <span className="font-medium">Contact Data</span>
                        <p className="mt-1">Includes email address and telephone numbers.</p>
                      </div>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-md">
                      <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                      <div>
                        <span className="font-medium">Technical Data</span>
                        <p className="mt-1">Includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access our website.</p>
                      </div>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-md">
                      <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                      <div>
                        <span className="font-medium">Usage Data</span>
                        <p className="mt-1">Includes information about how you use our website, products and services.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </section>
              
              <section className="py-8">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-gray-900">3. How We Use Your Data</h2>
                  <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-4 prose prose-sm sm:prose max-w-none text-gray-700">
                  <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                  <ul className="mt-2 space-y-3">
                    <li className="flex items-start bg-gray-50 p-3 rounded-md">
                      <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                      <span>Where we need to perform the contract we are about to enter into or have entered into with you.</span>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-md">
                      <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                      <span>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</span>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-md">
                      <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                      <span>Where we need to comply with a legal obligation.</span>
                    </li>
                  </ul>
                </div>
              </section>
              
              <section className="py-8">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-gray-900">4. Data Security</h2>
                  <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-4 prose prose-sm sm:prose max-w-none text-gray-700">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p>
                      We have put in place appropriate security measures to prevent your personal data from being accidentally lost, 
                      used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data 
                      to those employees, agents, contractors and other third parties who have a business need to know.
                    </p>
                    <p className="mt-4">
                      We have put in place procedures to deal with any suspected personal data breach and will notify you and any 
                      applicable regulator of a breach where we are legally required to do so.
                    </p>
                  </div>
                </div>
              </section>
              
              <section className="py-8">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-gray-900">5. Your Legal Rights</h2>
                  <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-4 prose prose-sm sm:prose max-w-none text-gray-700">
                  <p>
                    Under certain circumstances, you have rights under data protection laws in relation to your personal data, including:
                  </p>
                  <ul className="mt-2 space-y-3">
                    <li className="flex items-start bg-gray-50 p-3 rounded-md">
                      <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                      <span>The right to request access to your personal data.</span>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-md">
                      <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                      <span>The right to request correction of your personal data.</span>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-md">
                      <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                      <span>The right to request erasure of your personal data.</span>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-md">
                      <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                      <span>The right to object to processing of your personal data.</span>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-md">
                      <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                      <span>The right to request restriction of processing your personal data.</span>
                    </li>
                  </ul>
                </div>
              </section>
              
              <section className="py-8">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-gray-900">6. Contact Us</h2>
                  <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-4 prose prose-sm sm:prose max-w-none text-gray-700">
                  <p>
                    If you have any questions about this privacy policy or our privacy practices, please contact us at:
                  </p>
                  <div className="mt-4 bg-gray-50 p-4 rounded-md">
                    <p className="font-medium">Email: privacy@activedictionary.com</p>
                    <p className="mt-2">Or write to us at: Active Dictionary Privacy Team, 123 Main Street, City, Country</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
