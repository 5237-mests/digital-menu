# Deployment Guide

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Local Preparation](#local-preparation)
4. [cPanel Setup](#cpanel-setup)
5. [Environment Configuration](#environment-configuration)
6. [Database Migration](#database-migration)
7. [Deployment](#deployment)
8. [Verification](#verification)
9. [Troubleshooting](#troubleshooting)

---

## Overview

This restaurant ordering system is a monorepo (pnpm workspaces) containing:
- **API**: NestJS backend serving the web app and API routes
- **Web**: SvelteKit frontend (built as static files)
- **Shared**: TypeScript types, constants, and utilities

The deployment bundles everything into a single Node.js application on cPanel.

### Architecture
```
Client Request → cPanel Node.js App (API + Static Web)
                 ↓
              NestJS Backend
                 ↓
              MySQL Database
```

---

## Prerequisites

### Local Machine
- Node.js >= 22.0.0
- pnpm >= 9.0.0

### cPanel Server
- Node.js support enabled (request from hosting provider)
- MySQL database created
- Subdomain created (e.g., `app.yourdomain.com`)

### SSH Access (Recommended)
For running migrations and debugging, request SSH access from your host.

---

## Local Preparation

### 1. Install Dependencies
```bash
cd /path/to/restaurant-system
pnpm install
```

### 2. Build the Project
```bash
pnpm build
```

This generates:
- `apps/api/dist/` — Compiled NestJS backend
- `apps/web/build/` — Compiled static web app
- `node_modules/` — All dependencies

### 3. Verify Build
```bash
# Check that both builds exist
ls apps/api/dist/main.js
ls apps/web/build/index.html
```

### 4. Install Production-Only Dependencies
```bash
pnpm install --prod
```

This removes dev dependencies, reducing upload size by ~70%.

### 5. Prepare Upload Package
Create a deployment folder:
```bash
mkdir deployment
cp -r apps/api/dist deployment/
cp -r apps/web/build deployment/
cp -r packages/shared-* deployment/
cp -r node_modules deployment/
cp package.json pnpm-lock.yaml deployment/
```

Or use your preferred method (Git, SFTP, ZIP).

---

## cPanel Setup

### 1. Create Subdomain

1. Login to cPanel
2. Go to **Addon Domains** or **Subdomains**
3. Create subdomain: `app` pointing to `/home/youruser/public_html/app`
4. Wait for DNS propagation (~5-10 minutes)

### 2. Enable Node.js

1. Go to **Node.js & npm** in cPanel
2. Create a new **Node.js App**:
   - **Node.js version**: 22.x
   - **Application mode**: Development or Production
   - **Application root**: `/home/youruser/app`
   - **Application startup file**: `apps/api/dist/main.js`
   - **Application URL**: Select your subdomain
3. Click **Create**

### 3. Access SSH (Optional but Recommended)

If available, SSH into your server:
```bash
ssh youruser@yourdomain.com
cd ~/app
```

---

## Environment Configuration

### 1. Create `.env` File

In cPanel file manager or via SSH, create `~/app/.env`:

```env
# Server
NODE_ENV=production
API_PORT=3001

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# Optional: CORS (if frontend is separate)
# CORS_ORIGIN=https://app.yourdomain.com
```

**Get these values from**:
- cPanel → Databases → MySQL Databases
- cPanel → MySQL Accounts

### 2. Verify `.env` Permissions

```bash
chmod 600 .env  # Only your user can read it
```

### 3. Add to cPanel Node.js App

In cPanel **Node.js & npm**, edit your app and add **Environment Variables**:
```
NODE_ENV=production
API_PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_pass
DB_NAME=your_db_name
```

---

## Database Migration

### Option A: SSH Access (Recommended)

```bash
ssh youruser@yourdomain.com
cd ~/app
node database/scripts/migrate.mjs
node database/scripts/seed.mjs
```

### Option B: Manual via phpMyAdmin

1. cPanel → **phpMyAdmin**
2. Select your database
3. Go to **Import** tab
4. Upload these files in order:
   - `database/migrations/001_initial_schema.sql`
   - `database/migrations/002_auth_refresh_tokens.sql`
   - `database/migrations/003_settings.sql`
5. Click **Import**
6. Repeat for seed files:
   - `database/seeds/001_initial_data.sql`
   - `database/seeds/002_settings.sql`

### Verify Migration

In phpMyAdmin, check that these tables exist:
- `users`
- `categories`
- `menu_items`
- `orders`
- `tables`
- `settings`

---

## Deployment

### 1. Upload Files to Server

**Via cPanel File Manager**:
1. Go to **File Manager** → `/home/youruser/app`
2. Upload your deployment package (ZIP recommended)
3. Extract all files

**Via SFTP** (if available):
```bash
sftp youruser@yourdomain.com
cd app
put -r ./deployment/* .
```

**Via SSH + Git** (if Git available):
```bash
ssh youruser@yourdomain.com
cd ~/app
git clone https://github.com/yourrepo/restaurant-system.git
cd restaurant-system
pnpm install --prod
pnpm build
```

### 2. Upload Required Directories

Ensure these exist in `~/app`:
```
~/app/
├── apps/
│   ├── api/
│   │   ├── dist/              ← NestJS compiled code
│   │   └── src/               ← Optional, for reference
│   └── web/
│       ├── build/             ← Static web app
│       └── src/               ← Optional
├── database/
│   ├── scripts/
│   ├── migrations/
│   └── seeds/
├── packages/
│   └── shared-*/
├── node_modules/              ← All production dependencies
├── package.json
├── pnpm-lock.yaml
└── .env                        ← Environment variables
```

### 3. Restart Node.js App

In cPanel **Node.js & npm**:
1. Find your app
2. Click **Restart**

Or via SSH:
```bash
pm2 restart app
# or
pkill -f "node.*main.js"
```

---

## Verification

### 1. Check if App is Running

Visit: `https://app.yourdomain.com`

You should see the restaurant app interface.

### 2. Test API Endpoint

```bash
curl https://app.yourdomain.com/health
```

Expected response:
```json
{
  "status": "ok"
}
```

### 3. Check Logs

**In cPanel**:
- Node.js & npm → Select app → View Logs

**Via SSH**:
```bash
tail -f ~/app/logs/nodejs_app.log
# or
pm2 logs
```

### 4. Verify Database Connection

Try logging in with test credentials set during seeding.

### 5. Test WebSocket (Real-time Updates)

Open browser DevTools → Network tab → Filter for "WS":
1. Refresh app
2. You should see a WebSocket connection to `wss://app.yourdomain.com/socket.io`

---

## Troubleshooting

### App Not Starting

**Check logs**:
```bash
tail -f ~/app/logs/nodejs_app.log
```

**Common issues**:
- **Port already in use**: Change `API_PORT` in `.env`
- **Missing dependencies**: Run `pnpm install --prod` again
- **Wrong Node.js version**: Check with `node -v` (need >= 22.0.0)

### Database Connection Error

**Verify credentials**:
```bash
mysql -h localhost -u db_user -p db_name
```

**Check environment variables**:
```bash
cat .env
```

**Ensure migrations ran**:
```bash
mysql -h localhost -u db_user -p db_name -e "SHOW TABLES;"
```

### Static Files Not Loading

**Verify web build exists**:
```bash
ls -la ~/app/apps/web/build/index.html
```

**Rebuild web app**:
```bash
cd ~/app
pnpm --filter @restaurant/web build
```

### CORS/API Errors

**Check CORS in API**:
Edit `apps/api/src/main.ts`:
```typescript
app.enableCors({
  origin: true, // Allow all origins
  credentials: true
});
```

### WebSocket Not Working

**Ensure Socket.IO is connected**:
1. Open DevTools → Console
2. Look for connection messages
3. Check firewall allows WebSocket

**Test with**:
```javascript
// Browser console
const socket = io('https://app.yourdomain.com', {
  transports: ['websocket']
});
socket.on('connect', () => console.log('Connected'));
```

### Performance Issues

- Increase Node.js memory in cPanel settings
- Enable cPanel gzip compression
- Use CDN for static assets if available

---

## Maintenance

### Regular Tasks

- **Monitor logs** weekly for errors
- **Backup database** regularly via cPanel
- **Update Node.js** when new LTS versions available

### Update Deployment

To deploy new versions:

1. **Locally**:
   ```bash
   git pull
   pnpm install
   pnpm build
   pnpm install --prod
   ```

2. **Upload** new `apps/api/dist` and `apps/web/build`

3. **Restart** Node.js app in cPanel

---

## Support

For issues:
- Check **Node.js logs** in cPanel
- Verify **environment variables** are set
- Ensure **database credentials** are correct
- Check **SSH access** is working

---

## Appendix: Quick Reference

```bash
# Local
pnpm install
pnpm build
pnpm install --prod

# Database (SSH)
node database/scripts/migrate.mjs
node database/scripts/seed.mjs

# Test endpoints
curl https://app.yourdomain.com/health
curl https://app.yourdomain.com/auth/login

# Server files
~/app/                      # Root
~/app/.env                  # Secrets
~/app/logs/nodejs_app.log   # Logs
```

