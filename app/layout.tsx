import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import Footer from "@/components/footer"
import { Toaster } from 'react-hot-toast'

import { cn } from "@/lib/utils"

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
})

export const metadata = {
  title: "adoox",
  description: "Get context-aware definitions powered by Google's Gemini AI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={cn(
        inter.variable,
        'antialiased'
      )}
    >
      <body className={cn(
        "flex min-h-screen flex-col bg-background font-sans",
        inter.className
      )}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem 
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <Toaster position="top-right" />
            <Footer />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}