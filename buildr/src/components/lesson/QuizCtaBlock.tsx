import { useNavigate } from 'react-router-dom'
import { ClipboardCheck, ArrowRight } from 'lucide-react'

export function QuizCtaBlock({ label, description, learningAreaId }: { label: string; description: string; learningAreaId: string }) {
  const navigate = useNavigate()
  return (
    <div className="corner-ticks relative flex flex-col items-center gap-3 rounded-[3px] border border-signal-500/30 bg-signal-500/[0.05] px-6 py-8 text-center">
      <ClipboardCheck className="h-6 w-6 text-signal-400" strokeWidth={1.5} />
      <div className="text-technical text-[10px] uppercase tracking-[0.16em] text-signal-300">{label}</div>
      <p className="max-w-sm text-[13px] leading-relaxed text-mute-400">{description}</p>
      <button
        onClick={() => navigate('/quiz/session/unit', { state: { learningAreaId } })}
        className="mt-2 flex items-center gap-2 rounded-[3px] bg-signal-500 px-5 py-2.5 text-[13px] font-semibold text-ink-950 transition-colors hover:bg-signal-400"
      >
        Start Wall Framing Quiz
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
