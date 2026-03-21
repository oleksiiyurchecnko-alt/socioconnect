# Socioconnect architecture

## Overview

Socioconnect uses a domain-oriented Angular layout with strict boundaries enforced by Sheriff and ESLint. The architecture is deny-by-default: imports are allowed only when explicitly permitted by layer rules.

## Project structure

### Apps
- `apps/admin/` — Admin application
- `apps/main/` — End-user application

### Libs
- `libs/ui-components/` — Shared UI components (prefix `sc`)
- `libs/data-access/` — Shared data-access primitives
- `libs/types/` — Shared TypeScript types
- `libs/utils/` — Utility functions
- `libs/constants/` — App constants

### Domain layout inside apps

Each app is organized by domain:

```
apps/[app]/src/app/
├── app.ts
├── app.config.ts
├── app.routes.ts
└── domains/
    └── [domain]/
        ├── feature/     # Smart / container components
        ├── ui/          # Presentational components
        ├── data-access/ # Services, stores, resource orchestration
        ├── shell/       # Guards, interceptors, route-level logic when needed
        ├── types/       # Domain-only types
        ├── utils/       # Domain-only helpers
        └── constants/   # Domain-only constants
```

Only these folders are valid inside a domain.

### Angular component files

Each component should use **three files**: `*.component.ts`, `*.component.html`, `*.component.scss` (external template and styles, no inline `template` / `styles` in the decorator). Modern Angular syntax and AI agent rules are described in `.cursor/rules/angular-agent-generation.mdc`.

## Architecture layers

### 1. App (bootstrap surface)
- **Purpose**: Root component, `app.config.ts`, `app.routes.ts`, specs.
- **May import**:
  - `app.routes.ts`: `@angular/router` and domain feature entrypoints such as `./domains/dashboard/feature/dashboard-home`
  - `app.ts` / `app.config.ts` / `app.spec.ts`: Angular/RxJS, `./app.routes`, `@socioconnect/*`
- **Must not import**: another app, sibling domain internals through absolute workspace paths, or deep lib internals
- **Tags**: `type:app`, `scope:main | scope:admin`

### 2. Feature
- **Purpose**: Smart components, business orchestration
- **May import**:
  - same-domain `ui/`
  - same-domain `data-access/`
  - same-domain `types/`, `utils/`, `constants/`
  - shared libs `@socioconnect/ui-components`, `@socioconnect/data-access`, `@socioconnect/types`, `@socioconnect/utils`, `@socioconnect/constants`
- **Must not import**:
  - other domains
  - another feature slice in the same domain
- **Tags**: `domain:*`, `layer:feature`, `feature:*`

### 3. UI
- **Purpose**: Presentational components
- **May import**:
  - same-domain `ui/`
  - same-domain `types/`, `utils/`, `constants/`
  - shared libs `@socioconnect/ui-components`, `@socioconnect/types`, `@socioconnect/utils`, `@socioconnect/constants`
- **Must not import**:
  - `feature/`
  - `data-access/`
  - other domains
- **Tags**: `domain:*`, `layer:ui`

### 4. Data access
- **Purpose**: Services, stores, HTTP clients
- **May import**:
  - same-domain `data-access/`
  - same-domain `types/`, `utils/`, `constants/`
  - shared libs `@socioconnect/data-access`, `@socioconnect/types`, `@socioconnect/utils`, `@socioconnect/constants`
- **Must not import**:
  - `ui/`
  - `feature/`
  - other domains
- **Tags**: `domain:*`, `layer:data-access`

### 5. Shell
- **Purpose**: Guards, interceptors, route-level policies, adapter code that belongs to the domain boundary
- **May import**:
  - same-domain `data-access/`
  - same-domain `types/`, `utils/`, `constants/`
  - shared libs `@socioconnect/data-access`, `@socioconnect/types`, `@socioconnect/utils`, `@socioconnect/constants`
- **Must not import**:
  - `ui/`
  - `feature/`
  - other domains
- **Tags**: `domain:*`, `layer:shell`

### 6. Types
- **Purpose**: TypeScript types and interfaces
- **May import**:
  - same-domain `types/`
  - shared `@socioconnect/types`
- **Must not import**: everything else
- **Tags**: `domain:*`, `layer:types`

### 7. Utils
- **Purpose**: Helper functions
- **May import**:
  - same-domain `utils/`, `types/`, `constants/`
  - shared `@socioconnect/utils`, `@socioconnect/types`, `@socioconnect/constants`
- **Must not import**:
  - `ui/`
  - `feature/`
  - `data-access/`
- **Tags**: `domain:*`, `layer:utils`

### 8. Constants
- **Purpose**: Immutable domain constants
- **May import**:
  - same-domain `constants/`, `types/`
  - shared `@socioconnect/constants`, `@socioconnect/types`
- **Must not import**: everything else
- **Tags**: `domain:*`, `layer:constants`

## Shared libs

Libs live under:

- `libs/types`
- `libs/utils`
- `libs/constants`
- `libs/ui-components`
- `libs/data-access`

Rules:

- Libs must not depend on app code
- Libs must not depend on in-app domain code
- Import libs only through their public API aliases
- No deep imports like `@socioconnect/ui-components/src/...`

## Tag system

### Type tags (`type:`)
- `type:app`
- `type:libs`
- `type:e2e`

### Scope tags (`scope:`)
- `scope:admin`
- `scope:main`
- `scope:e2e-admin`
- `scope:e2e-main`

### Domain tags (`domain:`)
- `domain:<name>` for app domain code

### Layer tags (`layer:`)
- `layer:ui`
- `layer:feature`
- `layer:data-access`
- `layer:shell`
- `layer:types`
- `layer:utils`
- `layer:constants`

### Feature tags (`feature:`)
- `feature:<slice>` for feature isolation inside a domain

### Lib kind tags (`kind:`)
- `kind:types`
- `kind:utils`
- `kind:constants`
- `kind:ui`
- `kind:data-access`

## Dependency rules

Enforced rules:

1. **App isolation**: `main` and `admin` must not import from each other
2. **Domain isolation**: a domain may only import files from the same domain
3. **Layering**: each layer may only import the explicitly allowed lower-level layers
4. **Feature isolation**: a feature slice may not import another feature slice
5. **Public API imports**: prefer `index.ts` barrels and path aliases
6. **No deep relative imports**: `../../../` and deeper are blocked
7. **No deep lib imports**: `libs/*/src/**` and alias deep paths are blocked
8. **E2E isolation**: Playwright specs must not import from apps or libs
9. **Circular dependencies**: blocked by Nx/Sherriff boundary checks

## E2E

- `apps/e2e-admin` and `apps/e2e-main` interact only through the browser
- No imports from `apps/**`
- No imports from `libs/**`
- Use selectors, routes, and public UI behavior only

## Examples

### Valid imports
```typescript
import { DashboardSummaryService } from '../../data-access';
import { DashboardStatsPanelComponent } from '../../ui';
import { dashboardHeroTitle } from '../../utils';
import type { DashboardStatsSnapshot } from '../types';
import { ButtonComponent } from '@socioconnect/ui-components';
```

### Invalid imports (ESLint will fail)
```typescript
import { AuthStore } from '../../auth/data-access'; // ❌ cross-domain
import { DashboardPageComponent } from '../feature/dashboard-page.component'; // ❌ ui -> feature
import { DashboardStatsPanelComponent } from '../ui'; // ❌ data-access -> ui
import { ButtonComponent } from '@socioconnect/ui-components/src/lib/button/button'; // ❌ deep lib import
import { something } from '../../../admin/src/app/domains/auth/utils'; // ❌ cross-app
```

## Benefits

1. **Clear structure**: Obvious where code belongs
2. **Automated checks**: ESLint blocks architectural violations
3. **Scalability**: Easy to add domains
4. **Maintainability**: Easier to test and evolve
5. **Visibility**: `nx graph` shows project dependencies

## Commands

```bash
# Lint (includes architectural rules)
nx lint

# Dependency graph
nx graph

# Run apps
nx serve admin  # port 4200
nx serve main   # port 4201

# Build both apps
nx run-many -t build --projects=admin,main
```
