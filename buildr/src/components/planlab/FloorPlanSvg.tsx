interface FloorPlanSvgProps {
  showDimensions: boolean
  showAnnotations: boolean
  highlightId: string | null
  onPartClick: (id: string) => void
}

// A simple, geometrically-consistent single-storey floor plan drawn at a
// notional 1:100 scale (1 drawing unit here ≈ 10 mm real-world).
export function FloorPlanSvg({ showDimensions, showAnnotations, highlightId, onPartClick }: FloorPlanSvgProps) {
  const stroke = (id: string, base = 'var(--color-paper-300)') => (highlightId === id ? 'var(--color-signal-400)' : base)
  const fillTarget = (id: string) => (highlightId === id ? 'var(--color-signal-500)' : 'transparent')

  return (
    <svg viewBox="0 0 900 640" className="w-full select-none" style={{ minWidth: 900 }}>
      <rect width="900" height="640" fill="var(--color-ink-950)" />
      {/* faint grid */}
      {Array.from({ length: 19 }, (_, i) => (
        <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={640} stroke="var(--color-ink-800)" strokeWidth="1" />
      ))}
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 50} x2={900} y2={i * 50} stroke="var(--color-ink-800)" strokeWidth="1" />
      ))}

      {/* Outer walls */}
      <rect
        x="120" y="80" width="600" height="420" fill="none"
        stroke={stroke('outer-wall')} strokeWidth="6"
        onClick={() => onPartClick('outer-wall')}
        className="cursor-pointer"
      />
      <rect x="120" y="80" width="600" height="420" fill={fillTarget('outer-wall')} fillOpacity="0.06" />

      {/* Internal walls */}
      <line x1="380" y1="80" x2="380" y2="320" stroke={stroke('wall-bed1')} strokeWidth="4" onClick={() => onPartClick('wall-bed1')} className="cursor-pointer" />
      <line x1="380" y1="320" x2="720" y2="320" stroke={stroke('wall-bed1')} strokeWidth="4" onClick={() => onPartClick('wall-bed1')} className="cursor-pointer" />
      <line x1="560" y1="80" x2="560" y2="320" stroke={stroke('wall-bath')} strokeWidth="4" onClick={() => onPartClick('wall-bath')} className="cursor-pointer" />

      {/* Door opening symbol (living to hallway) */}
      <path d="M 380 250 A 40 40 0 0 1 420 290" fill="none" stroke={stroke('door-1')} strokeWidth="1.5" onClick={() => onPartClick('door-1')} className="cursor-pointer" />

      {/* Window on front facade */}
      <rect x="220" y="77" width="90" height="6" fill={stroke('window-1', 'var(--color-blue-400)')} onClick={() => onPartClick('window-1')} className="cursor-pointer" />

      {/* North point */}
      <g transform="translate(800,120)" onClick={() => onPartClick('north-point')} className="cursor-pointer">
        <circle r="26" fill="none" stroke={stroke('north-point', 'var(--color-mute-400)')} strokeWidth="1.5" />
        <path d="M0 -20 L7 8 L0 2 L-7 8 Z" fill={stroke('north-point', 'var(--color-mute-400)')} />
        <text y="38" textAnchor="middle" fontSize="10" className="text-technical" fill="var(--color-mute-500)">N</text>
      </g>

      {/* Section marker */}
      {showAnnotations && (
        <g transform="translate(420,80)" onClick={() => onPartClick('section-marker')} className="cursor-pointer">
          <circle r="12" fill="none" stroke={stroke('section-marker', 'var(--color-signal-400)')} strokeWidth="1.5" />
          <text textAnchor="middle" dy="4" fontSize="10" className="text-technical" fill="var(--color-signal-400)">A</text>
          <line x1="0" y1="12" x2="0" y2="40" stroke="var(--color-signal-400)" strokeWidth="1" strokeDasharray="3 2" />
        </g>
      )}

      {/* Room labels */}
      <text x="250" y="200" fontSize="13" className="text-technical" fill="var(--color-mute-400)">BEDROOM 1</text>
      <text x="440" y="200" fontSize="13" className="text-technical" fill="var(--color-mute-400)">LIVING</text>
      <text x="600" y="200" fontSize="13" className="text-technical" fill="var(--color-mute-400)">BATH</text>
      <text x="440" y="400" fontSize="13" className="text-technical" fill="var(--color-mute-400)">KITCHEN</text>

      {/* Dimensions */}
      {showDimensions && (
        <g onClick={() => onPartClick('dim-front')} className="cursor-pointer">
          <line x1="120" y1="55" x2="720" y2="55" stroke={stroke('dim-front', 'var(--color-blue-300)')} strokeWidth="1" />
          <line x1="120" y1="48" x2="120" y2="62" stroke="var(--color-blue-300)" strokeWidth="1" />
          <line x1="720" y1="48" x2="720" y2="62" stroke="var(--color-blue-300)" strokeWidth="1" />
          <text x="420" y="45" textAnchor="middle" fontSize="12" className="text-technical" fill={stroke('dim-front', 'var(--color-blue-300)')}>6000 mm</text>
        </g>
      )}
      {showDimensions && (
        <g onClick={() => onPartClick('dim-side')} className="cursor-pointer">
          <line x1="95" y1="80" x2="95" y2="500" stroke={stroke('dim-side', 'var(--color-blue-300)')} strokeWidth="1" />
          <line x1="88" y1="80" x2="102" y2="80" stroke="var(--color-blue-300)" strokeWidth="1" />
          <line x1="88" y1="500" x2="102" y2="500" stroke="var(--color-blue-300)" strokeWidth="1" />
          <text x="80" y="290" textAnchor="middle" fontSize="12" className="text-technical" fill={stroke('dim-side', 'var(--color-blue-300)')} transform="rotate(-90 80 290)">4200 mm</text>
        </g>
      )}
      {showDimensions && (
        <g onClick={() => onPartClick('dim-window')} className="cursor-pointer">
          <line x1="220" y1="65" x2="310" y2="65" stroke={stroke('dim-window', 'var(--color-blue-300)')} strokeWidth="1" />
          <text x="265" y="60" textAnchor="middle" fontSize="10" className="text-technical" fill={stroke('dim-window', 'var(--color-blue-300)')}>900 mm</text>
        </g>
      )}

      {/* Scale note */}
      <text x="120" y="560" fontSize="12" className="text-technical cursor-pointer" fill="var(--color-mute-500)" onClick={() => onPartClick('scale-note')}>
        SCALE 1 : 100
      </text>
      <text x="120" y="580" fontSize="10" className="text-technical" fill="var(--color-mute-600)">DRAWING — FLOOR PLAN — GROUND FLOOR (ILLUSTRATIVE)</text>
    </svg>
  )
}
