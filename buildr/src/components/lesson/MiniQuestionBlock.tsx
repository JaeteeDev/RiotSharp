import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, HelpCircle } from 'lucide-react'
import clsx from 'clsx'
import type { MiniQuestion } from '../../types'

export function MiniQuestionBlock({ question, onAnswered }: { question: MiniQuestion; onAnswered?: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null)

  function choose(i: number) {
    setSelected(i)
    onAnswered?.(i === question.correctIndex)
  }

  return (
    <div className="rounded-[3px] border border-blue-500/25 bg-blue-500/[0.04] p-5">
      <div className="mb-3 flex items-center gap-2 text-blue-300">
        <HelpCircle className="h-4 w-4" />
        <span className="text-technical text-[10px] uppercase tracking-wide">Check your understanding</span>
      </div>
      <p className="text-[14px] text-paper-200">{question.prompt}</p>
      <div className="mt-3.5 flex flex-col gap-2">
        {question.options.map((opt, i) => {
          const isCorrect = i === question.correctIndex
          const isSelected = i === selected
          const revealed = selected !== null
          return (
            <button
              key={i}
              disabled={revealed}
              onClick={() => choose(i)}
              className={clsx(
                'flex items-center justify-between rounded-[3px] border px-3.5 py-2.5 text-left text-[13px] transition-colors',
                !revealed && 'border-ink-600 text-paper-300 hover:border-blue-500/40 hover:bg-blue-500/5',
                revealed && isCorrect && 'border-good-400/50 bg-good-400/10 text-good-400',
                revealed && isSelected && !isCorrect && 'border-bad-400/50 bg-bad-400/10 text-bad-400',
                revealed && !isSelected && !isCorrect && 'border-ink-700 text-mute-600',
              )}
            >
              {opt}
              {revealed && isCorrect && <Check className="h-4 w-4" />}
              {revealed && isSelected && !isCorrect && <X className="h-4 w-4" />}
            </button>
          )
        })}
      </div>
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3.5 overflow-hidden rounded-[3px] bg-ink-900/60 px-3.5 py-3 text-[12.5px] leading-relaxed text-mute-400"
          >
            {question.explanation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
