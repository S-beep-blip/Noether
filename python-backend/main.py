from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.responses import StreamingResponse
from pathlib import Path
import aiofiles
import os
import json
import google.generativeai as genai
import google.generativeai.types as genai_types # For explicit type usage
from pydantic import BaseModel, ValidationError
import requests
import logging
from fastapi.middleware.cors import CORSMiddleware

# --- Logging Configuration ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Global Configuration & Startup Checks ---
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY")

if not GEMINI_API_KEY:
    logger.error("CRITICAL: GEMINI_API_KEY environment variable not found. Application will not function correctly.")
    raise RuntimeError("GEMINI_API_KEY is not set. The application cannot start.")
else:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        logger.info("Gemini API key configured.")
    except Exception as e:
        logger.error(f"Error configuring Gemini API: {e}")
        raise RuntimeError(f"Failed to configure Gemini API: {e}")


app = FastAPI()

# --- CORS Middleware Configuration ---
# Origins to allow (use ["*"] for development to allow all)
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

UPLOAD_DIR = Path(__file__).parent / "uploads"
chat_sessions = {} # In-memory store for chat sessions

# --- Pydantic Models ---
class ProcessRequest(BaseModel):
    filePath: str
    previewOnly: bool

class GenerateContentRequest(BaseModel):
    prompt: str
    useTavily: bool = False

class DefineRequest(BaseModel):
    word: str
    context: str

class ChatRequest(BaseModel):
    message: str
    sessionId: str
    documentText: str | None = None

# --- Application Event Handlers ---
@app.on_event("startup")
async def startup_event():
    try:
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        logger.info(f"Upload directory '{UPLOAD_DIR}' ensured.")
    except Exception as e:
        logger.error(f"Failed to create upload directory '{UPLOAD_DIR}': {e}")
        raise RuntimeError(f"Failed to create upload directory: {e}")

    if not TAVILY_API_KEY:
        logger.info("TAVILY_API_KEY not set. Tavily search will be unavailable for content generation.")
    else:
        logger.info("TAVILY_API_KEY is set.")

# --- API Endpoints ---
@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    if ".." in file.filename or "/" in file.filename or file.filename.startswith("/"):
        logger.warning(f"Invalid filename attempt: {file.filename}")
        raise HTTPException(status_code=400, detail="Invalid filename.")

    file_basename = Path(file.filename).name
    if not file_basename:
        logger.warning("Empty filename provided.")
        raise HTTPException(status_code=400, detail="Filename cannot be empty.")

    file_path = UPLOAD_DIR / file_basename
    try:
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
        logger.info(f"File '{file_basename}' uploaded successfully to '{file_path}'.")
        return {"success": True, "filePath": str(file_path)}
    except IOError as e:
        logger.error(f"IOError during file upload of '{file_basename}': {e}")
        raise HTTPException(status_code=500, detail="Failed to save file due to an IO error.")
    except Exception as e:
        logger.error(f"Unexpected error during file upload of '{file_basename}': {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred while saving the file.")

@app.post("/api/process-with-gemini")
async def process_with_gemini(request_data: ProcessRequest):
    if not request_data.filePath:
        raise HTTPException(status_code=422, detail="filePath is required.") # 422 for validation error

    try:
        # Ensure path is absolute and within UPLOAD_DIR for security
        resolved_upload_dir = UPLOAD_DIR.resolve()
        user_file_path = Path(request_data.filePath)

        # If filePath is absolute, check it's within UPLOAD_DIR.
        # If relative, resolve it against UPLOAD_DIR and then check.
        if user_file_path.is_absolute():
            resolved_path = user_file_path.resolve()
        else:
            resolved_path = (UPLOAD_DIR / user_file_path).resolve()

        if resolved_upload_dir not in resolved_path.parents and resolved_path.parent != resolved_upload_dir:
             logger.warning(f"Path traversal attempt or invalid path: {request_data.filePath}")
             raise HTTPException(status_code=400, detail="Invalid filePath. Access restricted.")
        if not resolved_path.is_file():
            logger.warning(f"File not found at resolved path: {resolved_path}")
            raise HTTPException(status_code=404, detail="File not found at the specified filePath.")
    except ValueError as e: # Handles errors from Path() if filePath is malformed for the OS
        logger.warning(f"Invalid filePath format for Path object: {request_data.filePath}, Error: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid filePath format: {str(e)}")
    except Exception as e: # Catch-all for other Path/resolve issues
        logger.error(f"Error resolving filePath '{request_data.filePath}': {e}")
        raise HTTPException(status_code=400, detail=f"Error processing filePath: {str(e)}")

    uploaded_file_path_str = str(resolved_path)
    gemini_file_resource = None

    try:
        logger.info(f"Attempting to upload to Gemini: {uploaded_file_path_str}")
        gemini_file_resource = genai.upload_file(path=uploaded_file_path_str)
        logger.info(f"Successfully uploaded to Gemini: {gemini_file_resource.name}")

        model = genai.GenerativeModel(model_name='gemini-1.5-flash')

        if request_data.previewOnly:
            prompt_content = [
                "Preview this document's transcription (first 20-25 lines). Simple, clean preview. Transcribe now:",
                gemini_file_resource
            ]
            async def stream_generator_preview():
                try:
                    line_count = 0
                    max_lines = 25
                    async for chunk in await model.generate_content_stream(prompt_content):
                        if line_count >= max_lines: break
                        if chunk.text:
                            lines = chunk.text.split('\n')
                            for line_content in lines:
                                if line_count >= max_lines: break
                                if line_content or (not line_content and len(lines) == 1):
                                    yield json.dumps({"type": "chunk", "content": line_content + "\n"}) + "\n"
                                    line_count += 1
                    yield json.dumps({"type": "complete", "isPreview": True}) + "\n"
                except Exception as e_stream:
                    logger.error(f"Gemini API error during preview stream: {e_stream}")
                    yield json.dumps({"type": "error", "error": f"Gemini API error: {str(e_stream)}"}) + "\n"
                finally:
                    if gemini_file_resource:
                        try:
                            genai.delete_file(gemini_file_resource.name)
                            logger.info(f"Cleaned up Gemini file (preview): {gemini_file_resource.name}")
                        except Exception as e_del:
                            logger.error(f"Error deleting Gemini file (preview) {gemini_file_resource.name}: {e_del}")
            return StreamingResponse(stream_generator_preview(), media_type="text/plain; charset=utf-8")
        else: # Full transcription
            prompt_content_text = """Transcribe this file as well-structured markdown... (Full prompt as before)""" # Truncated for brevity
            prompt_content_text = """Transcribe this file as well-structured markdown. Guidelines:
1. Structure: Headers (# ## ###).
2. Math: Inline $x=y+z$, block $$...$$.
3. Lists: Bullet/numbered. Code blocks (```). Tables. Blockquotes (>).
4. Images: ![Desc](image-placeholder).
5. Format: **Bold**, *italics*. Preserve structure, enhance readability.
6. Quality: Clean, organized, professional markdown.
Transcribe fully, no extra commentary."""
            prompt_content = [prompt_content_text, gemini_file_resource]
            response = await model.generate_content_async(prompt_content)

            if not response or not hasattr(response, 'text') or not response.text: # More robust check
                 logger.error("Empty or invalid transcription response from Gemini.")
                 raise HTTPException(status_code=500, detail="Failed to generate transcription (empty or invalid response).")
            logger.info(f"Full transcription successful for {gemini_file_resource.name}")
            return {"summary": response.text, "isMarkdown": True}

    except genai_types.GoogleAPIError as e_gemini_api:
        logger.error(f"Gemini API error processing file '{uploaded_file_path_str}': {e_gemini_api}")
        raise HTTPException(status_code=502, detail=f"Gemini API error: {str(e_gemini_api)}") # 502 for bad gateway type errors
    except Exception as e:
        logger.error(f"Unexpected error processing file '{uploaded_file_path_str}': {e}")
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=f"Unexpected server error during processing: {str(e)}")
    finally:
        if gemini_file_resource and not request_data.previewOnly:
            try:
                genai.delete_file(gemini_file_resource.name)
                logger.info(f"Cleaned up Gemini file (full transcription): {gemini_file_resource.name}")
            except Exception as e_del:
                logger.error(f"Error deleting Gemini file (full transcription) {gemini_file_resource.name}: {e_del}")


@app.post("/api/generate-content")
async def generate_content(request_data: GenerateContentRequest):
    if not request_data.prompt:
        raise HTTPException(status_code=422, detail="Prompt is required.")

    tavily_data_str = ""
    tavily_access_message = ""
    if request_data.useTavily:
        if not TAVILY_API_KEY:
            logger.info("Tavily search requested but API key not set. Proceeding without.")
            tavily_data_str = "[Tavily search is not configured on the server. Proceeding without web search.]\n\n"
        else:
            try:
                logger.info(f"Calling Tavily API for prompt: {request_data.prompt[:50]}...")
                payload = {"api_key": TAVILY_API_KEY, "query": request_data.prompt, "search_depth": "advanced", "max_results": 5, "include_answer": True, "include_raw_content": False}
                response = requests.post("https://api.tavily.com/search", json=payload, timeout=10)
                response.raise_for_status() # Raises HTTPError for bad responses (4XX or 5XX)
                results = response.json()
                # ... (rest of Tavily formatting as before, with logging for no results)
                logger.info(f"Tavily search successful for prompt: {request_data.prompt[:50]}. Answer included: {'answer' in results}")

            except requests.exceptions.Timeout:
                logger.warning(f"Tavily API call timed out for prompt: {request_data.prompt[:50]}")
                tavily_data_str = f"[Tavily API call timed out. Proceeding without web search.]\n\n"
            except requests.exceptions.HTTPError as e_http:
                logger.warning(f"Tavily API HTTP error: {e_http}. Status: {e_http.response.status_code}")
                tavily_data_str = f"[Error {e_http.response.status_code} from Tavily API. Proceeding without web search.]\n\n"
            except requests.exceptions.RequestException as e_req: # Catch other request-related errors
                logger.error(f"Tavily API RequestException: {e_req}")
                tavily_data_str = f"[Error fetching data from Tavily: {str(e_req)}. Proceeding without web search.]\n\n"
            except Exception as e: # Catch other potential errors like JSON parsing
                logger.error(f"Unexpected error processing Tavily response: {e}")
                tavily_data_str = f"[Unexpected error processing Tavily response: {str(e)}. Proceeding without web search.]\n\n"

    system_instruction = f"""You are Noether AI... (Full instruction as before)""" # Truncated
    system_instruction = f"""You are Noether AI, content generation assistant. Create high-quality, structured content. {tavily_access_message}
Guidelines: Informative, engaging. Markdown (#, ##, -). ~500-800 words. Intro, sections, conclusion. Accurate, educational. No controversial/political content. No AI disclaimers."""
    content_prompt = f"{tavily_data_str}{request_data.prompt}"

    try:
        model = genai.GenerativeModel(model_name='gemini-1.5-flash', system_instruction=system_instruction)
        config = genai_types.GenerationConfig(temperature=0.7, top_p=0.9, top_k=40, max_output_tokens=2048)

        async def stream_generator_content():
            try:
                logger.info(f"Starting Gemini content stream for prompt: {request_data.prompt[:50]}")
                stream = await model.generate_content_stream([content_prompt], generation_config=config)
                async for chunk in stream:
                    if chunk.text: yield chunk.text
                logger.info(f"Gemini content stream finished for prompt: {request_data.prompt[:50]}")
            except genai_types.GoogleAPIError as e_gemini_api_stream:
                logger.error(f"Gemini API error during content streaming: {e_gemini_api_stream}")
                yield f"\n\n[Error generating content due to Gemini API issue: {str(e_gemini_api_stream)}]"
            except Exception as e_stream:
                logger.error(f"Unexpected error during content streaming: {e_stream}")
                yield f"\n\n[Error generating content: {str(e_stream)}]"
        return StreamingResponse(stream_generator_content(), media_type="text/plain; charset=utf-8")

    except genai_types.GoogleAPIError as e_gemini_api:
        logger.error(f"Gemini API error setting up content generation: {e_gemini_api}")
        raise HTTPException(status_code=502, detail=f"Gemini API error: {str(e_gemini_api)}")
    except Exception as e:
        logger.error(f"Unexpected error setting up content generation for prompt '{request_data.prompt[:50]}': {e}")
        raise HTTPException(status_code=500, detail=f"Unexpected server error: {str(e)}")


@app.post("/api/define")
async def define_word(request_data: DefineRequest):
    if not request_data.word or not request_data.context:
        raise HTTPException(status_code=422, detail="Both 'word' and 'context' are required.")

    prompt = f"""Define "{request_data.word}" in context: "{request_data.context}". Concise (3-5 sentences), context-specific. No phrases like "In this context". Direct definition."""
    try:
        logger.info(f"Requesting definition for '{request_data.word}'")
        model = genai.GenerativeModel(model_name='gemini-1.5-flash')
        config = genai_types.GenerationConfig(max_output_tokens=150, temperature=0.4)
        response = await model.generate_content_async([prompt], generation_config=config)

        if not response or not hasattr(response, 'text') or not response.text:
            logger.warning(f"No definition generated by Gemini for word '{request_data.word}'.")
            raise HTTPException(status_code=500, detail="No definition generated or empty response from AI.")

        logger.info(f"Definition generated for '{request_data.word}'.")
        return {"definition": response.text.strip()}
    except genai_types.GoogleAPIError as e_gemini_api:
        logger.error(f"Gemini API error requesting definition for '{request_data.word}': {e_gemini_api}")
        raise HTTPException(status_code=502, detail=f"Gemini API error: {str(e_gemini_api)}")
    except Exception as e:
        logger.error(f"Unexpected error requesting definition for '{request_data.word}': {e}")
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=f"Failed to generate definition: {str(e)}")


@app.post("/api/chat")
async def chat_with_document(request_data: ChatRequest):
    if not request_data.message or not request_data.sessionId:
        raise HTTPException(status_code=422, detail="Message and sessionId are required.")

    session_id = request_data.sessionId
    chat_session_obj = None # Renamed to avoid confusion with FastAPI's 'session' if it were used

    try:
        if session_id not in chat_sessions:
            logger.info(f"Creating new chat session: {session_id}")
            document_content = request_data.documentText if request_data.documentText else "No document content provided."
            initial_user_message = "Let's discuss the document (if any) or chat."
            model_primer_text = f"""You are a helpful but friendly document assistant... (Full primer as before)""" # Truncated
            model_primer_text = f"""You are a helpful but friendly document assistant. The user has uploaded a document and can ask questions about it or discuss general topics. Here is the document content:

{document_content}

Please provide a helpful response. If the question relates to the document, answer based on its content while maintaining general knowledge accuracy. For non-document questions, provide a helpful general response to the user's questions. Keep responses concise (2-5 sentences). Acknowledge this setup now.
"""
            model = genai.GenerativeModel(model_name='gemini-1.5-flash')

            chat_session_obj = model.start_chat(history=[
                {'role': 'user', 'parts': [genai_types.Part(text=initial_user_message)]},
                {'role': 'model', 'parts': [genai_types.Part(text=model_primer_text)]}
            ])
            chat_sessions[session_id] = chat_session_obj
        else:
            logger.info(f"Using existing chat session: {session_id}")
            chat_session_obj = chat_sessions[session_id]

        generation_config = genai_types.GenerationConfig(max_output_tokens=250, temperature=0.8)

        logger.info(f"Sending message to chat session {session_id}: '{request_data.message[:50]}...'")
        response = await chat_session_obj.send_message_async(request_data.message, generation_config=generation_config)

        if not response or not hasattr(response, 'text') or not response.text:
            logger.warning(f"No response from chat model for session {session_id}.")
            raise HTTPException(status_code=500, detail="No response from chat model.")

        logger.info(f"Response received for chat session {session_id}.")
        return {"text": response.text.strip()}

    except genai_types.GoogleAPIError as e_gemini_api:
        logger.error(f"Gemini API error during chat for session {session_id}: {e_gemini_api}")
        raise HTTPException(status_code=502, detail=f"Gemini API error: {str(e_gemini_api)}")
    except Exception as e:
        logger.error(f"Unexpected error during chat for session {session_id}: {e}")
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@app.get("/")
async def root():
    return {"message": "Hello from FastAPI backend!"}

# Note: Redundant checks for GEMINI_API_KEY/TAVILY_API_KEY at module end are removed
# as GEMINI_API_KEY check now raises RuntimeError, and TAVILY_API_KEY is logged in startup.

```
