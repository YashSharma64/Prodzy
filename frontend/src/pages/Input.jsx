
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Input() {
  const title = 'Prodzy.AI'
  const durationMs = 5200
  const stepMs = 240

  const navigate = useNavigate()

  const [showForm, setShowForm] = useState(false)
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

  useEffect(() => {
    if (!showForm) return
    if (!formRef.current) return

    formRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [showForm])

  const onGenerate = () => {
    const name = form.productName?.trim() || 'Your product'
    const category = form.category?.trim() || 'your category'
    const features = form.keyFeatures?.trim()

    const description = `${name} is a premium product in ${category} designed for people who value quality and comfort. ${
      features ? `Key highlights include: ${features}.` : ''
    }`

    navigate('/result', {
      state: {
        description,
        checks: [
          { status: 'ok', label: 'Length', text: 'Within recommended range' },
          { status: 'ok', label: 'Tone', text: `Matches ${category} category` },
          { status: 'warn', label: 'Missing Info', text: 'Add a key spec (e.g., battery life)' },
        ],
      },
    })
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

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="w-full max-w-3xl py-10 md:py-16">
          <h1 className="text-4xl font-light tracking-wide sm:text-5xl md:text-9xl" aria-label={title}>
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

          <div className="mx-auto mt-5 h-px w-full max-w-xl bg-[#C9AA8C]" />

          {!showForm ? (
            <button
              type="button"
              className="mt-12 inline-flex rounded-xl bg-[#6B4A3A] px-10 py-5 text-sm font-medium text-[#F5E8D7] shadow-sm hover:opacity-95 active:opacity-90 md:px-14 md:py-6"
              onClick={() => setShowForm(true)}
            >
              <span className="leading-tight">
                <span className="block text-xs">fill the</span>
                <span className="block text-base md:text-lg">Product Details Form</span>
              </span>
            </button>
          ) : (
            <div className="mt-10">
              <div ref={formRef} className="mx-auto w-full max-w-3xl scroll-mt-24 rounded-2xl bg-[#6B4A3A] px-6 py-8 text-left text-[#F5E8D7] shadow-sm md:px-10 md:py-10">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h2 className="text-base font-medium tracking-wide">
                      Product Details
                    </h2>
                    <p className="mt-1 text-xs text-[#F5E8D7]/80">
                      Fill what you know. Keep it short.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="text-xs tracking-wide text-[#F5E8D7]/90 hover:text-[#F5E8D7]"
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
                      className="w-full rounded-lg border border-[#F5E8D7]/20 bg-[#F5E8D7]/5 px-4 py-3 text-sm outline-none placeholder:text-[#F5E8D7]/50 focus:border-[#F5E8D7]/60"
                      placeholder="e.g., Aurora Stainless Steel Water Bottle"
                    />
                  </label>

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-xs font-medium tracking-wide">Category</span>
                      <input
                        value={form.category}
                        onChange={onChange('category')}
                        className="w-full rounded-lg border border-[#F5E8D7]/20 bg-[#F5E8D7]/5 px-4 py-3 text-sm outline-none placeholder:text-[#F5E8D7]/50 focus:border-[#F5E8D7]/60"
                        placeholder="e.g., Drinkware"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-xs font-medium tracking-wide">Brand / Price (optional)</span>
                      <input
                        value={form.brandOrPrice}
                        onChange={onChange('brandOrPrice')}
                        className="w-full rounded-lg border border-[#F5E8D7]/20 bg-[#F5E8D7]/5 px-4 py-3 text-sm outline-none placeholder:text-[#F5E8D7]/50 focus:border-[#F5E8D7]/60"
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
                      className="w-full resize-none rounded-lg border border-[#F5E8D7]/20 bg-[#F5E8D7]/5 px-4 py-3 text-sm outline-none placeholder:text-[#F5E8D7]/50 focus:border-[#F5E8D7]/60"
                      placeholder="Insulated, leak-proof, 750ml, BPA-free"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-xs font-medium tracking-wide">Target audience (optional)</span>
                    <input
                      value={form.targetAudience}
                      onChange={onChange('targetAudience')}
                      className="w-full rounded-lg border border-[#F5E8D7]/20 bg-[#F5E8D7]/5 px-4 py-3 text-sm outline-none placeholder:text-[#F5E8D7]/50 focus:border-[#F5E8D7]/60"
                      placeholder="e.g., Gym-goers"
                    />
                  </label>
                </div>
              </div>

              <button
                type="button"
                className="mx-auto mt-6 inline-flex rounded-xl bg-[#B88A65] px-10 py-4 text-sm font-medium text-[#F5E8D7] shadow-sm hover:opacity-95 active:opacity-90"
                onClick={onGenerate}
              >
                Generate Description
              </button>
            </div>
          )}

          <p className="mt-16 text-xs text-[#9A7A66] md:text-sm">
            Fill what you know — Prodzy handles the rest...
          </p>
        </div>
      </main>
    </div>
  )
}
