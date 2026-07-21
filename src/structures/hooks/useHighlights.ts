import { useCallback, useEffect, useRef, useState } from 'react'
import type { NodeStatus } from '../../types'

export function useHighlights() {
  const [highlights, setHighlights] = useState<Record<string, NodeStatus>>({})
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())

  const set = useCallback((id: string, status: NodeStatus) => {
    setHighlights((h) => ({ ...h, [id]: status }))
  }, [])

  const clearOne = useCallback((id: string) => {
    setHighlights((h) => {
      if (!(id in h)) return h
      const next = { ...h }
      delete next[id]
      return next
    })
  }, [])

  const flash = useCallback(
    (id: string, status: NodeStatus, ms: number) => {
      set(id, status)
      const t = setTimeout(() => {
        clearOne(id)
        timers.current.delete(t)
      }, ms)
      timers.current.add(t)
    },
    [set, clearOne],
  )

  const clearAll = useCallback(() => setHighlights({}), [])

  const wait = useCallback((ms: number) => new Promise<void>((resolve) => {
    const t = setTimeout(() => {
      timers.current.delete(t)
      resolve()
    }, ms)
    timers.current.add(t)
  }), [])

  useEffect(() => {
    const set = timers.current
    return () => set.forEach(clearTimeout)
  }, [])

  return { highlights, set, clearOne, flash, clearAll, wait }
}
