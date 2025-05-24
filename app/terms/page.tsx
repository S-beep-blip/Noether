"use client"

import React from "react"
import { ArrowLeft, ChevronRight } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsAndConditions() {
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Terms and Conditions</h1>
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
                    Welcome to Active Dictionary. These Terms and Conditions govern your use of our website, application, and services.
                    By accessing or using Active Dictionary, you agree to be bound by these Terms. If you disagree with any part of the terms, 
                    you may not access the service.
                  </p>
                </div>
              </section>
              
              <section className="py-8">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-gray-900">2. Use License</h2>
                  <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-4 prose prose-sm sm:prose max-w-none text-gray-700">
                  <p>
                    Permission is granted to temporarily use Active Dictionary for personal, non-commercial purposes only. 
                    This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="mt-2 space-y-3">
                    <li className="flex items-start bg-gray-50 p-3 rounded-md">
                      <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                      <span>Modify or copy the materials</span>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-md">
                      <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                      <span>Use the materials for any commercial purpose</span>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-md">
                      <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                      <span>Attempt to decompile or reverse engineer any software contained in Active Dictionary</span>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-md">
                      <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                      <span>Remove any copyright or other proprietary notations from the materials</span>
                    </li>
                  </ul>
                </div>
              </section>
              
              <section className="py-8">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-gray-900">3. Disclaimer</h2>
                  <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-4 prose prose-sm sm:prose max-w-none text-gray-700">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p>
                      The materials on Active Dictionary are provided on an 'as is' basis. Active Dictionary makes no warranties, 
                      expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, 
                      implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement 
                      of intellectual property or other violation of rights.
                    </p>
                    <p className="mt-4">
                      Further, Active Dictionary does not warrant or make any representations concerning the accuracy, likely results, 
                      or reliability of the use of the materials on its website or otherwise relating to such materials or on any 
                      sites linked to this site.
                    </p>
                  </div>
                </div>
              </section>
              
              <section className="py-8">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-gray-900">4. Limitations</h2>
                  <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-4 prose prose-sm sm:prose max-w-none text-gray-700">
                  <p>
                    In no event shall Active Dictionary or its suppliers be liable for any damages (including, without limitation, 
                    damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use 
                    the materials on Active Dictionary, even if Active Dictionary or an authorized representative has been notified 
                    orally or in writing of the possibility of such damage.
                  </p>
                </div>
              </section>
              
              <section className="py-8">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-gray-900">5. Revisions and Errata</h2>
                  <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-4 prose prose-sm sm:prose max-w-none text-gray-700">
                  <p>
                    The materials appearing on Active Dictionary could include technical, typographical, or photographic errors. 
                    Active Dictionary does not warrant that any of the materials on its website are accurate, complete or current. 
                    Active Dictionary may make changes to the materials contained on its website at any time without notice. 
                    Active Dictionary does not, however, make any commitment to update the materials.
                  </p>
                </div>
              </section>
              
              <section className="py-8">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-gray-900">6. Governing Law</h2>
                  <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-4 prose prose-sm sm:prose max-w-none text-gray-700">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p>
                      These terms and conditions are governed by and construed in accordance with the laws and you irrevocably 
                      submit to the exclusive jurisdiction of the courts in that location.
                    </p>
                  </div>
                </div>
              </section>
              
              <div className="py-8">
                <Button className="w-full">I Accept These Terms</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
