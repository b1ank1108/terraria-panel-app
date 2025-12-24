<div align="center">

# 🎮 Terraria Panel

**A Modern Web-Based Management Panel for Terraria Servers**

Built with Go and React, making server management simple and elegant

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Go Version](https://img.shields.io/badge/go-1.21+-00ADD8?logo=go)](https://go.dev/)
[![React Version](https://img.shields.io/badge/react-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED?logo=docker)](https://www.docker.com/)

---

> **Acknowledgment**
> This project is forked from [carrot-hu23/terraria-panel-app](https://github.com/carrot-hu23/terraria-panel-app)

[Features](#-features) • [Quick Start](#-quick-start) • [Configuration](#️-configuration) • [API Reference](#-api-reference) • [FAQ](#-faq)

</div>

---

## ✨ Features

<table>
  <tr>
    <td width="50%">

### 🎛️ Server Control
Start/stop your Terraria server with one click, no more command-line hassles

### 📊 Real-time Monitoring
Monitor server status at a glance, stay informed about service health

### ⚙️ Configuration Management
Supports both raw text and structured form editing modes

    </td>
    <td width="50%">

### 💻 Console Commands
Send commands directly to the server for flexible management

### 📜 Log Viewer
View server logs in real-time, quickly identify issues

### 💾 Backup Management
Easily list, restore, and delete world backup files

    </td>
  </tr>
</table>

---

## 🚀 Quick Start

### Using Docker (Recommended)

The simplest deployment method - just one command:

```bash
docker-compose up -d
```

🌐 Access the panel at: [http://localhost:8084](http://localhost:8084)

### Manual Build

**Prerequisites:**
- Go 1.21 or higher
- Node.js 18 or higher

```bash
# 1️⃣ Build frontend
cd frontend && npm ci && npm run build && cd ..

# 2️⃣ Build backend
go build -o terraria-panel .

# 3️⃣ Run the application
./terraria-panel
```

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technologies |
|:---:|:---|
| **Backend** | Go 1.21+ • Gin • Viper |
| **Frontend** | React 19 • TypeScript • TailwindCSS • React Query |
| **Deployment** | Docker • Docker Compose |

</div>

---

## ⚙️ Configuration

<details>
<summary><b>📝 Application Config (config.yaml)</b></summary>

```yaml
web:
  port: 8080  # Web panel port

terraria:
  binary_path: "./Terraria-1449/Linux/TerrariaServer.bin.x86_64"  # Server binary path
  config_path: "./config.txt"  # Server configuration file path
```

</details>

<details>
<summary><b>🎮 Terraria Server Config (config.txt)</b></summary>

For detailed configuration options, please refer to: [Terraria Server Guide](docs/terraria-server-guide-zh.md)

</details>

<details>
<summary><b>🔌 Port Information</b></summary>

| Port | Purpose | Notes |
|:---:|:---|:---|
| `8080` | Web Panel | Mapped to `8084` in Docker environment |
| `7777` | Game Server | Terraria default game port |

</details>

---

## 📡 API Reference

<details>
<summary><b>View Complete API List</b></summary>

### Server Control

| Method | Endpoint | Description |
|:------:|:---------|:------------|
| `GET` | `/api/game/status` | Get server status |
| `GET` | `/api/game/start` | Start server |
| `GET` | `/api/game/stop` | Stop server |

### Configuration Management

| Method | Endpoint | Description |
|:------:|:---------|:------------|
| `GET` | `/api/game/config` | Get raw configuration |
| `POST` | `/api/game/config` | Update raw configuration |
| `GET` | `/api/config/structured` | Get structured configuration |
| `PATCH` | `/api/config/structured` | Update structured configuration |

### Commands & Logs

| Method | Endpoint | Description |
|:------:|:---------|:------------|
| `POST` | `/api/game/cmd` | Send console command |
| `GET` | `/api/game/log` | Get logs (query param: `lineNum`) |

### Backup Management

| Method | Endpoint | Description |
|:------:|:---------|:------------|
| `GET` | `/api/game/backup` | List all backups |
| `GET` | `/api/game/backup/restore` | Restore backup (query param: `backupFilePath`) |
| `DELETE` | `/api/game/backup` | Delete backup (query param: `backupFilePath`) |

</details>

---

## ❓ FAQ

<details>
<summary><b>How do I change the web panel port?</b></summary>

Edit the `config.yaml` file and modify the `web.port` value.

In Docker environments, you also need to update the port mapping in `docker-compose.yml`.

</details>

<details>
<summary><b>What if the server fails to start?</b></summary>

Please check:
1. Is the `binary_path` in `config.yaml` correct?
2. Does the Terraria server binary have execute permissions?
3. Is the `config.txt` configuration correct?
4. Check the logs for detailed error information

</details>

<details>
<summary><b>Which operating systems are supported?</b></summary>

- ✅ Linux (Recommended)
- ✅ Windows (Requires WSL2 or native Go environment)
- ✅ Docker (Cross-platform support)

</details>

---

## 🤝 Contributing

We welcome all forms of contribution! Whether it's:

- 🐛 Reporting bugs
- 💡 Suggesting new features
- 📝 Improving documentation
- 🔧 Submitting code fixes

Feel free to submit [Issues](../../issues) or [Pull Requests](../../pulls)!

### Development Workflow

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT](LICENSE) License.

---

## 🙏 Acknowledgments

- Thanks to [carrot-hu23](https://github.com/carrot-hu23) for the original project
- Thanks to all developers who have contributed to this project

---

<div align="center">

**If this project helps you, please give us a ⭐️**

Made with ❤️ by the Terraria Panel Team

</div>
