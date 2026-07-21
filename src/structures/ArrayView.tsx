import { useMemo, useState } from 'react'
import { useArray, type ArrayItem } from './hooks/useArray'
import { StructureLayout } from '../ui/StructureLayout'
import { Button } from '../ui/Button'
import { ControlGroup, NumberField, Divider } from '../ui/Fields'
import { Node3D } from '../three/Node3D'
import { useAnimatedPositions, type PosMap } from '../three/useAnimatedPositions'
import { randomValue } from '../utils/random'
import type { NodeStatus } from '../types'

const GAP = 1.3

function ArrayVisual({
  items,
  statusFor,
}: {
  items: ArrayItem[]
  statusFor: (id: string) => NodeStatus
}) {
  const targets = useMemo(() => {
    const map: PosMap = {}
    const offset = ((items.length - 1) * GAP) / 2
    items.forEach((item, i) => {
      map[item.id] = [i * GAP - offset, 0, 0]
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
          status={statusFor(item.id)}
          label={`[${i}]`}
        />
      ))}
    </>
  )
}

export function ArrayView() {
  const arr = useArray()
  const [value, setValue] = useState(randomValue())
  const [index, setIndex] = useState(0)

  return (
    <StructureLayout
      structureId="array"
      log={arr.entries}
      cameraPosition={[2, 4, 9]}
      controls={
        <>
          <ControlGroup label="value">
            <NumberField value={value} onChange={setValue} />
          </ControlGroup>
          <Button onClick={() => arr.append(value)} disabled={arr.items.length >= arr.max}>
            append(value)
          </Button>
          <Button variant="ghost" onClick={() => setValue(randomValue())}>
            🎲
          </Button>
          <Divider />
          <ControlGroup label="index">
            <NumberField value={index} onChange={setIndex} width="w-14" />
          </ControlGroup>
          <Button variant="ghost" onClick={() => arr.insertAt(index, value)}>
            insertAt(i, v)
          </Button>
          <Button variant="danger" onClick={() => arr.removeAt(index)} disabled={arr.items.length === 0}>
            removeAt(i)
          </Button>
          <Button variant="ghost" onClick={() => arr.access(index)} disabled={arr.items.length === 0}>
            access(i)
          </Button>
          <Divider />
          <Button variant="ghost" onClick={arr.clear} disabled={arr.items.length === 0}>
            clear
          </Button>
          <span className="ml-auto text-xs text-zinc-500">
            length {arr.items.length} / {arr.max}
          </span>
        </>
      }
    >
      <ArrayVisual items={arr.items} statusFor={arr.statusFor} />
    </StructureLayout>
  )
}
