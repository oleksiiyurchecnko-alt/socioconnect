# Socioconnect architecture

## Overview

Socioconnect uses a domain-oriented layout with explicit layers and dependency rules enforced by Nx module boundaries.

## Project structure

### Apps
- `apps/admin/` — Admin application
- `apps/main/` — End-user application

### Libs
- `libs/ui-components/` — Shared UI components (prefix `sc`)
- `libs/types/` — Shared TypeScript types
- `libs/utils/` — Utility functions
- `libs/constants/` — App constants

### Domain layout inside apps

Each app is organized by domain:

```
apps/[app]/src/app/
├── shared/           # Cross-cutting pieces for the app
│   ├── ui/          # Presentational components
│   ├── data-access/ # Services and stores
│   ├── utils/       # Utilities
│   └── types/       # Types
├── [domain]/        # Domain folder (e.g. `dashboard/`, `clients/`, `posts/`)
│   ├── shell/       # Route config only: `*.routing.ts` (no components or layouts)
│   │   └── *.routing.ts  # e.g. `dashboard/shell/dashboard.routing.ts` — the only domain entry from `app.routes.ts`
│   ├── feature/     # Smart / container components (page chrome and outlets live here unless split to ui)
│   ├── ui/          # Presentational components
│   ├── data-access/ # Services and stores
│   ├── utils/       # Utilities
│   └── types/       # Types
└── app.component.ts # Root component
```

### Angular component files

Each component should use **three files**: `*.component.ts`, `*.component.html`, `*.component.scss` (external template and styles, no inline `template` / `styles` in the decorator). Modern Angular syntax and AI agent rules are described in `.cursor/rules/angular-agent-generation.mdc`.

## Architecture layers

### 1. App (bootstrap surface)
- **Purpose**: Root component, `app.config.ts`, `app.routes.ts`, specs.
- **May import**:
  - **`app.routes.ts`**: only each domain’s `shell/*.routing.ts` (e.g. `./dashboard/shell/dashboard.routing`) plus `@angular/router` (and similar). No `./<domain>/feature|ui|data-access|utils|types/`, no `./shared/`.
  - **`app.ts` / `app.config.ts` / `app.spec.ts`**: Angular/RxJS, `./app.routes`, `./shared/**`, `@socioconnect/*` as needed — but **no** direct imports of domain implementation folders (`./dashboard/feature/...`, `./dashboard/ui/...`, etc.).
- **Tags**: `type:app`, `scope:[admin|main]` (entire app is still one Nx project; folder rules are ESLint `no-restricted-imports` in `eslint.config.mjs`).

### 2. Shell (routing-only, per domain)
- **Purpose**: All **route configuration** for that domain (e.g. under `dashboard/shell/`).
- **Files**: Under `shell/`, **only** `*.routing.ts` (or `*.routes.ts`) — **no** layout components; chrome and `<router-outlet>` wrapping belong in **feature** (or **ui**).
- **May import**: **`../feature/*` only** for route targets (eager or lazy). Not `../ui/`, `../data-access/`, `../utils/`, `../types/`, not `../../shared/`. Use `@angular/router` and, if needed, other packages — not sibling domain folders.
- **Tags**: `type:shell` applies to publishable shell **libs** in Nx; in-repo domain shells are enforced by path rules above.

### 3. Feature
- **Purpose**: Smart components, business orchestration
- **May import**: Same-domain `ui/`, `data-access/`, `utils/`, `types/`; `shared/`; `@socioconnect/*` libs allowed by Nx tags — not sibling domains (see ESLint `appDomainImportBans`).
- **Tags**: `type:feature`, `scope:[domain|shared]`

### 4. UI
- **Purpose**: Presentational components
- **May import**: Same-domain helpers; `shared/`; `type:util` / `type:constants` / `type:types` libs
- **Tags**: `type:ui`, `scope:[domain|shared]`

### 5. Data access
- **Purpose**: Services, stores, HTTP clients
- **May import**: Same domain `utils/`, `types/`, `constants/` (if present); app `shared/`; published libs `@socioconnect/utils`, `@socioconnect/constants`, `@socioconnect/types`, and any future `type:data-access` lib.
- **Tags**: `type:data-access`, `scope:[domain|shared]` (folder-level; app code still lives under the `type:app` project)

### 6. Utils (folder) / util lib
- **Purpose**: Helper functions
- **May import**: types, shared, libs
- **Tags (Nx, `libs/utils`)**: `type:util`, `scope:lib`

### 7. Types
- **Purpose**: TypeScript types and interfaces
- **May import**: shared, libs
- **Tags**: `type:types`, `scope:[domain|shared]`

## Tag system

### Type tags (`type:`)
- `type:app` — root components
- `type:shell` — routing shells
- `type:feature` — smart components
- `type:ui` — presentational components
- `type:data-access` — services and stores (libs or future publishable data-access libs)
- `type:util` — `libs/utils`
- `type:constants` — `libs/constants`
- `type:types` — types (`libs/types` and in-app type modules)

### Scope tags (`scope:`)
- `scope:admin` — admin app code
- `scope:main` — main app code
- `scope:shared` — shared app-level code
- `scope:domain` — code for a specific domain
- `scope:lib` — libraries

## Dependency rules

**Composition chain (domain code):** `app.routes.ts` → `<domain>/shell/*.routing.ts` → `<domain>/feature/*` → (then `ui/`, `data-access/`, etc. inside the domain). Example domain folder name: **`dashboard/`**.

ESLint enforces:

1. **App → shell only (routing)**: `app.routes.ts` may only import domain route modules from `<domain>/shell/` (regex + no `./shared/` there). Other app root TS files must not import `./<domain>/(feature|ui|data-access|utils|types)/` directly.
2. **Shell → feature only**: files under `apps/*/src/app/*/shell/**` may only use `../feature/...` for relative domain code (not `../ui/`, `../data-access/`, etc.).
3. **Nx project graph** (`@nx/enforce-module-boundaries`): any file in the app may still pull `@socioconnect/*` per tags (`type:app` → allowed lib tags). That does **not** replace the folder rules above.
4. **Domain isolation**: under `dashboard/` layers (feature/ui/…), imports matching `**/clients/**` are banned; under `clients/` layers, `**/dashboard/**`. Lists live in `dashboardDomainLayers` / `clientsDomainLayers` in `eslint.config.mjs` — extend when you add domains.
5. **Shared**: Domains may use `shared/` under the same app (not from `app.routes.ts`).
6. **Libs**: `@socioconnect/utils`, `@socioconnect/constants`, `@socioconnect/types`, `@socioconnect/ui-components`.

## Examples

### Valid imports
```typescript
// Feature may import UI
import { ClientCardComponent } from '../ui/client-card.component';

// UI may import shared UI
import { SharedButtonComponent } from '../../shared/ui/shared-button.component';

// Data-access may import shared services
import { SharedHttpService } from '../../shared/data-access/shared-http.service';
```

### Invalid imports (ESLint will fail)
```typescript
// app.routes.ts must not import domain code except via shell
import { DashboardHomeComponent } from './dashboard/feature/dashboard-home/dashboard-home.component'; // ❌

// Shell must not import ui / data-access / …
import { PanelComponent } from '../ui/panel.component'; // ❌

// UI must not import feature
import { ClientListComponent } from '../feature/client-list.component'; // ❌

// A domain must not import another domain
import { PostService } from '../../posts/data-access/posts.service'; // ❌

// Types must not import data-access
import { ClientsService } from '../data-access/clients.service'; // ❌
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
