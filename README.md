# WeRSS - 微信公众号订阅助手

[中文](README.zh-CN.md) | [English](ReadMe.md)

一个用于订阅和管理微信公众号内容的工具，提供 RSS 订阅功能与 Web 管理界面。

## 功能特性

- 微信公众号内容抓取和解析
- RSS 订阅生成与管理
- 定时自动更新内容
- 自定义通知渠道
- 支持导出 md/docx/pdf/json 格式
- 支持 API/WebHook 调用

## 技术架构

- 后端: Python + FastAPI
- 前端: Vue 3 + Vite
- 数据库: SQLite (默认) / MySQL / PostgreSQL

## 二次开发部署（推荐流程）

### 1. 环境要求

- Docker
- Docker Compose
- Node.js >= 20（用于构建前端静态资源）

### 2. 构建前端静态资源

```bash
bash web_ui/build.sh
```

说明: 前端构建产物会用于后端静态页面服务。

### 3. 启动服务（Docker Compose）

本项目提供两个 compose 文件:

- `docker-compose.yml`: 常规运行模式
- `docker-compose.dev.yml`: 开发挂载模式（代码挂载，便于迭代）

常规模式:

```bash
docker compose up -d --build
```

开发挂载模式:

```bash
docker compose -f docker-compose.dev.yml up -d
```

启动后访问:

```text
http://<你的IP>:8001
```

## 开发说明

### 本地后端运行（非容器）

```bash
pip install -r requirements.txt
python main.py -job True -init True
```

### 环境变量

核心环境变量示例（建议在 compose 中配置）:

- `DB`：数据库连接字符串，默认 `sqlite:///data/we_mp_rss.db`
- `USERNAME`：登录用户名
- `PASSWORD`：登录密码
- `GATHER.CONTENT`：是否抓取正文，默认 `True`
- `AUTO_RELOAD`：开发模式热重载（dev compose 可用）

## 使用说明

1. 启动服务后访问管理界面。
2. 使用微信扫码授权。
3. 添加公众号订阅并生成 RSS 链接。
4. 按需启用定时任务自动抓取。
