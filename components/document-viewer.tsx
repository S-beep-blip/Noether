"use client"

import { useRef, useState, useEffect } from "react"
import { Info, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import TextDisplay from "@/components/text-display"
import DefinitionPopover from "@/components/definition-popover"
import DefinitionBottomSheet from "@/components/definition-bottom-sheet"
import DocumentSidebar from "@/components/document-sidebar"
import MobileSettings from "@/components/mobile-settings"
import { useMediaQuery } from "@/app/hooks/use-media-query"
import type { WordHistoryItem } from "@/lib/types"
import {
  saveWordHistory,
  loadWordHistory,
  addWordToHistory,
  updateWordChatHistory,
  removeWordFromHistory,
  clearWordHistory,
} from "@/lib/word-history"
import { v4 as uuidv4 } from "uuid"

interface DocumentViewerProps {
  text: string
  pages: string[]
  currentPage: number
  setCurrentPage: (page: number) => void
  selectedText: string
  definition: string
  setDefinition: (definition: string) => void // for definition history fetching
  loading: boolean
  position: { x: number; y: number } | null
  setPosition: (position: { x: number; y: number } | null) => void
  setSelectedText: (text: string) => void
  hoverMode: boolean
  setHoverMode: (mode: boolean) => void
  showTip: boolean
  setShowTip: (show: boolean) => void
  fileName: string
  fileStats: { words: number; chars: number; pages: number } | null
  viewMode: "page" | "continuous"
  setViewMode: (mode: "page" | "continuous") => void
  theme: "light" | "sepia"
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  showSettings: boolean
  setShowSettings: (show: boolean) => void
  fontSize: number
  setFontSize: (size: number) => void
  lineHeight: number
  setLineHeight: (height: number) => void
  fontFamily: string
  setFontFamily: (family: string) => void
  isMobile: boolean
  handleNewFile: () => void
  handleTextSelection: () => void
  handleWordHover: (word: string, position: { x: number; y: number }) => Promise<void>
  goToNextPage: () => void
  goToPrevPage: () => void
  toggleTheme: () => void
  adjustFontSize: (delta: number) => void
}

export default function DocumentViewer({
  text,
  pages,
  currentPage,
  selectedText,
  definition,
  setDefinition,
  loading,
  position,
  setPosition,
  setSelectedText,
  hoverMode,
  setHoverMode,
  showTip,
  setShowTip,
  fileName,
  fileStats,
  viewMode,
  setViewMode,
  theme,
  sidebarOpen,
  setSidebarOpen,
  showSettings,
  setShowSettings,
  fontSize,
  setFontSize,
  lineHeight,
  setLineHeight,
  fontFamily,
  setFontFamily,
  isMobile,
  handleNewFile,
  handleTextSelection,
  handleWordHover,
  goToNextPage,
  goToPrevPage,
  toggleTheme,
  adjustFontSize,
}: DocumentViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const isMobileDevice = useMediaQuery("(max-width: 768px)")
  const [wordHistory, setWordHistory] = useState<WordHistoryItem[]>([])
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string }>>([])
  const [currentWordId, setCurrentWordId] = useState<string | null>(null)

  // Load word history from localStorage on component mount
  useEffect(() => {
    const history = loadWordHistory()
    setWordHistory(history)
  }, [])

  // Save word history to localStorage whenever it changes
  useEffect(() => {
    saveWordHistory(wordHistory)
  }, [wordHistory])

  // Add current word to history when definition is loaded
  useEffect(() => {
    if (selectedText && definition && !loading) {
      const newWordId = uuidv4()
      setCurrentWordId(newWordId)

      const newHistoryItem: WordHistoryItem = {
        id: newWordId,
        word: selectedText,
        definition: definition,
        timestamp: Date.now(),
        position: position,
        isHoverMode: hoverMode,
        documentText: text,
      }

      setWordHistory((prevHistory) => addWordToHistory(prevHistory, newHistoryItem))
    }
  }, [selectedText, definition, loading, position, hoverMode, text])

  // Update chat messages in history when they change
  useEffect(() => {
    if (currentWordId && chatMessages.length > 0) {
      setWordHistory((prevHistory) => updateWordChatHistory(prevHistory, currentWordId, chatMessages))
    }
  }, [chatMessages, currentWordId])

  // Handle chat messages from definition components
  const handleChatMessagesUpdate = (messages: Array<{ sender: string; text: string }>) => {
    setChatMessages(messages)
  }

  // Handle selecting a word from history
  const handleSelectHistoryItem = (item: WordHistoryItem) => {
    setSelectedText(item.word)
    setDefinition(item.definition)
    setPosition(item.position || { x: window.innerWidth / 2, y: window.innerHeight / 3 })
    setChatMessages(item.chatMessages || [])
    setCurrentWordId(item.id)
  }

  // Handle deleting a word from history
  const handleDeleteHistoryItem = (id: string) => {
    setWordHistory((prevHistory) => removeWordFromHistory(prevHistory, id))

    // If the deleted item is currently displayed, close the popover
    if (currentWordId === id) {
      setPosition(null)
      setSelectedText("")
      setChatMessages([])
      setCurrentWordId(null)
    }
  }

  // Handle clearing all history
  const handleClearHistory = () => {
    setWordHistory(clearWordHistory())
  }

  const getThemeClasses = () => {
    switch (theme) {
      case "light":
        return "bg-white text-slate-800"
      case "sepia":
        return "bg-amber-50 text-amber-900"
      default:
        return "bg-white text-slate-800"
    }
  }

  const renderDocumentContent = () => {
    if (!pages.length) return null

    if (viewMode === "continuous") {
      return (
        <div
          ref={contentRef}
          className={`min-h-full w-full max-w-4xl mx-auto py-8 px-4 md:px-12 ${getThemeClasses()}`}
          style={{
            fontFamily,
            fontSize: `${fontSize}px`,
            lineHeight,
          }}
        >
          {pages.map((pageContent, index) => (
            <div
              key={index}
              className={`document-page mb-8 pb-8 ${
                index < pages.length - 1 ? "border-b border-dashed border-slate-300" : ""
              }`}
              id={`page-${index + 1}`}
            >
              <div className="page-number mb-4 text-sm text-slate-500 font-medium">
                Page {index + 1} of {pages.length}
              </div>
              <TextDisplay
                text={pageContent}
                onTextSelection={handleTextSelection}
                onWordHover={handleWordHover}
                hoverMode={hoverMode}
              />
            </div>
          ))}
        </div>
      )
    } else {
      // Default page view
      return (
        <div className="flex-1 relative flex justify-center items-start overflow-auto p-2 md:p-8">
          <div
            className={`shadow-lg relative ${getThemeClasses()}`}
            style={{
              width: isMobile ? "100%" : "8.5in",
              minHeight: isMobile ? "auto" : "11in",
              padding: isMobile ? "1rem" : "1in",
              fontFamily,
              fontSize: `${fontSize}px`,
              lineHeight,
            }}
          >
            <TextDisplay
              text={pages[currentPage - 1]}
              onTextSelection={handleTextSelection}
              onWordHover={handleWordHover}
              hoverMode={hoverMode}
            />
          </div>
        </div>
      )
    }
  }

  // Calculate main content width based on sidebar state
  const mainContentClass =
    sidebarOpen && !isMobile
      ? "flex-1 overflow-auto relative pr-80" // Add right padding equal to sidebar width
      : "flex-1 overflow-auto relative"

  return (
    <div className="flex flex-1 overflow-hidden relative">
      {/* Main content area */}
      <div className={mainContentClass}>
        {/* Sidebar toggle button (if not already visible) */}
        {!sidebarOpen && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="fixed top-20 right-4 z-30 bg-white shadow-md"
            aria-label="Open sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {showTip && (
          <div className="m-2 md:m-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex justify-between items-center">
            <div className="flex items-center">
              <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
              <p className="text-[9px] md:text-sm text-blue-700">
                <span className="font-medium">Pro tip:</span>{" "}
                {hoverMode
                  ? "Hover over any word for 2 seconds to see its definition"
                  : "Select any text to see its definition"}
              </p>
            </div>
            <button
              onClick={() => setShowTip(false)}
              className="text-blue-500 hover:text-blue-700 flex-shrink-0"
              aria-label="Dismiss tip"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Document content */}
        {renderDocumentContent()}

        {/* Definition popover/bottom sheet */}
        {position &&
          selectedText &&
          (isMobileDevice ? (
            <DefinitionBottomSheet
              word={selectedText}
              definition={definition}
              loading={loading}
              onClose={() => {
                setPosition(null)
                setSelectedText("")
                setChatMessages([])
                setCurrentWordId(null)
              }}
              isHoverMode={hoverMode}
              documentText={text}
              initialChatMessages={chatMessages}
              onChatMessagesUpdate={handleChatMessagesUpdate}
            />
          ) : (
            <DefinitionPopover
              word={selectedText}
              definition={definition}
              loading={loading}
              position={position}
              onClose={() => {
                setPosition(null)
                setSelectedText("")
                setChatMessages([])
                setCurrentWordId(null)
              }}
              isHoverMode={hoverMode}
              documentText={text}
              initialChatMessages={chatMessages}
              onChatMessagesUpdate={handleChatMessagesUpdate}
            />
          ))}

        {/* Page navigation buttons (only in page view) */}
        {viewMode === "page" && pages.length > 0 && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20 md:p-12 pb-12">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={goToPrevPage}
              className="bg-black text-white hover:bg-[#ffbd59] hover:text-white"
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= pages.length}
              onClick={goToNextPage}
              className="bg-black text-white hover:bg-[#ffbd59] hover:text-white"
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        )}
      </div>

      {/* Mobile settings panel */}
      <MobileSettings
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        viewMode={viewMode}
        setViewMode={setViewMode}
        fontSize={fontSize}
        adjustFontSize={adjustFontSize}
        lineHeight={lineHeight}
        setLineHeight={setLineHeight}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        hoverMode={hoverMode}
        setHoverMode={setHoverMode}
        theme={theme}
        toggleTheme={toggleTheme}
        fileStats={fileStats}
        fileName={fileName}
        handleNewFile={handleNewFile}
      />

      {/* Sidebar with integrated word history */}
      <DocumentSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
        fileName={fileName}
        fileStats={fileStats}
        viewMode={viewMode}
        setViewMode={setViewMode}
        fontSize={fontSize}
        adjustFontSize={adjustFontSize}
        lineHeight={lineHeight}
        setLineHeight={setLineHeight}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        hoverMode={hoverMode}
        setHoverMode={setHoverMode}
        handleNewFile={handleNewFile}
        // Word history props
        wordHistory={wordHistory}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
        onDeleteHistoryItem={handleDeleteHistoryItem}
      />
    </div>
  )
}
