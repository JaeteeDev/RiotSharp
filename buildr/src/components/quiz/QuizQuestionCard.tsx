import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ArrowRight } from 'lucide-react'
import clsx from 'clsx'
import type { QuizQuestion } from '../../types'
import { checkAnswer } from '../../lib/quizEngine'

const typeLabel: Record<string, string> = {
  'multiple-choice': 'Multiple Choice',
  'multiple-select': 'Select All That Apply',
  'true-false': 'True / False',
  calculation: 'Calculation',
  'identify-component': 'Identify',
  'order-steps': 'Order The Steps',
  'match-terms': 'Match Terms',
}

export function QuizQuestionCard({ question, onAnswered }: { question: QuizQuestion; onAnswered: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<number[]>([])
  const [numeric, setNumeric] = useState('')
  const [order, setOrder] = useState<number[]>([])
  const [revealed, setRevealed] = useState(false)
  const [correct, setCorrect] = useState(false)

  function submit() {
    let response: { selectedIndices?: number[]; numericValue?: number; order?: number[] } = {}
    if (question.type === 'calculation') response.numericValue = Number(numeric)
    else if (question.type === 'order-steps') response.order = order
    else response.selectedIndices = selected

    const isCorrect = checkAnswer(question, response)
    setCorrect(isCorrect)
    setRevealed(true)
    onAnswered(isCorrect)
  }

  function toggleOption(i: number) {
    if (revealed) return
    if (question.type === 'multiple-select') {
      setSelected((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))
    } else {
      setSelected([i])
    }
  }

  function clickOrderItem(i: number) {
    if (revealed || order.includes(i)) return
    setOrder((prev) => [...prev, i])
  }

  const canSubmit =
    question.type === 'calculation'
      ? numeric.trim() !== ''
      : question.type === 'order-steps'
        ? order.length === (question.orderItems?.length ?? 0)
        : selected.length > 0

  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }} className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <span className="text-technical rounded-full border border-ink-600 px-2.5 py-0.5 text-[10px] uppercase tracking-wide text-mute-500">{typeLabel[question.type]}</span>
        <span className="text-technical text-[10px] uppercase tracking-wide text-blue-400">{question.topic}</span>
      </div>

      <p className="text-[17px] leading-relaxed text-paper-100">{question.prompt}</p>

      {(question.type === 'multiple-choice' || question.type === 'multiple-select' || question.type === 'true-false' || question.type === 'identify-component') && (
        <div className="flex flex-col gap-2">
          {question.options?.map((opt, i) => {
            const isCorrectOpt = question.type === 'multiple-select' ? question.correctIndices?.includes(i) : i === question.correctIndex
            const isSelected = selected.includes(i)
            return (
              <button
                key={i}
                disabled={revealed}
                onClick={() => toggleOption(i)}
                className={clsx(
                  'flex items-center justify-between rounded-[3px] border px-4 py-3 text-left text-[14px] transition-colors',
                  !revealed && isSelected && 'border-signal-400 bg-signal-500/10 text-paper-100',
                  !revealed && !isSelected && 'border-ink-600 text-paper-300 hover:border-ink-500',
                  revealed && isCorrectOpt && 'border-good-400/50 bg-good-400/10 text-good-400',
                  revealed && isSelected && !isCorrectOpt && 'border-bad-400/50 bg-bad-400/10 text-bad-400',
                  revealed && !isSelected && !isCorrectOpt && 'border-ink-700 text-mute-600',
                )}
              >
                {opt}
                {revealed && isCorrectOpt && <Check className="h-4 w-4" />}
                {revealed && isSelected && !isCorrectOpt && <X className="h-4 w-4" />}
              </button>
            )
          })}
        </div>
      )}

      {question.type === 'calculation' && (
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={numeric}
            disabled={revealed}
            onChange={(e) => setNumeric(e.target.value)}
            placeholder="Your answer"
            className="text-technical w-40 rounded-[3px] border border-ink-600 bg-ink-900 px-3 py-2.5 text-[15px] text-paper-100 outline-none focus:border-signal-400"
          />
          {question.numericUnit && <span className="text-technical text-[13px] text-mute-500">{question.numericUnit}</span>}
          {revealed && (
            <span className={clsx('text-technical text-[13px]', correct ? 'text-good-400' : 'text-bad-400')}>
              Correct answer: {question.numericAnswer} {question.numericUnit}
            </span>
          )}
        </div>
      )}

      {question.type === 'order-steps' && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            {question.orderItems?.map((item, i) => (
              <button
                key={i}
                disabled={revealed || order.includes(i)}
                onClick={() => clickOrderItem(i)}
                className={clsx(
                  'rounded-[3px] border px-3 py-2 text-[13px] transition-colors',
                  order.includes(i) ? 'border-ink-700 text-mute-600 line-through' : 'border-ink-600 text-paper-300 hover:border-signal-400',
                )}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="text-technical text-[11px] text-mute-500">Click each step in the order it should happen. Selected: {order.length}/{question.orderItems?.length}</div>
          {revealed && (
            <div className="mt-1 rounded-[3px] bg-ink-900/60 px-3 py-2 text-[12.5px] text-mute-400">
              Correct order: {question.correctOrder?.map((idx) => question.orderItems?.[idx]).join(' → ')}
            </div>
          )}
        </div>
      )}

      {!revealed ? (
        <button
          onClick={submit}
          disabled={!canSubmit}
          className="w-fit rounded-[3px] bg-signal-500 px-5 py-2.5 text-[13px] font-semibold text-ink-950 transition-colors hover:bg-signal-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Check Answer
        </button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={clsx('overflow-hidden rounded-[3px] border px-4 py-3.5', correct ? 'border-good-400/30 bg-good-400/5' : 'border-bad-400/30 bg-bad-400/5')}
          >
            <div className={clsx('flex items-center gap-2 text-[13px] font-semibold', correct ? 'text-good-400' : 'text-bad-400')}>
              {correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              {correct ? 'Correct' : 'Not quite'}
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-paper-300">{question.explanation}</p>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  )
}

export function NextButton({ onClick, isLast }: { onClick: () => void; isLast: boolean }) {
  return (
    <button onClick={onClick} className="flex w-fit items-center gap-2 rounded-[3px] border border-ink-500 px-5 py-2.5 text-[13px] font-medium text-paper-200 hover:border-signal-400 hover:text-signal-300">
      {isLast ? 'See Results' : 'Next Question'}
      <ArrowRight className="h-3.5 w-3.5" />
    </button>
  )
}
