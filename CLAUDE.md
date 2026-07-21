# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`) then production build via Vite
- `npm run preview` — preview the production build locally
- `npm run lint` — run Oxlint (config in `.oxlintrc.json`)

There is no test suite configured in this project.

## Architecture

This is a client-only React + react-three-fiber app that visualizes classic data structures (Stack, Queue, Linked List, BST, Array) as animated 3D scenes. `App.tsx` holds the selected `StructureId` (from [src/types.ts](src/types.ts)) and swaps between the five top-level views based on the sidebar selection.

Each data structure follows the same three-layer pattern, split across three directories:

1. **Hook** — `src/structures/hooks/use<Structure>.ts` owns all state and operations (e.g. `useStack` exposes `push`, `pop`, `clear`). Every mutating call logs a `call` entry then a `result`/`error` entry via `useLog`, and flashes affected node(s) to a transient `NodeStatus` (`'new' | 'removing' | 'visiting' | 'found'`, etc.) via `useHighlights`. `useHighlights.flash(id, status, ms)` sets a status and auto-reverts it after `ms` — this is what drives the "just changed" visual pulse. IDs are generated with a module-level incrementing counter per structure (e.g. `st-1`, `st-2`), not derived from values, so duplicate values are safe.
2. **View** — `src/structures/<Structure>View.tsx` renders the operation controls (buttons/inputs from [src/ui/Fields.tsx](src/ui/Fields.tsx) and [src/ui/Button.tsx](src/ui/Button.tsx)) and computes a `PosMap` (id → `[x,y,z]`) describing where each node belongs given the current state, then renders `Node3D`/`Edge3D` per node.
3. **Layout/Scene** — every view wraps its 3D content in `StructureLayout` ([src/ui/StructureLayout.tsx](src/ui/StructureLayout.tsx)), which provides the shared `Scene` (camera, lighting, grid — [src/three/Scene.tsx](src/three/Scene.tsx)), the color legend overlay, the `CodePanel` (static pseudocode + Big-O per structure, hardcoded in [src/ui/CodePanel.tsx](src/ui/CodePanel.tsx)), and the `OperationLog` (renders the hook's log entries).

Position animation is decoupled from React state updates: `useAnimatedPositions` ([src/three/useAnimatedPositions.ts](src/three/useAnimatedPositions.ts)) takes a target `PosMap` and, on every `useFrame` tick, damps each node's current position toward its target using `THREE.MathUtils.damp`. Views pass the *target* positions computed from state; the hook interpolates. When a node is removed from state, its position is simply dropped (no exit animation) — hooks that want a visible removal instead schedule the state removal after a `setTimeout` (see `useStack.pop`, which flashes `'removing'` for 320ms before actually filtering the item out).

To add a new data structure: add its `StructureId` and metadata to `STRUCTURES` in [src/types.ts](src/types.ts), create a hook under `src/structures/hooks/` following the `useStack`/`useHighlights`/`useLog` pattern, create a `<Name>View.tsx` that lays out node positions and renders `Node3D`/`Edge3D`, add its pseudocode entries to `DOCS` in [src/ui/CodePanel.tsx](src/ui/CodePanel.tsx), and wire it into the `App.tsx` switch and `Sidebar`.

## Styling

Tailwind CSS 4 via `@tailwindcss/vite` (no separate Tailwind config file — see [vite.config.ts](vite.config.ts)). UI is dark-themed (zinc/indigo palette) to match the 3D scene background.
