# Deployment Guide

Hướng dẫn deploy Manga Reader lên VPS sử dụng Docker + Cloudflare Tunnel.

## Prerequisites

- VPS với Ubuntu 20.04+ (2GB RAM minimum)
- Docker & Docker Compose installed
- Domain đã trỏ về Cloudflare
- Cloudflare account (Free tier OK)

## Quick Start

```bash
# 1. Clone repository
git clone <repo-url> ~/manga-reader-sd
cd ~/manga-reader-sd

# 2. Tạo .env file
cp .env.example .env
nano .env  # Edit với values production

# 3. Build & Run
docker compose up -d --build

# 4. Kiểm tra logs
docker compose logs -f
```

---

## Step-by-Step Guide

### 1. Cài đặt Docker trên VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker --version
docker compose version
```

### 2. Clone Project

```bash
cd ~
git clone <your-repo-url> manga-reader-sd
cd manga-reader-sd
```

### 3. Tạo Cloudflare Tunnel

#### Option A: Dashboard (Recommended)

1. Vào [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com)
2. **Networks → Tunnels → Create a tunnel**
3. Chọn **Cloudflared** connector
4. Đặt tên tunnel (vd: `manga-reader`)
5. Copy **TUNNEL_TOKEN**

#### Option B: CLI

```bash
# Install cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# Login & create tunnel
cloudflared tunnel login
cloudflared tunnel create manga-reader
```

### 4. Cấu hình Environment

Tạo file `.env`:

```bash
nano .env
```

```env
# ================================
# Production Environment
# ================================

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api/v1

# Site URL (for SEO, canonical URLs)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Cloudflare Tunnel Token
CLOUDFLARE_TUNNEL_TOKEN=eyJhIjoixxxxxxxxx...

# Optional: Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### 5. Cấu hình Cloudflare Public Hostname

Trong **Zero Trust Dashboard → Networks → Tunnels → [Your Tunnel] → Public Hostname**:

| Field     | Value                      |
| --------- | -------------------------- |
| Subdomain | (để trống cho root domain) |
| Domain    | yourdomain.com             |
| Path      | (để trống)                 |
| Type      | HTTP                       |
| URL       | `manga-reader:3000`        |

> **Important:** URL phải là `manga-reader:3000` (container name), KHÔNG phải `localhost:3000`

Thêm hostname cho `www` nếu cần:
| Field | Value |
|-------|-------|
| Subdomain | www |
| Domain | yourdomain.com |
| Type | HTTP |
| URL | `manga-reader:3000` |

### 6. Build & Deploy

```bash
# Build và chạy
docker compose up -d --build

# Kiểm tra status
docker compose ps

# Xem logs
docker compose logs -f

# Chỉ xem logs của app
docker compose logs -f manga-reader
```

### 7. Verify Deployment

- Mở browser: `https://yourdomain.com`
- Check Cloudflare Dashboard: Tunnel status = **HEALTHY**

---

## Docker Commands Reference

```bash
# Start containers
docker compose up -d

# Stop containers
docker compose down

# Rebuild và restart
docker compose up -d --build

# Xem logs realtime
docker compose logs -f

# Xem logs của container cụ thể
docker compose logs -f manga-reader
docker compose logs -f cloudflared

# Restart container
docker compose restart manga-reader

# Xem container status
docker compose ps

# Xóa tất cả (including volumes)
docker compose down -v

# Prune unused images
docker image prune -a
```

---

## Update Deployment

Khi có code changes:

```bash
cd ~/manga-reader-sd

# Pull latest code
git pull origin main

# Rebuild và restart
docker compose up -d --build

# Verify
docker compose logs -f manga-reader
```

---

## Troubleshooting

### 1. Container không start

```bash
# Xem logs chi tiết
docker compose logs manga-reader

# Kiểm tra build
docker compose build --no-cache manga-reader
```

### 2. Cloudflare Tunnel connection refused

**Lỗi:** `dial tcp [::1]:3000: connect: connection refused`

**Fix:** Trong Cloudflare Dashboard, đổi URL từ `localhost:3000` → `manga-reader:3000`

### 3. Environment variables không apply

`NEXT_PUBLIC_*` variables được bundle lúc build. Cần rebuild:

```bash
docker compose down
docker compose up -d --build
```

### 4. Out of memory khi build

Thêm swap space:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Rebuild
docker compose up -d --build
```

### 5. Permission denied

```bash
sudo chown -R $USER:$USER ~/manga-reader-sd
```

### 6. Port 3000 already in use

```bash
# Kiểm tra process
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Edge                          │
│  • SSL/TLS termination                                      │
│  • DDoS protection                                          │
│  • CDN caching                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ (Encrypted tunnel)
┌─────────────────────────────────────────────────────────────┐
│                         VPS                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Docker Network (manga-network)          │   │
│  │                                                      │   │
│  │  ┌──────────────┐         ┌──────────────────────┐  │   │
│  │  │ cloudflared  │ ──────▶ │   manga-reader       │  │   │
│  │  │              │         │   (Next.js:3000)     │  │   │
│  │  └──────────────┘         └──────────────────────┘  │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Notes

1. **Không commit `.env` file** - Đã có trong `.gitignore`
2. **Tunnel Token bảo mật** - Không share publicly
3. **Cloudflare tự động SSL** - Không cần cấu hình certificate
4. **Không expose port 3000** - Chỉ dùng internal Docker network

---

## File Reference

| File                 | Purpose                                  |
| -------------------- | ---------------------------------------- |
| `Dockerfile`         | Multi-stage build cho Next.js standalone |
| `docker-compose.yml` | Service orchestration                    |
| `.dockerignore`      | Exclude files từ Docker build            |
| `.env`               | Environment variables (không commit)     |
| `.env.example`       | Template cho `.env`                      |
