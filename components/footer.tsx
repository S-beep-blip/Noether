"use client"

import { useState, useEffect, useRef } from "react"

export default function Footer() {
  const [typedText, setTypedText] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)

  const baseText = "adoox"
  const suffixText = " - AI-Powered context-aware definitions for non-interruptive understanding."
  const typingSpeed = 35
  const pauseDuration = 4000

  const animateTyping = (
    forward: boolean,
    currentPos: number,
    callback?: () => void
  ) => {
    if (forward) {
      if (currentPos <= suffixText.length) {
        setTypedText(suffixText.substring(0, currentPos))
        animationRef.current = window.setTimeout(
          () => animateTyping(true, currentPos + 1, callback),
          typingSpeed
        )
      } else if (callback) {
        callback()
      }
    } else {
      if (currentPos >= 0) {
        setTypedText(suffixText.substring(0, currentPos))
        animationRef.current = window.setTimeout(
          () => animateTyping(false, currentPos - 1, callback),
          typingSpeed
        )
      } else if (callback) {
        callback()
      }
    }
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current)
    }
  }, [])

  const triggerAnimation = () => {
    if (isAnimating) return
    setIsAnimating(true)

    animateTyping(true, 0, () => {
      animationRef.current = window.setTimeout(() => {
        animateTyping(false, suffixText.length, () => {
          setIsAnimating(false)
        })
      }, pauseDuration)
    })
  }

  // Enhanced mobile touch handler
  const handleTouch = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    triggerAnimation()
  }

  return (
    <footer className="w-full py-6 border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-4">
          {/* Logo - non-selectable */}
          <div 
            className="flex items-center select-none"
            style={{
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none'
            }}
          >
            <span className="mr-1">By The</span>
            <span className="text-xl text-black">ado</span>
            <span className="text-xl text-black">net company</span>
          </div>

          {/* Typing effect with Beta Badge */}
          <div
            className="text-sm text-slate-500 text-center min-h-[20px] select-none"
            onMouseEnter={triggerAnimation}
            onClick={triggerAnimation}
            onTouchStart={handleTouch}
            style={{
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
              userSelect: 'none'
            }}
          >
            <div className="inline-block relative">
              <span className="text-black font-medium">{baseText}</span>
              <span className="absolute -top-5 -right-8 bg-black text-white text-xs px-1 py-0.5 rounded font-medium select-none"
                style={{
                  pointerEvents: 'none'
                }}
              >
                Alpha
              </span>
            </div>
            <span>{typedText}</span>
            <span className="inline-block w-[2px] h-4 bg-black ml-1 align-middle animate-pulse" />
            <span> • © {new Date().getFullYear()} all rights reserved</span>
          </div>

          {/* Footer note - fully non-interactive */}
          <div 
            className="flex items-center gap-1 text-xs text-slate-400 select-none"
            style={{
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
              pointerEvents: 'none',
              userSelect: 'none'
            }}
          >
            <span>✧</span>
            <span>Made with ⌨️ + ☕ + AI</span>
            <span>✧</span>
          </div>
        </div>
      </div>
    </footer>
  )
}