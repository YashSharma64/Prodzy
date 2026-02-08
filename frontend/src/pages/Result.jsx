import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { evaluateDescription, generateDescription } from '../services/api.js'

export default function Result() {
  const navigate = useNavigate()
  const location = useLocation()

  const error = location.state?.error
  const generatePayload = location.state?.generatePayload

  const initialDescription = useMemo(() => {
    return (
      location.state?.description ||
      `Noise Air Buds Pro are premium wireless earbuds designed
for young professionals who value performance and comfort.
Featuring active noise cancellation and long battery life,
they are ideal for daily use, travel, and work.`
    )
  }, [location.state])

  const [description, setDescription] = useState(initialDescription)

  const [copyState, setCopyState] = useState('idle')

  const [isRegenerating, setIsRegenerating] = useState(false)
  const [regenError, setRegenError] = useState('')

  const suggestions = location.state?.suggestions || []

  const checks = useMemo(() => {
    const raw = location.state?.checks
    if (!raw) return []

    if (Array.isArray(raw)) return raw

    const toLine = (key, status) => {
      const label = key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())

      return {
        status: status === 'pass' ? 'ok' : status,
        label,
        text: status === 'pass' ? 'Within recommended range' : 'Needs attention',
      }
    }

    const suggestionText = suggestions.join('\n')
    const missingMatch = suggestionText.match(/Add required terms:\s*(.*)/i)
    const missingTerms = missingMatch?.[1]?.trim()

    return Object.entries(raw).map(([k, v]) => {
      const base = toLine(k, v)

      if (k === 'tone') {
        return {
          ...base,
          text: v === 'pass' ? 'Matches expected tone' : 'Tone needs adjustment',
        }
      }

      if (k === 'missing_info') {
        return {
          ...base,
          text:
            v === 'pass'
              ? 'No missing info detected'
              : missingTerms
                ? `Missing: ${missingTerms}`
                : 'Missing info detected',
        }
      }

      if (k === 'length') {
        const lengthHint = suggestions.find(
          (s) => /Increase the description length|Shorten the description/i.test(s)
        )
        return {
          ...base,
          text: v === 'pass' ? 'Within recommended range' : lengthHint || 'Length needs adjustment',
        }
      }

      return base
    })
  }, [location.state])

  const onCopy = async () => {
    try {
      setCopyState('copying')
      await navigator.clipboard.writeText(description)
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 1500)
    } catch {
      setCopyState('error')
      window.setTimeout(() => setCopyState('idle'), 1500)
    }
  }

  const onRegenerate = async () => {
    if (!generatePayload) return
    setRegenError('')
    setIsRegenerating(true)

    try {
      const gen = await generateDescription(generatePayload)
      const evalRes = await evaluateDescription({
        description: gen.description,
        expected_tone: generatePayload.tone,
        required_terms: (generatePayload.key_features || []).slice(0, 5),
        min_length: 120,
        max_length: 180,
      })

      setDescription(gen.description)
      navigate('/result', {
        replace: true,
        state: {
          ...location.state,
          description: gen.description,
          checks: evalRes.checks,
          suggestions: evalRes.suggestions,
          score: evalRes.score,
          metadata: gen.metadata,
        },
      })
    } catch (e) {
      setRegenError(e instanceof Error ? e.message : 'Failed to regenerate')
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5E8D7] text-[#7B5A48]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8">
        <div className="text-2xl font-light tracking-widest">LOGO</div>
        <button
          type="button"
          className="text-2xl font-light tracking-widest hover:opacity-80"
        >
          ABOUT US
        </button>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-16">
        <h1 className="text-center text-3xl font-light tracking-wide md:text-5xl">
          Generated Description
        </h1>

        {error ? (
          <div className="mx-auto mt-8 w-full max-w-4xl rounded-2xl border border-[#C9AA8C] bg-[#F5E8D7] p-6 text-center md:p-10">
            <p className="text-sm text-[#7B5A48]">{error}</p>
            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#6B4A3A] hover:opacity-80"
              onClick={() => navigate('/')}
            >
              <span>←</span>
              <span>Back to Edit</span>
            </button>
          </div>
        ) : null}

        <section className="mx-auto mt-8 w-full max-w-4xl rounded-2xl border border-[#C9AA8C] bg-[#F5E8D7] p-6 md:p-10">
          <div className="whitespace-pre-line text-base leading-relaxed md:text-lg">
            {description}
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={onCopy}
              disabled={copyState === 'copying'}
              className="inline-flex rounded-xl bg-[#6B4A3A] px-8 py-3 text-sm font-medium text-[#F5E8D7] shadow-sm hover:opacity-95 active:opacity-90"
            >
              {copyState === 'copied'
                ? 'Copied!'
                : copyState === 'error'
                  ? 'Copy failed'
                  : 'Copy'}
            </button>
            <button
              type="button"
              onClick={onRegenerate}
              disabled={isRegenerating || !generatePayload}
              className="inline-flex rounded-xl border border-[#6B4A3A] bg-transparent px-8 py-3 text-sm font-medium text-[#6B4A3A] shadow-sm hover:bg-[#6B4A3A]/5 active:opacity-90"
            >
              {isRegenerating ? 'Regenerating…' : 'Regenerate'}
            </button>
          </div>

          {regenError ? (
            <p className="mt-4 text-center text-xs text-[#9A7A66]">{regenError}</p>
          ) : null}
        </section>

        <section className="mx-auto mt-10 w-full max-w-4xl">
          <h2 className="text-xl font-medium tracking-wide">Quality Check</h2>

          <div className="mt-4 rounded-2xl border border-[#C9AA8C] bg-[#F5E8D7] p-6 md:p-8">
            <div className="grid gap-3 text-sm md:text-base">
              {checks.map((c) => (
                <div key={c.label} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5">{c.status === 'ok' ? '-' : '⚠'}</div>
                  <div>
                    <span className="font-medium">{c.label}:</span> {c.text}
                  </div>
                </div>
              ))}
            </div>

            {suggestions.length ? (
              <div className="mt-6 border-t border-[#C9AA8C] pt-4">
                <div className="text-sm font-medium">Suggestions</div>
                <div className="mt-2 grid gap-2 text-sm text-[#9A7A66]">
                  {suggestions.map((s) => (
                    <div key={s}>{s}</div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#6B4A3A] hover:opacity-80"
            onClick={() => navigate('/')}
          >
            <span>←</span>
            <span>Back to Edit</span>
          </button>
        </section>
      </main>
    </div>
  )
}
