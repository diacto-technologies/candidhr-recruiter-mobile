# Features - Atomic Structure

Each feature follows an atomic structure pattern, making it self-contained and easy to maintain.

## Feature Structure

```
features/
└── [featureName]/
    ├── index.ts          # Barrel file - public exports
    ├── types.ts          # TypeScript types and interfaces
    ├── slice.ts          # Redux Toolkit slice (reducers + actions)
    ├── saga.ts           # Redux Saga watchers and workers
    ├── actions.ts        # Action creators for saga triggers
    ├── selectors.ts      # Memoized selectors using createSelector
    ├── api.ts            # Feature-specific API calls
    └── constants.ts      # Action type constants
```

## Available Features

### Auth (`src/features/auth/`)
- User authentication (login, register, logout)
- Token management
- User state management

### Profile (`src/features/profile/`)
- User profile management
- Profile updates
- Avatar management

### Jobs (`src/features/jobs/`)
- Job listing and pagination
- Job CRUD operations
- Job detail management

### Applications (`src/features/applications/`)
- Application listing
- Application status management
- Application creation

## Creating a New Feature

1. **Create the feature folder structure:**
   ```bash
   mkdir -p src/features/[featureName]
   ```

2. **Create all required files:**
   - `types.ts` - Define your state and request/response types
   - `constants.ts` - Define action type constants
   - `slice.ts` - Create Redux Toolkit slice
   - `selectors.ts` - Create memoized selectors
   - `api.ts` - Define API calls
   - `actions.ts` - Create action creators
   - `saga.ts` - Create saga watchers and workers
   - `index.ts` - Export public API

3. **Add to rootReducer.ts:**
   ```typescript
   import [featureName]Reducer from "../features/[featureName]/slice";
   
   const rootReducer = combineReducers({
     // ... other reducers
     [featureName]: [featureName]Reducer,
   });
   ```

4. **Add to rootSaga.ts:**
   ```typescript
   import { [featureName]Saga } from '../features/[featureName]/saga';
   
   export default function* rootSaga() {
     yield all([
       // ... other sagas
       [featureName]Saga(),
     ]);
   }
   ```

## Example: Using a Feature

```typescript
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  getJobsRequestAction, 
  selectJobs, 
  selectJobsLoading 
} from '../../features/jobs';

const JobsScreen = () => {
  const dispatch = useAppDispatch();
  const jobs = useAppSelector(selectJobs);
  const loading = useAppSelector(selectJobsLoading);
  
  useEffect(() => {
    dispatch(getJobsRequestAction({ page: 1, limit: 10 }));
  }, [dispatch]);
  
  return (
    <View>
      {loading ? <Text>Loading...</Text> : jobs.map(job => ...)}
    </View>
  );
};
```

