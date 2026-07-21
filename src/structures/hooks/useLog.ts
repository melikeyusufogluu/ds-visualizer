import { useCallback, useState } from 'react'
import type { LogEntry } from '../../types'

let counter = 0
const nextId = () => `log-${(counter += 1)}`

export function useLog() {
  const [entries, setEntries] = useState<LogEntry[]>([])

  const logCall = useCallback((call: string, detail = '') => {
    setEntries((e) => [...e.slice(-59), { id: nextId(), call, detail, kind: 'call' }])
  }, [])

  const logResult = useCallback((detail: string, kind: 'result' | 'error' = 'result') => {
    setEntries((e) => [...e.slice(-59), { id: nextId(), call: '', detail, kind }])
  }, [])

  const clear = useCallback(() => setEntries([]), [])

  return { entries, logCall, logResult, clear }
}
