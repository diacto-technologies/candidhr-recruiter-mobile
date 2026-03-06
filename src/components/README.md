# Components - Atomic Design Structure

This directory follows the **Atomic Design** methodology, organizing components into three main categories: **Atoms**, **Molecules**, and **Organisms**.

## Structure

```
components/
├── atoms/          # Basic building blocks
├── molecules/      # Simple combinations of atoms
├── organisms/      # Complex components
└── index.ts        # Barrel export for all components
```

## Atoms

**Atoms** are the smallest, most basic building blocks of the UI. They cannot be broken down further and serve as the foundation for all other components.

### Available Atoms:
- `Button` - Primary button component
- `Typography` - Text component with variants
- `TextField` - Input field component
- `IconButton` - Icon-only button
- `StatusBar` - Status bar component
- `VectorIcon` - Vector icon wrapper
- `Shimmer` - Loading skeleton component
- `ScalePress` - Pressable with scale animation

### Usage:
```typescript
import { Button, Typography, TextField } from '../../components';
```

## Molecules

**Molecules** are simple combinations of atoms that form a functional unit. They are reusable and can be combined to create more complex components.

### Available Molecules:
- `StatCard` - Statistics display card
- `FilterOptionItem` - Filter option item
- `LocationChip` - Location chip component
- `ThreeDotDropdown` - Three-dot menu dropdown

### Usage:
```typescript
import { StatCard, FilterOptionItem } from '../../components';
```

## Organisms

**Organisms** are complex components made up of molecules and/or atoms. They form distinct sections of the interface and are typically feature-specific.

### Available Organisms:
- `Header` - Application header
- `BottomSheet` - Bottom sheet modal
- `ModalBox` - Modal dialog box
- `ApplicantList` - Applicant list component
- `ApplicationStageChart` - Application stage chart
- `ApplicationStageOverview` - Application stage overview
- `FeatureConsumptionChart` - Feature consumption chart
- `FilterSheetContent` - Filter sheet content
- `JobCardList` - Job card list
- `SortingAndFilter` - Sorting and filter component

### Usage:
```typescript
import { Header, BottomSheet, JobCardList } from '../../components';
```

## Importing Components

### Recommended: Barrel Import
```typescript
import { Button, Typography, Header, StatCard } from '../../components';
```

### Specific Category Import
```typescript
import { Button, Typography } from '../../components/atoms';
import { StatCard } from '../../components/molecules';
import { Header } from '../../components/organisms';
```

## Adding New Components

### Adding an Atom
1. Create component in `atoms/[componentName]/`
2. Add export to `atoms/index.ts`
3. Component should be a single, reusable UI element

### Adding a Molecule
1. Create component in `molecules/[componentName]/`
2. Add export to `molecules/index.ts`
3. Component should combine 2+ atoms

### Adding an Organism
1. Create component in `organisms/[componentName]/`
2. Add export to `organisms/index.ts`
3. Component should be a complex, feature-specific UI section

## Best Practices

1. **Keep atoms simple** - They should do one thing well
2. **Compose molecules from atoms** - Don't duplicate atom logic
3. **Build organisms from molecules** - Reuse existing molecules when possible
4. **Use barrel exports** - Import from main `components` index for cleaner code
5. **Maintain consistency** - Follow existing patterns and naming conventions

## Component Structure

Each component should follow this structure:
```
[componentName]/
├── index.tsx          # Component implementation
├── [componentName].d.ts  # TypeScript types (if needed)
└── styles.ts          # Component styles (if needed)
```

