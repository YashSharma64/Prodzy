
from fastapi import APIRouter

from app.schemas.request import GenerateRequest
from app.schemas.response import GenerateResponse, LLMMetadata


router = APIRouter(tags=['generate'])


@router.post('/generate', response_model=GenerateResponse)
async def generate(payload: GenerateRequest):
  description = (
    f"{payload.product_name} is a great choice in the {payload.category} category. "
    f"Key highlights: {', '.join(payload.key_features) if payload.key_features else 'N/A'}."
  )

  return GenerateResponse(
    description=description,
    metadata=LLMMetadata(provider='stub', model='stub'),
  )
