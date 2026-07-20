from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional
import asyncio
from agents.crew import create_strategy_crew

router = APIRouter(prefix="/ai", tags=["Agents"])


class AgentRunRequest(BaseModel):
    business_context: str = Field(..., min_length=10, max_length=5000,
                                   description="Business context for the C-Suite agents to analyze")
    session_id: Optional[str] = None


class AgentRunResponse(BaseModel):
    result: str
    session_id: Optional[str]
    agents_involved: list[str]
    status: str


@router.post("/agents/run", response_model=AgentRunResponse)
async def run_crew_agents(request: AgentRunRequest) -> AgentRunResponse:
    """
    Run the full CrewAI C-Suite multi-agent analysis.
    Invokes CEO, CFO, CMO, and VP Sales agents sequentially
    to produce a comprehensive strategic report.
    """
    try:
        crew = create_strategy_crew(request.business_context)

        # Run crew in thread pool to avoid blocking event loop
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, crew.kickoff)

        return AgentRunResponse(
            result=str(result),
            session_id=request.session_id,
            agents_involved=["CFO (AI)", "CMO (AI)", "VP Sales (AI)", "CEO (AI)"],
            status="completed",
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Agent crew failed: {str(e)}"
        )


@router.get("/agents/status")
async def agents_status():
    """Health check for the agent crew service."""
    return {
        "status": "operational",
        "agents": [
            {"name": "CEO Agent", "role": "Strategic Synthesis", "status": "ready"},
            {"name": "CFO Agent", "role": "Financial Analysis", "status": "ready"},
            {"name": "CMO Agent", "role": "Marketing Strategy", "status": "ready"},
            {"name": "VP Sales Agent", "role": "Sales Acceleration", "status": "ready"},
        ],
        "framework": "CrewAI",
        "process": "sequential",
    }
