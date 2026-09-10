import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Crosshair, GraduationCap, ListChecks } from 'lucide-react'
import { wallComponentById, categoryInfo, wallGroupLabels } from '../../data/wallFrame'
import { glossary } from '../../data/glossary'

export function ComponentInspector({
  selectedId,
  isolatedId,
  hiddenIds,
  onIsolate,
  onToggleHide,
}: {
  selectedId: string | null
  isolatedId: string | null
  hiddenIds: Set<string>
  onIsolate: (id: string | null) => void
  onToggleHide: (id: string) => void
}) {
  const navigate = useNavigate()
  const comp = selectedId ? wallComponentById(selectedId) : undefined
  const info = comp ? categoryInfo[comp.category] : undefined

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      <div className="text-technical mb-3 text-[10px] uppercase tracking-wide text-mute-500">Selected Component</div>
      <AnimatePresence mode="wait">
        {comp && info ? (
          <motion.div key={comp.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="font-display text-lg font-semibold text-paper-100">{comp.name}</div>
            <div className="text-technical mt-1 text-[10px] uppercase tracking-wide text-signal-400">{wallGroupLabels[comp.group]}</div>

            <InfoRow label="Role">{info.role}</InfoRow>
            <InfoRow label="Typical Location">{info.typicalLocation}</InfoRow>
            <InfoRow label="Load / Function">{info.loadFunction}</InfoRow>
            <InfoRow label="Installation Concept">{info.installConcept}</InfoRow>
            <InfoRow label="Common Mistakes" tone="warn">{info.commonMistakes}</InfoRow>

            {info.relatedTermIds.length > 0 && (
              <div className="mt-4">
                <div className="text-technical mb-1.5 text-[10px] uppercase tracking-wide text-mute-500">Related Terms</div>
                <div className="flex flex-wrap gap-1.5">
                  {info.relatedTermIds.map((id) => {
                    const term = glossary.find((g) => g.id === id)
                    if (!term) return null
                    return (
                      <button
                        key={id}
                        onClick={() => navigate(`/reference/term/${id}`)}
                        className="rounded-full border border-ink-600 px-2.5 py-1 text-[11px] text-paper-300 hover:border-blue-500/50 hover:text-blue-300"
                      >
                        {term.term}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="mt-5 grid grid-cols-2 gap-2">
              <ActionButton icon={<Crosshair className="h-3.5 w-3.5" />} label={isolatedId === comp.id ? 'Un-isolate' : 'Isolate'} onClick={() => onIsolate(isolatedId === comp.id ? null : comp.id)} />
              <ActionButton
                icon={hiddenIds.has(comp.id) ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                label={hiddenIds.has(comp.id) ? 'Show' : 'Hide'}
                onClick={() => onToggleHide(comp.id)}
              />
              <ActionButton icon={<GraduationCap className="h-3.5 w-3.5" />} label="Learn" onClick={() => navigate('/course/lesson/lesson-wall-framing')} />
              <ActionButton icon={<ListChecks className="h-3.5 w-3.5" />} label="Quiz Me" onClick={() => navigate('/quiz/session/topic', { state: { topic: 'Wall Framing' } })} />
            </div>
          </motion.div>
        ) : (
          <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[13px] leading-relaxed text-mute-500">
            Click any part of the wall frame — or an item in the model tree — to inspect it here.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function InfoRow({ label, children, tone }: { label: string; children: string; tone?: 'warn' }) {
  return (
    <div className="mt-3.5 border-t border-ink-700 pt-3">
      <div className={`text-technical mb-1 text-[10px] uppercase tracking-wide ${tone === 'warn' ? 'text-warn-400' : 'text-mute-500'}`}>{label}</div>
      <p className="text-[12.5px] leading-relaxed text-paper-300">{children}</p>
    </div>
  )
}

function ActionButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-1.5 rounded-md border border-ink-600 px-2.5 py-2 text-[11.5px] font-medium text-paper-300 transition-colors hover:border-signal-400 hover:text-signal-300"
    >
      {icon}
      {label}
    </button>
  )
}
