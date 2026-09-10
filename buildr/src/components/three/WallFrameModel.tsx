import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { wallComponents, WALL_HEIGHT, type WallComponentGroup, type WallComponentInstance } from '../../data/wallFrame'

const categoryColor: Record<string, string> = {
  'top-plate': '#8f6a3c',
  'bottom-plate': '#8f6a3c',
  'common-stud': '#c79f6a',
  'end-stud': '#c79f6a',
  'jamb-stud': '#d8b989',
  lintel: '#e0a15c',
  trimmer: '#d8b989',
  'cripple-stud': '#cdb384',
  nogging: '#b3854e',
}

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
      </mesh>
      {showLabel && visible && (
        <Html position={[bx, targetY + comp.size[1] / 2 + 0.12, targetZ]} center distanceFactor={8} occlude={false}>
          <div className="pointer-events-none whitespace-nowrap rounded border border-signal-400/60 bg-ink-900/95 px-2 py-1 text-[10px] font-medium text-signal-200 shadow-lg">
            {comp.name}
          </div>
        </Html>
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
