// app/api/chat/route.ts
import { GoogleGenAI } from "@google/genai"

export const runtime = 'edge'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string })

// Store chat sessions by a unique identifier (like session ID or user ID)
const chatSessions = new Map<string, any>();

export async function POST(request: Request) {
  try {
    const { message, documentText, sessionId } = await request.json()

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 })
    }

    // Check if we already have a chat session for this user/session
    let chat;
    if (!chatSessions.has(sessionId)) {
      // Initialize a new chat session if one doesn't exist
      const prompt = `
        You are a helpful but friendly document assistant. The user has uploaded a document and can ask questions 
        about it or discuss general topics. Here is the document content:
        
        ${documentText || 'No document content provided.'}
        
        Please provide a helpful response. If the question relates to the document, answer based on 
        its content while maintaining general knowledge accuracy. For non-document questions, 
        provide a helpful general response to the user's questions. Keep responses concise (2-5 sentences).
      `
      chat = ai.chats.create({
        model: 'gemini-2.0-flash-exp',
        history: [
          {
            role: 'user',
            parts: [{text: ''}]
          },
          {
            role: 'model',
            parts: [{text: prompt}]
          }
        ],
        config: {
          maxOutputTokens: 150,
          temperature: 0.8,
        }
      });
      
      // Store the chat session
      chatSessions.set(sessionId, chat);
    } else {
      // Retrieve existing chat session
      chat = chatSessions.get(sessionId);
    }
  
    const response = await chat.sendMessage({
      message: `User: ${message}`,
    });

    return Response.json({ text: response.text })

  } catch (error) {
    console.error("Error generating response:", error)
    return Response.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
