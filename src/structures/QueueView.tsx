import { useMemo, useState } from 'react'
import { useQueue, type QueueItem } from './hooks/useQueue'
import { StructureLayout } from '../ui/StructureLayout'
import { Button } from '../ui/Button'
import { ControlGroup, NumberField, Divider } from '../ui/Fields'
import { Node3D } from '../three/Node3D'
import { useAnimatedPositions, type PosMap } from '../three/useAnimatedPositions'
import { randomValue } from '../utils/random'
import type { NodeStatus } from '../types'

const GAP = 1.3

function QueueVisual({
  items,
  statusFor,
}: {
  items: QueueItem[]
  statusFor: (id: string, isFront: boolean) => NodeStatus
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
          status={statusFor(item.id, i === 0)}
          label={i === 0 ? 'front' : i === items.length - 1 ? 'back' : undefined}
        />
      ))}
    </>
  )
}

export function QueueView() {
  const queue = useQueue()
  const [value, setValue] = useState(randomValue())

  return (
    <StructureLayout
      structureId="queue"
      log={queue.entries}
      cameraPosition={[2, 4, 9]}
      controls={
        <>
          <ControlGroup label="value">
            <NumberField value={value} onChange={setValue} />
          </ControlGroup>
          <Button onClick={() => queue.enqueue(value)}>enqueue(value)</Button>
          <Button variant="ghost" onClick={() => setValue(randomValue())}>
            🎲
          </Button>
          <Divider />
          <Button variant="danger" onClick={queue.dequeue} disabled={queue.items.length === 0}>
            dequeue()
          </Button>
          <Divider />
          <Button variant="ghost" onClick={queue.clear} disabled={queue.items.length === 0}>
            clear
          </Button>
          <span className="ml-auto text-xs text-zinc-500">
            size {queue.items.length} / {queue.max}
          </span>
        </>
      }
    >
      <QueueVisual items={queue.items} statusFor={queue.statusFor} />
    </StructureLayout>
  )
}
