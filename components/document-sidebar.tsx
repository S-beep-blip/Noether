"use client"

import { useState, useEffect } from "react"
import {
  X,
  FileText,
  Layout,
  FileIcon,
  Minus,
  Plus,
  ChevronRight,
  MousePointer,
  Move,
  Clock,
  MessageCircle,
  Search,
  Trash2,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import type { WordHistoryItem } from "@/lib/types"

// Constants for truncation
const MAX_WORD_LENGTH = 20 // Maximum characters for a word before truncation
const MAX_DEFINITION_LENGTH = 100 // Maximum characters for truncated definition
const MAX_MESSAGE_PREVIEW_LENGTH = 60 // Maximum characters for message preview

// Helper function to truncate text
const truncateText = (text: string, maxLength: number) => {
  if (!text) return text;
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

interface DocumentSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  isMobile: boolean
  fileName: string
  fileStats: { words: number; chars: number; pages: number } | null
  viewMode: "page" | "continuous"
  setViewMode: (mode: "page" | "continuous") => void
  fontSize: number
  adjustFontSize: (delta: number) => void
  lineHeight: number
  setLineHeight: (height: number) => void
  fontFamily: string
  setFontFamily: (family: string) => void
  hoverMode: boolean
  setHoverMode: (mode: boolean) => void
  handleNewFile: () => void
  // Word history props
  wordHistory: WordHistoryItem[]
  onSelectHistoryItem: (item: WordHistoryItem) => void
  onClearHistory: () => void
  onDeleteHistoryItem: (id: string) => void
}

export default function DocumentSidebar({
  sidebarOpen,
  setSidebarOpen,
  isMobile,
  fileName,
  fileStats,
  viewMode,
  setViewMode,
  fontSize,
  adjustFontSize,
  lineHeight,
  setLineHeight,
  fontFamily,
  setFontFamily,
  hoverMode,
  setHoverMode,
  handleNewFile,
  // Word history props
  wordHistory,
  onSelectHistoryItem,
  onClearHistory,
  onDeleteHistoryItem,
}: DocumentSidebarProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredHistory, setFilteredHistory] = useState<WordHistoryItem[]>(wordHistory)
  const [expandedDefinitions, setExpandedDefinitions] = useState<Record<string, boolean>>({})

  // Toggle expanded state for a definition
  const toggleDefinitionExpanded = (id: string) => {
    setExpandedDefinitions(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // Filter history based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredHistory(wordHistory)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredHistory(
        wordHistory.filter(
          (item) =>
            item.word.toLowerCase().includes(query) ||
            item.definition.toLowerCase().includes(query) ||
            (item.chatMessages && item.chatMessages.some((msg) => msg.text.toLowerCase().includes(query))),
        ),
      )
    }
  }, [searchQuery, wordHistory])

  // Add effect to prevent body scrolling when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      const scrollY = window.scrollY
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"

      return () => {
        document.body.style.position = ""
        document.body.style.top = ""
        document.body.style.width = ""
        window.scrollTo(0, scrollY)
      }
    }
  }, [isMobile, sidebarOpen])

  if (!sidebarOpen) return null

  return (
    <>
      {isMobile && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside
        className={`
          ${isMobile ? "fixed right-0 top-0 bottom-0 w-[85%] max-w-sm z-50 shadow-xl" : "fixed right-0 z-30"} 
          transition-all duration-300 ease-in-out
          border-l bg-white border-slate-200
          flex flex-col
          ${!isMobile && "top-[94px] bottom-[20px] w-80 rounded-l-lg"}
        `}
        style={{
          boxShadow: !isMobile ? "-4px 0px 15px rgba(0, 0, 0, 0.05)" : "",
        }}
      >
        <div className="p-4 border-b border-slate-200 flex-shrink-0">
          {isMobile && (
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Document Info</h3>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X size={18} />
              </Button>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-slate-700 truncate flex-1 font-medium" title={fileName}>
                {fileName}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewFile}
                className="flex items-center text-xs shrink-0"
              >
                <FileIcon size={14} className="mr-1" />
                New File
              </Button>
            </div>
            {fileStats && (
              <div className="text-xs mt-1 text-slate-500">
                <div>
                  {fileStats.pages} pages • {fileStats.words} words
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Word History Section */}
          <Collapsible open={historyOpen} onOpenChange={setHistoryOpen} className="mb-4 border rounded-md">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-3 text-sm font-medium hover:bg-slate-50 rounded-t-md">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-slate-500" />
                Word History
                {wordHistory.length > 0 && (
                  <span className="ml-2 text-xs bg-slate-100 text-slate-700 rounded-full px-2 py-0.5">
                    {wordHistory.length}
                  </span>
                )}
              </div>
              <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${historyOpen ? "rotate-90" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3">
              {/* Search input */}
              {wordHistory.length > 0 && (
                <div className="relative my-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-9 text-sm bg-white"
                  />
                  {searchQuery && (
                    <button
                      className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600"
                      onClick={() => setSearchQuery("")}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              )}

              {/* Word history list */}
              {filteredHistory.length > 0 ? (
                <ScrollArea className="h-[200px] mt-2">
                  <ul className="flex flex-col">
                    {filteredHistory.map((item) => (
                      <li key={item.id} className="group relative border-b border-slate-100 last:border-0">
                        <div
                          className="w-full text-left py-2.5 px-2 hover:bg-slate-50 flex flex-col items-start rounded-md"
                        >
                          <button
                            onClick={() => onSelectHistoryItem(item)}
                            className="flex flex-col items-start w-full text-left"
                          >
                            <span className="font-medium text-sm" title={item.word}>
                              {truncateText(item.word, MAX_WORD_LENGTH)}
                            </span>
                            <span className="text-xs text-slate-500 mt-0.5">
                              {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                            </span>
                          </button>
                          
                          {/* Truncated definition with expand/collapse */}
                          {item.definition && (
                            <div className="mt-1 w-full">
                              <p className="text-xs text-slate-700">
                                {expandedDefinitions[item.id] 
                                  ? item.definition 
                                  : truncateText(item.definition, MAX_DEFINITION_LENGTH)}
                              </p>
                              {item.definition.length > MAX_DEFINITION_LENGTH && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleDefinitionExpanded(item.id);
                                  }}
                                  className="text-xs text-blue-500 hover:text-blue-700 mt-1 flex items-center"
                                >
                                  {expandedDefinitions[item.id] ? 'Show less' : 'Show more'}
                                  <ChevronDown 
                                    className={`h-3 w-3 ml-0.5 transition-transform ${expandedDefinitions[item.id] ? 'rotate-180' : ''}`} 
                                  />
                                </button>
                              )}
                            </div>
                          )}
                          
                          {/* Chat message preview (if any) */}
                          {item.chatMessages && item.chatMessages.length > 0 && (
                            <div className="mt-1 text-xs text-slate-600 bg-slate-50 p-1.5 rounded w-full">
                              <div className="flex items-center">
                                <MessageCircle className="h-3 w-3 mr-1 text-slate-400" />
                                <span className="font-medium text-slate-500">
                                  {item.chatMessages.length} message{item.chatMessages.length > 1 ? 's' : ''}
                                </span>
                              </div>
                              {/* Message preview */}
                              <p className="mt-0.5 text-slate-600">
                                {truncateText(item.chatMessages[0].text, MAX_MESSAGE_PREVIEW_LENGTH)}
                              </p>
                            </div>
                          )}
                        </div>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onDeleteHistoryItem(item.id)
                                }}
                                className="absolute right-2 top-2.5 flex aspect-square w-6 h-6 items-center justify-center rounded-md p-0 text-slate-400 outline-none transition-opacity hover:bg-slate-100 hover:text-slate-600 md:opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p>Remove from history</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center text-slate-500">
                  {searchQuery ? (
                    <>
                      <Search className="h-6 w-6 mb-2 text-slate-300" />
                      <p className="text-sm">No results found for "{searchQuery}"</p>
                      <button
                        className="mt-2 text-xs text-blue-500 hover:text-blue-700"
                        onClick={() => setSearchQuery("")}
                      >
                        Clear search
                      </button>
                    </>
                  ) : (
                    <>
                      <Clock className="h-6 w-6 mb-2 text-slate-300" />
                      <p className="text-sm">No word history yet</p>
                      <p className="mt-1 text-xs">Words you hover over or select will appear here</p>
                    </>
                  )}
                </div>
              )}

              {/* Clear history button */}
              {wordHistory.length > 0 && (
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={onClearHistory}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear All History
                  </Button>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Definition Mode Section */}
          <div className="mb-4 border rounded-md p-3">
            <div className="text-sm font-medium mb-2 text-slate-700">Definition Mode</div>
            <div className="flex space-x-2">
              <Button
                variant={!hoverMode ? "default" : "outline"}
                size="sm"
                onClick={() => setHoverMode(false)}
                className={`flex-1 gap-1 ${
                  !hoverMode
                    ? "bg-black text-white hover:bg-black hover:text-white"
                    : "bg-white text-black hover:bg-white hover:text-black"
                }`}
              >
                <MousePointer className="h-4 w-4" />
                Selection
              </Button>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex-1">
                      <Button
                        variant={hoverMode ? "default" : "outline"}
                        size="sm"
                        onClick={() => !isMobile && setHoverMode(true)}
                        disabled={isMobile}
                        className={`w-full gap-1 ${
                          hoverMode
                            ? "bg-black text-white hover:bg-black hover:text-white"
                            : "bg-white text-black hover:bg-white hover:text-black"
                        } ${isMobile ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <Move className="h-4 w-4" />
                        Hover
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {isMobile && (
                    <TooltipContent className="px-2 py-1 -translate-x-3 text-sm">
                      <p>Not available for this device</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Document Settings Section */}
          <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen} className="mb-4 border rounded-md">
            <CollapsibleTrigger className="flex w-full items-center justify-between p-3 text-sm font-medium hover:bg-slate-50 rounded-t-md">
              Document Settings
              <ChevronRight
                className={`h-4 w-4 transition-transform duration-200 ${settingsOpen ? "rotate-90" : ""}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-3 pb-3">
              <div className="mb-4">
                <div className="text-sm font-medium mb-2 text-slate-700">View Mode</div>
                <div className="flex space-x-2">
                  <Button
                    variant={viewMode === "page" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("page")}
                    className={`flex-1 ${
                      viewMode === "page"
                        ? "bg-black text-white hover:bg-black hover:text-white"
                        : "bg-white text-black hover:bg-white hover:text-black"
                    }`}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Page
                  </Button>
                  <Button
                    variant={viewMode === "continuous" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("continuous")}
                    className={`flex-1 ${
                      viewMode === "continuous"
                        ? "bg-black text-white hover:bg-black hover:text-white"
                        : "bg-white text-black hover:bg-white hover:text-black"
                    }`}
                  >
                    <Layout className="h-4 w-4 mr-1" />
                    Flow
                  </Button>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-medium mb-2 text-slate-700">Reading Preferences</div>

                <div className="mb-3">
                  <div className="text-xs mb-1 text-slate-500">Font Size: {fontSize}px</div>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="p-0 w-6 h-6"
                      onClick={() => adjustFontSize(-1)}
                      disabled={fontSize <= 12}
                    >
                      <Minus size={12} />
                    </Button>
                    <div className="flex-1 h-1 mx-2 rounded-full bg-slate-200">
                      <div
                        className="h-1 rounded-full bg-blue-500"
                        style={{ width: `${((fontSize - 12) / 12) * 100}%` }}
                      ></div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="p-0 w-6 h-6"
                      onClick={() => adjustFontSize(1)}
                      disabled={fontSize >= 24}
                    >
                      <Plus size={12} />
                    </Button>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-xs mb-1 text-slate-500">Line Height: {lineHeight.toFixed(1)}</div>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="p-0 w-6 h-6"
                      onClick={() => setLineHeight(Math.max(1.2, lineHeight - 0.1))}
                      disabled={lineHeight <= 1.2}
                    >
                      <Minus size={12} />
                    </Button>
                    <div className="flex-1 h-1 mx-2 rounded-full bg-slate-200">
                      <div
                        className="h-1 rounded-full bg-blue-500"
                        style={{ width: `${((lineHeight - 1.2) / 0.8) * 100}%` }}
                      ></div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="p-0 w-6 h-6"
                      onClick={() => setLineHeight(Math.min(2.0, lineHeight + 0.1))}
                      disabled={lineHeight >= 2.0}
                    >
                      <Plus size={12} />
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="text-xs mb-1 text-slate-500">Font Family</div>
                  <div className="grid grid-cols-2 gap-1">
                    <Button
                      variant={fontFamily === "'Georgia', serif" ? "default" : "outline"}
                      size="sm"
                      className={`text-xs ${
                        fontFamily === "'Georgia', serif"
                          ? "bg-black text-white hover:bg-black hover:text-white"
                          : "bg-white text-black hover:bg-white hover:text-black"
                      }`}
                      onClick={() => setFontFamily("'Georgia', serif")}
                    >
                      Georgia
                    </Button>
                    <Button
                      variant={fontFamily === "'Times New Roman', serif" ? "default" : "outline"}
                      size="sm"
                      className={`text-xs ${
                        fontFamily === "'Times New Roman', serif"
                          ? "bg-black text-white hover:bg-black hover:text-white"
                          : "bg-white text-black hover:bg-white hover:text-black"
                      }`}
                      onClick={() => setFontFamily("'Times New Roman', serif")}
                    >
                      Times
                    </Button>
                    <Button
                      variant={fontFamily === "'Arial', sans-serif" ? "default" : "outline"}
                      size="sm"
                      className={`text-xs ${
                        fontFamily === "'Arial', sans-serif"
                          ? "bg-black text-white hover:bg-black hover:text-white"
                          : "bg-white text-black hover:bg-white hover:text-black"
                      }`}
                      onClick={() => setFontFamily("'Arial', sans-serif")}
                    >
                      Arial
                    </Button>
                    <Button
                      variant={fontFamily === "'Verdana', sans-serif" ? "default" : "outline"}
                      size="sm"
                      className={`text-xs ${
                        fontFamily === "'Verdana', sans-serif"
                          ? "bg-black text-white hover:bg-black hover:text-white"
                          : "bg-white text-black hover:bg-white hover:text-black"
                      }`}
                      onClick={() => setFontFamily("'Verdana', sans-serif")}
                    >
                      Verdana
                    </Button>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="p-4 border-t border-slate-200 flex-shrink-0">
          <div className="rounded-md p-3 text-xs bg-blue-50 text-blue-800">
            <div className="font-medium mb-1">Tip</div>
            <p>
              {hoverMode && !isMobile
                ? "Hover mode is active. Hover over any word for 2 seconds to see its definition."
                : "Selection mode is active. Select any text to see its definition."}
              {isMobile && hoverMode && " (Hover mode is not available on mobile)"}
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}