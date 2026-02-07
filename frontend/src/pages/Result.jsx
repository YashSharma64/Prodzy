import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Result() {
  const navigate = useNavigate()
  const location = useLocation()

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

  const checks = useMemo(() => {
    return (
      location.state?.checks || [
        { status: 'ok', label: 'Length', text: 'Within recommended range' },
        { status: 'ok', label: 'Tone', text: 'Matches electronics category' },
        { status: 'warn', label: 'Missing Info', text: 'Battery life' },
      ]
    )
  }, [location.state])

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(description)
    } catch {
      // ignore
    }
  }

  const onRegenerate = () => {
    setDescription((prev) => prev)
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

        <section className="mx-auto mt-8 w-full max-w-4xl rounded-2xl border border-[#C9AA8C] bg-[#F5E8D7] p-6 md:p-10">
          <div className="whitespace-pre-line text-base leading-relaxed md:text-lg">
            {description}
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={onCopy}
              className="inline-flex rounded-xl bg-[#6B4A3A] px-8 py-3 text-sm font-medium text-[#F5E8D7] shadow-sm hover:opacity-95 active:opacity-90"
            >
              Copy
            </button>
            <button
              type="button"
              onClick={onRegenerate}
              className="inline-flex rounded-xl border border-[#6B4A3A] bg-transparent px-8 py-3 text-sm font-medium text-[#6B4A3A] shadow-sm hover:bg-[#6B4A3A]/5 active:opacity-90"
            >
              Regenerate
            </button>
          </div>
        </section>

        <section className="mx-auto mt-10 w-full max-w-4xl">
          <h2 className="text-xl font-medium tracking-wide">Quality Check</h2>

          <div className="mt-4 rounded-2xl border border-[#C9AA8C] bg-[#F5E8D7] p-6 md:p-8">
            <div className="grid gap-3 text-sm md:text-base">
              {checks.map((c) => (
                <div key={c.label} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5">{c.status === 'ok' ? '✅' : '⚠'}</div>
                  <div>
                    <span className="font-medium">{c.label}:</span> {c.text}
                  </div>
                </div>
              ))}
            </div>
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
