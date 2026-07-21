import type { ReactNode } from 'react'

export function ControlGroup({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      {label && <span className="text-xs text-zinc-500 mr-0.5">{label}</span>}
      {children}
    </div>
  )
}

export function NumberField({
  value,
  onChange,
  width = 'w-16',
}: {
  value: number
  onChange: (v: number) => void
  width?: string
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`${width} rounded-md bg-zinc-800 border border-zinc-700 px-2 py-1.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500`}
    />
  )
}

export function Divider() {
  return <div className="w-px self-stretch bg-zinc-800 mx-1" />
}
