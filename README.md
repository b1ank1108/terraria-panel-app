# Terraria Panel

A web-based management panel for Terraria dedicated servers, built with Go and React.

## Features

- **Server Control** - Start/stop Terraria server with one click
- **Real-time Status** - Monitor server running state
- **Configuration Management** - Edit server settings via web UI (raw text or structured form)
- **Console Commands** - Send commands directly to the server
- **Log Viewer** - View server logs in real-time
- **Backup Management** - List, restore, and delete world backups

## Tech Stack

**Backend:** Go 1.21+, Gin, Viper
**Frontend:** React 19, TypeScript, TailwindCSS, React Query
**Deployment:** Docker, Docker Compose

## Quick Start

### Docker (Recommended)

```bash
docker-compose up -d
```

Access the panel at `http://localhost:8084`

### Manual Build

**Prerequisites:**
- Go 1.21+
- Node.js 18+

```bash
# Build frontend
cd frontend && npm ci && npm run build && cd ..

# Build backend
go build -o terraria-panel .

# Run
./terraria-panel
```

## Configuration

### Application Config (`config.yaml`)

```yaml
web:
  port: 8080

terraria:
  binary_path: "./Terraria-1449/Linux/TerrariaServer.bin.x86_64"
  config_path: "./config.txt"
```

### Terraria Server Config (`config.txt`)

See [Terraria Server Guide](docs/terraria-server-guide-zh.md) for detailed configuration options.

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/game/status` | Get server status |
| GET | `/api/game/start` | Start server |
| GET | `/api/game/stop` | Stop server |
| GET | `/api/game/config` | Get raw config |
| POST | `/api/game/config` | Update raw config |
| GET | `/api/config/structured` | Get structured config |
| PATCH | `/api/config/structured` | Update structured config |
| POST | `/api/game/cmd` | Send command |
| GET | `/api/game/log` | Get logs (query: `lineNum`) |
| GET | `/api/game/backup` | List backups |
| GET | `/api/game/backup/restore` | Restore backup (query: `backupFilePath`) |
| DELETE | `/api/game/backup` | Delete backup (query: `backupFilePath`) |

## Ports

- `8080` - Web panel (mapped to `8084` in Docker)
- `7777` - Terraria game server

## License

MIT
