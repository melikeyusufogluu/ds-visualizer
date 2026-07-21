import { useState } from 'react'
import { Sidebar } from './ui/Sidebar'
import { StackView } from './structures/StackView'
import { QueueView } from './structures/QueueView'
import { LinkedListView } from './structures/LinkedListView'
import { BSTView } from './structures/BSTView'
import { ArrayView } from './structures/ArrayView'
import type { StructureId } from './types'

function App() {
  const [selected, setSelected] = useState<StructureId>('stack')

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-950 text-zinc-100">
      <header className="shrink-0 border-b border-zinc-800 px-4 py-2.5 flex items-center gap-2">
        <span className="text-lg">🧊</span>
        <h1 className="text-sm font-semibold tracking-tight">Data Structures, in 3D</h1>
        <span className="text-xs text-zinc-500 ml-2">react-three-fiber · tailwind</span>
      </header>
      <div className="flex flex-1 min-h-0">
        <Sidebar selected={selected} onSelect={setSelected} />
        {selected === 'stack' && <StackView />}
        {selected === 'queue' && <QueueView />}
        {selected === 'linked-list' && <LinkedListView />}
        {selected === 'bst' && <BSTView />}
        {selected === 'array' && <ArrayView />}
      </div>
    </div>
  )
}

export default App
