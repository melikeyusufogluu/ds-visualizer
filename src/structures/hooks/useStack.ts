import { useCallback, useState } from 'react'
import { useLog } from './useLog'
import { useHighlights } from './useHighlights'
import type { NodeStatus } from '../../types'

export interface StackItem {
  id: string
  value: number
}

let uid = 0
const nextUid = () => `st-${(uid += 1)}`

export function useStack(max = 8) {
  const [items, setItems] = useState<StackItem[]>([])
  const { entries, logCall, logResult } = useLog()
  const { highlights, flash } = useHighlights()

  const push = useCallback(
    (value: number) => {
      logCall('stack.push', `(${value})`)
      if (items.length >= max) {
        logResult(`overflow — stack limited to ${max} for this demo`, 'error')
        return
      }
      const item: StackItem = { id: nextUid(), value }
      setItems((prev) => [...prev, item])
      flash(item.id, 'new', 500)
      logResult(`pushed ${value} → index ${items.length} (new top)`)
    },
    [items.length, max, logCall, logResult, flash],
  )

  const pop = useCallback(() => {
    logCall('stack.pop', '()')
    if (items.length === 0) {
      logResult('underflow — stack is empty', 'error')
      return
    }
    const top = items[items.length - 1]
    flash(top.id, 'removing', 320)
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== top.id)), 320)
    logResult(`popped ${top.value} (was index ${items.length - 1})`)
  }, [items, logCall, logResult, flash])

  const clear = useCallback(() => {
    logCall('stack.clear', '()')
    setItems([])
    logResult('stack emptied')
  }, [logCall, logResult])

  const statusFor = useCallback(
    (id: string, isTop: boolean): NodeStatus => highlights[id] ?? (isTop ? 'active' : 'idle'),
    [highlights],
  )

  return { items, push, pop, clear, entries, highlights, statusFor, max }
}
