import { Route, Routes } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

import Input from './pages/Input.jsx'
import Result from './pages/Result.jsx'

export default function App() {
  const durationMs = 4000
  const [showWelcome, setShowWelcome] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!showWelcome) return

    let rafId = 0
    const start = performance.now()

    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs)
      setProgress(Math.round(t * 100))
      if (t >= 1) {
        setShowWelcome(false)
        return
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [showWelcome])

  const welcome = useMemo(() => {
    const barPct = `${progress}%`
    return (
      <div className="min-h-screen bg-brown-100 text-brown-700">
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6 opacity-70">
          <div className="h-10 w-20" />
          <div className="h-6 w-24" />
        </header>

        <main className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-6 pb-16 text-center">

          <img src="/prodzy.png" alt="" className="h-40 w-40 object-contain" />
          <div className="mt-6 text-sm font-medium tracking-wide text-brown-700/80 md:text-base">
            Prodzy.AI - Product Description Generator
          </div>

          <div className="mt-8 w-full max-w-xl">
            <div className="h-3 w-full rounded-full bg-brown-200/55">
              <div
                className="h-3 rounded-full bg-brown-500"
                style={{ width: barPct }}
              />
            </div>

            <div className="mt-4 text-sm font-medium tracking-wide text-brown-700/80">
              Loading… {progress}%
            </div>
          </div>
        </main>
      </div>
    )
  }, [progress])

  if (showWelcome) return welcome

  return (
    <Routes>
      <Route path="/" element={<Input />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  )
}
