"use client"

import { useState, useEffect } from "react"
import { X, Clock, MessageCircle, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMediaQuery } from "@/app/hooks/use-media-query"
import type { WordHistoryItem } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface WordHistorySidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  wordHistory: WordHistoryItem[]
  onSelectHistoryItem: (item: WordHistoryItem) => void
  onClearHistory: () => void
  onDeleteHistoryItem: (id: string) => void
}

export default function WordHistorySidebar({
  isOpen,
  setIsOpen,
  wordHistory,
  onSelectHistoryItem,
  onClearHistory,
  onDeleteHistoryItem,
}: WordHistorySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [filteredHistory, setFilteredHistory] = useState<WordHistoryItem[]>(wordHistory)

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
    if (isMobile && isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY

      // Disable scrolling on the body
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"

      // Restore scrolling when sidebar closes
      return () => {
        document.body.style.position = ""
        document.body.style.top = ""
        document.body.style.width = ""
        window.scrollTo(0, scrollY)
      }
    }
  }, [isMobile, isOpen])

  if (!isOpen) return null

  return (
    <>
      {isMobile && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />}

      <Card
        className={`
          ${isMobile ? "fixed left-0 top-0 bottom-0 w-[85%] max-w-sm z-50 shadow-xl" : "fixed left-0 z-30"} 
          transition-all duration-300 ease-in-out
          border-r bg-white border-slate-200
          flex flex-col
          ${!isMobile && "top-[73px] bottom-[20px] w-80 rounded-r-lg"}
        `}
        style={{
          boxShadow: !isMobile ? "4px 0px 15px rgba(0, 0, 0, 0.05)" : "",
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <h3 className="font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-slate-500" />
              Word History
            </h3>
            {isMobile && (
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </Button>
            )}
          </div>
          <div className="mt-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-sm"
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
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {filteredHistory.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-200px)]">
              <ul className="flex flex-col">
                {filteredHistory.map((item) => (
                  <li key={item.id} className="group relative">
                    <button
                      onClick={() => onSelectHistoryItem(item)}
                      className="w-full text-left py-3 px-4 hover:bg-slate-50 flex flex-col items-start"
                    >
                      <span className="font-medium">{item.word}</span>
                      <span className="text-xs text-slate-500 mt-1">
                        {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                      </span>
                    </button>

                    {item.chatMessages && item.chatMessages.length > 0 && (
                      <div className="absolute right-10 top-3.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-100 px-1.5 text-xs font-medium text-slate-600">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        {item.chatMessages.length}
                      </div>
                    )}

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeleteHistoryItem(item.id)
                            }}
                            className="absolute right-2 top-3 flex aspect-square w-6 h-6 items-center justify-center rounded-md p-0 text-slate-400 outline-none transition-opacity hover:bg-slate-100 hover:text-slate-600 md:opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>Remove from history</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
              {searchQuery ? (
                <>
                  <Search className="h-8 w-8 mb-2 text-slate-300" />
                  <p className="text-sm">No results found for "{searchQuery}"</p>
                  <button className="mt-2 text-xs text-blue-500 hover:text-blue-700" onClick={() => setSearchQuery("")}>
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <Clock className="h-8 w-8 mb-2 text-slate-300" />
                  <p className="text-sm">No word history yet</p>
                  <p className="mt-1 text-xs">Words you hover over or select will appear here</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200">
          {wordHistory.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={onClearHistory}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear All History
            </Button>
          )}
        </div>
      </Card>
    </>
  )
}
