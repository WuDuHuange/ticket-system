# IT Service Ticket System - 部署指南

## 系统概述

这是一个完整的 IT 服务工单系统，包含前端和后端两个部分：

- **前端仓库**: https://github.com/WuDuHuange/Ticket-frontend
- **后端仓库**: https://github.com/csqccccoder/SC6105_backend_collect

## 环境要求

### 后端
- Python 3.10+
- pip (Python 包管理器)
- SQLite (默认) 或 PostgreSQL/MySQL

### 前端
- Node.js 18+
- npm 或 pnpm

---

## 一、后端部署

### 1. 克隆代码

```bash
git clone https://github.com/csqccccoder/SC6105_backend_collect.git
cd SC6105_backend_collect
```

### 2. 创建虚拟环境

**Windows:**
```bash
python -m venv venv
.\venv\Scripts\activate
```

**Linux/macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. 安装依赖

```bash
pip install -r requirements.txt
```

### 4. 配置环境变量（可选）

创建 `.env` 文件或设置环境变量：

```bash
# 调试模式（生产环境设为 False）
DEBUG=True

# 密钥（生产环境请更换）
SECRET_KEY=your-secret-key-here

# 数据库配置（默认使用 SQLite）
# DATABASE_URL=postgres://user:password@localhost:5432/dbname
```

### 5. 数据库迁移

```bash
python manage.py migrate
```

这会自动创建：
- 用户表和权限
- 工单表和关联表
- **默认 SLA 配置**（4个优先级的响应和解决时间）
- **默认工单分类**（网络、硬件、软件、账户、邮件、安全、打印、其他）

### 6. 创建超级管理员（可选）

```bash
python manage.py createsuperuser
```

### 7. 启动后端服务

**开发模式:**
```bash
python manage.py runserver 8000
```

**生产模式 (使用 Gunicorn):**
```bash
pip install gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

后端 API 地址: `http://localhost:8000/api/`

---

## 二、前端部署

### 1. 克隆代码

```bash
git clone https://github.com/WuDuHuange/Ticket-frontend.git
cd Ticket-frontend
```

### 2. 安装依赖

```bash
npm install
# 或
pnpm install
```

### 3. 配置环境变量

创建 `.env` 文件：

```bash
# 后端 API 地址
VITE_API_BASE_URL=http://localhost:8000/api

# Google OAuth Client ID (用于 SSO 登录)
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

**重要**: `VITE_API_BASE_URL` 必须指向正确的后端地址！

### 4. 开发模式运行

```bash
npm run dev
```

前端开发服务器: `http://localhost:5173`

### 5. 生产构建

```bash
npm run build
```

构建产物在 `dist/` 目录下。

### 6. 部署静态文件

将 `dist/` 目录部署到任意静态文件服务器：
- Nginx
- Apache
- Vercel
- Netlify
- 腾讯云 COS / 阿里云 OSS

**Nginx 配置示例:**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # 前端路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理（如果前后端不同域）
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 三、快速验证

### 1. 检查后端

```bash
# 检查 API 是否正常
curl http://localhost:8000/api/auth/me

# 应返回 401 未授权（正常）
```

### 2. 检查数据库初始数据

```bash
cd backend
python manage.py shell -c "
from tickets.models import SLAConfig, TicketCategory
print('SLA Configs:', SLAConfig.objects.count())
print('Categories:', TicketCategory.objects.count())
"
```

预期输出：
```
SLA Configs: 4
Categories: 8
```

### 3. 登录测试

1. 打开前端: `http://localhost:5173`
2. 使用 Google SSO 登录或创建的超级管理员账户
3. 进入 Dashboard 查看统计数据

---

## 四、默认数据说明

### SLA 配置（自动创建）

| 优先级 | 响应时间 | 解决时间 |
|--------|----------|----------|
| Low    | 24 小时  | 72 小时  |
| Medium | 8 小时   | 24 小时  |
| High   | 4 小时   | 8 小时   |
| Urgent | 1 小时   | 4 小时   |

### 工单分类（自动创建）

- Network（网络问题）
- Hardware（硬件问题）
- Software（软件问题）
- Account（账户问题）
- Email（邮件问题）
- Security（安全问题）
- Printing（打印问题）
- Other（其他）

---

## 五、常见问题

### Q1: 前端无法连接后端

1. 检查 `.env` 中的 `VITE_API_BASE_URL` 是否正确
2. 检查后端是否正在运行
3. 检查是否有 CORS 问题（后端已配置允许所有来源）

### Q2: 数据库迁移失败

```bash
# 重置迁移
python manage.py migrate --fake-initial
# 或完全重建
rm db.sqlite3
python manage.py migrate
```

### Q3: Google SSO 登录失败

1. 确保配置了正确的 `VITE_GOOGLE_CLIENT_ID`
2. 在 Google Cloud Console 中添加授权的 JavaScript 来源和重定向 URI

### Q4: Dashboard 数据不显示

1. 确保已创建一些测试工单
2. 检查浏览器控制台是否有 API 错误
3. 确认用户角色是 admin 或 manager（普通用户只能看到自己的工单）

---

## 六、技术栈

### 前端
- Vue.js 3 + TypeScript
- Element Plus UI
- Pinia 状态管理
- Vue Router
- Vue I18n (中英文支持)
- Vite 构建工具

### 后端
- Django 5.x
- Django REST Framework
- SQLite / PostgreSQL
- JWT 认证
- Google OAuth 2.0

---

## 七、联系方式

如有问题，请提交 Issue 到对应的 GitHub 仓库。
