# Socioconnect - Agent Context

## Structure

```
apps/
  admin/       - Angular app (4200)
  main/        - Angular app (4201)
  e2e-admin/   - Playwright E2E for admin
  e2e-main/    - Playwright E2E for main
libs/
  ui-components/ - Angular components (prefix sc)
  types/         - TS types
  utils/         - TS utilities
  constants/     - App constants
```

## Commands

| Task | Command |
|------|---------|
| Serve admin | `nx serve admin` |
| Serve main | `nx serve main` |
| Build all | `nx run-many -t build --projects=admin,main` |
| Lint | `nx run-many -t lint --all` |
| Test | `nx run-many -t test --all` |
| E2E admin | `nx e2e e2e-admin` |
| E2E main | `nx e2e e2e-main` |

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
- Deploy: S3 + CloudFront (secrets: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_DEV, S3_BUCKET_PROD, CLOUDFRONT_DISTRIBUTION_ID_DEV, CLOUDFRONT_DISTRIBUTION_ID_PROD)

## AI / MCP

- Use Nx MCP for workspace exploration, generators, docs
- Cursor rules in `.cursor/rules/` for Angular/Nx conventions
