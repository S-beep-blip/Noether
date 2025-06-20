"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import UploadScreen from "@/components/upload-screen"
import DocumentViewer from "@/components/document-viewer"
import { useMediaQuery } from "@/app/hooks/use-media-query"

export default function Homeapp() {
  // Document content state
  const [text, setText] = useState<string>("")
  const [pages, setPages] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)

  // Definition state
  const [selectedText, setSelectedText] = useState<string>("")
  const [definition, setDefinition] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [hoverMode, setHoverMode] = useState<boolean>(false)

  // UI state
  const [showTip, setShowTip] = useState<boolean>(true)
  const [fileName, setFileName] = useState<string>("")
  const [fileStats, setFileStats] = useState<{ words: number; chars: number; pages: number } | null>(null)
  const [viewMode, setViewMode] = useState<"page" | "continuous">("page")
  const [theme, setTheme] = useState<"light" | "sepia">("light")
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [showSettings, setShowSettings] = useState<boolean>(false)

  // Reading preferences
  const [fontSize, setFontSize] = useState<number>(16)
  const [lineHeight, setLineHeight] = useState<number>(1.6)
  const [fontFamily, setFontFamily] = useState<string>("'Georgia', serif")

  // Responsive state
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    if (text) {
      // Split document into pages
      const documentPages = splitIntoPages(text)
      setPages(documentPages)

      // Calculate text statistics
      const words = text.split(/\s+/).filter((word) => word.trim().length > 0).length
      const chars = text.replace(/\s/g, "").length

      setFileStats({
        words,
        chars,
        pages: documentPages.length,
      })

      // Reset to first page
      setCurrentPage(1)
    } else {
      setPages([])
      setFileStats(null)
    }
  }, [text])

  // Close sidebar on mobile when text is loaded
  useEffect(() => {
    if (text && isMobile) {
      setSidebarOpen(false)
    }
  }, [text, isMobile])

  // Close sidebar when switching to mobile view
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setFileName(file.name);

      // Create FormData and send the file to the backend
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(`Upload failed: ${errorData.error}`);
      }

      const uploadResult = await uploadResponse.json();
      console.log('File uploaded successfully:', uploadResult.filePath);

      // Only open sidebar on desktop for new document
      if (!isMobile) {
        setSidebarOpen(true);
      }

      // Call the backend API to process the uploaded file with Gemini
      const geminiProcessResponse = await fetch('/api/process-with-gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath: uploadResult.filePath }),
      });

      if (!geminiProcessResponse.ok) {
        const errorData = await geminiProcessResponse.json();
        throw new Error(`Gemini processing failed: ${errorData.error}`);
      }

      const geminiResult = await geminiProcessResponse.json();
      console.log('Gemini processing successful:', geminiResult.summary);

      // Update the state with the summary from Gemini
      setText(geminiResult.summary);

    } catch (error) {
      console.error("Error processing or uploading file:", error);
      alert(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleNewFile = () => {
    // Reset states for a new file
    setText("")
    setFileName("")
    setFileStats(null)
    setPages([])
    setCurrentPage(1)
    setPosition(null)
    setSelectedText("")

    // Open file dialog
    const fileInput = document.getElementById("file-upload") as HTMLInputElement
    if (fileInput) {
      fileInput.click()
    }
  }

  const fetchDefinition = async (word: string) => {
    setLoading(true)

    // Get context - either current page or nearby paragraphs
    const contextContent =
      viewMode === "continuous"
        ? text // In continuous mode, use more text for better context
        : pages[currentPage - 1] // In page mode, use just the current page

    try {
      const response = await fetch("/api/define", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          word: word,
          context: contextContent,
        }),
      })

      console.log("Response:", contextContent)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setDefinition(data.definition)
    } catch (error) {
      console.error("Error fetching definition:", error)
      setDefinition("Failed to fetch definition. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleTextSelection = async () => {
    const selection = window.getSelection()
    if (!selection || selection.toString().trim() === "") return

    const selectedContent = selection.toString().trim()
    if (selectedContent === selectedText) return

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    setPosition({
      x: rect.left + window.scrollX + rect.width / 2,
      y: rect.bottom + window.scrollY,
    })

    setSelectedText(selectedContent)
    setHoverMode(false)
    await fetchDefinition(selectedContent)
  }

  const handleWordHover = async (word: string, hoverPosition: { x: number; y: number }) => {
    if (word === selectedText && position) return

    setPosition(hoverPosition)
    setSelectedText(word)
    setHoverMode(true)
    await fetchDefinition(word)
  }

  const goToNextPage = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1)
      setPosition(null) // Close popover
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      setPosition(null) // Close popover
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "sepia" : "light")
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
    // Close settings drawer when opening sidebar on mobile
    if (isMobile && showSettings) {
      setShowSettings(false)
    }
  }

  const toggleSettings = () => {
    setShowSettings(!showSettings)
    // Close sidebar when opening settings on mobile
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false)
    }
  }

  const adjustFontSize = (delta: number) => {
    setFontSize((prev) => Math.max(12, Math.min(24, prev + delta)))
  }

  // Function to split text into pages with better page detection
  const splitIntoPages = (content: string): string[] => {
    // Check for standard page breaks
    if (content.includes("\f")) {
      return content
        .split("\f")
        .map((page) => page.trim())
        .filter((page) => page.length > 0)
    }

    // Look for page indicators like "Page X" or just numbered lines
    const pageRegex = /(\n\s*-+\s*Page\s+\d+\s*-+\s*\n)|(\n\s*Page\s+\d+\s*\n)|(\n\s*\[\s*\d+\s*\]\s*\n)/gi
    if (pageRegex.test(content)) {
      return content
        .split(pageRegex)
        .filter(Boolean)
        .map((page) => page.trim())
        .filter((page) => page.length > 0)
    }

    // Otherwise estimate based on content length and paragraph structure
    const estimatedWordsPerPage = 300
    const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim().length > 0)
    const result: string[] = []
    let currentPageContent = ""
    let wordCount = 0

    for (const paragraph of paragraphs) {
      const paragraphWordCount = paragraph.split(/\s+/).filter((w) => w.trim().length > 0).length

      if (wordCount + paragraphWordCount > estimatedWordsPerPage) {
        result.push(currentPageContent.trim())
        currentPageContent = paragraph
        wordCount = paragraphWordCount
      } else {
        if (currentPageContent) currentPageContent += "\n\n"
        currentPageContent += paragraph
        wordCount += paragraphWordCount
      }
    }

    if (currentPageContent.trim()) {
      result.push(currentPageContent.trim())
    }

    // Ensure we have at least one page
    return result.length ? result : [content]
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-blue-50">
      <Header
        text={text}
        theme={theme}
        toggleTheme={toggleTheme}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        toggleSettings={toggleSettings}
        isMobile={isMobile}
      />

      {!text ? (
        <UploadScreen handleFileUpload={handleFileUpload} loading={loading} />
      ) : (
        <DocumentViewer
          text={text}
          pages={pages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          selectedText={selectedText}
          definition={definition}
          setDefinition={setDefinition}  // <---- Add this line
          loading={loading}
          position={position}
          setPosition={setPosition}
          setSelectedText={setSelectedText}
          hoverMode={hoverMode}
          setHoverMode={setHoverMode}
          showTip={showTip}
          setShowTip={setShowTip}
          fileName={fileName}
          fileStats={fileStats}
          viewMode={viewMode}
          setViewMode={setViewMode}
          theme={theme}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          fontSize={fontSize}
          setFontSize={setFontSize}
          lineHeight={lineHeight}
          setLineHeight={setLineHeight}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          isMobile={isMobile}
          handleNewFile={handleNewFile}
          handleTextSelection={handleTextSelection}
          handleWordHover={handleWordHover}
          goToNextPage={goToNextPage}
          goToPrevPage={goToPrevPage}
          toggleTheme={toggleTheme}
          adjustFontSize={adjustFontSize}
        />
      )}
    </main>
  )
}
