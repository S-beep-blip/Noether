"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Upload, Info, FileText, X, CheckCircle } from "lucide-react"
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0) // To track drag enter/leave events properly
  
  // Process the file once selected
  const processFile = useCallback(async (file: File) => {
    if (!file) return
    
    const fileType = file.type
    
    if (fileType === "text/plain" || fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      // Set the selected file
      setSelectedFile(file)
      
      // Show success toast
      toast.success(
        `File accepted: ${file.name} (${file.size / 1024 < 1024 ? 
          `${(file.size / 1024).toFixed(2)} KB` : 
          `${(file.size / 1024 / 1024).toFixed(2)} MB`}) - Click "Continue..." to proceed`,
        {
          duration: 3000,
          position: 'top-center'
        }
      )
    } else {
      // Show error toast
      toast.error('Please upload a .txt or .docx file', {
        duration: 3000,
        position: 'top-center'
      })
    }
  }, [])

  // Handle file input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }, [processFile])

  // Handle file dropping
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    dragCounter.current = 0
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      processFile(file)
    }
  }, [processFile])

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
    document.addEventListener('dragover', preventDefaultBehavior)
    document.addEventListener('drop', preventDefaultBehavior)
    
    return () => {
      // Clean up event listeners
      document.removeEventListener('dragover', preventDefaultBehavior)
      document.removeEventListener('drop', preventDefaultBehavior)
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
    toast.success('File selection cleared', {
      duration: 2000,
      position: 'top-center'
    })
  }, [])

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
            ${dragActive ? 'border-blue-500 bg-blue-50' : 
              isHovering ? 'border-black' : 'border-[#ffbd59]'} 
            bg-white transition-colors duration-200`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {!selectedFile ? (
            <>
              <div className={`p-4 rounded-full mb-6 transition-colors duration-200 ${dragActive ? 'bg-blue-100' : 'bg-blue-50'}`}>
                <Upload className="h-8 w-8 md:h-10 md:w-10 text-black" />
              </div>
              <h2 className="text-lg md:text-xl font-medium mb-2 text-slate-800 text-center">
                {dragActive ? "Drop your file here" : "Upload a Document"}
              </h2>
              <p className="text-sm md:text-base text-slate-600 mb-6 text-center max-w-md">
                {dragActive 
                  ? "Release to upload your file" 
                  : "Upload a text file (.txt) or Word document (.docx) to start exploring context-aware definitions"
                }
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
                    <button 
                      onClick={clearSelectedFile}
                      className="text-slate-500 hover:text-red-500 transition-colors"
                    >
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
                <div className="mt-6 flex items-center text-slate-600">
                  <div className="h-4 w-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin mr-2"></div>
                  <span>Processing your document...</span>
                </div>
              ) : (
                <div className="mt-6 w-full">
                  <Button 
                    className="w-fit bg-black hover:bg-[#ffbd59] text-white px-6 py-2 transition-colors duration-300"
                    onClick={() => {
                      if (selectedFile) {
                        const syntheticEvent = {
                          target: {
                            files: [selectedFile]
                          }
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