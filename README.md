# MemeMaker

## **[mememakr.app](https://mememakr.app)**

A modern, interactive web application for creating and editing memes with drag-and-drop functionality, built with React, TypeScript, and Redux Toolkit.

## 🎯 What It Does

- **Makes memes** by combining images and text
- **Drag and resize elements** with intuitive transform controls
- **Layer management** with bring-to-front/send-to-back functionality
- **Rich text editing** with font family, size, color, and styling options
- **Image manipulation** with opacity controls and dimension management
- **Pan and zoom canvas** for precise editing
- **Copy/paste functionality** for duplicating elements

## 🏗️ Architecture

### Feature-Sliced Design (FSD)

This project follows **Feature-Sliced Design** principles, organizing code by business domains rather than technical layers:

```
src/
├── app/           # Application-level setup (store, providers, global styles)
├── pages/         # Page-level components and logic
├── entities/      # Business entities (meme, image, text models)
├── shared/        # Reusable UI components and utilities
└── test/          # Testing utilities and configurations
```

### Key Architectural Decisions

#### 1. **Redux Slice Factory Pattern**

- Uses `makeMemeSlice()` factory for creating reusable slice definitions
- Enables flexible slice instantiation with different names
- Centralizes meme state management logic

```typescript
const memeSlice = makeMemeSlice("meme")
```

#### 2. **Absolute Import System**

- All imports use `src/` prefix for clean, traceable dependencies
- Configured in `vite.config.ts` and `tsconfig.app.json`
- Prevents relative import hell and makes refactoring easier

```typescript
import { useAppDispatch } from "src/app/hooks"
import type { MemeImage } from "src/entities/meme"
```

#### 3. **Typed Redux Integration**

- Custom typed hooks (`useAppDispatch`, `useAppSelector`) in `src/app/hooks.ts`
- ESLint rules enforce usage of typed hooks over raw Redux hooks
- Type-safe state management throughout the application

#### 4. **Styled Components with CSS Custom Properties**

- Component-level styling with styled-components
- CSS custom properties for consistent theming
- Responsive design with CSS Grid and Flexbox

#### 5. **Transform Controls System**

- Complex drag/resize implementation in `src/shared/ui/TransformControls/`
- Pointer events with capture for reliable interactions
- Snap boundaries when moving or resizing

#### 6. **Canvas Architecture**

- `AdjustableView` class component for pan/zoom functionality
- Layer-based rendering with z-index management
- Transform controls overlay for selected elements

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **State Management**: Redux Toolkit with RTK Query
- **Styling**: Styled Components + CSS Custom Properties
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier with strict TypeScript rules

## 🚀 Development Scripts

```bash
npm run dev      # Start development server with --host flag
npm run build    # TypeScript compilation + Vite build
npm run test     # Run Vitest tests
npm run lint     # ESLint with TypeScript strict checking
npm run format   # Prettier formatting
```

## 📁 Project Structure

### `src/app/`

Application initialization, store configuration, and global providers.

### `src/pages/mememaker/`

Main meme editing interface with:

- Canvas rendering and interaction logic
- Toolbar components for editing controls
- Context menus for element actions

### `src/entities/meme/`

Core business logic:

- **Slice Factory**: `makeMemeSlice.ts` - Reusable Redux slice creation
- **Models**: Type definitions for meme layers, images, and text
- **Selectors**: Computed state for meme dimensions and content

### `src/shared/ui/`

Reusable UI components:

- **TransformControls**: Drag/resize handles with snap boundaries
- **TextEditor**: Rich text editing with contentEditable
- **AdjustableView**: Pan/zoom canvas container
- **Inputs**: Form controls (Button, RangeInput, ColorInput)
- **ContextMenu**: Right-click menu system

### `src/shared/lib/`

Utility functions and helpers:

- **FontDetector**: Cross-platform font availability detection
- **Helpers**: Color manipulation and mathematical utilities

## 🧪 Testing Strategy

- **Unit Tests**: Component behavior and Redux slice logic
- **Integration Tests**: Multi-component interactions
- **E2E Tests**: Full application workflows
- **Type Safety**: Strict TypeScript with exhaustive dependency checking
