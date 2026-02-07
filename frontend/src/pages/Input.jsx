
export default function Input() {
  const title = 'Prodzy.AI'
  const durationMs = 5200
  const stepMs = 240

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

          <button
            type="button"
            className="mt-12 inline-flex rounded-xl bg-[#6B4A3A] px-10 py-5 text-sm font-medium text-[#F5E8D7] shadow-sm hover:opacity-95 active:opacity-90 md:px-14 md:py-6"
            onClick={() => {}}
          >
            <span className="leading-tight">
              <span className="block text-xs">fill the</span>
              <span className="block text-base md:text-lg">Product Details Form</span>
            </span>
          </button>

          <p className="mt-16 text-xs text-[#9A7A66] md:text-sm">
            Fill what you know — Prodzy handles the rest...
          </p>
        </div>
      </main>
    </div>
  )
}
