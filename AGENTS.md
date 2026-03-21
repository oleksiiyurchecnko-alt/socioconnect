# Socioconnect - Agent Context

## Structure

```
apps/
  admin/       - Angular app (4200); per-app `public/` (e.g. favicon)
  main/        - Angular app (4201); same
  e2e-admin/   - Playwright E2E for admin
  e2e-main/    - Playwright E2E for main
apps/<admin|main>/assets/ - per-app `fonts/`, `icons/`, `images/` (see Static assets)
apps/<admin|main>/src/app/domains/<domain>/ - only `feature/`, `ui/`, `data-access/`, `shell/`, `types/`, `utils/`, `constants/`
libs/
  ui-components/ - Angular components (prefix sc)
  data-access/   - shared data-access primitives
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

## Static assets

- Each app has **`apps/<admin|main>/assets/`** — `fonts/` (woff2 + `_fonts.scss` with `@font-face`), `icons/`, `images/`. Import fonts from that app’s `src/styles.scss` with `@use '../assets/fonts/fonts'`; the bundler resolves woff2 from the SCSS pipeline, so `fonts/` is not listed again as a static asset glob. `icons/` and `images/` are copied via that app’s `project.json` (`apps/<app>/assets/icons` → output `assets/icons`, same for `images/`). In templates use paths like `assets/icons/...` and `assets/images/...` (output paths stay the same).
- **`.../assets/images/`** — one subfolder per image family (folder name = asset id). Files: `{folder-name}-[{variant}].webp` (e.g. `banner/banner-[480].webp`). No loose image files at the `images/` root. Details: `.cursor/rules/assets-images.mdc`. Shared bitmaps used by both apps live in both trees (or split per app if only one needs them).

## Environments

- `apps/*/src/environments/environment.ts` - dev
- `apps/*/src/environments/environment.prod.ts` - prod (fileReplacements on build)

## Imports

```ts
import { ButtonComponent } from '@socioconnect/ui-components';
import {} from '@socioconnect/data-access';
import type { User } from '@socioconnect/types';
import { addNumbers } from '@socioconnect/utils';
import { APP_NAME, MOCK_API_DELAY_MS } from '@socioconnect/constants';
```

- Prefer public APIs only: local `index.ts` barrels or `@socioconnect/*`
- Do not import from another app or another domain
- E2E must not import from `apps/**` or `libs/**`

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
3. **Architecture** — place app code under `apps/<app>/src/app/domains/<domain>/` and use only `feature/`, `ui/`, `data-access/`, `shell/`, `types/`, `utils/`, `constants/`. Respect app isolation, domain isolation, feature isolation, and public API imports. Full detail in **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

More Nx/Angular notes: `.cursor/rules/nx-angular.mdc`.
