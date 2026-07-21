import { useMemo, useState } from 'react'
import { useLinkedList, type ListNode } from './hooks/useLinkedList'
import { StructureLayout } from '../ui/StructureLayout'
import { Button } from '../ui/Button'
import { ControlGroup, NumberField, Divider } from '../ui/Fields'
import { Node3D } from '../three/Node3D'
import { Edge3D } from '../three/Edge3D'
import { useAnimatedPositions, type PosMap } from '../three/useAnimatedPositions'
import { randomValue } from '../utils/random'
import type { NodeStatus } from '../types'

const GAP = 1.7

function LinkedListVisual({
  items,
  statusFor,
}: {
  items: ListNode[]
  statusFor: (id: string, isHead: boolean) => NodeStatus
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
      {items.slice(0, -1).map((item, i) => {
        const next = items[i + 1]
        const from = positions[item.id] ?? targets[item.id]
        const to = positions[next.id] ?? targets[next.id]
        return (
          <Edge3D
            key={`edge-${item.id}`}
            from={[from[0] + 0.55, from[1], from[2]]}
            to={[to[0] - 0.55, to[1], to[2]]}
            color="#52525b"
          />
        )
      })}
      {items.map((item, i) => (
        <Node3D
          key={item.id}
          position={positions[item.id] ?? targets[item.id]}
          value={item.value}
          status={statusFor(item.id, i === 0)}
          label={i === 0 ? 'head' : i === items.length - 1 ? 'tail · next → null' : undefined}
        />
      ))}
    </>
  )
}

export function LinkedListView() {
  const list = useLinkedList()
  const [value, setValue] = useState(randomValue())
  const [target, setTarget] = useState(randomValue())

  return (
    <StructureLayout
      structureId="linked-list"
      log={list.entries}
      cameraPosition={[0, 4, 10]}
      controls={
        <>
          <ControlGroup label="value">
            <NumberField value={value} onChange={setValue} />
          </ControlGroup>
          <Button onClick={() => list.insertHead(value)} disabled={list.busy}>
            insertHead(v)
          </Button>
          <Button onClick={() => list.insertTail(value)} disabled={list.busy}>
            insertTail(v)
          </Button>
          <Button variant="ghost" onClick={() => setValue(randomValue())} disabled={list.busy}>
            🎲
          </Button>
          <Divider />
          <Button variant="danger" onClick={list.deleteHead} disabled={list.busy || list.items.length === 0}>
            deleteHead()
          </Button>
          <ControlGroup label="find">
            <NumberField value={target} onChange={setTarget} width="w-14" />
          </ControlGroup>
          <Button
            variant="danger"
            onClick={() => list.deleteValue(target)}
            disabled={list.busy || list.items.length === 0}
          >
            deleteValue(v)
          </Button>
          <Divider />
          <Button variant="ghost" onClick={list.clear} disabled={list.busy || list.items.length === 0}>
            clear
          </Button>
          <span className="ml-auto text-xs text-zinc-500">
            size {list.items.length} / {list.max}
          </span>
        </>
      }
    >
      <LinkedListVisual items={list.items} statusFor={list.statusFor} />
    </StructureLayout>
  )
}
