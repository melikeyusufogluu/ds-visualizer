import { useMemo, useState } from 'react'
import { useBST, type TreeMap } from './hooks/useBST'
import { StructureLayout } from '../ui/StructureLayout'
import { Button } from '../ui/Button'
import { ControlGroup, NumberField, Divider } from '../ui/Fields'
import { Node3D } from '../three/Node3D'
import { Edge3D } from '../three/Edge3D'
import { useAnimatedPositions, type PosMap } from '../three/useAnimatedPositions'
import { randomValue } from '../utils/random'
import type { NodeStatus } from '../types'

const X_SPACING = 1.4
const Y_SPACING = 1.6

function computeLayout(nodes: TreeMap, root: string | null): PosMap {
  const map: Record<string, [number, number]> = {}
  let counter = 0

  const visit = (id: string | null, depth: number) => {
    if (!id) return
    const node = nodes[id]
    visit(node.left, depth + 1)
    map[id] = [counter, depth]
    counter += 1
    visit(node.right, depth + 1)
  }
  visit(root, 0)

  const offset = (counter - 1) / 2
  const positions: PosMap = {}
  Object.entries(map).forEach(([id, [x, depth]]) => {
    positions[id] = [(x - offset) * X_SPACING, 3 - depth * Y_SPACING, 0]
  })
  return positions
}

function BSTVisual({
  nodes,
  root,
  statusFor,
}: {
  nodes: TreeMap
  root: string | null
  statusFor: (id: string) => NodeStatus
}) {
  const targets = useMemo(() => computeLayout(nodes, root), [nodes, root])
  const positions = useAnimatedPositions(targets)

  const edges = useMemo(() => {
    const list: Array<{ id: string; from: string; to: string }> = []
    Object.values(nodes).forEach((n) => {
      if (n.left) list.push({ id: `${n.id}-l`, from: n.id, to: n.left })
      if (n.right) list.push({ id: `${n.id}-r`, from: n.id, to: n.right })
    })
    return list
  }, [nodes])

  return (
    <>
      {edges.map((e) => {
        const from = positions[e.from] ?? targets[e.from]
        const to = positions[e.to] ?? targets[e.to]
        if (!from || !to) return null
        return <Edge3D key={e.id} from={from} to={to} color="#52525b" />
      })}
      {Object.values(nodes).map((n) => (
        <Node3D
          key={n.id}
          position={positions[n.id] ?? targets[n.id]}
          value={n.value}
          status={statusFor(n.id)}
          label={n.id === root ? 'root' : undefined}
          shape="sphere"
        />
      ))}
    </>
  )
}

export function BSTView() {
  const bst = useBST()
  const [value, setValue] = useState(randomValue())

  return (
    <StructureLayout
      structureId="bst"
      log={bst.entries}
      cameraPosition={[1, 4, 12]}
      controls={
        <>
          <ControlGroup label="value">
            <NumberField value={value} onChange={setValue} />
          </ControlGroup>
          <Button onClick={() => bst.insert(value)} disabled={bst.busy}>
            insert(v)
          </Button>
          <Button variant="ghost" onClick={() => bst.search(value)} disabled={bst.busy}>
            search(v)
          </Button>
          <Button variant="danger" onClick={() => bst.remove(value)} disabled={bst.busy}>
            delete(v)
          </Button>
          <Button variant="ghost" onClick={() => setValue(randomValue())} disabled={bst.busy}>
            🎲
          </Button>
          <Divider />
          <Button
            variant="ghost"
            onClick={bst.clear}
            disabled={bst.busy || Object.keys(bst.nodes).length === 0}
          >
            clear
          </Button>
          <span className="ml-auto text-xs text-zinc-500">nodes {Object.keys(bst.nodes).length}</span>
        </>
      }
    >
      <BSTVisual nodes={bst.nodes} root={bst.root} statusFor={bst.statusFor} />
    </StructureLayout>
  )
}
