# Terraria 服务器配置指南

## 目录

1. [概述](#概述)
2. [网络准备](#网络准备)
3. [Windows 设置](#windows-设置)
4. [Linux/macOS 设置](#linuxmacos-设置)
5. [命令行参数](#命令行参数)
6. [配置文件参数](#配置文件参数)
7. [连接方式](#连接方式)
8. [故障排除](#故障排除)

---

## 概述

本指南将引导玩家配置和运行 Terraria 多人游戏服务器，支持局域网（LAN）或互联网游戏。涵盖 Windows 和 Linux/macOS 系统。

---

## 网络准备

### 基本要求
- 为服务器计算机分配**静态 IP 地址**
- 通过路由器**转发端口 7777**（默认端口）以实现互联网访问
- 通过 whatsmyip.com 等服务查找外部 IP 地址

### 硬件要求
- **小型世界 + 少量玩家**：512 MB RAM
- **大型世界 + 10+ 玩家**：1-2 GB RAM

---

## Windows 设置

### 查找本地 IP 地址

**LAN 配置：**
1. 打开**命令提示符**（Win + R → 输入 `cmd`）
2. 运行 `ipconfig`
3. 查找 **IPv4 地址** 和 **默认网关** 信息

### 服务器类型

#### 1. "主机并游玩"（Host & Play）
- 最简单的选项
- 内置于游戏客户端中
- 适合临时游戏

#### 2. 专用服务器（Dedicated Server）
- 独立可执行文件
- 适合长期运行
- 性能更好

### 启动方法

```bash
# 初次启动（包含设置向导）
TerrariaServer.exe

# 使用配置文件启动
TerrariaServer.exe -config serverconfig.txt
```

**注意**：运行多个服务器需要不同的端口、世界和配置文件。

### 默认路径

| 平台 | 路径 |
|------|------|
| **Steam** | `C:\Program Files (x86)\Steam\steamapps\common\Terraria` |
| **GOG** | `C:\GOG Galaxy\Games\Terraria` |
| **世界文件** | `C:\Users\[用户名]\Documents\MyGames\Terraria\Worlds` |

---

## Linux/macOS 设置

### 查找本地 IP 地址

在终端中运行：
```bash
ip addr
```
查找带有 **BROADCAST** 和状态为 **UP** 的网络接口。

### 服务器启动

```bash
# 确保脚本具有执行权限
chmod u+x TerrariaServer*

# 启动服务器
./TerrariaServer
```

**推荐**：使用会话管理器（如 `tmux` 或 `screen`）以实现持久化运行。

```bash
# 使用 screen 运行服务器
screen -S terraria
./TerrariaServer

# 分离会话：Ctrl+A 然后按 D
# 重新连接：screen -r terraria
```

### 默认路径

| 平台 | 路径 |
|------|------|
| **macOS** | `~/Library/Application Support/Terraria/Worlds` |
| **Linux** | `~/.local/share/Terraria/Worlds` |

---

## 命令行参数

### 客户端参数

| 参数 | 描述 |
|------|------|
| `-savedirectory` | 指定 Terraria 保存文件夹位置 |
| `-logfile` | 配置日志输出到文件 |
| `-minidump` | 启用迷你转储崩溃报告 |
| `-logerrors` | 记录错误消息 |
| `-fulldump` | 启用完整转储崩溃报告 |
| `-disableannouncementbox` | 禁用公告框文本公告 |
| `-announcementboxrange <数字>` | 设置公告框消息范围（像素，-1 为全服务器） |
| `-forcepriority` | 设置进程优先级级别 |
| `-ip` | 设置 IP 地址 |
| `-j` / `-join` | 加入服务器 |
| `-pass` / `-password` | 提供服务器密码 |
| `-host` | 指定主机服务器 |
| `-p` / `-port` | 指定端口号 |
| `-steam` | 启用 Steam 支持 |
| `-lobby` | 设置大厅可见性（启用 Steam 时为朋友/私人） |
| `-friendsoffriends` | 允许朋友的朋友加入 |
| `+connect_lobby` | 连接到 Steam 大厅 |

### 服务器参数

| 参数 | 描述 |
|------|------|
| `-config <文件>` | 使用指定的配置文件 |
| `-port <数字>` | 监听端口（默认 7777） |
| `-players` / `-maxplayers` | 最大并发玩家数 |
| `-pass` / `-password` | 服务器访问密码 |
| `-motd <文本>` | 每日消息（Message of the Day） |
| `-world <路径>` | 要加载的世界文件并自动启动 |
| `-autocreate <数字>` | 自动生成世界（1=小型，2=中型，3=大型） |
| `-banlist <路径>` | 封禁列表文件位置 |
| `-worldname <名称>` | 自动创建世界时的世界名称 |
| `-secure` | 添加反作弊保护 |
| `-noupnp` | 禁用 UPnP 端口映射 |
| `-steam` | 启用 Steam 功能 |
| `-ip <地址>` | 监听 IP 地址 |
| `-seed <种子>` | 用于自动创建的世界种子 |

---

## 配置文件参数

配置文件名称：`serverconfig.txt`

### 核心参数

| 参数 | 描述 | 示例值 |
|------|------|--------|
| `world=` | 指定世界文件路径 | `C:\Users\用户名\Documents\MyGames\Terraria\Worlds\世界名.wld` |
| `autocreate=` | 创建新世界 | `1`（小型）/ `2`（中型）/ `3`（大型） |
| `seed=` | 世界种子（用于 autocreate） | 任意字符串或数字 |
| `worldname=` | 世界名称（用于 autocreate） | `我的世界` |
| `maxplayers=` | 玩家限制 | `1-255`（默认 `8`） |
| `port=` | 服务器端口 | `7777`（默认） |
| `password=` | 服务器密码 | 留空表示无密码 |
| `motd=` | 每日消息 | `欢迎来到我的服务器！` |
| `difficulty=` | 世界难度 | `0`（经典）/ `1`（专家）/ `2`（大师）/ `3`（旅程） |
| `secure=` | 启用作弊保护 | `0`（禁用）/ `1`（启用） |
| `priority=` | 进程优先级 | `0`（实时）/ `1`（高）/ `2`（高于正常）/ `3`（正常）/ `4`（低于正常）/ `5`（空闲） |
| `npcstream=` | NPC 同步频率 | `60`（默认），数值越低同步越精确但带宽消耗越高 |
| `noupnp` | 禁用 UPnP | `0`（启用 UPnP）/ `1`（禁用 UPnP） |

### 高级参数

| 参数 | 描述 | 默认值 |
|------|------|--------|
| `language=` | 服务器语言 | `en-US` |
| `worldpath=` | 世界文件路径 | 默认世界文件夹 |
| `banlist=` | 封禁列表文件路径 | `banlist.txt` |
| `ucf=` | 用户创建的功能设置 | - |
| `forcepriority=` | 强制进程优先级 | - |

### 配置文件注释

在 Terraria 配置文件中，使用 `#` 符号注释行：

```ini
# 这是一个注释
maxplayers=16    # 这也是注释
```

---

## 连接方式

### 从主机计算机连接
使用 `localhost` 或主机 IP 地址。

### 局域网连接
输入服务器计算机的 **IPv4 地址**。

### 通过互联网连接
使用路由器的**外部 IP 地址**（需要端口转发）。

**查找外部 IP**：访问 https://www.whatismyip.com/

---

## 故障排除

### 服务器无法启动

**原因**：
- 配置文件中有拼写错误
- 文件路径不正确

**解决方法**：
1. 检查 `serverconfig.txt` 中的所有参数
2. 验证世界文件路径是否存在
3. 确保端口未被占用

### 连接问题

**原因**：
- IP 地址或端口不正确
- 防火墙阻止连接
- 端口转发未正确配置

**解决方法**：
1. 确认 IP 和端口正确无误
2. 检查防火墙规则（允许 TerrariaServer.exe 或端口 7777）
3. 验证路由器端口转发设置

**Windows 防火墙示例**：
```
控制面板 → Windows Defender 防火墙 → 高级设置 → 入站规则 → 新建规则
选择"程序" → 浏览到 TerrariaServer.exe → 允许连接
```

### 保存问题

**重要**：服务器仅在黎明时自动保存（每 24 分钟游戏时间）。

**解决方法**：
- 在关闭服务器前，在控制台输入 `save` 命令
- 等待 "Saving world..." 消息出现并完成
- 这可以防止物品丢失

---

## 服务器控制台命令

### 常用命令

| 命令 | 描述 |
|------|------|
| `help` | 显示可用命令列表 |
| `playing` | 显示当前在线玩家列表 |
| `clear` | 清除控制台 |
| `exit` | 关闭服务器 |
| `exit-nosave` | 关闭服务器而不保存 |
| `save` | 保存游戏世界 |
| `kick <玩家名>` | 踢出玩家 |
| `ban <玩家名>` | 封禁玩家 |
| `password` | 显示当前密码 |
| `password <新密码>` | 更改服务器密码 |
| `version` | 显示 Terraria 版本号 |
| `time` | 显示游戏时间 |
| `port` | 显示服务器端口 |
| `maxplayers` | 显示最大玩家数 |
| `say <消息>` | 向所有玩家发送消息（黄色文本，前缀 `<server>`） |
| `motd` | 显示每日消息 |
| `motd <新消息>` | 更改每日消息 |
| `dawn` | 将时间设置为 4:30 AM（黎明） |
| `noon` | 将时间设置为 12:00 PM（中午） |
| `dusk` | 将时间设置为 7:30 PM（黄昏） |
| `midnight` | 将时间设置为 12:00 AM（午夜） |
| `settle` | 稳定所有水和熔岩 |

---

## 附加资源

- **官方服务器下载**：https://terraria.org/
- **发布服务器**：
  - https://forums.terraria.org/
  - https://tserverweb.com/
- **Steam 多人游戏**：可通过 Steam 好友系统直接连接（无需端口转发）

---

## 版本信息

本文档基于 Terraria 1.4.4+ 版本编写，适用于 2025 年最新服务器设置。

## 参考来源

- [Terraria Wiki - Server Guide](https://terraria.wiki.gg/wiki/Guide:Setting_up_a_Terraria_server)
- [Terraria Wiki - Command-line Parameters](https://terraria.wiki.gg/wiki/Command-line_parameters)
