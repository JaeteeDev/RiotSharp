import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, ContactShadows, PerspectiveCamera } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { HouseModel, type HouseLayerId } from './HouseModel'

interface HouseSceneProps {
  selectedLayer: HouseLayerId | null
  exploded: boolean
  visibleLayers?: Set<HouseLayerId>
  autoRotate?: boolean
  resetToken?: number
}

function IdleRotator({ enabled, controlsRef }: { enabled: boolean; controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
  useFrame(() => {
    if (enabled && controlsRef.current) {
      controlsRef.current.autoRotate = true
      controlsRef.current.autoRotateSpeed = 0.6
    } else if (controlsRef.current) {
      controlsRef.current.autoRotate = false
    }
  })
  return null
}

function CameraReset({ token }: { token: number }) {
  const { camera } = useThree()
  const last = useRef(token)
  useFrame(() => {
    if (last.current !== token) {
      last.current = token
      camera.position.set(7.5, 4.6, 8)
      camera.lookAt(0, 1.6, 0)
    }
  })
  return null
}

export function HouseScene({ selectedLayer, exploded, visibleLayers, autoRotate = true, resetToken = 0 }: HouseSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null)

  return (
    <Canvas shadows dpr={[1, 1.75]} gl={{ antialias: true }}>
      <PerspectiveCamera makeDefault position={[7.5, 4.6, 8]} fov={38} />
      <color attach="background" args={['#0c0e11']} />
      <fog attach="fog" args={['#0c0e11', 14, 26]} />

      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 9, 4]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-6, 4, -6]} intensity={0.3} color="#5fa4d6" />

      <Suspense fallback={null}>
        <group position={[0, -1.2, 0]}>
          <HouseModel selectedLayer={selectedLayer} exploded={exploded} visibleLayers={visibleLayers} />
          <ContactShadows position={[0, -0.02, 0]} opacity={0.45} scale={14} blur={2.2} far={4} resolution={512} color="#000000" />
        </group>
      </Suspense>

      <gridHelper args={[24, 24, '#1b1f27', '#14171d']} position={[0, -1.2, 0]} />

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={5}
        maxDistance={16}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 0.4, 0]}
      />
      <IdleRotator enabled={autoRotate} controlsRef={controlsRef} />
      <CameraReset token={resetToken} />
    </Canvas>
  )
}
