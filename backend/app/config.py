from pathlib import Path

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


def get_settings() -> Settings:
  dotenv_path = Path(__file__).resolve().parents[1] / '.env'
  load_dotenv(dotenv_path=dotenv_path, override=True)
  return Settings()
