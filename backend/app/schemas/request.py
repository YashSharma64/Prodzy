
from typing import List, Optional

from pydantic import BaseModel, Field


class GenerateRequest(BaseModel):
  product_name: str = Field(
    ..., min_length=1, examples=['Aurora Insulated Stainless Steel Water Bottle (750ml)']
  )
  category: str = Field(..., min_length=1, examples=['Drinkware'])
  key_features: List[str] = Field(
    default_factory=list,
    examples=[
      [
        'Double-wall insulated',
        'Leak-proof lid',
        'BPA-free',
        'Keeps cold 24h / hot 12h',
      ]
    ],
  )
  audience: Optional[str] = Field(default=None, examples=['Gym-goers, commuters, and travelers'])
  tone: Optional[str] = Field(default=None, examples=['premium'])
  prompt_version: str = Field(default='v2', examples=['v2'])
  language: str = Field(default='en', min_length=2, max_length=8, examples=['en'])


class EvaluateRequest(BaseModel):
  description: str = Field(
    ...,
    min_length=1,
    examples=[
      'Elevate your hydration ritual with the Aurora insulated bottle, crafted to keep drinks cold for hours and warm when you need it most. Designed with a leak-proof lid and BPA-free materials, it’s built for daily performance.\n\nTake it from commute to workout with confidence—clean lines, scratch-resistant finish, and a premium feel that fits every routine. Shop now and upgrade your everyday carry.'
    ],
  )
  expected_tone: Optional[str] = Field(default=None, examples=['premium'])
  required_terms: List[str] = Field(
    default_factory=list,
    examples=[['insulated', 'leak-proof', 'bpa-free']],
  )
  min_length: Optional[int] = Field(default=None, ge=1, examples=[120])
  max_length: Optional[int] = Field(default=None, ge=1, examples=[180])
