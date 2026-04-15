# TextAdventure.js - Agent Guide

## Project Overview

**TextAdventure.js** is a modern, extensible text adventure game engine that runs on Node.js and in the web browser. It provides both CLI and web-based interfaces for creating and playing interactive fiction.

## Tech Stack

- **Runtime**: Node.js >= 18.0.0
- **Language**: TypeScript 5.x
- **Build**: Vite (browser assets), esbuild (server code)
- **Dev Tools**: tsx (TypeScript execution), concurrently (multi-server)
- **Test Framework**: Vitest
- **Linter**: Oxlint (completed migration from ESLint)
- **Formatter**: Prettier
- **Package Manager**: pnpm

## Project Structure

```
text-adventure/
├── src/
│   ├── builders/        # Build utilities
│   ├── cartridges/      # Game cartridges (content)
│   ├── cli/             # CLI server implementation
│   ├── core/            # Core engine logic
│   └── web/             # Web server and static assets
├── dist/                # Build output
├── doc/                 # Documentation
├── .pi/
│   └── skills/          # Project-specific agent skills
└── config files:
    ├── vite.config.ts
    ├── tsconfig.json
    ├── .oxlintrc.json
    ├── .prettierrc
    └── vitest.config.js
```

## Key Scripts

For a complete list of available scripts, see [README.md](README.md).

## Important Notes

### Cartridge System
The engine loads games from "cartridges" - self-contained game files. Example:
```javascript
load necro
```

### Web vs CLI
- **Web Server**: Runs on http://localhost:3000, provides browser-based interface
- **CLI Server**: Terminal-based interface via `dist/cli/server.js`

## Working with This Project

### Getting Started

See [README.md](README.md) for the complete getting started guide, including:
- Installation instructions
- Build and run commands
- Environment setup

### Environment Setup

For environment configuration details, see the `.env.example` file.

### Code Quality Standards

For detailed code quality requirements, see [README.md](README.md).

### Build System Architecture

- **Server Code**: Compiled with `esbuild` for speed (no type checking during build)
- **Browser Assets**: Built with Vite only
- **Type Checking**: Use `pnpm run typecheck` or `pnpm run typecheck:watch`
- **Hot Reload**: Both CLI (`tsx watch`) and web (Vite) support hot reload

### File Conventions
- All source files are in `src/`
- Build output goes to `dist/`
- Tests use Vitest config at `vitest.config.js`
- TypeScript config at `tsconfig.json`

## Common Tasks

### Adding a New Cartridge
1. Create game file in `src/cartridges/`
2. Register in appropriate configuration
3. Test with `load <cartridge-name>` in server

### Modifying Core Engine
- Core logic is in `src/core/`
- Be careful with breaking changes
- Update tests accordingly
- Document API changes in README

### Web Interface Changes
- Static assets in `src/web/static/`
- Server logic in `src/web/`
- Vite handles bundling

## Related Documentation

- [README.md](README.md) - Complete developer documentation with scripts and setup
- [doc/text-adventure.md](doc/text-adventure.md) - Engine and game documentation
- [MODERNIZATION_PLAN.md](MODERNIZATION_PLAN.md) - Migration roadmap
- [PHASE_1_SUMMARY.md](PHASE_1_SUMMARY.md) - ESLint migration summary
- [PHASE_2_SUMMARY.md](PHASE_2_SUMMARY.md) - Additional modernization steps