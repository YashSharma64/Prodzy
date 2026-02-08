
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { evaluateDescription, generateDescription } from '../services/api.js'

export default function Input() {
  const title = 'Prodzy.AI'
  const durationMs = 5200
  const stepMs = 240

  const navigate = useNavigate()

  const [showForm, setShowForm] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    productName: '',
    category: '',
    brandOrPrice: '',
    keyFeatures: '',
    targetAudience: '',
  })

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const formRef = useRef(null)
  const aboutRef = useRef(null)

  useEffect(() => {
    if (!showForm) return
    if (!formRef.current) return

    formRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [showForm])

  const onAboutClick = () => {
    if (!aboutRef.current) return
    aboutRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const onGenerate = async () => {
    setError('')
    setIsGenerating(true)

    const keyFeatures = (form.keyFeatures || '')
      .split(/\n|,/g)
      .map((s) => s.trim())
      .filter(Boolean)

    const payload = {
      product_name: (form.productName || '').trim(),
      category: (form.category || '').trim(),
      key_features: keyFeatures,
      audience: (form.targetAudience || '').trim() || null,
      tone: 'premium',
      language: 'en',
      prompt_version: 'v2',
    }

    try {
      const gen = await generateDescription(payload)

      const evalRes = await evaluateDescription({
        description: gen.description,
        expected_tone: payload.tone,
        required_terms: keyFeatures.slice(0, 5),
        min_length: 120,
        max_length: 180,
      })

      navigate('/result', {
        state: {
          description: gen.description,
          checks: evalRes.checks,
          suggestions: evalRes.suggestions,
          score: evalRes.score,
          metadata: gen.metadata,
          generatePayload: payload,
        },
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-brown-100 text-brown-700">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-3 py-6 opacity-80">
       <div className="w-14"><img src="/prodzy.png" alt="" /></div>
        <button
          type="button"
          className="text-2xl font-light tracking-widest hover:text-brown-900"
          onClick={onAboutClick}
        >
          ABOUT US
        </button>

        
      </header>


      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="w-full max-w-3xl py-10 md:py-10">
          <h1 className="text-6xl font-light sm:text-7xl md:text-[10rem]" aria-label={title}>
            {title.split('').map((ch, idx) => (
              <span
                // eslint-disable-next-line react/no-array-index-key
                key={idx}
                className="prodzy-letter"
                style={{
                  animationDelay: `${idx * stepMs}ms`,
                  '--prodzy-duration': `${durationMs}ms`,
                }}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </h1>

          <p className="mt-8 text-lg font-light md:text-2xl tracking-wide">
            AI Product Description Generator
          </p>

          <p className="mt-8 text-base font-light leading-relaxed md:text-3xl">
            Category-aware descriptions powered by LLMs
          </p>

          <div className="mx-auto mt-5 h-px w-full max-w-xl bg-brown-200" />

          {!showForm ? (
            <button
              type="button"
              className="mt-12 inline-flex rounded-xl bg-brown-800 px-10 py-5 text-sm font-medium text-brown-100 shadow-sm transition-colors transition-transform duration-300 hover:opacity-95 hover:bg-brown-200 hover:text-brown-800 hover:scale-[1.03] active:opacity-90 active:scale-[0.99] md:px-14 md:py-6"
              onClick={() => setShowForm(true)}
            >
              <span className="leading-tight">
                <span className="block text-xs">Fill The</span>
                <span className="block text-base md:text-lg">Product Details Form</span>
              </span>
            </button>
          ) : (
            <div className="mt-10">
              <div ref={formRef} className="mx-auto w-full max-w-3xl scroll-mt-24 rounded-2xl bg-brown-800 px-6 py-8 text-left text-brown-100 shadow-sm md:px-10 md:py-10">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h2 className="text-base font-medium tracking-wide">
                      Product Details
                    </h2>
                    <p className="mt-1 text-xs text-brown-100/80">
                      Fill what you know. Keep it short.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="text-xs tracking-wide text-brown-100/90 hover:text-brown-100"
                    onClick={() => setShowForm(false)}
                  >
                    Back
                  </button>
                </div>

                <div className="mt-7 grid gap-5">
                  <label className="grid gap-2">
                    <span className="text-xs font-medium tracking-wide">Product name</span>
                    <input
                      value={form.productName}
                      onChange={onChange('productName')}
                      className="w-full rounded-lg border border-brown-100/20 bg-brown-100/5 px-4 py-3 text-sm text-brown-100 outline-none placeholder:text-brown-100/50 focus:border-brown-100/60"
                      placeholder="e.g., Aurora Stainless Steel Water Bottle"
                    />
                  </label>

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-xs font-medium tracking-wide">Category</span>
                      <input
                        value={form.category}
                        onChange={onChange('category')}
                        className="w-full rounded-lg border border-brown-100/20 bg-brown-100/5 px-4 py-3 text-sm text-brown-100 outline-none placeholder:text-brown-100/50 focus:border-brown-100/60"
                        placeholder="e.g., Drinkware"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-xs font-medium tracking-wide">Brand / Price (optional)</span>
                      <input
                        value={form.brandOrPrice}
                        onChange={onChange('brandOrPrice')}
                        className="w-full rounded-lg border border-brown-100/20 bg-brown-100/5 px-4 py-3 text-sm text-brown-100 outline-none placeholder:text-brown-100/50 focus:border-brown-100/60"
                        placeholder="e.g., Aurora / $24.99"
                      />
                    </label>
                  </div>

                  <label className="grid gap-2">
                    <span className="text-xs font-medium tracking-wide">Key features</span>
                    <textarea
                      value={form.keyFeatures}
                      onChange={onChange('keyFeatures')}
                      rows={3}
                      className="w-full resize-none rounded-lg border border-brown-100/20 bg-brown-100/5 px-4 py-3 text-sm text-brown-100 outline-none placeholder:text-brown-100/50 focus:border-brown-100/60"
                      placeholder="Insulated, leak-proof, 750ml, BPA-free"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-xs font-medium tracking-wide">Target audience (optional)</span>
                    <input
                      value={form.targetAudience}
                      onChange={onChange('targetAudience')}
                      className="w-full rounded-lg border border-brown-100/20 bg-brown-100/5 px-4 py-3 text-sm text-brown-100 outline-none placeholder:text-brown-100/50 focus:border-brown-100/60"
                      placeholder="e.g., Gym-goers"
                    />
                  </label>
                </div>
              </div>

              <button
                type="button"
                className="mx-auto mt-8 inline-flex rounded-xl bg-brown-500 px-12 py-4 text-sm font-medium text-brown-100 shadow-sm transition-colors transition-transform active:opacity-90 enabled:hover:bg-brown-800 enabled:hover:scale-[1.03] active:scale-[1.01]"
                onClick={onGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating…' : 'Generate Description'}
              </button>

              {error ? (
                <p className="mx-auto mt-4 max-w-2xl text-center text-xs text-brown-100/90">
                  {error}
                </p>
              ) : null}
            </div>
          )}

          <p className="mt-16 text-xs text-brown-600 md:text-sm">
            Fill what you know — Prodzy handles the rest...
          </p>
        </div>

        <section
          ref={aboutRef}
          id="about-us"
          className="mx-auto mt-16 w-full max-w-7xl rounded-2xl border border-brown-200/70 bg-brown-100 p-6 text-left md:p-12"
        >
          <h2 className="text-center text-2xl font-light tracking-widest text-brown-700 md:text-3xl">
            ABOUT&nbsp;US
          </h2>

          <div className="mt-10 grid items-center gap-10 md:grid-cols-[1fr_auto_1fr]">
            <img src="/prodzy.png" alt="" className="mx-auto h-48 w-48 object-contain" />

            <div className="hidden h-44 w-px bg-brown-200 md:block" />

            <div className="text-sm leading-relaxed text-brown-700/85 md:text-base">
              <p>
                Prodzy is a backend-first AI tool built to generate reliable, category-aware product
                descriptions for e-commerce use cases.
              </p>
              <p className="mt-4">
                The system focuses on prompt control, output consistency, and lightweight quality
                evaluation rather than heavy UI complexity.
              </p>
              <p className="mt-4">
                It works well even with partial product information and provides transparent feedback
                so you can quickly refine or regenerate.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-6 py-10 text-center text-xs text-brown-600 md:text-sm">
        <div className="mx-auto h-px w-full max-w-xl bg-brown-200/70" />
        <p className="mt-6">© {new Date().getFullYear()} Prodzy.AI — Built for fast, clean product copy.</p>
      </footer>
    </div>
  )
}
