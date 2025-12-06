# 🚀 CRM Application - Production Deployment Guide

Your CRM application is ready to deploy to production at `http://165.232.54.109/crm`

## Quick Start (30 seconds)

```bash
# From project root directory
./deploy.sh 165.232.54.109 root
```

Then open: **http://165.232.54.109/crm**

## What's Included

### 📦 Deployment Files
- **`deploy.sh`** - Automated deployment script (executable)
- **`nginx-crm.conf`** - Nginx reverse proxy configuration
- **`crm-backend.service`** - Systemd service for backend API
- **`.env.production`** - Production environment template

### 📚 Documentation
- **`QUICK_START_DEPLOYMENT.md`** - 2-minute quick reference
- **`DEPLOYMENT.md`** - Complete deployment guide with troubleshooting
- **`MANUAL_DEPLOYMENT.md`** - Step-by-step manual instructions
- **`DEPLOYMENT_CHECKLIST.md`** - Pre-deployment verification

### ⚙️ Configuration
- **`vite.config.js`** - Optimized for `/crm` path deployment
- **`package.json`** - Updated with build dependencies

## Deployment Architecture

```
┌──────────────────────────────────────┐
│  Browser: http://165.232.54.109/crm  │
└────────────────┬─────────────────────┘
                 │
         ┌───────▼────────┐
         │  Nginx (Port 80) │ Reverse Proxy
         └───────┬────────┘
                 │
      ┌──────────┴──────────┐
      │                     │
┌─────▼──────┐      ┌──────▼─────┐
│  React SPA │      │   Backend   │
│  /crm path │      │  /api proxy │
│  Port 3000 │      │  Port 5000  │
└────────────┘      └─────────────┘
```

## Features

✅ **Frontend (React)**
- React 19.2.0 with Vite 7.2.5
- Tailwind CSS v4 for styling
- Responsive UI with lucide-react icons
- SPA with React Router capabilities
- AI insights components with refresh buttons

✅ **Backend (Node.js)**
- Express.js API server
- SQLite3 database
- 4 AI analysis endpoints
- CORS-enabled for cross-origin requests
- Production-ready with systemd service

✅ **Infrastructure**
- Nginx reverse proxy with security headers
- GZIP compression enabled
- Static file caching (1 year for assets)
- Auto-restart on server reboot
- Comprehensive logging

## Prerequisites

Before deploying, verify:

```bash
# Local machine
✓ npm run build  # Frontend builds successfully
✓ git status     # Clean working directory

# Remote server (ssh root@165.232.54.109)
✓ node -v        # Node.js 18+
✓ npm -v         # npm 9+
✓ nginx -v       # nginx 1.18+
✓ git --version  # git installed
```

## Deployment Steps

### Automated (Recommended)

```bash
cd /Users/gp/react-work/jubilant-octo-broccoli
./deploy.sh 165.232.54.109 root
```

**What happens:**
1. ✅ Builds React frontend locally (`npm run build`)
2. ✅ Uploads dist/, backend/, and config files via scp
3. ✅ Installs backend dependencies on server
4. ✅ Configures nginx as reverse proxy
5. ✅ Sets up backend service to auto-start
6. ✅ Verifies deployment is working

**Duration:** 2-3 minutes

### Manual Deployment

For step-by-step instructions, see `MANUAL_DEPLOYMENT.md`

## Verification

After deployment completes:

```bash
# Check services
ssh root@165.232.54.109 "sudo systemctl status crm-backend nginx"

# Test backend API
curl http://165.232.54.109/api/customers

# Test in browser
open http://165.232.54.109/crm
```

## Production URLs

| Component | URL |
|-----------|-----|
| Frontend | http://165.232.54.109/crm |
| API | http://165.232.54.109/api |
| Backend Service | http://127.0.0.1:5000 |
| Health Check | http://165.232.54.109/health |

## Logs & Monitoring

View application logs:

```bash
# Backend service logs (real-time)
ssh root@165.232.54.109 "sudo journalctl -u crm-backend -f"

# Nginx access logs (real-time)
ssh root@165.232.54.109 "sudo tail -f /var/log/nginx/crm-access.log"

# Nginx error logs (real-time)
ssh root@165.232.54.109 "sudo tail -f /var/log/nginx/crm-error.log"
```

## Service Management

```bash
# View service status
ssh root@165.232.54.109 "sudo systemctl status crm-backend"

# Restart backend
ssh root@165.232.54.109 "sudo systemctl restart crm-backend"

# Stop backend
ssh root@165.232.54.109 "sudo systemctl stop crm-backend"

# Start backend
ssh root@165.232.54.109 "sudo systemctl start crm-backend"

# View service logs
ssh root@165.232.54.109 "sudo journalctl -u crm-backend -n 50"
```

## Updating the Application

When you need to update after code changes:

```bash
# Build locally
npm run build

# Redeploy
./deploy.sh 165.232.54.109 root

# Verify
curl http://165.232.54.109/api/customers
```

## Troubleshooting

| Issue | Command |
|-------|---------|
| Backend won't start | `sudo journalctl -u crm-backend -n 100` |
| Nginx errors | `sudo nginx -t && sudo systemctl restart nginx` |
| API returning 404 | `curl http://127.0.0.1:5000/api/customers` |
| Frontend blank | Check `/var/www/crm-app/dist/` exists |
| Port conflicts | `sudo lsof -i :5000` or `sudo lsof -i :80` |

See `DEPLOYMENT.md` for detailed troubleshooting.

## SSL/HTTPS (Optional)

For HTTPS with Let's Encrypt:

```bash
ssh root@165.232.54.109 "
  sudo apt-get update
  sudo apt-get install -y certbot python3-certbot-nginx
  sudo certbot --nginx -d 165.232.54.109
"
```

## Environment Variables

**Frontend** - Set in vite.config.js:
- `VITE_API_BASE_URL=http://165.232.54.109/api`

**Backend** - Set in `.env` or systemd service:
- `NODE_ENV=production`
- `PORT=5000`
- `DATABASE_URL=/var/www/crm-app/backend/crm.db`

## Database

SQLite3 database automatically initialized at:
```
/var/www/crm-app/backend/crm.db
```

Backup location:
```
/var/backups/crm/
```

## Security Considerations

✅ **Enabled:**
- GZIP compression for all responses
- Cache-Control headers for static assets
- X-Frame-Options (SAMEORIGIN)
- X-Content-Type-Options (nosniff)
- X-XSS-Protection headers
- Hidden file access denied
- Request size limits (10MB)

🔐 **Recommended:**
- Enable HTTPS with SSL/TLS certificate
- Configure firewall (ufw) rules
- Set up automated backups
- Monitor resource usage
- Implement rate limiting

## Performance

**Frontend Build Size:**
- HTML: 0.46 kB
- CSS: 30.85 kB (gzipped: 6.99 kB)
- JS: 243.14 kB (gzipped: 71.63 kB)
- Total: ~78 kB gzipped

**Network:**
- Compression enabled for all content types
- Asset caching: 1 year for versioned files
- Static file serving via nginx

## Documentation Reference

| Document | Purpose |
|----------|---------|
| `QUICK_START_DEPLOYMENT.md` | 2-minute deployment reference |
| `DEPLOYMENT.md` | Complete guide with advanced topics |
| `MANUAL_DEPLOYMENT.md` | Manual step-by-step instructions |
| `DEPLOYMENT_CHECKLIST.md` | Pre/post deployment verification |
| `deploy.sh` | Automated deployment script |

## Support

For issues, check:
1. Backend logs: `sudo journalctl -u crm-backend -n 50`
2. Nginx logs: `sudo tail -f /var/log/nginx/crm-error.log`
3. Test API: `curl http://127.0.0.1:5000/api/customers`
4. Check processes: `sudo lsof -i :5000` and `sudo lsof -i :80`

## Git History

All deployment files are version controlled:

```bash
git log --oneline | head -10
# See deployment commits and changes
```

---

**Ready to deploy?**

```bash
./deploy.sh 165.232.54.109 root
```

Then visit: **http://165.232.54.109/crm** ✨
