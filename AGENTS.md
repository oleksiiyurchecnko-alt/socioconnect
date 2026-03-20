# Socioconnect - Agent Context

## Structure

```
apps/
  admin/       - Angular app (4200)
  main/        - Angular app (4201)
  e2e-admin/   - Playwright E2E for admin
  e2e-main/   - Playwright E2E for main
libs/
  ui-components/ - Angular components (prefix sc)
  types/         - TS types
  utils/         - TS utilities
  constants/     - App constants
```

## Node

- **Node ≥ 20.19** (see `package.json` `engines` and **`.nvmrc`**). With nvm: `nvm use` in the repo root before install/serve. On Node 18, `nx serve` fails with `ERR_REQUIRE_ESM` (Vite).

## Commands

| Task        | Command                                      |
| ----------- | -------------------------------------------- |
| Serve admin | `nx serve admin`                             |
| Serve main  | `nx serve main`                              |
| Build all   | `nx run-many -t build --projects=admin,main` |
| Lint        | `nx run-many -t lint --all`                  |
| Test        | `nx run-many -t test --all`                  |
| E2E admin   | `nx e2e e2e-admin`                           |
| E2E main    | `nx e2e e2e-main`                            |

## Environments

- `apps/*/src/environments/environment.ts` - dev
- `apps/*/src/environments/environment.prod.ts` - prod (fileReplacements on build)

## Imports

```ts
import { ButtonComponent } from '@socioconnect/ui-components';
import type { User } from '@socioconnect/types';
import { addNumbers } from '@socioconnect/utils';
import { APP_NAME, MOCK_API_DELAY_MS } from '@socioconnect/constants';
```

## CI/CD

- Push to `main` or `development` triggers: lint → test → e2e → build → deploy
- Uses `nx affected` - only runs tasks for changed projects; builds and deploys only affected apps
- Shared CI bootstrap lives in `.github/actions/setup-node-npm`
- Deploy: S3 + CloudFront (secrets: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_DEV, S3_BUCKET_PROD, CLOUDFRONT_DISTRIBUTION_ID_DEV, CLOUDFRONT_DISTRIBUTION_ID_PROD)

## AI / MCP

- **Nx MCP** (official): `.cursor/mcp.json` → `nx-mcp` runs `npx nx mcp --no-minimal` (graph, generators, `nx_docs`, Nx Cloud tools when connected). Docs: [Nx MCP reference](https://nx.dev/docs/reference/nx-mcp). Optional: `npx nx configure-ai-agents` for skills + aligned MCP defaults.
- **Angular CLI MCP** (official): `.cursor/mcp.json` — `search_documentation` pulls current content from [angular.dev](https://angular.dev), plus `find_examples`, `get_best_practices`, `list_projects`, etc. Requires Node ≥20.19 (see `engines` in `package.json`). Setup: [Angular CLI MCP Server setup](https://angular.dev/ai/mcp).
- VS Code: `.vscode/mcp.json` — same server in `servers` format.
- Cursor rules in `.cursor/rules/` for Angular/Nx conventions

## Code generation (agents)

Mandatory AI rules live in **`.cursor/rules/angular-agent-generation.mdc`** (`alwaysApply: true`):

1. **Modern Angular** — standalone, signals for UI state, `input()` / `output()` / `model()`, `inject()`, template syntax `@if` / `@for` / `@switch`, default `OnPush`.
2. **Three files per component** — `.ts` plus separate `.html` and `.scss`; no inline `template` / `styles` in the decorator.
3. **Architecture** — place code under `shared/` or a domain with `shell/*.routing.ts`, then `feature` → `ui` → `data-access` → `utils` → `types`; full detail in **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

More Nx/Angular notes: `.cursor/rules/nx-angular.mdc`.
