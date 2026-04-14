# TextAdventure.js Modernization Plan

## Executive Summary

TextAdventure.js is a Node.js-based text adventure game engine with a CLI and web interface. While the core architecture is solid, the project has several technical debt issues that should be addressed through modernization.

## Current State Analysis

### Technology Stack (As-Is)

| Component       | Current Technology | Issues                                          |
| --------------- | ------------------ | ----------------------------------------------- |
| Runtime         | Node.js            | Version unspecified, likely outdated            |
| Language        | TypeScript 3.7.4   | Outdated (current: 5.x)                         |
| Target          | ES5                | Should be ES2020+ for modern features           |
| Package Manager | npm                | Lockfile format is legacy (v1)                  |
| Build Tool      | tsc + copyfiles    | Basic, lacks hot reload                         |
| Server          | Express 4.x        | Outdated, uses session middleware unnecessarily |
| Frontend        | jQuery 2.1.0       | Outdated, vanilla JS preferred                  |
| CLI             | console-read-write | Legacy, unmaintained                            |
| Styling         | Plain CSS          | No CSS modules or modern tooling                |

### Architecture Overview

```
text-adventure/
├── src/
│   ├── builders/          # DSL for game creation
│   ├── cartridges/        # Game content (necro)
│   ├── cli/               # Command-line interface
│   ├── core/
│   │   ├── console/       # Game engine/parser
│   │   ├── repositories/  # Save/load cartridge state
│   │   ├── server/        # HTTP server wrapper
│   │   └── shims/         # Type definitions
│   └── web/
│       └── static/        # HTML/CSS/JS for web interface
├── doc/                   # Documentation
├── package.json           # Dependencies & scripts
└── tsconfig.json          # TypeScript configuration
```

### Key Findings

1. **Outdated Dependencies**: TypeScript 3.7.4 (2020), jQuery 2.1.0 (2014), various deprecated packages
2. **Security Vulnerabilities**: 11 vulnerabilities detected (4 high severity)
3. **Legacy Tooling**: Copyfiles for asset copying, rimraf for cleanup
4. **No Testing**: No test framework or test files present
5. **No CI/CD**: No GitHub Actions or similar automation
6. **Single Cartridge**: Only one game (necro) demonstrates the engine
7. **Type Safety**: Uses `any` types in several places, reducing TypeScript benefits
8. **No Linting**: No ESLint or Prettier configuration
9. **Monolithic Build**: No module splitting, code splitting, or optimization
10. **Session Middleware**: Uses express-session unnecessarily for a stateless API

---

## Modernization Recommendations

### Priority 1: Critical Security & Dependencies

#### 1.1 Update Package Manager

- **Action**: Migrate from npm to pnpm or npm with lockfile v3
- **Benefit**: Faster installs, better deduplication, security improvements
- **Steps**:
  ```bash
  pnpm install
  ```

#### 1.2 Update TypeScript

- **Current**: 3.7.4
- **Target**: 5.4+
- **Target Target**: ES2022 or ESNext
- **Migration Steps**:
  ```json
  {
    "compilerOptions": {
      "target": "ES2022",
      "module": "ESNext",
      "moduleResolution": "bundler",
      "strict": true,
      "noImplicitAny": true,
      "strictNullChecks": true
    }
  }
  ```

#### 1.3 Update Express & Dependencies

- **Current**: Express 4.x with session middleware
- **Target**: Express 4.19+ with modern middleware
- **Security Fix**: Remove express-session (not needed for stateless API)
- **Recommended packages**:
  - `cors` for cross-origin requests
  - `helmet` for security headers
  - `express-rate-limit` for DDoS protection

#### 1.4 Fix Security Vulnerabilities

- Run `npm audit fix --force` for critical fixes
- Replace deprecated packages:
  - `rimraf` → `@manypkg/run-top-level` or `shx rm -rf`
  - `glob` → native `fs.glob` (Node 20+) or `fast-glob`
  - `inflight` → removed automatically

---

### Priority 2: Build Tooling & Developer Experience

#### 2.1 Add Build Orchestrator

- **Tool**: Vite or esbuild
- **Benefits**:
  - Hot module replacement (HMR)
  - Faster builds
  - Better tree-shaking
  - Built-in dev server

#### 2.2 Add TypeScript Linting

- **Tool**: ESLint + TypeScript ESLint
- **Rules**:
  - Enforce no `any` types
  - Enforce consistent naming conventions
  - Enforce import ordering
- **Config**: `.eslintrc.js`

#### 2.3 Add Code Formatting

- **Tool**: Prettier
- **Integration**: Pre-commit hook with husky

#### 2.4 Add Pre-commit Hooks

- **Tool**: Husky + lint-staged
- **Stages**:
  - `pre-commit`: Run linter on staged files
  - `pre-push`: Run full test suite

#### 2.5 Add Build Scripts

```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write src",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "clean": "rimraf dist"
  }
}
```

---

### Priority 3: Frontend Modernization

#### 3.1 Replace jQuery with Vanilla JS

- **Current**: jQuery 2.1.0 (100KB+)
- **Target**: Modern ES2022 JavaScript
- **Benefits**:
  - ~95% bundle size reduction
  - No external dependency
  - Native browser APIs

#### 3.2 Modern CSS

- **Current**: Plain CSS
- **Target**: CSS Modules or Tailwind CSS
- **Recommendation**: CSS Modules for component-scoped styles

#### 3.3 Add State Management

- **Tool**: Zustand or Jotai
- **Benefits**:
  - Reactive state for game UI
  - Devtools support
  - TypeScript integration

#### 3.4 Add Web Terminal Component

- **Recommendation**: `xterm.js` for authentic terminal experience
- **Benefits**:
  - Better terminal emulation
  - History navigation
  - Syntax highlighting

#### 3.5 Responsive Design

- **Add**: Mobile-friendly CSS
- **Features**:
  - Touch-optimized input
  - Adaptive layout
  - Dark/light mode toggle

---

### Priority 4: Backend Improvements

#### 4.1 API Architecture

- **Current**: POST to `/console`
- **Target**: RESTful or WebSocket
- **Recommendation**: WebSocket for real-time bidirectional communication

#### 4.2 Type Safety Improvements

- **Issue**: `any` types in console.ts
- **Fix**: Define proper interfaces
- **Example**:
  ```typescript
  interface ConsoleAction {
    (game: IGameData, command: ICommand): IGameActionResult;
  }
  ```

#### 4.3 Parser Enhancement

- **Current**: Basic word splitting
- **Target**: Natural Language Processing
- **Options**:
  - Simple: Add synonym mapping
  - Advanced: Use natural language library (e.g., `compromise`)
  - Custom: Build rule-based parser

#### 4.4 Save System Enhancement

- **Current**: Single save file
- **Target**: Multiple saves, cloud sync
- **Features**:
  - Save slots (1-10)
  - Auto-save on game events
  - Export/import save files

#### 4.5 Multi-Cartridge Support

- **Current**: Hard-coded necro cartridge
- **Target**: Dynamic cartridge loading
- **Implementation**:
  - Cartridge registry
  - Cartridge list endpoint
  - Hot-swapping without restart

---

### Priority 5: Testing & Quality

#### 5.1 Add Test Framework

- **Tool**: Jest
- **Coverage**:
  - Unit tests: Console actions (70%+)
  - Integration tests: Parser + Console
  - E2E tests: CLI + Web interface

#### 5.2 Add Mock Data

- **Create**: Test cartridges
- **Purpose**: Automated testing of game logic

#### 5.3 Add Code Coverage

- **Tool**: Jest coverage
- **Target**: 80%+ coverage

#### 5.4 Add Performance Tests

- **Tool**: autocannon or k6
- **Metrics**:
  - Response time (<100ms)
  - Throughput (>100 req/s)
  - Error rate (<0.1%)

---

### Priority 6: Documentation & Publishing

#### 6.1 Update README

- **Add**:
  - Quick start guide
  - Architecture overview
  - API documentation
  - Contributing guidelines

#### 6.2 Generate API Docs

- **Tool**: TypeDoc
- **Output**: Auto-generated from TypeScript types

#### 6.3 Cartridge SDK Documentation

- **Create**: Guide for cartridge authors
- **Content**:
  - Builder API reference
  - Game data structures
  - Common patterns
  - Examples

#### 6.4 Publish to npm

- **Current**: Package exists but needs updating
- **Action**:
  - Update version (2.0.0)
  - Update README
  - Add keywords
  - Add homepage

---

### Priority 7: Advanced Features

#### 7.1 Multiplayer Support

- **Feature**: Shared world, chat
- **Tech**: Socket.io or ws
- **Architecture**:
  - Game server per instance
  - Lobby system
  - Real-time state sync

#### 7.2 Visual Enhancements

- **Feature**: ASCII art, images
- **Tech**: Canvas or WebGL
- **Options**:
  - Simple: ASCII art rendering
  - Advanced: Sprite-based engine

#### 7.3 Cartridge Marketplace

- **Feature**: Browse/download cartridges
- **Implementation**:
  - GitHub API integration
  - Cartridge templates
  - Version control

#### 7.4 Save Game Cloud

- **Feature**: Sync saves across devices
- **Tech**: Firebase or custom backend
- **Auth**: OAuth 2.0

---

## Migration Roadmap

### Phase 1: Foundation ✅ COMPLETED

**Status:** Complete (2026-04-14)
**Summary:** See [PHASE_1_SUMMARY.md](./PHASE_1_SUMMARY.md)

```diff
[✓] Update package.json dependencies
     - TypeScript: 3.7.4 → 5.4.2
     - Express: 4.12.0 → 4.21.2
     - @types/node: 13.1.1 → 22.10.5
     - body-parser: 1.12.0 → 1.20.3
     - chalk: 3.0.0 → 5.3.0
     - open: 7.0.0 → 10.1.0

[✓] Migrate to TypeScript 5.x
     - Target: ES2022
     - Module: Node16 (ES modules)
     - Module Resolution: node16
     - Updated tsconfig.json

[✓] Fix security vulnerabilities
     - Before: 11 vulnerabilities (4 high, 7 moderate)
     - After: 0 vulnerabilities
     - Removed express-session
     - Added helmet, cors, express-rate-limit

[✓] Add ESLint & Prettier
     - ESLint 9 with TypeScript support
     - Prettier for code formatting
     - Configuration files created

[✓] Add basic test suite
     - Vitest configured (replacing Jest)
     - Coverage thresholds set (80%)
     - Test framework ready for test creation

[✓] Additional improvements
     - Package version: 1.1.2 → 2.0.0
     - Migrated from rimraf/copyfiles to shx
     - Added "type": "module" to package.json
     - Updated cartridge export to ESM
     - Created .gitignore
     - Created eslint.config.js (ESM flat config)
     - Created vitest.config.js
     - Created .prettierrc
```

### Phase 2: Build & Tooling ✅ COMPLETED

**Status:** Complete (2026-04-14)
**Summary:** See [PHASE_2_SUMMARY.md](./PHASE_2_SUMMARY.md)

```diff
[✓] Add Vite/esbuild
     - Installed Vite 6.x
     - Created vite.config.ts
     - Configured ES modules
     - Set up Rollup output

[✓] Add HMR for hot reloading
     - Vite dev server with HMR
     - Fast rebuilds during development
     - Live reloading on file changes

[✓] Add pre-commit hooks
     - Installed Husky + lint-staged
     - Configured .lintstagedrc.js
     - Auto-lint and format on commit

[✓] Add CI/CD pipeline (GitHub Actions)
     - Created .github/workflows/ci.yml
     - Matrix builds (Node 18, 20, 22)
     - Automated testing on push/PR
     - Security audit job
     - Build verification
     - Artifact upload
```

### Phase 2.5: Cleanup

```
[ ] Fix ESLint errors
[ ] Format code with Prettier
```

### Phase 3: Frontend (Pending Phase 2 completion)

```
[ ] Remove jQuery
[ ] Add xterm.js
[ ] Modernize CSS
[ ] Add responsive design
```

### Phase 4: Backend (Pending Phase 2-3 completion)

```
[ ] WebSocket integration
[ ] Multi-cartridge support
[ ] Enhanced save system
[ ] Type safety improvements
```

### Phase 5: Polish (Pending Phase 2-4 completion)

```
[ ] Complete documentation
[ ] Add cartridge examples
[ ] Performance optimization
[ ] Release v2.0.0
```

---

## Risk Assessment

### High Risk

- **Breaking Changes**: v2.0 will break existing cartridges
- **Mitigation**: Maintain v1 branch, provide migration guide

### Medium Risk

- **Frontend Rewrite**: jQuery → Vanilla JS
- **Mitigation**: Parallel implementation, feature flags

### Low Risk

- **Dependency Updates**: Standard npm updates
- **Mitigation**: Thorough testing, gradual rollout

---

## Conclusion

This modernization plan will transform TextAdventure.js into a modern, secure, and maintainable codebase while preserving its core functionality. The phased approach minimizes risk and allows for incremental improvements.

### Next Steps

1. **Immediate**: Security fixes and dependency updates
2. **Short-term**: Build tooling and developer experience
3. **Medium-term**: Frontend and backend improvements
4. **Long-term**: Advanced features and multiplayer

---

_Document created: 2026-04-14_
_Version: 1.0_
