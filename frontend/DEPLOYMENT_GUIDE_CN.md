# 项目部署指南 (Deployment Guide)

本指南介绍如何从零开始部署 Ticket System 的前后端环境。

## 1. 准备工作

确保你的开发环境已安装以下工具：
- [Node.js](https://nodejs.org/) (v16+)
- [Python](https://www.python.org/) (v3.9+)
- [Git](https://git-scm.com/)

---

## 2. 后端部署 (Backend)

后端采用 Django + Django REST Framework。

### 2.1 拉取代码
由于后端是独立的仓库，请在除了前端项目之外的目录拉取：

```bash
# 假设创建一个 workspace 目录
mkdir ticket-workspace
cd ticket-workspace

# 拉取后端代码
git clone https://github.com/csqccccoder/SC6105_backend_collect backend
cd backend
```

### 2.2 环境配置
1. 创建虚拟环境（推荐）：
   ```bash
   python -m venv venv
   # Windows
   .\venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```

2. 安装依赖：
   ```bash
   pip install -r requirements.txt
   ```

3. 配置及数据库初始化：
   - 确保你已安装 PostgreSQL 或使用 SQLite（默认）。
   - 配置环境变量（如果项目有 `.env` 需求，请参考后端 README）。
   - 必须配置 **Google OAuth Client ID** 以支持前端 SSO。

   ```bash
   # 数据库迁移
   python manage.py migrate
   
   # 创建超级管理员（可选）
   python manage.py createsuperuser
   ```

### 2.3 启动服务
```bash
python manage.py runserver 0.0.0.0:8000
```
后端默认运行在 `http://localhost:8000`。

---

## 3. 前端部署 (Frontend)

前端采用 Vue 3 + TypeScript + Vite。

### 3.1 拉取代码
```bash
# 回到 workspace 目录
cd ..

# 拉取前端代码
git clone https://github.com/WuDuHuange/Ticket-frontend.git frontend
cd frontend/ticket-system
```

### 3.2 环境配置
在 `ticket-system` 根目录下创建 `.env` 文件（可复制 `.env.example`）：

```ini
# .env 文件内容

# 后端接口地址
VITE_API_BASE_URL=http://localhost:8000/api

# Google OAuth Client ID (必须与后端配置的一致，且在Google Cloud控制台配置了 http://localhost:5173 来源)
VITE_GOOGLE_CLIENT_ID=你的_GOOGLE_CLIENT_ID
```

### 3.3 安装依赖并启动
```bash
npm install
npm run dev
```
前端默认运行在 `http://localhost:5173`。

---

## 4. Google SSO 配置特别说明

为了使登录功能正常工作，你需要：

1. 访问 [Google Cloud Console](https://console.cloud.google.com/apis/credentials)。
2. 创建或编辑 **OAuth 2.0 Client ID**。
3. **已获授权的 JavaScript 来源** 必须包含：
   - `http://localhost:5173` (前端开发地址)
   - `http://localhost:8000` (如果后端Swagger或测试页面需要)
4. 将生成的 Client ID 填入前端 `.env` 和后端的配置中。

## 5. 联调测试

1. 启动后端 (port 8000)。
2. 启动前端 (port 5173)。
3. 浏览器访问 `http://localhost:5173`。
4. 点击 "Sign in with Google" 进行登录。
