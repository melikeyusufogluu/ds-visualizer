import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Environment } from '@react-three/drei'
import type { ReactNode } from 'react'
import { Suspense } from 'react'

interface SceneProps {
  children: ReactNode
  cameraPosition?: [number, number, number]
}

export function Scene({ children, cameraPosition = [6, 5, 9] }: SceneProps) {
  return (
    <Canvas shadows camera={{ position: cameraPosition, fov: 45 }}>
      <color attach="background" args={['#0a0a0f']} />
      <fog attach="fog" args={['#0a0a0f', 12, 28]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-6, 4, -4]} intensity={0.4} color="#6366f1" />
      <Grid
        position={[0, -1.75, 0]}
        args={[30, 30]}
        cellColor="#27272a"
        sectionColor="#3f3f46"
        fadeDistance={22}
        infiniteGrid
      />
      <Suspense fallback={null}>{children}</Suspense>
      <Environment preset="city" />
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={3}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2 - 0.02}
      />
    </Canvas>
  )
}
