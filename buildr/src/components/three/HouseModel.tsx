import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { HouseLayerId } from './houseLayers'

export type { HouseLayerId }

const TIMBER = '#c79f6a'
const TIMBER_DARK = '#8f6a3c'
const CONCRETE = '#5c636f'
const SIGNAL = '#ff7f32'
const GLASS = '#5fa4d6'

interface BeamProps {
  position: [number, number, number]
  size: [number, number, number]
  color?: string
  selected?: boolean
  dimmed?: boolean
  rotation?: [number, number, number]
}

function Beam({ position, size, color = TIMBER, selected, dimmed, rotation }: BeamProps) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={selected ? SIGNAL : color}
        roughness={0.75}
        metalness={0.05}
        transparent
        opacity={dimmed ? 0.12 : 1}
        emissive={selected ? SIGNAL : '#000000'}
        emissiveIntensity={selected ? 0.25 : 0}
      />
    </mesh>
  )
}

interface LayerGroupProps {
  order: number
  exploded: boolean
  children: React.ReactNode
}

function LayerGroup({ order, exploded, children }: LayerGroupProps) {
  const ref = useRef<THREE.Group>(null)
  const target = exploded ? order * 0.55 : 0
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, target, 6, delta)
  })
  return <group ref={ref}>{children}</group>
}

// Building envelope
const W = 6.2 // width (x)
const Dp = 4.4 // depth (z)
const WALL_H = 2.4
const FLOOR_T = 0.12
const STUMP_H = 0.55
const OVERHANG = 0.5
const RIDGE_HEIGHT = 1.55

interface HouseModelProps {
  selectedLayer: HouseLayerId | null
  exploded: boolean
  visibleLayers?: Set<HouseLayerId>
}

export function HouseModel({ selectedLayer, exploded, visibleLayers }: HouseModelProps) {
  const isVisible = (id: HouseLayerId) => !visibleLayers || visibleLayers.has(id)
  const isSel = (id: HouseLayerId) => selectedLayer === id
  const isDim = (id: HouseLayerId) => selectedLayer !== null && selectedLayer !== id

  const floorY = STUMP_H
  const wallBaseY = floorY + FLOOR_T
  const wallTopY = wallBaseY + WALL_H

  const stumpPositions = useMemo(() => {
    const xs = [-W / 2 + 0.3, 0, W / 2 - 0.3]
    const zs = [-Dp / 2 + 0.3, 0, Dp / 2 - 0.3]
    const pts: [number, number][] = []
    xs.forEach((x) => zs.forEach((z) => pts.push([x, z])))
    return pts
  }, [])

  const studCount = 9
  const studXs = useMemo(() => Array.from({ length: studCount }, (_, i) => -W / 2 + 0.25 + (i * (W - 0.5)) / (studCount - 1)), [])

  return (
    <group>
      {/* FOUNDATIONS */}
      {isVisible('foundations') && (
        <LayerGroup order={0} exploded={exploded}>
          {stumpPositions.map(([x, z], i) => (
            <Beam key={i} position={[x, STUMP_H / 2, z]} size={[0.18, STUMP_H, 0.18]} color={CONCRETE} selected={isSel('foundations')} dimmed={isDim('foundations')} />
          ))}
        </LayerGroup>
      )}

      {/* FLOOR */}
      {isVisible('floor') && (
        <LayerGroup order={1} exploded={exploded}>
          <Beam position={[0, floorY + 0.05, -Dp / 2 + 0.05]} size={[W, 0.1, 0.12]} selected={isSel('floor')} dimmed={isDim('floor')} />
          <Beam position={[0, floorY + 0.05, Dp / 2 - 0.05]} size={[W, 0.1, 0.12]} selected={isSel('floor')} dimmed={isDim('floor')} />
          {Array.from({ length: 8 }, (_, i) => -Dp / 2 + 0.25 + (i * (Dp - 0.5)) / 7).map((z, i) => (
            <Beam key={i} position={[0, floorY + 0.05, z]} size={[W, 0.1, 0.09]} selected={isSel('floor')} dimmed={isDim('floor')} />
          ))}
          <Beam position={[0, floorY + FLOOR_T, 0]} size={[W, 0.03, Dp]} color="#a88a63" selected={isSel('floor')} dimmed={isDim('floor')} />
        </LayerGroup>
      )}

      {/* WALLS */}
      {isVisible('walls') && (
        <LayerGroup order={2} exploded={exploded}>
          {/* front + back plates */}
          {[-Dp / 2, Dp / 2].map((z, wi) => (
            <group key={wi}>
              <Beam position={[0, wallBaseY + 0.05, z]} size={[W, 0.1, 0.1]} color={TIMBER_DARK} selected={isSel('walls')} dimmed={isDim('walls')} />
              <Beam position={[0, wallTopY - 0.05, z]} size={[W, 0.1, 0.1]} color={TIMBER_DARK} selected={isSel('walls')} dimmed={isDim('walls')} />
              {studXs.map((x, i) => {
                // skip a couple of studs on the front wall to suggest a door + window opening
                if (wi === 0 && (i === 3 || i === 4 || i === 6)) return null
                return <Beam key={i} position={[x, wallBaseY + WALL_H / 2, z]} size={[0.08, WALL_H - 0.2, 0.08]} selected={isSel('walls')} dimmed={isDim('walls')} />
              })}
            </group>
          ))}
          {/* left + right plates */}
          {[-W / 2, W / 2].map((x, wi) => (
            <group key={wi}>
              <Beam position={[x, wallBaseY + 0.05, 0]} size={[0.1, 0.1, Dp]} color={TIMBER_DARK} selected={isSel('walls')} dimmed={isDim('walls')} />
              <Beam position={[x, wallTopY - 0.05, 0]} size={[0.1, 0.1, Dp]} color={TIMBER_DARK} selected={isSel('walls')} dimmed={isDim('walls')} />
              {Array.from({ length: 6 }, (_, i) => -Dp / 2 + 0.25 + (i * (Dp - 0.5)) / 5).map((z, i) => (
                <Beam key={i} position={[x, wallBaseY + WALL_H / 2, z]} size={[0.08, WALL_H - 0.2, 0.08]} selected={isSel('walls')} dimmed={isDim('walls')} />
              ))}
            </group>
          ))}
        </LayerGroup>
      )}

      {/* OPENINGS (door + window dressing on front wall) */}
      {isVisible('openings') && (
        <LayerGroup order={3} exploded={exploded}>
          {/* door lintel + jambs, centred around stud index 3-4 */}
          <Beam position={[studXs[3] + (studXs[4] - studXs[3]) / 2, wallBaseY + 2.0, -Dp / 2]} size={[studXs[4] - studXs[3] + 0.16, 0.14, 0.12]} color={TIMBER_DARK} selected={isSel('openings')} dimmed={isDim('openings')} />
          <Beam position={[studXs[3], wallBaseY + 1.0, -Dp / 2]} size={[0.08, 2.0, 0.1]} selected={isSel('openings')} dimmed={isDim('openings')} />
          <Beam position={[studXs[4], wallBaseY + 1.0, -Dp / 2]} size={[0.08, 2.0, 0.1]} selected={isSel('openings')} dimmed={isDim('openings')} />
          {/* window glazing at stud index 6 */}
          <Beam position={[studXs[6], wallBaseY + 1.5, -Dp / 2]} size={[0.9, 1.0, 0.06]} color={GLASS} selected={isSel('openings')} dimmed={isDim('openings')} />
        </LayerGroup>
      )}

      {/* CEILING */}
      {isVisible('ceiling') && (
        <LayerGroup order={4} exploded={exploded}>
          {Array.from({ length: 8 }, (_, i) => -Dp / 2 + 0.25 + (i * (Dp - 0.5)) / 7).map((z, i) => (
            <Beam key={i} position={[0, wallTopY + 0.06, z]} size={[W - 0.2, 0.08, 0.07]} selected={isSel('ceiling')} dimmed={isDim('ceiling')} />
          ))}
        </LayerGroup>
      )}

      {/* ROOF (gable) */}
      {isVisible('roof') && (
        <LayerGroup order={5} exploded={exploded}>
          <Beam position={[0, wallTopY + RIDGE_HEIGHT, 0]} size={[W + OVERHANG, 0.14, 0.14]} color={TIMBER_DARK} selected={isSel('roof')} dimmed={isDim('roof')} />
          {Array.from({ length: 9 }, (_, i) => -Dp / 2 - OVERHANG * 0.3 + (i * (Dp + OVERHANG * 0.6)) / 8).map((z, i) => {
            const halfSpan = W / 2 + OVERHANG
            const rafterLen = Math.sqrt(halfSpan * halfSpan + RIDGE_HEIGHT * RIDGE_HEIGHT)
            const angle = Math.atan2(RIDGE_HEIGHT, halfSpan)
            return (
              <group key={i}>
                <Beam position={[-halfSpan / 2, wallTopY + RIDGE_HEIGHT / 2, z]} size={[rafterLen, 0.08, 0.09]} rotation={[0, 0, angle]} selected={isSel('roof')} dimmed={isDim('roof')} />
                <Beam position={[halfSpan / 2, wallTopY + RIDGE_HEIGHT / 2, z]} size={[rafterLen, 0.08, 0.09]} rotation={[0, 0, -angle]} selected={isSel('roof')} dimmed={isDim('roof')} />
              </group>
            )
          })}
          {/* roof planes */}
          {[1, -1].map((side) => {
            const halfSpan = W / 2 + OVERHANG
            const planeLen = Math.sqrt(halfSpan * halfSpan + RIDGE_HEIGHT * RIDGE_HEIGHT)
            const angle = Math.atan2(RIDGE_HEIGHT, halfSpan) * side
            return (
              <Beam
                key={side}
                position={[(side * halfSpan) / 2, wallTopY + RIDGE_HEIGHT / 2, 0]}
                size={[planeLen, 0.035, Dp + OVERHANG * 0.6]}
                rotation={[0, 0, -angle]}
                color="#3c3227"
                selected={isSel('roof')}
                dimmed={isDim('roof')}
              />
            )
          })}
        </LayerGroup>
      )}

      {/* EAVES */}
      {isVisible('eaves') && (
        <LayerGroup order={6} exploded={exploded}>
          {[-Dp / 2 - OVERHANG * 0.55, Dp / 2 + OVERHANG * 0.55].map((z, i) => (
            <Beam key={i} position={[0, wallTopY - 0.05, z]} size={[W + OVERHANG, 0.16, 0.05]} color={TIMBER_DARK} selected={isSel('eaves')} dimmed={isDim('eaves')} />
          ))}
        </LayerGroup>
      )}
    </group>
  )
}
