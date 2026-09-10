import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Hammer } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

const screens = [
  { kicker: 'BUILDR', title: 'MASTER THE TRADE.\nUNDERSTAND THE WHY.', body: 'A private study companion for your CPC30220 Certificate III in Carpentry apprenticeship through TAFE Queensland.' },
  { kicker: '01', title: 'LEARN IT.', body: 'Interactive lessons and construction models covering measurement, plans, set-out, framing and roofing.' },
  { kicker: '02', title: 'BUILD IT.', body: 'Explore walls, floors and roofs inside a working 3D Workshop — inspect, explode and reassemble real framing systems.' },
  { kicker: '03', title: 'PROVE IT.', body: 'Quizzes, calculations and spaced revision that surface exactly where you\'re strong, and where you need another pass.' },
]

export function Onboarding() {
  const [index, setIndex] = useState(0)
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)
  const isLast = index === screens.length - 1
  const screen = screens[index]

  return (
    <div className="drafting-field relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden px-6">
      <button
        onClick={completeOnboarding}
        className="absolute right-6 top-6 text-technical text-[11px] uppercase tracking-[0.14em] text-mute-500 transition-colors hover:text-paper-200"
      >
        Skip
      </button>

      <div className="flex w-full max-w-2xl flex-col items-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-5"
          >
            <span className="text-technical text-[12px] uppercase tracking-[0.3em] text-signal-400">{screen.kicker}</span>
            <h1 className="font-display whitespace-pre-line text-[44px] font-semibold leading-[1.05] tracking-tight text-paper-100">
              {screen.title}
            </h1>
            <p className="max-w-md text-[15px] leading-relaxed text-mute-400">{screen.body}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex items-center gap-2">
          {screens.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="group flex h-6 items-center"
              aria-label={`Go to screen ${i + 1}`}
            >
              <span className={`h-[3px] rounded-full transition-all duration-300 ${i === index ? 'w-7 bg-signal-400' : 'w-3 bg-ink-500 group-hover:bg-ink-400'}`} />
            </button>
          ))}
        </div>

        <div className="mt-10">
          {!isLast ? (
            <button
              onClick={() => setIndex((i) => i + 1)}
              className="flex items-center gap-2 rounded-[3px] border border-ink-500 px-5 py-2.5 text-sm font-medium text-paper-200 transition-colors hover:border-signal-400 hover:text-signal-300"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <motion.button
              onClick={completeOnboarding}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="flex items-center gap-2.5 rounded-[3px] bg-signal-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink-950 shadow-lg shadow-signal-500/20 transition-colors hover:bg-signal-400"
            >
              <Hammer className="h-4 w-4" />
              Enter Workshop
            </motion.button>
          )}
        </div>
      </div>

      <p className="absolute bottom-6 max-w-lg text-center text-[11px] leading-relaxed text-mute-600">
        BUILDR is a study companion. It does not replace supervised workplace training, your RTO's assessment, or licensing requirements.
      </p>
    </div>
  )
}
