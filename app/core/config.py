import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Load environment variables from .env file
load_dotenv()


class Settings(BaseSettings):
    # TODO: Add configuration options

    # Gemini API Key
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Document types
    ALLOWED_DOCUMENT_TYPES: list[str] = [".pdf", ".xlsx"]

settings = Settings()
