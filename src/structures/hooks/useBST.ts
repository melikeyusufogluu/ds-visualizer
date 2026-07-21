import { useCallback, useState } from 'react'
import { useLog } from './useLog'
import { useHighlights } from './useHighlights'
import type { NodeStatus } from '../../types'

export interface TreeNode {
  id: string
  value: number
  left: string | null
  right: string | null
}

export type TreeMap = Record<string, TreeNode>

let uid = 0
const nextUid = () => `bst-${(uid += 1)}`

export function useBST() {
  const [nodes, setNodes] = useState<TreeMap>({})
  const [root, setRoot] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const { entries, logCall, logResult } = useLog()
  const { highlights, flash, set, clearAll, wait } = useHighlights()

  const insert = useCallback(
    async (value: number) => {
      if (busy) return
      logCall('bst.insert', `(${value})`)
      setBusy(true)

      if (!root) {
        const node: TreeNode = { id: nextUid(), value, left: null, right: null }
        setNodes({ [node.id]: node })
        setRoot(node.id)
        flash(node.id, 'new', 600)
        logResult(`${value} becomes the root`)
        setBusy(false)
        return
      }

      let curId: string | null = root
      while (curId) {
        set(curId, 'visiting')
        await wait(260)
        const cur: TreeNode = nodes[curId]
        if (value === cur.value) {
          set(curId, 'idle')
          clearAll()
          logResult(`${value} already exists — a BST holds no duplicates`, 'error')
          setBusy(false)
          return
        }
        const dir: 'left' | 'right' = value < cur.value ? 'left' : 'right'
        const nextId: string | null = cur[dir]
        set(curId, 'idle')
        if (!nextId) {
          const node: TreeNode = { id: nextUid(), value, left: null, right: null }
          setNodes((prev) => ({
            ...prev,
            [curId as string]: { ...prev[curId as string], [dir]: node.id },
            [node.id]: node,
          }))
          flash(node.id, 'new', 600)
          logResult(`attached ${value} as ${cur.value}'s ${dir} child`)
          setBusy(false)
          return
        }
        curId = nextId
      }
    },
    [root, nodes, busy, logCall, logResult, set, clearAll, flash, wait],
  )

  const search = useCallback(
    async (value: number) => {
      if (busy) return
      logCall('bst.search', `(${value})`)
      setBusy(true)
      let curId: string | null = root
      while (curId) {
        set(curId, 'visiting')
        await wait(300)
        const cur = nodes[curId]
        if (cur.value === value) {
          set(curId, 'found')
          logResult(`found ${value}`)
          await wait(700)
          clearAll()
          setBusy(false)
          return
        }
        set(curId, 'idle')
        curId = value < cur.value ? cur.left : cur.right
      }
      clearAll()
      logResult(`${value} not found — hit a null child`, 'error')
      setBusy(false)
    },
    [root, nodes, busy, logCall, logResult, set, clearAll, wait],
  )

  const remove = useCallback(
    async (value: number) => {
      if (busy) return
      logCall('bst.delete', `(${value})`)
      setBusy(true)

      let parentId: string | null = null
      let curId: string | null = root
      while (curId && nodes[curId].value !== value) {
        set(curId, 'visiting')
        await wait(260)
        set(curId, 'idle')
        parentId = curId
        curId = value < nodes[curId].value ? nodes[curId].left : nodes[curId].right
      }

      if (!curId) {
        clearAll()
        logResult(`${value} not found`, 'error')
        setBusy(false)
        return
      }

      set(curId, 'visiting')
      await wait(300)

      const working: TreeMap = { ...nodes }
      const target = working[curId]
      let newRoot: string | null = root

      const replaceInParent = (childId: string | null) => {
        if (parentId) {
          const parent = { ...working[parentId] }
          if (parent.left === curId) parent.left = childId
          else parent.right = childId
          working[parentId] = parent
        } else {
          newRoot = childId
        }
      }

      if (target.left && target.right) {
        let succParentId = curId
        let succId = target.right
        set(succId, 'visiting')
        await wait(260)
        while (working[succId].left) {
          succParentId = succId
          succId = working[succId].left as string
          set(succId, 'visiting')
          await wait(260)
        }
        const succ = working[succId]
        working[curId] = { ...target, value: succ.value }
        if (succParentId === curId) {
          working[curId] = { ...working[curId], right: succ.right }
        } else {
          working[succParentId] = { ...working[succParentId], left: succ.right }
        }
        delete working[succId]
        logResult(`swapped with in-order successor ${succ.value}, removed the successor leaf`)
      } else {
        const child = target.left ?? target.right
        replaceInParent(child)
        delete working[curId]
        logResult(child ? `spliced out ${value}, promoted its only child` : `removed leaf node ${value}`)
      }

      setNodes(working)
      setRoot(newRoot)
      clearAll()
      setBusy(false)
    },
    [root, nodes, busy, logCall, logResult, set, clearAll, wait],
  )

  const clear = useCallback(() => {
    logCall('bst.clear', '()')
    setNodes({})
    setRoot(null)
    clearAll()
    logResult('tree emptied')
  }, [logCall, logResult, clearAll])

  const statusFor = useCallback((id: string): NodeStatus => highlights[id] ?? 'idle', [highlights])

  return { nodes, root, insert, search, remove, clear, entries, highlights, statusFor, busy }
}
