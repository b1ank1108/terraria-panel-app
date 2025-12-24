# Terraria 面板

> **注意：** 本项目 fork 自 [carrot-hu23/terraria-panel-app](https://github.com/carrot-hu23/terraria-panel-app)

基于 Go 和 React 构建的 Terraria 专用服务器 Web 管理面板。

## 功能特性

- **服务器控制** - 一键启动/停止 Terraria 服务器
- **实时状态** - 监控服务器运行状态
- **配置管理** - 通过 Web 界面编辑服务器设置（支持原始文本和结构化表单）
- **控制台命令** - 直接向服务器发送命令
- **日志查看器** - 实时查看服务器日志
- **备份管理** - 列出、恢复和删除世界备份

## 技术栈

**后端：** Go 1.21+, Gin, Viper
**前端：** React 19, TypeScript, TailwindCSS, React Query
**部署：** Docker, Docker Compose

## 快速开始

### Docker 部署（推荐）

```bash
docker-compose up -d
```

访问面板：`http://localhost:8084`

### 手动构建

**前置要求：**
- Go 1.21+
- Node.js 18+

```bash
# 构建前端
cd frontend && npm ci && npm run build && cd ..

# 构建后端
go build -o terraria-panel .

# 运行
./terraria-panel
```

## 配置说明

### 应用配置 (`config.yaml`)

```yaml
web:
  port: 8080

terraria:
  binary_path: "./Terraria-1449/Linux/TerrariaServer.bin.x86_64"
  config_path: "./config.txt"
```

### Terraria 服务器配置 (`config.txt`)

详细配置选项请参阅 [Terraria 服务器指南](docs/terraria-server-guide-zh.md)。

## API 接口

| 方法 | 端点 | 描述 |
|--------|----------|-------------|
| GET | `/api/game/status` | 获取服务器状态 |
| GET | `/api/game/start` | 启动服务器 |
| GET | `/api/game/stop` | 停止服务器 |
| GET | `/api/game/config` | 获取原始配置 |
| POST | `/api/game/config` | 更新原始配置 |
| GET | `/api/config/structured` | 获取结构化配置 |
| PATCH | `/api/config/structured` | 更新结构化配置 |
| POST | `/api/game/cmd` | 发送命令 |
| GET | `/api/game/log` | 获取日志（查询参数：`lineNum`） |
| GET | `/api/game/backup` | 列出备份 |
| GET | `/api/game/backup/restore` | 恢复备份（查询参数：`backupFilePath`） |
| DELETE | `/api/game/backup` | 删除备份（查询参数：`backupFilePath`） |

## 端口说明

- `8080` - Web 面板端口（Docker 中映射为 `8084`）
- `7777` - Terraria 游戏服务器端口

## 许可证

MIT
