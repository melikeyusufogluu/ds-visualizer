import { STRUCTURES, type StructureId } from '../types'

interface SidebarProps {
  selected: StructureId
  onSelect: (id: StructureId) => void
}

export function Sidebar({ selected, onSelect }: SidebarProps) {
  return (
    <nav className="w-56 shrink-0 border-r border-zinc-800 bg-zinc-950/60 p-3 flex flex-col gap-1">
      <div className="px-2 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Data Structures
      </div>
      {STRUCTURES.map((s) => {
        const active = s.id === selected
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`text-left rounded-lg px-3 py-2.5 transition-colors ${
              active
                ? 'bg-indigo-600/20 border border-indigo-500/50 text-indigo-200'
                : 'border border-transparent hover:bg-zinc-800/60 text-zinc-300'
            }`}
          >
            <div className="text-sm font-medium">{s.name}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{s.blurb}</div>
          </button>
        )
      })}
    </nav>
  )
}
