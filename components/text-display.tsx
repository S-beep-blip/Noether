"use client"

import { useState, useEffect, useRef } from "react"
import { useMediaQuery } from "@/app/hooks/use-media-query"

interface TextDisplayProps {
  text: string
  onTextSelection: () => void
  onWordHover: (word: string, position: { x: number; y: number }) => void
  hoverMode: boolean
}

export default function TextDisplay({ text, onTextSelection, onWordHover, hoverMode }: TextDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [hoveredWord, setHoveredWord] = useState<string | null>(null)
  const [hoverProgress, setHoverProgress] = useState<number>(0)
  const hoverPositionRef = useRef<{ x: number; y: number; width: number } | null>(null)
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)

  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Common function to get word at position
    const getWordAtPosition = (clientX: number, clientY: number) => {
      let range: Range | null = null

      // Try modern API first
      if (document.caretPositionFromPoint) {
        const position = document.caretPositionFromPoint(clientX, clientY)
        if (position?.offsetNode) {
          range = document.createRange()
          range.setStart(position.offsetNode, position.offset)
          range.setEnd(position.offsetNode, position.offset)
        }
      } 
      // Fallback to older API
      else if (document.caretRangeFromPoint) {
        range = document.caretRangeFromPoint(clientX, clientY)
      }

      if (!range) return null

      const textNode = range.startContainer
      if (textNode.nodeType !== Node.TEXT_NODE) return null

      const startOffset = range.startOffset
      const text = textNode.textContent || ""

      // Find word boundaries
      let start = startOffset
      let end = startOffset
      while (start > 0 && /\w/.test(text[start - 1])) start--
      while (end < text.length && /\w/.test(text[end])) end++

      range.setStart(textNode, start)
      range.setEnd(textNode, end)
      const word = range.toString().trim()

      return { word, range }
    }

    // Handle text selection
    const handleSelection = () => {
      // Don't process selection if we're in hover mode
      if (hoverMode) return
      
      const selection = window.getSelection()
      if (!selection || selection.toString().trim() === "") return
      onTextSelection()
    }

    // Handle word hover
    const handleHover = (clientX: number, clientY: number) => {
      // Don't process hover if we're not in hover mode
      if (!hoverMode) {
        resetHoverState()
        return
      }
      
      resetHoverState()
      const result = getWordAtPosition(clientX, clientY)
      if (!result || !result.word || !/^[a-zA-Z0-9'-]+$/.test(result.word)) return

      setHoveredWord(result.word)
      const rect = result.range.getBoundingClientRect()

      hoverPositionRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.bottom + 5,
        width: rect.width,
      }

      setHoverProgress(0)
      progressTimerRef.current = setInterval(() => {
        setHoverProgress((prev) => Math.min(prev + 5, 100))
      }, 100)

      hoverTimerRef.current = setTimeout(() => {
        onWordHover(result.word, {
          x: rect.left + rect.width / 2,
          y: rect.bottom,
        })
        resetHoverState()
      }, 2000)
    }

    // Mouse events for desktop
    const handleMouseUp = () => handleSelection()
    const handleMouseMove = (e: MouseEvent) => handleHover(e.clientX, e.clientY)
    const handleMouseLeave = () => resetHoverState()

    // Touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return
      
      const touch = e.changedTouches[0]
      const deltaX = Math.abs(touch.clientX - touchStartRef.current.x)
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y)
      const duration = Date.now() - touchStartRef.current.time

      // If it's a quick tap (not a scroll)
      if (duration < 300 && deltaX < 10 && deltaY < 10) {
        handleSelection()
        
        // Don't trigger hover for single word on mobile even if in hover mode
        // Mobile should always use selection mode
      }
      
      touchStartRef.current = null
    }

    // Add always-on event listeners
    if (isMobile) {
      container.addEventListener('touchstart', handleTouchStart)
      container.addEventListener('touchend', handleTouchEnd)
    } else {
      container.addEventListener('mouseup', handleMouseUp)
    }

    // Add conditional hover listeners only when in hover mode and not on mobile
    if (!isMobile && hoverMode) {
      container.addEventListener('mousemove', handleMouseMove)
      container.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      // Cleanup all listeners
      container.removeEventListener('mouseup', handleMouseUp)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchend', handleTouchEnd)
      resetHoverState()
    }
  }, [onTextSelection, onWordHover, isMobile, hoverMode])

  const resetHoverState = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
    if (progressTimerRef.current) clearInterval(progressTimerRef.current)
    hoverTimerRef.current = null
    progressTimerRef.current = null
    setHoveredWord(null)
    setHoverProgress(0)
  }

  // Process text with better paragraph handling
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)

  return (
    <div className="relative">
      <div 
        ref={containerRef} 
        className="text-display select-text"
        style={{ userSelect: 'text', WebkitUserSelect: 'text' }}
      >
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="mb-4 last:mb-0 whitespace-pre-wrap">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Hover progress indicator (desktop only) */}
      {hoverMode && hoveredWord && hoverPositionRef.current && !isMobile && (
        <div
          className="fixed pointer-events-none z-30"
          style={{
            left: `${hoverPositionRef.current.x - hoverPositionRef.current.width / 2}px`,
            top: `${hoverPositionRef.current.y}px`,
            width: `${hoverPositionRef.current.width}px`,
            transform: 'translateY(2px)',
          }}
        >
          <div className="relative h-0.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-100"
              style={{ width: `${hoverProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}