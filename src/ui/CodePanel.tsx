import type { StructureId } from '../types'

interface MethodDoc {
  sig: string
  complexity: string
  code: string
}

const DOCS: Record<StructureId, MethodDoc[]> = {
  stack: [
    { sig: 'push(value)', complexity: 'O(1)', code: 'top += 1\narr[top] = value' },
    { sig: 'pop()', complexity: 'O(1)', code: 'value = arr[top]\ntop -= 1\nreturn value' },
    { sig: 'peek()', complexity: 'O(1)', code: 'return arr[top]' },
  ],
  queue: [
    { sig: 'enqueue(value)', complexity: 'O(1)', code: 'arr[tail] = value\ntail += 1' },
    { sig: 'dequeue()', complexity: 'O(1)', code: 'value = arr[head]\nhead += 1\nreturn value' },
  ],
  'linked-list': [
    { sig: 'insertHead(value)', complexity: 'O(1)', code: 'node = Node(value)\nnode.next = head\nhead = node' },
    { sig: 'insertTail(value)', complexity: 'O(n)', code: 'node = Node(value)\nwalk to last node\nlast.next = node' },
    { sig: 'deleteHead()', complexity: 'O(1)', code: 'head = head.next' },
    { sig: 'deleteValue(v)', complexity: 'O(n)', code: 'prev = null, cur = head\nwhile cur.value != v:\n  prev = cur; cur = cur.next\nprev.next = cur.next' },
  ],
  bst: [
    {
      sig: 'insert(value)',
      complexity: 'O(log n) avg',
      code: 'if value < node.value:\n  recurse left\nelse:\n  recurse right\ninsert new leaf',
    },
    {
      sig: 'search(value)',
      complexity: 'O(log n) avg',
      code: 'while node:\n  if value == node.value: found\n  value < node.value ? left : right',
    },
    {
      sig: 'delete(value)',
      complexity: 'O(log n) avg',
      code: 'find node\nleaf -> remove\n1 child -> splice\n2 children -> swap with\n  in-order successor, delete it',
    },
  ],
  array: [
    { sig: 'access(i)', complexity: 'O(1)', code: 'return arr[i]' },
    { sig: 'insertAt(i, value)', complexity: 'O(n)', code: 'shift arr[i..] right by 1\narr[i] = value' },
    { sig: 'removeAt(i)', complexity: 'O(n)', code: 'shift arr[i+1..] left by 1\nlength -= 1' },
  ],
}

export function CodePanel({ structure }: { structure: StructureId }) {
  const docs = DOCS[structure]
  return (
    <div className="p-3 space-y-3 overflow-y-auto">
      <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Methods
      </div>
      {docs.map((d) => (
        <div key={d.sig} className="rounded-md border border-zinc-800 bg-zinc-900/60 p-2.5">
          <div className="flex items-baseline justify-between gap-2">
            <code className="text-indigo-300 text-sm font-semibold">{d.sig}</code>
            <span className="text-[10px] text-zinc-500 font-mono">{d.complexity}</span>
          </div>
          <pre className="mt-1.5 text-[11px] leading-relaxed text-zinc-400 font-mono whitespace-pre-wrap">
{d.code}
          </pre>
        </div>
      ))}
    </div>
  )
}
