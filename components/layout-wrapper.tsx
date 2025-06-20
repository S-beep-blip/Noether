"use client"

import { usePathname } from "next/navigation"
import Footer from "./footer"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Don't show footer on Noether page
  const showFooter = !pathname?.startsWith('/Noether')
  
  return (
    <>
      {children}
      {showFooter && <Footer />}
    </>
  )
}