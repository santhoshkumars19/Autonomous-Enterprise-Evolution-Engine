from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config.settings import get_settings
from routes.chat import router as chat_router
from routes.agents import router as agents_router
from routes.analysis import router as analysis_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"\n🤖 {settings.APP_NAME} v{settings.VERSION} starting...")
    print(f"🔑 OpenAI model: {settings.OPENAI_MODEL}")
    print(f"✨ Gemini model: {settings.GEMINI_MODEL}")
    print(f"🚀 Server: http://{settings.HOST}:{settings.PORT}")
    yield
    print("👋 AI Microservice shutting down...")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="EvoAI Microservice — OpenAI, Gemini, LangChain, CrewAI",
    lifespan=lifespan,
)

# ─── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ───────────────────────────────────────────────────────────────────
app.include_router(chat_router)
app.include_router(agents_router)
app.include_router(analysis_router)

# ─── Health Check ──────────────────────────────────────────────────────────────
@app.get("/health")
async def health():
    return {
        "success": True,
        "service": settings.APP_NAME,
        "version": settings.VERSION,
        "providers": {
            "openai": {"model": settings.OPENAI_MODEL, "status": "configured"},
            "gemini": {"model": settings.GEMINI_MODEL, "status": "configured"},
        },
        "frameworks": ["LangChain", "CrewAI"],
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )

