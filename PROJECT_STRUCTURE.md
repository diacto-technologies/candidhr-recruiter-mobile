# Project Structure - CandidHR

This document describes the complete folder structure and organization of the CandidHR React Native application.

## 📁 Root Structure

```
candidhr/
├── android/                 # Android native code
├── ios/                     # iOS native code
├── src/                     # Source code (main application)
├── __tests__/              # Test files
├── .editorconfig           # Editor configuration
├── .eslintrc.js            # ESLint configuration
├── .prettierrc.js          # Prettier configuration
├── .prettierignore         # Prettier ignore patterns
├── .nvmrc                  # Node version specification
├── babel.config.js         # Babel configuration
├── metro.config.js         # Metro bundler configuration
├── jest.config.js          # Jest test configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── react-native.config.js  # React Native configuration
└── README.md               # Project documentation
```

## 📂 Source Code Structure (`src/`)

```
src/
├── api/                    # API client and endpoints
│   ├── client.ts          # API client (fetch wrapper)
│   └── endpoints.ts       # API endpoint constants
│
├── assets/                 # Static assets
│   ├── animations/        # Lottie animations
│   ├── fonts/             # Custom fonts
│   ├── icons/             # Icon images
│   ├── images/            # Image assets
│   └── svg/               # SVG icon components
│
├── components/             # UI Components (Atomic Design)
│   ├── atoms/             # Basic building blocks
│   │   ├── button/
│   │   ├── typography/
│   │   ├── textfield/
│   │   ├── iconbutton/
│   │   ├── statusbar/
│   │   ├── vectoricon/
│   │   ├── shimmer/
│   │   └── scalepress/
│   │
│   ├── molecules/         # Simple combinations
│   │   ├── statcard/
│   │   ├── filteroptionitem.tsx
│   │   ├── locationchip.tsx
│   │   └── threedotdropdown/
│   │
│   ├── organisms/         # Complex components
│   │   ├── header/
│   │   ├── bottomsheet/
│   │   ├── modalbox/
│   │   ├── applicantlist/
│   │   ├── applicationstagechart/
│   │   ├── applicationstageoverview/
│   │   ├── featureconsumptionchart/
│   │   ├── filtersheetcontent/
│   │   ├── jobs/
│   │   └── sortingandfilter/
│   │
│   ├── index.ts           # Barrel export
│   └── README.md          # Component documentation
│
├── config/                 # Application configuration
│   └── index.ts           # App config (API, features, etc.)
│
├── constants/              # Application constants
│   ├── index.ts           # Barrel export
│   ├── routes.ts          # Navigation route constants
│   └── app.ts             # App-wide constants
│
├── features/               # Redux features (Atomic Structure)
│   ├── auth/              # Authentication feature
│   │   ├── index.ts       # Barrel export
│   │   ├── types.ts       # TypeScript types
│   │   ├── slice.ts       # Redux Toolkit slice
│   │   ├── saga.ts        # Redux Saga watchers/workers
│   │   ├── actions.ts     # Action creators
│   │   ├── selectors.ts   # Memoized selectors
│   │   ├── api.ts         # Feature API calls
│   │   └── constants.ts   # Action constants
│   │
│   ├── profile/           # Profile feature
│   ├── jobs/              # Jobs feature
│   ├── applications/      # Applications feature
│   └── README.md          # Feature documentation
│
├── hooks/                  # Custom React hooks
│   ├── useAppDispatch.ts
│   ├── useAppSelector.ts
│   ├── useDebounce.ts
│   ├── useThrottle.ts
│   ├── useToggle.ts
│   ├── useIsForeground.ts
│   ├── useRNSafeAreaInsets.ts
│   ├── useWebSocketBadge.ts
│   └── use-push-notifications.ts
│
├── navigation/             # Navigation configuration
│   ├── index.tsx          # Main navigation setup
│   ├── bottomtabs.tsx     # Bottom tab configuration
│   ├── customtabbar.tsx   # Custom tab bar component
│   └── TabIcon.tsx        # Tab icon component
│
├── screens/                # Screen components
│   ├── auth/              # Authentication screens
│   │   ├── splashscreen/
│   │   └── loginscreen/
│   │
│   └── applications/      # Application screens
│       ├── dashboard/
│       ├── jobs/
│       ├── applicant/
│       └── profile/
│
├── store/                  # Redux store configuration
│   ├── index.ts           # Store setup
│   ├── rootReducer.ts     # Combined reducers
│   ├── rootSaga.ts        # Combined sagas
│   ├── hooks.ts           # Typed Redux hooks
│   └── README.md          # Store documentation
│
├── theme/                  # Theme configuration
│   ├── colors.ts          # Color palette
│   ├── fonts.ts           # Font definitions
│   └── theme.d.ts         # Theme types
│
├── types/                  # Global TypeScript types
│   ├── index.ts           # Barrel export
│   ├── common.ts          # Common types
│   ├── navigation.ts      # Navigation types
│   └── images.d.ts        # Image type declarations
│
└── utils/                  # Utility functions
    ├── constants.ts       # Utility constants
    ├── devicelayout.ts    # Device layout helpers
    ├── hexToRgb.ts        # Color utilities
    ├── navigationUtils.ts # Navigation helpers
    ├── renderNode.ts      # Render utilities
    ├── useKeyboardOffsetHeight.ts
    └── dummaydata.ts      # Mock data (dev only)
```

## 🏗️ Architecture Principles

### 1. Atomic Design (Components)
- **Atoms**: Basic, indivisible UI elements
- **Molecules**: Simple combinations of atoms
- **Organisms**: Complex components from molecules/atoms

### 2. Feature-Based Redux
Each feature is self-contained with:
- Types, Slice, Saga, Actions, Selectors, API, Constants

### 3. Separation of Concerns
- **Components**: UI presentation
- **Features**: Business logic and state
- **Utils**: Reusable utilities
- **Config**: Application configuration
- **Constants**: Static values

## 📝 Naming Conventions

### Files & Folders
- **Components**: PascalCase (`Button.tsx`, `StatCard.tsx`)
- **Utilities**: camelCase (`hexToRgb.ts`, `renderNode.ts`)
- **Types**: camelCase with `.d.ts` (`button.d.ts`)
- **Constants**: UPPER_SNAKE_CASE (`AUTH_ACTION_TYPES`)

### Code
- **Components**: PascalCase (`const Button = () => {}`)
- **Functions**: camelCase (`const handleClick = () => {}`)
- **Constants**: UPPER_SNAKE_CASE (`const API_BASE_URL = ''`)
- **Types/Interfaces**: PascalCase (`interface User {}`)

## 🔧 Configuration Files

### `.prettierrc.js`
Code formatting configuration

### `.eslintrc.js`
Linting rules and TypeScript support

### `.editorconfig`
Editor settings for consistency

### `.nvmrc`
Node version specification (v20)

### `tsconfig.json`
TypeScript compiler configuration

## 📦 Package Scripts

```bash
# Development
npm start              # Start Metro bundler
npm run android        # Run on Android
npm run ios            # Run on iOS

# Code Quality
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint errors
npm run format         # Format code with Prettier
npm run format:check   # Check code formatting
npm run type-check     # TypeScript type checking

# Testing
npm test               # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Generate test coverage

# Cleanup
npm run clean          # Clean node_modules
npm run clean:android  # Clean Android build
npm run clean:ios      # Clean iOS build
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **iOS Setup** (macOS only)
   ```bash
   cd ios && bundle exec pod install && cd ..
   ```

3. **Start Development**
   ```bash
   npm start
   npm run android  # or npm run ios
   ```

## 📚 Documentation

- `ATOMIC_STRUCTURE.md` - Atomic design principles
- `src/components/README.md` - Component documentation
- `src/features/README.md` - Feature documentation
- `src/store/README.md` - Redux store documentation

## 🔄 Migration Notes

### Old Structure → New Structure

- `src/states/` → `src/store/` (Redux store)
- `src/helper/` → `src/utils/` (Consolidated utilities)
- `src/components/[component]/` → `src/components/[atoms|molecules|organisms]/[component]/`

## 📋 Best Practices

1. **Import from barrel exports** when possible
2. **Use typed hooks** (`useAppDispatch`, `useAppSelector`)
3. **Follow atomic design** for component organization
4. **Keep features self-contained** with all related files
5. **Use TypeScript** for type safety
6. **Write tests** for critical functionality
7. **Follow naming conventions** consistently

## 🎯 Future Improvements

- [ ] Add Storybook for component documentation
- [ ] Set up CI/CD pipeline
- [ ] Add E2E testing with Detox
- [ ] Implement error boundary components
- [ ] Add performance monitoring
- [ ] Set up code generation for features

