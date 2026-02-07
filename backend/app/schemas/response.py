
from typing import Dict, List, Literal

from pydantic import BaseModel


class LLMMetadata(BaseModel):
  provider: str
  model: str


class GenerateResponse(BaseModel):
  description: str
  metadata: LLMMetadata


CheckStatus = Literal['pass', 'warn', 'fail']


class EvaluateResponse(BaseModel):
  score: int
  checks: Dict[str, CheckStatus]
  suggestions: List[str]
