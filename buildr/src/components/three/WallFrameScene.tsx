import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, ContactShadows, PerspectiveCamera, Line, Html } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { WallFrameModel } from './WallFrameModel'
import type { WallComponentGroup } from '../../data/wallFrame'

interface WallFrameSceneProps {
  selectedId: string | null
  hoveredId: string | null
  wrongIds?: Set<string>
  hiddenIds: Set<string>
  isolatedId: string | null
  explodePct: number
  visibleGroups: Set<WallComponentGroup> | null
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
  resetToken?: number
  measureMode?: boolean
  measurePoints?: THREE.Vector3[]
  onMeasurePoint?: (point: THREE.Vector3) => void
  positionOverrides?: Record<string, [number, number, number]>
  sizeOverrides?: Record<string, [number, number, number]>
}

function CameraReset({ token }: { token: number }) {
  const { camera } = useThree()
  const last = useRef(token)
  useFrame(() => {
    if (last.current !== token) {
      last.current = token
      camera.position.set(0.4, 1.4, 7.6)
      camera.lookAt(0, 1.25, 0)
    }
  })
  return null
}

function MeasureOverlay({ points }: { points: THREE.Vector3[] }) {
  if (points.length < 1) return null
  const [a, b] = points
  return (
    <>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshBasicMaterial color="#5fa4d6" />
        </mesh>
      ))}
      {b && (
        <>
          <Line points={[a, b]} color="#5fa4d6" lineWidth={2} dashed={false} />
          <Html position={[(a.x + b.x) / 2, (a.y + b.y) / 2 + 0.15, (a.z + b.z) / 2]} center distanceFactor={8}>
            <div className="text-technical whitespace-nowrap rounded-sm border border-blue-400/60 bg-ink-900/95 px-2 py-1 text-[10px] font-medium text-blue-300 shadow-lg">
              {Math.round(a.distanceTo(b) * 1000)} mm
            </div>
          </Html>
        </>
      )}
    </>
  )
}

export function WallFrameScene({
  selectedId,
  hoveredId,
  wrongIds,
  hiddenIds,
  isolatedId,
  explodePct,
  visibleGroups,
  onSelect,
  onHover,
  resetToken = 0,
  measureMode,
  measurePoints = [],
  onMeasurePoint,
  positionOverrides,
  sizeOverrides,
}: WallFrameSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null)

  return (
    <Canvas shadows dpr={[1, 1.75]} gl={{ antialias: true }} onPointerMissed={() => onSelect('')}>
      <PerspectiveCamera makeDefault position={[0.4, 1.4, 7.6]} fov={42} />
      <color attach="background" args={['#0a0c0f']} />
      <fog attach="fog" args={['#0a0c0f', 10, 20]} />

      <hemisphereLight args={['#3f5a78', '#0a0b0d', 0.4]} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[3, 5.5, 3]} intensity={1.75} color="#fff4e0" castShadow shadow-mapSize={[2048, 2048]}>
        <orthographicCamera attach="shadow-camera" args={[-4, 4, 4, -4, 0.1, 20]} />
      </directionalLight>
      <directionalLight position={[-4, 2.5, -3]} intensity={0.55} color="#5fa4d6" />
      <directionalLight position={[0, 1.5, -5]} intensity={0.5} color="#ff9d5c" />

      <Suspense fallback={null}>
        <group position={[-1.9, 0, 0]}>
          <WallFrameModel
            selectedId={selectedId}
            hoveredId={hoveredId}
            wrongIds={wrongIds}
            hiddenIds={hiddenIds}
            isolatedId={isolatedId}
            explodePct={explodePct}
            visibleGroups={visibleGroups}
            onSelect={onSelect}
            onHover={onHover}
            measureMode={measureMode}
            onMeasurePoint={onMeasurePoint}
            positionOverrides={positionOverrides}
            sizeOverrides={sizeOverrides}
          />
          <MeasureOverlay points={measurePoints} />
          <ContactShadows position={[0, -0.02, 0]} opacity={0.5} scale={9} blur={2.2} far={2} resolution={512} />
        </group>
      </Suspense>

      <gridHelper args={[14, 28, '#213247', '#131a24']} />

      <OrbitControls ref={controlsRef} enablePan minDistance={2} maxDistance={18} target={[0, 1.25, 0]} />
      <CameraReset token={resetToken} />
    </Canvas>
  )
}
