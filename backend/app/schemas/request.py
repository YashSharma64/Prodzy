
from typing import List, Optional

from pydantic import BaseModel, Field


class GenerateRequest(BaseModel):
  product_name: str = Field(..., min_length=1)
  category: str = Field(..., min_length=1)
  key_features: List[str] = Field(default_factory=list)
  audience: Optional[str] = None
  tone: Optional[str] = None
  prompt_version: str = Field(default='v2')
  language: str = Field(default='en', min_length=2, max_length=8)


class EvaluateRequest(BaseModel):
  description: str = Field(..., min_length=1)
  expected_tone: Optional[str] = None
  required_terms: List[str] = Field(default_factory=list)
  min_length: Optional[int] = Field(default=None, ge=1)
  max_length: Optional[int] = Field(default=None, ge=1)
