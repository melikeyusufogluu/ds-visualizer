import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'danger' | 'ghost'

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white disabled:bg-zinc-700',
  danger: 'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white disabled:bg-zinc-700',
  ghost: 'bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 text-zinc-100 disabled:bg-zinc-800',
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  )
}
