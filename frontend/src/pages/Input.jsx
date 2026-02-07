
export default function Input() {
  return (
    <div className="min-h-screen bg-[#F5E8D7] text-[#7B5A48]">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <div className="text-xs tracking-widest">LOGO</div>
        <button
          type="button"
          className="text-xs tracking-widest hover:opacity-80"
        >
          ABOUT US
        </button>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col items-center px-6 pt-10 text-center">
        <h1 className="text-5xl font-light tracking-wide">Prodzy.AI</h1>
        <p className="mt-4 text-sm tracking-wide">AI Product Description Generator</p>

        <p className="mt-6 max-w-2xl text-lg font-light">
          Category-aware descriptions powered by LLMs
        </p>

        <div className="mt-3 h-px w-96 max-w-full bg-[#C9AA8C]" />

        <button
          type="button"
          className="mt-10 rounded-xl bg-[#6B4A3A] px-10 py-5 text-sm font-medium text-[#F5E8D7] shadow-sm hover:opacity-95 active:opacity-90"
          onClick={() => {}}
        >
          <div className="leading-tight">
            <div className="text-xs">fill the</div>
            <div className="text-base">Product Details Form</div>
          </div>
        </button>

        <p className="mt-20 text-xs text-[#9A7A66]">
          Fill what you know — Prodzy handles the rest...
        </p>
      </main>
    </div>
  )
}
