
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


def _word_count(text: str) -> int:
  return len([w for w in re.split(r"\s+", text.strip()) if w])


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
  for v in checks.values():
    if v == 'warn':
      score -= 15
    if v == 'fail':
      score -= 30
  score = max(0, min(100, score))

  return EvaluationResult(score=score, checks=checks, suggestions=suggestions)
