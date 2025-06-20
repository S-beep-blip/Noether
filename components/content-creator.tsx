"use client"

import { useState, useRef, useEffect } from "react"
import { FileText, Download, Loader2, Sparkles, RefreshCcw, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import toast from "react-hot-toast"

interface DocumentIcon {
  id: number
  startX: number
  startY: number
  size: number
  duration: number
  opacity: string
  rotation: number
}

export default function ContentGenerator() {
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [fileName, setFileName] = useState("")
  const [animationState, setAnimationState] = useState(0)
  const [documentIcons, setDocumentIcons] = useState<DocumentIcon[]>([])
  const [tavilyActive, setTavilyActive] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const inputContainerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  const descriptions = [
    "Transforming the need into captivating content",
    "Creating professional articles and blog posts",
    "Generating marketing copy that converts",
    "Building comprehensive research reports",
    "Crafting engaging social media content",
    "Writing technical documentation with ease",
    "Producing creative stories and narratives",
    "Developing educational materials and guides"
  ]

  // Typing effect with faster speeds
  useEffect(() => {
    const currentDescription = descriptions[currentTextIndex]
    let timeoutId: NodeJS.Timeout

    if (isTyping) {
      if (typedText.length < currentDescription.length) {
        timeoutId = setTimeout(() => {
          setTypedText(currentDescription.slice(0, typedText.length + 1))
        }, 20) // Reduced from 50 to 20ms for faster typing
      } else {
        timeoutId = setTimeout(() => {
          setIsTyping(false)
        }, 70) // Reduced from 1000 to 500ms for faster pause
      }
    } else {
      if (typedText.length > 0) {
        timeoutId = setTimeout(() => {
          setTypedText(typedText.slice(0, -1))
        }, 15) // Reduced from 30 to 15ms for faster deletion
      } else {
        setCurrentTextIndex((prev) => (prev + 1) % descriptions.length)
        setIsTyping(true)
      }
    }

    return () => clearTimeout(timeoutId)
  }, [typedText, isTyping, currentTextIndex, descriptions])

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 300)}px`
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationState((prev) => (prev + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const iconInterval = setInterval(() => {
      if (documentIcons.length < 12) {
        const newIcon = {
          id: Date.now(),
          startX: Math.floor(Math.random() * 20),
          startY: Math.floor(Math.random() * 30) + 70,
          size: Math.floor(Math.random() * 6) + 14,
          duration: Math.floor(Math.random() * 3) + 4,
          opacity: (Math.random() * 0.4 + 0.2).toFixed(2),
          rotation: Math.floor(Math.random() * 40) - 20,
        }
        setDocumentIcons((prev) => [...prev, newIcon])
      }
    }, 600)

    const cleanupInterval = setInterval(() => {
      setDocumentIcons((prev) =>
        prev.filter((icon) => {
          const iconAge = (Date.now() - icon.id) / 1000
          return iconAge < 8
        }),
      )
    }, 1000)

    return () => {
      clearInterval(iconInterval)
      clearInterval(cleanupInterval)
    }
  }, [documentIcons.length])

  useEffect(() => {
    const handleResize = () => {
      adjustTextareaHeight()
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const generateFileName = (prompt: string): string => {
    // Remove common words and keep meaningful terms
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'about', 'how', 'what', 'why', 'when', 'where', 'write', 'create', 'generate', 'make', 'build', 'develop']
    
    const words = prompt
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word))
      .slice(0, 3) // Take first 3 meaningful words
    
    if (words.length === 0) {
      return 'content'
    }
    
    return words.join('-')
  }

  const toggleTavily = () => {
    setTavilyActive(!tavilyActive)
    toast.success(tavilyActive ? "Tavily search disabled" : "Tavily search enabled")
  }

  const simulateGeneratingContent = async (topic: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: topic,
          useTavily: tavilyActive
        }),
      });

      if (!response.ok) throw new Error('Failed to generate content');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = '';

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        result += chunk;
        
        setGeneratedContent(prev => {
          const newContent = prev + chunk;
          setTimeout(() => {
            const preview = document.querySelector('.preview-content');
            if (preview) preview.scrollTop = preview.scrollHeight;
          }, 0);
          return newContent;
        });
        
        await new Promise(resolve => setTimeout(resolve, 20));
      }

      return result;
    } catch (error) {
      console.error('Error:', error);
      return `# Error Generating Content\n\nWe encountered an issue while generating your content. Please try again.\n\nError: ${error instanceof Error ? error.message : String(error)}`;
    }
  };

  const generateContent = async () => {
    if (!input.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      const fullContent = await simulateGeneratingContent(input.trim());
      setGeneratedContent(fullContent);
      const shortFileName = generateFileName(input.trim());
      setFileName(`${shortFileName}.md`);
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate content');
      setGeneratedContent(`# Error\n\nWe couldn't generate your content. Please try again.\n\n${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadFile = () => {
    if (!generatedContent || !fileName) return;

    const blob = new Blob([generatedContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Download started!');
  }

  const toggleFileFormat = () => {
    if (fileName.endsWith(".md")) {
      setFileName(fileName.replace(".md", ".txt"));
    } else {
      setFileName(fileName.replace(".txt", ".md"));
    }
    toast.success(`Switched to ${fileName.endsWith(".md") ? "plain text" : "Markdown"} format`);
  }

  const resetForm = () => {
    setInput("");
    setGeneratedContent("");
    setFileName("");
    setTavilyActive(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    toast.success('Form reset');
  }

  const copyToClipboard = () => {
    if (!generatedContent) {
      toast.error('No content to copy');
      return;
    }
    navigator.clipboard.writeText(generatedContent);
    toast.success('Content copied to clipboard!');
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <style jsx global>{`
        @keyframes floatDiagonal {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: var(--icon-opacity, 0.4);
          }
          90% {
            opacity: var(--icon-opacity, 0.4);
          }
          100% {
            transform: translate(calc(90vw - 10vw), -120px);
            opacity: 0;
          }
        }
        
        .typing-cursor::after {
          content: '|';
          animation: blink 1s infinite;
          color: rgba(255, 255, 255, 0.8);
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>

      <Card
        ref={cardRef}
        className="p-0 overflow-hidden shadow-xl border-0"
        style={{
          background: "#ffffff",
          borderRadius: "1.5rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header */}
        <div
          ref={headerRef}
          className="relative py-6 sm:py-8 px-6 sm:px-8 overflow-hidden"
          style={{
            background: "linear-gradient(90deg, #ffde59, #ff914d)",
            height: "140px",
          }}
        >
          {/* Animated document icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {documentIcons.map((icon) => (
              <div
                key={icon.id}
                className="absolute"
                style={
                  {
                    left: `${icon.startX}%`,
                    bottom: `${icon.startY - 70}%`,
                    animation: `floatDiagonal ${icon.duration}s linear forwards`,
                    zIndex: 1,
                    '--icon-opacity': icon.opacity,
                  } as React.CSSProperties
                }
              >
                <FileText
                  style={{
                    width: `${icon.size}px`,
                    height: `${icon.size}px`,
                    color: "white",
                    transform: `rotate(${icon.rotation}deg)`,
                  }}
                />
              </div>
            ))}
          </div>

          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Noether AI
              </h2>
              <p className="text-sm sm:text-base text-white text-opacity-80 h-6 typing-cursor">
                {typedText}
              </p>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="p-6 sm:p-8 text-gray-800">
          {/* Input section */}
          <div
            ref={inputContainerRef}
            className="relative rounded-2xl p-1"
            style={{
              background: "linear-gradient(90deg, #ffde59, #ff914d)",
              boxShadow: "0 4px 20px rgba(99, 102, 241, 0.3)",
              marginTop: "-50px",
            }}
          >
            <div className="rounded-xl overflow-hidden bg-white">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  adjustTextareaHeight()
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && input.trim()) {
                    e.preventDefault()
                    generateContent()
                  }
                }}
                placeholder="What content shall I create for you today?"
                className="resize-none min-h-[100px] max-h-[300px] border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-4 rounded-t-xl bg-white text-gray-800"
              />

              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 w-full">
                {/* Tavily Search Button */}
                <Button
                  size="sm"
                  onClick={toggleTavily}
                  className={`rounded-lg flex items-center gap-1 h-8 px-3 transition-all ${
                    tavilyActive
                      ? "bg-[#ffbd59] text-white hover:bg-[#ffbd59]"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <div className="relative w-4 h-4 flex-shrink-0">
                    <Image
                      src="/TavilySearch.svg"
                      alt="Tavily"
                      width={16}
                      height={16}
                      className={`${tavilyActive ? "brightness-0 invert" : ""}`}
                    />
                  </div>
                  <span className="text-xs font-medium">Tavily Search</span>
                </Button>

                {/* Right side buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={resetForm}
                    className="rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 h-8 w-8 p-0"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    <span className="sr-only">Reset</span>
                  </Button>

                  <Button
                    onClick={generateContent}
                    disabled={isGenerating || !input.trim()}
                    className="rounded-lg border-0 h-8 w-8 p-0"
                    style={{
                      background: "linear-gradient(90deg, #ffde59, #ff914d)",
                      opacity: isGenerating || !input.trim() ? 0.7 : 1,
                    }}
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    )}
                    <span className="sr-only">Generate</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Loading animation */}
          {isGenerating && (
            <div className="flex flex-col items-center justify-center mt-8 sm:mt-12 mb-6 sm:mb-8">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-4 border-[#ffde59] border-t-transparent animate-spin"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-[#ff914d] animate-pulse" />
                </div>
              </div>
              <p className="mt-4 text-lg font-medium text-gray-800 animate-pulse">
                {tavilyActive ? "Researching and writing..." : "Writing your content..."}
              </p>
              <div className="mt-2 w-full max-w-xs bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#ffde59] to-[#ff914d] h-2 rounded-full" 
                  style={{
                    width: `${Math.min(animationState % 100, 90)}%`,
                    transition: 'width 0.5s ease'
                  }}
                ></div>
              </div>
              <p className="text-sm mt-3 text-gray-500 text-center">
                {tavilyActive 
                  ? "Searching for the latest information to include"
                  : "Crafting original content based on your request"}
              </p>
            </div>
          )}

          {/* Generated content */}
          {!isGenerating && generatedContent && (
            <div className="mt-6 sm:mt-8 transition-all duration-500">
              {/* Content preview */}
              <div className="rounded-xl overflow-hidden mb-4 bg-gray-50 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2 bg-red-400" />
                    <div className="w-3 h-3 rounded-full mr-2 bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full mr-2 bg-green-400" />
                    <span className="text-xs font-medium ml-2 text-gray-500">Preview</span>
                  </div>
                  {tavilyActive && (
                    <div className="flex items-center">
                      <div className="relative mr-1">
                        <Image src="/TavilySearch.svg" alt="Tavily" width={16} height={16} />
                      </div>
                      <span className="text-xs font-medium text-blue-600">Tavily Enhanced</span>
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-6 max-h-[300px] overflow-y-auto text-gray-800 preview-content">
                  <MarkdownRenderer content={generatedContent} />
                </div>
              </div>

              {/* Download controls */}
              <div className="rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 border border-gray-100 gap-4">
                <div className="flex items-center w-full sm:w-auto">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 bg-white">
                    <FileText className="h-5 w-5 text-black" />
                  </div>

                  <div className="flex-1 sm:flex-none">
                    <p className="font-medium mb-0.5 text-gray-800 truncate max-w-[200px] sm:max-w-none">{fileName}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-black"
                      onClick={toggleFileFormat}
                    >
                      Switch to {fileName.endsWith(".md") ? ".txt" : ".md"}
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="rounded-lg w-full sm:w-auto"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    className="rounded-lg border-0 w-full sm:w-auto bg-black text-white hover:bg-neutral-900"
                    onClick={downloadFile}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}