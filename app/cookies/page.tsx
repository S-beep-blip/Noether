"use client"
import { ArrowLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@radix-ui/react-label"
export default function CookiePolicy() {
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Cookie Policy</h1>
              <p className="mt-2 text-base sm:text-lg text-gray-600">Last updated: April 27, 2025</p>
            </div>

            <div className="divide-y divide-gray-200">
              <section className="py-8">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-gray-900">1. What Are Cookies</h2>
                  <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-4 prose prose-sm sm:prose max-w-none text-gray-700">
                  <p>
                    Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is
                    stored in your web browser and allows the service or a third-party to recognize you and make your
                    next visit easier and the service more useful to you.
                  </p>
                  <p className="mt-4">
                    Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your personal
                    computer or mobile device when you go offline, while session cookies are deleted as soon as you
                    close your web browser.
                  </p>
                </div>
              </section>

              <section className="py-8">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-gray-900">2. How We Use Cookies</h2>
                  <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-4 prose prose-sm sm:prose max-w-none text-gray-700">
                  <p>We use cookies for the following purposes:</p>
                  <ul className="mt-2 space-y-3">
                    <li className="flex items-start bg-gray-50 p-3 rounded-md">
                      <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                      <div>
                        <span className="font-medium">Essential Cookies</span>
                        <p className="mt-1">
                          These cookies are essential to provide you with services available through our website and to
                          enable you to use some of its features. Without these cookies, the services that you have
                          asked for cannot be provided.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-md">
                      <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                      <div>
                        <span className="font-medium">Analytics Cookies</span>
                        <p className="mt-1">
                          These cookies allow us to collect information about how visitors use our website, which pages
                          they visited and when. We use this information to improve our website and services.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-md">
                      <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                      <div>
                        <span className="font-medium">Functionality Cookies</span>
                        <p className="mt-1">
                          These cookies allow our website to remember choices you make when you use our website, such as
                          remembering your language preferences or your login details.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </section>

              <section className="py-8">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-gray-900">3. Your Cookie Preferences</h2>
                  <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-4 prose prose-sm sm:prose max-w-none text-gray-700">
                  <p>
                    You can manage your cookie preferences by adjusting the settings below. Please note that disabling
                    certain cookies may impact your experience on our website.
                  </p>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between gap-2 bg-gray-50 p-4 rounded-md">
                      <Label htmlFor="essential" className="flex flex-col gap-1">
                        <span className="font-medium">Essential Cookies</span>
                        <span className="font-normal text-sm text-gray-500">
                          These cookies are necessary for the website to function and cannot be switched off.
                        </span>
                      </Label>
                      <Switch id="essential" defaultChecked disabled />
                    </div>

                    <div className="flex items-center justify-between gap-2 bg-gray-50 p-4 rounded-md">
                      <Label htmlFor="analytics" className="flex flex-col gap-1">
                        <span className="font-medium">Analytics Cookies</span>
                        <span className="font-normal text-sm text-gray-500">
                          These cookies help us improve our website by collecting information about how you use it.
                        </span>
                      </Label>
                      <Switch id="analytics" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between gap-2 bg-gray-50 p-4 rounded-md">
                      <Label htmlFor="functional" className="flex flex-col gap-1">
                        <span className="font-medium">Functionality Cookies</span>
                        <span className="font-normal text-sm text-gray-500">
                          These cookies enable personalized features and functionality.
                        </span>
                      </Label>
                      <Switch id="functional" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between gap-2 bg-gray-50 p-4 rounded-md">
                      <Label htmlFor="marketing" className="flex flex-col gap-1">
                        <span className="font-medium">Marketing Cookies</span>
                        <span className="font-normal text-sm text-gray-500">
                          These cookies are used to track visitors across websites to display relevant advertisements.
                        </span>
                      </Label>
                      <Switch id="marketing" />
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button className="w-full">Save Cookie Preferences</Button>
                  </div>
                </div>
              </section>

              <section className="py-8">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-gray-900">4. How to Delete Cookies</h2>
                  <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-4 prose prose-sm sm:prose max-w-none text-gray-700">
                  <p>You can delete cookies you have already stored on your computer by:</p>
                  <ul className="mt-2 space-y-3">
                    <li className="flex items-start bg-gray-50 p-3 rounded-md">
                      <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                      <span>Clearing cookies in your browser</span>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-md">
                      <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                      <span>Clearing the browsing history in your browser</span>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-md">
                      <span className="flex-shrink-0 text-amber-500 mr-2 text-xl">•</span>
                      <span>Using the private browsing mode in your browser</span>
                    </li>
                  </ul>
                  <p className="mt-4">
                    Please note that deleting cookies may affect your browsing experience and you may need to manually
                    adjust some preferences every time you visit our website.
                  </p>
                </div>
              </section>

              <section className="py-8">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-gray-900">5. Contact Us</h2>
                  <ChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-4 prose prose-sm sm:prose max-w-none text-gray-700">
                  <p>If you have any questions about our Cookie Policy, please contact us:</p>
                  <div className="mt-4 bg-gray-50 p-4 rounded-md">
                    <p className="font-medium">Email: cookies@activedictionary.com</p>
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
