from functools import lru_cache

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
  model_config = SettingsConfigDict(env_file='.env', extra='ignore')

  llm_provider: str = 'gemini'

  openai_api_key: str | None = None
  openai_model: str = 'gpt-4o-mini'

  gemini_api_key: str | None = None
  gemini_model: str = 'gemini-1.5-flash'

  request_timeout_seconds: float = 30.0
  max_retries: int = 2


@lru_cache
def get_settings() -> Settings:
  load_dotenv()
  return Settings()
