"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import {
  X,
  BookOpen,
  MousePointer,
  Sparkles,
  Move,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Send,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import { useMediaQuery } from "@/app/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { SkeletonText } from "@/components/ui/Skeleton"
import { TooltipProvider } from "@/components/ui/tooltip"

interface DefinitionPopoverProps {
  word: string
  definition: string
  loading: boolean
  position: { x: number; y: number }
  onClose: () => void
  isHoverMode?: boolean
  documentText: string
  initialChatMessages?: Array<{ sender: string; text: string }>
  onChatMessagesUpdate?: (messages: Array<{ sender: string; text: string }>) => void
}

export default function DefinitionPopover({
  word,
  definition,
  loading,
  position,
  onClose,
  isHoverMode = false,
  documentText,
  initialChatMessages = [],
  onChatMessagesUpdate,
}: DefinitionPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLTextAreaElement>(null)
  const chatScrollRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [popoverDimensions, setPopoverDimensions] = useState({ width: 340, height: 240 })
  const [hasBeenManuallyPositioned, setHasBeenManuallyPositioned] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showFullDefinition, setShowFullDefinition] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string }>>(initialChatMessages)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  const isMobile = useMediaQuery("(max-width: 768px)")

  // Constants for text truncation
  const MAX_WORD_CHARS = 25
  const MAX_DEFINITION_CHARS = 180
  const isDefinitionTruncated = definition.length > MAX_DEFINITION_CHARS && !showFullDefinition

  const formattedWord = word.length > MAX_WORD_CHARS ? `${word.substring(0, MAX_WORD_CHARS)}...` : word
  const formattedDefinition = isDefinitionTruncated ? `${definition.substring(0, MAX_DEFINITION_CHARS)}...` : definition

  // Initialize chat messages from props
  useEffect(() => {
    if (initialChatMessages.length > 0) {
      setChatMessages(initialChatMessages)
    }
  }, [initialChatMessages])

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Adjust popover dimensions for mobile
  useEffect(() => {
    if (isMobile) {
      setPopoverDimensions({
        width: Math.min(340, window.innerWidth - 32),
        height: Math.min(240, window.innerHeight * 0.4),
      })
    } else {
      setPopoverDimensions({ width: 340, height: 240 })
    }
  }, [isMobile])

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (showChat && chatScrollRef.current) {
      const scrollElement = chatScrollRef.current
      setTimeout(() => {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }, 150)
    }
  }, [chatMessages, showChat])

  // Focus chat input when chat is opened
  useEffect(() => {
    if (showChat && chatInputRef.current) {
      setTimeout(() => chatInputRef.current?.focus(), 100)
    }
  }, [showChat])

  // Initialize visibility and position
  useEffect(() => {
    setIsVisible(true)
    setTimeout(() => updatePosition(), 0)
  }, [position])

  // Update position when dimensions change
  useEffect(() => {
    if (popoverRef.current && isVisible) {
      updatePosition()
    }
  }, [isVisible, popoverDimensions, isExpanded, showChat])

  // Notify parent component when chat messages change
  useEffect(() => {
    if (onChatMessagesUpdate) {
      onChatMessagesUpdate(chatMessages)
    }
  }, [chatMessages, onChatMessagesUpdate])

  // Handle window events
  useEffect(() => {
    const handleScroll = () => {
      if (!isDragging && isVisible && !hasBeenManuallyPositioned) {
        updatePosition()
      }
    }

    const handleResize = () => {
      if (isVisible) {
        if (hasBeenManuallyPositioned) {
          const { width } = popoverDimensions
          const viewportWidth = window.innerWidth
          const viewportHeight = window.innerHeight

          let x = dragPosition.x
          let y = dragPosition.y

          x = Math.max(width / 2 + 10, Math.min(x, viewportWidth - width / 2 - 10))
          y = Math.max(10, Math.min(y, viewportHeight - 10))

          setDragPosition({ x, y })
        } else {
          updatePosition()
        }
      }
    }

    window.addEventListener("scroll", handleScroll, true)
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("scroll", handleScroll, true)
      window.removeEventListener("resize", handleResize)
    }
  }, [isDragging, isVisible, position, popoverDimensions, hasBeenManuallyPositioned, dragPosition])

  const speakDefinition = () => {
    if (!definition || !("speechSynthesis" in window)) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(definition)
    speechSynthesisRef.current = utterance

    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      const preferredVoice =
        voices.find((v) => v.name.includes("Female")) || voices.find((v) => v.lang.includes("en")) || voices[0]
      utterance.voice = preferredVoice
    }

    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  const toggleSpeech = () => {
    isSpeaking ? stopSpeaking() : speakDefinition()
  }

  const toggleExpand = () => {
    if (isExpanded) {
      setPopoverDimensions({
        width: isMobile ? Math.min(340, window.innerWidth - 32) : 340,
        height: isMobile ? Math.min(240, window.innerHeight * 0.4) : 240,
      })
    } else {
      setPopoverDimensions({
        width: isMobile ? Math.min(window.innerWidth - 32, 500) : Math.min(600, window.innerWidth * 0.8),
        height: isMobile ? Math.min(window.innerHeight * 0.7, 400) : Math.min(400, window.innerHeight * 0.7),
      })
    }
    setIsExpanded(!isExpanded)
    setTimeout(updatePosition, 50)
  }

  const toggleChat = () => {
    const newChatState = !showChat
    setShowChat(newChatState)

    if (newChatState && chatMessages.length === 0) {
      setChatMessages([
        {
          sender: "assistant",
          text: "Hi! I'm your document assistant. You can ask me questions about the uploaded document or anything else.",
        },
      ])
    }

    if (newChatState && !isExpanded) {
      toggleExpand()
    }
  }

  const updatePosition = () => {
    if (!popoverRef.current || (hasBeenManuallyPositioned && !isDragging)) return

    const { width, height } = popoverDimensions
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let x = position.x
    let y = position.y

    if (isMobile) {
      x = viewportWidth / 2
      const spaceBelow = viewportHeight - y
      const spaceNeeded = height + 20

      if (spaceBelow < spaceNeeded) {
        y = Math.max(height / 2 + 20, y - 20)
      } else {
        y = Math.min(viewportHeight - height / 2 - 20, y + 20)
      }
    } else {
      x = Math.max(width / 2 + 10, Math.min(x, viewportWidth - width / 2 - 10))

      const spaceBelow = viewportHeight - y
      const spaceNeeded = height + 20

      if (spaceBelow < spaceNeeded && y > spaceNeeded) {
        y = y - 20
      } else {
        y = y + 20
      }

      y = Math.max(10, Math.min(y, viewportHeight - 10))
    }

    setDragPosition({ x, y })
  }

  async function handleSendMessage() {
    if (!chatMessage.trim() || isSubmitting) return

    setIsSubmitting(true)
    const userMessage = chatMessage.trim()
    setChatMessage("")

    setChatMessages((prev) => [...prev, { sender: "user", text: userMessage }])
    try {
      setChatMessages((prev) => [...prev, { sender: "typing", text: "" }])

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          documentText: documentText,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      setChatMessages((prev) => {
        const filtered = prev.filter((msg) => msg.sender !== "typing")
        return [
          ...filtered,
          {
            sender: "assistant",
            text: data.text || "Sorry, I couldn't find an answer to your question.",
          },
        ]
      })
    } catch (error) {
      console.error("Error generating response:", error)
      setChatMessages((prev) => {
        const filtered = prev.filter((msg) => msg.sender !== "typing")
        return [
          ...filtered,
          {
            sender: "assistant",
            text: "Sorry, I encountered an error. Please try again.",
          },
        ]
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    stopSpeaking()
    setIsVisible(false)
    setTimeout(onClose, 200)
  }

  const handleDrag = (_: any, info: PanInfo) => {
    setDragPosition({
      x: dragPosition.x + info.delta.x,
      y: dragPosition.y + info.delta.y,
    })
    setHasBeenManuallyPositioned(true)
  }

  const toggleDefinitionLength = () => {
    setShowFullDefinition(!showFullDefinition)
  }

  const renderChatMessage = (message: { sender: string; text: string }, index: number) => {
    if (message.sender === "typing") {
      return (
        <div key={`typing-${index}`} className="flex items-center space-x-2 p-2 max-w-[80%] mb-4">
          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-slate-500" />
          </div>
          <div className="flex flex-col space-y-2 p-2 rounded-lg bg-white border border-slate-200 min-w-[150px]">
            <SkeletonText className="h-4 w-24" />
            <SkeletonText className="h-4 w-32" />
            <SkeletonText className="h-4 w-28" />
          </div>
        </div>
      )
    }

    return (
      <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}>
        <div className={`flex max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
          <div className={`flex-shrink-0 ${message.sender === "user" ? "ml-2" : "mr-2"}`}>
            {message.sender === "user" ? (
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-emerald-700 text-xs font-medium">You</span>
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-slate-500" />
              </div>
            )}
          </div>
          <div
            className={`p-3 rounded-lg ${
              message.sender === "user"
                ? isHoverMode
                  ? "bg-blue-100 text-blue-900"
                  : "bg-emerald-100 text-emerald-900"
                : isHoverMode
                  ? "bg-blue-50 border border-blue-100 text-blue-800"
                  : "bg-white border border-slate-200 text-slate-700"
            }`}
          >
            <p className="text-sm">{message.text}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed z-50 select-none"
            style={{
              left: `${dragPosition.x}px`,
              top: `${dragPosition.y}px`,
              transform: "translate(-50%, -50%)",
              cursor: isDragging ? "grabbing" : "grab",
              touchAction: "none",
              maxWidth: "100vw",
              maxHeight: "100vh",
            }}
            drag
            dragConstraints={{
              top: 0,
              left: 0,
              right: window.innerWidth,
              bottom: window.innerHeight,
            }}
            dragElastic={0.1}
            onDragStart={() => setIsDragging(true)}
            onDrag={handleDrag}
            onDragEnd={() => {
              setIsDragging(false)
              setHasBeenManuallyPositioned(true)
            }}
          >
            <Card
              ref={popoverRef}
              className={`shadow-xl border overflow-hidden rounded-xl backdrop-blur-sm transition-all duration-300 ease-out ${
                isHoverMode
                  ? "border-blue-300/80 bg-gradient-to-b from-blue-50 to-blue-100/50"
                  : "border-slate-200/80 bg-gradient-to-b from-white to-slate-50"
              }`}
              style={{
                width: `${popoverDimensions.width}px`,
                maxWidth: "calc(100vw - 32px)",
                height: `${popoverDimensions.height}px`,
                maxHeight: "calc(100vh - 32px)",
              }}
            >
              <div
                className={`px-3 md:px-4 py-2 md:py-3 flex justify-between items-center ${
                  isHoverMode
                    ? "bg-blue-100/30 border-b border-blue-200/50"
                    : "bg-slate-50/70 border-b border-slate-100"
                }`}
              >
                <div className="flex items-center min-w-0">
                  {showChat ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setShowChat(false)}
                          className="mr-2 rounded-full p-1 hover:bg-slate-200/50 transition-colors"
                          aria-label="Back"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      {!isMobile && (
                        <TooltipContent side="bottom" align="center" sideOffset={8} className="z-[9999]">
                          Back
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ) : (
                    <motion.div className="mr-2 cursor-move" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Move className="h-4 w-4" />
                    </motion.div>
                  )}

                  {isHoverMode ? (
                    <MousePointer className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                  ) : showChat ? (
                    <MessageCircle className="h-4 w-4 mr-2 text-slate-700 flex-shrink-0" />
                  ) : (
                    <BookOpen className="h-4 w-4 mr-2 text-slate-700 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm md:text-base truncate" title={word}>
                      {showChat ? "Document Assistant" : formattedWord}
                    </h3>
                  </div>
                  {isHoverMode && !showChat && (
                    <span className="ml-2 text-xs py-0.5 px-2 bg-blue-200/80 text-blue-800 rounded-full flex-shrink-0">
                      hover
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Speech Toggle Button */}
                  {!showChat && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={toggleSpeech}
                          className={`rounded-full p-1 transition-colors ${
                            isHoverMode ? "hover:bg-blue-200/50" : "hover:bg-slate-200/50"
                          }`}
                          aria-label={isSpeaking ? "Stop" : "Read"}
                        >
                          {isSpeaking ? (
                            <VolumeX className="h-4 w-4 text-red-500" />
                          ) : (
                            <Volume2 className={`h-4 w-4 ${isHoverMode ? "text-blue-600" : "text-slate-600"}`} />
                          )}
                        </button>
                      </TooltipTrigger>
                      {!isMobile && (
                        <TooltipContent side="bottom" align="center" sideOffset={8} className="z-[9999]  px-1 py-1">
                          {isSpeaking ? "Stop" : "Read"}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  )}

                  {/* Chat Toggle Button */}
                  {!showChat && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={toggleChat}
                          className={`rounded-full p-1 transition-colors ${
                            isHoverMode ? "hover:bg-blue-200/50" : "hover:bg-slate-200/50"
                          }`}
                          aria-label="Ask AI"
                        >
                          <MessageCircle className={`h-4 w-4 ${isHoverMode ? "text-blue-600" : "text-slate-600"}`} />
                        </button>
                      </TooltipTrigger>
                      {!isMobile && (
                        <TooltipContent side="bottom" align="center" sideOffset={8} className="z-[9999]  px-1 py-1">
                          Ask AI
                        </TooltipContent>
                      )}
                    </Tooltip>
                  )}

                  {/* Expand/Collapse Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={toggleExpand}
                        className={`rounded-full p-1 transition-colors ${
                          isHoverMode ? "text-blue-600 hover:bg-blue-200/50" : "text-slate-500 hover:bg-slate-200/50"
                        }`}
                        aria-label={isExpanded ? "Minimize" : "Expand"}
                      >
                        {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                      </button>
                    </TooltipTrigger>
                    {!isMobile && (
                      <TooltipContent side="bottom" align="center" sideOffset={8} className="z-[9999]  px-1 py-1">
                        {isExpanded ? "Minimize" : "Expand"}
                      </TooltipContent>
                    )}
                  </Tooltip>

                  {/* Close Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleClose}
                        className={`rounded-full p-1 transition-colors ${
                          isHoverMode ? "text-blue-600 hover:bg-blue-200/50" : "text-slate-500 hover:bg-slate-200/50"
                        }`}
                        aria-label="Close"
                      >
                        <X size={16} />
                      </button>
                    </TooltipTrigger>
                    {!isMobile && (
                      <TooltipContent
                        side="bottom"
                        align="center"
                        sideOffset={8}
                        className="z-[9999] px-1 py-1 max-w-[200px] break-words whitespace-normal"
                      >
                        Close
                      </TooltipContent>
                    )}
                  </Tooltip>
                </div>
              </div>

              {showChat ? (
                <div className="flex flex-col h-full">
                  <ScrollArea
                    ref={chatScrollRef as any}
                    className="flex-1 p-3 overflow-y-auto"
                    style={{ scrollBehavior: "smooth" }}
                  >
                    <div className="space-y-2 pb-6">{chatMessages.map((msg, i) => renderChatMessage(msg, i))}</div>
                    <div className="h-4"></div>
                  </ScrollArea>

                  <div
                    className={`p-3 border-t sticky bottom-0 ${isHoverMode ? "border-blue-200/50 bg-blue-50/70" : "border-slate-100 bg-slate-50/70"}`}
                    style={{ backdropFilter: "blur(8px)" }}
                  >
                    <div className="flex gap-2 items-end">
                      <Textarea
                        ref={chatInputRef}
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        placeholder="Ask a question..."
                        className="flex-1 min-h-[40px] max-h-[120px] text-sm resize-none bg-white/80 focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 transition-all duration-200 ease-in-out"
                        style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={handleSendMessage}
                            disabled={!chatMessage.trim() || isSubmitting}
                            size="sm"
                            className={`transition-all duration-200 ${
                              isHoverMode ? "bg-blue-500 hover:bg-blue-600" : "bg-slate-800 hover:bg-slate-900"
                            } ${!chatMessage.trim() || isSubmitting ? "opacity-70" : "opacity-100"}`}
                            aria-label="Send"
                          >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        {!isMobile && (
                          <TooltipContent side="top" align="center" sideOffset={8} className="z-[9999]">
                            Send
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Press Enter to send, Shift+Enter for new line</p>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="overflow-y-auto"
                    style={{
                      height: `calc(100% - ${isMobile ? "72px" : "96px"})`,
                      WebkitOverflowScrolling: "touch",
                    }}
                  >
                    <div className="p-3 md:p-5">
                      {loading ? (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-center py-4"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
                            className={`h-5 w-5 border-2 border-t-transparent rounded-full mr-3 ${
                              isHoverMode ? "border-blue-500" : "border-slate-600"
                            }`}
                          />
                          <span className={isHoverMode ? "text-blue-700" : "text-slate-600"}>
                            Finding definition...
                          </span>
                        </motion.div>
                      ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                          <div className="flex flex-col">
                            <p
                              className={`text-sm leading-relaxed ${isHoverMode ? "text-blue-900" : "text-slate-800"}`}
                            >
                              {formattedDefinition}
                            </p>

                            {definition.length > MAX_DEFINITION_CHARS && (
                              <button
                                onClick={toggleDefinitionLength}
                                className={`flex items-center text-xs mt-2 self-start ${
                                  isHoverMode
                                    ? "text-blue-600 hover:text-blue-800"
                                    : "text-slate-500 hover:text-slate-700"
                                }`}
                              >
                                {showFullDefinition ? (
                                  <>
                                    <ChevronUp className="h-3 w-3 mr-1" />
                                    Show less
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-3 w-3 mr-1" />
                                    Show more
                                  </>
                                )}
                              </button>
                            )}

                            <div className="mt-4">
                              <Button
                                onClick={toggleChat}
                                variant="outline"
                                size="sm"
                                className={`text-xs ${
                                  isHoverMode
                                    ? "border-blue-200 text-blue-700 hover:bg-blue-50"
                                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                <MessageCircle className="h-3 w-3 mr-1" />
                                Ask questions about this document
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`px-3 md:px-4 py-2 text-xs flex items-center justify-between ${
                      isHoverMode
                        ? "border-t border-blue-200/50 bg-blue-50/50 text-blue-600"
                        : "border-t border-slate-100 bg-slate-50/50 text-slate-500"
                    }`}
                  >
                    <span className="text-[10px] md:text-xs">
                      {isMobile ? "Drag to move" : "Drag to move • Context-aware definition"}
                    </span>
                    <Sparkles className={`h-3 w-3 ${isHoverMode ? "text-blue-400" : "text-slate-400"}`} />
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  )
}
