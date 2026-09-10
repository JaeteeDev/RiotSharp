import type { CalculatorMeta } from '../types'

export const calculators: CalculatorMeta[] = [
  { id: 'diagonal-square', name: 'Diagonal / Square Check', category: 'set-out', description: 'Calculate the diagonal of a rectangle and understand why it confirms a frame is square.' },
  { id: 'three-four-five', name: '3-4-5 Trainer', category: 'set-out', description: 'Interactive right-triangle trainer for setting out square corners on site.' },
  { id: 'roof-pitch', name: 'Roof Pitch & Rafter Length', category: 'roofing', description: 'Step through rise, run, pitch and common rafter length together.' },
  { id: 'stair-calc', name: 'Stair Rise & Going', category: 'stairs', description: 'Work out riser height and number of risers/goings for a given total rise.' },
  { id: 'stud-quantity', name: 'Stud Quantity Estimator', category: 'framing', description: 'Estimate how many common studs a wall length needs at a chosen spacing.' },
  { id: 'sheet-quantity', name: 'Sheet Quantity Estimator', category: 'materials', description: 'Estimate full sheets required to line or clad an area.' },
  { id: 'concrete-volume', name: 'Concrete Volume', category: 'concrete', description: 'Calculate the volume of concrete needed for a simple footing or slab.' },
  { id: 'area-volume', name: 'Area & Volume', category: 'general', description: 'General-purpose rectangular area and volume calculator with working shown.' },
  { id: 'percentage-grade', name: 'Percentage / Fall Grade', category: 'general', description: 'Convert a rise-over-run into a percentage grade, useful for drainage falls.' },
]

export const calculatorById = (id: string) => calculators.find((c) => c.id === id)
