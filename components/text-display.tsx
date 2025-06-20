"use client"

import { useState, useEffect, useRef } from "react"
import { useMediaQuery } from "@/app/hooks/use-media-query"
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import 'katex/dist/katex.min.css'

interface TextDisplayProps {
  text: string
  onTextSelection: () => void
  onWordHover: (word: string, position: { x: number; y: number }) => void
  hoverMode: boolean
  isMarkdown?: boolean
  fontSize?: number // Add fontSize prop
  fontFamily?: string // Add fontFamily prop
  lineHeight?: number // Add lineHeight prop
}

export default function TextDisplay({ 
  text, 
  onTextSelection, 
  onWordHover, 
  hoverMode,
  isMarkdown = true,
  fontSize = 16,
  fontFamily = "'Georgia', serif",
  lineHeight = 1.6
}: TextDisplayProps) {
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
  // Calculate relative font sizes based on the fontSize prop
  const getRelativeFontSize = (multiplier: number) => `${fontSize * multiplier}px`

  // Custom markdown components with responsive sizing and overflow handling
  const markdownComponents = {
    // Headings - with smaller relative sizes
    h1: ({ children, ...props }: any) => (
      <h1 
        className="font-bold mb-6 mt-8 first:mt-0 text-gray-900 break-words" 
        style={{ 
          fontSize: getRelativeFontSize(1.2),
          fontFamily,
          lineHeight: lineHeight * 0.9,
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto'
        }}
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 
        className="font-semibold mb-4 mt-6 text-gray-800 break-words" 
        style={{ 
          fontSize: getRelativeFontSize(1.15),
          fontFamily,
          lineHeight: lineHeight * 0.9,
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto'
        }}
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 
        className="font-semibold mb-3 mt-5 text-gray-800 break-words" 
        style={{ 
          fontSize: getRelativeFontSize(1.1),
          fontFamily,
          lineHeight: lineHeight * 0.9,
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto'
        }}
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }: any) => (
      <h4 
        className="font-medium mb-2 mt-4 text-gray-700 break-words" 
        style={{ 
          fontSize: getRelativeFontSize(1.05),
          fontFamily,
          lineHeight: lineHeight * 0.95,
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto'
        }}
        {...props}
      >
        {children}
      </h4>
    ),
    h5: ({ children, ...props }: any) => (
      <h5 
        className="font-medium mb-2 mt-3 text-gray-700 break-words" 
        style={{ 
          fontSize: getRelativeFontSize(1.025),
          fontFamily,
          lineHeight: lineHeight * 0.95,
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto'
        }}
        {...props}
      >
        {children}
      </h5>
    ),
    h6: ({ children, ...props }: any) => (
      <h6 
        className="font-medium mb-2 mt-3 text-gray-600 break-words" 
        style={{ 
          fontSize: getRelativeFontSize(1.0),
          fontFamily,
          lineHeight,
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto'
        }}
        {...props}
      >
        {children}
      </h6>
    ),
    // Paragraphs - responsive to font settings with word wrapping
    p: ({ children, ...props }: any) => (
      <p 
        className="mb-4 last:mb-0 text-gray-700 break-words" 
        style={{ 
          fontSize: `${fontSize}px`,
          fontFamily,
          lineHeight,
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto'
        }}
        {...props}
      >
        {children}
      </p>
    ),
    
    // Lists - responsive to font settings with word wrapping
    ul: ({ children, ...props }: any) => (
      <ul 
        className="mb-4 pl-6 list-disc space-y-1" 
        style={{ 
          fontSize: `${fontSize}px`,
          fontFamily,
          lineHeight
        }}
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol 
        className="mb-4 pl-6 list-decimal space-y-1" 
        style={{ 
          fontSize: `${fontSize}px`,
          fontFamily,
          lineHeight
        }}
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => (
      <li 
        className="text-gray-700 break-words" 
        style={{ 
          fontSize: `${fontSize}px`,
          fontFamily,
          lineHeight,
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
        {...props}
      >
        {children}
      </li>
    ),
    
    // Code blocks - responsive font size with horizontal scrolling and word breaking
    pre: ({ children, ...props }: any) => (
      <pre 
        className="mb-4 p-4 bg-gray-100 rounded-lg border overflow-x-auto max-w-full" 
        style={{ 
          fontSize: `${Math.max(fontSize * 0.875, 12)}px`,
          fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          overflowWrap: 'break-word'
        }}
        {...props}
      >
        {children}
      </pre>
    ),
    code: ({ inline, children, ...props }: any) => {
      if (inline) {
        return (
          <code 
            className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-800 break-all" 
            style={{ 
              fontSize: `${Math.max(fontSize * 0.875, 12)}px`,
              fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
              wordBreak: 'break-all',
              overflowWrap: 'break-word'
            }}
            {...props}
          >
            {children}
          </code>
        )
      }
      return (
        <code 
          className="block text-gray-800" 
          style={{ 
            fontSize: `${Math.max(fontSize * 0.875, 12)}px`,
            fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            overflowWrap: 'break-word'
          }}
          {...props}
        >
          {children}
        </code>
      )
    },
    
    // Blockquotes - responsive to font settings with word wrapping
    blockquote: ({ children, ...props }: any) => (
      <blockquote 
        className="mb-4 pl-4 border-l-4 border-gray-300 italic text-gray-600 bg-gray-50 py-2 break-words" 
        style={{ 
          fontSize: `${fontSize}px`,
          fontFamily,
          lineHeight,
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
        {...props}
      >
        {children}
      </blockquote>
    ),
    
    // Tables - responsive font size with horizontal scrolling
    table: ({ children, ...props }: any) => (
      <div className="mb-4 overflow-x-auto max-w-full">
        <table 
          className="min-w-full border-collapse border border-gray-300" 
          style={{ 
            fontSize: `${Math.max(fontSize * 0.9, 12)}px`,
            fontFamily
          }}
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: any) => (
      <thead className="bg-gray-100" {...props}>
        {children}
      </thead>
    ),
    th: ({ children, ...props }: any) => (
      <th 
        className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-800 break-words" 
        style={{
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }: any) => (
      <td 
        className="border border-gray-300 px-4 py-2 text-gray-700 break-words" 
        style={{
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
        {...props}
      >
        {children}
      </td>
    ),
    
    // Links - responsive font size with word breaking
    a: ({ children, ...props }: any) => (
      <a 
        className="text-blue-600 hover:text-blue-800 underline break-all" 
        style={{ 
          fontSize: `${fontSize}px`,
          fontFamily,
          wordBreak: 'break-all',
          overflowWrap: 'break-word'
        }}
        {...props}
      >
        {children}
      </a>
    ),
    
    // Strong and emphasis - responsive font size with word wrapping
    strong: ({ children, ...props }: any) => (
      <strong 
        className="font-semibold text-gray-900 break-words" 
        style={{ 
          fontSize: `${fontSize}px`,
          fontFamily,
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
        {...props}
      >
        {children}
      </strong>
    ),
    em: ({ children, ...props }: any) => (
      <em 
        className="italic text-gray-700 break-words" 
        style={{ 
          fontSize: `${fontSize}px`,
          fontFamily,
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
        {...props}
      >
        {children}
      </em>
    ),
    
    // Horizontal rule
    hr: ({ ...props }: any) => (
      <hr className="my-6 border-t border-gray-300" {...props} />
    ),
    
    // Images - responsive with max width
    img: ({ src, alt, ...props }: any) => (
      <img 
        className="max-w-full h-auto rounded-lg shadow-sm mb-4" 
        src={src} 
        alt={alt} 
        {...props} 
      />
    ),
  }

  // Process text with better paragraph handling for non-markdown
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)

  return (
    <div className="relative w-full overflow-hidden">
      <div 
        ref={containerRef} 
        className="text-display select-text prose prose-gray max-w-none w-full overflow-hidden"
        style={{ 
          userSelect: 'text', 
          WebkitUserSelect: 'text',
          fontSize: `${fontSize}px`,
          fontFamily,
          lineHeight,
          maxWidth: '100%',
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
      >
        {isMarkdown ? (
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
            components={markdownComponents}
          >
            {text}
          </ReactMarkdown>
        ) : (
          // Fallback for plain text - also responsive with word wrapping
          paragraphs.map((paragraph, index) => (
            <p 
              key={index} 
              className="mb-4 last:mb-0 whitespace-pre-wrap text-gray-700 break-words"
              style={{ 
                fontSize: `${fontSize}px`,
                fontFamily,
                lineHeight,
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                maxWidth: '100%'
              }}
            >
              {paragraph}
            </p>
          ))
        )}
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