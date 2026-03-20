# Socioconnect

Nx monorepo with Angular applications.

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
- `libs/ui-components` - Shared Angular components (Button)
- `libs/types` - TS types (User)
- `libs/utils` - TS utilities (addNumbers)
- `libs/constants` - Constants (APP_NAME, MOCK_API_DELAY_MS)

## CI/CD

GitHub Actions: lint → test → e2e → build → deploy (S3 + CloudFront)

Secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET_DEV`, `S3_BUCKET_PROD`, `CLOUDFRONT_DISTRIBUTION_ID_DEV`, `CLOUDFRONT_DISTRIBUTION_ID_PROD`
