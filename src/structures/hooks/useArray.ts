import { useCallback, useState } from 'react'
import { useLog } from './useLog'
import { useHighlights } from './useHighlights'
import type { NodeStatus } from '../../types'

export interface ArrayItem {
  id: string
  value: number
}

let uid = 0
const nextUid = () => `a-${(uid += 1)}`

export function useArray(max = 10) {
  const [items, setItems] = useState<ArrayItem[]>([])
  const { entries, logCall, logResult } = useLog()
  const { highlights, flash } = useHighlights()

  const append = useCallback(
    (value: number) => {
      logCall('array.insertAt', `(${items.length}, ${value})`)
      if (items.length >= max) {
        logResult(`array full — limited to ${max} for this demo`, 'error')
        return
      }
      const item: ArrayItem = { id: nextUid(), value }
      setItems((prev) => [...prev, item])
      flash(item.id, 'new', 500)
      logResult(`inserted ${value} at index ${items.length}`)
    },
    [items.length, max, logCall, logResult, flash],
  )

  const insertAt = useCallback(
    (index: number, value: number) => {
      logCall('array.insertAt', `(${index}, ${value})`)
      if (items.length >= max) {
        logResult(`array full — limited to ${max} for this demo`, 'error')
        return
      }
      const clamped = Math.max(0, Math.min(index, items.length))
      const item: ArrayItem = { id: nextUid(), value }
      setItems((prev) => [...prev.slice(0, clamped), item, ...prev.slice(clamped)])
      flash(item.id, 'new', 500)
      logResult(`shifted ${items.length - clamped} element(s) right, inserted ${value} at index ${clamped}`)
    },
    [items.length, max, logCall, logResult, flash],
  )

  const removeAt = useCallback(
    (index: number) => {
      logCall('array.removeAt', `(${index})`)
      if (index < 0 || index >= items.length) {
        logResult('index out of bounds', 'error')
        return
      }
      const target = items[index]
      flash(target.id, 'removing', 320)
      setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== target.id)), 320)
      logResult(`removed ${target.value} from index ${index}, shifting remaining elements left`)
    },
    [items, logCall, logResult, flash],
  )

  const access = useCallback(
    (index: number) => {
      logCall('array.access', `(${index})`)
      if (index < 0 || index >= items.length) {
        logResult('index out of bounds', 'error')
        return
      }
      const target = items[index]
      flash(target.id, 'found', 700)
      logResult(`arr[${index}] = ${target.value} — O(1) direct lookup`)
    },
    [items, logCall, logResult, flash],
  )

  const clear = useCallback(() => {
    logCall('array.clear', '()')
    setItems([])
    logResult('array emptied')
  }, [logCall, logResult])

  const statusFor = useCallback((id: string): NodeStatus => highlights[id] ?? 'idle', [highlights])

  return { items, append, insertAt, removeAt, access, clear, entries, highlights, statusFor, max }
}
