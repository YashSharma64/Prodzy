from fastapi import APIRouter

from app.schemas.request import EvaluateRequest
from app.schemas.response import EvaluateResponse
from app.services.evaluation import evaluate_description

router = APIRouter(tags=['evaluate'])


@router.post('/evaluate', response_model=EvaluateResponse)
async def evaluate(payload: EvaluateRequest):
  result = evaluate_description(
    description=payload.description,
    expected_tone=payload.expected_tone,
    required_terms=payload.required_terms,
    min_length=payload.min_length,
    max_length=payload.max_length,
  )

  return EvaluateResponse(
    score=result.score,
    checks=result.checks,
    suggestions=result.suggestions,
  )
