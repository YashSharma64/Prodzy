
from fastapi import APIRouter, HTTPException

from app.config import get_settings
from app.schemas.request import GenerateRequest
from app.schemas.response import GenerateResponse, LLMMetadata
from app.services.llm_services import LLMError, generate_from_llm
from app.services.prompt_service import build_prompt


router = APIRouter(tags=['generate'])


async def _generate_description(payload: GenerateRequest) -> GenerateResponse:
  settings = get_settings()

  prompt = build_prompt(
    version=payload.prompt_version,
    product_name=payload.product_name,
    category=payload.category,
    key_features=payload.key_features,
    audience=payload.audience,
    tone=payload.tone,
    language=payload.language,
  )

  try:
    result = await generate_from_llm(settings=settings, prompt=prompt)
  except LLMError as e:
    raise HTTPException(status_code=502, detail=str(e))

  return GenerateResponse(
    description=result.text,
    metadata=LLMMetadata(provider=result.provider, model=result.model),
  )


@router.post('/generate', response_model=GenerateResponse)
async def generate(payload: GenerateRequest):
  return await _generate_description(payload)


@router.post('/generate-description', response_model=GenerateResponse)
async def generate_description(payload: GenerateRequest):
  return await _generate_description(payload)
