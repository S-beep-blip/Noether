import { GoogleGenAI } from "@google/genai"

export const runtime = 'edge'

// Initialize the Google Gemini AI client with the API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string })

export async function POST(request: Request) {
  try {
    const { word, context } = await request.json()

    if (!word || !context) {
      return Response.json({ error: "Word and context are required" }, { status: 400 })
    }

    // Create a prompt that includes both the word and its context
    const prompt = `
      I need a concise definition for the word or phrase "${word}" as it appears in the following context:
      
      "${context}"
      
      Please provide a clear, context-specific definition in 3-5 sentences that explains what "${word}" means in this specific context. 
      Don't include phrases like "In this context" or "Based on the text" in your response.
      Just provide the definition directly.
    `

    // Call the Gemini API using the exact structure from the official docs
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 100,
        temperature: 0.4,
      },
    })

    if (!response.text) {
      throw new Error("No definition generated")
    }

    // Access the text directly as shown in the docs
    const definition = response.text

    return Response.json({ definition })
  } catch (error) {
    console.error("Error generating definition:", error)
    return Response.json({ error: "Failed to generate definition" }, { status: 500 })
  }
}