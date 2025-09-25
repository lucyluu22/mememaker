# MemeMaker AI Coding Instructions

## Architecture Overview

This is a **Feature-Sliced Design (FSD) inspired** React application built with Vite, TypeScript, and Redux Toolkit. The project creates interactive memes with drag-and-drop image manipulation.

### Key Architectural Patterns

- **Absolute imports with `src/` alias** - All imports use `src/` paths (configured in `vite.config.ts` and `tsconfig.app.json`)
- **Feature-based folder structure** - Code organized by domain (`entities/`, `pages/`, `shared/`)
- **Redux slice factories** - The `makeMemeSlice()` pattern allows creating reusable slice definitions
- **Typed Redux hooks** - Always use `useAppDispatch`/`useAppSelector` from `src/app/hooks.ts`, never raw Redux hooks

## Core Components

### State Management

- **Store setup**: Single store in `src/app/model/store.ts` with combined reducers from pages
- **Slice pattern**: Each feature has its own slice (e.g., `memeSlice`, `memeCanvasSlice`)
- **Selectors**: Use RTK's `createSelector` for derived state and memoization

### UI Patterns

- **Styled Components**: Primary styling approach with CSS custom properties for theming
- **Transform controls**: Complex drag/resize system in `src/shared/ui/TransformControls/`
- **Context menus**: Custom implementation using `useContextMenu` hook pattern
- **Adjustable view**: Pan/zoom canvas using class component `AdjustableView`

## Development Workflow

### Scripts

- `npm run dev` - Start development server with `--host` flag
- `npm run build` - TypeScript compilation + Vite build
- `npm run test` - Run Vitest tests
- `npm run lint` - ESLint with TypeScript strict checking
- `npm run format` - Prettier formatting

### Code Quality

- **ESLint**: Strict TypeScript rules with import restrictions for Redux hooks
- **Prettier**: No semicolons, trailing commas, 100 char width
- **TypeScript**: Strict mode with exhaustive dependency checking

## Project-Specific Conventions

### Import Patterns

```typescript
// Always use absolute paths with src/ alias
import { useAppDispatch } from "src/app/hooks"
import type { MemeImage } from "src/entities/meme"

// Type-only imports are enforced
import type { JSX } from "react"
```

### Component Structure

- **Props interfaces**: Define interfaces above components
- **Styled components**: Use template literals with CSS custom properties
- **Ref patterns**: Use `useRef` for DOM manipulation and imperative APIs

### State Updates

- **Image manipulation**: Use `updateImage` action with partial updates
- **Transform controls**: Snap boundaries calculated via `getSnapBoundaries()`
- **Canvas zoom**: Inverse scale calculations for UI consistency

### Touch/Mobile Support

- **Long press detection**: `useLongPress` hook for context menus
- **Transform handles**: Responsive sizing via CSS custom properties
- **Pan gestures**: Multi-touch support in `AdjustableView`

## Key Files to Reference

- `src/shared/ui/TransformControls/` - Complex drag/resize implementation
- `src/entities/meme/model/makeMemeSlice.ts` - Redux slice factory pattern
- `src/pages/mememaker/ui/MemeCanvas.tsx` - Main canvas orchestration
- `src/app/hooks.ts` - Typed Redux hooks (mandatory usage)
- `src/shared/ui/AdjustableView/` - Pan/zoom canvas implementation

## Anti-Patterns to Avoid

- Don't use raw `useDispatch`/`useSelector` - ESLint will block this
- Don't break the FSD folder structure - keep features isolated
- Don't use relative imports for cross-feature dependencies
- Don't modify `AdjustableView` class component - complex state management
