import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calculator as CalcIcon } from 'lucide-react'
import { calculators } from '../data/calculators'
import { useBreadcrumb } from '../store/useUiStore'
import { DiagonalSquareCalculator } from '../components/calculators/DiagonalSquareCalculator'
import { ThreeFourFiveCalculator } from '../components/calculators/ThreeFourFiveCalculator'
import { RoofPitchCalculator } from '../components/calculators/RoofPitchCalculator'
import { StairCalculator } from '../components/calculators/StairCalculator'
import {
  StudQuantityCalculator,
  SheetQuantityCalculator,
  ConcreteVolumeCalculator,
  AreaVolumeCalculator,
  PercentageGradeCalculator,
} from '../components/calculators/SimpleCalculators'

const registry: Record<string, React.ComponentType> = {
  'diagonal-square': DiagonalSquareCalculator,
  'three-four-five': ThreeFourFiveCalculator,
  'roof-pitch': RoofPitchCalculator,
  'stair-calc': StairCalculator,
  'stud-quantity': StudQuantityCalculator,
  'sheet-quantity': SheetQuantityCalculator,
  'concrete-volume': ConcreteVolumeCalculator,
  'area-volume': AreaVolumeCalculator,
  'percentage-grade': PercentageGradeCalculator,
}

const categoryLabels: Record<string, string> = {
  general: 'General',
  roofing: 'Roofing',
  framing: 'Framing',
  stairs: 'Stairs',
  concrete: 'Concrete',
  materials: 'Materials',
  'set-out': 'Set-Out',
}

export function Calculators() {
  const { calcId } = useParams()
  const navigate = useNavigate()
  const calc = calcId ? calculators.find((c) => c.id === calcId) : undefined
  const Component = calcId ? registry[calcId] : undefined

  useBreadcrumb(['Calculators', calc?.name ?? ''])

  if (calc && Component) {
    return (
      <div className="mx-auto max-w-[1200px] px-8 py-8">
        <button onClick={() => navigate('/calculators')} className="mb-4 flex items-center gap-1.5 text-[12.5px] text-mute-500 hover:text-paper-200">
          <ArrowLeft className="h-3.5 w-3.5" />
          All Calculators
        </button>
        <h1 className="font-display text-2xl font-semibold text-paper-100">{calc.name}</h1>
        <p className="mt-1 mb-6 text-[13px] text-mute-400">{calc.description}</p>
        <Component />
      </div>
    )
  }

  const grouped = calculators.reduce<Record<string, typeof calculators>>((acc, c) => {
    acc[c.category] = acc[c.category] || []
    acc[c.category].push(c)
    return acc
  }, {})

  return (
    <div className="mx-auto max-w-[1200px] px-8 py-8">
      <h1 className="font-display text-2xl font-semibold text-paper-100">Calculator Centre</h1>
      <p className="mt-1 text-[13px] text-mute-400">Every calculator shows its diagram, formula and full working — never just a number.</p>

      <div className="mt-8 flex flex-col gap-8">
        {Object.entries(grouped).map(([category, list]) => (
          <div key={category}>
            <h2 className="text-technical mb-3 text-[11px] uppercase tracking-wide text-mute-500">{categoryLabels[category] ?? category}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((c, i) => (
                <motion.button
                  key={c.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -2 }}
                  onClick={() => navigate(`/calculators/${c.id}`)}
                  className="flex flex-col items-start gap-2 rounded-lg border border-ink-600 bg-ink-850/50 p-4 text-left transition-colors hover:border-blue-500/40"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md border border-blue-500/30 bg-blue-500/10 text-blue-300">
                    <CalcIcon className="h-4 w-4" />
                  </div>
                  <div className="text-[13.5px] font-medium text-paper-100">{c.name}</div>
                  <p className="text-[12px] leading-relaxed text-mute-500">{c.description}</p>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
