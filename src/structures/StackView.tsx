import { useMemo, useState } from 'react'
import { useStack, type StackItem } from './hooks/useStack'
import { StructureLayout } from '../ui/StructureLayout'
import { Button } from '../ui/Button'
import { ControlGroup, NumberField, Divider } from '../ui/Fields'
import { Node3D } from '../three/Node3D'
import { useAnimatedPositions, type PosMap } from '../three/useAnimatedPositions'
import { randomValue } from '../utils/random'
import type { NodeStatus } from '../types'

const GAP = 1.15

function StackVisual({
  items,
  statusFor,
}: {
  items: StackItem[]
  statusFor: (id: string, isTop: boolean) => NodeStatus
}) {
  const targets = useMemo(() => {
    const map: PosMap = {}
    items.forEach((item, i) => {
      map[item.id] = [0, i * GAP - 1, 0]
    })
    return map
  }, [items])

  const positions = useAnimatedPositions(targets)

  return (
    <>
      {items.map((item, i) => (
        <Node3D
          key={item.id}
          position={positions[item.id] ?? targets[item.id]}
          value={item.value}
          status={statusFor(item.id, i === items.length - 1)}
          label={i === items.length - 1 ? 'top' : undefined}
        />
      ))}
    </>
  )
}

export function StackView() {
  const stack = useStack()
  const [value, setValue] = useState(randomValue())

  return (
    <StructureLayout
      structureId="stack"
      log={stack.entries}
      cameraPosition={[6, 4, 8]}
      controls={
        <>
          <ControlGroup label="value">
            <NumberField value={value} onChange={setValue} />
          </ControlGroup>
          <Button onClick={() => stack.push(value)}>push(value)</Button>
          <Button variant="ghost" onClick={() => setValue(randomValue())}>
            🎲
          </Button>
          <Divider />
          <Button variant="danger" onClick={stack.pop} disabled={stack.items.length === 0}>
            pop()
          </Button>
          <Divider />
          <Button variant="ghost" onClick={stack.clear} disabled={stack.items.length === 0}>
            clear
          </Button>
          <span className="ml-auto text-xs text-zinc-500">
            size {stack.items.length} / {stack.max}
          </span>
        </>
      }
    >
      <StackVisual items={stack.items} statusFor={stack.statusFor} />
    </StructureLayout>
  )
}
