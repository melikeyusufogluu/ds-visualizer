import { Line } from '@react-three/drei'
import type { Vec3 } from './useAnimatedPositions'

interface Edge3DProps {
  from: Vec3
  to: Vec3
  color?: string
  arrow?: boolean
}

export function Edge3D({ from, to, color = '#52525b' }: Edge3DProps) {
  return <Line points={[from, to]} color={color} lineWidth={2} />
}
