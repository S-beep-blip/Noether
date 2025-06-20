// app/api/generate-content/route.ts
import { GoogleGenAI } from "@google/genai";

export const runtime = "edge";

// Function to fetch data from Tavily if enabled
async function fetchTavilyData(query: string) {
  try {
    const tavilyApiKey = process.env.TAVILY_API_KEY;

    if (!tavilyApiKey) {
      console.error("TAVILY_API_KEY is not set.");
      return "[Tavily search is not configured. Proceeding without external search data.]\n\n";
    }
    console.log(`[Tavily] Initiating search for query: "${query}"`); 
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: tavilyApiKey,
        query: query,
        search_depth: "basic", // or "advanced" for more comprehensive results
        max_results: 5, // You can adjust the number of results
        include_answer: true, // Request a concise answer if available
        include_raw_content: false, // Set to true if you need the full page content (larger response)
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from Tavily API:", errorData);
      return `[Error fetching from Tavily: ${errorData.message || response.statusText}. Proceeding without external search data.]\n\n`;
    }

    const data = await response.json();
    console.log("[Tavily] Search successful, data received:", data); 
    let tavilyResults = "";

    // Check if an answer is provided and include it
    if (data.answer) {
      tavilyResults += `**Tavily Search Answer:** ${data.answer}\n\n`;
    }

    // Format the search results
    if (data.results && data.results.length > 0) {
      tavilyResults += "**Relevant Web Results:**\n";
      data.results.forEach((result: any, index: number) => {
        tavilyResults += `${index + 1}. **[${result.title}](${result.url})**\n`;
        // Truncate content to avoid excessively long prompts
        if (result.content) {
            tavilyResults += `   ${result.content.substring(0, 250)}...\n\n`;
        }
      });
    }

    // If no specific results or answer, provide a general message
    if (!tavilyResults) {
        return `[Tavily search for "${query}" did not return specific results. Using general web knowledge.]\n\n`;
    }

    return `[Information from Tavily Search for "${query}"]\n\n${tavilyResults}\n`;

  } catch (error) {
    console.error("Error fetching from Tavily:", error);
    // Return a message indicating the search failed but content generation can continue
    return `[Tavily search for "${query}" failed. Proceeding without external search data.]\n\n`;
  }
}

export async function POST(request: Request) {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Process in background
  ;(async () => {
    try {
      const { prompt, useTavily } = await request.json();

      if (!prompt) {
        await writer.write(encoder.encode("Error: Prompt is required"));
        await writer.close();
        return;
      }

      // Initialize the Gemini API
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

      // Fetch Tavily data if enabled
      let tavilyData = "";
      if (useTavily) {
        tavilyData = await fetchTavilyData(prompt);
      }

      // Create a system instruction
      const systemInstruction = `
You are Noether AI, a content generation assistant for a reading platform.
Your task is to create high-quality, well-structured content based on the user's prompt.
${useTavily ? "You have access to recent web information via Tavily Search to enhance your response." : ""}

Guidelines:
- Create content that is informative, engaging, and suitable for reading
- Structure with clear headings, subheadings, and bullet points where appropriate
- Use Markdown formatting (# for main heading, ## for subheadings, - for bullet points)
- Aim for approximately 500-800 words of substantive content
- Include an introduction, main sections, and a conclusion
- Focus on accuracy and educational value
- Avoid controversial or politically charged content
- Do not include any disclaimers or notes about being an AI
`;

      // Prepare the content prompt
      const contentPrompt = `${tavilyData ? `${tavilyData}` : ""}Create content about: ${prompt}`;

      // Generate content with streaming - using the exact method from the docs
      const response = await ai.models.generateContentStream({
        model: "gemini-2.0-flash",
        contents: contentPrompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 2048,
        },
      });

      // Process the stream chunks exactly as shown in the docs
      for await (const chunk of response) {
        if (chunk.text) {
          await writer.write(encoder.encode(chunk.text));
        }
      }

      await writer.close();
    } catch (error) {
      console.error("Error generating content:", error);
      await writer.write(encoder.encode("Error generating content. Please try again."));
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}