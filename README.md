# Data Structures, in 3D

An interactive 3D visualizer for classic data structures — Stack, Queue, Linked List, Binary Search Tree, and Array — built with React, react-three-fiber, and Tailwind CSS.

Pick a structure from the sidebar, trigger operations (`push`, `pop`, `insert`, `search`, ...), and watch nodes animate to their new positions in a 3D scene. Each view pairs the visualization with a pseudocode panel (method signatures + Big-O) and a running operation log, so you can see the call, its effect, and the code side by side.

**Live demo:** [datastructures-3d.vercel.app](https://datastructures-3d.vercel.app)

## Getting started

```
npm install
npm run dev
```

Then open the printed local URL in your browser.

## Scripts

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`) and build for production
- `npm run preview` — preview the production build locally
- `npm run lint` — run Oxlint

## How it works

Each data structure has:

- A **hook** in [src/structures/hooks/](src/structures/hooks/) (`useStack`, `useQueue`, `useLinkedList`, `useBST`, `useArray`) holding the structure's state, its operations, and a log of calls/results.
- A **view** in [src/structures/](src/structures/) (`StackView`, `QueueView`, ...) that renders controls for the operations and maps state to 3D node positions.
- Shared 3D primitives in [src/three/](src/three/) — `Scene` (camera/lighting/grid), `Node3D`/`Edge3D`, and `useAnimatedPositions`, which smoothly damps nodes toward their target positions on every frame instead of snapping.

Transient state changes (e.g. "this node was just pushed" or "currently being visited during search") are tracked via `useHighlights`, which flashes a node's status for a set duration and reverts it automatically.

The right-hand panel is `StructureLayout`, shared by every view: it shows `CodePanel` (static pseudocode/complexity per structure, defined in [src/ui/CodePanel.tsx](src/ui/CodePanel.tsx)) and `OperationLog` (the live call/result feed from the structure's hook).

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [react-three-fiber](https://docs.pmnd.rs/react-three-fiber) + [drei](https://github.com/pmndrs/drei) for the 3D scene
- [Tailwind CSS 4](https://tailwindcss.com/) for styling
- [Vite](https://vite.dev/) for dev/build tooling, [Oxlint](https://oxc.rs/) for linting
