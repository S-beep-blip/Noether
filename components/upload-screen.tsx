"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Upload, Info, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ContentCreator from "@/components/content-creator"
import toast from "react-hot-toast"

interface UploadScreenProps {
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  loading: boolean
}

export default function UploadScreen({ handleFileUpload, loading }: UploadScreenProps) {
  const [dragActive, setDragActive] = useState<boolean>(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isHovering, setIsHovering] = useState<boolean>(false)
  const [streamingContent, setStreamingContent] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const dragCounter = useRef(0)

  // Process the file once selected
  const processFile = useCallback(async (file: File) => {
    if (!file) return

    const fileType = file.type

    if (true) {
      // Set the selected file
      setSelectedFile(file)

      // Show success toast
      toast.success(
        `File accepted: ${file.name} (${
          file.size / 1024 < 1024 ? `${(file.size / 1024).toFixed(2)} KB` : `${(file.size / 1024 / 1024).toFixed(2)} MB`
        }) - Click "Continue..." to proceed`,
        {
          duration: 3000,
          position: "top-center",
        },
      )
    } else {
      // Show error toast
      toast.error("Please upload a .txt or .docx file", {
        duration: 3000,
        position: "top-center",
      })
    }
  }, [])

  // Auto-scroll to bottom when content updates
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }, [streamingContent])

  // Handle file input change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      if (e.target.files && e.target.files[0]) {
        processFile(e.target.files[0])
      }
    },
    [processFile],
  )

  // Handle file dropping
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      dragCounter.current = 0

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0]
        processFile(file)
      }
    },
    [processFile],
  )

  // Prevent default behavior for drag events
  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true)
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setDragActive(false)
    }
  }, [])

  // Prevent default behavior when dragging over document
  useEffect(() => {
    const preventDefaultBehavior = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }

    // Add global event listeners to prevent unwanted download behavior
    document.addEventListener("dragover", preventDefaultBehavior)
    document.addEventListener("drop", preventDefaultBehavior)

    return () => {
      // Clean up event listeners
      document.removeEventListener("dragover", preventDefaultBehavior)
      document.removeEventListener("drop", preventDefaultBehavior)
    }
  }, [])

  // Click the hidden file input
  const openFileSelector = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // Clear selected file
  const clearSelectedFile = useCallback(() => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    toast.success("File selection cleared", {
      duration: 2000,
      position: "top-center",
    })
  }, [])

  // Preview streaming during loading (UI only)
  useEffect(() => {
    if (loading && selectedFile) {
      setStreamingContent("")

      const streamPreview = async () => {
        try {
          // First upload the file
          const formData = new FormData()
          formData.append("file", selectedFile)

          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!uploadResponse.ok) {
            throw new Error("Failed to upload file")
          }

          const { filePath } = await uploadResponse.json()

          // Start preview streaming from Gemini
          const response = await fetch("/api/process-with-gemini", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ filePath, previewOnly: true }),
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const reader = response.body?.getReader()
          if (!reader) {
            throw new Error("No reader available")
          }

          const decoder = new TextDecoder()
          let buffer = ""

          while (true) {
            const { done, value } = await reader.read()

            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")

            buffer = lines.pop() || ""

            for (const line of lines) {
              if (line.trim()) {
                try {
                  const data = JSON.parse(line)

                  if (data.type === "chunk") {
                    setStreamingContent((prev) => prev + data.content)
                  } else if (data.type === "complete") {
                    // Preview complete - continue with actual processing
                    break
                  } else if (data.type === "error") {
                    throw new Error(data.error)
                  }
                } catch (parseError) {
                  console.error("Error parsing streaming data:", parseError)
                }
              }
            }
          }
        } catch (error: any) {
          console.error("Streaming error:", error)
          toast.error(`Error: ${error.message}`, {
            duration: 5000,
            position: "top-center",
          })
        }
      }

      streamPreview()
    } else {
      setStreamingContent("")
    }
  }, [loading, selectedFile])

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative">
      {/* Upload Card */}
      <div
        className="w-full max-w-2xl"
        onDragOver={handleDrag}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Card
          className={`w-full p-6 md:p-8 flex flex-col items-center justify-center border-dashed border-2 
            ${dragActive ? "border-blue-500 bg-blue-50" : isHovering ? "border-black" : "border-[#ffbd59]"} 
            bg-white transition-colors duration-200`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {!selectedFile ? (
            <>
              <div
                className={`p-4 rounded-full mb-6 transition-colors duration-200 ${dragActive ? "bg-blue-100" : "bg-blue-50"}`}
              >
                <Upload className="h-8 w-8 md:h-10 md:w-10 text-black" />
              </div>
              <h2 className="text-lg md:text-xl font-medium mb-2 text-slate-800 text-center">
                {dragActive ? "Drop your file here" : "Upload a Document"}
              </h2>
              <p className="text-sm md:text-base text-slate-600 mb-6 text-center max-w-md">
                {dragActive
                  ? "Release to upload your file"
                  : "Upload a text file (.txt) or Word document (.docx) to start exploring context-aware definitions"}
              </p>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <Button
                  className="bg-black hover:bg-[#ffbd59] text-white px-6 py-2 transition-colors duration-300"
                  onClick={openFileSelector}
                  disabled={loading}
                >
                  Choose File
                </Button>
                <p className="text-sm text-slate-500">or drag and drop your file here</p>
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  accept=".txt,.docx,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={handleChange}
                />
              </div>
            </>
          ) : (
            <>
              <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-slate-800">Selected File</h3>
                  {!loading && (
                    <button onClick={clearSelectedFile} className="text-slate-500 hover:text-red-500 transition-colors">
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <div className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="bg-amber-100 p-2 rounded-md mr-3">
                    <FileText className="h-5 w-5 text-amber-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-700 truncate">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="mt-6 w-full">
                  {/* Clean White AI Streaming Interface */}
                  <div className="relative">
                    {/* Header */}
                    <div className="px-4 py-3 bg-slate-100 rounded-t-xl flex items-center gap-3">
                      <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-black text-sm font-medium">AI Transcribing {selectedFile?.name}</span>
                    </div>

                    {/* Content Area with Full Fade Overlay */}
                    <div className="relative bg-white rounded-b-xl overflow-hidden">
                      <div
                        ref={contentRef}
                        className="p-4 h-64 overflow-y-auto font-mono text-xs leading-relaxed"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                      >
                        <style jsx>{`
                          div::-webkit-scrollbar {
                            display: none;
                          }
                        `}</style>

                        <pre className="text-black whitespace-pre-wrap">
                          {streamingContent.split("\n").map((line, index) => (
                            <div key={index} className="flex">
                              <span className="text-gray-400 select-none w-8 text-right mr-4 flex-shrink-0">
                                {index + 1}
                              </span>
                              <span className="flex-1">
                                {line}
                                {index === streamingContent.split("\n").length - 1 && (
                                  <span className="inline-block w-2 h-4 bg-black animate-pulse ml-1"></span>
                                )}
                              </span>
                            </div>
                          ))}
                        </pre>
                      </div>

                      {/* Full Coverage Fade Overlay - White Theme with All Sides */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 via-white/60 to-white pointer-events-none"></div>

                      {/* Left Side Fade */}
                      <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none"></div>

                      {/* Right Side Fade */}
                      <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none"></div>

                      {/* Additional Bottom Fade for Extra Effect */}
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 w-full">
                  <Button
                    className="w-fit bg-black hover:bg-[#ffbd59] text-white px-6 py-2 transition-colors duration-300"
                    onClick={() => {
                      if (selectedFile) {
                        const syntheticEvent = {
                          target: {
                            files: [selectedFile],
                          },
                        } as unknown as React.ChangeEvent<HTMLInputElement>
                        handleFileUpload(syntheticEvent)
                      }
                    }}
                  >
                    Continue...
                  </Button>
                </div>
              )}
            </>
          )}
        </Card>
      </div>

      {/* Content Creator Component */}
      <ContentCreator />

      {/* Info Card */}
      <div className="mt-8 w-full max-w-2xl">
        <Card className="p-4 bg-amber-50 border border-amber-200">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800 mb-1">How to use adoox</h3>
              <p className="text-sm text-amber-700">After uploading a document, you can:</p>
              <ul className="text-sm text-amber-700 mt-2 list-disc list-inside space-y-1">
                <li>Select any text to see its context-aware definition</li>
                <li>Hover over a single word for 2 seconds to see its definition</li>
                <li>Switch between different viewing modes</li>
                <li>Adjust text size and appearance for comfortable reading</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
