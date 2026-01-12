# Directory Structure Guide

## Project Layout

```
terraria-panel-app/
├── config/              # Configuration files
│   ├── panel.yaml      # Web panel configuration
│   └── server.txt      # Terraria server configuration
├── data/               # Persistent data
│   ├── worlds/         # World files (.wld, .wld.bak)
│   └── backups/        # World backups
├── server/             # Terraria server files (user provided)
│   └── Linux/          # Linux server binaries
├── logs/               # Application logs
├── docker-compose.yml
└── Dockerfile
```

## Setup Instructions

### 1. Prepare Terraria Server Files

Download and extract Terraria server for Linux:

```bash
# Copy your Terraria server files to this project
cp -r /path/to/Terraria-1449/Linux ./server/
```

### 2. Create Data Directories

```bash
mkdir -p data/worlds data/backups
```

### 3. Configure

Edit `config/server.txt` to set your server preferences.

### 4. Deploy

```bash
docker-compose up -d --build
```

## Volume Mappings

| Host | Container | Purpose |
|------|-----------|---------|
| `config/panel.yaml` | `/app/config.yaml` | Panel config |
| `config/server.txt` | `/app/config.txt` | Server config |
| `server/` | `/app/server` | Server binaries (ro) |
| `data/worlds/` | `/app/worlds` | World files |
| `data/backups/` | `/app/backups` | Backups |
| `logs/` | `/app/logs` | Logs |

## Backup & Restore

### Backup World

```bash
cp data/worlds/world1.wld data/backups/world1-$(date +%Y%m%d).wld
```

### Restore World

```bash
cp data/backups/world1-20250108.wld data/worlds/world1.wld
docker-compose restart
```
