import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Edges, Line } from '@react-three/drei'
import * as THREE from 'three'
import { wallComponents, WALL_HEIGHT, categoryColor, type WallComponentGroup, type WallComponentInstance } from '../../data/wallFrame'

const groupExplodeOrder: Record<WallComponentGroup, number> = {
  plates: 0,
  studs: 1,
  'door-opening': 2,
  'window-opening': 3,
  noggings: 4,
}

interface ComponentMeshProps {
  comp: WallComponentInstance
  selected: boolean
  hovered: boolean
  wrongMarked?: boolean
  visible: boolean
  explodePct: number
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
  showLabel: boolean
  measureMode?: boolean
  onMeasurePoint?: (point: THREE.Vector3) => void
}

function ComponentMesh({ comp, selected, hovered, wrongMarked, visible, explodePct, onSelect, onHover, showLabel, measureMode, onMeasurePoint }: ComponentMeshProps) {
  const ref = useRef<THREE.Mesh>(null)
  const [bx, by, bz] = comp.position

  const dirY = (by - WALL_HEIGHT / 2) >= 0 ? 1 : -1
  const explodeAmount = explodePct / 100
  const targetY = by + dirY * explodeAmount * 1.1
  const targetZ = bz + groupExplodeOrder[comp.group] * explodeAmount * 0.45
  const targetScale = visible ? 1 : 0.0001

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, targetY, 7, delta)
    ref.current.position.z = THREE.MathUtils.damp(ref.current.position.z, targetZ, 7, delta)
    const s = THREE.MathUtils.damp(ref.current.scale.x, targetScale, 8, delta)
    ref.current.scale.setScalar(s)
    ref.current.visible = s > 0.02
  })

  const color = wrongMarked ? '#eb5757' : selected ? '#ff7f32' : hovered ? '#ffb37a' : categoryColor[comp.category]
  const labelY = targetY + comp.size[1] / 2 + 0.18
  const swatch = wrongMarked ? '#eb5757' : categoryColor[comp.category]

  return (
    <group>
      <mesh
        ref={ref}
        position={[bx, by, bz]}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation()
          if (measureMode && onMeasurePoint) {
            onMeasurePoint(e.point.clone())
            return
          }
          onSelect(comp.id)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover(comp.id)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          onHover(null)
          document.body.style.cursor = 'auto'
        }}
      >
        <boxGeometry args={comp.size} />
        <meshStandardMaterial
          color={color}
          roughness={0.7}
          metalness={0.05}
          emissive={selected || wrongMarked ? color : '#000000'}
          emissiveIntensity={selected ? 0.35 : wrongMarked ? 0.5 : 0}
        />
        {visible && <Edges threshold={20} color={selected ? '#3a1c00' : '#00000090'} opacity={selected ? 0.5 : 0.4} transparent />}
      </mesh>
      {showLabel && visible && (
        <>
          <Line points={[[bx, targetY, targetZ], [bx, labelY - 0.03, targetZ]]} color={selected ? '#ff7f32' : '#5fa4d6'} lineWidth={1} transparent opacity={0.7} />
          <Html position={[bx, labelY, targetZ]} center distanceFactor={8} occlude={false}>
            <div className="pointer-events-none flex items-center gap-1.5 whitespace-nowrap rounded-sm border border-ink-600 bg-ink-900/95 px-2 py-1 text-[10px] font-medium text-paper-200 shadow-lg">
              <span className="h-1.5 w-1.5 shrink-0 rounded-[1px]" style={{ background: swatch }} />
              <span className="text-technical">{comp.name.toUpperCase()}</span>
            </div>
          </Html>
        </>
      )}
    </group>
  )
}

interface WallFrameModelProps {
  selectedId: string | null
  hoveredId: string | null
  wrongIds?: Set<string>
  hiddenIds: Set<string>
  isolatedId: string | null
  explodePct: number
  visibleGroups: Set<WallComponentGroup> | null
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
  measureMode?: boolean
  onMeasurePoint?: (point: THREE.Vector3) => void
  positionOverrides?: Record<string, [number, number, number]>
  sizeOverrides?: Record<string, [number, number, number]>
}

export function WallFrameModel({
  selectedId,
  hoveredId,
  wrongIds,
  hiddenIds,
  isolatedId,
  explodePct,
  visibleGroups,
  onSelect,
  onHover,
  measureMode,
  onMeasurePoint,
  positionOverrides,
  sizeOverrides,
}: WallFrameModelProps) {
  return (
    <group>
      {wallComponents.map((base) => {
        const comp = positionOverrides?.[base.id] || sizeOverrides?.[base.id]
          ? { ...base, position: positionOverrides?.[base.id] ?? base.position, size: sizeOverrides?.[base.id] ?? base.size }
          : base
        const groupOk = !visibleGroups || visibleGroups.has(comp.group)
        const isolateOk = !isolatedId || isolatedId === comp.id
        const visible = groupOk && isolateOk && !hiddenIds.has(comp.id)
        return (
          <ComponentMesh
            key={comp.id}
            comp={comp}
            selected={selectedId === comp.id}
            hovered={hoveredId === comp.id}
            wrongMarked={wrongIds?.has(comp.id)}
            visible={visible}
            explodePct={explodePct}
            onSelect={onSelect}
            onHover={onHover}
            showLabel={selectedId === comp.id || hoveredId === comp.id}
            measureMode={measureMode}
            onMeasurePoint={onMeasurePoint}
          />
        )
      })}
    </group>
  )
}
