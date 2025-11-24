# CandidHR - React Native Application

A modern React Native application built with TypeScript, Redux Toolkit, and Redux Saga, following atomic design principles.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20 (see `.nvmrc`)
- React Native development environment set up
- iOS: Xcode and CocoaPods
- Android: Android Studio and JDK

### Installation

```bash
# Install dependencies
npm install

# iOS setup (macOS only)
cd ios && bundle exec pod install && cd ..
```

### Running the App

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## 📁 Project Structure

This project follows **Atomic Design** principles and feature-based architecture:

```
src/
├── components/     # UI Components (atoms, molecules, organisms)
├── features/       # Redux features (auth, profile, jobs, applications)
├── store/          # Redux store configuration
├── screens/        # Screen components
├── navigation/     # Navigation setup
├── api/            # API client and endpoints
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── theme/          # Theme configuration
├── types/          # TypeScript types
└── config/         # App configuration
```

For detailed structure, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

## 🏗️ Architecture

### Atomic Design
- **Atoms**: Basic UI elements (Button, Typography, TextField)
- **Molecules**: Simple combinations (StatCard, FilterOptionItem)
- **Organisms**: Complex components (Header, BottomSheet, JobCardList)

### State Management
- **Redux Toolkit** for state management
- **Redux Saga** for side effects
- **Redux Persist** for state persistence
- Feature-based slices with atomic structure

### Tech Stack
- React Native 0.82.1
- TypeScript 5.8.3
- Redux Toolkit + Redux Saga
- React Navigation 7.x
- React Native SVG
- React Native Vector Icons

## 📝 Available Scripts

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

## 📚 Documentation

- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Complete project structure
- [ATOMIC_STRUCTURE.md](./ATOMIC_STRUCTURE.md) - Atomic design principles
- [src/components/README.md](./src/components/README.md) - Component documentation
- [src/features/README.md](./src/features/README.md) - Feature documentation
- [src/store/README.md](./src/store/README.md) - Redux store documentation

## 🎨 Code Style

This project uses:
- **ESLint** for linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **EditorConfig** for editor consistency

Configuration files:
- `.eslintrc.js` - ESLint rules
- `.prettierrc.js` - Prettier configuration
- `.editorconfig` - Editor settings
- `tsconfig.json` - TypeScript configuration

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📦 Building

### Android
```bash
cd android
./gradlew assembleRelease
```

### iOS
```bash
cd ios
xcodebuild -workspace candidhr.xcworkspace -scheme candidhr -configuration Release
```

## 🤝 Contributing

1. Follow the atomic design structure
2. Use TypeScript for all new code
3. Write tests for new features
4. Follow the naming conventions
5. Run linting and formatting before committing

## 📄 License

Private project

## 🔗 Resources

- [React Native Documentation](https://reactnative.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Redux Saga Documentation](https://redux-saga.js.org/)
- [React Navigation Documentation](https://reactnavigation.org/)
- [Atomic Design by Brad Frost](https://atomicdesign.bradfrost.com/)
