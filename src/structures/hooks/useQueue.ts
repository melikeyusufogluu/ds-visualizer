import { useCallback, useState } from 'react'
import { useLog } from './useLog'
import { useHighlights } from './useHighlights'
import type { NodeStatus } from '../../types'

export interface QueueItem {
  id: string
  value: number
}

let uid = 0
const nextUid = () => `q-${(uid += 1)}`

export function useQueue(max = 8) {
  const [items, setItems] = useState<QueueItem[]>([])
  const { entries, logCall, logResult } = useLog()
  const { highlights, flash } = useHighlights()

  const enqueue = useCallback(
    (value: number) => {
      logCall('queue.enqueue', `(${value})`)
      if (items.length >= max) {
        logResult(`queue full — limited to ${max} for this demo`, 'error')
        return
      }
      const item: QueueItem = { id: nextUid(), value }
      setItems((prev) => [...prev, item])
      flash(item.id, 'new', 500)
      logResult(`enqueued ${value} at the back (index ${items.length})`)
    },
    [items.length, max, logCall, logResult, flash],
  )

  const dequeue = useCallback(() => {
    logCall('queue.dequeue', '()')
    if (items.length === 0) {
      logResult('queue is empty', 'error')
      return
    }
    const front = items[0]
    flash(front.id, 'removing', 320)
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== front.id)), 320)
    logResult(`dequeued ${front.value} from the front`)
  }, [items, logCall, logResult, flash])

  const clear = useCallback(() => {
    logCall('queue.clear', '()')
    setItems([])
    logResult('queue emptied')
  }, [logCall, logResult])

  const statusFor = useCallback(
    (id: string, isFront: boolean): NodeStatus => highlights[id] ?? (isFront ? 'active' : 'idle'),
    [highlights],
  )

  return { items, enqueue, dequeue, clear, entries, highlights, statusFor, max }
}
