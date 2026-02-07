from fastapi import APIRouter

from app.schemas.request import EvaluateRequest
from app.schemas.response import EvaluateResponse

router = APIRouter(tags=['evaluate'])


@router.post('/evaluate', response_model=EvaluateResponse)
async def evaluate(payload: EvaluateRequest):
  checks = {
    'length': 'pass',
    'tone': 'warn',
    'missing_fields': 'pass',
  }

  suggestions = []
  if payload.min_length is not None and len(payload.description) < payload.min_length:
    checks['length'] = 'warn'
    suggestions.append('Increase the description length to meet the minimum.')

  if payload.required_terms:
    missing = [t for t in payload.required_terms if t.lower() not in payload.description.lower()]
    if missing:
      checks['missing_fields'] = 'warn'
      suggestions.append(f"Add required terms: {', '.join(missing)}")

  score = 80
  if 'warn' in checks.values():
    score = 65

  return EvaluateResponse(score=score, checks=checks, suggestions=suggestions)
