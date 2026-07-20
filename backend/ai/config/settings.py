from pydantic_settings import BaseSettings
from pydantic import Field
from functools import lru_cache


class Settings(BaseSettings):
    # Server
    APP_NAME: str = "EvoAI Microservice"
    VERSION: str = "1.0.0"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:4000"]

    # AI Provider Keys
    OPENAI_API_KEY: str = Field(..., description="OpenAI API key")
    OPENAI_MODEL: str = "gpt-4o"

    GEMINI_API_KEY: str = Field(..., description="Google Gemini API key")
    GEMINI_MODEL: str = "gemini-1.5-pro"

    # Default AI Provider
    DEFAULT_PROVIDER: str = "openai"  # or "gemini"

    # Database
    DATABASE_URL: str = Field(..., description="PostgreSQL connection string")

    # Node.js API URL (for internal calls)
    NODE_API_URL: str = "http://localhost:4000"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()  # type: ignore

