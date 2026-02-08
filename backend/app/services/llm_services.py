
import asyncio
from dataclasses import dataclass

import httpx

from app.config import Settings
from app.services.prompt_service import Prompt


@dataclass(frozen=True)
class LLMResult:
  text: str
  provider: str
  model: str


class LLMError(RuntimeError):
  pass


async def _openai_chat_completion(*, settings: Settings, prompt: Prompt) -> LLMResult:
  if not settings.openai_api_key:
    raise LLMError('OPENAI_API_KEY is not set')

  url = 'https://api.openai.com/v1/chat/completions'
  headers = {
    'Authorization': f'Bearer {settings.openai_api_key}',
    'Content-Type': 'application/json',
  }
  payload = {
    'model': settings.openai_model,
    'messages': [
      {'role': 'system', 'content': prompt.system},
      {'role': 'user', 'content': prompt.user},
    ],
    'temperature': 0.7,
  }

  timeout = httpx.Timeout(settings.request_timeout_seconds)

  last_err: Exception | None = None
  for attempt in range(settings.max_retries + 1):
    try:
      async with httpx.AsyncClient(timeout=timeout) as client:
        resp = await client.post(url, headers=headers, json=payload)

      if resp.status_code in (429, 500, 502, 503, 504):
        raise LLMError(f'OpenAI temporary error: {resp.status_code}: {resp.text}')

      resp.raise_for_status()
      data = resp.json()
      text = (
        data.get('choices', [{}])[0]
        .get('message', {})
        .get('content', '')
        .strip()
      )
      if not text:
        raise LLMError('OpenAI returned empty response')

      return LLMResult(text=text, provider='openai', model=settings.openai_model)
    except Exception as e:  # noqa: BLE001
      last_err = e
      if attempt >= settings.max_retries:
        break
      await asyncio.sleep(0.6 * (2**attempt))

  raise LLMError(str(last_err) if last_err else 'Unknown LLM error')


async def _gemini_generate_content(*, settings: Settings, prompt: Prompt) -> LLMResult:
  if not settings.gemini_api_key:
    raise LLMError('GEMINI_API_KEY is not set')
  if settings.gemini_api_key.strip() in {'YOUR_KEY_HERE', 'REPLACE_ME'}:
    raise LLMError('GEMINI_API_KEY is a placeholder. Set a real key in backend/.env')

  model = settings.gemini_model or 'gemini-1.5-flash'
  url = (
    f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent'
    f'?key={settings.gemini_api_key}'
  )

  payload = {
    'contents': [
      {
        'role': 'user',
        'parts': [
          {
            'text': (
              'SYSTEM:\n'
              + prompt.system
              + '\n\nUSER:\n'
              + prompt.user
            )
          }
        ],
      }
    ],
    'generationConfig': {
      'temperature': 0.7,
    },
  }

  timeout = httpx.Timeout(settings.request_timeout_seconds)

  last_err: Exception | None = None
  for attempt in range(settings.max_retries + 1):
    try:
      async with httpx.AsyncClient(timeout=timeout) as client:
        resp = await client.post(url, json=payload)

      if resp.status_code in (400, 401, 403):
        raise LLMError(
          'Gemini request failed. Check GEMINI_API_KEY and GEMINI_MODEL. '
          f'Status {resp.status_code}: {resp.text}'
        )
      if resp.status_code in (429, 500, 502, 503, 504):
        raise LLMError(f'Gemini temporary error: {resp.status_code}: {resp.text}')

      resp.raise_for_status()
      data = resp.json()

      candidates = data.get('candidates') or []
      if not candidates:
        raise LLMError('Gemini returned no candidates')

      content = (candidates[0].get('content') or {})
      parts = content.get('parts') or []
      text = (parts[0].get('text') if parts else '')
      text = (text or '').strip()
      if not text:
        raise LLMError('Gemini returned empty response')

      return LLMResult(text=text, provider='gemini', model=model)
    except Exception as e:  # noqa: BLE001
      last_err = e
      if attempt >= settings.max_retries:
        break
      await asyncio.sleep(0.6 * (2**attempt))

  raise LLMError(str(last_err) if last_err else 'Unknown LLM error')


async def generate_from_llm(*, settings: Settings, prompt: Prompt) -> LLMResult:
  provider = (settings.llm_provider or 'openai').strip().lower()
  if provider == 'gemini':
    return await _gemini_generate_content(settings=settings, prompt=prompt)
  if provider == 'openai':
    return await _openai_chat_completion(settings=settings, prompt=prompt)

  raise LLMError(f'Unsupported LLM provider: {provider}')
