import { motion } from 'framer-motion'
import { AlertTriangle, Info, ShieldAlert, XCircle } from 'lucide-react'
import type { LessonBlock } from '../../types'
import { TechnicalDiagram } from './TechnicalDiagram'
import { MiniQuestionBlock } from './MiniQuestionBlock'

const calloutStyles = {
  info: { icon: Info, cls: 'border-blue-500/30 bg-blue-500/[0.05] text-blue-300' },
  warning: { icon: AlertTriangle, cls: 'border-warn-400/30 bg-warn-400/[0.06] text-warn-400' },
  safety: { icon: ShieldAlert, cls: 'border-bad-400/30 bg-bad-400/[0.06] text-bad-400' },
}

export function LessonBlockRenderer({ block, index }: { block: LessonBlock; index: number }) {
  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.4, delay: Math.min(index * 0.02, 0.15) },
  }

  switch (block.kind) {
    case 'text':
      return (
        <motion.div {...fadeIn}>
          {block.heading && <h3 className="font-display mb-2 text-[17px] font-semibold text-paper-100">{block.heading}</h3>}
          <p className="text-[14px] leading-[1.75] text-paper-300">{block.body}</p>
        </motion.div>
      )

    case 'callout': {
      const style = calloutStyles[block.tone]
      const Icon = style.icon
      return (
        <motion.div {...fadeIn} className={`flex gap-3 rounded-lg border px-4 py-3.5 ${style.cls}`}>
          <Icon className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <div className="text-[13px] font-semibold">{block.title}</div>
            <div className="mt-0.5 text-[13px] leading-relaxed opacity-90">{block.body}</div>
          </div>
        </motion.div>
      )
    }

    case 'terms':
      return (
        <motion.div {...fadeIn} className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {block.terms.map((t, i) => (
            <div key={i} className="rounded-md border border-ink-700 bg-ink-900/40 px-3.5 py-2.5">
              <div className="text-technical text-[11px] uppercase tracking-wide text-timber-400">{t.term}</div>
              <div className="mt-1 text-[12.5px] leading-relaxed text-mute-400">{t.definition}</div>
            </div>
          ))}
        </motion.div>
      )

    case 'list':
      return (
        <motion.div {...fadeIn}>
          {block.heading && <h4 className="mb-2.5 text-[13px] font-semibold text-paper-200">{block.heading}</h4>}
          {block.ordered ? (
            <ol className="flex flex-col gap-2">
              {block.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[13.5px] text-paper-300">
                  <span className="text-technical mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-signal-500/40 text-[10px] text-signal-400">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          ) : (
            <ul className="flex flex-col gap-2">
              {block.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-paper-300">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-timber-400" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      )

    case 'worked-example':
      return (
        <motion.div {...fadeIn} className="rounded-lg border border-timber-500/25 bg-timber-500/[0.04] p-5">
          <div className="text-technical mb-3 text-[10px] uppercase tracking-wide text-timber-400">Worked Example · {block.title}</div>
          <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1">
            {block.given.map((g, i) => (
              <span key={i} className="text-technical text-[12px] text-mute-400">{g}</span>
            ))}
          </div>
          <div className="flex flex-col gap-2 border-t border-ink-700 pt-3">
            {block.steps.map((s, i) => (
              <div key={i} className="flex gap-3 text-[13px]">
                <span className="w-40 shrink-0 text-mute-500">{s.label}</span>
                <span className="text-technical text-paper-200">{s.detail}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 border-t border-ink-700 pt-3 text-[14px] font-semibold text-signal-300">Result: {block.result}</div>
        </motion.div>
      )

    case 'mini-question':
      return (
        <motion.div {...fadeIn}>
          <MiniQuestionBlock question={block.question} />
        </motion.div>
      )

    case 'image-diagram':
      return (
        <motion.div {...fadeIn}>
          <TechnicalDiagram diagramId={block.diagramId} caption={block.caption} />
        </motion.div>
      )

    case 'mistakes':
      return (
        <motion.div {...fadeIn} className="flex flex-col gap-2.5">
          <div className="text-technical text-[10px] uppercase tracking-wide text-bad-400">Common Mistakes</div>
          {block.items.map((m, i) => (
            <div key={i} className="flex gap-3 rounded-md border border-bad-400/20 bg-bad-400/[0.04] px-3.5 py-3">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-bad-400" />
              <div>
                <div className="text-[13px] font-medium text-paper-200">{m.mistake}</div>
                <div className="mt-0.5 text-[12.5px] leading-relaxed text-mute-500">{m.why}</div>
              </div>
            </div>
          ))}
        </motion.div>
      )

    default:
      return null
  }
}
