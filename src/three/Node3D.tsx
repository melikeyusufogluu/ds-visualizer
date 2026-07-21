import { Billboard, Text } from '@react-three/drei'
import type { NodeStatus } from '../types'
import type { Vec3 } from './useAnimatedPositions'

const STATUS_COLOR: Record<NodeStatus, string> = {
  idle: '#6366f1',
  active: '#f59e0b',
  visiting: '#eab308',
  found: '#22c55e',
  removing: '#ef4444',
  new: '#34d399',
}

interface Node3DProps {
  position: Vec3
  value: number
  status: NodeStatus
  label?: string
  shape?: 'box' | 'sphere'
  size?: number
}

export function Node3D({ position, value, status, label, shape = 'box', size = 0.9 }: Node3DProps) {
  const color = STATUS_COLOR[status]

  return (
    <group position={position}>
      <mesh castShadow>
        {shape === 'sphere' ? (
          <sphereGeometry args={[size * 0.55, 32, 32]} />
        ) : (
          <boxGeometry args={[size, size, size]} />
        )}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={status === 'idle' ? 0.08 : 0.45}
          roughness={0.35}
          metalness={0.15}
        />
      </mesh>
      <Billboard position={[0, 0, size * 0.6 + 0.01]}>
        <Text fontSize={0.32} color="white" anchorX="center" anchorY="middle">
          {String(value)}
        </Text>
      </Billboard>
      {label && (
        <Billboard position={[0, -size * 0.85, 0]}>
          <Text fontSize={0.2} color="#a1a1aa" anchorX="center" anchorY="middle">
            {label}
          </Text>
        </Billboard>
      )}
    </group>
  )
}
