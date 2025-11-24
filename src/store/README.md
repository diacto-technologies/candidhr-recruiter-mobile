# Redux Store Structure

This directory contains the Redux store configuration using Redux Toolkit and Redux Saga in an atomic structure.

## Structure

```
store/
├── index.ts          # Store configuration with middleware
├── rootReducer.ts    # Combined reducers from all features
├── rootSaga.ts       # Combined sagas from all features
└── hooks.ts          # Typed Redux hooks (useAppDispatch, useAppSelector)
```

## Usage

### In Components

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginRequestAction, selectUser } from '../features/auth';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  
  const handleLogin = () => {
    dispatch(loginRequestAction({ email: 'user@example.com', password: 'password' }));
  };
  
  return <View>...</View>;
};
```

### Adding a New Feature

1. Create feature folder in `src/features/[featureName]/`
2. Add reducer to `rootReducer.ts`
3. Add saga to `rootSaga.ts`
4. Follow the atomic structure pattern (see `src/features/auth/` for reference)

