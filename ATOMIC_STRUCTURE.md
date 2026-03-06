# Atomic Structure Documentation

This project follows **Atomic Design** principles for organizing code, making it scalable, maintainable, and easy to navigate.

## Project Structure

```
src/
├── components/        # UI Components (Atomic Design)
│   ├── atoms/        # Basic building blocks
│   ├── molecules/    # Simple combinations
│   └── organisms/    # Complex components
├── features/         # Feature modules (Redux)
│   ├── auth/
│   ├── profile/
│   ├── jobs/
│   └── applications/
├── store/            # Redux store configuration
│   ├── index.ts
│   ├── rootReducer.ts
│   ├── rootSaga.ts
│   └── hooks.ts
├── api/              # API client and endpoints
│   ├── client.ts
│   └── endpoints.ts
├── screens/          # Screen components
│   ├── auth/
│   └── applications/
├── navigation/       # Navigation configuration
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── theme/            # Theme configuration
└── assets/           # Static assets
```

## Atomic Design Principles

### 1. Atoms
**Location:** `src/components/atoms/`

Basic, indivisible UI elements that cannot be broken down further.

**Examples:**
- Button
- Typography
- TextField
- IconButton
- StatusBar

### 2. Molecules
**Location:** `src/components/molecules/`

Simple combinations of atoms that form functional units.

**Examples:**
- StatCard (combines Typography, icons, Pressable)
- FilterOptionItem
- LocationChip

### 3. Organisms
**Location:** `src/components/organisms/`

Complex components made from molecules and atoms, forming distinct interface sections.

**Examples:**
- Header
- BottomSheet
- JobCardList
- ApplicantList

## Feature-Based Redux Structure

Each feature follows a consistent atomic structure:

```
features/[featureName]/
├── index.ts          # Barrel export
├── types.ts          # TypeScript types
├── slice.ts          # Redux Toolkit slice
├── saga.ts           # Redux Saga watchers/workers
├── actions.ts        # Action creators
├── selectors.ts      # Memoized selectors
├── api.ts            # Feature API calls
└── constants.ts      # Action constants
```

## Benefits of Atomic Structure

1. **Scalability** - Easy to add new components and features
2. **Maintainability** - Clear organization makes code easy to find and update
3. **Reusability** - Components are designed to be reused across the app
4. **Testability** - Each level can be tested independently
5. **Consistency** - Standardized patterns across the codebase
6. **Developer Experience** - Clear structure helps new developers onboard quickly

## Import Patterns

### Components
```typescript
// Recommended: Barrel import
import { Button, Typography, Header } from '../../components';

// Or specific category
import { Button } from '../../components/atoms';
import { StatCard } from '../../components/molecules';
import { Header } from '../../components/organisms';
```

### Features
```typescript
// Recommended: Barrel import
import { loginRequestAction, selectUser } from '../../features/auth';

// Or specific exports
import { loginRequestAction } from '../../features/auth/actions';
import { selectUser } from '../../features/auth/selectors';
```

### Store
```typescript
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { store, persistor } from '../../store';
```

## Adding New Features

1. **Create feature folder** in `src/features/[featureName]/`
2. **Add all required files** (types, slice, saga, actions, selectors, api, constants)
3. **Update rootReducer.ts** to include new reducer
4. **Update rootSaga.ts** to include new saga
5. **Export from feature/index.ts** for easy imports

## Adding New Components

1. **Determine component level** (atom, molecule, or organism)
2. **Create component folder** in appropriate directory
3. **Add component files** (index.tsx, types, styles)
4. **Export from category index.ts**
5. **Update main components/index.ts** if needed

## Best Practices

1. **Keep atoms simple** - Single responsibility
2. **Compose, don't duplicate** - Build molecules from atoms, organisms from molecules
3. **Use TypeScript** - Define types for all components and features
4. **Follow naming conventions** - Use PascalCase for components, camelCase for functions
5. **Document complex logic** - Add comments for non-obvious code
6. **Maintain consistency** - Follow existing patterns

## File Naming Conventions

- **Components:** PascalCase (e.g., `Button.tsx`, `StatCard.tsx`)
- **Utilities:** camelCase (e.g., `hexToRgb.ts`, `renderNode.ts`)
- **Types:** camelCase with `.d.ts` extension (e.g., `button.d.ts`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `AUTH_ACTION_TYPES`)

## Resources

- [Atomic Design by Brad Frost](https://atomicdesign.bradfrost.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Redux Saga Documentation](https://redux-saga.js.org/)

