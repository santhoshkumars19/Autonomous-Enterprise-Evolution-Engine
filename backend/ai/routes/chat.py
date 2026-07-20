from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
import openai
import google.generativeai as genai
from config.settings import get_settings

router = APIRouter(prefix="/ai", tags=["Chat"])
settings = get_settings()

# ─── Init AI Clients ────────────────────────────────────────────────────────
openai_client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
genai.configure(api_key=settings.GEMINI_API_KEY)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    session_id: Optional[str] = None
    provider: str = Field(default="openai", pattern="^(openai|gemini)$")
    user_id: Optional[str] = None
    system_prompt: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    provider: str
    session_id: Optional[str]
    model: str


EVOAI_SYSTEM_PROMPT = """You are EvoAI — the EvoAI's 
AI Business Intelligence Assistant. You have deep expertise in:
- Enterprise strategy, financial modeling, and market analysis
- Competitor intelligence and positioning
- AI-powered business process automation
- C-Suite level executive decision support

Respond as a professional enterprise AI advisor. Be concise, data-driven, and actionable.
Format complex answers with clear structure. Always relate insights back to measurable business outcomes."""


async def chat_openai(message: str, system_prompt: str) -> tuple[str, str]:
    """Send message to OpenAI GPT-4o and return (response, model)."""
    response = await openai_client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message},
        ],
        max_tokens=1024,
        temperature=0.7,
    )
    content = response.choices[0].message.content or ""
    return content, settings.OPENAI_MODEL


async def chat_gemini(message: str, system_prompt: str) -> tuple[str, str]:
    """Send message to Google Gemini and return (response, model)."""
    model = genai.GenerativeModel(
        model_name=settings.GEMINI_MODEL,
        system_instruction=system_prompt,
    )
    result = await model.generate_content_async(message)
    return result.text, settings.GEMINI_MODEL


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest) -> ChatResponse:
    """
    AI Business Chat endpoint.
    Routes to OpenAI GPT-4o or Google Gemini based on provider param.
    """
    system_prompt = request.system_prompt or EVOAI_SYSTEM_PROMPT

    try:
        if request.provider == "gemini":
            response_text, model_used = await chat_gemini(request.message, system_prompt)
        else:
            response_text, model_used = await chat_openai(request.message, system_prompt)

        return ChatResponse(
            response=response_text,
            provider=request.provider,
            session_id=request.session_id,
            model=model_used,
        )

    except openai.RateLimitError:
        raise HTTPException(status_code=429, detail="OpenAI rate limit exceeded. Try again shortly.")
    except openai.AuthenticationError:
        raise HTTPException(status_code=401, detail="Invalid OpenAI API key.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

