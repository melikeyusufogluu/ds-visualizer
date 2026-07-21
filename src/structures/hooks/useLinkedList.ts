import { useCallback, useState } from 'react'
import { useLog } from './useLog'
import { useHighlights } from './useHighlights'
import type { NodeStatus } from '../../types'

export interface ListNode {
  id: string
  value: number
}

let uid = 0
const nextUid = () => `ll-${(uid += 1)}`

export function useLinkedList(max = 8) {
  const [items, setItems] = useState<ListNode[]>([])
  const [busy, setBusy] = useState(false)
  const { entries, logCall, logResult } = useLog()
  const { highlights, flash, set, clearAll, wait } = useHighlights()

  const insertHead = useCallback(
    (value: number) => {
      logCall('list.insertHead', `(${value})`)
      if (items.length >= max) {
        logResult(`list full — limited to ${max} for this demo`, 'error')
        return
      }
      const node: ListNode = { id: nextUid(), value }
      setItems((prev) => [node, ...prev])
      flash(node.id, 'new', 500)
      logResult(`${value} is the new head, points to the previous head`)
    },
    [items.length, max, logCall, logResult, flash],
  )

  const insertTail = useCallback(
    (value: number) => {
      logCall('list.insertTail', `(${value})`)
      if (items.length >= max) {
        logResult(`list full — limited to ${max} for this demo`, 'error')
        return
      }
      const node: ListNode = { id: nextUid(), value }
      setItems((prev) => [...prev, node])
      flash(node.id, 'new', 500)
      logResult(`walked to the last node, appended ${value}`)
    },
    [items.length, max, logCall, logResult, flash],
  )

  const deleteHead = useCallback(() => {
    logCall('list.deleteHead', '()')
    if (items.length === 0) {
      logResult('list is empty', 'error')
      return
    }
    const head = items[0]
    flash(head.id, 'removing', 320)
    setTimeout(() => setItems((prev) => prev.filter((n) => n.id !== head.id)), 320)
    logResult(`head now points to ${items[1]?.value ?? 'null'}`)
  }, [items, logCall, logResult, flash])

  const deleteValue = useCallback(
    async (value: number) => {
      if (busy) return
      logCall('list.deleteValue', `(${value})`)
      setBusy(true)
      let found: ListNode | undefined
      for (const node of items) {
        set(node.id, 'visiting')
        await wait(280)
        if (node.value === value) {
          found = node
          break
        }
        set(node.id, 'idle')
      }
      if (!found) {
        clearAll()
        logResult(`${value} not found in list`, 'error')
        setBusy(false)
        return
      }
      set(found.id, 'removing')
      await wait(320)
      const foundId = found.id
      setItems((prev) => prev.filter((n) => n.id !== foundId))
      clearAll()
      logResult(`unlinked node holding ${value}, closed the gap`)
      setBusy(false)
    },
    [items, busy, logCall, logResult, set, clearAll, wait],
  )

  const clear = useCallback(() => {
    logCall('list.clear', '()')
    setItems([])
    clearAll()
    logResult('list emptied')
  }, [logCall, logResult, clearAll])

  const statusFor = useCallback(
    (id: string, isHead: boolean): NodeStatus => highlights[id] ?? (isHead ? 'active' : 'idle'),
    [highlights],
  )

  return { items, insertHead, insertTail, deleteHead, deleteValue, clear, entries, highlights, statusFor, busy, max }
}
