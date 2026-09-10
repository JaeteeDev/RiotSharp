import { ExternalLink, Square } from 'lucide-react'
import { useBreadcrumb } from '../store/useUiStore'
import { Panel } from '../components/ui/Panel'
import { UNIT_SOURCE_NOTE } from '../data/units'

export function About() {
  useBreadcrumb(['About'])

  return (
    <div className="mx-auto max-w-[720px] px-8 py-10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-signal-500/40 bg-signal-500/10">
          <Square className="h-5 w-5 text-signal-400" strokeWidth={2.5} />
        </div>
        <div>
          <div className="font-display text-xl font-semibold tracking-wide text-paper-100">BUILDR</div>
          <div className="text-technical text-[11px] uppercase tracking-wide text-mute-500">CPC30220 Carpentry Training Companion</div>
        </div>
      </div>

      <Panel className="mt-7 p-6" title="What BUILDR Is">
        <p className="text-[13.5px] leading-relaxed text-paper-300">
          BUILDR is a private, personal study companion built for one apprentice carpenter completing CPC30220 Certificate III in Carpentry through TAFE Queensland. It's designed to help you
          learn terminology, understand construction methods, practise measurements and calculations, and revise for assessments — through interactive lessons, a 3D Workshop, calculators, quizzes and
          spaced-revision flashcards.
        </p>
      </Panel>

      <Panel className="mt-5 p-6" title="What BUILDR Is Not">
        <p className="text-[13.5px] leading-relaxed text-paper-300">
          BUILDR does not replace supervised workplace training, your RTO's formal assessment, or any licensing requirement. Completing lessons or quizzes here reflects <strong className="text-paper-100">learning progress</strong>,
          never <strong className="text-paper-100">formal competency</strong> — competency is only ever awarded by your RTO through its own assessment process.
        </p>
      </Panel>

      <Panel className="mt-5 p-6" title="Qualification Information">
        <p className="text-[13.5px] leading-relaxed text-paper-300">
          CPC30220 Certificate III in Carpentry is delivered under the CPC Construction, Plumbing and Services Training Package and requires 34 units of competency (27 core, 7 elective).
        </p>
        <p className="mt-3 text-[12px] leading-relaxed text-mute-500">{UNIT_SOURCE_NOTE}</p>
        <a href="https://training.gov.au" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] text-blue-400 hover:text-blue-300">
          training.gov.au <ExternalLink className="h-3 w-3" />
        </a>
      </Panel>

      <Panel className="mt-5 p-6" title="Safety & Accuracy">
        <p className="text-[13.5px] leading-relaxed text-paper-300">
          Where BUILDR discusses standards, regulations, span tables or structural sizing, it teaches general concepts only. Real Australian Standards, NCC requirements, engineering
          requirements and structural member sizes must always be confirmed from current, authoritative project documentation — never assumed from a general learning tool.
        </p>
      </Panel>

      <p className="mt-8 text-center text-[11px] text-mute-600">BUILDR · Private study companion · Data stored locally in this browser only</p>
    </div>
  )
}
