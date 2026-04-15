# TextAdventure.js

> A modern, extensible text adventure game engine for Node.js and the web

## Quick Start

```bash
# Install dependencies (requires pnpm)
pnpm ci

# Build the project
pnpm run build

# Start the server
pnpm start
```

## Development

```bash
# Install dependencies (requires pnpm)
pnpm ci

# Run in development mode with hot reloading
# Web dev server (browser interface)
pnpm run dev

# CLI dev server (terminal interface)
pnpm run dev:cli

# Both dev servers together
pnpm run dev:all

# Run tests
pnpm test

# Run tests in watch mode
pnpm run test:watch

# Check code quality
pnpm run lint
pnpm run format:check
pnpm run typecheck
```

## Usage

Once the server is running, you can:

1. **CLI Mode**: Connect via terminal to the interactive adventure
2. **Web Interface**: Open http://localhost:3000 in your browser

### Loading Cartridges

```javascript
load necro
```

### Running Multiple Commands

```javascript
dev look at cabinet; open drawer; take key; use key on door; open door
```

## Features

- 🎮 **Game Engine**: Full interactive fiction engine with rooms, items, and interactions
- 🖥️ **CLI Interface**: Terminal-based gameplay with hot reload
- 🌐 **Web Interface**: Browser-based play with modern UI and hot reload
- 📦 **Cartridge System**: Create and share your own adventures
- 🔒 **Secure**: Modern security practices with helmet, CORS, and rate limiting
- ⚡ **Fast**: Built with Vite (browser) and esbuild (server) for lightning-fast builds
- 🧪 **Tested**: Comprehensive test suite with Vitest
- 📝 **Linted**: Oxlint + Prettier for code quality
- 🔧 **pnpm**: Faster installs with better dependency management

## Architecture

```
text-adventure/
├── src/
│   ├── builders/          # DSL for game creation
│   ├── cartridges/        # Game content (necro)
│   ├── cli/               # Command-line interface
│   ├── core/
│   │   ├── console/       # Game engine/parser
│   │   ├── repositories/  # Save/load cartridge state
│   │   └── server/        # HTTP server wrapper
│   └── web/
│       └── static/        # HTML/CSS/JS for web interface
├── doc/                   # Documentation
├── dist/                  # Compiled output
├── .github/workflows/     # CI/CD pipeline
├── .husky/               # Pre-commit hooks
└── package.json
```

## Technology Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.x
- **Build**: Vite (browser), esbuild (server)
- **Dev Tools**: tsx (TypeScript execution), concurrently (multi-server)
- **Server**: Express 4.x
- **Testing**: Vitest
- **Code Quality**: Oxlint + Prettier
- **Security**: Helmet, CORS, Express Rate Limit
- **Package Manager**: pnpm

## Scripts

### Build Scripts

| Command | Description |
|---------|-------------|
| `pnpm run build` | Full production build (server + web + cartridges) |
| `pnpm run build:server` | Build server code with esbuild |
| `pnpm run build:web` | Build browser assets with Vite |
| `pnpm start` | Start production server |

### Development Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Web dev server with hot reload |
| `pnpm run dev:cli` | CLI dev server with hot reload |
| `pnpm run dev:all` | Start both dev servers together |

### Testing Scripts

| Command | Description |
|---------|-------------|
| `pnpm test` | Run all tests |
| `pnpm run test:watch` | Run tests in watch mode |
| `pnpm run test:coverage` | Run tests with coverage report |

### Code Quality Scripts

| Command | Description |
|---------|-------------|
| `pnpm run lint` | Run Oxlint |
| `pnpm run lint:fix` | Auto-fix linting issues |
| `pnpm run format` | Format code with Prettier |
| `pnpm run format:check` | Check code formatting |
| `pnpm run typecheck` | Type check without emitting files |
| `pnpm run typecheck:watch` | Type check in watch mode |

### Utility Scripts

| Command | Description |
|---------|-------------|
| `pnpm run clean` | Remove dist directory |

## Documentation

See the full engine documentation [here](doc/text-adventure.md)

## License

MIT License - see [LICENSE](LICENSE) for details

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Environment Setup

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

See `.env.example` for available environment variables.

---

**Built with ❤️ using TextAdventure.js**
