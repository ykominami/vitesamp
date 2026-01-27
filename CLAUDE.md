# CLAUDE.md - AI Assistant Guidelines for vitesamp

## Repository Overview

**Repository**: ykominami/vitesamp
**Current State**: Cleared (all source files removed as of commit `db63a40`)
**Historical Purpose**: Vite-based TypeScript project for WebXR/WebAR development using Babylon.js

## Current Repository State

The repository has been intentionally cleared of all source files. Only the `.gitignore` file remains. The git history preserves the previous codebase structure and can be referenced for context.

### Files Present
- `.gitignore` - Standard Vite/Node.js ignore patterns

### Files Removed (preserved in git history)
The following structure existed prior to removal:
```
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
├── yarn.lock
├── cert.pem / key.pem (HTTPS certificates)
├── public/
│   └── vite.svg
└── src/
    ├── main.ts
    ├── counter.ts
    ├── style.scss
    ├── typescript.svg
    └── vite-env.d.ts
```

## Historical Technology Stack

### Core Technologies
- **Build Tool**: Vite 5.x
- **Language**: TypeScript 5.x (ES2020 target, strict mode)
- **Package Manager**: Yarn
- **Module System**: ESM (`"type": "module"`)

### Development Tools
- **Linting**: ESLint 9.x with flat config + typescript-eslint
- **Formatting**: Prettier 3.x with eslint-config-prettier
- **Styling**: Sass

### 3D/XR Stack
- **3D Engine**: Babylon.js 5.x (`@babylonjs/core`)
- **Target**: WebXR immersive-ar experiences
- **HTTPS**: Required for WebXR - configured via cert.pem/key.pem

## Development Workflows

### NPM Scripts (historical)
```bash
yarn dev      # Start dev server with HTTPS (required for WebXR)
yarn build    # TypeScript compile + Vite production build
yarn preview  # Preview production build
```

### HTTPS for WebXR Development
WebXR requires HTTPS. The project used self-signed certificates:
- `key.pem` - Private key
- `cert.pem` - Certificate

To generate new certificates:
```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

## Code Conventions

### TypeScript
- Strict mode enabled
- No unused locals/parameters
- ES2020 target with DOM libraries
- Bundler module resolution

### ESLint Configuration
Uses flat config format (`eslint.config.js`):
- `@eslint/js` recommended rules
- `typescript-eslint` recommended rules
- Browser globals
- Prettier integration for formatting conflicts

### File Organization
- Source code in `src/`
- Static assets in `public/`
- Entry point: `src/main.ts`
- Styles: `src/style.scss`

## Guidelines for AI Assistants

### When Rebuilding the Project
1. Use Yarn as the package manager (consistent with yarn.lock history)
2. Maintain TypeScript strict mode
3. Keep ESLint flat config format (v9+)
4. Ensure HTTPS support for WebXR development
5. Follow existing Babylon.js patterns for XR setup

### Key Patterns from Historical Code
```typescript
// WebXR setup pattern
await scene.createDefaultXRExperienceAsync({
  uiOptions: {
    sessionMode: 'immersive-ar',
  },
});

// Conditional HTTPS in vite.config.ts
if (mode === 'development') {
  return {
    server: {
      https: {
        key: fs.readFileSync('./key.pem'),
        cert: fs.readFileSync('./cert.pem'),
      },
    },
  };
}
```

### Security Considerations
- Never commit actual private keys to the repository
- The `.gitignore` should include `*.pem` for production use
- cert.pem/key.pem were included for demo purposes only

### Dependencies (historical versions)
```json
{
  "devDependencies": {
    "@eslint/js": "^9.10.0",
    "@types/node": "^22.5.5",
    "eslint": "^9.10.0",
    "eslint-config-prettier": "^9.1.0",
    "globals": "^15.9.0",
    "prettier": "^3.3.3",
    "sass": "^1.78.0",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.5.0",
    "vite": "^5.4.20"
  },
  "dependencies": {
    "@babylonjs/core": "^5.0.0-rc.13"
  }
}
```

## Git Workflow

### Branch Naming
- Feature branches: `feature/<description>`
- Dependabot branches: `dependabot/npm_and_yarn/<package>`
- Claude branches: `claude/<description>`

### Commit Messages
- Use imperative mood
- Keep first line concise
- Reference PR numbers where applicable

## Useful Commands

```bash
# View historical file content
git show db63a40^:<filepath>

# List files before removal
git ls-tree -r --name-only db63a40^

# Restore all files from before removal
git checkout db63a40^ -- .
```

## Notes for Future Development

1. **WebXR Testing**: Requires HTTPS and a compatible browser/device
2. **Babylon.js Updates**: Consider upgrading to Babylon.js 6.x/7.x for latest WebXR features
3. **Vite Updates**: Stay current with Vite for security patches (handled by Dependabot)
4. **ESLint Migration**: Already using flat config (v9+), no migration needed
