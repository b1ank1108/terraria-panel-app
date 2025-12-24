<div align="center">

# 🎮 Terraria 面板

**现代化的 Terraria 服务器管理面板**

基于 Go 和 React 构建的 Web 管理工具，让服务器管理变得简单而优雅

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Go Version](https://img.shields.io/badge/go-1.21+-00ADD8?logo=go)](https://go.dev/)
[![React Version](https://img.shields.io/badge/react-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED?logo=docker)](https://www.docker.com/)

---

> **致谢**
> 本项目基于 [carrot-hu23/terraria-panel-app](https://github.com/carrot-hu23/terraria-panel-app) 开发

[功能特性](#-功能特性) • [快速开始](#-快速开始) • [配置指南](#️-配置指南) • [API 文档](#-api-文档) • [常见问题](#-常见问题)

</div>

---

## ✨ 功能特性

<table>
  <tr>
    <td width="50%">

### 🎛️ 服务器控制
一键启动/停止服务器，告别繁琐的命令行操作

### 📊 实时监控
服务器运行状态一目了然，随时掌握服务动态

### ⚙️ 配置管理
支持原始文本和结构化表单两种编辑模式

    </td>
    <td width="50%">

### 💻 控制台命令
直接向服务器发送指令，管理更加灵活

### 📜 日志查看
实时查看服务器日志，快速定位问题

### 💾 备份管理
轻松列出、恢复和删除世界备份文件

    </td>
  </tr>
</table>

---

## 🚀 快速开始

### 使用 Docker（推荐）

最简单的部署方式，一行命令搞定：

```bash
docker-compose up -d
```

🌐 访问面板：[http://localhost:8084](http://localhost:8084)

### 手动构建

**前置要求：**
- Go 1.21 或更高版本
- Node.js 18 或更高版本

```bash
# 1️⃣ 构建前端
cd frontend && npm ci && npm run build && cd ..

# 2️⃣ 构建后端
go build -o terraria-panel .

# 3️⃣ 运行程序
./terraria-panel
```

---

## 🛠️ 技术栈

<div align="center">

| 层级 | 技术 |
|:---:|:---|
| **后端** | Go 1.21+ • Gin • Viper |
| **前端** | React 19 • TypeScript • TailwindCSS • React Query |
| **部署** | Docker • Docker Compose |

</div>

---

## ⚙️ 配置指南

<details>
<summary><b>📝 应用配置（config.yaml）</b></summary>

```yaml
web:
  port: 8080  # Web 面板端口

terraria:
  binary_path: "./Terraria-1449/Linux/TerrariaServer.bin.x86_64"  # 服务器二进制文件路径
  config_path: "./config.txt"  # 服务器配置文件路径
```

</details>

<details>
<summary><b>🎮 Terraria 服务器配置（config.txt）</b></summary>

详细的配置选项请参考：[Terraria 服务器配置指南](docs/terraria-server-guide-zh.md)

</details>

<details>
<summary><b>🔌 端口说明</b></summary>

| 端口 | 用途 | 说明 |
|:---:|:---|:---|
| `8080` | Web 面板 | Docker 环境下映射到 `8084` |
| `7777` | 游戏服务器 | Terraria 默认游戏端口 |

</details>

---

## 📡 API 文档

<details>
<summary><b>查看完整 API 列表</b></summary>

### 服务器控制

| 方法 | 端点 | 描述 |
|:------:|:---------|:------------|
| `GET` | `/api/game/status` | 获取服务器状态 |
| `GET` | `/api/game/start` | 启动服务器 |
| `GET` | `/api/game/stop` | 停止服务器 |

### 配置管理

| 方法 | 端点 | 描述 |
|:------:|:---------|:------------|
| `GET` | `/api/game/config` | 获取原始配置 |
| `POST` | `/api/game/config` | 更新原始配置 |
| `GET` | `/api/config/structured` | 获取结构化配置 |
| `PATCH` | `/api/config/structured` | 更新结构化配置 |

### 命令与日志

| 方法 | 端点 | 描述 |
|:------:|:---------|:------------|
| `POST` | `/api/game/cmd` | 发送控制台命令 |
| `GET` | `/api/game/log` | 获取日志（查询参数：`lineNum`） |

### 备份管理

| 方法 | 端点 | 描述 |
|:------:|:---------|:------------|
| `GET` | `/api/game/backup` | 列出所有备份 |
| `GET` | `/api/game/backup/restore` | 恢复备份（查询参数：`backupFilePath`） |
| `DELETE` | `/api/game/backup` | 删除备份（查询参数：`backupFilePath`） |

</details>

---

## ❓ 常见问题

<details>
<summary><b>如何修改 Web 面板的端口？</b></summary>

编辑 `config.yaml` 文件，修改 `web.port` 的值即可。

Docker 环境下还需要修改 `docker-compose.yml` 中的端口映射。

</details>

<details>
<summary><b>服务器无法启动怎么办？</b></summary>

请检查：
1. `config.yaml` 中的 `binary_path` 是否正确
2. Terraria 服务器二进制文件是否有执行权限
3. `config.txt` 配置是否正确
4. 查看日志获取详细错误信息

</details>

<details>
<summary><b>支持哪些操作系统？</b></summary>

- ✅ Linux（推荐）
- ✅ Windows（需要 WSL2 或原生 Go 环境）
- ✅ Docker（跨平台支持）

</details>

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！无论是：

- 🐛 提交 Bug 报告
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复

请随时提交 [Issue](../../issues) 或 [Pull Request](../../pulls)！

### 开发流程

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

---

## 📄 开源协议

本项目采用 [MIT](LICENSE) 协议开源。

---

## 🙏 致谢

- 感谢 [carrot-hu23](https://github.com/carrot-hu23) 提供的原始项目
- 感谢所有为本项目做出贡献的开发者

---

<div align="center">

**如果这个项目对您有帮助，请给我们一个 ⭐️**

Made with ❤️ by the Terraria Panel Team

</div>
