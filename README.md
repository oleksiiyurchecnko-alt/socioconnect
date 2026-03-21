# Socioconnect

Nx monorepo with Angular applications, strict domain boundaries, and Sheriff-enforced architecture.

## Requirements

- Node.js >= 20.19.0
- npm

```bash
nvm use 20
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run start:admin` | Start admin (port 4200) |
| `npm run start:main` | Start main (port 4201) |
| `npm run build` | Build admin + main |
| `npm run lint` | Lint all projects |
| `npm run test` | Unit tests |
| `npm run e2e:admin` | E2E tests for admin |
| `npm run e2e:main` | E2E tests for main |

## Structure

- `apps/admin` - Angular admin app
- `apps/main` - Angular main app
- `apps/e2e-admin` - Playwright E2E for admin
- `apps/e2e-main` - Playwright E2E for main
- `apps/<app>/src/app/domains/<domain>` - Domain slices with strict layer boundaries
- `libs/ui-components` - Shared Angular UI
- `libs/data-access` - Shared data-access primitives
- `libs/types` - Shared TS types
- `libs/utils` - Shared utilities
- `libs/constants` - Shared constants

## App Architecture

```text
apps/<app>/src/app/
  app.ts
  app.config.ts
  app.routes.ts
  domains/
    <domain>/
      feature/
      ui/
      data-access/
      shell/
      types/
      utils/
      constants/
```

Rules:

- Apps are isolated: `main` must not import `admin`, `admin` must not import `main`
- Domains are isolated: one domain must not import another domain
- Use only the allowed domain folders above
- Prefer public API imports through local `index.ts` barrels
- Avoid deep relative imports like `../../../`
- E2E must not import from apps or libs

See `ARCHITECTURE.md` for the exact layer rules.

## CI/CD

GitHub Actions: lint → test → e2e → build → deploy (S3 + CloudFront)

Secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET_DEV`, `S3_BUCKET_PROD`, `CLOUDFRONT_DISTRIBUTION_ID_DEV`, `CLOUDFRONT_DISTRIBUTION_ID_PROD`
