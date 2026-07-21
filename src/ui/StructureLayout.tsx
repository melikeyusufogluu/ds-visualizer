import type { ReactNode } from 'react'
import type { LogEntry, StructureId } from '../types'
import { Scene } from '../three/Scene'
import { CodePanel } from './CodePanel'
import { OperationLog } from './OperationLog'

interface StructureLayoutProps {
  structureId: StructureId
  controls: ReactNode
  log: LogEntry[]
  children: ReactNode
  cameraPosition?: [number, number, number]
}

export function StructureLayout({
  structureId,
  controls,
  log,
  children,
  cameraPosition,
}: StructureLayoutProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 bg-zinc-950/50 px-4 py-3">
        {controls}
      </div>
      <div className="flex flex-1 min-h-0">
        <div className="flex-1 min-w-0 relative">
          <Scene cameraPosition={cameraPosition}>{children}</Scene>
          <Legend />
        </div>
        <div className="w-80 shrink-0 border-l border-zinc-800 flex flex-col min-h-0 bg-zinc-950/30">
          <div className="flex-[1.2] min-h-0 overflow-y-auto border-b border-zinc-800">
            <CodePanel structure={structureId} />
          </div>
          <div className="flex-1 min-h-0">
            <OperationLog entries={log} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Legend() {
  const items: Array<[string, string]> = [
    ['#f59e0b', 'active / top / front'],
    ['#eab308', 'visiting'],
    ['#22c55e', 'found'],
    ['#ef4444', 'removing'],
    ['#6366f1', 'idle'],
  ]
  return (
    <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 rounded-md bg-zinc-950/70 backdrop-blur px-3 py-2 text-xs text-zinc-300 border border-zinc-800">
      {items.map(([color, label]) => (
        <div key={label} className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
          {label}
        </div>
      ))}
    </div>
  )
}
