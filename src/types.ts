export type StructureId = 'stack' | 'queue' | 'linked-list' | 'bst' | 'array'

export type NodeStatus = 'idle' | 'active' | 'visiting' | 'found' | 'removing' | 'new'

export interface VizNode {
  id: string
  value: number
  status: NodeStatus
  label?: string
}

export interface LogEntry {
  id: string
  call: string
  detail: string
  kind: 'call' | 'result' | 'error'
}

export interface StructureDef {
  id: StructureId
  name: string
  blurb: string
}

export const STRUCTURES: StructureDef[] = [
  { id: 'stack', name: 'Stack', blurb: 'LIFO — push / pop / peek' },
  { id: 'queue', name: 'Queue', blurb: 'FIFO — enqueue / dequeue' },
  { id: 'linked-list', name: 'Linked List', blurb: 'insertHead / insertTail / delete' },
  { id: 'bst', name: 'Binary Search Tree', blurb: 'insert / delete / search' },
  { id: 'array', name: 'Array', blurb: 'insertAt / removeAt / access' },
]
