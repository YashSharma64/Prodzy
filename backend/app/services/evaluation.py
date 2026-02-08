
from __future__ import annotations

import re
from dataclasses import dataclass


@dataclass(frozen=True)
class EvaluationResult:
  score: int
  checks: dict[str, str]
  suggestions: list[str]


_TONE_KEYWORDS: dict[str, set[str]] = {
  'premium': {'premium', 'luxury', 'crafted', 'elevated', 'refined', 'sleek'},
  'casual': {'easy', 'everyday', 'simple', 'grab', 'go-to', 'comfortable'},
  'playful': {'fun', 'bold', 'bright', 'play', 'wow'},
  'professional': {'reliable', 'consistent', 'efficient', 'designed', 'performance'},
}


_CTA_PHRASES: set[str] = {
  'buy now',
  'shop now',
  'order now',
  'add to cart',
  'get yours',
  'try it',
  'upgrade',
  'discover',
  'experience',
}


def _word_count(text: str) -> int:
  return len([w for w in re.split(r"\s+", text.strip()) if w])


def _split_sentences(text: str) -> list[str]:
  parts = re.split(r"(?<=[.!?])\s+", text.strip())
  return [p.strip() for p in parts if p.strip()]


def evaluate_description(
  *,
  description: str,
  expected_tone: str | None = None,
  required_terms: list[str] | None = None,
  min_length: int | None = None,
  max_length: int | None = None,
) -> EvaluationResult:
  desc = (description or '').strip()
  required_terms = required_terms or []

  checks: dict[str, str] = {
    'length': 'pass',
    'tone': 'pass',
    'missing_info': 'pass',
    'cta': 'pass',
    'readability': 'pass',
  }
  suggestions: list[str] = []

  wc = _word_count(desc)
  if min_length is not None and wc < min_length:
    checks['length'] = 'warn'
    suggestions.append('Increase the description length to meet the minimum.')
  if max_length is not None and wc > max_length:
    checks['length'] = 'warn'
    suggestions.append('Shorten the description to be more concise.')

  missing_terms = [t for t in required_terms if t and t.lower() not in desc.lower()]
  if missing_terms:
    checks['missing_info'] = 'warn'
    suggestions.append(f"Add required terms: {', '.join(missing_terms)}")

  # CTA (call-to-action) heuristic: optional but improves ecommerce usefulness.
  lowered = desc.lower()
  has_cta = any(p in lowered for p in _CTA_PHRASES)
  if not has_cta:
    checks['cta'] = 'warn'
    suggestions.append('Add a short call-to-action (e.g., "Shop now" or "Get yours today").')

  # Readability heuristic: avoid very long sentences.
  sentences = _split_sentences(desc)
  if sentences:
    avg_words = sum(_word_count(s) for s in sentences) / max(1, len(sentences))
    if avg_words > 28:
      checks['readability'] = 'warn'
      suggestions.append('Improve readability by shortening long sentences.')

  tone = (expected_tone or '').strip().lower()
  if tone:
    expected = _TONE_KEYWORDS.get(tone)
    if expected:
      hit = any(k in desc.lower() for k in expected)
      if not hit:
        checks['tone'] = 'warn'
        suggestions.append(f"Make the tone more {tone}.")
    else:
      checks['tone'] = 'warn'
      suggestions.append('Clarify expected tone or use a standard tone label.')

  score = 100
  weights: dict[str, int] = {
    'length': 15,
    'tone': 15,
    'missing_info': 20,
    'cta': 10,
    'readability': 10,
  }
  for key, v in checks.items():
    if v == 'warn':
      score -= weights.get(key, 10)
    if v == 'fail':
      score -= max(20, weights.get(key, 10) * 2)
  score = max(0, min(100, score))

  return EvaluationResult(score=score, checks=checks, suggestions=suggestions)
