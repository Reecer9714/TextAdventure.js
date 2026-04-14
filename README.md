# TextAdventure.js

> A modern, extensible text adventure game engine for Node.js and the web

## Quick Start

```bash
# Install dependencies
npm ci

# Build the project
npm run build

# Start the server
npm start
```

## Development

```bash
# Install dependencies
npm ci

# Run in development mode with hot reloading
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Check code quality
npm run lint
npm run format:check
npm run typecheck
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
- 🖥️ **CLI Interface**: Terminal-based gameplay
- 🌐 **Web Interface**: Browser-based play with modern UI
- 📦 **Cartridge System**: Create and share your own adventures
- 🔒 **Secure**: Modern security practices with helmet, CORS, and rate limiting
- ⚡ **Fast**: Built with Vite for lightning-fast development and builds
- 🧪 **Tested**: Comprehensive test suite with Vitest
- 📝 **Linted**: ESLint + Prettier for code quality

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
- **Build**: Vite
- **Server**: Express 4.x
- **Testing**: Vitest
- **Code Quality**: ESLint + Prettier
- **Security**: Helmet, CORS, Express Rate Limit

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Vite |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Lint TypeScript files |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run typecheck` | Type check without emitting files |
| `npm run clean` | Remove dist directory |

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

---

**Built with ❤️ using TextAdventure.js**
