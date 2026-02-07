
from fastapi import APIRouter

from app.schemas.request import GenerateRequest
from app.schemas.response import GenerateResponse, LLMMetadata


router = APIRouter(tags=['generate'])


async def _generate_description(payload: GenerateRequest) -> GenerateResponse:
  description = (
    f"{payload.product_name} is a great choice in the {payload.category} category. "
    f"Key highlights: {', '.join(payload.key_features) if payload.key_features else 'N/A'}."
  )

  return GenerateResponse(
    description=description,
    metadata=LLMMetadata(provider='stub', model='stub'),
  )


@router.post('/generate', response_model=GenerateResponse)
async def generate(payload: GenerateRequest):
  return await _generate_description(payload)


@router.post('/generate-description', response_model=GenerateResponse)
async def generate_description(payload: GenerateRequest):
  return await _generate_description(payload)
