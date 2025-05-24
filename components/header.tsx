"use client"

import { Settings, Menu, Sun, Flower, SidebarClose, SidebarOpen, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface HeaderProps {
  text: string
  theme: "light" | "sepia"
  toggleTheme: () => void
  sidebarOpen: boolean
  toggleSidebar: () => void
  toggleSettings: () => void
  isMobile: boolean
}

export default function Header({
  text,
  theme,
  toggleTheme,
  sidebarOpen,
  toggleSidebar,
  toggleSettings,
}: HeaderProps) {
  const router = useRouter()

  const handleNavigateHome = () => {
    router.push('/')
  }

  return (
    <header className="p-4 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-30">
      {/* Left section - back button */}
      <div className="w-24">
        {text ? (
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Go back">
                  <ArrowLeft size={20} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to leave?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Going back to homepage will close your current document. Make sure you've saved any important information.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleNavigateHome}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleSettings} aria-label="Settings">
                <Settings size={20} />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
      
      {/* Center section - logo + tool name with beta badge */}
      <div className="flex-1 flex justify-center items-center">
        <div className="relative inline-flex items-center">
          {/* SVG Logo */}
          <div className="relative w-12 h-12">
            <Image
              src="/logoo.png"
              alt="Adoox logo"
              width={32}
              height={32}
              className="select-none"
            />
          </div>
          
          <h1 className="text-3xl font-semibold text-center select-none hero-regular -ml-3 translate-y-1 tracking-tight leading-tight">
            <span className="text-black">a</span><span className="text-[#ffbd59]">doox</span>
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
      
      {/* Right section - controls */}
      <div className="w-24 flex justify-end">
        {text && (
          <>
            {/* Mobile buttons */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle Sidebar">
                <Menu size={20} />
              </Button>
            </div>

            {/* Desktop buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="default" size="sm" onClick={toggleTheme}>
                {theme === "light" ? <Sun size={18} /> : <Flower size={18} />}
              </Button>
              <Button variant="default" size="sm" onClick={toggleSidebar}>
                {sidebarOpen ? <SidebarClose size={20} /> : <SidebarOpen size={20} />}
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}