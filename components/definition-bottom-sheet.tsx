"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import {
  X,
  BookOpen,
  Sparkles,
  Volume2,
  VolumeX,
  MessageCircle,
  Send,
  Loader2,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SkeletonText } from "@/components/ui/Skeleton"

interface DefinitionBottomSheetProps {
  word: string
  definition: string
  loading: boolean
  onClose: () => void
  isHoverMode?: boolean
  documentText: string
  initialChatMessages?: Array<{ sender: string; text: string }>
  onChatMessagesUpdate?: (messages: Array<{ sender: string; text: string }>) => void
}

export default function DefinitionBottomSheet({
  word,
  definition,
  loading,
  onClose,
  isHoverMode = false,
  documentText,
  initialChatMessages = [],
  onChatMessagesUpdate,
}: DefinitionBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLTextAreaElement>(null)
  const chatScrollRef = useRef<HTMLDivElement>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showFullDefinition, setShowFullDefinition] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string }>>(initialChatMessages)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)
  const scrollPositionRef = useRef(0)

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

  // Prevent scrolling of document behind the bottom sheet
  useEffect(() => {
    // Save current scroll position
    scrollPositionRef.current = window.scrollY

    // Disable scrolling on the body
    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollPositionRef.current}px`
    document.body.style.width = "100%"

    // Restore scrolling when component unmounts
    return () => {
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      window.scrollTo(0, scrollPositionRef.current)
    }
  }, [])

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

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

  // Notify parent component when chat messages change
  useEffect(() => {
    if (onChatMessagesUpdate) {
      onChatMessagesUpdate(chatMessages)
    }
  }, [chatMessages, onChatMessagesUpdate])

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
  }

  const toggleDefinitionLength = () => {
    setShowFullDefinition(!showFullDefinition)
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

    // Restore scrolling before closing
    document.body.style.position = ""
    document.body.style.top = ""
    document.body.style.width = ""
    window.scrollTo(0, scrollPositionRef.current)

    onClose()
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
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        className="fixed inset-0 z-50 flex items-end pointer-events-none"
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto" onClick={handleClose} />
        <motion.div
          ref={sheetRef}
          className="relative w-full max-h-[80vh] bg-white rounded-t-2xl shadow-xl pointer-events-auto overflow-hidden"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 100) {
              handleClose()
            }
          }}
        >
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-slate-200 rounded-full" />

          <Card
            className={`border-0 shadow-none h-full overflow-hidden ${
              isHoverMode
                ? "border-blue-300/80 bg-gradient-to-b from-blue-50 to-blue-100/50"
                : "border-slate-200/80 bg-gradient-to-b from-white to-slate-50"
            }`}
          >
            <div
              className={`px-4 py-3 flex justify-between items-center ${
                isHoverMode ? "bg-blue-100/30 border-b border-blue-200/50" : "bg-slate-50/70 border-b border-slate-100"
              }`}
            >
              <div className="flex items-center min-w-0">
                {showChat ? (
                  <button
                    onClick={() => setShowChat(false)}
                    className="mr-2 rounded-full p-1 hover:bg-slate-200/50 transition-colors"
                    aria-label="Back"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                ) : (
                  <BookOpen className="h-4 w-4 mr-2 text-slate-700 flex-shrink-0" />
                )}

                <div className="min-w-0">
                  <h3 className="font-medium text-base truncate" title={word}>
                    {showChat ? "Document Assistant" : formattedWord}
                  </h3>
                </div>
                {isHoverMode && !showChat && (
                  <span className="ml-2 text-xs py-0.5 px-2 bg-blue-200/80 text-blue-800 rounded-full flex-shrink-0">
                    hover
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Speech Toggle Button */}
                {!showChat && (
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
                )}

                {/* Chat Toggle Button */}
                {!showChat && (
                  <button
                    onClick={toggleChat}
                    className={`rounded-full p-1 transition-colors ${
                      isHoverMode ? "hover:bg-blue-200/50" : "hover:bg-slate-200/50"
                    }`}
                    aria-label="Ask AI"
                  >
                    <MessageCircle className={`h-4 w-4 ${isHoverMode ? "text-blue-600" : "text-slate-600"}`} />
                  </button>
                )}

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className={`rounded-full p-1 transition-colors ${
                    isHoverMode ? "text-blue-600 hover:bg-blue-200/50" : "text-slate-500 hover:bg-slate-200/50"
                  }`}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {showChat ? (
              <div className="flex flex-col h-[calc(80vh-56px)]">
                <ScrollArea
                  ref={chatScrollRef as any}
                  className="flex-1 p-3 overflow-y-auto"
                  style={{ scrollBehavior: "smooth" }}
                >
                  <div className="space-y-2 pb-6">{chatMessages.map((msg, i) => renderChatMessage(msg, i))}</div>
                  <div className="h-4"></div>
                </ScrollArea>

                <div
                  className={`p-3 border-t sticky bottom-0 ${
                    isHoverMode ? "border-blue-200/50 bg-blue-50/70" : "border-slate-100 bg-slate-50/70"
                  }`}
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
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Press Enter to send, Shift+Enter for new line</p>
                </div>
              </div>
            ) : (
              <div className="h-[calc(80vh-56px)] overflow-y-auto p-4">
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
                    <span className={isHoverMode ? "text-blue-700" : "text-slate-600"}>Finding definition...</span>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                    <div className="flex flex-col">
                      <p className={`text-base leading-relaxed ${isHoverMode ? "text-blue-900" : "text-slate-800"}`}>
                        {formattedDefinition}
                      </p>

                      {definition.length > MAX_DEFINITION_CHARS && (
                        <button
                          onClick={toggleDefinitionLength}
                          className={`flex items-center text-sm mt-3 self-start ${
                            isHoverMode ? "text-blue-600 hover:text-blue-800" : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          {showFullDefinition ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Show less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              Show more
                            </>
                          )}
                        </button>
                      )}

                      <div className="mt-6">
                        <Button
                          onClick={toggleChat}
                          variant="outline"
                          size="sm"
                          className={`w-full ${
                            isHoverMode
                              ? "border-blue-200 text-blue-700 hover:bg-blue-50"
                              : "border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Ask questions about this document
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
