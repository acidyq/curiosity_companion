# Deploying to GitHub Pages (Vite + Actions)

This project deploys to GitHub Pages using GitHub Actions. The site is hosted at:

**https://acidyq.github.io/curiosity_companion**

## Prerequisites

- You have admin access to this repository.
- GitHub Actions is enabled for this repo.
- Node 20 is used in CI.

## One-time repository setup

### Vite base path (already configured)

`vite.config.ts` includes:

```typescript
base: "/curiosity_companion/"
```

This ensures assets resolve under the project pages subpath.

### Workflow (already present)

`.github/workflows/deploy.yml` builds the app and deploys Pages:

- `actions/checkout@v4`
- `actions/setup-node@v4` (node 20)
- `npm ci && npm run build`
- `actions/upload-pages-artifact@v3`
- `actions/deploy-pages@v4`

### Enable GitHub Pages for this repo

1. Navigate to: **Repository → Settings → Pages**
2. In **Build and deployment**, select: **GitHub Actions**
3. Save

## Deploy on push

Pushing to `main` triggers a build and deploy automatically.

## Local scripts

- `npm run dev` — local dev server
- `npm run build` — type check and production build
- `npm run preview` — preview built app

## Routing notes (React Router)

`BrowserRouter` must include the base:

```typescript
<BrowserRouter basename={import.meta.env.BASE_URL}>
```

`vite.config.ts` base must match `/curiosity_companion/`.

## Troubleshooting

### Deploy job fails with "Failed to create deployment" or 404 "Not Found"

**Ensure Pages is enabled:** Repository → Settings → Pages → Build and deployment = **GitHub Actions**

### TypeScript error: Property 'env' does not exist on type 'ImportMeta'

Add Vite client types:

- `tsconfig.json` → `compilerOptions.types` includes `"vite/client"`
- or create `src/vite-env.d.ts` with: `/// <reference types="vite/client" />`

### TS2503 Cannot find namespace 'NodeJS' (in browser code)

Replace `NodeJS.Timeout` with:

```typescript
ReturnType<typeof setInterval>
ReturnType<typeof setTimeout>
```

### Undefined or incorrect properties in app code

**Example:** `Animal.length` → use `animal.name.length`

### Progress store method missing in type

Ensure `ProgressState` interface includes `checkAchievements: () => void`

### Manual redeploy

Re-run a failed workflow from the **Actions** tab (Re-run jobs), or push a new commit to `main`.

## Expected URL

**https://acidyq.github.io/curiosity_companion**

## Change management

### If we rename the repo, update:

- `vite.config.ts` base to `"/<new-repo-name>/"`
- Docs URLs in this page

### If we later adopt a custom domain:

- Add `public/CNAME` with your domain
- Keep base as `"/"` and adjust `BrowserRouter` basename accordingly

## Changelog

- **2025-10-06:** Initial setup and documentation
