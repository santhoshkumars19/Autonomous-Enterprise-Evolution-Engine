from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser
from config.settings import get_settings

router = APIRouter(prefix="/ai", tags=["Analysis"])
settings = get_settings()


class AnalysisRequest(BaseModel):
    context: str = Field(..., min_length=10, max_length=5000)
    provider: str = Field(default="openai", pattern="^(openai|gemini)$")
    focus_area: Optional[str] = None


def get_llm(provider: str):
    if provider == "gemini":
        return ChatGoogleGenerativeAI(
            model=settings.GEMINI_MODEL,
            google_api_key=settings.GEMINI_API_KEY,
            temperature=0.5,
        )
    return ChatOpenAI(
        model=settings.OPENAI_MODEL,
        api_key=settings.OPENAI_API_KEY,
        temperature=0.5,
    )


# ─── SWOT Analysis ─────────────────────────────────────────────────────────
@router.post("/analysis/swot")
async def swot_analysis(request: AnalysisRequest):
    """LangChain-powered SWOT analysis for the given business context."""
    try:
        llm = get_llm(request.provider)
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an elite enterprise strategy consultant. 
             Perform a rigorous SWOT analysis. Return ONLY valid JSON with this structure:
             {{"strengths": [...], "weaknesses": [...], "opportunities": [...], "threats": [...]}}
             Each array should have 3-5 concise bullet points."""),
            ("human", "Perform a SWOT analysis for:\n\n{context}"),
        ])
        chain = prompt | llm | StrOutputParser()
        result = await chain.ainvoke({"context": request.context})

        import json
        # Try to parse as JSON
        try:
            parsed = json.loads(result)
            return {"success": True, "swot": parsed, "provider": request.provider}
        except json.JSONDecodeError:
            return {"success": True, "swot_raw": result, "provider": request.provider}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SWOT analysis failed: {str(e)}")


# ─── Competitor Analysis ────────────────────────────────────────────────────
@router.post("/analysis/competitor")
async def competitor_analysis(request: AnalysisRequest):
    """LangChain-powered competitor positioning analysis."""
    try:
        llm = get_llm(request.provider)
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a competitive intelligence analyst specializing in B2B SaaS.
             Provide strategic competitor analysis with specific actionable insights.
             Focus on: differentiation opportunities, threat mitigation, and market positioning."""),
            ("human", "Analyze the competitive landscape for:\n\n{context}\n\nFocus area: {focus}"),
        ])
        chain = prompt | llm | StrOutputParser()
        result = await chain.ainvoke({
            "context": request.context,
            "focus": request.focus_area or "overall competitive positioning",
        })
        return {"success": True, "analysis": result, "provider": request.provider}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Competitor analysis failed: {str(e)}")


# ─── Market Trend Analysis ──────────────────────────────────────────────────
@router.post("/analysis/market")
async def market_analysis(request: AnalysisRequest):
    """LangChain-powered market trend analysis and opportunity identification."""
    try:
        llm = get_llm(request.provider)
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a market intelligence specialist with expertise in enterprise SaaS trends.
             Identify emerging opportunities, technology disruptions, and macro trends 
             that could impact business strategy in the next 6-18 months."""),
            ("human", "Analyze market trends and opportunities for:\n\n{context}"),
        ])
        chain = prompt | llm | StrOutputParser()
        result = await chain.ainvoke({"context": request.context})
        return {"success": True, "analysis": result, "provider": request.provider}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Market analysis failed: {str(e)}")
