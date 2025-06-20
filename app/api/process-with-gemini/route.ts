import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai"
import { NextRequest, NextResponse } from "next/server"
import path from "path"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { filePath, previewOnly } = await request.json()

    if (!filePath) {
      return new NextResponse(JSON.stringify({ error: "File path is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const absoluteFilePath = path.resolve(filePath)
    const file = await ai.files.upload({
      file: absoluteFilePath as string,
    })

    // If it's just for preview, create a limited streaming response
    if (previewOnly) {
      const stream = new ReadableStream({
        async start(controller) {
          let isControllerClosed = false

          const safeEnqueue = (data: string) => {
            if (!isControllerClosed) {
              try {
                controller.enqueue(new TextEncoder().encode(data))
              } catch (error) {
                console.error("Error enqueueing data:", error)
                isControllerClosed = true
              }
            }
          }

          const safeClose = () => {
            if (!isControllerClosed) {
              try {
                controller.close()
                isControllerClosed = true
              } catch (error) {
                console.error("Error closing controller:", error)
              }
            }
          }

          try {
            const response = await ai.models.generateContentStream({
              model: "gemini-2.0-flash",
              contents: [
                createUserContent([
                  `Please provide a brief preview of this document's transcription. Show only the first 20-25 lines as a preview. Keep it simple and clean for preview purposes.

Start transcribing now:`,
                  createPartFromUri(file.uri!, file.mimeType!),
                ]),
              ],
              config: {
                maxOutputTokens: 1000, // Limit tokens for preview
              },
            })

            let lineCount = 0
            const maxLines = 25

            // Stream limited content
            for await (const chunk of response) {
              if (isControllerClosed || lineCount >= maxLines) break

              const text = chunk.text
              if (text) {
                const lines = text.split("\n")
                lineCount += lines.length

                // If we're approaching the limit, truncate
                if (lineCount >= maxLines) {
                  const remainingLines = maxLines - (lineCount - lines.length)
                  const truncatedText = lines.slice(0, remainingLines).join("\n")

                  const data =
                    JSON.stringify({
                      type: "chunk",
                      content: truncatedText,
                    }) + "\n"

                  safeEnqueue(data)
                  break
                }

                const data =
                  JSON.stringify({
                    type: "chunk",
                    content: text,
                  }) + "\n"

                safeEnqueue(data)
              }
            }

            // Send completion signal
            if (!isControllerClosed) {
              const completionData =
                JSON.stringify({
                  type: "complete",
                  isPreview: true,
                }) + "\n"
              safeEnqueue(completionData)
            }
          } catch (error: any) {
            console.error("Streaming error:", error)

            if (!isControllerClosed) {
              const errorData =
                JSON.stringify({
                  type: "error",
                  error: error.message,
                }) + "\n"
              safeEnqueue(errorData)
            }
          } finally {
            safeClose()
          }
        },
      })

      return new NextResponse(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      })
    }

    // Full transcription for actual processing - WITH MARKDOWN
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        createUserContent([
          `Please transcribe this file and format it as well-structured markdown. Follow these guidelines:

1. **Structure**: Use proper markdown headers (# ## ###) to organize content hierarchically
2. **Mathematical expressions**: 
   - Use inline math with single dollar signs: $x = y + z$
   - Use block math with double dollar signs for complex formulas:
   $$
   \\int_{a}^{b} f(x) dx = F(b) - F(a)
   $$
3. **Content organization**:
   - Use bullet points or numbered lists for enumerated items
   - Use code blocks with triple backticks (\`\`\`) for code snippets
   - Use tables for tabular data with proper markdown table syntax
   - Use blockquotes (>) for quotes or highlighted text
4. **Images**: If the file contains images, describe them in markdown format like:
   ![Image description](image-placeholder)
   
   Then continue with the transcription.

5. **Formatting**:
   - Use **bold** for important terms
   - Use *italics* for emphasis
   - Preserve original formatting structure but enhance readability
   - Ensure proper spacing between sections

6. **Quality**: Make sure the output is clean, well-organized, and professionally formatted markdown that would render beautifully in any markdown viewer.

Please transcribe the entire document following these markdown formatting guidelines without adding any additional commentary or explanations.`,
          createPartFromUri(file.uri!, file.mimeType!),
        ]),
      ],
      config: {
        maxOutputTokens: 8096,
      },
    })

    console.log("Gemini response:", response.text)

    return new NextResponse(
      JSON.stringify({
        summary: response.text,
        isMarkdown: true,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error: any) {
    console.error("Error processing file with Gemini:", error)
    return new NextResponse(
      JSON.stringify({
        error: `Error processing file with Gemini: ${error.message}`,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
