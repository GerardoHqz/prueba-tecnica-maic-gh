import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "cafe_el_salvador")
    MONGODB_COLLECTION_MESSAGES: str = os.getenv("MONGODB_COLLECTION_MESSAGES", "mensajes")
    GEMINI_API_KEY: str | None = None
    GEMINI_MODEL: str = "gemini-2.5-flash-lite"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
