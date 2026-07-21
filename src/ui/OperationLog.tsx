import { useEffect, useRef } from 'react'
import type { LogEntry } from '../types'

const KIND_CLASSES: Record<LogEntry['kind'], string> = {
  call: 'text-indigo-300',
  result: 'text-emerald-400',
  error: 'text-red-400',
}

export function OperationLog({ entries }: { entries: LogEntry[] }) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [entries])

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 px-3 pt-3 pb-2">
        Operation Log
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-3 font-mono text-xs space-y-1.5">
        {entries.length === 0 && (
          <div className="text-zinc-600 italic">Call a method to see it traced here.</div>
        )}
        {entries.map((e) => (
          <div key={e.id} className={e.kind === 'call' ? 'text-zinc-100' : KIND_CLASSES[e.kind]}>
            {e.kind === 'call' ? <span className="text-zinc-500">&gt;&nbsp;</span> : <span>&nbsp;&nbsp;↳ </span>}
            {e.kind === 'call' ? <span className={KIND_CLASSES.call}>{e.call}</span> : null}
            {e.kind !== 'call' && e.detail}
            {e.kind === 'call' && e.detail && <span className="text-zinc-500"> {e.detail}</span>}
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  )
}
