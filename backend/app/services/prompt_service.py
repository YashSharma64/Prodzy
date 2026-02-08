
from dataclasses import dataclass


PROMPT_V1_SYSTEM = (
  'You are an expert ecommerce copywriter. Write clear, persuasive product descriptions.'
)

PROMPT_V1_USER = (
  'Write a product description in {language} for an ecommerce listing.'
  '\n\n'
  'Product name: {product_name}'
  '\n'
  'Category: {category}'
  '\n'
  'Key features: {key_features}'
  '\n'
  'Target audience: {audience}'
  '\n'
  'Tone: {tone}'
  '\n\n'
  'Constraints:'
  '\n'
  '- 120 to 180 words'
  '\n'
  '- Use short paragraphs'
  '\n'
  '- Include a clear benefit-led opening'
  '\n'
  '- Avoid fluff and exaggerated claims'
)


PROMPT_V2_SYSTEM = (
  'You are an expert ecommerce copywriter.'
  ' Output must be ready to paste into an ecommerce product page.'
  ' Do not include headings or bullet points unless asked.'
)

PROMPT_V2_USER_BASE = (
  'Write a product description in {language} for an ecommerce listing.'
  '\n\n'
  'Product name: {product_name}'
  '\n'
  'Category: {category}'
  '\n'
  'Key features: {key_features}'
  '\n'
  'Target audience: {audience}'
  '\n'
  'Tone: {tone}'
)


_CATEGORY_HINTS = {
  'electronics': (
    'Emphasize performance, comfort, battery/specs where relevant, and practical daily use.'
  ),
  'beauty': (
    'Emphasize results, texture/feel, skin/hair concerns, and gentle/clean reassurance without medical claims.'
  ),
  'fashion': (
    'Emphasize fit, fabric, comfort, styling versatility, and occasions.'
  ),
  'home': (
    'Emphasize materials, durability, ease of care, and how it improves the space or routine.'
  ),
  'food': (
    'Emphasize taste notes, ingredients, dietary fit if provided, and serving ideas.'
  ),
}


def _normalize_category(category: str) -> str:
  c = (category or '').strip().lower()
  if not c:
    return 'other'

  if any(k in c for k in ['electronic', 'earbud', 'headphone', 'laptop', 'phone', 'gadget']):
    return 'electronics'
  if any(k in c for k in ['beauty', 'skincare', 'skin care', 'makeup', 'hair', 'cosmetic']):
    return 'beauty'
  if any(k in c for k in ['fashion', 'apparel', 'clothing', 'shoe', 'shoes', 'sneaker', 'jacket']):
    return 'fashion'
  if any(k in c for k in ['home', 'kitchen', 'furniture', 'decor', 'bedding', 'bath']):
    return 'home'
  if any(k in c for k in ['food', 'snack', 'beverage', 'drink', 'coffee', 'tea']):
    return 'food'

  return 'other'


def _fmt_list(items) -> str:
  if not items:
    return 'N/A'
  if isinstance(items, str):
    return items
  return ', '.join([str(x).strip() for x in items if str(x).strip()]) or 'N/A'


@dataclass(frozen=True)
class Prompt:
  system: str
  user: str
  version: str


def build_prompt_v1(
  *,
  product_name: str,
  category: str,
  key_features,
  audience: str | None,
  tone: str | None,
  language: str,
) -> Prompt:
  user = PROMPT_V1_USER.format(
    language=language,
    product_name=product_name,
    category=category,
    key_features=_fmt_list(key_features),
    audience=audience or 'N/A',
    tone=tone or 'N/A',
  )
  return Prompt(system=PROMPT_V1_SYSTEM, user=user, version='v1')


def build_prompt_v2(
  *,
  product_name: str,
  category: str,
  key_features,
  audience: str | None,
  tone: str | None,
  language: str,
) -> Prompt:
  normalized = _normalize_category(category)
  hint = _CATEGORY_HINTS.get(normalized)
  hint_text = hint if hint else 'Write a high-quality, category-appropriate description.'

  user = (
    PROMPT_V2_USER_BASE.format(
      language=language,
      product_name=product_name,
      category=category,
      key_features=_fmt_list(key_features),
      audience=audience or 'N/A',
      tone=tone or 'N/A',
    )
    + '\n\n'
    + 'Guidelines:'
    + '\n'
    + f'- {hint_text}'
    + '\n'
    + '- 120 to 180 words'
    + '\n'
    + '- 2 short paragraphs'
    + '\n'
    + '- Avoid superlatives and unverifiable claims'
    + '\n'
    + '- End with a subtle call-to-action'
  )

  return Prompt(system=PROMPT_V2_SYSTEM, user=user, version='v2')


def build_prompt(
  *,
  version: str,
  product_name: str,
  category: str,
  key_features,
  audience: str | None,
  tone: str | None,
  language: str,
) -> Prompt:
  v = (version or 'v2').strip().lower()
  if v == 'v1':
    return build_prompt_v1(
      product_name=product_name,
      category=category,
      key_features=key_features,
      audience=audience,
      tone=tone,
      language=language,
    )

  return build_prompt_v2(
    product_name=product_name,
    category=category,
    key_features=key_features,
    audience=audience,
    tone=tone,
    language=language,
  )
