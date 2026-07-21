import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'

export type Vec3 = [number, number, number]
export type PosMap = Record<string, Vec3>

const EPS = 0.002

export function useAnimatedPositions(targets: PosMap, speed = 6) {
  const posRef = useRef<PosMap>({})
  const [positions, setPositions] = useState<PosMap>({})

  useFrame((_, delta) => {
    const ids = new Set([...Object.keys(posRef.current), ...Object.keys(targets)])
    const next: PosMap = {}
    let changed = false

    ids.forEach((id) => {
      const target = targets[id]
      if (!target) return // dropped node, let it disappear immediately
      const cur = posRef.current[id] ?? target
      const lerped: Vec3 = [
        THREE.MathUtils.damp(cur[0], target[0], speed, delta),
        THREE.MathUtils.damp(cur[1], target[1], speed, delta),
        THREE.MathUtils.damp(cur[2], target[2], speed, delta),
      ]
      next[id] = lerped
      if (
        Math.abs(lerped[0] - target[0]) > EPS ||
        Math.abs(lerped[1] - target[1]) > EPS ||
        Math.abs(lerped[2] - target[2]) > EPS ||
        !posRef.current[id]
      ) {
        changed = true
      }
    })

    posRef.current = next
    if (changed) setPositions(next)
  })

  return positions
}
